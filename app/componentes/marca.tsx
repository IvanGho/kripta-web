import Image from "next/image";

/**
 * Símbolo de la Kripta.
 *
 * El emblema vive como PNG transparente de alta resolución para que la marca tenga una pieza
 * dibujada de verdad, no un trazado geométrico repetido en código. `next/image` sirve la misma
 * fuente optimizada en cabecera, pie y tarjetas; el texto del nombre queda en HTML para conservar
 * nitidez, accesibilidad y control de tema.
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
    : { "aria-hidden": true };

  return (
    <Image
      src="/marca/kripta-lobo.png"
      width={tamano}
      height={tamano}
      alt={etiqueta ?? ""}
      className={className}
      {...accesible}
    />
  );
}

/**
 * El logo con el nombre al lado, para la cabecera.
 *
 * El lobo va decorativo: el texto "Monsterland / Kripta" está justo al lado y lo dice mejor.
 */
export function Marca({ tamano = 34 }: { tamano?: number }) {
  return (
    <span className="group flex items-center gap-2.5">
      <span className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-[11px] border border-acento-2/45 bg-[#0e1711] shadow-[0_0_22px_rgba(93,255,134,0.15)]">
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_24%,rgba(124,255,79,0.22),transparent_58%)]" />
        <span className="absolute -bottom-3 -right-1 h-8 w-14 -rotate-45 border-t-2 border-peligro/80" />
        <Lobo tamano={tamano + 5} className="relative drop-shadow-[0_0_10px_rgba(93,255,134,0.58)]" />
      </span>
      <span className="flex min-w-0 flex-col gap-1 leading-none">
        <span className="relative whitespace-nowrap text-[13px] font-black uppercase tracking-[0.1em] text-texto after:absolute after:-bottom-1 after:left-0 after:h-px after:w-6 after:bg-peligro after:content-['']">
          Monster<span className="text-acento-2">land</span><span className="ml-1 align-top text-[8px] tracking-[-0.14em] text-peligro" aria-hidden="true">{"///"}</span>
        </span>
        <span className="text-[9px] uppercase tracking-[0.12em] text-tenue">Kripta · Comunidad</span>
      </span>
    </span>
  );
}
