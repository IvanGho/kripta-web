import "server-only";

type Boton = { text: string; callback_data: string };

function token(): string {
  const valor = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!valor) throw new Error("Falta TELEGRAM_BOT_TOKEN.");
  return valor;
}

async function llamarTelegram(metodo: string, cuerpo: Record<string, unknown>): Promise<void> {
  const respuesta = await fetch(`https://api.telegram.org/bot${token()}/${metodo}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(cuerpo),
    signal: AbortSignal.timeout(15_000),
    cache: "no-store",
  });
  if (!respuesta.ok) throw new Error(`Telegram ${metodo} respondió ${respuesta.status}.`);
}

export function usuarioAutorizado(usuarioId: string): boolean {
  const permitidos = (process.env.TELEGRAM_ADMIN_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  return permitidos.length > 0 && permitidos.includes(usuarioId);
}

export async function enviarTexto(chatId: string, texto: string, botones?: Boton[][]): Promise<void> {
  await llamarTelegram("sendMessage", {
    chat_id: chatId,
    text: texto.slice(0, 4096),
    disable_web_page_preview: true,
    ...(botones ? { reply_markup: { inline_keyboard: botones } } : {}),
  });
}

export async function responderCallback(callbackId: string, texto: string): Promise<void> {
  await llamarTelegram("answerCallbackQuery", {
    callback_query_id: callbackId,
    text: texto.slice(0, 200),
    show_alert: false,
  });
}

export async function enviarVideo(
  chatId: string,
  contenido: ArrayBuffer,
  nombreArchivo: string,
  texto: string,
  botones?: Boton[][],
): Promise<void> {
  const formulario = new FormData();
  formulario.set("chat_id", chatId);
  formulario.set("caption", texto.slice(0, 1024));
  formulario.set("supports_streaming", "true");
  formulario.set("video", new Blob([contenido], { type: "video/mp4" }), nombreArchivo);
  if (botones) formulario.set("reply_markup", JSON.stringify({ inline_keyboard: botones }));

  const respuesta = await fetch(`https://api.telegram.org/bot${token()}/sendVideo`, {
    method: "POST",
    body: formulario,
    signal: AbortSignal.timeout(60_000),
    cache: "no-store",
  });
  if (!respuesta.ok) throw new Error(`Telegram sendVideo respondió ${respuesta.status}.`);
}
