import { timingSafeEqual } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { generarPropuesta } from "@/app/lib/automatizacion/gemini";
import {
  buscarTrabajo,
  cambiarEstado,
  contarTrabajosRecientes,
  guardarBorrador,
  guardarImagenCandidata,
  registrarUpdateTelegram,
  ultimoTrabajo,
} from "@/app/lib/automatizacion/repositorio";
import { editarCaptionHtml, editarTextoHtml, enviarDocumento, enviarFoto, enviarTexto, enviarTextoHtml, responderCallback, usuarioAutorizado } from "@/app/lib/automatizacion/telegram";
import { generarImagenCandidata } from "@/app/lib/automatizacion/imagen";
import { iniciarVideoVeo } from "@/app/lib/automatizacion/veo";
import { revisarVideosPendientes } from "@/app/lib/automatizacion/poll";
import {
  crearGuiaCapCut,
  crearPromptCapCut,
  crearPromptImagenCapCut,
  crearTarjetaImagenCapCut,
  crearTarjetaPipelineCapCut,
  crearTarjetaVideoCapCut,
} from "@/app/lib/automatizacion/capcut";
import { normalizarTema, type TrabajoEscena } from "@/app/lib/automatizacion/tipos";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type UsuarioTelegram = { id?: number };
type ChatTelegram = { id?: number };
type MensajeTelegram = {
  text?: string;
  video?: { file_id?: string; file_name?: string };
  from?: UsuarioTelegram;
  chat?: ChatTelegram;
};
type CallbackTelegram = {
  id?: string;
  data?: string;
  from?: UsuarioTelegram;
  message?: { chat?: ChatTelegram; message_id?: number };
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

function botonesPipelineCapCut(id: string) {
  return [
    [
      { text: "✨ Generar imagen IA", callback_data: `escena:imagegenerate:${id}` },
      { text: "🐺 Ver referencia", callback_data: `escena:capcutfile:${id}` },
    ],
    [
      { text: "📋 Prompt manual", callback_data: `escena:capcutimage:${id}` },
      { text: "🧭 Guia", callback_data: `escena:capcutguide:${id}` },
    ],
  ];
}

function botonesImagenCapCut(id: string) {
  return [
    [{ text: "📋 Copiar prompt imagen", callback_data: `escena:capcutimagecopy:${id}` }],
    [
      { text: "✅ Imagen aprobada", callback_data: `escena:capcutapprove:${id}` },
      { text: "↩️ Pipeline", callback_data: `escena:capcut:${id}` },
    ],
  ];
}

function botonesRevisionImagen(id: string) {
  return [
    [
      { text: "✅ Aprobar imagen", callback_data: `escena:capcutapprove:${id}` },
      { text: "🔄 Regenerar", callback_data: `escena:imageregenerate:${id}` },
    ],
    [
      { text: "📋 Ver prompt", callback_data: `escena:capcutimagecopy:${id}` },
      { text: "↩️ Pipeline", callback_data: `escena:capcut:${id}` },
    ],
  ];
}

function botonesVideoCapCut(id: string) {
  return [
    [
      { text: "📋 Copiar prompt Sora", callback_data: `escena:capcutcopy:${id}` },
      { text: "✨ Veo directo", callback_data: `escena:generar:${id}` },
    ],
    [
      { text: "🔄 Regenerar imagen", callback_data: `escena:imageregenerate:${id}` },
      { text: "🧭 Guia", callback_data: `escena:capcutguide:${id}` },
    ],
  ];
}

async function enviarPanelCapCut(chatId: string, trabajo: TrabajoEscena): Promise<void> {
  await enviarTextoHtml(chatId, crearTarjetaPipelineCapCut(trabajo.especificacion), botonesPipelineCapCut(trabajo.id));
}

function textoRenderizando(trabajo: TrabajoEscena, intento: number): string {
  return `\u{1F9EA} <b>KEY ART EN PROCESO</b>\n\n<b>${trabajo.especificacion.titulo}</b>\n\nRenderizando candidata ${intento}. El resultado aparecera debajo con los botones de aprobar o regenerar.`;
}

function textoCandidataLista(trabajo: TrabajoEscena, intento: number): string {
  return `\u{1F3A8} <b>KEY ART LISTO</b>\n\n<b>${trabajo.especificacion.titulo}</b>\n\nCandidata ${intento} enviada debajo. Revisala y usa sus botones; no escribas <code>/escena aprobada</code>.`;
}

async function enviarTarjetaImagenCapCut(chatId: string, trabajo: TrabajoEscena): Promise<void> {
  await enviarTextoHtml(chatId, crearTarjetaImagenCapCut(trabajo.especificacion), botonesImagenCapCut(trabajo.id));
}

async function enviarTarjetaVideoCapCut(chatId: string, trabajo: TrabajoEscena): Promise<void> {
  await enviarTextoHtml(chatId, crearTarjetaVideoCapCut(trabajo.especificacion), botonesVideoCapCut(trabajo.id));
}

async function generarYEnviarImagen(
  chatId: string,
  trabajo: TrabajoEscena,
  contexto?: { messageId: number; esFoto: boolean },
): Promise<void> {
  const intento = trabajo.imagenIntentos + 1;
  if (contexto) {
    if (contexto.esFoto) await editarCaptionHtml(chatId, contexto.messageId, textoRenderizando(trabajo, intento));
    else await editarTextoHtml(chatId, contexto.messageId, textoRenderizando(trabajo, intento));
  }
  try {
    const imagen = await generarImagenCandidata(trabajo.especificacion, intento);
    const fileId = await enviarFoto(
      chatId,
      imagen,
      `${trabajo.especificacion.slug}-key-art.png`,
      `\u{1F3A8} <b>CANDIDATA ${intento}</b>\n\n${trabajo.especificacion.titulo}\n\nRevisa: 3 cicatrices rojas, lobo a la derecha, aire oscuro a la izquierda y sin texto. Elegi una accion abajo.`,
      botonesRevisionImagen(trabajo.id),
    );
    await guardarImagenCandidata({ id: trabajo.id, fileId });
    if (contexto && !contexto.esFoto) {
      await editarTextoHtml(chatId, contexto.messageId, textoCandidataLista(trabajo, intento), botonesPipelineCapCut(trabajo.id));
    }
  } catch (error) {
    const detalle = error instanceof Error ? error.message : "Error desconocido";
    const texto = `\u{26A0}\u{FE0F} <b>NO SE PUDO GENERAR LA IMAGEN</b>\n\n${detalle.slice(0, 700)}\n\nNo se inicio ningun video. Podes reintentar o usar el prompt manual.`;
    if (contexto) {
      if (contexto.esFoto) await editarCaptionHtml(chatId, contexto.messageId, texto, botonesRevisionImagen(trabajo.id));
      else await editarTextoHtml(chatId, contexto.messageId, texto, botonesPipelineCapCut(trabajo.id));
    } else await enviarTextoHtml(chatId, texto, botonesPipelineCapCut(trabajo.id));
  }
}

async function enviarArchivoLobo(chatId: string): Promise<void> {
  const lobo = await readFile(join(process.cwd(), "public", "marca", "kripta-lobo.png"));
  const contenido = new ArrayBuffer(lobo.byteLength);
  new Uint8Array(contenido).set(lobo);
  await enviarDocumento(chatId, contenido, "kripta-lobo-identidad.png", "Identidad del lobo: usa este PNG solo para verificar ojos y cicatrices. No lo uses como fuente directa de imagen/video en el paso 1.");
}

async function reintentarGeneracion(trabajo: TrabajoEscena): Promise<void> {
  try {
    const operacionVeo = await iniciarVideoVeo(trabajo.especificacion);
    await cambiarEstado({ id: trabajo.id, desde: "generando", hacia: "generando", operacionVeo });
    await enviarTexto(trabajo.chatId, `Veo esta generando "${trabajo.especificacion.titulo}". Consulta /estado en unos minutos.`);
  } catch (error) {
    await cambiarEstado({ id: trabajo.id, desde: "generando", hacia: "fallido" });
    const detalle = error instanceof Error ? error.message : "Error desconocido";
    await enviarTexto(trabajo.chatId, `No se pudo iniciar Veo: ${detalle.slice(0, 500)}`);
  }
}

async function procesarMensaje(mensaje: MensajeTelegram): Promise<void> {
  const usuarioId = String(mensaje.from?.id ?? "");
  const chatId = String(mensaje.chat?.id ?? "");
  if (!usuarioAutorizado(usuarioId) || !chatId) return;

  if (mensaje.video?.file_id) {
    const trabajo = await ultimoTrabajo(usuarioId);
    if (!trabajo || !trabajo.imagenTelegramFileId) {
      await enviarTexto(chatId, "Primero crea y aproba una imagen para asociar el video exportado.");
      return;
    }
    const listo =
      (await cambiarEstado({ id: trabajo.id, desde: "borrador", hacia: "listo" })) ??
      (await cambiarEstado({ id: trabajo.id, desde: "generando", hacia: "listo" }));
    if (!listo) {
      await enviarTexto(chatId, "Ese video no se puede asociar al estado actual. Usa /capcut para retomar la escena.");
      return;
    }
    await enviarTextoHtml(
      chatId,
      `\u{1F3AC} <b>VIDEO RECIBIDO PARA REVISION</b>\n\n${listo.especificacion.titulo}\n\nSi lo aprobas, queda marcado como listo para publicar. Si no, volves al prompt sin perder la imagen aprobada.`,
      [[
        { text: "✅ Aprobar para publicar", callback_data: `escena:aprobar:${listo.id}` },
        { text: "🔄 Regenerar video", callback_data: `escena:videoretry:${listo.id}` },
      ]],
    );
    return;
  }

  const texto = mensaje.text?.trim() ?? "";
  if (texto === "/estado") {
    await revisarVideosPendientes();
    const trabajo = await ultimoTrabajo(usuarioId);
    await enviarTexto(
      chatId,
      trabajo
        ? `Última escena: ${trabajo.especificacion.titulo}\nEstado: ${trabajo.estado}\nID: ${trabajo.id}`
        : "Todavía no hay escenas solicitadas.",
    );
    return;
  }

  if (texto === "/reintentar") {
    const trabajo = await ultimoTrabajo(usuarioId);
    if (!trabajo || trabajo.estado !== "fallido") {
      await enviarTexto(chatId, "No hay una escena fallida para reintentar. Usa /escena <tema> para crear una nueva.");
      return;
    }
    const reservado = await cambiarEstado({ id: trabajo.id, desde: "fallido", hacia: "generando" });
    if (!reservado) {
      await enviarTexto(chatId, "La escena ya fue procesada. Consulta /estado.");
      return;
    }
    await enviarTexto(chatId, `Reintentando "${reservado.especificacion.titulo}" sin crear una propuesta nueva.`);
    await reintentarGeneracion(reservado);
    return;
  }

  if (texto === "/capcut") {
    const trabajo = await ultimoTrabajo(usuarioId);
    if (!trabajo) {
      await enviarTexto(chatId, "Todavia no hay una escena. Usa /escena <tema> primero.");
      return;
    }
    await enviarPanelCapCut(chatId, trabajo);
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

  if (/^(aproba(?:da|do)?|rechaza(?:da|do)?|regenera(?:r)?)$/i.test(tema)) {
    await enviarTextoHtml(chatId, "\u{1F4A1} <b>USA LOS BOTONES DE LA TARJETA</b>\n\nLos textos como <code>/escena aprobada</code> crean una escena nueva. Para aprobar o regenerar, toca los botones debajo de la imagen o el video.");
    return;
  }

  if ((await contarTrabajosRecientes(usuarioId)) >= limiteDiario()) {
    await enviarTexto(chatId, "Alcanzaste el límite diario de propuestas. Probá nuevamente mañana.");
    return;
  }

  const propuesta = await generarPropuesta(tema);
  const trabajo = await guardarBorrador({ chatId, usuarioId, especificacion: propuesta.especificacion });
  await enviarPanelCapCut(chatId, trabajo);
}

async function procesarCallback(callback: CallbackTelegram): Promise<void> {
  const callbackId = callback.id ?? "";
  const usuarioId = String(callback.from?.id ?? "");
  const chatId = String(callback.message?.chat?.id ?? "");
  const messageId = callback.message?.message_id;
  if (!callbackId || !usuarioAutorizado(usuarioId) || !chatId) return;

  const coincidencia = /^escena:(generar|capcut|capcutimage|capcutimagecopy|capcutapprove|capcutcopy|capcutfile|capcutguide|imagegenerate|imageregenerate|videoretry|aprobar|rechazar):([0-9a-f-]{36})$/.exec(callback.data ?? "");
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

  if (accion === "capcut") {
    await responderCallback(callbackId, "Pipeline CapCut enviado.");
    await enviarPanelCapCut(chatId, trabajo);
    return;
  }

  if (accion === "imagegenerate" || accion === "imageregenerate") {
    await responderCallback(callbackId, accion === "imageregenerate" ? "Regenerando candidata..." : "Generando candidata...");
    await generarYEnviarImagen(
      chatId,
      trabajo,
      messageId ? { messageId, esFoto: accion === "imageregenerate" } : undefined,
    );
    return;
  }

  if (accion === "capcutimage") {
    await responderCallback(callbackId, "Prompt de imagen enviado.");
    await enviarTarjetaImagenCapCut(chatId, trabajo);
    return;
  }

  if (accion === "capcutimagecopy") {
    await responderCallback(callbackId, "Prompt de imagen limpio enviado.");
    await enviarTextoHtml(chatId, `<b>PROMPT IMAGEN - COPIAR</b>\n\n<pre>${crearPromptImagenCapCut(trabajo.especificacion).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>`);
    return;
  }

  if (accion === "capcutapprove") {
    if (!trabajo.imagenTelegramFileId) {
      await responderCallback(callbackId, "Primero genera o envia una imagen candidata.");
      return;
    }
    await responderCallback(callbackId, "Prompt para animar imagen enviado.");
    await enviarTarjetaVideoCapCut(chatId, trabajo);
    return;
  }

  if (accion === "videoretry") {
    const reabierto = await cambiarEstado({ id, desde: "listo", hacia: "borrador" });
    await responderCallback(callbackId, reabierto ? "Video reabierto para regenerar." : "El video ya fue procesado.");
    if (reabierto) await enviarTarjetaVideoCapCut(chatId, reabierto);
    return;
  }

  if (accion === "capcutcopy") {
    await responderCallback(callbackId, "Prompt limpio enviado.");
    await enviarTextoHtml(chatId, `<b>PROMPT VIDEO - COPIAR</b>\n\n<pre>${crearPromptCapCut(trabajo.especificacion).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>`);
    return;
  }

  if (accion === "capcutfile") {
    await responderCallback(callbackId, "Enviando imagen de referencia.");
    await enviarArchivoLobo(chatId);
    return;
  }

  if (accion === "capcutguide") {
    await responderCallback(callbackId, "Guia CapCut enviada.");
    await enviarTextoHtml(chatId, crearGuiaCapCut());
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
