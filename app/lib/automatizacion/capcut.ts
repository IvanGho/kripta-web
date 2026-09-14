import type { EspecificacionEscena } from "./tipos";

function escaparHtml(valor: string): string {
  return valor
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;");
}

/** Brief local: pedirlo nunca usa cuota de Gemini o Veo. */
export function crearPromptCapCut(escena: EspecificacionEscena): string {
  return [
    "Create an 8-second cinematic seamless loop for a premium gaming community website hero.",
    `Scene theme: ${escena.tema}.`,
    "Subject: one frontal dark warrior wolf, mature and realistic, with neon green eyes and a restrained electric-green edge light. Keep EXACTLY three thin diagonal red scars crossing the right side of its face. Preserve those scars and the wolf identity when a reference image is uploaded.",
    "Composition: widescreen 16:9, medium frontal portrait, wolf on the right third of the frame, clean dark negative space on the left for website headline text.",
    "Motion: slow breathing, one natural blink, subtle green energy moving along the silhouette, thin smoke and a few distant embers. Locked camera with minimal parallax only; calm and controlled movement.",
    "Lighting and mood: graphite-black environment, premium cinematic contrast, deep shadows, green neon accents, sparse red only on the scars. Adult, intense, nocturnal, refined.",
    "Loop: first and final frame must feel visually equivalent for a smooth infinite loop.",
    "Avoid: text, subtitles, logos, watermark, game brands, recognizable weapons, extra scars, green scars, fast zoom, shaky camera, facial distortion, asymmetrical eyes, extra anatomy, childish cartoon style, excessive particles.",
  ].join("\n\n");
}

export function crearTarjetaCapCut(escena: EspecificacionEscena): string {
  const prompt = escaparHtml(crearPromptCapCut(escena));
  return [
    "🎬 <b>CAPCUT AI VIDEO</b>",
    `<blockquote><b>${escaparHtml(escena.titulo)}</b>\n${escaparHtml(escena.tema)}</blockquote>`,
    "🌐 <b>PROMPT EN INGLES</b>",
    `<pre>${prompt}</pre>`,
    "⚙️ <b>AJUSTES RECOMENDADOS</b>",
    "• AI Video &gt; Image to Video\n• 16:9 · 8 segundos · Cinematic / Realistic\n• Sin voz, texto, subtitulos ni watermark\n• Exportar MP4 · 1920×1080 · 24 fps",
    "💡 <i>Usa los botones para recibir el prompt limpio, la imagen de referencia o la guia paso a paso.</i>",
  ].join("\n\n");
}

export function crearGuiaCapCut(): string {
  return [
    "🧭 <b>GUIA RAPIDA PARA CAPCUT</b>",
    "<b>1.</b> Abri AI Video y elegi <b>Image to Video</b>.",
    "<b>2.</b> Toca <b>Enviar lobo</b> en el bot y subi ese PNG como referencia.",
    "<b>3.</b> Pega el Prompt limpio, elegi 16:9, 8 segundos y estilo Cinematic / Realistic.",
    "<b>4.</b> Antes de generar, confirma: tres cicatrices rojas, espacio oscuro a la izquierda y sin texto.",
    "<b>5.</b> Exporta MP4 1920×1080 a 24 fps. Cuando lo tengas, me pasas el archivo para publicarlo en la web.",
  ].join("\n\n");
}
