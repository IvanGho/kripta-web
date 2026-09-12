import { timingSafeEqual } from "node:crypto";
import { generarPropuesta } from "@/app/lib/automatizacion/gemini";
import {
  buscarTrabajo,
  cambiarEstado,
  contarTrabajosRecientes,
  guardarBorrador,
  registrarUpdateTelegram,
  ultimoTrabajo,
} from "@/app/lib/automatizacion/repositorio";
import { enviarTexto, responderCallback, usuarioAutorizado } from "@/app/lib/automatizacion/telegram";
import { iniciarVideoVeo } from "@/app/lib/automatizacion/veo";
import { normalizarTema } from "@/app/lib/automatizacion/tipos";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type UsuarioTelegram = { id?: number };
type ChatTelegram = { id?: number };
type MensajeTelegram = { text?: string; from?: UsuarioTelegram; chat?: ChatTelegram };
type CallbackTelegram = {
  id?: string;
  data?: string;
  from?: UsuarioTelegram;
  message?: { chat?: ChatTelegram };
};
type UpdateTelegram = {
  update_id?: number;
  message?: MensajeTelegram;
  callback_query?: CallbackTelegram;
};

function secretoValido(recibido: string | null): boolean {
  const esperado = process.env.TELEGRAM_WEBHOOK_SECRET?.trim();
  if (!esperado || !recibido) return false;
  const a = Buffer.from(recibido);
  const b = Buffer.from(esperado);
  return a.length === b.length && timingSafeEqual(a, b);
}

function limiteDiario(): number {
  const configurado = Number(process.env.AUTOMATION_DAILY_LIMIT ?? "3");
  return Number.isInteger(configurado) && configurado > 0 ? Math.min(configurado, 20) : 3;
}

function resumenPrompt(prompt: string): string {
  return prompt.length <= 2700 ? prompt : `${prompt.slice(0, 2690)}…`;
}

async function procesarMensaje(mensaje: MensajeTelegram): Promise<void> {
  const usuarioId = String(mensaje.from?.id ?? "");
  const chatId = String(mensaje.chat?.id ?? "");
  if (!usuarioAutorizado(usuarioId) || !chatId) return;

  const texto = mensaje.text?.trim() ?? "";
  if (texto === "/estado") {
    const trabajo = await ultimoTrabajo(usuarioId);
    await enviarTexto(
      chatId,
      trabajo
        ? `Última escena: ${trabajo.especificacion.titulo}\nEstado: ${trabajo.estado}\nID: ${trabajo.id}`
        : "Todavía no hay escenas solicitadas.",
    );
    return;
  }

  if (!texto.startsWith("/escena")) {
    await enviarTexto(chatId, "Comandos: /escena <tema> · /estado");
    return;
  }

  const tema = normalizarTema(texto.replace(/^\/escena(?:@\w+)?\s*/i, ""));
  if (tema.length < 2) {
    await enviarTexto(chatId, "Usá /escena seguido del tema. Ejemplo: /escena noche de tormenta");
    return;
  }

  if ((await contarTrabajosRecientes(usuarioId)) >= limiteDiario()) {
    await enviarTexto(chatId, "Alcanzaste el límite diario de propuestas. Probá nuevamente mañana.");
    return;
  }

  const propuesta = await generarPropuesta(tema);
  const trabajo = await guardarBorrador({ chatId, usuarioId, especificacion: propuesta.especificacion });
  await enviarTexto(
    chatId,
    `Borrador ${propuesta.origen === "gemini" ? "Gemini" : "local"}\n\n${propuesta.especificacion.titulo}\n\n${resumenPrompt(propuesta.especificacion.promptVeo)}\n\nID: ${trabajo.id}`,
    [
      [
        { text: "Generar video", callback_data: `escena:generar:${trabajo.id}` },
        { text: "Rechazar", callback_data: `escena:rechazar:${trabajo.id}` },
      ],
    ],
  );
}

async function procesarCallback(callback: CallbackTelegram): Promise<void> {
  const callbackId = callback.id ?? "";
  const usuarioId = String(callback.from?.id ?? "");
  const chatId = String(callback.message?.chat?.id ?? "");
  if (!callbackId || !usuarioAutorizado(usuarioId) || !chatId) return;

  const coincidencia = /^escena:(generar|aprobar|rechazar):([0-9a-f-]{36})$/.exec(callback.data ?? "");
  if (!coincidencia) {
    await responderCallback(callbackId, "Acción inválida.");
    return;
  }
  const [, accion, id] = coincidencia;
  const trabajo = await buscarTrabajo(id);
  if (!trabajo || trabajo.chatId !== chatId) {
    await responderCallback(callbackId, "La escena no existe o pertenece a otro chat.");
    return;
  }

  if (accion === "rechazar") {
    const rechazado =
      (await cambiarEstado({ id, desde: "borrador", hacia: "rechazado" })) ??
      (await cambiarEstado({ id, desde: "listo", hacia: "rechazado" }));
    await responderCallback(callbackId, rechazado ? "Escena rechazada." : "La escena ya fue procesada.");
    return;
  }

  if (accion === "aprobar") {
    const aprobado = await cambiarEstado({ id, desde: "listo", hacia: "aprobado" });
    await responderCallback(callbackId, aprobado ? "Video aprobado." : "La escena ya fue procesada.");
    if (aprobado) {
      await enviarTexto(chatId, `Video aprobado: ${aprobado.especificacion.slug}. Ya puede pasar por CapCut o por el publicador FFmpeg.`);
    }
    return;
  }

  const reservado = await cambiarEstado({ id, desde: "borrador", hacia: "generando" });
  if (!reservado) {
    await responderCallback(callbackId, "La escena ya fue procesada.");
    return;
  }

  await responderCallback(callbackId, "Generación iniciada.");
  try {
    const operacionVeo = await iniciarVideoVeo(reservado.especificacion);
    await cambiarEstado({ id, desde: "generando", hacia: "generando", operacionVeo });
    await enviarTexto(chatId, `Veo está generando “${reservado.especificacion.titulo}”. Consultá /estado en unos minutos.`);
  } catch (error) {
    await cambiarEstado({ id, desde: "generando", hacia: "fallido" });
    const detalle = error instanceof Error ? error.message : "Error desconocido";
    await enviarTexto(chatId, `No se pudo iniciar Veo: ${detalle.slice(0, 500)}`);
  }
}

export async function POST(request: Request): Promise<Response> {
  if (!secretoValido(request.headers.get("x-telegram-bot-api-secret-token"))) {
    return new Response("No autorizado", { status: 401 });
  }

  let update: UpdateTelegram;
  try {
    update = (await request.json()) as UpdateTelegram;
  } catch {
    return new Response("JSON inválido", { status: 400 });
  }

  if (!Number.isSafeInteger(update.update_id)) return new Response("Update inválido", { status: 400 });

  try {
    if (!(await registrarUpdateTelegram(update.update_id!))) return Response.json({ ok: true, duplicado: true });
    if (update.message) await procesarMensaje(update.message);
    if (update.callback_query) await procesarCallback(update.callback_query);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[automatizacion] Falló un update de Telegram", error);
    return Response.json({ ok: false }, { status: 500 });
  }
}
