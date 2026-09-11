import { handlers } from "../../../../auth";
import { ACCESO_LISTO } from "../../../lib/identidad";

export const runtime = "nodejs";

function accesoNoConfigurado() {
  return Response.json(
    { error: "El acceso de usuarios todavía no está configurado." },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}

export async function GET(request: Request) {
  if (!ACCESO_LISTO) return accesoNoConfigurado();
  return handlers.GET(request as never);
}

export async function POST(request: Request) {
  if (!ACCESO_LISTO) return accesoNoConfigurado();
  return handlers.POST(request as never);
}
