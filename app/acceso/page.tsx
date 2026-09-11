import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "../../auth";
import { Cabecera } from "../componentes/cabecera";
import { Pie } from "../componentes/pie";
import { ACCESO_LISTO, PROVEEDORES_DISPONIBLES } from "../lib/identidad";
import { iniciarSesion } from "./acciones";

export const metadata: Metadata = {
  title: "Entrar a tu Kripta",
  description: "Entrá de forma segura con Discord, Google o Apple para guardar tu lugar en Monsterland.",
  alternates: { canonical: "/acceso" },
  robots: { index: false, follow: false },
};

export default async function Acceso() {
  if (ACCESO_LISTO && (await auth())) redirect("/mi-kripta");

  const discord = ACCESO_LISTO && PROVEEDORES_DISPONIBLES.includes("discord");
  const google = ACCESO_LISTO && PROVEEDORES_DISPONIBLES.includes("google");
  const apple = ACCESO_LISTO && PROVEEDORES_DISPONIBLES.includes("apple");

  return (
    <>
      <Cabecera />
      <main id="contenido" className="acceso-kripta">
        <div className="acceso-resplandor" aria-hidden="true" />
        <section className="acceso-tarjeta tarjeta" aria-labelledby="titulo-acceso">
          <p className="sobre-titulo">Tu lugar en Monsterland</p>
          <h1 id="titulo-acceso" className="titular-seccion">
            Entrá a tu
            <br />
            <span className="text-acento-2">Kripta.</span>
          </h1>
          <p className="acceso-bajada">
            Guardá tus recordatorios, seguí torneos y prepará tu perfil desde una cuenta que controlás vos.
          </p>

          <div className="proveedores-acceso" aria-label="Métodos para iniciar sesión">
            <form action={iniciarSesion}>
              <input type="hidden" name="proveedor" value="discord" />
              <button type="submit" className="proveedor-boton proveedor-discord" disabled={!discord}>
                <span className="proveedor-marca" aria-hidden="true">◉</span>
                Continuar con Discord
                <span className="proveedor-flecha" aria-hidden="true">→</span>
              </button>
            </form>
            <form action={iniciarSesion}>
              <input type="hidden" name="proveedor" value="google" />
              <button type="submit" className="proveedor-boton" disabled={!google}>
                <span className="proveedor-google" aria-hidden="true">G</span>
                Continuar con Google
                <span className="proveedor-flecha" aria-hidden="true">→</span>
              </button>
            </form>
            <form action={iniciarSesion}>
              <input type="hidden" name="proveedor" value="apple" />
              <button type="submit" className="proveedor-boton proveedor-apple" disabled={!apple}>
                <span className="proveedor-apple-icono" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor" focusable="false">
                    <path d="M16.7 12.6c0-2.3 1.9-3.4 2-3.5a4.3 4.3 0 0 0-3.4-1.8c-1.4-.2-2.8.9-3.5.9-.7 0-1.8-.9-3-.9-1.5 0-3 .9-3.7 2.3-1.6 2.8-.4 6.9 1.1 9.1.8 1 1.7 2.2 2.9 2.1 1.2-.1 1.6-.8 3-.8 1.4 0 1.8.8 3 .8 1.3 0 2.1-1.1 2.9-2.2.9-1.2 1.3-2.4 1.3-2.5-.1 0-2.6-1-2.6-3.5Zm-2.3-6.8c.7-.9 1.1-2.1 1-3.3-1 .1-2.2.7-2.9 1.6-.6.7-1.2 1.9-1 3.1 1.1.1 2.2-.6 2.9-1.4Z" />
                  </svg>
                </span>
                Continuar con Apple
                <span className="proveedor-flecha" aria-hidden="true">→</span>
              </button>
            </form>
          </div>

          {ACCESO_LISTO ? (
            <p className="acceso-nota">
              Discord te identifica para la comunidad. Google y Apple sólo simplifican el acceso. Nunca publicamos ni leemos tus mensajes.
            </p>
          ) : (
            <p className="acceso-pendiente" role="status">
              El acceso personal se está preparando. Podés seguir explorando torneos y herramientas sin cuenta.
            </p>
          )}

          <p className="acceso-legal">
            Al entrar, leés nuestra <Link href="/legal/privacidad">política de privacidad</Link> y los <Link href="/legal/terminos">términos de la comunidad</Link>.
          </p>
        </section>
      </main>
      <Pie />
    </>
  );
}
