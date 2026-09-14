import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { ACCESO_LISTO, CLAVE_PUBLICA_SUPABASE, URL_SUPABASE } from "../identidad";

/** Refresca sesiones sin convertir Proxy en una capa de autorización. */
export async function actualizarSesion(request: NextRequest) {
  let response = NextResponse.next({ request });
  if (!ACCESO_LISTO) return response;

  const supabase = createServerClient(URL_SUPABASE, CLAVE_PUBLICA_SUPABASE, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesNuevas) {
        for (const { name, value } of cookiesNuevas) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesNuevas) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // getClaims valida el JWT; no se confía en getSession() del lado del servidor.
  await supabase.auth.getClaims();
  return response;
}
