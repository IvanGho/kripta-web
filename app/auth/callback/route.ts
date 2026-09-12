import { NextResponse } from "next/server";
import { ACCESO_LISTO } from "../../lib/identidad";
import { crearClienteServidor } from "../../lib/supabase/server";

const DESTINOS_PERMITIDOS = new Set(["/mi-kripta"]);

function destinoSeguro(valor: string | null) {
  return valor && DESTINOS_PERMITIDOS.has(valor) ? valor : "/mi-kripta";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const destino = destinoSeguro(url.searchParams.get("next"));
  const codigo = url.searchParams.get("code");
  if (!ACCESO_LISTO || !codigo) {
    return NextResponse.redirect(new URL("/acceso?error=oauth", url.origin));
  }

  const supabase = await crearClienteServidor();
  const { data, error } = await supabase.auth.exchangeCodeForSession(codigo);
  if (error || !data.user) {
    return NextResponse.redirect(new URL("/acceso?error=oauth", url.origin));
  }

  return NextResponse.redirect(new URL(destino, url.origin));
}
