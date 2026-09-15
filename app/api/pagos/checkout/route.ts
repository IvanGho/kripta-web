import { NextRequest, NextResponse } from "next/server";
import { ACCESO_LISTO } from "../../../lib/identidad";
import { identidadDiscordDe, sincronizarJugador } from "../../../lib/sincronizar-jugador";
import { crearClienteServidor } from "../../../lib/supabase/server";

function volver(request: NextRequest, estado: string, codigo = 303) {
  const url = new URL("/pago/resultado", request.url);
  url.searchParams.set("estado", estado);
  return NextResponse.redirect(url, codigo);
}

function estadoDeCodigo(codigo: unknown): string {
  const estados: Record<string, string> = {
    NO_INSCRIPTO: "no_inscripto",
    EDAD_PENDIENTE: "edad_pendiente",
    YA_CUBIERTO: "ya_cubierto",
    INSCRIPCION_CERRADA: "inscripcion_cerrada",
    PERFIL_NO_VINCULADO: "perfil_no_vinculado",
    JUGADOR_NO_HABILITADO: "perfil_no_vinculado",
    CHECKOUT_NO_CONFIGURADO: "no_disponible",
  };
  return estados[String(codigo)] ?? "error";
}

function esCheckoutMercadoPago(valor: unknown): valor is string {
  if (typeof valor !== "string") return false;
  try {
    const url = new URL(valor);
    const host = url.hostname.toLowerCase();
    return (
      url.protocol === "https:" &&
      (host === "mercadopago.com.ar" ||
        host.endsWith(".mercadopago.com.ar") ||
        host === "mercadopago.com" ||
        host.endsWith(".mercadopago.com"))
    );
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const origen = request.headers.get("origin");
  if (!origen || origen !== request.nextUrl.origin) {
    return volver(request, "error", 403);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return volver(request, "error", 400);
  }
  const torneoId = Number(formData.get("torneoId"));
  if (!Number.isSafeInteger(torneoId) || torneoId <= 0 || formData.get("acepto") !== "1") {
    return volver(request, "error", 400);
  }

  if (!ACCESO_LISTO) return volver(request, "no_disponible");
  const supabase = await crearClienteServidor();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    const acceso = new URL("/acceso", request.url);
    acceso.searchParams.set("next", `/pago/iniciar?torneo=${torneoId}`);
    return NextResponse.redirect(acceso, 303);
  }
  if (!identidadDiscordDe(data.user)) return volver(request, "perfil_no_vinculado");

  const estadoPerfil = await sincronizarJugador(data.user);
  if (estadoPerfil === "conflicto") return volver(request, "perfil_no_vinculado");

  const panel = process.env.PANEL_API_URL?.trim().replace(/\/$/, "");
  const secreto = process.env.KRIPTA_CHECKOUT_SECRET?.trim();
  if (!panel || !secreto) return volver(request, "no_disponible");

  try {
    const respuesta = await fetch(`${panel}/integraciones/kripta/checkout`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${secreto}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ supabaseId: data.user.id, torneoId }),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    const cuerpo = (await respuesta.json().catch(() => null)) as
      | { checkoutUrl?: unknown; codigo?: unknown }
      | null;
    if (!respuesta.ok) return volver(request, estadoDeCodigo(cuerpo?.codigo));
    if (!esCheckoutMercadoPago(cuerpo?.checkoutUrl)) return volver(request, "error");
    return NextResponse.redirect(cuerpo.checkoutUrl, 303);
  } catch {
    return volver(request, "error");
  }
}
