"use client";

import { useEffect, useState } from "react";

/**
 * Cuenta hacia atrás hasta el próximo torneo.
 *
 * Es el elemento que más "vive" de la página, y por eso está arriba: un número que se mueve
 * comunica que la comunidad está activa mucho mejor que cualquier texto o ilustración.
 *
 * Es un componente de cliente porque necesita el reloj del visitante. El resto del sitio se
 * renderiza en el servidor, así que esto es lo único que baja como JavaScript.
 */

function partes(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    dias: Math.floor(total / 86400),
    horas: Math.floor((total % 86400) / 3600),
    min: Math.floor((total % 3600) / 60),
    seg: total % 60,
  };
}

export function Contador({ hasta }: { hasta: string }) {
  const objetivo = new Date(hasta).getTime();
  // Arranca en null y se completa después de montar: si calculáramos el tiempo en el
  // servidor, el HTML llegaría con una hora vieja y React se quejaría de la diferencia.
  const [restante, setRestante] = useState<number | null>(null);

  useEffect(() => {
    const tic = () => setRestante(objetivo - Date.now());
    tic();
    const id = setInterval(tic, 1000);
    return () => clearInterval(id);
  }, [objetivo]);

  if (restante !== null && restante <= 0) {
    return (
      <p className="text-lg font-semibold text-acento-2">
        ¡Está arrancando! Entrá al Discord para sumarte.
      </p>
    );
  }

  const p = restante === null ? null : partes(restante);
  const casillas: Array<[string, number | null]> = [
    ["días", p?.dias ?? null],
    ["horas", p?.horas ?? null],
    ["min", p?.min ?? null],
    ["seg", p?.seg ?? null],
  ];

  return (
    <div className="flex gap-2.5 sm:gap-3" role="timer" aria-label="Tiempo hasta el próximo torneo">
      {casillas.map(([etiqueta, valor]) => (
        <div
          key={etiqueta}
          className="tarjeta flex min-w-[68px] flex-col items-center px-3 py-2.5 sm:min-w-[82px] sm:py-3"
        >
          <span className="texto-degradado text-2xl font-extrabold tabular-nums sm:text-4xl">
            {valor === null ? "--" : String(valor).padStart(2, "0")}
          </span>
          <span className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-tenue sm:text-xs">
            {etiqueta}
          </span>
        </div>
      ))}
    </div>
  );
}
