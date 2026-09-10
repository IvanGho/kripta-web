import type { Metadata } from "next";
import Link from "next/link";
import { Documento } from "../../componentes/documento";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description:
    "Cómo funcionan los torneos de Kripta: el premio es fijo y se anuncia antes de abrir la inscripción, la mayoría de edad es obligatoria donde hay dinero y las mesas de Pista Libre son gratuitas.",
  alternates: { canonical: "/legal/terminos" },
};

/**
 * Términos y condiciones.
 *
 * ## Dos reglas al escribir acá
 *
 * **1. Cero vocabulario de la lista prohibida**, que es la misma que audita
 * `monsterland-panel/src/discord/revisor.js`: `pozo`, `apuesta`, `apuestas`, `apostar`, `banca`,
 * `casa de apuestas`. Ni siquiera negadas. Escribir "esto no es una apuesta" mete la palabra en la
 * página, y el que la lee (o la indexa) se queda con la asociación, no con la negación. La forma
 * correcta es afirmativa: es un concurso de habilidad, el resultado lo define cómo se juega.
 *
 * Esto no es una preferencia de estilo. En junio de 2026 ALEA intimó a Mercado Libre por sus
 * "torneos de amigos", encuadrándolos en el art. 301 bis del Código Penal. La forma en que se
 * describe la actividad es parte de cómo se la encuadra.
 *
 * **2. Cada cláusula tiene que describir algo que el sistema o la organización cumplen de verdad.**
 * Lo que está programado y se puede verificar:
 *
 *  - el premio fijo e independiente de los inscriptos, y la alerta cuando coincide con lo recaudado
 *  - los 18+ obligatorios donde hay dinero, que no se pueden saltear desde la interfaz
 *  - la Pista Libre con inscripción y premio en cero
 *  - la llave armada con quienes hicieron check-in
 *
 * La única cláusula que **no** está programada es la de "Si un torneo no se juega": el panel tiene
 * el estado `cancelado` pero no tiene flujo de devolución, así que devolver es un acto manual de la
 * organización. Queda escrito acá para que nadie la lea como algo automático.
 */
