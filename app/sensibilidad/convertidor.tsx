"use client";

import { useMemo } from "react";

import { usePersistido } from "../lib/persistencia";

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
 * Verificado a mano: 800 DPI y sens 2,0 en CS2 da 25,977 cm, que la pantalla redondea a
 * **26,0 cm**. (El comentario anterior decía 25,9: la fórmula estaba bien y el número de
 * referencia mal redondeado, así que quien lo usara para chequear iba a creer que había un bug.)
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

/**
 * El DPI es siempre un entero, así que se le sacan todos los separadores.
 *
 * Hacía falta porque `Number("1.600")` da **1,6**, no 1600: un DPI absurdo pero técnicamente
 * válido, así que el convertidor no avisaba nada y devolvía un resultado cien veces más chico.
 * Y `Number("1,600")` da `NaN`, o sea que escribir el DPI con coma tiraba el mensaje de "poné un
 * DPI mayor a cero" con un DPI perfectamente razonable escrito en la pantalla.
 *
 * Es asimétrico con la sensibilidad a propósito: ahí la coma **sí** es separador decimal
 * (`0,4`), así que se convierte en punto en vez de borrarse.
 */
function leerDpi(texto: string): number {
  const soloDigitos = texto.replace(/[^0-9]/g, "");
  return soloDigitos === "" ? NaN : Number(soloDigitos);
}

/**
 * Formatea la sensibilidad con la precisión que el número necesite.
 *
 * Con `toFixed(3)` fijo, convertir desde Overwatch 2 hacia Valorant con sensibilidad baja daba
 * **"0"**: el resultado real era 0,00038 y se perdía entero. Un convertidor que contesta cero es
 * peor que uno que no contesta, porque el número parece una respuesta.
 */
function formatearSens(valor: number): string {
  const decimales = valor >= 1 ? 3 : valor >= 0.01 ? 4 : 6;
  return valor.toFixed(decimales).replace(/\.?0+$/, "").replace(".", ",");
}

/** Los valores elegidos se recuerdan: la gente vuelve a chequear su sensibilidad, no la calcula una vez. */
const CLAVE_GUARDADO = "kripta:sensibilidad";

type Elecciones = { origen: IdJuego; destino: IdJuego; sens: string; dpi: string };

const ELECCIONES_INICIALES: Elecciones = {
  origen: "valorant",
  destino: "cs2",
  sens: "0.4",
  dpi: "800",
};

const esIdJuego = (id: unknown): id is IdJuego => JUEGOS.some((j) => j.id === id);

function validarElecciones(crudo: unknown): Elecciones | null {
  if (typeof crudo !== "object" || crudo === null) return null;
  const g = crudo as Record<string, unknown>;
  if (!esIdJuego(g.origen) || !esIdJuego(g.destino)) return null;
  if (typeof g.sens !== "string" || typeof g.dpi !== "string") return null;
  return { origen: g.origen, destino: g.destino, sens: g.sens, dpi: g.dpi };
}

export function Convertidor() {
  // Ver app/lib/persistencia.ts para el por qué de useSyncExternalStore en vez de un efecto.
  const [elecciones, setElecciones] = usePersistido(
    CLAVE_GUARDADO,
    ELECCIONES_INICIALES,
    validarElecciones,
  );
  const { origen, destino, sens, dpi } = elecciones;

  const cambiar = <C extends keyof Elecciones>(campo: C, valor: Elecciones[C]) =>
    setElecciones((previo) => ({ ...previo, [campo]: valor }));

  const mismoJuego = origen === destino;

  const resultado = useMemo(() => {
    const s = Number(sens.replace(",", "."));
    const d = leerDpi(dpi);
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
              onChange={(e) => cambiar("origen", e.target.value as IdJuego)}
              className="w-full rounded-xl border border-borde bg-panel-2 px-3 py-2.5 text-texto focus-visible:border-acento"
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
              onChange={(e) => cambiar("destino", e.target.value as IdJuego)}
              className="w-full rounded-xl border border-borde bg-panel-2 px-3 py-2.5 text-texto focus-visible:border-acento"
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
              onChange={(e) => cambiar("sens", e.target.value)}
              inputMode="decimal"
              className="w-full rounded-xl border border-borde bg-panel-2 px-3 py-2.5 text-texto focus-visible:border-acento"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[11px] uppercase tracking-[0.12em] text-tenue">DPI del mouse</span>
            <input
              value={dpi}
              onChange={(e) => cambiar("dpi", e.target.value)}
              inputMode="numeric"
              className="w-full rounded-xl border border-borde bg-panel-2 px-3 py-2.5 text-texto focus-visible:border-acento"
            />
          </label>
        </div>

        {/*
          Elegir el mismo juego en los dos lados devolvía el mismo número sin ningún aviso, y se
          lee como si el convertidor estuviera roto. Se dice qué pasa en vez de esconderlo.
        */}
        {mismoJuego && (
          <p className="mt-4 rounded-xl border border-alerta/40 bg-alerta/5 px-3 py-2 text-center text-xs text-alerta">
            Elegiste el mismo juego en los dos lados, así que el número no cambia. Cambiá uno para
            convertir.
          </p>
        )}

        {/* aria-live: el resultado se actualiza sin recargar, así que hay que anunciarlo. */}
        <div className="mt-6 border-t border-borde pt-6 text-center" aria-live="polite">
          {resultado ? (
            <>
              <p className="text-[11px] uppercase tracking-[0.14em] text-tenue">
                Tu sensibilidad en {JUEGOS.find((j) => j.id === destino)!.nombre}
              </p>
              <p className="texto-degradado mt-1 text-5xl font-extrabold tabular-nums sm:text-6xl">
                {formatearSens(resultado.convertida)}
              </p>
              <div className="mt-5 grid grid-cols-3 gap-2 text-sm">
                <Dato etiqueta="cm/360" valor={`${resultado.cm.toFixed(1).replace(".", ",")} cm`} />
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
