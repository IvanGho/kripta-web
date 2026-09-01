import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

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

const URL_POR_DEFECTO = "https://monsterland.gg";

/**
 * La URL del sitio, tolerando que la variable venga mal escrita.
 *
 * `new URL()` tira si el valor no tiene protocolo, y `metadataBase` se evalúa al importar el
 * módulo: o sea que poner `NEXT_PUBLIC_URL_SITIO=monsterland.gg` (sin `https://`, que es
 * exactamente como uno escribe un dominio) **rompía el build entero**, con un error que no
 * menciona ni la variable ni el archivo.
 *
 * Como el dominio lo va a cargar a mano alguien que no programa, el caso no es hipotético. Se
 * le agrega el protocolo si falta, y si igual no se puede interpretar se cae al valor por
 * defecto avisando, en vez de tumbar el deploy.
 */
function urlDelSitio(): URL {
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

const URL_SITIO = urlDelSitio().origin;

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
      </body>
    </html>
  );
}
