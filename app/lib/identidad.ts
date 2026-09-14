import "server-only";

export type ProveedorIdentidad = "discord" | "google";

function primeraVariable(...nombres: string[]): string {
  for (const nombre of nombres) {
    const valor = process.env[nombre]?.trim();
    if (valor) return valor;
  }
  return "";
}

// La publishable key es pública por diseño. Las claves privadas de Supabase nunca se usan acá.
export const URL_SUPABASE = primeraVariable("NEXT_PUBLIC_SUPABASE_URL");
export const CLAVE_PUBLICA_SUPABASE = primeraVariable("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");

// La automatización de escenas conserva Postgres porque guarda trabajos privados y no forma
// parte de Supabase Auth. Mantener este dato separado evita que una migración de login rompa el bot.
export const URL_BASE_AUTOMATIZACION = primeraVariable(
  "DATABASE_URL",
  "POSTGRES_URL",
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL_NON_POOLING",
  "NEON_DATABASE_URL",
);

export const PROVEEDORES_DISPONIBLES: readonly ProveedorIdentidad[] = ["discord", "google"];

/**
 * No se habilita un inicio de sesión efímero. Sin base y secreto persistentes, una persona podría
 * entrar hoy y descubrir mañana que no existe su agenda o que la sesión se invalidó. Es mejor
 * mostrar que falta completar la configuración que ofrecer una cuenta a medias.
 */
export const ACCESO_LISTO = Boolean(URL_SUPABASE && CLAVE_PUBLICA_SUPABASE);

export function proveedorDisponible(valor: string): valor is ProveedorIdentidad {
  return PROVEEDORES_DISPONIBLES.includes(valor as ProveedorIdentidad);
}
