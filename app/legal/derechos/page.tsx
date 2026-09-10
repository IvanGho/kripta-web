import type { Metadata } from "next";
import Link from "next/link";
import { Documento } from "../../componentes/documento";
import { BotonDiscord } from "../../componentes/boton-discord";

export const metadata: Metadata = {
  title: "Tus derechos sobre tus datos",
  description:
    "Cómo pedir acceso, rectificación, actualización o supresión de tus datos personales en Kripta, con los plazos que fija la Ley 25.326.",
  alternates: { canonical: "/legal/derechos" },
};

/**
 * Cómo ejercer los derechos de la Ley 25.326 (habeas data).
 *
 * ## Por qué es una página con un canal, y no un formulario
 *
 * El pedido original decía "formulario". Se resolvió como canal, y conviene que el motivo quede
 * escrito porque parece una simplificación y no lo es:
 *
 *  1. **La ley pide un canal, no un formulario.** El art. 14 habla de "intimado fehacientemente" y
 *     el art. 16 de "recibido el reclamo". Un mensaje directo identificable cumple; un formulario
 *     web anónimo, en rigor, acredita menos.
 *  2. **Un formulario contradice la propia política de privacidad.** `/legal/privacidad` afirma que
 *     este sitio no pide ni almacena datos de nadie, y esa es su afirmación más fuerte. Agregar un
 *     formulario obliga a debilitarla.
 *  3. **Sería la primera entrada de datos del sitio.** Hoy el sitio no recibe nada, y de eso
 *     dependen dos decisiones: que no haya base ni sesiones, y el `unsafe-inline` del CSP en
 *     `next.config.ts`, que se justifica precisamente porque no hay contenido de terceros que
 *     renderizar. Un formulario cambia ese cálculo, y además necesita validación, límite de
 *     intentos, defensa contra spam y un secreto para el webhook.
 *  4. **El volumen esperado es cercano a cero.** La comunidad tiene ~140 personas y el registro
 *     ocurre en Discord, donde la persona ya está y ya nos puede escribir.
 *
 * Si algún día hay muchos pedidos, o hace falta un canal para gente que no está en el Discord, un
 * formulario que reenvíe a un webhook sin almacenar nada es la evolución natural.
 *
 * ## Los plazos son los de la ley, no los que uno quiera
 *
 * El pedido original proponía 15 días hábiles para todo. **Eso sería incumplir**: la ley da plazos
 * más cortos y anunciar uno más largo es anunciar que no se va a cumplir.
 *
 *  - **Acceso: 10 días corridos.** Ley 25.326, art. 14 inc. 2.
 *  - **Rectificación, actualización o supresión: 5 días hábiles.** Art. 16 inc. 2.
 *
 * El art. 14 inc. 3 agrega que el acceso es gratuito a intervalos no menores a seis meses, y eso
 * también está dicho en la página: es un derecho de la persona saberlo, no una excusa nuestra.
 */
export default function Pagina() {
  return (
    <Documento
      titulo="Tus"
      resaltado="derechos"
      bajada="Cómo ver, corregir o borrar los datos que tenemos tuyos, y en cuánto tiempo tenemos que responder."
      actualizado="2026-09-09"
    >
      <h2>Antes que nada: este sitio no guarda nada tuyo</h2>
      <p>
        No hay formularios, no hay cuentas y no usamos cookies. Si nunca participaste de un torneo,{" "}
        <strong>no tenemos ningún dato tuyo</strong> y no hay nada que pedir. El detalle está en la{" "}
        <Link href="/legal/privacidad" className="text-acento-2 underline">
          política de privacidad
        </Link>
        .
      </p>
      <p>
        Los datos aparecen cuando alguien se registra en Discord con <strong>/registrarme</strong> y
        participa de un torneo. Esta página es para esas personas.
      </p>

      <h2>Qué podés pedir</h2>
      <ul>
        <li>
          <strong>Acceso.</strong> Que te digamos qué datos tuyos tenemos, de dónde salieron y para
          qué los usamos.
        </li>
        <li>
          <strong>Rectificación y actualización.</strong> Que corrijamos algo que está mal o quedó
          viejo, por ejemplo un nombre de juego que cambiaste.
        </li>
        <li>
          <strong>Supresión.</strong> Que borremos tu ficha.
        </li>
        <li>
          <strong>Oposición.</strong> Que dejemos de usar tus datos para algo puntual, sin borrar
          todo.
        </li>
      </ul>

      <h2>Cómo se pide</h2>
      <p>
        Por <strong>mensaje directo a la administración en el Discord</strong>, que es donde ya nos
        podés encontrar y donde podemos confirmar que sos vos. Escribí qué de los cuatro puntos de
        arriba estás pidiendo. No hace falta explicar por qué, y no cuesta nada.
      </p>
      <div className="my-6 flex">
        <BotonDiscord ubicacion="pagina-legal" variante="secundario" className="text-sm">
          Ir al Discord
        </BotonDiscord>
      </div>
      <p>
        Te pedimos una sola cosa: que el pedido venga de la misma cuenta de Discord que está
        registrada. Es la forma de no entregarle los datos de una persona a otra que dice ser ella.
      </p>

      <h2>En cuánto tiempo respondemos</h2>
      <p>Los plazos no los elegimos nosotros, los fija la Ley 25.326:</p>
      <ul>
        <li>
          <strong>Acceso: 10 días corridos</strong> desde que recibimos el pedido (art. 14, inc. 2).
        </li>
        <li>
          <strong>Rectificación, actualización o supresión: 5 días hábiles</strong> desde que
          recibimos el reclamo (art. 16, inc. 2).
        </li>
      </ul>
      <p>
        El derecho de acceso es gratuito y se puede ejercer a intervalos de no menos de seis meses,
        salvo que haya un motivo puntual para pedirlo antes (art. 14, inc. 3).
      </p>

      <h2>Qué pasa cuando pedís que borremos tu ficha</h2>
      <p>
        Se borra. Los resultados de los torneos que ya jugaste quedan en el historial de su
        temporada <strong>de forma anónima</strong>, porque son el registro de una competencia que
        ya pasó y afecta los puestos de otras personas. Tu nombre sale del ranking.
      </p>
      <p>
        Si hay algo que por obligación legal tengamos que conservar —por ejemplo el registro de un
        pago, para la contabilidad— te lo decimos y te explicamos cuál es y por cuánto tiempo. La
        propia ley prevé ese caso en el art. 16, inc. 5.
      </p>

      <h2>Si no te respondemos</h2>
      <p>
        Si el plazo se vence sin respuesta, o la respuesta te parece insuficiente, podés iniciar la
        acción de protección de datos personales (habeas data) que prevé la misma ley, y podés
        reclamar ante la <strong>Agencia de Acceso a la Información Pública</strong>, que es el
        organismo de control.
      </p>
      <p>
        Preferimos resolverlo antes de eso. Si algo no salió bien, escribinos de nuevo: somos dos
        personas y a veces se nos pasa un mensaje.
      </p>
    </Documento>
  );
}
