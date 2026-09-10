"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Cabecera } from "./componentes/cabecera";
import { Pie } from "./componentes/pie";

/**
 * La pantalla que se muestra si el renderizado de una página termina en error.
 *
 * ## Cuándo aparece de verdad
 *
 * El sitio ya tolera la falla más probable: si el panel no contesta, `obtenerDatos()` cae en los
 * datos de ejemplo en lugar de tirar error, justamente para que una caída del panel no se lleve
 * puesta la página de captación. Así que esto es la red debajo de la red: queda para lo que no se
 * previó. Y es la que importa, porque lo imprevisto es exactamente lo que no se puede manejar caso
 * por caso.
 *
 * ## Por qué es de cliente
 *
 * Los límites de error de React tienen que ser componentes de cliente: reciben una función para
 * reintentar y por lo tanto necesitan JavaScript. No es una elección, es un requisito de la
 * convención de Next. Por eso también este archivo no puede exportar `metadata`.
 *
 * ## `retry`, no `reset`
 *
 * En Next 16.3 la prop estable para volver a intentar es `retry`, que **vuelve a pedir y a
 * renderizar** los hijos del límite de error. `reset` sigue existiendo pero sólo limpia el estado
 * sin volver a pedir los datos, y acá eso no arreglaría nada: si el error vino de una lectura que
 * falló, hay que rehacer la lectura. Esta distinción es nueva y no está en el conocimiento de los
 * modelos: la referencia es
 * `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/error.md`, que la marca
 * como estable a partir de `v16.3.0`.
 *
 * ## Qué NO se muestra
 *
 * Ni `error.message` ni `error.digest`. En producción Next ya reemplaza los errores de servidor por
 * un mensaje genérico para no filtrar detalles, pero los de cliente llegan con el mensaje original,
 * y un mensaje original en pantalla puede nombrar una ruta interna, una variable o la URL del panel.
 * Al visitante no le sirve para nada; a quien esté mirando el sitio de afuera, sí. El detalle va a
 * la consola y a los registros de Vercel, que es donde se puede leer sin publicarlo.
 *
 * Este archivo no cubre errores del layout raíz: para eso haría falta `global-error.tsx`, que
 * reemplaza el documento entero y se queda sin los estilos globales. No se agrega porque el layout
 * de este sitio no hace nada que pueda fallar: declara la tipografía y los metadatos.
 */
export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    // A la consola del navegador y a los registros del servidor, no a la pantalla.
    console.error("[kripta-web] falló el renderizado", error);
  }, [error]);

  return (
    <>
      {/*
        La cabecera y el pie van explícitos porque en este sitio no viven en el layout raíz: cada
        página los pone. Sin ellos, la pantalla de error se lee como si el visitante se hubiera ido
        del sitio, que es exactamente el problema que esta página existe para evitar.

        Al importarlos desde un componente de cliente, los dos se compilan como cliente. Es
        JavaScript que se baja sólo cuando este límite de error se activa, o sea casi nunca, y a
        cambio la persona conserva la navegación para irse a otra parte en lugar de quedar en una
        pantalla muerta con un solo botón.
      */}
      <Cabecera />

      <main
        id="contenido"
        className="grilla relative mx-auto flex max-w-3xl flex-col items-center px-5 pb-24 pt-20 text-center"
      >
        {/* Ámbar y no verde: es la única superficie del sitio que avisa que algo salió mal. */}
        <div className="resplandor left-1/2 top-[-120px] h-[280px] w-[520px] -translate-x-1/2 bg-alerta/10" />

        <div className="relative z-10">
          <h1 className="text-2xl font-extrabold uppercase leading-tight sm:text-4xl">
            Se cortó la <span className="neon">luz</span> un segundo
          </h1>

          <p className="mx-auto mt-4 max-w-md text-tenue">
            Algo falló de nuestro lado al armar esta página. No es nada que hayas hecho vos, y lo más
            probable es que reintentando ya funcione.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            {/*
              Es un <button> y no un enlace porque no navega a ningún lado: vuelve a intentar el
              renderizado en el lugar. Un enlace acá haría que un lector de pantalla lo anuncie como
              "enlace", y quien lo escuche esperaría irse a otra página.
            */}
            <button type="button" onClick={() => retry()} className="boton text-base">
              Volver a intentar
            </button>
            <Link href="/" className="boton-sec text-base">
              Ir a la portada
            </Link>
          </div>
        </div>
      </main>

      <Pie />
    </>
  );
}
