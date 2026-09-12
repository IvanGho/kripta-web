import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Íconos PNG del manifiesto, generados por código.
 *
 * Se generan en dos tamaños porque Android necesita PNG para el ícono adaptativo, y sin la variante
 * `maskable` el sistema recorta el ícono a la forma del launcher (círculo, cuadrado redondeado,
 * según el teléfono) y puede comerse el hocico del lobo o rellenar los bordes con blanco sobre un
 * logo pensado para fondo negro.
 *
 * Se generan en vez de guardarse como archivos por lo mismo que la imagen para compartir: si
 * cambia la paleta o el logo, cambia acá y no hay que exportar nada a mano.
 *
 * La zona segura del `maskable`: el sistema puede recortar hasta el 20% de cada borde, así que el
 * lobo se dibuja al 60% del lienzo y centrado. Eso es lo que garantiza que no se corte en ningún
 * teléfono.
 */

// Los tamaños que pide el manifiesto. Cualquier otro valor devuelve 404 en vez de generar
// imágenes a pedido para cualquier número que alguien invente en la URL.
const TAMANOS = new Set(["192", "512"]);

const FONDO = "#090c0a";

export function generateStaticParams() {
  return [...TAMANOS].map((tamano) => ({ tamano }));
}

export async function GET(_pedido: Request, { params }: { params: Promise<{ tamano: string }> }) {
  const { tamano } = await params;
  if (!TAMANOS.has(tamano)) {
    return new Response("Ese tamaño no existe.", { status: 404 });
  }

  const lado = Number(tamano);
  // 60% del lienzo: deja el 20% de margen por lado que el recorte adaptativo puede comerse.
  const lobo = Math.round(lado * 0.6);
  const imagen = await readFile(join(process.cwd(), "public", "marca", "kripta-lobo.png"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: FONDO,
        }}
      >
        {/* El símbolo se comparte con la cabecera para que favicon y marca no diverjan. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/png;base64,${imagen.toString("base64")}`}
          width={lobo}
          height={lobo}
          alt=""
          style={{ objectFit: "contain" }}
        />
      </div>
    ),
    { width: lado, height: lado },
  );
}
