import type { MetadataRoute } from "next";

import { PAGINAS, URL_SITIO } from "./lib/sitio";

/**
 * Sitemap del sitio, en `/sitemap.xml`.
 *
 * No había ninguno. Para tres páginas Google las encuentra igual siguiendo enlaces, así que esto
 * no es lo que hace la diferencia; lo que aporta de verdad es el `lastModified`, que le dice al
 * buscador cuándo vale la pena volver a mirar, y que el `robots.txt` pueda declararlo.
 *
 * Las rutas salen de `PAGINAS` en lib/sitio.ts para que agregar una página no signifique
 * acordarse de tocar este archivo: es exactamente el tipo de olvido que deja una página nueva
 * fuera del sitemap durante meses sin que nadie lo note.
 *
 * La home lleva `daily` porque el ranking y los torneos cambian con cada torneo jugado; las dos
 * herramientas `monthly`, porque su contenido es fijo.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const ahora = new Date();

  return PAGINAS.map(({ ruta, prioridad, frecuencia }) => ({
    url: `${URL_SITIO}${ruta === "/" ? "" : ruta}`,
    lastModified: ahora,
    changeFrequency: frecuencia,
    priority: prioridad,
  }));
}
