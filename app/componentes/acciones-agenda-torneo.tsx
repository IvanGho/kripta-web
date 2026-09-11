"use client";

import { track } from "@vercel/analytics";
import { useMemo, useState, useSyncExternalStore } from "react";

type TorneoAgenda = {
  id: number;
  nombre: string;
  empiezaEn: string;
};

const CLAVE_AGENDA = "kripta:torneos-agendados";
const EVENTO_AGENDA = "kripta:agenda-actualizada";
const DURACION_ESTIMADA_MS = 3 * 60 * 60 * 1000;

function leerGuardados(): number[] {
  try {
    const valor = JSON.parse(window.localStorage.getItem(CLAVE_AGENDA) ?? "[]");
    return Array.isArray(valor) ? valor.filter((id): id is number => typeof id === "number") : [];
  } catch {
    return [];
  }
}

function suscribirAgenda(actualizar: () => void) {
  const alCambiarAlmacenamiento = (evento: StorageEvent) => {
    if (evento.key === CLAVE_AGENDA) actualizar();
  };
  window.addEventListener("storage", alCambiarAlmacenamiento);
  window.addEventListener(EVENTO_AGENDA, actualizar);
  return () => {
    window.removeEventListener("storage", alCambiarAlmacenamiento);
    window.removeEventListener(EVENTO_AGENDA, actualizar);
  };
}

function fechaIcal(fecha: Date): string {
  return fecha.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function escaparIcal(texto: string): string {
  return texto.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

function enlaceGoogle(torneo: TorneoAgenda): string | null {
  const inicio = new Date(torneo.empiezaEn);
  if (Number.isNaN(inicio.getTime())) return null;
  const fin = new Date(inicio.getTime() + DURACION_ESTIMADA_MS);
  const parametros = new URLSearchParams({
    action: "TEMPLATE",
    text: `Monsterland | ${torneo.nombre}`,
    dates: `${fechaIcal(inicio)}/${fechaIcal(fin)}`,
    details: "Recordatorio de torneo de Monsterland. Confirmá tu inscripción y el check-in en Discord.",
    ctz: "America/Argentina/Buenos_Aires",
  });
  return `https://calendar.google.com/calendar/render?${parametros.toString()}`;
}

function descargarIcal(torneo: TorneoAgenda) {
  const inicio = new Date(torneo.empiezaEn);
  if (Number.isNaN(inicio.getTime())) return false;
  const fin = new Date(inicio.getTime() + DURACION_ESTIMADA_MS);
  const ahora = new Date();
  const contenido = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Monsterland//Kripta//ES",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:monsterland-torneo-${torneo.id}@kripta`,
    `DTSTAMP:${fechaIcal(ahora)}`,
    `DTSTART:${fechaIcal(inicio)}`,
    `DTEND:${fechaIcal(fin)}`,
    `SUMMARY:${escaparIcal(`Monsterland | ${torneo.nombre}`)}`,
    `DESCRIPTION:${escaparIcal("Recordatorio de torneo de Monsterland. Confirmá tu inscripción y el check-in en Discord.")}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
  const archivo = new Blob([contenido], { type: "text/calendar;charset=utf-8" });
  const enlace = document.createElement("a");
  enlace.href = URL.createObjectURL(archivo);
  enlace.download = `monsterland-${torneo.id}.ics`;
  document.body.append(enlace);
  enlace.click();
  enlace.remove();
  URL.revokeObjectURL(enlace.href);
  return true;
}

export function AccionesAgendaTorneo({ torneo }: { torneo: TorneoAgenda }) {
  const [mensaje, setMensaje] = useState("");
  const google = useMemo(() => enlaceGoogle(torneo), [torneo]);
  const agendado = useSyncExternalStore(
    suscribirAgenda,
    () => leerGuardados().includes(torneo.id),
    () => false,
  );

  function marcarAgendado(medio: "google" | "ics") {
    const guardados = leerGuardados();
    if (!guardados.includes(torneo.id)) {
      window.localStorage.setItem(CLAVE_AGENDA, JSON.stringify([...guardados, torneo.id]));
    }
    window.dispatchEvent(new Event(EVENTO_AGENDA));
    track("agendar_torneo", { medio, torneo_id: String(torneo.id) });
  }

  return (
    <div className="agenda-torneo">
      <p className="agenda-titulo">
        {agendado ? "Guardado para vos" : "No te lo pierdas"}
      </p>
      <div className="agenda-acciones">
        {google && (
          <a
            href={google}
            target="_blank"
            rel="noopener noreferrer"
            className="agenda-google"
            data-agenda-google="true"
            onClick={() => {
              marcarAgendado("google");
              setMensaje("Abrimos Google Calendar en otra pestaña.");
            }}
          >
            {agendado ? "Google Calendar ✓" : "Agregar a Google"}
          </a>
        )}
        <button
          type="button"
          className="agenda-ics"
          onClick={() => {
            if (descargarIcal(torneo)) {
              marcarAgendado("ics");
              setMensaje("Descargamos el recordatorio para tu calendario.");
            }
          }}
        >
          Descargar .ics
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {mensaje}
      </p>
    </div>
  );
}
