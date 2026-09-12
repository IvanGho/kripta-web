export const ESTADOS_TRABAJO = [
  "borrador",
  "generando",
  "listo",
  "aprobado",
  "publicado",
  "rechazado",
  "fallido",
] as const;

export type EstadoTrabajo = (typeof ESTADOS_TRABAJO)[number];

export type EspecificacionEscena = {
  slug: string;
  titulo: string;
  tema: string;
  promptVeo: string;
  promptNegativo: string;
  duracionSegundos: 8;
  relacionAspecto: "16:9";
  resolucion: "1080p";
  publicarDesde: string | null;
  publicarHasta: string | null;
};

export type TrabajoEscena = {
  id: string;
  chatId: string;
  usuarioId: string;
  estado: EstadoTrabajo;
  especificacion: EspecificacionEscena;
  operacionVeo: string | null;
  videoOrigenUrl: string | null;
  creadoEn: string;
  actualizadoEn: string;
};

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

function esFechaOpcional(valor: unknown): valor is string | null {
  if (valor === null) return true;
  return typeof valor === "string" && /^\d{4}-\d{2}-\d{2}$/.test(valor);
}

export function validarEspecificacion(valor: unknown): EspecificacionEscena | null {
  if (!esObjeto(valor)) return null;
  if (typeof valor.slug !== "string" || !/^[a-z0-9-]{3,64}$/.test(valor.slug)) return null;
  if (typeof valor.titulo !== "string" || valor.titulo.length < 3 || valor.titulo.length > 80) return null;
  if (typeof valor.tema !== "string" || valor.tema.length < 2 || valor.tema.length > 120) return null;
  if (typeof valor.promptVeo !== "string" || valor.promptVeo.length < 120 || valor.promptVeo.length > 3500) return null;
  if (typeof valor.promptNegativo !== "string" || valor.promptNegativo.length > 1000) return null;
  if (valor.duracionSegundos !== 8 || valor.relacionAspecto !== "16:9" || valor.resolucion !== "1080p") return null;
  if (!esFechaOpcional(valor.publicarDesde) || !esFechaOpcional(valor.publicarHasta)) return null;

  return valor as EspecificacionEscena;
}

export function normalizarTema(valor: string): string {
  return valor.replace(/[\r\n\t]+/g, " ").replace(/\s{2,}/g, " ").trim().slice(0, 120);
}

export function slugDeTema(tema: string): string {
  const base = tema
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return base || "escena-monsterland";
}
