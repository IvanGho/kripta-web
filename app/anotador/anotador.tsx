"use client";

import { usePersistido } from "../lib/persistencia";

/**
 * Anotador de Truco: malas y buenas hasta 30.
 *
 * Los fósforos se dibujan en SVG y no con imágenes, por lo mismo que el logo: se ven
 * nítidos en cualquier pantalla y no suman peso de descarga.
 *
 * Regla del truco: se juega a 30 puntos partidos en dos mitades de 15. Los primeros 15 son
 * "las malas" y los últimos 15 "las buenas". Se anota de a 5, cerrando cada grupo con una
 * diagonal, que es la forma de la mesa.
 */

const LIMITE_MITAD = 15;
const TOTAL = 30;

type Equipo = { nombre: string; puntos: number };

/**
 * Toda la partida en un solo objeto de estado.
 *
 * No es un detalle de estilo: antes `equipos` e `historial` eran dos estados separados, y
 * `sumar` armaba el snapshot del historial leyendo `equipos` del closure del render mientras
 * actualizaba los puntos con un updater funcional (`setEquipos(prev => ...)`). Mezclar las dos
 * formas significa que el snapshot puede quedar viejo si dos actualizaciones caen en el mismo
 * lote, y "Deshacer" te devuelve a un puntaje que no era el anterior.
 *
 * Con un solo objeto, el snapshot y el cambio se calculan dentro del mismo updater, sobre el
 * mismo `prev`. El bug no se arregla con cuidado: se vuelve imposible de escribir.
 */
type Partida = {
  equipos: [Equipo, Equipo];
  historial: Array<[number, number]>;
};

const PARTIDA_INICIAL: Partida = {
  equipos: [
    { nombre: "Nosotros", puntos: 0 },
    { nombre: "Ellos", puntos: 0 },
  ],
  historial: [],
};

/** Dónde se guarda la partida en curso. */
const CLAVE_GUARDADO = "kripta:anotador";

/** Nombre para los lectores de pantalla cuando el jugador borró el del equipo. */
function nombreParaLeer(equipo: Equipo, indice: number): string {
  return equipo.nombre.trim() || (indice === 0 ? "Nosotros" : "Ellos");
}

/**
 * Valida lo que había guardado. Devuelve null si no sirve, y entonces se arranca de cero.
 *
 * No es paranoia: lo guardado puede venir de una versión anterior del código o estar editado a
 * mano desde la consola. Un puntaje de 999 o un nombre que no es texto rompen el render.
 */
function validarPartida(crudo: unknown): Partida | null {
  if (typeof crudo !== "object" || crudo === null) return null;
  const { equipos, historial } = crudo as Partida;
  if (!Array.isArray(equipos) || equipos.length !== 2) return null;
  for (const equipo of equipos) {
    if (typeof equipo?.nombre !== "string" || typeof equipo?.puntos !== "number") return null;
    if (!Number.isFinite(equipo.puntos) || equipo.puntos < 0 || equipo.puntos > TOTAL) return null;
  }
  return {
    equipos: [equipos[0], equipos[1]],
    historial: Array.isArray(historial) ? historial : [],
  };
}

/**
 * Un grupo de 5: cuatro palitos y la diagonal que lo cierra. Recibe cuántos de los 5
 * están marcados.
 */
function Grupo({ marcados }: { marcados: number }) {
  const trazo = "#5dff86";
  return (
    <svg viewBox="0 0 34 30" className="h-8 w-9" aria-hidden="true">
      {/* Los cuatro lados del cuadrado. */}
      {marcados >= 1 && <line x1="5" y1="4" x2="5" y2="26" stroke={trazo} strokeWidth="2.5" strokeLinecap="round" />}
      {marcados >= 2 && <line x1="5" y1="4" x2="27" y2="4" stroke={trazo} strokeWidth="2.5" strokeLinecap="round" />}
      {marcados >= 3 && <line x1="27" y1="4" x2="27" y2="26" stroke={trazo} strokeWidth="2.5" strokeLinecap="round" />}
      {marcados >= 4 && <line x1="5" y1="26" x2="27" y2="26" stroke={trazo} strokeWidth="2.5" strokeLinecap="round" />}
      {/* El quinto cierra el grupo con la diagonal. */}
      {marcados >= 5 && <line x1="5" y1="4" x2="27" y2="26" stroke={trazo} strokeWidth="2.5" strokeLinecap="round" />}
    </svg>
  );
}

