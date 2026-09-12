/** Registra el webhook del bot. No imprime el token ni el secreto. */
try {
  process.loadEnvFile(".env.local");
} catch {
  // En CI/hosting las variables llegan desde el entorno.
}

const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
const secreto = process.env.TELEGRAM_WEBHOOK_SECRET?.trim();
const url = process.env.TELEGRAM_WEBHOOK_URL?.trim();

if (!token || !secreto || !url) {
  console.error("Faltan TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET o TELEGRAM_WEBHOOK_URL.");
  process.exit(1);
}
if (!/^https:\/\//i.test(url)) {
  console.error("TELEGRAM_WEBHOOK_URL debe usar HTTPS.");
  process.exit(1);
}
if (!/^[A-Za-z0-9_-]{32,256}$/.test(secreto)) {
  console.error("TELEGRAM_WEBHOOK_SECRET debe tener 32-256 caracteres seguros.");
  process.exit(1);
}

const respuesta = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    url,
    secret_token: secreto,
    allowed_updates: ["message", "callback_query"],
    drop_pending_updates: true,
  }),
  signal: AbortSignal.timeout(20_000),
});

const resultado = await respuesta.json();
if (!respuesta.ok || resultado?.ok !== true) {
  console.error(`Telegram rechazó el webhook (${respuesta.status}).`);
  process.exit(1);
}
console.log("Webhook de Telegram configurado correctamente.");
