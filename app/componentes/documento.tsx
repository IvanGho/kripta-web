import { Cabecera } from "./cabecera";
import { Pie } from "./pie";

/**
 * El armazón de las páginas de texto largo: privacidad y términos.
 *
 * Existe porque las dos páginas tienen exactamente la misma forma (cabecera, un título, una fecha
 * de actualización, secciones de prosa, pie) y sólo cambia el contenido. Sin esto, el ancho de
 * lectura, el ritmo entre secciones y el tratamiento de los encabezados quedarían escritos dos
 * veces, y la segunda vez que alguien ajuste uno se va a olvidar del otro.
 *
 * El ancho máximo es más angosto que el del resto del sitio (`max-w-3xl` en lugar de `max-w-6xl`)
 * a propósito: son las dos únicas páginas que se leen de corrido, y una línea de texto de 1150px
 * de ancho obliga a mover la cabeza para volver al principio del renglón.
 *
 * Toma la tipografía, la paleta y las capas de fondo de `globals.css` a través de las clases
 * (`llaves`, `resplandor`, `neon`, los tokens de color). Cero valores copiados.
 */
export function Documento({
  titulo,
  resaltado,
  bajada,
  actualizado,
  children,
}: {
  /** La parte del título en blanco. */
  titulo: string;
  /** La parte del título en verde. */
  resaltado: string;
  bajada: string;
  /**
   * Cuándo se revisó el texto por última vez, en ISO (`2026-09-09`).
   *
   * Va escrita a mano y no con `new Date()` a propósito. Con la fecha calculada, la página diría
   * "actualizado hoy" todos los días sin que nadie la haya leído, que es exactamente lo contrario
   * de lo que la fecha comunica en un documento así.
   */
  actualizado: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Cabecera />
      {/* `overflow-x-clip` recorta el resplandor decorativo, más ancho que un teléfono. Sin esto las
          tres páginas legales tenían desplazamiento horizontal a 390px. */}
      <main id="contenido" className="llaves relative mx-auto max-w-3xl overflow-x-clip px-5 pb-16 pt-12">
        <div className="resplandor left-1/2 top-[-120px] h-[260px] w-[520px] -translate-x-1/2 bg-acento/15" />

        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold uppercase leading-tight sm:text-5xl">
            {titulo} <span className="neon">{resaltado}</span>
          </h1>
          <p className="mt-3 text-tenue">{bajada}</p>
          <p className="mt-6 text-xs uppercase tracking-[0.14em] text-tenue">
            Última actualización:{" "}
            <time dateTime={actualizado}>{fechaLarga(actualizado)}</time>
          </p>

          {/*
            `[&>h2]` y compañía estilan los hijos directos en lugar de pedir una clase en cada
            encabezado y en cada párrafo del contenido. Así las dos páginas se escriben como texto
            y no como una lista de className repetidos, que es donde se cuela la inconsistencia.
          */}
          <div className="mt-12 space-y-5 text-sm leading-relaxed text-tenue [&>h2]:mt-12 [&>h2]:text-lg [&>h2]:font-bold [&>h2]:text-texto [&>h2:first-child]:mt-0 [&>ul]:list-disc [&>ul]:space-y-2 [&>ul]:pl-5 [&_strong]:text-texto">
            {children}
          </div>
        </div>
      </main>
      <Pie />
    </>
  );
}

/**
 * "2026-09-09" a "9 de septiembre de 2026".
 *
 * Se construye la fecha en mediodía UTC y se formatea en la zona de Buenos Aires. Los dos detalles
 * importan: `new Date("2026-09-09")` se interpreta como medianoche UTC, que en Argentina (UTC-3)
 * es el día anterior a las 21:00, así que la fecha se mostraría corrida un día para atrás. Es el
 * mismo error de zona horaria que ya apareció una vez en este proyecto con los horarios de torneo.
 */
function fechaLarga(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Argentina/Buenos_Aires",
  });
}