/** Dibuja una mitad (malas o buenas): tres grupos de 5. */
function Mitad({ puntos, etiqueta }: { puntos: number; etiqueta: string }) {
  const enEstaMitad = Math.max(0, Math.min(LIMITE_MITAD, puntos));
  const grupos = [0, 1, 2].map((i) => Math.max(0, Math.min(5, enEstaMitad - i * 5)));
  return (
    <div>
      <p className="mb-1.5 text-[10px] uppercase tracking-[0.14em] text-tenue">{etiqueta}</p>
      <div className="flex gap-1.5">
        {grupos.map((m, i) => (
          <Grupo key={i} marcados={m} />
        ))}
      </div>
    </div>
  );
}

export function Anotador() {
  /*
   * La partida se guarda en el navegador.
   *
   * Por qué hacía falta: la página promete que el anotador "está pensado para el celular apoyado
   * en la mesa" y que "se puede instalar como app". Con el celular apoyado y la pantalla
   * apagada, el sistema descarta la pestaña cuando necesita memoria. Al volver, la partida
   * estaba en cero. Para un anotador, perder el puntaje es perder la única función que tiene.
   *
   * El cómo está explicado en app/lib/persistencia.ts: leerlo en el valor inicial de useState
   * rompe la hidratación, y leerlo en un efecto viola una regla de React 19.
   */
  const [partida, setPartida] = usePersistido(CLAVE_GUARDADO, PARTIDA_INICIAL, validarPartida);
  const { equipos, historial } = partida;

  const ganador = equipos.find((e) => e.puntos >= TOTAL);

  function sumar(indice: 0 | 1, cuanto: number) {
    if (ganador) return;
    setPartida((prev) => {
      const antes = prev.equipos[indice].puntos;
      const despues = Math.max(0, Math.min(TOTAL, antes + cuanto));
      // Si el clamp dejó el puntaje igual, no se apila un paso de "Deshacer" que no deshace
      // nada. Antes se apilaba siempre, así que en 30 puntos el botón acumulaba pasos vacíos.
      if (despues === antes) return prev;

      const equipos: [Equipo, Equipo] = [{ ...prev.equipos[0] }, { ...prev.equipos[1] }];
      equipos[indice].puntos = despues;
      return {
        equipos,
        // El snapshot sale del mismo `prev` que el cambio, así que nunca queda desfasado.
        historial: [...prev.historial, [prev.equipos[0].puntos, prev.equipos[1].puntos]],
      };
    });
  }

  function deshacer() {
    setPartida((prev) => {
      const ultimo = prev.historial[prev.historial.length - 1];
      if (!ultimo) return prev;
      return {
        equipos: [
          { ...prev.equipos[0], puntos: ultimo[0] },
          { ...prev.equipos[1], puntos: ultimo[1] },
        ],
        historial: prev.historial.slice(0, -1),
      };
    });
  }

  /** Arranca de cero conservando los nombres. `pedirConfirmacion` es false al ya haber ganador. */
  function reiniciar(pedirConfirmacion = true) {
    const hayPartidaEnCurso = equipos.some((e) => e.puntos > 0);
    // Reiniciar está al lado de Deshacer y borra la partida entera. Un toque de más no puede
    // costarte el puntaje de una mesa que va por la mitad.
    if (pedirConfirmacion && hayPartidaEnCurso && !window.confirm("¿Borrar la partida y arrancar de cero?")) {
      return;
    }
    setPartida((prev) => ({
      equipos: [
        { ...prev.equipos[0], puntos: 0 },
        { ...prev.equipos[1], puntos: 0 },
      ],
      historial: [],
    }));
  }

  function renombrar(indice: 0 | 1, nombre: string) {
    setPartida((prev) => {
      const equipos: [Equipo, Equipo] = [{ ...prev.equipos[0] }, { ...prev.equipos[1] }];
      equipos[indice].nombre = nombre.slice(0, 14);
      return { ...prev, equipos };
    });
  }

  return (
    <div className="mt-8">
      {ganador && (
        <div className="tarjeta mb-4 border-acento/50 p-4 text-center">
          <p className="text-lg font-extrabold text-acento-2">¡Ganó {nombreParaLeer(ganador, equipos.indexOf(ganador))}!</p>
          {/* Ya está terminada: no hay nada que perder, así que no se pregunta. */}
          <button onClick={() => reiniciar(false)} className="boton mt-3 text-sm">
            Partida nueva
          </button>
        </div>
      )}

      {/*
        El puntaje se anuncia a los lectores de pantalla. Sin esto, apretar +1 no producía
        ninguna señal: el número cambiaba en la pantalla y nada más. `polite` para que espere a
        que el usuario termine lo que está haciendo en vez de interrumpirlo en cada toque.
      */}
      <p aria-live="polite" className="sr-only">
        {equipos.map((e, i) => `${nombreParaLeer(e, i)}: ${e.puntos}`).join(". ")}
      </p>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {equipos.map((e, i) => {
          const indice = i as 0 | 1;
          const malas = Math.min(LIMITE_MITAD, e.puntos);
          const buenas = Math.max(0, e.puntos - LIMITE_MITAD);
          // El input se puede dejar vacío, y entonces los aria-label de los 8 botones quedaban
          // en "Sumar 1 a " y "Restar un punto a ". Con nombre de respaldo siguen teniendo
          // sentido dichos en voz alta.
          const nombre = nombreParaLeer(e, i);
          return (
            <div key={i} className="tarjeta flex flex-col p-4">
              <label className="sr-only" htmlFor={`nombre-equipo-${i}`}>
                Nombre del equipo {i + 1}
              </label>
              <input
                id={`nombre-equipo-${i}`}
                value={e.nombre}
                onChange={(ev) => renombrar(indice, ev.target.value)}
                placeholder={i === 0 ? "Nosotros" : "Ellos"}
                className="w-full rounded-none border-0 border-b border-borde bg-transparent pb-1.5 text-center text-sm font-bold uppercase tracking-[0.1em] text-texto focus-visible:border-acento"
              />

              <p className="texto-degradado mt-3 text-center text-5xl font-extrabold tabular-nums sm:text-6xl">
                {e.puntos}
              </p>

              <div className="mt-4 space-y-2.5">
                <Mitad puntos={malas} etiqueta="Malas" />
                <Mitad puntos={buenas} etiqueta="Buenas" />
              </div>

              <div className="mt-5 grid grid-cols-3 gap-1.5">
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    onClick={() => sumar(indice, n)}
                    disabled={Boolean(ganador)}
                    className="boton px-0 py-2.5 text-base disabled:opacity-40"
                    aria-label={`Sumar ${n} a ${nombre}`}
                  >
                    +{n}
                  </button>
                ))}
              </div>
              <button
                onClick={() => sumar(indice, -1)}
                disabled={Boolean(ganador) || e.puntos === 0}
                className="boton-sec mt-1.5 py-2 text-sm disabled:opacity-40"
                aria-label={`Restar un punto a ${nombre}`}
              >
                −1
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex gap-2">
        <button onClick={deshacer} disabled={historial.length === 0} className="boton-sec flex-1 text-sm disabled:opacity-40">
          Deshacer
        </button>
        <button onClick={() => reiniciar()} className="boton-sec flex-1 text-sm">
          Reiniciar
        </button>
      </div>
    </div>
  );
}
