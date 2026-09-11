import "server-only";

export type ProveedorIdentidad = "discord" | "google" | "apple";

function primeraVariable(...nombres: string[]): string {
  for (const nombre of nombres) {
    const valor = process.env[nombre]?.trim();
    if (valor) return valor;
  }
  return "";
}

/**
 * La misma convención de URL que ya usa el panel. Compartir la base no mezcla datos: el acceso
 * usa el esquema `kripta_auth`, separado de las tablas operativas de los torneos.
 */
export const URL_BASE_IDENTIDAD = primeraVariable(
  "DATABASE_URL",
  "POSTGRES_URL",
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL_NON_POOLING",
  "NEON_DATABASE_URL",
);

export const PROVEEDORES_DISPONIBLES: readonly ProveedorIdentidad[] = [
  ...(primeraVariable("AUTH_DISCORD_ID") && primeraVariable("AUTH_DISCORD_SECRET")
    ? (["discord"] as const)
    : []),
  ...(primeraVariable("AUTH_GOOGLE_ID") && primeraVariable("AUTH_GOOGLE_SECRET")
    ? (["google"] as const)
    : []),
  ...(primeraVariable("AUTH_APPLE_ID") && primeraVariable("AUTH_APPLE_SECRET")
    ? (["apple"] as const)
    : []),
];

/**
 * No se habilita un inicio de sesión efímero. Sin base y secreto persistentes, una persona podría
 * entrar hoy y descubrir mañana que no existe su agenda o que la sesión se invalidó. Es mejor
 * mostrar que falta completar la configuración que ofrecer una cuenta a medias.
 */
export const ACCESO_LISTO = Boolean(
  URL_BASE_IDENTIDAD && primeraVariable("AUTH_SECRET") && PROVEEDORES_DISPONIBLES.length > 0,
);

export function proveedorDisponible(valor: string): valor is ProveedorIdentidad {
  return PROVEEDORES_DISPONIBLES.includes(valor as ProveedorIdentidad);
}
