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
    "Create original photorealistic cinematic key art for a premium dark gaming community website hero, 16:9 landscape.",
    `Scene theme: ${escena.tema}.`,
    "Character: one original massive dark wolf guardian with realistic charcoal-black fur, individual wet fur strands and believable powerful anatomy. He radiates quiet menace and authority, with a narrowed direct green gaze and mouth only slightly parted. Keep EXACTLY three thin diagonal red claw scars across the right side of the face. No armor, symbols, or accessories.",
    "Scene: stormy midnight mountain forest beneath an enormous cold full moon. The wolf stands on a wet black rock in a low stalking stance, in the right third of frame, looking slightly toward camera. Reserve clean near-black negative space on the left for a website headline; the wolf is not centered and does not fill the whole frame.",
    "Style and light: photorealistic cinematic still with hyper-detailed realistic material textures. Harsh cold moonlight from behind and above, deep black chiaroscuro shadows, a restrained electric-green rim light and faint green eyes. Thin ground fog, sparse drifting rain and a few distant embers. Gritty, tense, adult dark-fantasy atmosphere; film grain and anamorphic lens character.",
    "Do not create a logo, mascot badge, sticker, vector illustration, thick neon outline, white or transparent background, text, watermark, game brands, recognizable characters, weapons, extra scars, green scars, cartoon style, anime style, excessive particles, or a generic centered portrait.",
  ].join("\n\n");
}

export function crearPromptCapCut(escena: EspecificacionEscena): string {
  return [
    "Create an 8-second loop-ready cinematic website hero from the uploaded approved wolf key art.",
    `Scene theme: ${escena.tema}.`,
    "IMMUTABLE SOURCE: preserve the exact approved wolf identity, individual charcoal fur, three thin red scars on the right side of the face, green eyes, moonlit environment, right-third framing, and clean dark negative space on the left. Do not redesign, reframe, crop, or add objects.",
    "CAMERA: locked-off medium-wide 35mm shot. Absolutely no zoom, dolly, pan, tilt, orbit, handheld shake, rack focus, or parallax. The frame must remain pixel-stable.",
    "ONE MAIN MOTION: a single slow breathing cycle. From 0.0 to 3.0 seconds the wolf slowly inhales; from 3.0 to 6.0 seconds it slowly exhales; from 6.0 to 8.0 seconds it settles back into the exact initial chest height and poised stance. One controlled blink happens between 3.8 and 4.3 seconds and the eyes return to their exact opening state.",
    "SECONDARY MOTION: only faint fog drifting slowly sideways and a subtle green rim-light pulse that fades back to its starting intensity by 8.0 seconds. Rain, moon, rocks, forest, light direction, and background stay fixed. No new particles enter the foreground.",
    "LOOP CLOSURE: at 8.0 seconds the wolf pose, eye direction, chest height, lighting, fog density, green glow, and composition must closely match frame 0.0 so the cut from final frame to first frame is invisible.",
    "Avoid: text, subtitles, logos, watermark, game brands, recognizable characters, walking, attacking, roaring, head turns, camera motion, facial distortion, extra scars, open exaggerated mouth, cartoon style, anime style, flicker, sudden lighting changes, excessive fog, or particle bursts.",
  ].join("\n\n");
}

export function crearTarjetaPipelineCapCut(escena: EspecificacionEscena): string {
  return [
    "\u{1F3AC} <b>CAPCUT \u00B7 PIPELINE DE ESCENA</b>",
    `<blockquote><b>${escaparHtml(escena.titulo)}</b>\n${escaparHtml(escena.tema)}</blockquote>`,
    "<b>FLUJO</b>\n1. Crear key art \u2192 2. Aprobar imagen \u2192 3. Animar con Sora.",
    "<b>ESTADO</b>\nEsperando una imagen cinematografica aprobada.",
    "\u{1F4A1} <i>No animes el logo de Discord directamente: es solo la guia de identidad.</i>",
  ].join("\n\n");
}

export function crearTarjetaImagenCapCut(escena: EspecificacionEscena): string {
  return [
    "\u{1F5BC}\u{FE0F} <b>PASO 1 \u00B7 IMAGEN DE REFERENCIA</b>",
    "Usa <b>Imagen de IA / Seedream</b> en CapCut. Para esta etapa no subas el logo del Discord como imagen inicial: queremos salir de la estetica de sticker.",
    "\u{1F310} <b>PROMPT EN INGLES</b>",
    `<pre>${escaparHtml(crearPromptImagenCapCut(escena))}</pre>`,
    "\u{2699}\u{FE0F} <b>AJUSTES</b>\n\u2022 16:9 \u00B7 2K \u00B7 1 resultado\n\u2022 Objetivo: key art cinematografico, no logo\n\u2022 Revisa: tres cicatrices rojas y aire oscuro a la izquierda.",
  ].join("\n\n");
}

export function crearTarjetaVideoCapCut(escena: EspecificacionEscena): string {
  return [
    "\u{1F3AC} <b>PASO 2 \u00B7 VIDEO</b>",
    `<blockquote><b>${escaparHtml(escena.titulo)}</b>\n${escaparHtml(escena.tema)}</blockquote>`,
    "<b>IMAGEN APROBADA</b>\nLa base visual ya esta definida. Elegi Sora/CapCut para usar el prompt o Veo para la ruta directa de Google.",
    "<b>CUANDO TERMINES</b>\nEnvia el MP4 exportado a este chat. El bot abrira la revision final con Aprobar o Regenerar.",
    "\u{1F4A1} <i>El prompt se abre solo al tocar Copiar prompt Sora; no ensuciamos este panel con texto tecnico.</i>",
  ].join("\n\n");
}

export function crearGuiaCapCut(): string {
  return [
    "\u{1F9ED} <b>GUIA RAPIDA PARA CAPCUT</b>",
    "<b>1.</b> En Imagen de IA, usa el prompt de imagen con 16:9 y 2K. No cargues el logo frontal como fuente de esa imagen.",
    "<b>2.</b> Elegi una imagen con lobo fotorrealista a la derecha, tres cicatrices rojas y espacio oscuro a la izquierda.",
    "<b>3.</b> Toca Imagen aprobada en el bot. Luego, en AI Video &gt; Image to Video, subi esa nueva imagen.",
    "<b>4.</b> Pega el prompt de video. En Sora usa 16:9, 8 segundos, 720p y audio apagado.",
    "<b>5.</b> Antes de exportar, compara segundo 0 y segundo 8: pose, ojos, luz y encuadre deben coincidir. Si hay salto, regenera cambiando solo el movimiento que fallo.",
    "<b>6.</b> Exporta MP4 a 24 fps. Cuando lo tengas, me pasas el archivo para publicarlo en la web.",
  ].join("\n\n");
}
