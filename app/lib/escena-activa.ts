import manifiesto from "@/config/escenas.json";

export type EscenaPublicada = {
  slug: string;
  titulo: string;
  poster: string;
  videoWebm: string | null;
  videoMp4: string | null;
  activaDesde: string | null;
  activaHasta: string | null;
  publicadaEn: string;
};

function fechaValida(valor: string | null): boolean {
  return valor === null || /^\d{4}-\d{2}-\d{2}$/.test(valor);
}

function esEscena(valor: unknown): valor is EscenaPublicada {
  if (!valor || typeof valor !== "object") return false;
  const escena = valor as Record<string, unknown>;
  return (
    typeof escena.slug === "string" &&
    typeof escena.titulo === "string" &&
    typeof escena.poster === "string" &&
    (escena.videoWebm === null || typeof escena.videoWebm === "string") &&
    (escena.videoMp4 === null || typeof escena.videoMp4 === "string") &&
    fechaValida((escena.activaDesde as string | null) ?? null) &&
    fechaValida((escena.activaHasta as string | null) ?? null) &&
    typeof escena.publicadaEn === "string"
  );
}

export function obtenerEscenaActiva(ahora = new Date()): EscenaPublicada {
  const escenas = (manifiesto.escenas as unknown[]).filter(esEscena);
  const hoy = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(ahora);

  const programadas = escenas
    .filter((escena) => {
      if (escena.activaDesde && escena.activaDesde > hoy) return false;
      if (escena.activaHasta && escena.activaHasta < hoy) return false;
      return escena.activaDesde !== null || escena.activaHasta !== null;
    })
    .sort((a, b) => b.publicadaEn.localeCompare(a.publicadaEn));

  const activa =
    programadas[0] ??
    escenas.find((escena) => escena.slug === manifiesto.predeterminada) ??
    escenas[0];
  if (!activa) throw new Error("El manifiesto de escenas no contiene una escena válida.");
  return activa;
}
