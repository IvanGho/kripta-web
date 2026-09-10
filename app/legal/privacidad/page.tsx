import type { Metadata } from "next";
import Link from "next/link";
import { Documento } from "../../componentes/documento";

export const metadata: Metadata = {
  title: "Privacidad",
  description:
    "Qué datos recolecta el sitio de Kripta y qué datos se guardan de los participantes de los torneos. Sin cookies, sin cuentas y sin formularios.",
  alternates: { canonical: "/legal/privacidad" },
};

/**
 * Política de privacidad.
 *
 * **Cada afirmación de esta página tiene que ser verificable en el código.** No es una formalidad:
 * una política que promete más de lo que el sistema hace es peor que no tenerla, porque pasa de ser
 * una protección a ser una declaración falsa. Dónde se comprueba cada una:
 *
 *  - "no hay formularios ni cuentas": el sitio no tiene ninguna ruta que reciba datos. Se ve en que
 *    no existe ningún `<form>` ni ninguna Server Action en `app/`.
 *  - "no usamos cookies": no hay `cookies()` de Next en ninguna parte, y Vercel Web Analytics no
 *    usa cookies ni identificador persistente.
 *  - "las tipografías se sirven desde este dominio": `next/font` descarga Poppins en el build
 *    (`app/layout.tsx`), así que visitar el sitio no genera ningún pedido a Google.
 *  - "tu navegador nunca habla con el sistema de administración": `obtenerDatos()` de
 *    `app/lib/datos.ts` corre en el servidor. Al navegador llega HTML ya armado.
 *  - las categorías de datos de los jugadores son las que el panel guarda de verdad: es la misma
 *    lista que `CAMPOS_PRIVADOS` de `monsterland-panel/src/discord/revisor.js`.
 *
 * Si mañana el sitio suma un formulario, esta página queda desactualizada y hay que tocarla en el
 * mismo cambio.
 */
