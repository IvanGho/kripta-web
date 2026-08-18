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

const URL_SITIO = process.env.NEXT_PUBLIC_URL_SITIO ?? "https://monsterland.gg";

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
        {children}
      </body>
    </html>
  );
}
