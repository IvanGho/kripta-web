import { ImageResponse } from "next/og";

/**
 * La imagen que se ve cuando alguien comparte el sitio en Discord, WhatsApp o Twitter.
 *
 * Por qué es importante y no un adorno: el sitio se difunde **por invitación entre amigos**, así
 * que el link pegado en un chat es el primer contacto con la marca. Sin imagen, Discord y
 * WhatsApp muestran una tarjeta con un rectángulo vacío, y encima el layout ya declaraba
 * `twitter: { card: "summary_large_image" }` sin ninguna imagen, que es **peor que no declararlo**:
 * le pide a Twitter una tarjeta grande y le da un hueco.
 *
 * Está generada por código en vez de ser un PNG a mano para que siga a la paleta: si cambia el
 * verde en globals.css se cambia acá y no hay que abrir un editor de imágenes ni pedirle el
 * archivo a nadie.
 *
 * Detalles del motor, verificados en los docs de esta versión
 * (node_modules/next/dist/docs/01-app/03-api-reference/04-functions/image-response.md): esto lo
 * renderiza Satori, que soporta **flexbox y un subconjunto de CSS**. `display: grid` no funciona,
 * y el bundle total no puede pasar los 500 KB. Por eso el lobo se dibuja con `<path>` de trazo
 * sólido y no con el gradiente de `marca.tsx`: las referencias tipo `url(#id)` a un `<defs>` no
 * son confiables acá.
 */

export const alt = "Kripta · Torneos de Valorant y Truco en Discord";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Los mismos valores que :root en globals.css. Si cambia la paleta, cambia acá.
const FONDO = "#050806";
const PANEL = "#0d160f";
const BORDE = "#1e3a26";
const TEXTO = "#e4f2e7";
const TENUE = "#8ca694";
const ACENTO = "#2fc94f";
const ACENTO_2 = "#5dff86";

export default function Imagen() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: FONDO,
          // El resplandor verde del hero, resuelto con un gradiente radial porque los filtros
          // de blur de CSS no están soportados.
          backgroundImage: `radial-gradient(ellipse 80% 60% at 50% 0%, ${PANEL} 0%, ${FONDO} 70%)`,
          padding: 72,
          border: `1px solid ${BORDE}`,
        }}
      >
        {/* Marca arriba */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="72" height="72" viewBox="0 0 100 100">
            <path
              d="M18 36 L25 6 L43 25 L57 25 L75 6 L82 36 L73 60 L50 90 L27 60 Z"
              fill="none"
              stroke={ACENTO_2}
              strokeWidth="5"
              strokeLinejoin="round"
            />
            <path d="M34 43 L45 47 L34 52 Z" fill={ACENTO_2} />
            <path d="M66 43 L55 47 L66 52 Z" fill={ACENTO_2} />
            <path
              d="M50 63 L43 73 L50 80 L57 73 Z"
              fill="none"
              stroke={ACENTO_2}
              strokeWidth="4"
              strokeLinejoin="round"
            />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 34,
                fontWeight: 800,
                color: ACENTO_2,
                letterSpacing: 8,
              }}
            >
              KRIPTA
            </div>
            <div style={{ fontSize: 18, color: TENUE, letterSpacing: 6 }}>MONSTERLAND</div>
          </div>
        </div>

        {/* El mensaje. Es el mismo del h1 de la home: lo que se promete al compartir tiene que
            ser lo que se encuentra al entrar. */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/*
            Ojo con este bloque: Satori **exige** `display: flex` (o `contents`, o `none`) en
            cualquier div con más de un hijo, y tira un error que corta la respuesta con 500 si
            no está. Eso descarta escribir el título como texto en flujo normal con spans
            anidados, que sería lo natural: hay que armarlo con items de flex y meter los
            espacios a mano como `&nbsp;`, porque entre items de flex el espacio en blanco del
            JSX no sobrevive.
          */}
          <div
            style={{
              fontSize: 76,
              fontWeight: 800,
              color: TEXTO,
              lineHeight: 1.05,
              letterSpacing: -2,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <span>Torneos de&nbsp;</span>
            <span style={{ color: ACENTO_2 }}>Valorant</span>
            <span>&nbsp;y&nbsp;</span>
            <span style={{ color: ACENTO_2 }}>Truco</span>
            <span>&nbsp;todas las semanas</span>
          </div>
          <div style={{ fontSize: 30, color: TENUE, marginTop: 24 }}>
            Comunidad argentina · de 20 a 05 · premios fijos anunciados antes de la inscripción
          </div>
        </div>

        {/* Pie: tres datos, alineados con las métricas del hero. */}
        <div style={{ display: "flex", gap: 16 }}>
          {[
            ["Ranking", "de temporada"],
            ["2 torneos", "por semana"],
            ["Mesas gratis", "todos los días"],
          ].map(([alto, bajo]) => (
            <div
              key={alto}
              style={{
                display: "flex",
                flexDirection: "column",
                background: PANEL,
                border: `1px solid ${BORDE}`,
                borderRadius: 16,
                padding: "18px 26px",
              }}
            >
              <span style={{ fontSize: 26, fontWeight: 700, color: ACENTO }}>{alto}</span>
              <span style={{ fontSize: 18, color: TENUE, marginTop: 4 }}>{bajo}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
