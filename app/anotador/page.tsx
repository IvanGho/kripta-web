import type { Metadata } from "next";
import { Cabecera } from "../componentes/cabecera";
import { Pie } from "../componentes/pie";
import { Anotador } from "./anotador";

/**
 * Esta página existe por dos razones: le sirve a la comunidad en la mesa, y trae tráfico
 * de Google de gente que busca "anotador de truco" y no conoce el servidor. Por eso el
 * texto de abajo no es relleno: es lo que hace que la página se pueda encontrar.
 */
export const metadata: Metadata = {
  title: "Anotador de Truco online",
  description:
    "Anotador de Truco argentino gratis y sin registro: malas y buenas hasta 30 puntos, con fósforos como en la mesa. Funciona desde el celular.",
  alternates: { canonical: "/anotador" },
};

export default function Pagina() {
  return (
    <>
      <Cabecera />
      <main id="contenido" className="grilla relative mx-auto max-w-3xl px-5 pb-16 pt-12">
        <div className="resplandor left-1/2 top-[-120px] h-[260px] w-[520px] -translate-x-1/2 bg-acento/15" />
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold uppercase leading-tight sm:text-5xl">
            Anotador de <span className="neon">Truco</span>
          </h1>
          <p className="mt-3 text-tenue">
            Malas y buenas hasta 30. Tocá para sumar, sin registro y sin publicidad.
          </p>

          <Anotador />

          <section className="mt-14 space-y-4 text-sm leading-relaxed text-tenue">
            <h2 className="text-lg font-bold text-texto">Cómo se anota el Truco</h2>
            <p>
              Una partida de truco argentino se juega normalmente a 30 puntos, divididos en dos
              mitades: las <strong className="text-texto">malas</strong> (del 1 al 15) y las{" "}
              <strong className="text-texto">buenas</strong> (del 16 al 30). Se anota de a
              fósforos, y cada grupo de cinco se cierra formando un cuadrado con una diagonal,
              que es la forma tradicional de la mesa.
            </p>
            <p>
              Los puntos salen del envido y sus variantes, del truco cantado y de las flores
              cuando se juega con flor. Quien primero cruza los 30 gana la partida.
            </p>
            <h2 className="text-lg font-bold text-texto">¿Se puede usar en el celular?</h2>
            <p>
              Sí. Está pensada para el celular apoyado en la mesa, con botones grandes. Además
              se puede instalar como app desde el menú del navegador y queda con ícono en la
              pantalla de inicio.
            </p>
          </section>
        </div>
      </main>
      <Pie />
    </>
  );
}
