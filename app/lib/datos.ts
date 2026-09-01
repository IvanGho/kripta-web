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

/** La comunidad es argentina y los torneos son a la hora de acá, sea donde corra el servidor. */
const ZONA = "America/Argentina/Buenos_Aires";

/**
 * Fecha de un torneo de ejemplo, a las 22:00 **de Argentina**.
 *
 * Tenía el mismo bug de zona que `fechaLinda` ya había corregido más abajo, y era peor porque
 * pasaba desapercibido: `setHours(22, 0, 0, 0)` fija las 22 en la hora **local del proceso**. En
 * Vercel el proceso corre en UTC, así que el dato quedaba a las 22:00 UTC y `fechaLinda`, que sí
 * formatea bien en hora argentina, lo imprimía como **19:00 hs**.
 *
 * O sea: en tu máquina se veía bien y en producción mentía tres horas. Y el dato es justamente el
 * que le dice a la gente a qué hora jugar.
 *
 * Cómo se resuelve sin sumar una librería de fechas: se pregunta qué día es hoy **en Argentina**,
 * se suman los días sobre esa fecha en UTC (para no arrastrar la zona del servidor) y se arma la
 * hora con el offset argentino escrito de forma explícita. Argentina no tiene horario de verano
 * desde 2009, así que `-03:00` vale todo el año.
 */
