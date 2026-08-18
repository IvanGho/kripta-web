"use client";

import { useMemo, useState } from "react";

/**
 * Convertidor de sensibilidad entre shooters.
 *
 * Cómo funciona de verdad: cada juego define un "yaw", que son los grados que gira la cámara
 * por cada paso que reporta el mouse, con la sensibilidad en 1. Convertir es mantener la
 * distancia física que hay que mover el mouse para dar un giro completo:
 *
 *     sensDestino = sensOrigen × (yawOrigen / yawDestino)
 *
 * De ahí sale el famoso 3,18 para pasar de Valorant a CS2, que no es un número mágico:
 * es 0,07 / 0,022.
 *
 * El cm/360 es la medida honesta, porque es la única que no depende del juego: es cuántos
 * centímetros tenés que arrastrar el mouse para girar 360 grados.
 *
 *     cm/360 = (360 / (yaw × sens)) / DPI × 2,54
 *
 * Verificado contra el caso publicado: 800 DPI y sens 2,0 en CS2 da 25,9 cm.
 */

const JUEGOS = [
  { id: "valorant", nombre: "Valorant", yaw: 0.07 },
  { id: "cs2", nombre: "CS2 / CS:GO", yaw: 0.022 },
  // Apex corre sobre Source, así que comparte el yaw de CS.
  { id: "apex", nombre: "Apex Legends", yaw: 0.022 },
  { id: "ow2", nombre: "Overwatch 2", yaw: 0.0066 },
] as const;

type IdJuego = (typeof JUEGOS)[number]["id"];

const yawDe = (id: IdJuego) => JUEGOS.find((j) => j.id === id)!.yaw;

function cm360(sens: number, yaw: number, dpi: number): number {
  if (sens <= 0 || dpi <= 0) return 0;
  return (360 / (yaw * sens) / dpi) * 2.54;
}

export function Convertidor() {
  const [origen, setOrigen] = useState<IdJuego>("valorant");
  const [destino, setDestino] = useState<IdJuego>("cs2");
  const [sens, setSens] = useState("0.4");
  const [dpi, setDpi] = useState("800");

  const resultado = useMemo(() => {
    const s = Number(sens.replace(",", "."));
    const d = Number(dpi);
    if (!Number.isFinite(s) || s <= 0 || !Number.isFinite(d) || d <= 0) return null;
    const convertida = s * (yawDe(origen) / yawDe(destino));
    return {
      convertida,
      cm: cm360(s, yawDe(origen), d),
      edpiOrigen: Math.round(s * d),
      edpiDestino: Math.round(convertida * d),
    };
  }, [origen, destino, sens, dpi]);

  return (
    <div className="mt-8">
      <div className="tarjeta p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-[11px] uppercase tracking-[0.12em] text-tenue">Desde</span>
            <select
              value={origen}
              onChange={(e) => setOrigen(e.target.value as IdJuego)}
              className="w-full rounded-xl border border-borde bg-panel-2 px-3 py-2.5 text-texto outline-none focus:border-acento"
            >
              {JUEGOS.map((j) => (
                <option key={j.id} value={j.id}>{j.nombre}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[11px] uppercase tracking-[0.12em] text-tenue">Hacia</span>
            <select
              value={destino}
              onChange={(e) => setDestino(e.target.value as IdJuego)}
              className="w-full rounded-xl border border-borde bg-panel-2 px-3 py-2.5 text-texto outline-none focus:border-acento"
            >
              {JUEGOS.map((j) => (
                <option key={j.id} value={j.id}>{j.nombre}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[11px] uppercase tracking-[0.12em] text-tenue">Tu sensibilidad</span>
            <input
              value={sens}
              onChange={(e) => setSens(e.target.value)}
              inputMode="decimal"
              className="w-full rounded-xl border border-borde bg-panel-2 px-3 py-2.5 text-texto outline-none focus:border-acento"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[11px] uppercase tracking-[0.12em] text-tenue">DPI del mouse</span>
            <input
              value={dpi}
              onChange={(e) => setDpi(e.target.value)}
              inputMode="numeric"
              className="w-full rounded-xl border border-borde bg-panel-2 px-3 py-2.5 text-texto outline-none focus:border-acento"
            />
          </label>
        </div>

        <div className="mt-6 border-t border-borde pt-6 text-center">
          {resultado ? (
            <>
              <p className="text-[11px] uppercase tracking-[0.14em] text-tenue">
                Tu sensibilidad en {JUEGOS.find((j) => j.id === destino)!.nombre}
              </p>
              <p className="texto-degradado mt-1 text-5xl font-extrabold tabular-nums sm:text-6xl">
                {resultado.convertida.toFixed(3).replace(/\.?0+$/, "")}
              </p>
              <div className="mt-5 grid grid-cols-3 gap-2 text-sm">
                <Dato etiqueta="cm/360" valor={`${resultado.cm.toFixed(1)} cm`} />
                <Dato etiqueta="eDPI origen" valor={String(resultado.edpiOrigen)} />
                <Dato etiqueta="eDPI destino" valor={String(resultado.edpiDestino)} />
              </div>
            </>
          ) : (
            <p className="text-tenue">Poné una sensibilidad y un DPI mayores a cero.</p>
          )}
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-tenue">
        Mantiene el cm/360, así que el giro te queda igual en los dos juegos. No convierte la
        sensibilidad de las miras con zoom, que cada juego maneja aparte.
      </p>
    </div>
  );
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="rounded-xl border border-borde bg-panel-2 px-2 py-2.5">
      <p className="text-[10px] uppercase tracking-[0.1em] text-tenue">{etiqueta}</p>
      <p className="mt-0.5 font-bold tabular-nums">{valor}</p>
    </div>
  );
}
