import type { EspecificacionEscena } from "./tipos";

function escaparHtml(valor: string): string {
  return valor
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;");
}

/** Brief local: pedirlo nunca usa cuota de Gemini o Veo. */
export function crearPromptImagenCapCut(escena: EspecificacionEscena): string {
  return [
    "Create cinematic key art for a premium gaming community website hero, 16:9 landscape.",
    `Scene theme: ${escena.tema}.`,
    "Subject: one mature dark-gray wolf warrior, chest-up, realistic detailed fur, calm intense expression, mouth closed. Neon green eyes and a subtle electric-green edge light. Keep EXACTLY three thin diagonal red scars across the right side of the face.",
    "Composition: the wolf is on the right third of the frame. Reserve clean dark negative space on the left for a website headline. The wolf is not centered and does not fill the whole frame.",
    "Lighting and mood: graphite-black stormy environment, cinematic 35mm key art, deep controlled shadows, faint smoke, sparse embers, premium adult gaming aesthetic. Green is a restrained accent; red appears only in the scars.",
    "Do not create a logo, mascot badge, sticker, vector illustration, thick neon outline, white or transparent background, roaring open mouth, exaggerated teeth, symmetric centered face, text, watermark, game brands, weapons, extra scars, childish cartoon style, or excessive particles.",
  ].join("\n\n");
}

export function crearPromptCapCut(escena: EspecificacionEscena): string {
  return [
    "Animate the uploaded approved cinematic wolf key-art image into an 8-second seamless website hero loop.",
    `Scene theme: ${escena.tema}.`,
    "Preserve the exact approved wolf identity, fur, face, three red scars, composition, lighting and dark left-side negative space. Do not redesign the character or turn it into a logo or sticker.",
    "Motion: slow breathing, one natural blink, faint green energy moving along the silhouette, thin smoke and a few distant embers. Locked camera with only minimal parallax. Calm, controlled, premium cinematic movement.",
    "Loop: first and final frame must feel visually equivalent for a smooth infinite loop.",
    "Avoid: text, subtitles, logos, watermark, game brands, fast zoom, shaky camera, facial distortion, extra scars, open roaring mouth, exaggerated teeth, cartoon style, or excessive particles.",
  ].join("\n\n");
}

export function crearTarjetaPipelineCapCut(escena: EspecificacionEscena): string {
  return [
    "🐺 <b>CAPCUT · PIPELINE DE ESCENA</b>",
    `<blockquote><b>${escaparHtml(escena.titulo)}</b>\n${escaparHtml(escena.tema)}</blockquote>`,
    "<b>1. Imagen de referencia</b>\nCreamos una imagen cinematografica para el hero. No animamos el logo de Discord directamente.",
    "<b>2. Revision humana</b>\nVos aprobas la imagen final en CapCut.",
    "<b>3. Video</b>\nEl bot devuelve un prompt para animar exactamente esa imagen con Sora, Seedance o Veo.",
    "💡 <i>Veo directo sigue disponible desde el boton Generar video del borrador.</i>",
  ].join("\n\n");
}

export function crearTarjetaImagenCapCut(escena: EspecificacionEscena): string {
  return [
    "🖼️ <b>PASO 1 · IMAGEN DE REFERENCIA</b>",
    "Usa <b>Imagen de IA / Seedream</b> en CapCut. Para esta etapa no subas el logo del Discord como imagen inicial: queremos salir de la estetica de sticker.",
    "🌐 <b>PROMPT EN INGLES</b>",
    `<pre>${escaparHtml(crearPromptImagenCapCut(escena))}</pre>`,
    "⚙️ <b>AJUSTES</b>\n• 16:9 · 2K · 1 resultado\n• Objetivo: key art cinematografico, no logo\n• Revisa: tres cicatrices rojas y aire oscuro a la izquierda.",
  ].join("\n\n");
}

export function crearTarjetaVideoCapCut(escena: EspecificacionEscena): string {
  const prompt = escaparHtml(crearPromptCapCut(escena));
  return [
    "🎬 <b>PASO 2 · ANIMAR IMAGEN APROBADA</b>",
    `<blockquote><b>${escaparHtml(escena.titulo)}</b>\n${escaparHtml(escena.tema)}</blockquote>`,
    "🌐 <b>PROMPT EN INGLES</b>",
    `<pre>${prompt}</pre>`,
    "⚙️ <b>AJUSTES RECOMENDADOS</b>",
    "• AI Video &gt; Image to Video\n• Sora: 16:9 · 8 segundos · 720p si es el limite de tu plan\n• Sin voz, texto, subtitulos ni watermark\n• Exportar MP4 · 24 fps",
    "💡 <i>Subi la imagen que acabas de aprobar. No vuelvas a usar el logo frontal como fuente de video.</i>",
  ].join("\n\n");
}

export function crearGuiaCapCut(): string {
  return [
    "🧭 <b>GUIA RAPIDA PARA CAPCUT</b>",
    "<b>1.</b> En Imagen de IA, usa el prompt de imagen con 16:9 y 2K. No cargues el logo frontal como fuente de esa imagen.",
    "<b>2.</b> Elegi una imagen con lobo realista a la derecha, tres cicatrices rojas y espacio oscuro a la izquierda.",
    "<b>3.</b> Toca Imagen aprobada en el bot. Luego, en AI Video &gt; Image to Video, subi esa nueva imagen.",
    "<b>4.</b> Pega el prompt de video. En Sora usa 16:9, 8 segundos, 720p y audio apagado.",
    "<b>5.</b> Exporta MP4 a 24 fps. Cuando lo tengas, me pasas el archivo para publicarlo en la web.",
  ].join("\n\n");
}
