import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { crearPromptImagenCapCut } from "./capcut";
import type { EspecificacionEscena } from "./tipos";

const API_BASE = "https://generativelanguage.googleapis.com/v1beta";

function apiKey(): string {
  const valor = process.env.GEMINI_API_KEY?.trim();
  if (!valor) throw new Error("Falta GEMINI_API_KEY para generar la imagen.");
  return valor;
}

function imagenDeRespuesta(valor: unknown): string | null {
  if (!valor || typeof valor !== "object") return null;
  const respuesta = valor as Record<string, unknown>;
  const salida = respuesta.output_image;
  if (salida && typeof salida === "object" && typeof (salida as Record<string, unknown>).data === "string") {
    return (salida as Record<string, unknown>).data as string;
  }

  const pasos = respuesta.steps;
  if (!Array.isArray(pasos)) return null;
  for (const paso of pasos) {
    if (!paso || typeof paso !== "object") continue;
    const contenido = (paso as Record<string, unknown>).content;
    if (!Array.isArray(contenido)) continue;
    for (const bloque of contenido) {
      if (!bloque || typeof bloque !== "object") continue;
      const datos = bloque as Record<string, unknown>;
      if (datos.type === "image" && typeof datos.data === "string") return datos.data;
    }
  }
  return null;
}

/** Genera una sola candidata para revisar; no inicia Veo ni consume creditos de video. */
export async function generarImagenCandidata(
  escena: EspecificacionEscena,
  intento: number,
): Promise<ArrayBuffer> {
  const modelo = process.env.GEMINI_IMAGE_MODEL?.trim() || "gemini-3.1-flash-image";
  const identidad = await readFile(join(process.cwd(), "public", "marca", "kripta-lobo.png"));
  const prompt = [
    crearPromptImagenCapCut(escena),
    `This is candidate variation ${intento}. Use the supplied image only to retain the wolf's green eyes and exactly three red facial scars; do not copy its logo composition, linework, or graphic style.`,
  ].join("\n\n");

  const respuesta = await fetch(`${API_BASE}/interactions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-goog-api-key": apiKey(),
    },
    body: JSON.stringify({
      model: modelo,
      input: [
        { type: "text", text: prompt },
        { type: "image", mime_type: "image/png", data: identidad.toString("base64") },
      ],
      response_format: [{ type: "image", mime_type: "image/png", aspect_ratio: "16:9" }],
    }),
    signal: AbortSignal.timeout(55_000),
    cache: "no-store",
  });

  const cuerpo = (await respuesta.json()) as Record<string, unknown>;
  if (!respuesta.ok) {
    const error = cuerpo.error;
    const mensaje = error && typeof error === "object" ? (error as Record<string, unknown>).message : null;
    throw new Error(`Gemini Image no genero la candidata (${typeof mensaje === "string" ? mensaje : respuesta.status}).`);
  }
  const base64 = imagenDeRespuesta(cuerpo);
  if (!base64 || !/^[A-Za-z0-9+/=]+$/.test(base64)) {
    throw new Error("Gemini Image respondio sin una imagen valida.");
  }
  const bytes = Buffer.from(base64, "base64");
  if (bytes.byteLength < 5_000 || bytes.byteLength > 15 * 1024 * 1024) {
    throw new Error("Gemini Image devolvio una imagen fuera de los limites seguros.");
  }
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}
