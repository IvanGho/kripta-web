import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "../../auth";
import { Cabecera } from "../componentes/cabecera";
import { Pie } from "../componentes/pie";
import { ACCESO_LISTO } from "../lib/identidad";
import { cerrarSesion } from "../acceso/acciones";

export const metadata: Metadata = {
  title: "Mi Kripta",
  description: "Tu lugar personal para seguir Monsterland.",
  alternates: { canonical: "/mi-kripta" },
  robots: { index: false, follow: false },
};

export default async function MiKripta() {
  if (!ACCESO_LISTO) redirect("/acceso");
  const sesion = await auth();
  if (!sesion?.user) redirect("/acceso");

  const nombre = sesion.user.name?.trim() || "Jugador";

  return (
    <>
      <Cabecera />
      <main id="contenido" className="mi-kripta mx-auto w-full max-w-6xl px-5">
        <section className="mi-kripta-cabecera">
          <p className="sobre-titulo">Sesión protegida</p>
          <h1 className="titular-seccion">Bienvenido, <span className="text-acento-2">{nombre}.</span></h1>
          <p>Tu cuenta ya tiene un lugar propio. A medida que se habiliten las próximas funciones, vas a encontrar acá tus torneos, avisos y agenda.</p>
        </section>

        <div className="mi-kripta-grid">
          <section className="tarjeta mi-kripta-paso" aria-labelledby="titulo-agenda">
            <span>01</span>
            <h2 id="titulo-agenda">Tu agenda</h2>
            <p>Cuando guardes un torneo, este será el lugar para revisar los recordatorios y entrar al check-in.</p>
            <Link href="/#torneos" className="boton-sec text-sm">Explorar torneos <b aria-hidden="true">↓</b></Link>
          </section>
          <section className="tarjeta mi-kripta-paso" aria-labelledby="titulo-perfil">
            <span>02</span>
            <h2 id="titulo-perfil">Tu perfil competitivo</h2>
            <p>La inscripción seguirá confirmándose en Discord para que el torneo use la misma identidad que el servidor.</p>
            <Link href="/#empezar" className="boton-sec text-sm">Ver cómo participar <b aria-hidden="true">↓</b></Link>
          </section>
          <section className="tarjeta mi-kripta-paso" aria-labelledby="titulo-sesion">
            <span>03</span>
            <h2 id="titulo-sesion">Tu sesión</h2>
            <p>Podés cerrar esta sesión en cualquier momento desde este dispositivo.</p>
            <form action={cerrarSesion}>
              <button type="submit" className="boton-sec text-sm">Cerrar sesión</button>
            </form>
          </section>
        </div>
      </main>
      <Pie />
    </>
  );
}
