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
    /*
     * Sin invitación cargada, el control no lleva a ningún lado. Cómo se comunica eso importa
     * más de lo que parece, porque es el único punto de conversión del sitio.
     *
     * Antes era un `<span>` con `aria-disabled="true"`. Eso está mal de tres maneras:
     *
     *   1. `aria-disabled` sobre un elemento **sin rol** no significa nada. Un lector de
     *      pantalla lee "Entrar al Discord" como texto suelto, no como un control apagado.
     *   2. Un `<span>` no recibe foco, así que quien navega con teclado nunca se enteraba de
     *      que ahí había algo.
     *   3. Mantenía la clase `boton` con 55% de opacidad, o sea que **seguía pareciendo un
     *      botón**. La persona lo tocaba, no pasaba nada, y no había ningún mensaje.
     *
     * Ahora es un `<button>` de verdad, que trae el rol y la posición de tabulación de fábrica.
     * Se usa `aria-disabled` en lugar del atributo `disabled` a propósito: un botón `disabled`
     * no recibe foco, así que quien navega con teclado seguiría sin poder descubrirlo. Con
     * `aria-disabled` se anuncia como no disponible pero se puede tabular hasta él y escuchar
     * por qué.
     *
     * El motivo va en texto real dentro del botón, no en un `title`: el `title` no existe en
     * pantallas táctiles y los lectores de pantalla no lo exponen de forma confiable. Estando
     * adentro pasa a formar parte del nombre accesible del botón, así que se anuncia siempre.
     *
     * (Se descartó `aria-describedby`, que sería lo más prolijo, porque este componente se
     * renderiza cinco veces en la home y haría falta un id único por instancia. `useId` obliga a
     * convertirlo en componente de cliente, y no vale bajar JavaScript al navegador para esto.)
     */
    return (
      <button
        type="button"
        aria-disabled="true"
        /*
         * No se reusa la clase del botón activo. Ver `.boton-no-disponible` en globals.css: el
         * verde al 55% seguía siendo lo más brillante de la pantalla y se leía como la acción
         * principal, así que la gente lo tocaba igual. `className` se respeta para el ancho y el
         * tamaño de texto que le pasa cada lugar de la página.
         */
        className={
          // En el pie la variante es "enlace", y ahí un botón punteado quedaría fuera de lugar
          // dentro de una lista de links: alcanza con texto apagado y tachado.
          variante === "enlace"
            ? `cursor-not-allowed text-tenue line-through ${className}`.trim()
            : `boton-no-disponible ${className}`.trim()
        }
      >
        {children}
        {/*
          El mensaje habla de lo que la persona ve, no de nombres de variables: quien entra al
          sitio no sabe qué es NEXT_PUBLIC_URL_DISCORD, y a quien lo tiene que configurar se lo
          dice el aviso del build (ver app/lib/enlaces.ts).
        */}
        <span className="sr-only"> — la invitación al Discord todavía no está publicada</span>
      </button>
    );
  }

  return (
    <a href={URL_DISCORD} target="_blank" rel="noopener noreferrer" className={clases}>
      {children}
    </a>
  );
}
