import { ImageResponse } from "next/og";

/**
 * Íconos PNG del manifiesto, generados por código.
 *
 * Por qué hacen falta si ya hay un `icon.svg`: el manifiesto declaraba **un solo ícono SVG** con
 * `sizes: "any"`. Chrome lo acepta para instalar, pero Android necesita un PNG para el ícono
 * adaptativo, y sin la variante `maskable` el sistema recorta el ícono a la forma del launcher
 * (círculo, cuadrado redondeado, según el teléfono) y puede comerse el hocico del lobo o
 * rellenar los bordes con blanco sobre un logo pensado para fondo negro.
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

const FONDO = "#050806";
const ACENTO_2 = "#5dff86";
const ACENTO = "#2fc94f";

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
        <svg width={lobo} height={lobo} viewBox="0 0 100 100">
          <path
            d="M18 36 L25 6 L43 25 L57 25 L75 6 L82 36 L73 60 L50 90 L27 60 Z"
            fill="none"
            stroke={ACENTO_2}
            strokeWidth="6"
            strokeLinejoin="round"
          />
          <path d="M34 43 L45 47 L34 52 Z" fill={ACENTO} />
          <path d="M66 43 L55 47 L66 52 Z" fill={ACENTO} />
          <path
            d="M50 63 L43 73 L50 80 L57 73 Z"
            fill="none"
            stroke={ACENTO_2}
            strokeWidth="5"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    { width: lado, height: lado },
  );
}
