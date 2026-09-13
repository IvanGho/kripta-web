import { cambiarEstado, trabajosGenerando } from "@/app/lib/automatizacion/repositorio";
import { enviarTexto, enviarVideo } from "@/app/lib/automatizacion/telegram";
import { consultarVideoVeo, descargarVideoVeo } from "@/app/lib/automatizacion/veo";

export type ResultadoPoll = { id: string; estado: string };

/** Consulta operaciones en curso y notifica al chat sólo cuando hay un cambio. */
export async function revisarVideosPendientes(limite = 6): Promise<ResultadoPoll[]> {
  const trabajos = await trabajosGenerando(limite);
  const resultado: ResultadoPoll[] = [];

  for (const trabajo of trabajos) {
    if (!trabajo.operacionVeo) {
      resultado.push({ id: trabajo.id, estado: "esperando-operacion" });
      continue;
    }

    try {
      const operacion = await consultarVideoVeo(trabajo.operacionVeo);
      if (operacion.estado === "pendiente") {
        resultado.push({ id: trabajo.id, estado: "generando" });
        continue;
      }
      if (operacion.estado === "fallido") {
        await cambiarEstado({ id: trabajo.id, desde: "generando", hacia: "fallido" });
        await enviarTexto(trabajo.chatId, `Veo no pudo completar “${trabajo.especificacion.titulo}”: ${operacion.detalle}`);
        resultado.push({ id: trabajo.id, estado: "fallido" });
        continue;
      }

      const listo = await cambiarEstado({
        id: trabajo.id,
        desde: "generando",
        hacia: "listo",
        videoOrigenUrl: operacion.videoUrl,
      });
      if (!listo) continue;

      const video = await descargarVideoVeo(operacion.videoUrl);
      await enviarVideo(
        trabajo.chatId,
        video,
        `${trabajo.especificacion.slug}-veo.mp4`,
        `Preview: ${trabajo.especificacion.titulo}\n¿Lo aprobamos para la web?`,
        [[
          { text: "Aprobar", callback_data: `escena:aprobar:${trabajo.id}` },
          { text: "Rechazar", callback_data: `escena:rechazar:${trabajo.id}` },
        ]],
      );
      resultado.push({ id: trabajo.id, estado: "listo" });
    } catch (error) {
      const detalle = error instanceof Error ? error.message : "Error desconocido";
      console.error(`[automatizacion] Poll falló para ${trabajo.id}: ${detalle}`);
      resultado.push({ id: trabajo.id, estado: "error-transitorio" });
    }
  }

  return resultado;
}
