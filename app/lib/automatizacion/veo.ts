import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { EspecificacionEscena } from "./tipos";

const API_BASE = "https://generativelanguage.googleapis.com/v1beta";

function apiKey(): string {
  const valor = process.env.GEMINI_API_KEY?.trim();
  if (!valor) throw new Error("Falta GEMINI_API_KEY para iniciar Veo.");
  return valor;
}

export async function iniciarVideoVeo(especificacion: EspecificacionEscena): Promise<string> {
  const modelo = process.env.VEO_MODEL?.trim() || "veo-3.1-generate-preview";
  const referencia = await readFile(
    join(process.cwd(), "public", "marca", "kripta-lobo.png"),
  );

  const respuesta = await fetch(`${API_BASE}/models/${encodeURIComponent(modelo)}:predictLongRunning`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-goog-api-key": apiKey(),
    },
    body: JSON.stringify({
      instances: [
        {
          prompt: especificacion.promptVeo,
          // Con una sola imagen del lobo usamos el primer fotograma: es compatible con
          // todos los modelos Veo 3.1 de Gemini API. referenceImages + inlineData todavía
          // no está habilitado de forma uniforme en el endpoint REST.
          image: {
            inlineData: {
              mimeType: "image/png",
              data: referencia.toString("base64"),
            },
          },
        },
      ],
      parameters: {
        aspectRatio: especificacion.relacionAspecto,
        durationSeconds: String(especificacion.duracionSegundos),
        resolution: especificacion.resolucion,
        negativePrompt: especificacion.promptNegativo,
      },
    }),
    signal: AbortSignal.timeout(45_000),
    cache: "no-store",
  });

  const crudo = (await respuesta.json()) as { name?: unknown; error?: { message?: unknown } };
  if (!respuesta.ok || typeof crudo.name !== "string") {
    const detalle = typeof crudo.error?.message === "string" ? crudo.error.message : respuesta.status;
    throw new Error(`Veo no inició la generación (${detalle}).`);
  }
  return crudo.name;
}

export type EstadoOperacionVeo =
  | { estado: "pendiente" }
  | { estado: "listo"; videoUrl: string }
  | { estado: "fallido"; detalle: string };

export async function consultarVideoVeo(operacion: string): Promise<EstadoOperacionVeo> {
  if (!/^[a-zA-Z0-9_./-]{3,300}$/.test(operacion)) {
    return { estado: "fallido", detalle: "Identificador de operación inválido." };
  }
  const respuesta = await fetch(`${API_BASE}/${operacion.replace(/^\//, "")}`, {
    headers: { "x-goog-api-key": apiKey() },
    signal: AbortSignal.timeout(20_000),
    cache: "no-store",
  });
  const crudo = (await respuesta.json()) as Record<string, unknown>;
  if (!respuesta.ok) return { estado: "fallido", detalle: `Consulta Veo ${respuesta.status}.` };
  if (crudo.done !== true) return { estado: "pendiente" };

  const error = crudo.error as { message?: unknown } | undefined;
  if (error) {
    return {
      estado: "fallido",
      detalle: typeof error.message === "string" ? error.message.slice(0, 500) : "Veo falló.",
    };
  }

  const respuestaVideo = crudo.response as Record<string, unknown> | undefined;
  const generar = respuestaVideo?.generateVideoResponse as Record<string, unknown> | undefined;
  const muestras = generar?.generatedSamples;
  const primera = Array.isArray(muestras) ? (muestras[0] as Record<string, unknown> | undefined) : undefined;
  const video = primera?.video as Record<string, unknown> | undefined;
  if (typeof video?.uri !== "string") {
    return { estado: "fallido", detalle: "Veo terminó sin URL de video." };
  }
  return { estado: "listo", videoUrl: video.uri };
}

export async function descargarVideoVeo(videoUrl: string): Promise<ArrayBuffer> {
  const url = new URL(videoUrl);
  if (url.protocol !== "https:" || !url.hostname.endsWith(".googleapis.com")) {
    throw new Error("Veo devolvió una URL de descarga no permitida.");
  }
  const respuesta = await fetch(url, {
    headers: { "x-goog-api-key": apiKey() },
    signal: AbortSignal.timeout(60_000),
    cache: "no-store",
  });
  if (!respuesta.ok) throw new Error(`No se pudo descargar el video de Veo (${respuesta.status}).`);
  const longitud = Number(respuesta.headers.get("content-length") ?? "0");
  if (longitud > 45 * 1024 * 1024) throw new Error("El video supera el límite seguro de 45 MB.");
  const datos = await respuesta.arrayBuffer();
  if (datos.byteLength > 45 * 1024 * 1024) throw new Error("El video supera el límite seguro de 45 MB.");
  return datos;
}