export default function Pagina() {
  return (
    <Documento
      titulo="Política de"
      resaltado="privacidad"
      bajada="Qué datos se recolectan, quién los ve y cómo pedir que se borren."
      actualizado="2026-09-09"
    >
      <h2>Lo corto</h2>
      <p>
        Este sitio <strong>no te pide ningún dato</strong>. No hay formularios, no hay cuentas, no
        hay que registrarse y no usamos cookies. Podés leer todo, usar las dos herramientas y salir
        sin dejar nada más que una visita anónima en las estadísticas.
      </p>
      <p>
        Los datos de las personas aparecen recién cuando alguien participa de un torneo, y eso pasa{" "}
        <strong>dentro de Discord</strong>, no acá.
      </p>

      <h2>Qué recolecta este sitio</h2>
      <p>Tres cosas, todas agregadas y ninguna que te identifique:</p>
      <ul>
        <li>
          <strong>Estadísticas de visita.</strong> Usamos Vercel Web Analytics, que cuenta qué
          páginas se ven, desde qué sitio llegaste, de qué país, y con qué tipo de dispositivo y
          navegador. No usa cookies ni te asigna un identificador que persista entre visitas, así
          que no podemos seguirte de una visita a la otra ni de un sitio a otro.
        </li>
        <li>
          <strong>Qué botón de Discord se apretó.</strong> Cuando alguien toca un botón que lleva al
          Discord, registramos desde qué parte de la página fue (la cabecera, la portada, una tarjeta
          de torneo, el pie). Es un conteo: no queda asociado a ninguna persona.
        </li>
        <li>
          <strong>Registros del servidor.</strong> Como cualquier sitio web, el servidor que lo aloja
          (Vercel) anota los pedidos que recibe, incluida la dirección IP, para poder servir las
          páginas y defenderse de abusos. Son registros técnicos y de corta vida, no un perfil.
        </li>
      </ul>

      <h2>Qué no hace este sitio</h2>
      <ul>
        <li>No te pide nombre, mail, teléfono ni ningún dato de contacto.</li>
        <li>No tiene cuentas de usuario ni inicio de sesión.</li>
        <li>No usa cookies, ni propias ni de terceros.</li>
        <li>No vende ni cede datos a nadie.</li>
        <li>No muestra publicidad de terceros.</li>
        <li>
          No carga tipografías desde servidores ajenos: Poppins se descarga cuando se compila el
          sitio y se sirve desde este mismo dominio, así que visitarnos no genera un pedido a Google.
        </li>
        <li>
          No conecta tu navegador con nuestro sistema de administración. El ranking y los torneos que
          ves los pide nuestro servidor y te llegan ya armados dentro de la página.
        </li>
      </ul>

      <h2>Los datos de los participantes de un torneo</h2>
      <p>
        Esto no pasa en el sitio: pasa en Discord y se guarda en el sistema de administración que usa
        la organización. Lo contamos acá porque es donde se puede leer.
      </p>
      <p>
        Para anotarte a un torneo primero te das de alta con el comando{" "}
        <strong>/registrarme</strong> en Discord. A partir de ahí se guardan estas categorías de
        datos:
      </p>
      <ul>
        <li>
          <strong>Tu identidad en Discord:</strong> el nombre de usuario y el identificador numérico
          que Discord le asigna a tu cuenta. Es lo que permite que el botón «Anotarme» sepa que sos
          vos.
        </li>
        <li>
          <strong>Tu nombre dentro del juego</strong> (por ejemplo el de Riot), para poder armar las
          llaves y que cada uno encuentre a su rival.
        </li>
        <li>
          <strong>Si tu mayoría de edad fue confirmada.</strong> Es un sí o un no, revisado a mano
          por la organización. No guardamos tu documento ni tu fecha de nacimiento.
        </li>
        <li>
          <strong>Un alias para acreditarte un premio</strong>, y sólo si participás de un torneo con
          inscripción o premio en dinero.
        </li>
        <li>
          <strong>Tus resultados:</strong> partidos, puntos de temporada y títulos. Esta parte es
          pública: es el ranking que se muestra en la portada, con tu nombre y tus números.
        </li>
        <li>
          <strong>Notas de organización</strong>, si hizo falta anotar algo sobre tu participación.
        </li>
      </ul>
      <p>
        Nada de esto se publica salvo lo que dice arriba que es público. El sistema revisa cada
        anuncio antes de mandarlo al Discord justamente para que ninguno de los otros datos se
        escape a un canal a la vista de todos.
      </p>

      <h2>Quién los ve</h2>
      <p>
        Las <strong>dos personas</strong> que operan la comunidad: quien la administra y el moderador
        de torneos. Nadie más tiene acceso, y no se comparten con terceros.
      </p>
      <p>
        Los datos viven en la infraestructura de nuestros dos proveedores: <strong>Vercel</strong>,
        que aloja el sitio y el sistema de administración, y <strong>Discord</strong>, donde ocurre
        la comunidad. Cada uno tiene su propia política de privacidad, y la de Discord aplica a todo
        lo que hagas dentro de Discord.
      </p>

      <h2>Cuánto tiempo se guardan</h2>
      <p>
        Los resultados y los puntos se conservan mientras la comunidad exista: son el historial de
        las temporadas y el ranking. El resto se guarda mientras tu ficha de jugador siga activa, y
        se borra cuando pedís que se borre.
      </p>

      <h2>Tus derechos</h2>
      <p>
        En Argentina la Ley 25.326 de Protección de los Datos Personales te da derecho a{" "}
        <strong>saber qué datos tenemos tuyos, corregirlos y pedir que se borren</strong>, sin costo
        y sin tener que explicar por qué.
      </p>
      <p>
        Se piden por mensaje directo a la administración en el Discord, que es donde ya nos podés
        encontrar. Si pedís que se borren, se borra tu ficha; los resultados de los torneos que ya
        jugaste quedan en el historial de la temporada de forma anónima, porque son el registro de
        una competencia que ya pasó.
      </p>
      <p>
        Si creés que no manejamos bien tus datos, podés reclamar ante la Agencia de Acceso a la
        Información Pública, que es el organismo de control de esa ley.
      </p>

      <h2>Menores de edad</h2>
      <p>
        Los torneos con inscripción o con premio en dinero son <strong>sólo para mayores de 18
        años</strong>, y esa condición la revisa una persona antes de habilitarte. Las mesas de Pista
        Libre son gratuitas y abiertas a todo el servidor.
      </p>

      <h2>Cambios</h2>
      <p>
        Si esto cambia, cambia la fecha de arriba. No hay versiones escondidas: el sitio es de código
        abierto y el historial de esta página se puede leer completo en su repositorio.
      </p>
      <p>
        Ver también los{" "}
        <Link href="/legal/terminos" className="text-acento-2 underline">
          términos y condiciones
        </Link>{" "}
        y{" "}
        <Link href="/legal/derechos" className="text-acento-2 underline">
          cómo ejercer tus derechos
        </Link>
        .
      </p>
    </Documento>
  );
}
