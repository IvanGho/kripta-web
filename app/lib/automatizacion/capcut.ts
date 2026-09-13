import type { EspecificacionEscena } from "./tipos";

/**
 * Brief listo para CapCut AI Video. Es local y determinista: pedirlo nunca usa cuota de Gemini o Veo.
 * El ingles lleva la direccion visual; la guia final conserva los ajustes operativos en espanol.
 */
export function crearPromptCapCut(escena: EspecificacionEscena): string {
  const prompt = [
    "Create an 8-second cinematic seamless loop for a premium gaming community website hero.",
    `Scene theme: ${escena.tema}.`,
    "Subject: one frontal dark warrior wolf, mature and realistic, with neon green eyes and a restrained electric-green edge light. Keep EXACTLY three thin diagonal red scars crossing the right side of its face. Preserve those scars and the wolf identity when a reference image is uploaded.",
    "Composition: widescreen 16:9, medium frontal portrait, wolf on the right third of the frame, clean dark negative space on the left for website headline text.",
    "Motion: slow breathing, one natural blink, subtle green energy moving along the silhouette, thin smoke and a few distant embers. Locked camera with minimal parallax only; calm and controlled movement.",
    "Lighting and mood: graphite-black environment, premium cinematic contrast, deep shadows, green neon accents, sparse red only on the scars. Adult, intense, nocturnal, refined.",
    "Loop: first and final frame must feel visually equivalent for a smooth infinite loop.",
    "Avoid: text, subtitles, logos, watermark, game brands, recognizable weapons, extra scars, green scars, fast zoom, shaky camera, facial distortion, asymmetrical eyes, extra anatomy, childish cartoon style, excessive particles.",
  ].join("\n\n");

  return [
    "CAPCUT AI VIDEO - COPY THE ENGLISH PROMPT",
    "",
    prompt,
    "",
    "SETTINGS",
    "- Use AI Video > Image to Video when possible; upload the official Kripta wolf image first.",
    "- Ratio: 16:9 | Duration: 8 seconds | Style: Cinematic / Realistic.",
    "- Disable voiceover and on-screen captions. Keep only subtle ambience if CapCut requires audio.",
    "- Export MP4, 1920x1080, 24 fps. Do not add a CapCut template, title, or watermark.",
    "",
    "GUIA RAPIDA (ES)",
    "Usa la imagen del lobo como referencia, pega el bloque en ingles, elegi 16:9 y 8 segundos. Antes de exportar, revisa que haya exactamente tres cicatrices rojas y que el plano deje aire oscuro a la izquierda.",
  ].join("\n");
}
