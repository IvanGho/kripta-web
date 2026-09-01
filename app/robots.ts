import type { MetadataRoute } from "next";

import { URL_SITIO, esVistaPrevia } from "./lib/sitio";

/**
 * `robots.txt`. No existía.
 *
 * Hace dos cosas que sin archivo no pasaban:
 *
 * **1. Declara el sitemap.** Es la forma estándar de que un buscador lo encuentre sin que nadie
 * lo dé de alta a mano en ninguna consola.
 *
 * **2. Bloquea los deploys de vista previa.** Esto es lo importante y es fácil de pasar por alto:
 * `robots: { index: true }` está declarado global en el layout, así que **cada deploy de preview
 * de Vercel se publica indexable en su propia URL**. Google entonces indexa varias copias del
 * mismo sitio; compiten entre ellas, reparten autoridad, y puede terminar mostrando en los
 * resultados una URL de preview en vez del dominio real. Para un sitio cuyo único objetivo es
 * captar gente de búsquedas, eso trabaja en contra directamente.
 *
 * En preview se responde `disallow: "/"` para todos. En producción, todo permitido.
 */
export default function robots(): MetadataRoute.Robots {
  if (esVistaPrevia) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${URL_SITIO}/sitemap.xml`,
    host: URL_SITIO,
  };
}
