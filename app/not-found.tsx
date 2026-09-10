import Link from "next/link";
import type { Metadata } from "next";
import { Cabecera } from "./componentes/cabecera";
import { Pie } from "./componentes/pie";
import { BotonDiscord } from "./componentes/boton-discord";

/**
 * La página que se muestra cuando alguien pide una ruta que no existe.
 *
 * Sin este archivo, Next sirve su 404 por defecto: un texto negro sobre blanco, en la tipografía
 * del sistema, sin cabecera ni pie. Que es peor que un error: le dice al visitante que se fue del
 * sitio. Y desde una campaña de anuncios este caso pasa seguido, porque cualquier link mal copiado
 * o cualquier ruta vieja compartida en un chat aterriza acá. Alguien que llega por un anuncio y ve
 * una página en blanco se va; el mismo que ve la cabecera, el pie y un camino de vuelta, sigue.
 *
 * Al renderizarse dentro del layout raíz hereda Poppins, la paleta y la capa de grano. La cabecera
 * y el pie van explícitos porque en este proyecto no viven en el layout: cada página los pone.
 *
 * No hace falta declarar `noindex`: Next lo inyecta solo en las páginas que responden 404.
 */
export const metadata: Metadata = {
  title: "Página no encontrada",
};

export default function NoEncontrada() {
  return (
    <>
      <Cabecera />
      <main
        id="contenido"
        className="grilla relative mx-auto flex max-w-3xl flex-col items-center px-5 pb-24 pt-20 text-center"
      >
        <div className="resplandor left-1/2 top-[-120px] h-[280px] w-[520px] -translate-x-1/2 bg-acento/15" />

        <div className="relative z-10">
          <p className="text-6xl font-extrabold text-acento sm:text-7xl">404</p>

          <h1 className="mt-4 text-2xl font-extrabold uppercase leading-tight sm:text-4xl">
            Esta puerta de la <span className="neon">Kripta</span> no existe
          </h1>

          <p className="mx-auto mt-4 max-w-md text-tenue">
            Puede que el link esté mal copiado o que la página ya no esté. Lo que buscabas
            probablemente esté en la portada.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/" className="boton text-base">
              Volver a la portada
            </Link>
            <Link href="/#torneos" className="boton-sec text-base">
              Ver los torneos
            </Link>
          </div>

          {/*
            El botón de Discord también acá. Es el único punto de conversión del sitio, y esta es
            una página donde la persona ya está a punto de irse: es el lugar donde más barato sale
            ofrecerle el camino y más caro sale no hacerlo.
          */}
          <p className="mt-10 text-sm text-tenue">
            O entrá directo a la comunidad, que es donde pasa todo:
          </p>
          <div className="mt-4 flex justify-center">
            <BotonDiscord ubicacion="pagina-404" variante="secundario" className="text-sm">
              Entrar al Discord
            </BotonDiscord>
          </div>
        </div>
      </main>
      <Pie />
    </>
  );
}
