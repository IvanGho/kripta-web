import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { CLAVE_PUBLICA_SUPABASE, URL_SUPABASE } from "../identidad";

export async function crearClienteServidor() {
  if (!URL_SUPABASE || !CLAVE_PUBLICA_SUPABASE) {
    throw new Error("SUPABASE_NO_CONFIGURADO");
  }

  const almacenCookies = await cookies();
  return createServerClient(URL_SUPABASE, CLAVE_PUBLICA_SUPABASE, {
    cookies: {
      getAll() {
        return almacenCookies.getAll();
      },
      setAll(cookiesNuevas) {
        try {
          for (const { name, value, options } of cookiesNuevas) {
            almacenCookies.set(name, value, options);
          }
        } catch {
          // Un Server Component no puede escribir cookies. El proxy refresca la sesión.
        }
      },
    },
  });
}
