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

export function Lobo({ className = "", tamano = 40 }: { className?: string; tamano?: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={tamano}
      height={tamano}
      className={className}
      role="img"
      aria-label="Logo de la Kripta"
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

/** El logo con el nombre al lado, para la cabecera. */
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
