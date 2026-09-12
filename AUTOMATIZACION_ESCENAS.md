# Automatización de escenas

El flujo no publica una generación a ciegas. Separa propuesta, generación, revisión y publicación:

1. Un administrador envía `/escena <tema>` al bot.
2. Gemini devuelve una especificación JSON validada contra el brief fijo de Monsterland. Sin API
   key se genera un borrador local, útil para probar sin gastar.
3. Telegram muestra el prompt y pide confirmación.
4. `Generar video` inicia un trabajo asíncrono de Veo con el mascot V7 como referencia.
5. Un cron consulta `/api/automatizacion/poll`; cuando termina, sube el MP4 a Telegram.
6. El administrador aprueba o rechaza el preview.
7. El video aprobado puede pasar por CapCut y luego por `npm run publicar-escena`, que produce los
   formatos web y lo agenda por fecha.

## Preparación

Copiar las variables de `.env.example` a `.env.local`, sin anteponer `NEXT_PUBLIC_` a ningún
secreto. `TELEGRAM_ADMIN_IDS` acepta varios IDs numéricos separados por coma.

```powershell
npm run preparar-automatizacion
npm run configurar-bot
```

`TELEGRAM_WEBHOOK_URL` debe ser la URL HTTPS completa, por ejemplo:

```text
https://dominio.example/api/automatizacion/telegram
```

El cron llama periódicamente:

```text
GET /api/automatizacion/poll
Authorization: Bearer <CRON_SECRET>
```

## Publicar el video aprobado

FFmpeg debe estar disponible en el PATH. El script nunca pisa una escena previa: para una revisión
hay que usar otro slug (`tormenta-v2`).

```powershell
npm run publicar-escena -- "C:/Videos/tormenta.mp4" tormenta-v1 "Noche de tormenta" 2026-10-01 2026-10-31
```

Genera `public/escenas/<slug>.mp4`, `.webm` y `.jpg`, sin audio, a 1920×1080 y 24 fps. También
actualiza `config/escenas.json`. Una escena con fechas tiene prioridad durante ese intervalo; una
sin fechas pasa a ser la predeterminada.

La portada mantiene siempre el poster detrás del video. Con `prefers-reduced-motion: reduce` el
video no se muestra. Si un formato falla, el navegador prueba el siguiente y finalmente conserva
la imagen.

## Límites de seguridad

- El webhook valida `X-Telegram-Bot-Api-Secret-Token` con comparación de tiempo constante.
- Sólo actúan los IDs de `TELEGRAM_ADMIN_IDS`.
- Cada `update_id` se registra una vez para evitar trabajos duplicados por reintentos.
- `AUTOMATION_DAILY_LIMIT` limita costo por administrador; el valor predeterminado es 3.
- Los callbacks cambian estado de forma atómica: tocar dos veces no crea dos videos.
- Gemini y Veo tienen timeout y sus respuestas se validan antes de persistirlas.
- La publicación final sigue requiriendo aprobación humana.