export default function Pagina() {
  return (
    <Documento
      titulo="Términos y"
      resaltado="condiciones"
      bajada="Cómo funcionan los torneos, qué se puede esperar y qué se espera de vos."
      actualizado="2026-09-09"
    >
      <h2>Qué es Kripta</h2>
      <p>
        Kripta es la comunidad de <strong>Monsterland</strong>, un servidor de Discord de gaming de
        Argentina. Organizamos torneos de Valorant y de Truco, mesas gratuitas y un ranking que se
        reinicia cada temporada. Lo operan dos personas y no es una empresa.
      </p>
      <p>
        Usar este sitio es gratis y no requiere aceptar nada. Estos términos aplican a{" "}
        <strong>participar de los torneos</strong>, que se hace dentro de Discord.
      </p>

      <h2>Concursos de habilidad</h2>
      <p>
        Nuestros torneos se definen <strong>jugando</strong>: gana quien mejor juega. No hay ningún
        elemento de azar que decida el resultado, y el premio no depende de que le vaya bien o mal a
        nadie más que a los que compiten.
      </p>

      <h2>El premio</h2>
      <p>Es la regla más importante y no tiene excepciones:</p>
      <ul>
        <li>
          <strong>El premio de cada torneo es fijo.</strong> Se define al crear el torneo y no cambia
          después.
        </li>
        <li>
          <strong>Se anuncia antes de abrir la inscripción.</strong> Nadie se anota sin saber a qué se
          anota. Una vez abierta la inscripción, el premio ya no se puede modificar: el propio
          sistema lo impide.
        </li>
        <li>
          <strong>Es el mismo con 4 participantes o con 16.</strong> No se forma con las
          inscripciones y no crece ni se achica según cuánta gente se anote.
        </li>
        <li>
          <strong>Lo paga la organización</strong>, de su propio bolsillo, como el costo de organizar
          la competencia.
        </li>
      </ul>

      <h2>Mayoría de edad</h2>
      <p>
        En cualquier torneo con <strong>inscripción o premio en dinero</strong> se participa
        únicamente con <strong>18 años cumplidos</strong>. La condición la confirma una persona de la
        organización, a mano, antes de habilitarte: no se puede saltear desde la interfaz y no se
        aprueba sola por marcar una casilla.
      </p>
      <p>
        Para todos los demás está la <strong>Pista Libre</strong>: torneos con inscripción cero y
        premio cero, abiertos a todo el servidor, donde lo que se gana son roles y puntos de
        temporada.
      </p>

      <h2>Cómo se participa</h2>
      <ul>
        <li>
          Primero te das de alta en Discord con el comando <strong>/registrarme</strong>.
        </li>
        <li>
          Después te anotás apretando <strong>«Anotarme»</strong> en el anuncio del torneo. Si no se
          puede, el sistema te dice por qué en un mensaje que sólo ves vos.
        </li>
        <li>
          El día del torneo hay que hacer <strong>check-in</strong>. La llave se arma únicamente con
          quienes lo hicieron: si no te marcás presente, tu lugar avanza para tu rival.
        </li>
      </ul>

      <h2>Inscripciones y cobros</h2>
      <p>
        Cuando un torneo tiene inscripción, se paga por <strong>Mercado Pago o transferencia</strong>.
        El pago lo confirma a mano una persona de la organización: nada queda anotado como pagado
        automáticamente.
      </p>
      <p>
        Los precios están en pesos argentinos e incluyen todo. No hay cargos que aparezcan después.
      </p>

      <h2>Si un torneo no se juega</h2>
      <p>
        Podemos cancelar o reprogramar un torneo si no se junta el mínimo de participantes, si hay un
        problema técnico o si pasa cualquier cosa que lo haga imposible. Avisamos por el canal de
        torneos del Discord.
      </p>
      <p>
        Si el torneo tenía inscripción y no se juega, <strong>se te devuelve lo que pagaste</strong>,
        por el mismo medio por el que lo pagaste. Si preferís, se te puede acreditar para el torneo
        siguiente.
      </p>

      <h2>Puntos y ranking</h2>
      <p>
        Los puntos de temporada se ganan participando y ganando partidos: no se compran ni se
        transfieren. El ranking es público y se muestra en la portada de este sitio con tu nombre y
        tus números. La temporada se reinicia cada seis semanas y el ranking arranca de cero.
      </p>

      <h2>La moneda interna</h2>
      <p>
        La comunidad tiene una moneda interna que funciona como un programa de lealtad, con cuatro
        reglas que no cambian:
      </p>
      <ul>
        <li>
          <strong>Se gana jugando.</strong> Es la única forma de conseguirla.
        </li>
        <li>
          <strong>No se compra.</strong> No hay ninguna manera de conseguirla con dinero.
        </li>
        <li>
          <strong>No se transfiere entre personas.</strong> Lo que ganaste es tuyo y se queda en tu
          cuenta.
        </li>
        <li>
          <strong>Se canjea en un catálogo cerrado</strong>, definido por la organización.
        </li>
      </ul>
      <p>
        No es dinero, no tiene cotización y no se puede convertir a pesos ni retirar.
      </p>

      <h2>Conducta</h2>
      <p>
        Valen las reglas del servidor de Discord. Tratar mal a otra persona, hacer trampa, usar
        programas que den ventaja o suplantar a alguien son motivos para quedar afuera de los torneos,
        y en los casos graves del servidor. Si te quedás afuera por hacer trampa en un torneo con
        inscripción, esa inscripción no se devuelve.
      </p>

      <h2>Las herramientas gratuitas</h2>
      <p>
        El <Link href="/anotador" className="text-acento-2 underline">anotador de Truco</Link> y el{" "}
        <Link href="/sensibilidad" className="text-acento-2 underline">convertidor de
        sensibilidad</Link> son gratis, no piden registro y se ofrecen tal como están. Funcionan
        enteramente en tu dispositivo y no guardamos nada de lo que cargues en ellos.
      </p>

      <h2>Responsabilidad</h2>
      <p>
        Hacemos lo posible para que el sitio y los torneos funcionen, pero dependemos de servicios de
        terceros (Discord, nuestro proveedor de alojamiento, los propios juegos) que pueden fallar.
        Si algo se cae, avisamos y reprogramamos.
      </p>

      <h2>Cambios</h2>
      <p>
        Si estos términos cambian, cambia la fecha de arriba y se avisa en el Discord. Un cambio nunca
        se aplica a un torneo cuya inscripción ya está abierta: ese torneo se juega con las reglas con
        las que se anunció.
      </p>
      <p>
        Ver también la{" "}
        <Link href="/legal/privacidad" className="text-acento-2 underline">
          política de privacidad
        </Link>
        .
      </p>
    </Documento>
  );
}
