"use client";

import { useState } from "react";

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
  const [equipos, setEquipos] = useState<[Equipo, Equipo]>([
    { nombre: "Nosotros", puntos: 0 },
    { nombre: "Ellos", puntos: 0 },
  ]);
  const [historial, setHistorial] = useState<Array<[number, number]>>([]);

  const ganador = equipos.find((e) => e.puntos >= TOTAL);

  function sumar(indice: 0 | 1, cuanto: number) {
    if (ganador) return;
    setHistorial((h) => [...h, [equipos[0].puntos, equipos[1].puntos]]);
    setEquipos((prev) => {
      const copia: [Equipo, Equipo] = [{ ...prev[0] }, { ...prev[1] }];
      copia[indice].puntos = Math.max(0, Math.min(TOTAL, copia[indice].puntos + cuanto));
      return copia;
    });
  }

  function deshacer() {
    const ultimo = historial[historial.length - 1];
    if (!ultimo) return;
    setEquipos((prev) => [
      { ...prev[0], puntos: ultimo[0] },
      { ...prev[1], puntos: ultimo[1] },
    ]);
    setHistorial((h) => h.slice(0, -1));
  }

  function reiniciar() {
    setEquipos((prev) => [
      { ...prev[0], puntos: 0 },
      { ...prev[1], puntos: 0 },
    ]);
    setHistorial([]);
  }

  function renombrar(indice: 0 | 1, nombre: string) {
    setEquipos((prev) => {
      const copia: [Equipo, Equipo] = [{ ...prev[0] }, { ...prev[1] }];
      copia[indice].nombre = nombre.slice(0, 14);
      return copia;
    });
  }

  return (
    <div className="mt-8">
      {ganador && (
        <div className="tarjeta mb-4 border-acento/50 p-4 text-center">
          <p className="text-lg font-extrabold text-acento-2">¡Ganó {ganador.nombre}!</p>
          <button onClick={reiniciar} className="boton mt-3 text-sm">
            Partida nueva
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {equipos.map((e, i) => {
          const indice = i as 0 | 1;
          const malas = Math.min(LIMITE_MITAD, e.puntos);
          const buenas = Math.max(0, e.puntos - LIMITE_MITAD);
          return (
            <div key={i} className="tarjeta flex flex-col p-4">
              <input
                value={e.nombre}
                onChange={(ev) => renombrar(indice, ev.target.value)}
                aria-label={`Nombre del equipo ${i + 1}`}
                className="w-full border-0 border-b border-borde bg-transparent pb-1.5 text-center text-sm font-bold uppercase tracking-[0.1em] text-texto outline-none focus:border-acento"
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
                    aria-label={`Sumar ${n} a ${e.nombre}`}
                  >
                    +{n}
                  </button>
                ))}
              </div>
              <button
                onClick={() => sumar(indice, -1)}
                disabled={Boolean(ganador) || e.puntos === 0}
                className="boton-sec mt-1.5 py-2 text-sm disabled:opacity-40"
                aria-label={`Restar un punto a ${e.nombre}`}
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
        <button onClick={reiniciar} className="boton-sec flex-1 text-sm">
          Reiniciar
        </button>
      </div>
    </div>
  );
}
