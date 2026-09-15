import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Cabecera } from "../../componentes/cabecera";
import { Pie } from "../../componentes/pie";
import { formatoARS, fechaLinda, obtenerDatos } from "../../lib/datos";
import { ACCESO_LISTO } from "../../lib/identidad";
import { identidadDiscordDe, sincronizarJugador } from "../../lib/sincronizar-jugador";
import { crearClienteServidor } from "../../lib/supabase/server";

export const metadata: Metadata = {
  title: "Pagar inscripción",
  description: "Revisá tu inscripción antes de continuar al Checkout Pro de Mercado Pago.",
  alternates: { canonical: "/pago/iniciar" },
  robots: { index: false, follow: false },
};

export default async function IniciarPago({
  searchParams,
}: {
  searchParams: Promise<{ torneo?: string }>;
}) {
  const torneoId = Number((await searchParams).torneo);
  if (!Number.isSafeInteger(torneoId) || torneoId <= 0) {
    redirect("/pago/resultado?estado=torneo_invalido");
  }

  if (!ACCESO_LISTO) redirect("/pago/resultado?estado=no_disponible");
  const supabase = await crearClienteServidor();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    const next = encodeURIComponent(`/pago/iniciar?torneo=${torneoId}`);
    redirect(`/acceso?next=${next}`);
  }

  const datos = await obtenerDatos();
  const torneo = datos.torneos.find((item) => item.id === torneoId);
  if (!torneo || datos.esEjemplo || torneo.inscripcionCentavos <= 0) {
    redirect("/pago/resultado?estado=torneo_invalido");
  }

  const identidadDiscord = identidadDiscordDe(data.user);
  const sincronizacion = await sincronizarJugador(data.user);
  const puedeContinuar = Boolean(identidadDiscord) && sincronizacion !== "conflicto";

  return (
    <>
      <Cabecera />
      <main id="contenido" className="pago-pagina mx-auto w-full max-w-6xl px-5">
        <section className="pago-resumen tarjeta" aria-labelledby="titulo-pago">
          <p className="sobre-titulo">Checkout protegido · Mercado Pago</p>
          <h1 id="titulo-pago" className="titular-seccion">Revisá antes de pagar.</h1>
          <div className="pago-torneo">
            <div>
              <span>{torneo.juego} · {torneo.formato}</span>
              <h2>{torneo.nombre}</h2>
              <p>{fechaLinda(torneo.empiezaEn)}</p>
            </div>
            <strong>{formatoARS(torneo.inscripcionCentavos)}</strong>
          </div>

          {!identidadDiscord ? (
            <div className="pago-aviso" role="status">
              <strong>Falta vincular Discord.</strong>
              <p>Es la identidad con la que comprobamos tu inscripción y hacemos el check-in.</p>
              <Link href="/mi-kripta" className="boton-sec text-sm">Vincular Discord</Link>
            </div>
          ) : sincronizacion === "conflicto" ? (
            <div className="pago-aviso pago-aviso-error" role="alert">
              <strong>Hay que revisar tu identidad.</strong>
              <p>Este Discord aparece asociado a otra cuenta. No vamos a iniciar un cobro hasta resolverlo.</p>
            </div>
          ) : (
            <form className="pago-confirmacion" action="/api/pagos/checkout" method="post">
              <input type="hidden" name="torneoId" value={torneo.id} />
              <label>
                <input type="checkbox" name="acepto" value="1" required />
                <span>
                  Confirmo que soy mayor de 18 años, que ya estoy anotado en Discord y que leí los{" "}
                  <Link href="/legal/terminos">términos, cancelaciones y reembolsos</Link>.
                </span>
              </label>
              <button type="submit" className="boton w-full" disabled={!puedeContinuar}>
                Continuar en Mercado Pago <span aria-hidden="true">→</span>
              </button>
            </form>
          )}

          <ul className="pago-garantias">
            <li>El importe sale del panel y no se puede cambiar desde el navegador.</li>
            <li>Kripta no recibe ni guarda datos de tu tarjeta.</li>
            <li>Tu pago se confirma por webhook; la pantalla de regreso no acredita nada por sí sola.</li>
          </ul>
          <Link href="/#torneos" className="pago-volver">← Volver a los torneos</Link>
        </section>
      </main>
      <Pie />
    </>
  );
}
