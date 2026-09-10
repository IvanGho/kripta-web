"use client";

import { track } from "@vercel/analytics";
import type { UbicacionDiscord } from "../lib/medicion";

/**
 * El ancla que lleva al Discord y avisa que se la tocaron.
 *
 * ## Por qué es un archivo aparte y no un `"use client"` arriba de `boton-discord.tsx`
 *
 * Medir el clic necesita un manejador, y un manejador necesita JavaScript en el navegador. Pero
 * `BotonDiscord` tiene dos ramas y **una sola** la necesita: la rama sin invitación cargada es un
 * botón apagado que no navega a ningún lado, y sus comentarios explican que ya se descartó
 * `useId` justamente para no bajar JavaScript al navegador por un detalle de accesibilidad.
 *
 * Poniendo `"use client"` en `boton-discord.tsx` esa decisión se perdía: las cinco instancias del
 * componente pasarían a ser de cliente, incluida la rama apagada. Así, el límite de cliente
 * envuelve nada más que el ancla, y `BotonDiscord` sigue renderizándose en el servidor.
 *
 * ## Por qué no hay `preventDefault`
 *
 * La navegación tiene que pasar igual si la medición no pasa. `track()` es una llamada que puede
 * no llegar a ningún lado por razones normalísimas: un bloqueador de publicidad, Web Analytics sin
 * activar en el proyecto de Vercel, o el sitio corriendo en `localhost`. Si el clic esperara la
 * confirmación de la medición para navegar, el único punto de conversión del sitio quedaría
 * colgado de la pieza más prescindible que tiene.
 *
 * Sin `preventDefault`, el navegador sigue el `href` como con cualquier enlace y `track()` queda
 * corriendo al costado. Si falla, falla sola y en silencio: perdemos el dato, no la visita.
 *
 * Y como el enlace abre en una pestaña nueva, la página actual no se descarga, así que el pedido
 * de la medición tiene tiempo de salir. Esa es la razón de fondo por la que esto funciona sin
 * `navigator.sendBeacon` ni ningún truco de los que se usan para medir clicks de salida.
 */
export function EnlaceMedido({
  href,
  ubicacion,
  className,
  children,
}: {
  href: string;
  /** Cuál de los lugares del sitio es. Ver `UbicacionDiscord` en lib/medicion.ts. */
  ubicacion: UbicacionDiscord;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => {
        // Sin await y sin preventDefault: ver el comentario de arriba.
        track("clic_discord", { ubicacion });
      }}
    >
      {children}
    </a>
  );
}
