import type { Metadata } from "next";
import { Cabecera } from "../componentes/cabecera";
import { Pie } from "../componentes/pie";
import { Convertidor } from "./convertidor";

export const metadata: Metadata = {
  title: "Convertidor de sensibilidad: Valorant, CS2, Apex y Overwatch",
  description:
    "Convertí tu sensibilidad entre Valorant, CS2, Apex Legends y Overwatch 2 manteniendo el mismo cm/360. Gratis y sin registro.",
  alternates: { canonical: "/sensibilidad" },
};

export default function Pagina() {
  return (
    <>
      <Cabecera />
      <main id="contenido" className="grilla relative mx-auto max-w-3xl px-5 pb-16 pt-12">
        <div className="resplandor left-1/2 top-[-120px] h-[260px] w-[520px] -translate-x-1/2 bg-acento/15" />
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold uppercase leading-tight sm:text-5xl">
            Convertir <span className="neon">sensibilidad</span>
          </h1>
          <p className="mt-3 text-tenue">
            Pasá tu mira de un juego a otro sin perder la memoria muscular.
          </p>

          <Convertidor />

          <section className="mt-14 space-y-4 text-sm leading-relaxed text-tenue">
            <h2 className="text-lg font-bold text-texto">Por qué no alcanza con copiar el número</h2>
            <p>
              Cada juego decide cuántos grados gira la cámara por cada paso que reporta el mouse.
              Ese valor se llama <strong className="text-texto">yaw</strong>: en CS2 es 0,022 y en
              Valorant 0,07. Por eso poner 0,4 en los dos no da el mismo giro, aunque el número
              sea idéntico.
            </p>
            <p>
              Convertir bien es mantener el{" "}
              <strong className="text-texto">cm/360</strong>: los centímetros que tenés que
              arrastrar el mouse para dar una vuelta completa. Es la única medida que no depende
              del juego, y es la que usa esta calculadora.
            </p>
            <h2 className="text-lg font-bold text-texto">De Valorant a CS2</h2>
            <p>
              Multiplicá tu sensibilidad de Valorant por <strong className="text-texto">3,18</strong>.
              No es un número mágico: es 0,07 dividido 0,022. Para el otro lado, dividí por 3,18.
            </p>
            <h2 className="text-lg font-bold text-texto">¿Y el eDPI?</h2>
            <p>
              El eDPI es el DPI multiplicado por la sensibilidad. Sirve para comparar dos jugadores
              del <em>mismo</em> juego, pero no entre juegos distintos, justamente porque el yaw
              cambia. Para comparar entre juegos, mirá el cm/360.
            </p>
          </section>
        </div>
      </main>
      <Pie />
    </>
  );
}
