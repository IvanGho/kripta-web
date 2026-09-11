/**
 * Los nombres de los lugares desde donde se puede entrar al Discord.
 *
 * El sitio tiene un solo objetivo, y por lo tanto una sola métrica que importa: cuántos de los que
 * llegan terminan entrando al Discord. Contar el total no alcanza para decidir nada. Lo que hace
 * falta saber es **desde dónde** entran, porque cada lugar responde una pregunta distinta:
 *
 *  - `cabecera`: entraron sin leer nada. Si domina, la página de abajo casi no está aportando.
 *  - `hero`: los convenció el título y la bajada. Es el camino más corto y el que mejor se ve.
 *  - `tarjeta-torneo`: los convenció un torneo concreto, con su premio y su fecha. Es la señal más
 *    fuerte que da el sitio: quien aprieta acá ya sabe a qué se anota.
 *  - `cta-referidos`: leyeron toda la página. Pocos pero muy decididos.
 *  - `pie`: llegaron al final sin apretar nada antes. Si este crece, es que los controles de arriba
 *    no se están leyendo como el paso a seguir.
 *  - `pagina-404`: cayeron en una ruta que no existe y aun así entraron. Si este aparece seguido,
 *    hay un link mal escrito circulando por algún lado y vale la pena encontrarlo.
 *  - `pagina-legal`: desde `/legal/derechos`, donde el botón es el canal para ejercer los derechos
 *    de la Ley 25.326. No es conversión: es la vía de contacto, y conviene poder distinguirla del
 *    resto para no leer un reclamo como si fuera una alta.
 *
 * Es un tipo cerrado y la prop es obligatoria a propósito. Con un valor por defecto tipo
 * `"desconocido"`, el día que alguien agregue un sexto botón sin nombrarlo, la medición seguiría
 * andando y el dato nuevo se mezclaría con el resto sin que nada avise. Así, TypeScript no compila
 * hasta que el lugar nuevo tenga nombre.
 *
 * Los nombres viajan a Vercel Web Analytics tal cual están escritos: si se renombra uno, la serie
 * histórica del nombre viejo queda cortada. Conviene agregar antes que renombrar.
 */
export type UbicacionDiscord =
  | "cabecera"
  | "hero"
  | "tarjeta-torneo"
  | "ruta-inscripcion"
  | "cta-referidos"
  | "pie"
  | "pagina-404"
  | "pagina-legal";

/**
 * ¿Corresponde inyectar el script de analítica?
 *
 * Sólo cuando el sitio corre en Vercel. El script no lo sirve la aplicación: lo sirve la red de
 * Vercel en `/_vercel/insights/script.js`. Fuera de ahí esa ruta **no existe**, así que el
 * navegador pide un archivo que devuelve 404 en cada carga de cada página.
 *
 * No es sólo ruido en la consola. Tiene dos costos concretos:
 *
 *  1. La verificación en navegador (`scripts/verificar_navegador.py`) chequea que ninguna página
 *     cargue con errores de consola. Con el 404 permanente, ese chequeo pasa a fallar siempre, y un
 *     chequeo que falla siempre se termina desactivando o ignorando. Ahí es cuando deja de avisar
 *     de los errores que sí importan.
 *  2. Un pedido que falla mantiene la red ocupada, y eso hacía que Playwright no alcanzara nunca el
 *     estado de "red tranquila" que usa para saber que la página terminó de cargar.
 *
 * `VERCEL_ENV` la define Vercel sola, tanto en el build como en tiempo de ejecución, y vale
 * `production`, `preview` o `development`. No lleva el prefijo `NEXT_PUBLIC_` a propósito: se lee en
 * el layout, que es un componente de servidor, y la decisión se toma antes de mandar el HTML. Al
 * navegador no llega ni la variable ni la etiqueta del script.
 */
export const HAY_ANALITICA = Boolean(process.env.VERCEL_ENV);
