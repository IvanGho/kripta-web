import sharp from "sharp";
import { mkdir } from "node:fs/promises";

// Los PNG maestros se conservan fuera de public; sólo se descargan las versiones web.
await mkdir("public/imagenes", { recursive: true });
for (const nombre of [
  "hero-kripta-v3",
  "hero-lobo-kripta-v4",
  "comunidad-kripta-v3",
  "torneos-kripta-v3",
  "herramienta-sensibilidad-v3",
  "herramienta-anotador-v3",
]) {
  await sharp(`assets/originales/${nombre}.png`)
    .resize({
      width: nombre.startsWith("herramienta") ? 640 : 1536,
      withoutEnlargement: true,
    })
    .webp({ quality: 80, effort: 6 })
    .toFile(`public/imagenes/${nombre}.webp`);
}
// Satori usa JPEG/PNG; una copia chica evita cargar el PNG maestro al generar Open Graph.
await sharp("assets/originales/hero-lobo-kripta-v4.png")
  .resize({ width: 1200 })
  .jpeg({ quality: 78 })
  .toFile("assets/hero-social-v4.jpg");
