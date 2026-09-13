import { timingSafeEqual } from "node:crypto";
import { revisarVideosPendientes } from "@/app/lib/automatizacion/poll";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function autorizado(request: Request): boolean {
  const secreto = process.env.CRON_SECRET?.trim();
  const cabecera = request.headers.get("authorization") ?? "";
  const esperado = secreto ? `Bearer ${secreto}` : "";
  if (!esperado) return false;
  const a = Buffer.from(cabecera);
  const b = Buffer.from(esperado);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(request: Request): Promise<Response> {
  if (!autorizado(request)) return new Response("No autorizado", { status: 401 });

  return Response.json({ ok: true, procesados: await revisarVideosPendientes() });
}
