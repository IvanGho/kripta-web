/**
 * La URL pública del sitio, en un solo lugar.
 *
 * Vivía dentro de `app/layout.tsx`, pero ahora la necesitan también el sitemap, el robots.txt y
 * la imagen para compartir. Con la lógica duplicada, el día que se compre el dominio y alguien
 * escriba la variable con un formato raro, unos archivos lo tolerarían y otros no.
 */

/**
 * El dominio del sitio.
 *
 * Este valor **no es un placeholder**: es el dominio real, y se usa cuando
 * `NEXT_PUBLIC_URL_SITIO` no está cargada. Antes acá había `https://monsterland.gg`, un dominio
 * que se evaluó y nunca se compró, y esa diferencia no se ve en pantalla: el sitio se renderiza
 * igual de bien. Lo que sale mal es el `<link rel="canonical">`, el sitemap, el robots.txt y la
 * URL de la imagen para compartir, o sea justo lo que sólo leen Google y las redes sociales. Un
 * canonical apuntando a un dominio ajeno es pedirle a Google que no indexe este sitio.
 *
 * Que el valor por defecto sea el correcto significa que olvidarse la variable en Vercel deja de
 * ser un error silencioso.
 */
const URL_POR_DEFECTO = "https://kripta.infinixapp.com";

/**
 * Devuelve la URL del sitio tolerando que la variable venga mal escrita.
 *
 * `new URL()` tira si el valor no tiene protocolo, y donde esto se usa se evalúa al importar el
 * módulo: o sea que `NEXT_PUBLIC_URL_SITIO=kripta.infinixapp.com` (sin `https://`, que es
 * exactamente como uno escribe un dominio) **rompía el build entero**, con un error que no
 * menciona ni la variable ni el archivo.
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

/** Origen sin barra final, por ejemplo "https://kripta.infinixapp.com". */
export const URL_SITIO = resolver().origin;

/**
 * ¿Este deploy es una vista previa de Vercel?
 *
 * Importa para el robots.txt: los deploys de preview tienen URL propia y son públicos, así que
 * si se dejan indexar aparecen en Google compitiendo con el sitio real y repartiendo autoridad
 * entre copias. `VERCEL_ENV` la pone Vercel sola; en local no existe y esto da `false`.
 */
export const esVistaPrevia = process.env.VERCEL_ENV === "preview";

/**
 * Las páginas del sitio, para el sitemap y para no repetir rutas a mano.
 *
 * Privacidad y términos van con la prioridad más baja y frecuencia anual: son páginas que tienen
 * que existir y ser encontrables (Google las busca para verificar que un sitio que menciona cobros
 * es legítimo, y las plataformas de anuncios piden la de privacidad), pero no son por lo que
 * queremos que alguien nos encuentre. Declararlas en `0.3` le dice a Google dónde poner el foco
 * dentro del propio sitio.
 */
export const PAGINAS = [
  { ruta: "/", prioridad: 1, frecuencia: "daily" as const },
  { ruta: "/anotador", prioridad: 0.8, frecuencia: "monthly" as const },
  { ruta: "/sensibilidad", prioridad: 0.8, frecuencia: "monthly" as const },
  { ruta: "/legal/privacidad", prioridad: 0.3, frecuencia: "yearly" as const },
  { ruta: "/legal/terminos", prioridad: 0.3, frecuencia: "yearly" as const },
  { ruta: "/legal/derechos", prioridad: 0.3, frecuencia: "yearly" as const },
];
