"use client";

import { track } from "@vercel/analytics";
import { useEffect, useMemo, useState } from "react";
import type { Torneo } from "../lib/datos";
import { formatoARS, fechaLinda } from "../lib/datos";
import { AccionesAgendaTorneo } from "./acciones-agenda-torneo";
import { BotonDiscord } from "./boton-discord";

const CLAVE_JUEGO = "kripta:juego-preferido";
const TODOS = "todos";

/**
 * La agenda es el momento de decision: si alguien llega por Valorant, no deberia tener que
 * recorrer una tarjeta de Truco para saber que hay para jugar. El filtro se guarda en este
 * navegador para que la proxima visita empiece por lo que la persona eligio.
 *
 * Solo esta pieza cruza al cliente. Los torneos son datos planos y serializables, tal como pide
 * el limite Server/Client de Next, y el resto de la portada sigue siendo HTML de servidor.
 */
export function AgendaTorneos({ torneos }: { torneos: Torneo[] }) {
  const juegos = useMemo(
    () => [...new Set(torneos.map((torneo) => torneo.juego.trim()).filter(Boolean))],
    [torneos],
  );
  const [juego, setJuego] = useState(TODOS);

  useEffect(() => {
    let temporizador: number | undefined;
    try {
      const guardado = window.localStorage.getItem(CLAVE_JUEGO);
      if (guardado === TODOS || (guardado && juegos.includes(guardado))) {
        temporizador = window.setTimeout(() => setJuego(guardado), 0);
      }
    } catch {
      // La agenda sigue funcionando aunque el navegador bloquee el almacenamiento local.
    }
    return () => {
      if (temporizador !== undefined) window.clearTimeout(temporizador);
    };
  }, [juegos]);

  const visibles = juego === TODOS
    ? torneos
    : torneos.filter((torneo) => torneo.juego === juego);

  function elegir(siguiente: string) {
    setJuego(siguiente);
    try {
      window.localStorage.setItem(CLAVE_JUEGO, siguiente);
    } catch {
      // Guardar la preferencia es una mejora; elegir el filtro no depende de ello.
    }
    track("filtrar_torneos", { juego: siguiente });
  }

  return (
    <div className="agenda-interactiva">
      <div className="agenda-filtro" aria-label="Filtrar torneos por juego">
        <div>
          <p className="agenda-filtro-etiqueta">Elegí tu juego</p>
          <p className="agenda-filtro-ayuda">Te mostramos primero lo que viniste a buscar.</p>
        </div>
        <div className="agenda-filtro-opciones" role="group" aria-label="Juegos disponibles">
          {[TODOS, ...juegos].map((opcion) => {
            const activo = juego === opcion;
            const cantidad = opcion === TODOS
              ? torneos.length
              : torneos.filter((torneo) => torneo.juego === opcion).length;
            return (
              <button
                key={opcion}
                type="button"
                className="agenda-filtro-boton"
                aria-pressed={activo}
                onClick={() => elegir(opcion)}
              >
                {opcion === TODOS ? "Todos" : opcion}
                <span aria-hidden="true">{cantidad}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="agenda-resumen" aria-live="polite">
        {visibles.length === 1
          ? `1 torneo ${juego === TODOS ? "disponible" : `de ${juego}`}`
          : `${visibles.length} torneos ${juego === TODOS ? "disponibles" : `de ${juego}`}`}
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        {visibles.map((torneo) => (
          <TarjetaTorneo key={torneo.id} torneo={torneo} />
        ))}
      </div>
    </div>
  );
}

function TarjetaTorneo({ torneo }: { torneo: Torneo }) {
  const gratis = torneo.inscripcionCentavos === 0 && torneo.premioCentavos === 0;
  const lleno = torneo.inscriptos >= torneo.cupo;
  const ocupacion = torneo.cupo > 0
    ? Math.max(0, Math.min(100, (torneo.inscriptos / torneo.cupo) * 100))
    : 0;

  return (
    <article className="tarjeta tarjeta-torneo tarjeta-viva flex flex-col p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="sobre-titulo">
          {torneo.juego} · {torneo.formato}
        </span>
        <span className="estado-torneo">{gratis ? "Pista Libre" : "18+"}</span>
      </div>
      <h3 className="mt-5 text-xl font-bold leading-snug">{torneo.nombre}</h3>
      <p className="mt-2 text-sm text-tenue">{fechaLinda(torneo.empiezaEn)}</p>
      <dl className="torneo-datos">
        <div>
          <dt>Inscripción</dt>
          <dd>{torneo.inscripcionCentavos === 0 ? "Gratis" : formatoARS(torneo.inscripcionCentavos)}</dd>
        </div>
        <div>
          <dt>Premio fijo</dt>
          <dd>{torneo.premioCentavos === 0 ? "Rol + puntos" : formatoARS(torneo.premioCentavos)}</dd>
        </div>
      </dl>
      <div className="mt-auto">
        <p className="mb-2 flex justify-between text-xs text-tenue">
          <span>{lleno ? "Cupo completo" : "Lugares ocupados"}</span>
          <span className="dato">{torneo.inscriptos}/{torneo.cupo}</span>
        </p>
        <div className="cupo-barra">
          <span style={{ width: `${ocupacion}%` }} />
        </div>
      </div>
      <BotonDiscord ubicacion="tarjeta-torneo" variante="secundario" className="mt-5 w-full text-sm">
        {lleno ? "Anotarme a la lista de espera" : "Anotarme"}
        <span aria-hidden="true">↗</span>
      </BotonDiscord>
      <AccionesAgendaTorneo
        torneo={{ id: torneo.id, nombre: torneo.nombre, empiezaEn: torneo.empiezaEn }}
      />
      {!gratis && <p className="mt-2 text-center text-[11px] text-tenue">Sólo mayores de 18</p>}
    </article>
  );
}
