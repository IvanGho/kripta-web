/**
 * Logo de la Kripta, en SVG.
 *
 * Está escrito a mano en vez de ser una imagen por dos razones: un SVG **es** un vector,
 * así que se ve nítido en cualquier tamaño y en pantallas retina; y pesa menos de 1 KB,
 * que importa porque este sitio se juega el posicionamiento en la velocidad de carga.
 *
 * Es un lobo geométrico, no un dibujo detallado: a 32px un dibujo detallado se convierte
 * en una manchita, y este se sigue leyendo. Cuando tengas el logo definitivo del servidor,
 * se reemplaza SOLO este archivo y cambia en todo el sitio.
 */

/**
 * El lobo es **decorativo por defecto**, y eso es lo correcto.
 *
 * Antes llevaba `role="img"` con `aria-label="Logo de la Kripta"` siempre. En la home el logo
 * aparece seis veces (las cuatro tarjetas de campeones, el bloque de referidos y el pie), así que
 * un lector de pantalla anunciaba "Logo de la Kripta" seis veces sin que aportara nada. Peor: en
 * las tarjetas de campeón el logo se anuncia **antes** del nombre de la persona, que es el dato
 * que la tarjeta existe para mostrar.
 *
 * `aria-hidden` lo saca del árbol de accesibilidad y `focusable="false"` evita que reciba foco en
 * navegadores viejos. Donde el logo sí carga significado (la marca de la cabecera), se pasa
 * `etiqueta` y ahí sí se anuncia.
 */
export function Lobo({
  className = "",
  tamano = 40,
  etiqueta,
}: {
  className?: string;
  tamano?: number;
  /** Sólo cuando el logo lleva información que no está en el texto de al lado. */
  etiqueta?: string;
}) {
  const accesible = etiqueta
    ? { role: "img" as const, "aria-label": etiqueta }
    : { "aria-hidden": true, focusable: "false" as const };

  return (
    <svg
      viewBox="0 0 100 100"
      width={tamano}
      height={tamano}
      className={className}
      {...accesible}
    >
      <defs>
        <linearGradient id="lobo-verde" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5dff86" />
          <stop offset="100%" stopColor="#2fc94f" />
        </linearGradient>
        <filter id="lobo-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter="url(#lobo-glow)">
        {/* Cabeza: orejas puntiagudas y hocico que baja en punta. */}
        <path
          d="M18 36 L25 6 L43 25 L57 25 L75 6 L82 36 L73 60 L50 90 L27 60 Z"
          fill="none"
          stroke="url(#lobo-verde)"
          strokeWidth="4.5"
          strokeLinejoin="round"
        />
        {/* Ojos: dos cuñas que apuntan al centro, es lo que le da la mirada. */}
        <path d="M34 43 L45 47 L34 52 Z" fill="url(#lobo-verde)" />
        <path d="M66 43 L55 47 L66 52 Z" fill="url(#lobo-verde)" />
        {/* Hocico */}
        <path
          d="M50 63 L43 73 L50 80 L57 73 Z"
          fill="none"
          stroke="url(#lobo-verde)"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

/**
 * El logo con el nombre al lado, para la cabecera.
 *
 * El lobo va decorativo: el texto "Kripta / Monsterland" está justo al lado y lo dice mejor.
 */
export function Marca({ tamano = 34 }: { tamano?: number }) {
  return (
    <span className="flex items-center gap-2.5">
      <Lobo tamano={tamano} />
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-extrabold uppercase tracking-[0.2em] text-acento-2">
          Kripta
        </span>
        <span className="text-[10px] uppercase tracking-[0.22em] text-tenue">Monsterland</span>
      </span>
    </span>
  );
}
