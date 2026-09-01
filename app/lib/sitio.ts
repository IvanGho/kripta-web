/**
 * La URL pública del sitio, en un solo lugar.
 *
 * Vivía dentro de `app/layout.tsx`, pero ahora la necesitan también el sitemap, el robots.txt y
 * la imagen para compartir. Con la lógica duplicada, el día que se compre el dominio y alguien
 * escriba la variable con un formato raro, unos archivos lo tolerarían y otros no.
 */

const URL_POR_DEFECTO = "https://monsterland.gg";

/**
 * Devuelve la URL del sitio tolerando que la variable venga mal escrita.
 *
 * `new URL()` tira si el valor no tiene protocolo, y donde esto se usa se evalúa al importar el
 * módulo: o sea que `NEXT_PUBLIC_URL_SITIO=monsterland.gg` (sin `https://`, que es exactamente
 * como uno escribe un dominio) **rompía el build entero**, con un error que no menciona ni la
 * variable ni el archivo.
 *
 * Como el dominio lo va a cargar a mano alguien que no programa, el caso no es hipotético: se le
 * agrega el protocolo si falta, y si igual no se puede interpretar se cae al valor por defecto
 * avisando, en vez de tumbar el deploy.
 */
function resolver(): URL {
  const crudo = (process.env.NEXT_PUBLIC_URL_SITIO ?? "").trim();
  if (!crudo) return new URL(URL_POR_DEFECTO);

  const conProtocolo = /^https?:\/\//i.test(crudo) ? crudo : `https://${crudo}`;
  try {
    return new URL(conProtocolo);
  } catch {
    console.warn(
      `[kripta-web] NEXT_PUBLIC_URL_SITIO no se entiende como URL ("${crudo}"), así que se usa ` +
        `${URL_POR_DEFECTO}. Los links para compartir y el canonical van a apuntar ahí.`,
    );
    return new URL(URL_POR_DEFECTO);
  }
}

/** Origen sin barra final, por ejemplo "https://monsterland.gg". */
export const URL_SITIO = resolver().origin;

/**
 * ¿Este deploy es una vista previa de Vercel?
 *
 * Importa para el robots.txt: los deploys de preview tienen URL propia y son públicos, así que
 * si se dejan indexar aparecen en Google compitiendo con el sitio real y repartiendo autoridad
 * entre copias. `VERCEL_ENV` la pone Vercel sola; en local no existe y esto da `false`.
 */
export const esVistaPrevia = process.env.VERCEL_ENV === "preview";

/** Las páginas del sitio, para el sitemap y para no repetir rutas a mano. */
export const PAGINAS = [
  { ruta: "/", prioridad: 1, frecuencia: "daily" as const },
  { ruta: "/anotador", prioridad: 0.8, frecuencia: "monthly" as const },
  { ruta: "/sensibilidad", prioridad: 0.8, frecuencia: "monthly" as const },
];
