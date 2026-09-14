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
    "Create original high-end stylized 3D cinematic key art for a premium dark gaming community website hero, 16:9 landscape.",
    `Scene theme: ${escena.tema}.`,
    "Subject: one original mature wolf guardian, chest-up, dark charcoal fur, sculpted stylized 3D features and grounded anatomy. He radiates quiet menace and authority: mouth closed, lowered brow, direct green gaze. Keep EXACTLY three thin diagonal red scars across the right side of the face. He wears only subtle weathered dark armor shapes with no recognizable symbols.",
    "Composition: the wolf occupies the right third of the frame, seen in a three-quarter view looking slightly toward camera. Reserve clean, near-black negative space on the left for a website headline. The wolf is not centered and does not fill the whole frame.",
    "Lighting and mood: premium adult dark-fantasy animated short film, cinematic 35mm framing, graphite storm clouds, deep controlled shadows, a faint green rim light, thin drifting smoke and only a few distant embers. Green is a restrained accent; red appears only in the scars. Rich material detail, filmic contrast, elegant and intimidating.",
    "Do not create photoreal wildlife photography, a logo, mascot badge, sticker, vector illustration, thick neon outline, white or transparent background, roaring open mouth, exaggerated teeth, symmetric centered face, text, watermark, game brands, recognizable characters, weapons, extra scars, childish cartoon style, anime style, or excessive particles.",
  ].join("\n\n");
}

export function crearPromptCapCut(escena: EspecificacionEscena): string {
  return [
    "Animate the uploaded approved cinematic wolf key-art image into an 8-second seamless website hero loop.",
    `Scene theme: ${escena.tema}.`,
    "Preserve the exact approved original stylized 3D wolf identity, fur, face, three red scars, composition, lighting and dark left-side negative space. Do not redesign the character or turn it into a logo or sticker.",
    "Motion: a subtle chest breath, one slow controlled blink, a barely perceptible eye focus shift, faint green rim energy pulsing once along the silhouette, thin smoke crossing the depth of frame and a few distant embers. Locked cinematic camera with only minimal parallax. Calm, restrained, intimidating premium animated-short-film movement.",
    "Loop: first and final frame must feel visually equivalent for a smooth infinite loop.",
    "Avoid: text, subtitles, logos, watermark, game brands, recognizable characters, fast zoom, shaky camera, facial distortion, extra scars, open roaring mouth, exaggerated teeth, photoreal wildlife footage, childish cartoon style, anime style, or excessive particles.",
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
