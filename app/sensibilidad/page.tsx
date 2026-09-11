import type { Metadata } from "next";
import Image from "next/image";
import { Cabecera } from "../componentes/cabecera";
import { Pie } from "../componentes/pie";
import { DatosEstructurados } from "../componentes/datos-estructurados";
import { herramienta, preguntas } from "../lib/datos-estructurados";
import { Convertidor } from "./convertidor";

/**
 * El título quedaba en ~68 caracteres con el sufijo de la plantilla ("· Kripta"), por encima del
 * corte habitual en la página de resultados. Se acorta sin perder los términos que la gente
 * busca: los nombres de los juegos siguen estando en la descripción y en el texto de la página.
 */
export const metadata: Metadata = {
  title: "Convertidor de sensibilidad Valorant, CS2 y Apex",
  description:
    "Convertí tu sensibilidad entre Valorant, CS2, Apex Legends y Overwatch 2 manteniendo el mismo cm/360. Gratis y sin registro.",
  alternates: { canonical: "/sensibilidad" },
};

const PREGUNTAS = [
  {
    pregunta: "¿Por qué no alcanza con copiar el número de sensibilidad?",
    respuesta:
      "Cada juego define cuántos grados gira la cámara por cada paso del mouse: ese valor es el yaw, y en CS2 es 0,022 mientras en Valorant es 0,07. Por eso el mismo número da un giro distinto en cada juego.",
  },
  {
    pregunta: "¿Cómo paso mi sensibilidad de Valorant a CS2?",
    respuesta:
      "Multiplicá tu sensibilidad de Valorant por 3,18, que es 0,07 dividido 0,022. Para el otro lado, dividí por 3,18.",
  },
  {
    pregunta: "¿Sirve el eDPI para comparar entre juegos?",
    respuesta:
      "No. El eDPI es el DPI multiplicado por la sensibilidad y sirve para comparar jugadores del mismo juego. Entre juegos distintos hay que mirar el cm/360, porque el yaw cambia.",
  },
];

export default function Pagina() {
  return (
    <>
      <DatosEstructurados
        datos={herramienta({
          nombre: "Convertidor de sensibilidad entre shooters",
          descripcion:
            "Convertí tu sensibilidad entre Valorant, CS2, Apex Legends y Overwatch 2 manteniendo el mismo cm/360.",
          ruta: "/sensibilidad",
        })}
      />
      <DatosEstructurados datos={preguntas(PREGUNTAS)} />

      <Cabecera />
      {/* Ver el comentario de `overflow-x-clip` en app/anotador/page.tsx: recorta el resplandor, que
          es más ancho que un teléfono y causaba desplazamiento horizontal. */}
      <main
        id="contenido"
        className="herramienta-pagina llaves relative overflow-x-clip pb-16"
      >
        <div className="resplandor left-1/2 top-[-120px] h-[260px] w-[520px] -translate-x-1/2 bg-acento/15" />
        <section className="herramienta-cabecera relative z-10 mx-auto max-w-6xl px-5 pt-10 sm:pt-16">
          <div className="herramienta-intro">
            <p className="sobre-titulo">Equipo de la Kripta · 01</p>
            <h1 className="titular-seccion">
              La misma mira.
              <br />
              <span className="text-acento-2">En cualquier arena.</span>
            </h1>
            <p>
              Pasá tu sensibilidad de un juego a otro sin perder la memoria
              muscular. El giro se mantiene igual aunque cambie el número.
            </p>
            <ul
              className="herramienta-datos"
              aria-label="Características del convertidor"
            >
              <li>
                <strong>4</strong>
                <span>juegos</span>
              </li>
              <li>
                <strong>360°</strong>
                <span>misma distancia</span>
              </li>
              <li>
                <strong>0</strong>
                <span>cuentas</span>
              </li>
            </ul>
          </div>
          <figure className="herramienta-escena herramienta-escena-sensibilidad">
            <Image
              src="/imagenes/herramienta-sensibilidad-v3.webp"
              alt="Mouse de grafito con luz verde, símbolo de precisión en la Kripta."
              fill
              sizes="(max-width: 767px) 100vw, 50vw"
              preload
            />
            <figcaption>Precisión / memoria muscular</figcaption>
          </figure>
        </section>
        <div className="herramienta-contenido relative z-10 mx-auto max-w-3xl px-5">
          <div className="herramienta-encabezado-panel">
            <span className="sobre-titulo">Convertidor de precisión</span>
            <p>
              Usá tu sensibilidad y DPI actuales para calcular el mismo cm/360.
            </p>
          </div>

          <Convertidor />

          <section className="mt-14 space-y-4 text-sm leading-relaxed text-tenue">
            <h2 className="text-lg font-bold text-texto">
              Por qué no alcanza con copiar el número
            </h2>
            <p>
              Cada juego decide cuántos grados gira la cámara por cada paso que
              reporta el mouse. Ese valor se llama{" "}
              <strong className="text-texto">yaw</strong>: en CS2 es 0,022 y en
              Valorant 0,07. Por eso poner 0,4 en los dos no da el mismo giro,
              aunque el número sea idéntico.
            </p>
            <p>
              Convertir bien es mantener el{" "}
              <strong className="text-texto">cm/360</strong>: los centímetros
              que tenés que arrastrar el mouse para dar una vuelta completa. Es
              la única medida que no depende del juego, y es la que usa esta
              calculadora.
            </p>
            <h2 className="text-lg font-bold text-texto">De Valorant a CS2</h2>
            <p>
              Multiplicá tu sensibilidad de Valorant por{" "}
              <strong className="text-texto">3,18</strong>. No es un número
              mágico: es 0,07 dividido 0,022. Para el otro lado, dividí por
              3,18.
            </p>
            <h2 className="text-lg font-bold text-texto">¿Y el eDPI?</h2>
            <p>
              El eDPI es el DPI multiplicado por la sensibilidad. Sirve para
              comparar dos jugadores del <em>mismo</em> juego, pero no entre
              juegos distintos, justamente porque el yaw cambia. Para comparar
              entre juegos, mirá el cm/360.
            </p>
          </section>
        </div>
      </main>
      <Pie />
    </>
  );
}
