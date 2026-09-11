import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import "./identidad.css";
import { URL_SITIO } from "./lib/sitio";
import { HAY_ANALITICA } from "./lib/medicion";

/**
 * Archivo, en su versión variable. Cubre titulares y texto con **un solo archivo**.
 *
 * Reemplaza a Poppins, y el motivo está en la dirección visual escrita en `globals.css`: Poppins es
 * el geométrico más usado de la web, y un titular grande en mayúsculas con una bajada tenue debajo
 * era la respuesta de plantilla. Como la paleta está fijada y no se puede mover, la distinción tiene
 * que salir de la tipografía y la estructura.
 *
 * Archivo es una grotesca, no un geométrico amable. Lo que la hace servir acá es el eje de **ancho**
 * (`wdth`): estirada al máximo, en peso 900 y mayúsculas, se lee como algo tallado en una pared, que
 * es el lenguaje material de la Kripta. En ancho normal y peso 400 es una tipografía de texto
 * discreta y muy legible en teléfono. Una familia, dos expresiones opuestas.
 *
 * Al ser variable pesa **un archivo en lugar de los cinco pesos** que se bajaban de Poppins, así que
 * el cambio no cuesta carga: la abarata.
 *
 * `next/font` la descarga en el build y la sirve desde nuestro dominio, así que no hay pedido a
 * Google al visitar ni salto de texto al cargar. Eso además es lo que permite que la política de
 * seguridad no tenga que abrirle permiso a ningún dominio externo.
 */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

/**
 * IBM Plex Mono, para números y etiquetas.
 *
 * No es decorativa, resuelve un problema concreto: este sitio está lleno de datos —puntos, puestos,
 * cupos, premios, la cuenta regresiva— y en una tipografía proporcional los números de una misma
 * columna tienen anchos distintos, así que el ranking se lee torcido. Una monoespaciada los alinea
 * sola.
 *
 * De paso le da a la cuenta regresiva el carácter de un instrumento que marca, en lugar de texto que
 * cambia.
 *
 * Dos pesos nada más: 400 para los números y 500 para las etiquetas en mayúsculas.
 */
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
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
    <html lang="es-AR" className={`${archivo.variable} ${mono.variable} h-full antialiased`}>
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
