import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { URL_SITIO } from "./lib/sitio";
import { HAY_ANALITICA } from "./lib/medicion";

/**
 * Poppins, la misma familia que usa TrucoChón. La elección no es estética nada más:
 * una sola familia bien usada (peso 800 para títulos, 400 para texto) se ve más
 * profesional que tres fuentes combinadas, y es un pedido menos al servidor.
 *
 * next/font la descarga en el build y la sirve desde nuestro dominio, así que no hay
 * request a Google en runtime ni el salto de texto al cargar.
 */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(URL_SITIO),
  title: {
    default: "Kripta · Torneos de Valorant y Truco en Discord",
    template: "%s · Kripta",
  },
  description:
    "Comunidad argentina de gaming con torneos semanales de Valorant y Truco, ranking de temporada y premios fijos. Entrá al Discord y jugá esta semana.",
  keywords: ["torneos valorant argentina", "torneos truco online", "comunidad gaming discord argentina", "ranking valorant"],
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: URL_SITIO,
    siteName: "Kripta · Monsterland",
    title: "Kripta · Torneos de Valorant y Truco en Discord",
    description:
      "Torneos semanales, ranking de temporada y premios fijos. Comunidad argentina, de 20 a 05.",
  },
  twitter: { card: "summary_large_image" },
  // El sitio es de captación: queremos que Google lo indexe.
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#050806",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-AR" className={`${poppins.variable} h-full antialiased`}>
      {/* `grano` agrega la capa de ruido sobre todo el sitio: es lo que hace que el fondo
          oscuro no se vea plano. Ver globals.css. */}
      <body className="grano flex min-h-full flex-col bg-fondo font-sans text-texto">
        {/*
          Primer elemento tabulable de todas las páginas. Está fuera de la pantalla hasta que
          recibe foco (ver `.salto-al-contenido` en globals.css), así que con el mouse no se ve.
          Existe porque la cabecera es pegajosa y tiene seis paradas de teclado antes del
          contenido. Cada página pone el destino con `<main id="contenido">`.
        */}
        <a href="#contenido" className="boton salto-al-contenido text-sm">
          Saltar al contenido
        </a>
        {children}
        {/*
          Vercel Web Analytics. Va acá, en el layout raíz, para que cuente todas las páginas sin
          repetirlo en cada una.

          Mide visitas y el evento `clic_discord` de cada botón (ver lib/medicion.ts). Es el único
          instrumento que va a decir si una campaña de anuncios sirvió: sin esto, la respuesta a
          "¿cuánta gente entró al Discord desde el sitio?" es una estimación mirando el conteo de
          miembros.

          Tres razones por las que es este y no Google Analytics: no usa cookies, así que no hace
          falta cartel de consentimiento ni entra en la política de privacidad como seguimiento de
          terceros; son unos pocos kilobytes contra los ~45 de gtag; y se activa con un interruptor
          en el proyecto de Vercel, sin cuenta aparte ni etiquetas que pegar.

          Va sólo cuando el sitio corre en Vercel: el script lo sirve la red de Vercel y fuera de
          ahí esa ruta devuelve 404 en cada carga. El motivo completo está en lib/medicion.ts.

          Y una vez desplegado, todavía hay que activar Web Analytics en el proyecto de Vercel
          (pestaña Analytics -> Enable). Sin eso el script carga pero no hay dónde ver los datos.
        */}
        {HAY_ANALITICA && <Analytics />}
      </body>
    </html>
  );
}