function proximaFechaDeTorneo(diasAdelante: number): string {
  const hoyEnArgentina = new Intl.DateTimeFormat("en-CA", {
    timeZone: ZONA,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  const [anio, mes, dia] = hoyEnArgentina.split("-").map(Number);
  const objetivo = new Date(Date.UTC(anio, mes - 1, dia + diasAdelante));

  const aa = objetivo.getUTCFullYear();
  const mm = String(objetivo.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(objetivo.getUTCDate()).padStart(2, "0");

  return new Date(`${aa}-${mm}-${dd}T22:00:00-03:00`).toISOString();
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

/** Cuánto se espera al panel antes de mostrar los datos de ejemplo. */
const TIMEOUT_MS = 5000;

function esObjeto(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function esTorneo(v: unknown): v is Torneo {
  if (!esObjeto(v)) return false;
  return (
    typeof v.id === "number" &&
    typeof v.nombre === "string" &&
    typeof v.juego === "string" &&
    typeof v.formato === "string" &&
    typeof v.empiezaEn === "string" &&
    typeof v.inscripcionCentavos === "number" &&
    typeof v.premioCentavos === "number" &&
    typeof v.cupo === "number" &&
    typeof v.inscriptos === "number" &&
    typeof v.estado === "string"
  );
}

function esFilaRanking(v: unknown): v is FilaRanking {
  if (!esObjeto(v)) return false;
  return (
    typeof v.puesto === "number" &&
    typeof v.nombre === "string" &&
    typeof v.puntos === "number" &&
    typeof v.torneos === "number" &&
    typeof v.titulos === "number"
  );
}

function esCampeon(v: unknown): v is Campeon {
  if (!esObjeto(v)) return false;
  return (
    typeof v.nombre === "string" &&
    typeof v.torneo === "string" &&
    typeof v.juego === "string" &&
    typeof v.fecha === "string"
  );
}

/**
 * Valida la respuesta del panel antes de dársela a la página.
 *
 * Por qué hace falta: los tres guardas que había (`!url`, `!res.ok`, `catch`) cubren que el panel
 * no esté configurado, que conteste un error y que se caiga la red. **No** cubren el caso de un
 * panel que responde `200` con un JSON de forma distinta. Y ese caso es realista: son dos repos
 * sin nada que sincronice el contrato, así que alcanza con renombrar un campo en el panel.
 *
 * Con la respuesta mal formada, `datos.ranking` quedaba `undefined` y la home explotaba con un
 * `TypeError` en `ranking.map(...)`. O sea que el archivo prometía que "un error del panel no
 * puede tirar abajo la página de captación" y un panel *funcionando pero cambiado* sí la tiraba.
 *
 * Devuelve `null` cuando no se puede confiar en la respuesta, y el llamador cae a los datos de
 * ejemplo, que es la misma decisión que ya se había tomado para los otros fallos.
 */
function validar(crudo: unknown): DatosPublicos | null {
  if (!esObjeto(crudo)) return null;

  if (!Array.isArray(crudo.torneos) || !crudo.torneos.every(esTorneo)) return null;
  if (!Array.isArray(crudo.ranking) || !crudo.ranking.every(esFilaRanking)) return null;
  if (!Array.isArray(crudo.campeones) || !crudo.campeones.every(esCampeon)) return null;
  if (typeof crudo.jugadoresActivos !== "number") return null;

  // `temporada` y `proximoTorneo` sí pueden venir en null: es un estado normal, no un error.
  const temporada = crudo.temporada;
  if (temporada !== null) {
    if (!esObjeto(temporada)) return null;
    if (
      typeof temporada.nombre !== "string" ||
      typeof temporada.desdeFecha !== "string" ||
      typeof temporada.hastaFecha !== "string" ||
      typeof temporada.premioFinalCentavos !== "number"
    ) {
      return null;
    }
  }
  if (crudo.proximoTorneo !== null && !esTorneo(crudo.proximoTorneo)) return null;

  return {
    temporada: temporada as DatosPublicos["temporada"],
    proximoTorneo: crudo.proximoTorneo as Torneo | null,
    torneos: crudo.torneos,
    ranking: crudo.ranking,
    campeones: crudo.campeones,
    jugadoresActivos: crudo.jugadoresActivos,
    // Se respeta el `esEjemplo` que manda el panel. Antes se forzaba a `false`, y entonces un
    // panel en modo demo (datos sembrados de prueba) se mostraba como si fuera la temporada
    // real, sin ningún aviso. Que el panel diga la verdad y el sitio la muestre.
    esEjemplo: Boolean(crudo.esEjemplo),
  };
}

/**
 * Trae los datos del panel. Si no hay panel configurado, si no responde, si tarda demasiado o si
 * contesta algo que no tiene la forma esperada, devuelve los de ejemplo: es preferible un sitio
 * que se ve completo a un sitio roto. Nada del panel puede tirar abajo la página de captación.
 */
export async function obtenerDatos(): Promise<DatosPublicos> {
  const url = process.env.PANEL_API_URL;
  if (!url) return EJEMPLO;

  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/publico/datos`, {
      // Se revalida cada 60 segundos: el ranking se siente "en vivo" sin castigar la
      // velocidad de carga ni golpear la base en cada visita.
      next: { revalidate: 60 },
      /*
       * Sin timeout, un panel colgado (no caído: colgado, que no cierra la conexión) bloquea la
       * regeneración de la home hasta el límite de la plataforma. El free tier de una base que
       * quedó dormida es exactamente ese escenario.
       *
       * Nota verificada en los docs de esta versión de Next
       * (node_modules/next/dist/docs/01-app/03-api-reference/04-functions/fetch.md): pasar un
       * `signal` desactiva la **memoización** del fetch, que es la deduplicación dentro de un
       * mismo render. No desactiva el cacheo persistente, que es cosa de `next.revalidate`. Acá
       * hay un solo lugar que llama al panel, así que perder la memoización no cambia nada.
       */
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return EJEMPLO;

    const validados = validar(await res.json());
    if (!validados) {
      console.warn(
        "[kripta-web] El panel respondió 200 pero con una forma que no reconozco, así que se " +
          "muestran los datos de ejemplo. Suele significar que cambió el shape de DatosPublicos " +
          "en el panel y este repo quedó atrás.",
      );
      return EJEMPLO;
    }
    return validados;
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

/**
 * Fecha en formato "martes 18/8 · 22:00 hs", siempre en hora argentina.
 *
 * Ojo con la zona: esto se renderiza en el servidor, y el servidor de Vercel corre en UTC.
 * La versión anterior usaba `getHours()`/`getDay()`, que devuelven la hora local **del
 * servidor**: un torneo a las 22:00 de Argentina se mostraba a las 01:00 del día siguiente.
 * Tres horas de diferencia y un día corrido, en el dato que le dice a la gente cuándo jugar.
 *
 * Por eso la zona va declarada de forma explícita en lugar de confiar en el reloj del proceso.
 */
export function fechaLinda(iso: string): string {
  const f = new Date(iso);
  if (Number.isNaN(f.getTime())) return "";

  const partes = new Intl.DateTimeFormat("es-AR", {
    timeZone: ZONA,
    weekday: "long",
    day: "numeric",
    month: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(f);

  const parte = (tipo: Intl.DateTimeFormatPartTypes) =>
    partes.find((p) => p.type === tipo)?.value ?? "";

  return `${parte("weekday")} ${parte("day")}/${parte("month")} · ${parte("hour")}:${parte("minute")} hs`;
}
