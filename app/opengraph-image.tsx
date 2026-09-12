import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt =
  "Kripta · Tu próxima partida empieza acá. Comunidad argentina de Valorant y Truco.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Imagen() {
  const fondo = await readFile(join(process.cwd(), "assets/hero-social-v4.jpg"));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#090c0a",
          color: "#f3f6f1",
        }}
      >
        {/* ImageResponse usa su propio motor de imágenes, no next/image. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/jpeg;base64,${fondo.toString("base64")}`}
          width={1200}
          height={800}
          alt=""
          style={{ position: "absolute", top: -85, left: 0 }}
        />
        <div
          style={{
            display: "flex",
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, #090c0a 0%, #090c0ae8 30%, #090c0a20 80%)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "55px 60px",
            position: "relative",
            width: "100%",
          }}
        >
          <div style={{ color: "#a0ff78", fontSize: 23, letterSpacing: 6 }}>
            MONSTERLAND / KRIPTA
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontWeight: 800,
              letterSpacing: -3,
            }}
          >
            <div style={{ fontSize: 78, lineHeight: 1.02 }}>TU PRÓXIMA</div>
            <div style={{ fontSize: 78, lineHeight: 1.02 }}>PARTIDA EMPIEZA ACÁ.</div>
            <div
              style={{
                fontSize: 36,
                color: "#7cff4f",
                letterSpacing: -1,
                marginTop: 22,
              }}
            >
              Entrá a la Kripta.
            </div>
          </div>
          <div style={{ color: "#a9b5ad", fontSize: 22 }}>
            Valorant · Truco · Comunidad argentina en Discord
          </div>
        </div>
      </div>
    ),
    size,
  );
}
