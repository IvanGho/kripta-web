import type { Metadata } from "next";
import Image from "next/image";
import { Cabecera } from "../componentes/cabecera";
import { Pie } from "../componentes/pie";
import { DatosEstructurados } from "../componentes/datos-estructurados";
import { herramienta, preguntas } from "../lib/datos-estructurados";
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

/**
 * Las respuestas van explícitas y resumidas, no extraídas del HTML: el texto de la página está
 * escrito para leerse y estas tienen que ser cortas y fieles. Las preguntas son literalmente los
 * `h2` de abajo, así que el contenido para esto ya existía.
 */
const PREGUNTAS = [
  {
    pregunta: "¿Cómo se anota el Truco?",
    respuesta:
      "Una partida de truco argentino se juega a 30 puntos divididos en dos mitades: las malas (1 al 15) y las buenas (16 al 30). Se anota de a fósforos y cada grupo de cinco se cierra formando un cuadrado con una diagonal. Gana quien primero cruza los 30.",
  },
  {
    pregunta: "¿Se puede usar en el celular?",
    respuesta:
      "Sí. Está pensado para el celular apoyado en la mesa, con botones grandes, y se puede instalar como app desde el menú del navegador. La partida queda guardada, así que no se pierde si cerrás la pestaña.",
  },
];

export default function Pagina() {
  return (
    <>
      <DatosEstructurados
        datos={herramienta({
          nombre: "Anotador de Truco online",
          descripcion:
            "Anotador de Truco argentino gratis y sin registro: malas y buenas hasta 30 puntos, con fósforos como en la mesa.",
          ruta: "/anotador",
        })}
      />
      <DatosEstructurados datos={preguntas(PREGUNTAS)} />

      <Cabecera />
      {/* `overflow-x-clip` recorta el resplandor decorativo, que mide 520px de ancho y en un teléfono
          de 390 sobresalía 65px de cada lado generando desplazamiento horizontal en toda la página.
          Se usa `clip` y no `hidden` porque `hidden` crea un contenedor de scroll y eso rompe el
          `position: sticky` de la cabecera. */}
      <main
        id="contenido"
        className="herramienta-pagina llaves relative overflow-x-clip pb-16"
      >
        <div className="resplandor left-1/2 top-[-120px] h-[260px] w-[520px] -translate-x-1/2 bg-acento/15" />
        <section className="herramienta-cabecera relative z-10 mx-auto max-w-6xl px-5 pt-10 sm:pt-16">
          <div className="herramienta-intro">
            <p className="sobre-titulo">Equipo de la Kripta · 02</p>
            <h1 className="titular-seccion">
              Anotá la partida.
              <br />
              <span className="text-acento-2">Que nadie pierda la cuenta.</span>
            </h1>
            <p>
              Malas y buenas hasta 30, con los fósforos de la mesa. Tocá para
              sumar: no hay registro ni publicidad.
            </p>
            <ul
              className="herramienta-datos"
              aria-label="Características del anotador"
            >
              <li>
                <strong>30</strong>
                <span>puntos</span>
              </li>
              <li>
                <strong>5</strong>
                <span>fósforos</span>
              </li>
              <li>
                <strong>∞</strong>
                <span>partidas</span>
              </li>
            </ul>
          </div>
          <figure className="herramienta-escena herramienta-escena-truco">
            <Image
              src="/imagenes/herramienta-anotador-v2.webp"
              alt="Cinco fósforos sobre una mesa de basalto forman la cuenta tradicional del Truco."
              fill
              sizes="(max-width: 767px) 100vw, 50vw"
              preload
            />
            <figcaption>Malas / buenas / revancha</figcaption>
          </figure>
        </section>
        <div className="herramienta-contenido relative z-10 mx-auto max-w-3xl px-5">
          <div className="herramienta-encabezado-panel">
            <span className="sobre-titulo">Tablero de mesa</span>
            <p>La partida queda guardada en este navegador.</p>
          </div>

          <Anotador />

          <section className="mt-14 space-y-4 text-sm leading-relaxed text-tenue">
            <h2 className="text-lg font-bold text-texto">
              Cómo se anota el Truco
            </h2>
            <p>
              Una partida de truco argentino se juega normalmente a 30 puntos,
              divididos en dos mitades: las{" "}
              <strong className="text-texto">malas</strong> (del 1 al 15) y las{" "}
              <strong className="text-texto">buenas</strong> (del 16 al 30). Se
              anota de a fósforos, y cada grupo de cinco se cierra formando un
              cuadrado con una diagonal, que es la forma tradicional de la mesa.
            </p>
            <p>
              Los puntos salen del envido y sus variantes, del truco cantado y
              de las flores cuando se juega con flor. Quien primero cruza los 30
              gana la partida.
            </p>
            <h2 className="text-lg font-bold text-texto">
              ¿Se puede usar en el celular?
            </h2>
            <p>
              Sí. Está pensada para el celular apoyado en la mesa, con botones
              grandes. Además se puede instalar como app desde el menú del
              navegador y queda con ícono en la pantalla de inicio.
            </p>
          </section>
        </div>
      </main>
      <Pie />
    </>
  );
}
