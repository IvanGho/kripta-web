import type { NextConfig } from "next";

/**
 * ---------------------------------------------------------------------------
 * Cabeceras de seguridad
 * ---------------------------------------------------------------------------
 *
 * El sitio no tenía ninguna. Estas cabeceras no cambian nada de lo que se ve: son instrucciones
 * al navegador sobre qué le permite hacer a la página, y cada una cierra una forma concreta de
 * atacar a un visitante.
 *
 * ## La decisión importante: `unsafe-inline` en `script-src`
 *
 * Next inyecta el estado de la página como scripts en línea (el `self.__next_f.push(...)` que se
 * ve al final del HTML). Un CSP estricto no los deja correr, así que hay exactamente tres salidas,
 * y las tres tienen costo:
 *
 *  1. **Nonce por pedido.** Es la más segura y la que recomienda la documentación de Next. Pero el
 *     nonce se genera por pedido, así que **obliga a renderizado dinámico**: se pierde la
 *     generación estática, se pierde el caché de CDN y cada visita pasa a renderizarse en el
 *     servidor. La propia documentación lo enumera así, textual: "Static optimization and ISR are
 *     disabled", "No CDN caching", "Slower initial page loads".
 *  2. **SRI (`experimental.sri`)**, que conserva lo estático firmando cada archivo por hash. Es lo
 *     técnicamente más elegante, pero está marcado **experimental**, y la regla del proyecto es
 *     que en el tooling los defaults quedan como vienen: el dolor histórico con Vercel vino
 *     siempre de configurar a mano. No se activa una bandera experimental en lo único que no puede
 *     romperse.
 *  3. **`unsafe-inline`**, que es lo que está acá.
 *
 * Se eligió la 3 mirando qué protege de verdad el CSP **en este sitio**. `unsafe-inline` debilita
 * la defensa contra XSS, y el XSS necesita una entrada por donde inyectar. Este sitio no renderiza
 * contenido escrito por visitantes: no hay comentarios, no hay perfiles, no hay campos que se
 * muestren. Lo único que viene de afuera son los datos del panel, y pasan por el escapado de React.
 *
 * O sea: se cambia una protección cuyo vector de entrada hoy no existe, por la velocidad de carga
 * de una página que recibe tráfico pago, donde cada segundo se paga en conversión. Si algún día el
 * sitio muestra algo que escribió un desconocido, esta decisión hay que revisarla, y el camino de
 * salida es la opción 2.
 *
 * Todo lo demás sí va cerrado, y ahí está la mayor parte del valor.
 *
 * ## Nada de dominios de terceros
 *
 * La lista no nombra ningún host externo, y eso es una propiedad del sitio, no un olvido:
 * Poppins la sirve `next/font` desde este dominio, y la analítica de Vercel se sirve y se reporta
 * en el mismo origen (`/_vercel/insights/...`). Si mañana alguien agrega un script de terceros
 * —el píxel de una plataforma de anuncios, por ejemplo— **va a fallar acá**, visiblemente, y eso
 * es deseable: obliga a decidir a conciencia a quién se le da permiso de ejecutar código.
 */
// React usa `eval` para reconstruir stacks de depuraciÃ³n en `next dev`. La guÃ­a de esta versiÃ³n
// de Next lo pide explÃ­citamente en desarrollo; el build de producciÃ³n no lo necesita ni lo recibe.
const ES_DESARROLLO = process.env.NODE_ENV === "development";

