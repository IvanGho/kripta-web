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
    /*
     * Antes había un solo ícono SVG con `sizes: "any"`. Chrome lo acepta para instalar, pero
     * Android necesita PNG para el ícono adaptativo, y sin una variante `maskable` el sistema
     * recorta el logo a la forma del launcher del teléfono: se puede comer el hocico del lobo o
     * rellenar los bordes con blanco sobre un logo pensado para fondo negro.
     *
     * Los PNG los genera `app/icono/[tamano]/route.tsx` con el lobo al 60% del lienzo, que es la
     * zona segura del recorte adaptativo. El SVG se deja porque es el que se ve nítido en la
     * pestaña del navegador a cualquier tamaño.
     */
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icono/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icono/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icono/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
