/**
 * Inserta un bloque de JSON-LD en la página.
 *
 * Sobre `dangerouslySetInnerHTML`, que es la forma que documenta Next para esto: acá **no** hay
 * riesgo de inyección, y vale explicar por qué en lugar de dejar el nombre asustando a quien lea.
 * Lo que entra es un objeto que se serializa con `JSON.stringify`, no un string armado a mano, y
 * los valores salen de la API del panel, que es nuestra. `JSON.stringify` escapa las comillas y
 * las barras invertidas.
 *
 * Queda un caso que `JSON.stringify` **no** cubre y que hay que cerrar a mano: si un valor
 * contuviera la secuencia `</script`, el parser HTML cerraría la etiqueta ahí y lo que siguiera
 * saldría del contexto de script. Un nombre de torneo cargado desde el panel podría tenerlo. Se
 * escapa el `<` como `\u003c`, que dentro de una cadena JSON significa exactamente lo mismo y ya
 * no cierra ninguna etiqueta.
 */
export function DatosEstructurados({ datos }: { datos: Record<string, unknown> | Array<Record<string, unknown>> }) {
  const json = JSON.stringify(datos).replace(/</g, "\\u003c");

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
  );
}
