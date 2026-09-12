import "server-only";
import type { User } from "@supabase/supabase-js";

export type EstadoSincronizacion =
  | "discord_pendiente"
  | "panel_pendiente"
  | "sincronizado"
  | "conflicto"
  | "no_disponible";

function texto(dato: unknown): string {
  return typeof dato === "string" ? dato.trim() : "";
}

export function identidadDiscordDe(usuario: User) {
  const identidad = usuario.identities?.find((item) => item.provider === "discord");
  if (!identidad) return null;

  const datos = identidad.identity_data ?? {};
  const discordId = texto(datos.sub) || texto(datos.provider_id) || texto(identidad.id);
  const discordTag =
    texto(datos.user_name) || texto(datos.preferred_username) || texto(datos.name) || texto(datos.full_name);
  const nombre = texto(datos.global_name) || texto(datos.full_name) || texto(datos.name) || discordTag;
  if (!discordId || !nombre) return null;

  return { supabaseId: usuario.id, discordId, discordTag: discordTag || nombre, nombre };
}

export async function sincronizarJugador(usuario: User): Promise<EstadoSincronizacion> {
  const identidad = identidadDiscordDe(usuario);
  if (!identidad) return "discord_pendiente";

  const panel = process.env.PANEL_API_URL?.trim().replace(/\/$/, "");
  const secreto = process.env.KRIPTA_SYNC_SECRET?.trim();
  if (!panel || !secreto) return "panel_pendiente";

  try {
    const respuesta = await fetch(`${panel}/integraciones/kripta/perfil`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${secreto}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(identidad),
      cache: "no-store",
      signal: AbortSignal.timeout(5_000),
    });
    if (respuesta.ok) return "sincronizado";
    if (respuesta.status === 409) return "conflicto";
    return "no_disponible";
  } catch {
    return "no_disponible";
  }
}
