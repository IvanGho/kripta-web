import { spawn } from "node:child_process";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, isAbsolute, join, resolve } from "node:path";

const [entradaCruda, slug, titulo, activaDesde = "", activaHasta = ""] = process.argv.slice(2);

function uso(mensaje) {
  if (mensaje) console.error(mensaje);
  console.error('Uso: npm run publicar-escena -- "C:/video.mp4" slug-v1 "Título" [YYYY-MM-DD] [YYYY-MM-DD]');
  process.exit(1);
}

if (!entradaCruda || !slug || !titulo) uso();
if (!/^[a-z0-9-]{3,64}$/.test(slug)) uso("El slug sólo admite minúsculas, números y guiones.");
if (titulo.length > 80) uso("El título admite hasta 80 caracteres.");
for (const fecha of [activaDesde, activaHasta]) {
  if (fecha && !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) uso(`Fecha inválida: ${fecha}`);
}
if (activaDesde && activaHasta && activaHasta < activaDesde) uso("La fecha final es anterior a la inicial.");

const raiz = process.cwd();
const entrada = isAbsolute(entradaCruda) ? resolve(entradaCruda) : resolve(raiz, entradaCruda);
await access(entrada).catch(() => uso(`No existe el video: ${entrada}`));

const carpeta = join(raiz, "public", "escenas");
await mkdir(carpeta, { recursive: true });
const mp4 = join(carpeta, `${slug}.mp4`);
const webm = join(carpeta, `${slug}.webm`);
const poster = join(carpeta, `${slug}.jpg`);

for (const salida of [mp4, webm, poster]) {
  try {
    await access(salida);
    uso(`Ya existe ${basename(salida)}. Usá un slug versionado para no pisar una escena publicada.`);
  } catch {
    // Libre para escribir.
  }
}

const filtro = "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black,fps=24";

function ffmpeg(argumentos) {
  return new Promise((resolver, rechazar) => {
    const proceso = spawn("ffmpeg", ["-hide_banner", "-loglevel", "error", "-i", entrada, ...argumentos], {
      stdio: "inherit",
      shell: false,
    });
    proceso.on("error", rechazar);
    proceso.on("exit", (codigo) => (codigo === 0 ? resolver() : rechazar(new Error(`FFmpeg terminó con código ${codigo}.`))));
  });
}

await ffmpeg(["-an", "-vf", filtro, "-c:v", "libx264", "-preset", "slow", "-crf", "24", "-pix_fmt", "yuv420p", "-movflags", "+faststart", mp4]);
await ffmpeg(["-an", "-vf", filtro, "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "35", "-row-mt", "1", webm]);
await ffmpeg(["-ss", "00:00:00.500", "-frames:v", "1", "-vf", "scale=1920:-2", "-q:v", "3", poster]);

const rutaManifiesto = join(raiz, "config", "escenas.json");
const manifiesto = JSON.parse(await readFile(rutaManifiesto, "utf8"));
manifiesto.escenas = manifiesto.escenas.filter((escena) => escena.slug !== slug);
manifiesto.escenas.push({
  slug,
  titulo,
  poster: `/escenas/${slug}.jpg`,
  videoWebm: `/escenas/${slug}.webm`,
  videoMp4: `/escenas/${slug}.mp4`,
  activaDesde: activaDesde || null,
  activaHasta: activaHasta || null,
  publicadaEn: new Date().toISOString(),
});
if (!activaDesde && !activaHasta) manifiesto.predeterminada = slug;
await writeFile(rutaManifiesto, `${JSON.stringify(manifiesto, null, 2)}\n`, "utf8");

console.log(`Escena ${slug} publicada: MP4, WebM, poster y manifiesto actualizados.`);
