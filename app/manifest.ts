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
    name: "Monsterland · Kripta",
    short_name: "Monsterland",
    description: "Torneos de Valorant y Truco, ranking de temporada y anotador de Truco.",
    start_url: "/",
    display: "standalone",
    background_color: "#090c0a",
    theme_color: "#090c0a",
    lang: "es-AR",
    orientation: "portrait",
    /*
     * Antes había un solo ícono SVG con `sizes: "any"`. Chrome lo acepta para instalar, pero
     * Android necesita PNG para el ícono adaptativo, y sin una variante `maskable` el sistema
     * recorta el logo a la forma del launcher del teléfono: se puede comer el hocico del lobo o
     * rellenar los bordes con blanco sobre un logo pensado para fondo negro.
     *
     * Los PNG los genera `app/icono/[tamano]/route.tsx` con el nuevo emblema al 60% del lienzo,
     * que es la zona segura del recorte adaptativo.
     */
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icono/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icono/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icono/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