const DIRECTIVAS_CSP = [
  // Todo lo que no esté nombrado abajo sólo puede venir de este dominio.
  "default-src 'self'",

  // Ver el comentario largo de arriba sobre por qué va `unsafe-inline`.
  `script-src 'self' 'unsafe-inline'${ES_DESARROLLO ? " 'unsafe-eval'" : ""}`,

  // Tailwind y Next emiten estilos en línea. Son propios, no contenido de nadie de afuera.
  "style-src 'self' 'unsafe-inline'",

  // `data:` es para la capa de grano de globals.css, que es un SVG embebido para no pedir
  // un archivo más al servidor.
  "img-src 'self' data:",

  // La tipografía se sirve desde este dominio, así que no hace falta abrir nada más.
  "font-src 'self'",

  // La analítica reporta al mismo origen, y las precargas del router también.
  "connect-src 'self'",

  // Aunque alguien lograra inyectar un formulario, no puede apuntarlo a un servidor de afuera
  // para robarse lo que se escriba. Importa más ahora que hay un formulario en /legal/derechos.
  "form-action 'self'",

  // Nadie mete este sitio en un iframe. Es la mitad moderna de la defensa contra clickjacking;
  // la otra mitad es X-Frame-Options, para los navegadores que no leen esto.
  "frame-ancestors 'none'",

  // Sin esto, una inyección de `<base>` puede cambiar a dónde apuntan todos los links relativos
  // de la página de una sola vez.
  "base-uri 'none'",

  // No hay Flash, ni applets, ni objetos embebidos. Cerrarlo es gratis.
  "object-src 'none'",

  // Si algo quedó apuntado a http://, que el navegador lo pida por https en lugar de fallar.
  "upgrade-insecure-requests",
].join("; ");

const CABECERAS = [
  {
    key: "Content-Security-Policy",
    value: DIRECTIVAS_CSP,
  },
  {
    /*
     * HSTS: obliga a que este dominio se pida siempre por HTTPS, incluso si alguien escribe
     * `http://` o hace clic en un link viejo.
     *
     * Lo que evita es concreto: en una red abierta, el primer pedido en claro es el momento en que
     * alguien puede interceptar y devolver otra página. Vercel ya redirige a HTTPS, pero la
     * redirección viaja en claro, así que llega tarde. Esta cabecera hace que el navegador no
     * mande ese primer pedido nunca más.
     *
     * `max-age` de dos años e `includeSubDomains` son los valores que pide la lista de precarga de
     * los navegadores. Ojo con `includeSubDomains`: aplica a todo `kripta.infinixapp.com`, así que
     * cualquier subdominio de ahí para abajo también tiene que hablar HTTPS. No hay ninguno hoy.
     *
     * No se agrega `preload`. Entrar a esa lista es cómodo pero **salir tarda meses**, y no se
     * mete un dominio ahí antes de tenerlo funcionando un rato.
     */
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  {
    // La versión vieja de `frame-ancestors 'none'`, para los navegadores que no leen CSP.
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    // Sin esto un navegador puede adivinar el tipo de una respuesta y tratar como HTML algo que
    // devolvimos como texto, que es la mitad de varios ataques de subida de archivos.
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    /*
     * Al salir hacia otro dominio se manda sólo el origen, no la ruta completa.
     *
     * Importa acá más que en otros sitios: el botón principal manda a Discord, y las campañas de
     * anuncios agregan parámetros a la URL (`?utm_source=...`). Con la política por defecto, esa
     * URL completa viaja a Discord en la cabecera `Referer`. Con esto viaja
     * `https://kripta.infinixapp.com` y nada más.
     */
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    /*
     * Se apagan los permisos de dispositivo que el sitio no usa.
     *
     * Ninguna página pide cámara, micrófono ni ubicación, así que negarlos no le quita nada a
     * nadie. Sirve para que un script inyectado tampoco pueda pedirlos: el navegador ni siquiera
     * muestra el cartel de permiso.
     */
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
];

const nextConfig: NextConfig = {
  /**
   * Dejar de anunciar `x-powered-by: Next.js` en cada respuesta.
   *
   * Es la severidad más baja posible, pero es gratis: decirle al mundo qué framework y qué versión
   * corre un sitio es regalarle el primer paso a quien busca a qué apuntarle. Cuando salga un CVE
   * de Next, los barridos automáticos van a buscar exactamente esta cabecera para armar la lista de
   * objetivos.
   *
   * El panel ya lo hacía; el sitio era el que faltaba.
   */
  poweredByHeader: false,

  /**
   * Se aplican a todas las rutas, incluidos los estáticos y las imágenes generadas.
   *
   * Estas cabeceras **no se ven en `next dev`** de la misma forma que en producción, así que
   * verificarlas en desarrollo no prueba nada. Se comprueban contra `npm start` sobre el build,
   * y eso es lo que hace `scripts/verificar_navegador.py`.
   */
  async headers() {
    return [{ source: "/(.*)", headers: CABECERAS }];
  },
};

export default nextConfig;
