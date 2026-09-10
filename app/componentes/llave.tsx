/**
 * El separador entre secciones: un tramo de llave de torneo que converge.
 *
 * ## Por qué existe
 *
 * Las siete secciones de la portada compartían el mismo `py-16`, así que se leían todas iguales y la
 * página era una lista plana de bloques. Un separador resuelve el ritmo, pero una línea a secas es
 * decoración.
 *
 * Esto encodea algo verdadero: **la página es una llave de muchos a uno**. Arriba, el hero tiene un
 * campo de llaves abierto; cada separador muestra un tramo con menos ramas que el anterior; y el
 * llamado final es el nodo único. Bajar por la página es avanzar en el torneo.
 *
 * Es la razón por la que `ramas` va explícita en cada uso en lugar de calcularse: el orden de las
 * secciones es una decisión de composición, no una consecuencia, y quien lea `page.tsx` tiene que
 * poder ver la progresión de un vistazo.
 *
 * ## Decisiones de dibujo
 *
 * - **`aria-hidden`.** Es una figura sin contenido: un lector de pantalla que la anunciara sólo
 *   agregaría ruido entre dos secciones que ya tienen encabezado propio.
 * - **`preserveAspectRatio="none"`.** El SVG se estira al ancho disponible sin escalar el grosor de
 *   línea, así que la línea se ve del mismo espesor en un teléfono y en un monitor.
 * - **Sin `stroke` en valores literales.** Usa `currentColor` y el color lo pone la clase, para no
 *   copiar la paleta acá. Es la regla del proyecto: los colores salen de los tokens.
 */
export function Llave({
  ramas,
  className = "",
}: {
  /**
   * Cuántos pares entran en este tramo. Va bajando sección a sección: 4, 3, 2, y después el nodo.
   *
   * El máximo es 4 y no 8 por una razón medida en pantalla: a 390px de ancho, ocho ramas dejan unos
   * 48px por celda y el tramo se lee como una fila de guiones sueltos en lugar de una llave. El
   * viewBox se estira al ancho disponible, así que la densidad la decide el número de ramas y no el
   * tamaño del SVG.
   */
  ramas: 4 | 3 | 2 | 1;
  className?: string;
}) {
  const ALTO = 48;
  const ANCHO = 1000;

  // El tramo se dibuja sobre una cuadrícula lógica: cada rama ocupa una franja del ancho, entra por
  // izquierda a media altura de su franja y sale al centro vertical del tramo.
  const paso = ANCHO / ramas;
  const medio = ALTO / 2;

  const trazos: string[] = [];
  for (let i = 0; i < ramas; i += 1) {
    const x0 = i * paso;
    const x1 = x0 + paso;
    // Dos entradas, arriba y abajo, que se juntan en un conector vertical y siguen al centro.
    const arriba = ALTO * 0.18;
    const abajo = ALTO * 0.82;
    const union = x1 - paso * 0.22;
    trazos.push(`M${x0} ${arriba}H${union}`);
    trazos.push(`M${x0} ${abajo}H${union}`);
    trazos.push(`M${union} ${arriba}V${abajo}`);
    trazos.push(`M${union} ${medio}H${x1}`);
  }

  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg
        viewBox={`0 0 ${ANCHO} ${ALTO}`}
        preserveAspectRatio="none"
        className="h-8 w-full text-acento/40 sm:h-11"
      >
        <path d={trazos.join(" ")} fill="none" stroke="currentColor" strokeWidth={1.6} />
        {/* Los nodos donde cada par ya se resolvió. Es lo que hace que se lea como una llave y no
            como un peine. */}
        {Array.from({ length: ramas }, (_, i) => (
          <circle
            key={i}
            cx={(i + 1) * paso - paso * 0.22}
            cy={medio}
            r={2.6}
            className="fill-acento-2/70"
          />
        ))}
      </svg>
    </div>
  );
}

/**
 * El nodo final: un único hexágono, que es donde la llave termina.
 *
 * Va antes del llamado a la acción, y cierra la figura que arranca en el hero. Es la parte que hace
 * que la estructura se lea como intencional en lugar de como separadores decorativos que se van
 * achicando.
 */
export function NodoFinal({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none flex justify-center ${className}`} aria-hidden="true">
      <svg viewBox="0 0 120 48" className="h-10 w-32 text-acento/30 sm:h-12 sm:w-40">
        {/* Las dos últimas ramas entrando. */}
        <path
          d="M0 9h34M0 39h34M34 9v30M34 24h20"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.25}
        />
        {/* El hexágono del campeón, con el mismo trazo que las insignias del podio. */}
        <path
          d="M66 10 82 19v14L66 42 50 33V19z"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="text-acento-2/60"
        />
        <circle cx="66" cy="26" r="3" className="fill-acento-2/70" />
      </svg>
    </div>
  );
}

/**
 * Insignia de puesto para el podio del ranking.
 *
 * Los tres puestos comparten el mismo marco hexagonal —el nodo de la llave, otra vez— y se
 * distinguen por **cuántas marcas llevan adentro**: tres el primero, dos el segundo, una el tercero.
 *
 * Eso es deliberado y no estético. Antes los tres eran el mismo número con tres clases de color
 * distintas, lo que falla para quien no distingue el verde del ámbar, y falla del todo en el modo de
 * contraste forzado de Windows, donde el sistema descarta los colores de la página. Una diferencia
 * que se **cuenta** sobrevive a las dos cosas.
 *
 * El color se conserva encima, porque para quien sí lo distingue es más rápido de leer. Ya no es la
 * única señal, que es lo que importa.
 *
 * Va decorativa: el puesto se sigue anunciando como texto al lado, así que un lector de pantalla lee
 * "1°" igual que antes.
 */
export function Insignia({ puesto }: { puesto: 1 | 2 | 3 }) {
  const marcas = 4 - puesto; // 3, 2, 1

  return (
    <svg
      viewBox="0 0 32 32"
      className={`insignia insignia-${puesto} h-7 w-7`}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M16 2 29 9.5v13L16 30 3 22.5v-13z"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
      />
      {/* Las marcas, centradas y apiladas. Se cuentan de un vistazo hasta tres, que es justo el
          máximo que hace falta acá. */}
      {Array.from({ length: marcas }, (_, i) => (
        <rect
          key={i}
          x={11}
          y={13 + i * 3.2 - (marcas - 1) * 1.6}
          width={10}
          height={1.8}
          rx={0.9}
          fill="currentColor"
        />
      ))}
    </svg>
  );
}
