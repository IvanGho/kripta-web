import { HAY_DISCORD, URL_DISCORD } from "../lib/enlaces";

/**
 * El botón que lleva al Discord. Es **la** conversión del sitio, así que vive en un solo lugar.
 *
 * Antes estaba repetido en cinco lugares (cabecera, hero, cada tarjeta de torneo, el CTA de
 * referidos y el pie), cada uno con su propio `target` y `rel`. Centralizarlo tiene tres
 * ventajas concretas:
 *
 *  1. **El caso "no hay invitación" se resuelve una vez.** `NEXT_PUBLIC_URL_DISCORD` es opcional,
 *     y sin ella `URL_DISCORD` cae en `"https://discord.gg/"`, que no es una invitación: es la
 *     página institucional de Discord. El visitante llegaba ahí y se perdía, sin que nada lo
 *     avisara. Ahora, si no hay invitación, el botón se muestra deshabilitado y explica por qué.
 *     Es peor perder al visitante en silencio que mostrar que falta configurar algo.
 *  2. `rel="noopener noreferrer"` queda garantizado en todos los enlaces externos.
 *  3. Cuando quieras medir la conversión (UTM, evento de analítica), se toca este archivo y listo.
 */
export function BotonDiscord({
  children,
  variante = "primario",
  className = "",
}: {
  children: React.ReactNode;
  /** "primario" es el verde lleno; "secundario" el de borde; "enlace" para el pie. */
  variante?: "primario" | "secundario" | "enlace";
  className?: string;
}) {
  const base =
    variante === "primario" ? "boton" : variante === "secundario" ? "boton-sec" : "";
  const clases = `${base} ${className}`.trim();

  if (!HAY_DISCORD) {
    return (
      <span
        className={`${clases} cursor-not-allowed opacity-55`}
        aria-disabled="true"
        title="Falta cargar NEXT_PUBLIC_URL_DISCORD con una invitación que no expire."
      >
        {children}
      </span>
    );
  }

  return (
    <a href={URL_DISCORD} target="_blank" rel="noopener noreferrer" className={clases}>
      {children}
    </a>
  );
}
