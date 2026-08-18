/**
 * Datos que muestra el sitio público.
 *
 * Decisión de arquitectura: este sitio **no** calcula reglas de negocio ni lee la base
 * directamente. Le pide al panel un JSON ya resuelto.
 *
 * Por qué. El ranking, los puestos y las llaves son lógica de negocio y viven en
 * `monsterland-panel/src/dominio/`. Si el sitio los recalculara, habría dos
 * implementaciones de la misma regla y tarde o temprano dirían cosas distintas: el panel
 * mostraría un campeón y la web otro. Una sola fuente de verdad.
 *
 * Mientras el panel no exponga ese endpoint, el sitio usa los datos de ejemplo de abajo.
 * Así se puede desplegar y verlo terminado desde el primer día, que es exactamente el
 * criterio que ya usamos en el panel con su modo demo.
 *
 * Para conectarlo de verdad: definir PANEL_API_URL y agregar en el panel una ruta pública
 * que devuelva este mismo shape. Es el único cambio que hace falta acá.
 */

export type Torneo = {
  id: number;
  nombre: string;
  juego: string;
  formato: string;
  empiezaEn: string;
  inscripcionCentavos: number;
  premioCentavos: number;
  premioDescripcion: string | null;
  cupo: number;
  inscriptos: number;
  estado: string;
};

export type FilaRanking = {
  puesto: number;
  nombre: string;
  puntos: number;
  torneos: number;
  titulos: number;
};

export type Campeon = {
  nombre: string;
  torneo: string;
  juego: string;
  fecha: string;
};

export type DatosPublicos = {
  temporada: { nombre: string; desdeFecha: string; hastaFecha: string; premioFinalCentavos: number } | null;
  proximoTorneo: Torneo | null;
  torneos: Torneo[];
  ranking: FilaRanking[];
  campeones: Campeon[];
  jugadoresActivos: number;
  /** true cuando lo que se está mostrando son datos de ejemplo y no la temporada real. */
  esEjemplo: boolean;
};

/** Fecha del próximo martes/jueves a las 22, para que el contador siempre tenga sentido. */
function proximaFechaDeTorneo(diasAdelante: number): string {
  const f = new Date();
  f.setDate(f.getDate() + diasAdelante);
  f.setHours(22, 0, 0, 0);
  return f.toISOString();
}

const EJEMPLO: DatosPublicos = {
  temporada: {
    nombre: "Temporada I",
    desdeFecha: new Date().toISOString().slice(0, 10),
    hastaFecha: new Date(Date.now() + 42 * 864e5).toISOString().slice(0, 10),
    premioFinalCentavos: 3_000_000,
  },
  proximoTorneo: {
    id: 1,
    nombre: "Valorant 1v1 — Semana 1",
    juego: "Valorant",
    formato: "1v1",
    empiezaEn: proximaFechaDeTorneo(2),
    inscripcionCentavos: 250_000,
    premioCentavos: 600_000,
    premioDescripcion: "Gift card Steam",
    cupo: 8,
    inscriptos: 5,
    estado: "inscripcion",
  },
  torneos: [
    {
      id: 1,
      nombre: "Valorant 1v1 — Semana 1",
      juego: "Valorant",
      formato: "1v1",
      empiezaEn: proximaFechaDeTorneo(2),
      inscripcionCentavos: 250_000,
      premioCentavos: 600_000,
      premioDescripcion: "Gift card Steam",
      cupo: 8,
      inscriptos: 5,
      estado: "inscripcion",
    },
    {
      id: 2,
      nombre: "Truco 2v2 — Mesa de la Kripta",
      juego: "Truco",
      formato: "2v2",
      empiezaEn: proximaFechaDeTorneo(4),
      inscripcionCentavos: 150_000,
      premioCentavos: 400_000,
      premioDescripcion: "Gift card",
      cupo: 16,
      inscriptos: 11,
      estado: "inscripcion",
    },
    {
      id: 3,
      nombre: "Pista Libre — Truco",
      juego: "Truco",
      formato: "1v1",
      empiezaEn: proximaFechaDeTorneo(1),
      inscripcionCentavos: 0,
      premioCentavos: 0,
      premioDescripcion: null,
      cupo: 32,
      inscriptos: 19,
      estado: "inscripcion",
    },
  ],
  ranking: [
    { puesto: 1, nombre: "Nahuel", puntos: 84, torneos: 4, titulos: 2 },
    { puesto: 2, nombre: "Brenda", puntos: 71, torneos: 4, titulos: 1 },
    { puesto: 3, nombre: "Tomi", puntos: 63, torneos: 4, titulos: 1 },
    { puesto: 4, nombre: "Sofi", puntos: 48, torneos: 3, titulos: 0 },
    { puesto: 5, nombre: "Lucho", puntos: 41, torneos: 3, titulos: 0 },
    { puesto: 6, nombre: "Cami", puntos: 35, torneos: 3, titulos: 0 },
    { puesto: 7, nombre: "Fede", puntos: 28, torneos: 2, titulos: 0 },
    { puesto: 8, nombre: "Juli", puntos: 21, torneos: 2, titulos: 0 },
  ],
  campeones: [
    { nombre: "Nahuel", torneo: "Valorant 1v1 — Apertura", juego: "Valorant", fecha: "2026-08-05" },
    { nombre: "Brenda", torneo: "Truco 2v2 — Semana 2", juego: "Truco", fecha: "2026-08-08" },
    { nombre: "Tomi", torneo: "Valorant 1v1 — Semana 2", juego: "Valorant", fecha: "2026-08-12" },
    { nombre: "Nahuel", torneo: "Truco — Copa Panteón", juego: "Truco", fecha: "2026-08-15" },
  ],
  jugadoresActivos: 140,
  esEjemplo: true,
};

/**
 * Trae los datos del panel. Si no hay panel configurado, o si no responde, devuelve los de
 * ejemplo: es preferible un sitio que se ve completo a un sitio roto. Un error de red del
 * panel no puede tirar abajo la página de captación.
 */
export async function obtenerDatos(): Promise<DatosPublicos> {
  const url = process.env.PANEL_API_URL;
  if (!url) return EJEMPLO;

  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/publico/datos`, {
      // Se revalida cada 60 segundos: el ranking se siente "en vivo" sin castigar la
      // velocidad de carga ni golpear la base en cada visita.
      next: { revalidate: 60 },
    });
    if (!res.ok) return EJEMPLO;
    const datos = (await res.json()) as DatosPublicos;
    return { ...datos, esEjemplo: false };
  } catch {
    return EJEMPLO;
  }
}

export function formatoARS(centavos: number): string {
  const entero = Math.floor(Math.abs(centavos) / 100);
  const dec = String(Math.abs(centavos) % 100).padStart(2, "0");
  const conPuntos = entero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${centavos < 0 ? "-" : ""}$${conPuntos}${dec === "00" ? "" : `,${dec}`}`;
}

export function fechaLinda(iso: string): string {
  const f = new Date(iso);
  const dias = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  const hora = String(f.getHours()).padStart(2, "0");
  const min = String(f.getMinutes()).padStart(2, "0");
  return `${dias[f.getDay()]} ${f.getDate()}/${f.getMonth() + 1} · ${hora}:${min} hs`;
}
