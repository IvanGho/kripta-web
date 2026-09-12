import "server-only";

import { especificacionLocal, instruccionParaGemini } from "./brief";
import type { EspecificacionEscena } from "./tipos";
import { validarEspecificacion } from "./tipos";

type ResultadoPropuesta = {
  especificacion: EspecificacionEscena;
  origen: "gemini" | "local";
};

const ESQUEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    slug: { type: "string", description: "slug kebab-case de 3 a 64 caracteres" },
    titulo: { type: "string", description: "nombre breve de la escena" },
    tema: { type: "string", description: "tema pedido por el administrador" },
    promptVeo: { type: "string", description: "prompt cinematográfico detallado en español" },
    promptNegativo: { type: "string", description: "elementos y defectos que deben evitarse" },
    duracionSegundos: { type: "integer", enum: [8] },
    relacionAspecto: { type: "string", enum: ["16:9"] },
    resolucion: { type: "string", enum: ["1080p"] },
    publicarDesde: { type: ["string", "null"], description: "fecha YYYY-MM-DD o null" },
    publicarHasta: { type: ["string", "null"], description: "fecha YYYY-MM-DD o null" },
  },
  required: [
    "slug",
    "titulo",
    "tema",
    "promptVeo",
    "promptNegativo",
    "duracionSegundos",
    "relacionAspecto",
    "resolucion",
    "publicarDesde",
    "publicarHasta",
  ],
} as const;

function leerTextoRespuesta(valor: unknown): string | null {
  if (!valor || typeof valor !== "object") return null;
  const objeto = valor as Record<string, unknown>;
  if (typeof objeto.output_text === "string") return objeto.output_text;
  const interaccion = objeto.interaction;
  if (interaccion && typeof interaccion === "object") {
    const texto = (interaccion as Record<string, unknown>).output_text;
    if (typeof texto === "string") return texto;
  }
  return null;
}

export async function generarPropuesta(tema: string): Promise<ResultadoPropuesta> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return { especificacion: especificacionLocal(tema), origen: "local" };

  const modelo = process.env.GEMINI_TEXT_MODEL?.trim() || "gemini-3.8-flash";
  const respuesta = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      model: modelo,
      input: instruccionParaGemini(tema),
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: ESQUEMA,
      },
    }),
    signal: AbortSignal.timeout(35_000),
    cache: "no-store",
  });

  if (!respuesta.ok) {
    throw new Error(`Gemini rechazó la propuesta (${respuesta.status}).`);
  }

  const texto = leerTextoRespuesta(await respuesta.json());
  if (!texto) throw new Error("Gemini no devolvió output_text.");

  let crudo: unknown;
  try {
    crudo = JSON.parse(texto);
  } catch {
    throw new Error("Gemini devolvió una propuesta que no es JSON válido.");
  }

  const especificacion = validarEspecificacion(crudo);
  if (!especificacion) throw new Error("La propuesta de Gemini no cumple el contrato de escenas.");
  return { especificacion, origen: "gemini" };
}
