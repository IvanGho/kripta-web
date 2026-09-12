import "server-only";

export type ProveedorIdentidad = "discord" | "google";

function primeraVariable(...nombres: string[]): string {
  for (const nombre of nombres) {
    const valor = process.env[nombre]?.trim();
    if (valor) return valor;
  }
  return "";
}

export const URL_SUPABASE = primeraVariable("NEXT_PUBLIC_SUPABASE_URL");
export const CLAVE_PUBLICA_SUPABASE = primeraVariable("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
export const PROVEEDORES_DISPONIBLES: readonly ProveedorIdentidad[] = ["discord", "google"];

/**
 * No se habilita un inicio de sesión efímero. Sin base y secreto persistentes, una persona podría
 * entrar hoy y descubrir mañana que no existe su agenda o que la sesión se invalidó. Es mejor
 * mostrar que falta completar la configuración que ofrecer una cuenta a medias.
 */
export const ACCESO_LISTO = Boolean(
  URL_SUPABASE && CLAVE_PUBLICA_SUPABASE,
);

export function proveedorDisponible(valor: string): valor is ProveedorIdentidad {
  return PROVEEDORES_DISPONIBLES.includes(valor as ProveedorIdentidad);
}
