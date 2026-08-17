import type { MetadataRoute } from "next";

/**
 * Manifiesto de PWA.
 *
 * Es lo que hace que el sitio se pueda **instalar en el celular** como una app: queda con
 * ícono en la pantalla de inicio y abre sin la barra del navegador. Es la mitad de la
 * sensación de "esto es una app y no una página", y sale gratis.
 *
 * Next genera /manifest.webmanifest solo a partir de este archivo.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kripta · Monsterland",
    short_name: "Kripta",
    description: "Torneos de Valorant y Truco, ranking de temporada y anotador de Truco.",
    start_url: "/",
    display: "standalone",
    background_color: "#050806",
    theme_color: "#050806",
    lang: "es-AR",
    orientation: "portrait",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
