import type { Campeon, Torneo } from "./datos";
import { URL_SITIO } from "./sitio";

/**
 * Datos estructurados (JSON-LD) para los buscadores.
 *
 * Qué son: un bloque de JSON en la página que le dice a Google **qué significa** el contenido, en
 * vez de dejar que lo adivine del HTML. Es lo que habilita los resultados enriquecidos, o sea las
 * fichas con estrellas, fechas de eventos o preguntas desplegables en la página de resultados.
 *
 * Por qué vale acá y no es humo: un sitio nuevo de una comunidad chica no le va a ganar a nadie
 * por autoridad de dominio. Lo que sí puede hacer es **ocupar más espacio visual** en los
 * resultados para las búsquedas que le corresponden, y eso se consigue con esto.
 *
 * Tres tipos, cada uno con un motivo:
 *
 *  - `Organization` en la home: consolida el nombre de la marca. Sin esto, "Kripta" y
 *    "Monsterland" son dos cadenas de texto sueltas para Google.
 *  - `Event` por cada torneo: es el que más potencial tiene, porque los eventos con fecha
 *    aparecen destacados. Se genera de los datos reales del panel, no a mano.
 *  - `WebApplication` en las herramientas: el anotador y el convertidor son la puerta de entrada
 *    por búsquedas ("anotador de truco", "convertidor de sensibilidad valorant cs2"), que es
 *    tráfico que llega solo y sin pagar.
 *
 * Regla que no se negocia acá: **el JSON-LD tiene que describir lo que la página muestra de
 * verdad.** Declarar un evento que no existe, o un precio distinto al que se cobra, es motivo de
 * penalización. Por eso `eventosDeTorneos` recibe los torneos reales y omite el bloque entero
 * cuando los datos son de ejemplo.
 */

type Json = Record<string, unknown>;

export function organizacion(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Kripta",
    alternateName: "Monsterland",
    url: URL_SITIO,
    logo: `${URL_SITIO}/icon.svg`,
    description:
      "Comunidad argentina de gaming con torneos semanales de Valorant y Truco, ranking de temporada y premios fijos.",
    areaServed: { "@type": "Country", name: "Argentina" },
  };
}

/**
 * Un `Event` por torneo abierto.
 *
 * Sobre el vocabulario: se usa `offers` con el precio de la inscripción, que es lo que
 * corresponde, y **nunca** se describe el premio como si fuera un pozo formado por las
 * inscripciones. El premio es fijo y lo paga la organización: así está en las reglas del
 * proyecto y así tiene que estar acá, porque esto es texto público que un tercero puede leer.
 *
 * Devuelve `[]` cuando los datos son de ejemplo: anunciarle a Google torneos inventados es
 * pedirle una penalización.
 */
export function eventosDeTorneos(torneos: Torneo[], esEjemplo: boolean): Json[] {
  if (esEjemplo) return [];

  return torneos.map((t) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: t.nombre,
    startDate: t.empiezaEn,
    eventStatus: "https://schema.org/EventScheduled",
    // Se juega online, en el Discord de la comunidad.
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    location: {
      "@type": "VirtualLocation",
      url: URL_SITIO,
    },
    organizer: { "@type": "Organization", name: "Kripta", url: URL_SITIO },
    description: `Torneo de ${t.juego} en formato ${t.formato}. El premio es fijo y se anuncia antes de abrir la inscripción.`,
    maximumAttendeeCapacity: t.cupo,
    offers: {
      "@type": "Offer",
      price: (t.inscripcionCentavos / 100).toFixed(2),
      priceCurrency: "ARS",
      availability:
        t.inscriptos >= t.cupo
          ? "https://schema.org/SoldOut"
          : "https://schema.org/InStock",
      url: URL_SITIO,
    },
  }));
}

/** Las herramientas gratuitas, que son la puerta de entrada por búsquedas. */
export function herramienta({
  nombre,
  descripcion,
  ruta,
}: {
  nombre: string;
  descripcion: string;
  ruta: string;
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: nombre,
    description: descripcion,
    url: `${URL_SITIO}${ruta}`,
    applicationCategory: "GameApplication",
    // Corre en el navegador, sin instalar nada.
    operatingSystem: "Web",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "ARS" },
    inLanguage: "es-AR",
    publisher: { "@type": "Organization", name: "Kripta", url: URL_SITIO },
  };
}

/**
 * Las preguntas de las páginas de herramientas, como `FAQPage`.
 *
 * Los `h2` de esas páginas ya están escritos como preguntas ("¿Se puede usar en el celular?",
 * "¿Y el eDPI?"), así que el contenido para esto ya existía: sólo faltaba declararlo. Es el caso
 * donde el JSON-LD sale gratis.
 *
 * Las respuestas se pasan explícitas y no se extraen del HTML, porque tienen que ser un resumen
 * fiel y corto, y el texto de la página está escrito para leerse, no para una ficha.
 */
export function preguntas(items: Array<{ pregunta: string; respuesta: string }>): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ pregunta, respuesta }) => ({
      "@type": "Question",
      name: pregunta,
      acceptedAnswer: { "@type": "Answer", text: respuesta },
    })),
  };
}

/** El salón de campeones, como lista ordenada. Ayuda a que Google entienda que es un ranking. */
export function listaDeCampeones(campeones: Campeon[], esEjemplo: boolean): Json | null {
  if (esEjemplo || campeones.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Salón de campeones de la Kripta",
    itemListElement: campeones.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.nombre,
      description: `Campeón de ${c.torneo} (${c.juego})`,
    })),
  };
}
