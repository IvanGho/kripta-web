import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const raiz = process.cwd();
const fuente = `${raiz}/assets/originales/kripta-mascot-v7.png`;
const marca = `${raiz}/public/marca`;

await mkdir(marca, { recursive: true });

const base = sharp(fuente, { density: 144 }).ensureAlpha();
const metadata = await base.metadata();
if (!metadata.hasAlpha) throw new Error("La fuente del lobo no tiene transparencia.");

// El master ya es cuadrado y transparente; se normalizan tamaños para que navegador,
// PWA y redes compartan la misma identidad.
await base.clone().resize(1024, 1024, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(`${marca}/kripta-lobo.png`);
await base.clone().resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(`${raiz}/app/icon.png`);
await base.clone().resize(192, 192, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(`${marca}/kripta-lobo-192.png`);
await base.clone().resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(`${marca}/kripta-lobo-512.png`);
await base.clone().resize(1200, 1200, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(`${marca}/kripta-lobo-social.png`);

console.log(`Marca generada desde ${metadata.width}x${metadata.height}: PNG transparente 1024/512/192/1200.`);
