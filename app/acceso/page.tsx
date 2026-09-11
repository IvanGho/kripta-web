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
  description: "Entrá de forma segura con Discord o Google para guardar tu lugar en Monsterland.",
  alternates: { canonical: "/acceso" },
  robots: { index: false, follow: false },
};

export default async function Acceso() {
  if (ACCESO_LISTO && (await auth())) redirect("/mi-kripta");

  const discord = ACCESO_LISTO && PROVEEDORES_DISPONIBLES.includes("discord");
  const google = ACCESO_LISTO && PROVEEDORES_DISPONIBLES.includes("google");

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
          </div>

          {ACCESO_LISTO ? (
            <p className="acceso-nota">
              Discord te identifica para la comunidad. Google sólo simplifica el acceso. Nunca publicamos ni leemos tus mensajes.
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
