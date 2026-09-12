import type { NextRequest } from "next/server";
import { actualizarSesion } from "./app/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return actualizarSesion(request);
}

export const config = {
  matcher: ["/acceso/:path*", "/mi-kripta/:path*", "/auth/:path*"],
};
