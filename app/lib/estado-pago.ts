import "server-only";
import type { User } from "@supabase/supabase-js";

/** Consulta sólo el estado conciliado; no trae IDs, importes ni datos del medio de pago. */
export async function obtenerEstadoPago(
  usuario: User | null,
  torneoId: number,
): Promise<string | null> {
  const panel = process.env.PANEL_API_URL?.trim().replace(/\/$/, "");
  const secreto = process.env.KRIPTA_CHECKOUT_SECRET?.trim();
  if (!usuario || !panel || !secreto || !Number.isSafeInteger(torneoId) || torneoId <= 0) {
    return null;
  }
  try {
    const respuesta = await fetch(`${panel}/integraciones/kripta/pago-estado`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${secreto}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ supabaseId: usuario.id, torneoId }),
      cache: "no-store",
      signal: AbortSignal.timeout(5_000),
    });
    if (!respuesta.ok) return null;
    const cuerpo = (await respuesta.json()) as { estado?: unknown };
    return typeof cuerpo.estado === "string" ? cuerpo.estado : null;
  } catch {
    return null;
  }
}
