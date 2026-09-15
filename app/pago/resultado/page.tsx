import type { Metadata } from "next";
import Link from "next/link";
import { Cabecera } from "../../componentes/cabecera";
import { Pie } from "../../componentes/pie";
import { ACCESO_LISTO } from "../../lib/identidad";
import { obtenerEstadoPago } from "../../lib/estado-pago";
import { crearClienteServidor } from "../../lib/supabase/server";

export const metadata: Metadata = {
  title: "Estado del pago",
  alternates: { canonical: "/pago/resultado" },
  robots: { index: false, follow: false },
};

const MENSAJES: Record<string, { titulo: string; texto: string; tono?: string }> = {
  aprobado: {
    titulo: "Estamos verificando la operación.",
    texto: "Volviste desde Mercado Pago. La inscripción queda confirmada únicamente cuando el webhook aprobado aparece en el panel; normalmente tarda segundos.",
  },
  pendiente: {
    titulo: "El pago está pendiente.",
    texto: "Todavía no fue acreditado. No vuelvas a pagar: Mercado Pago y el panel actualizarán el estado cuando termine la revisión.",
  },
  fallido: {
    titulo: "El pago no se completó.",
    texto: "No confirmamos ningún cobro. Podés volver al torneo e intentar otra vez con el mismo enlace.",
    tono: "pago-resultado-error",
  },
  no_inscripto: {
    titulo: "Primero falta tu inscripción.",
    texto: "Usá el botón del torneo en Discord y después volvé a pagar desde la web. No iniciamos ningún cobro.",
  },
  edad_pendiente: {
    titulo: "Falta confirmar que sos 18+.",
    texto: "Pedile al staff que revise tu ficha. Por seguridad no iniciamos cobros para torneos con dinero hasta que eso esté confirmado.",
  },
  ya_cubierto: {
    titulo: "Tu inscripción ya está cubierta.",
    texto: "El panel ya la registra como paga o cubierta por un Pase de Temporada. No tenés que pagar de nuevo.",
  },
  inscripcion_cerrada: {
    titulo: "La inscripción ya cerró.",
    texto: "No iniciamos ningún cobro. Consultá al staff antes de hacer una transferencia por otro medio.",
  },
  perfil_no_vinculado: {
    titulo: "No pudimos vincular tu perfil.",
    texto: "Volvé a Mi Kripta para verificar Discord y probá otra vez. No iniciamos ningún cobro.",
  },
  torneo_invalido: {
    titulo: "Ese torneo no admite este pago.",
    texto: "Puede ser gratuito, haber cerrado o no estar publicado. No iniciamos ningún cobro.",
  },
  no_disponible: {
    titulo: "Checkout todavía no está disponible.",
    texto: "La configuración de cobros no está completa. Podés consultar al staff; no iniciamos ningún cobro.",
  },
  error: {
    titulo: "No pudimos iniciar el checkout.",
    texto: "No se confirmó ningún pago. Esperá un minuto y probá nuevamente desde el torneo.",
    tono: "pago-resultado-error",
  },
};

const ESTADOS_CONCILIADOS: Record<string, { titulo: string; texto: string; tono?: string }> = {
  confirmado: {
    titulo: "Pago confirmado.",
    texto: "El panel ya recibió y verificó la aprobación de Mercado Pago. Tu inscripción figura paga.",
  },
  cubierto: {
    titulo: "Tu inscripción ya está cubierta.",
    texto: "No necesitás otro cobro: el panel registra un Pase de Temporada vigente.",
  },
  reembolsado: {
    titulo: "Pago reembolsado.",
    texto: "Mercado Pago informó la devolución y el panel revirtió la inscripción paga y el movimiento de caja.",
  },
  contracargo: {
    titulo: "Pago revertido.",
    texto: "Mercado Pago informó un contracargo. La inscripción ya no figura paga; consultá al staff.",
    tono: "pago-resultado-error",
  },
};

export default async function ResultadoPago({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; torneo?: string }>;
}) {
  const parametros = await searchParams;
  const estado = String(parametros.estado ?? "error");
  const torneoId = Number(parametros.torneo);
  let conciliado: string | null = null;
  if (ACCESO_LISTO && Number.isSafeInteger(torneoId) && torneoId > 0) {
    const supabase = await crearClienteServidor();
    const { data } = await supabase.auth.getUser();
    conciliado = await obtenerEstadoPago(data.user, torneoId);
  }
  const mensaje = (conciliado && ESTADOS_CONCILIADOS[conciliado]) || MENSAJES[estado] || MENSAJES.error;
  return (
    <>
      <Cabecera />
      <main id="contenido" className="pago-pagina mx-auto w-full max-w-6xl px-5">
        <section className={`pago-resultado tarjeta ${mensaje.tono ?? ""}`}>
          <p className="sobre-titulo">Estado de la inscripción</p>
          <h1 className="titular-seccion">{mensaje.titulo}</h1>
          <p>{mensaje.texto}</p>
          <div className="pago-resultado-acciones">
            <Link href="/mi-kripta" className="boton">Ir a Mi Kripta</Link>
            <Link href="/#torneos" className="boton-sec">Volver a torneos</Link>
          </div>
        </section>
      </main>
      <Pie />
    </>
  );
}
