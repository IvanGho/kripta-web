import type { Metadata } from "next";
import Link from "next/link";
import { Cabecera } from "./componentes/cabecera";
import { Pie } from "./componentes/pie";
import { Contador } from "./componentes/contador";
import { Lobo } from "./componentes/marca";
import { BotonDiscord } from "./componentes/boton-discord";
import { DatosEstructurados } from "./componentes/datos-estructurados";
import { obtenerDatos, formatoARS, fechaLinda } from "./lib/datos";
import { eventosDeTorneos, listaDeCampeones, organizacion } from "./lib/datos-estructurados";

/**
 * La home era la única página sin `metadata` propia: heredaba todo del layout y por lo tanto
 * **no tenía canonical**, mientras que las dos herramientas sí. Es justo la página con más
 * riesgo de duplicarse por variantes de URL (`/?utm_source=...`, con y sin `www`, el dominio de
 * preview de Vercel), o sea la que más lo necesitaba.
 */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/** Se regenera cada minuto: el ranking se ve fresco sin recalcular en cada visita. */
export const revalidate = 60;

export default async function Inicio() {
  const datos = await obtenerDatos();
  const { proximoTorneo, ranking, torneos, campeones, temporada, esEjemplo } = datos;

  // Los eventos y los campeones sólo se declaran con datos reales: ver el comentario de
  // lib/datos-estructurados.ts sobre por qué anunciarle torneos inventados a Google es un riesgo.
  const eventos = eventosDeTorneos(torneos, esEjemplo);
  const campeonesEstructurados = listaDeCampeones(campeones, esEjemplo);

  return (
    <>
      <DatosEstructurados datos={organizacion()} />
      {eventos.length > 0 && <DatosEstructurados datos={eventos} />}
      {campeonesEstructurados && <DatosEstructurados datos={campeonesEstructurados} />}

      <Cabecera />

      {/*
        La home no tenía `<main>`: las siete secciones colgaban directo del body. Las otras dos
        páginas sí lo tenían, así que además era inconsistente. Sin región principal no hay a
        dónde saltar, y un lector de pantalla no puede ofrecer "ir al contenido".
      */}
      <main id="contenido">
      {/* ============================ HERO ============================ */}
      <section className="grilla relative overflow-hidden">
        {/* Resplandores: son lo que le saca lo plano al fondo. */}
        <div className="resplandor left-1/2 top-[-160px] h-[380px] w-[680px] -translate-x-1/2 bg-acento/20" />
        <div className="resplandor right-[-140px] top-[180px] h-[300px] w-[300px] bg-acento-2/10" />

        <div className="relative z-10 mx-auto max-w-6xl px-5 pb-20 pt-16 sm:pt-24">
          <div className="flex flex-col items-center text-center">
            {/*
              El "en vivo" sólo se dice cuando de verdad lo es. Con datos de ejemplo la pastilla
              cambia y el puntito deja de latir: no se anuncia como temporada real algo que no lo
              es. Es el aviso más barato posible, sin romper el diseño.
            */}
            <span className="pastilla">
              {!esEjemplo && <span className="latido h-1.5 w-1.5 rounded-full bg-acento" />}
              {temporada ? temporada.nombre : "Comunidad activa"}
              {esEjemplo ? " · vista previa" : " · en vivo"}
            </span>

            <h1 className="mt-6 max-w-3xl text-4xl font-extrabold uppercase leading-[1.05] tracking-tight sm:text-6xl">
              Torneos de <span className="neon">Valorant</span> y{" "}
              <span className="neon">Truco</span> todas las semanas
            </h1>

            <p className="mt-5 max-w-xl text-base text-tenue sm:text-lg">
              Comunidad argentina, de 20 a 05. Premios fijos anunciados antes de abrir la
              inscripción, ranking de temporada y mesas gratis todos los días.
            </p>

            {proximoTorneo && (
              <div className="mt-10 flex w-full flex-col items-center">
                <p className="mb-3 text-xs uppercase tracking-[0.16em] text-tenue">
                  Próximo torneo · {proximoTorneo.nombre}
                </p>
                <Contador hasta={proximoTorneo.empiezaEn} />
              </div>
            )}

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <BotonDiscord className="text-base">Entrar al Discord</BotonDiscord>
              <a href="#torneos" className="boton-sec text-base">
                Ver los torneos
              </a>
            </div>

            {/* Números: prueba social. Es lo que decide al que entra por primera vez. */}
            <dl className="mt-14 grid w-full max-w-2xl grid-cols-3 gap-3">
              {[
                [`${datos.jugadoresActivos}+`, "miembros"],
                ["2", "torneos por semana"],
                [
                  temporada ? formatoARS(temporada.premioFinalCentavos) : "—",
                  "premio de temporada",
                ],
              ].map(([valor, etiqueta]) => (
                <div key={etiqueta} className="tarjeta px-3 py-4">
                  <dt className="texto-degradado text-xl font-extrabold sm:text-3xl">{valor}</dt>
                  <dd className="mt-1 text-[11px] uppercase tracking-[0.1em] text-tenue sm:text-xs">
                    {etiqueta}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ============================ RANKING ============================ */}
      <section id="ranking" className="relative mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
        <Titulo
          alto="Ranking"
          resaltado={esEjemplo ? "de muestra" : "en vivo"}
          bajada={
            esEjemplo
              ? "Estos nombres son de ejemplo: la temporada real todavía no está conectada. Sirve para ver cómo se va a ver el ranking cuando arranque."
              : "Se actualiza con cada torneo. La temporada se reinicia cada seis semanas, así que siempre podés arrancar de cero."
          }
        />

        {ranking.length === 0 ? (
          <Vacio texto="Todavía no se jugó ningún torneo de esta temporada. El primero que se anote arranca primero." />
        ) : (
        <div className="tarjeta overflow-hidden p-0">
          <table className="w-full text-left text-sm">
            {/*
              `caption` le dice a un lector de pantalla qué tabla es antes de meterse a leer
              celdas, y `scope="col"` es lo que permite que al llegar a un dato anuncie el
              encabezado de su columna ("Puntos: 84") en vez de un número suelto. Sin scope, una
              tabla de cinco columnas leída en voz alta es una lista de números sin referencia.
              Va oculto visualmente porque el título de la sección ya está arriba.
            */}
            <caption className="sr-only">
              {esEjemplo
                ? "Ranking de ejemplo de la temporada, ordenado por puntos"
                : "Ranking de la temporada en curso, ordenado por puntos"}
            </caption>
            <thead>
              <tr className="border-b border-borde text-[11px] uppercase tracking-[0.1em] text-tenue">
                {/* El "#" visible es un símbolo; lo que se anuncia es la palabra. */}
                <th scope="col" className="px-4 py-3 sm:px-5">
                  <span aria-hidden="true">#</span>
                  <span className="sr-only">Puesto</span>
                </th>
                <th scope="col" className="px-4 py-3 sm:px-5">Jugador</th>
                <th scope="col" className="px-4 py-3 text-right sm:px-5">Puntos</th>
                <th scope="col" className="hidden px-5 py-3 text-right sm:table-cell">Torneos</th>
                <th scope="col" className="hidden px-5 py-3 text-right sm:table-cell">Títulos</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((f) => (
                <tr key={f.puesto} className="border-b border-borde/50 last:border-0">
                  <td className="px-4 py-3 sm:px-5">
                    <Medalla puesto={f.puesto} />
                  </td>
                  <td className="px-4 py-3 font-semibold sm:px-5">{f.nombre}</td>
                  <td className="px-4 py-3 text-right font-bold text-acento-2 sm:px-5">{f.puntos}</td>
                  <td className="hidden px-5 py-3 text-right text-tenue sm:table-cell">{f.torneos}</td>
                  <td className="hidden px-5 py-3 text-right text-tenue sm:table-cell">{f.titulos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </section>

      {/* ============================ CÓMO FUNCIONA ============================ */}
      <section className="relative overflow-hidden py-16">
        <div className="resplandor left-[-120px] top-1/2 h-[280px] w-[280px] bg-acento/10" />
        <div className="relative z-10 mx-auto max-w-6xl px-5">
          <Titulo alto="Cómo" resaltado="funciona" bajada="Tres pasos. No hace falta ser bueno para arrancar: se puntúa también por participar." />

          <ol className="grid gap-4 sm:grid-cols-3">
            {[
              { n: "01", t: "Entrás al Discord", d: "Te presentás en el canal de bienvenida y elegís tus juegos. Gratis y sin compromiso." },
              { n: "02", t: "Te anotás a un torneo", d: "Hay pagos con premio fijo y mesas de Pista Libre gratuitas. Reaccionás al anuncio y listo." },
              { n: "03", t: "Sumás puntos", d: "Ganes o pierdas, participar suma. El ranking define el podio y el premio de temporada." },
            ].map((p) => (
              <li key={p.n} className="tarjeta tarjeta-viva p-6">
                {/*
                  Era `text-acento/30`, que sobre el panel da ~1,8:1 de contraste. A este tamaño
                  cuenta como texto grande y necesita 3:1, así que no llegaba ni a eso. Y no es
                  decoración: el número comunica el orden de los pasos, que es información.
                  `text-acento` a secas da contraste de sobra y se sigue leyendo como acento.
                */}
                <span className="text-3xl font-extrabold text-acento">{p.n}</span>
                <h3 className="mt-2 text-lg font-bold">{p.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-tenue">{p.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============================ TORNEOS ============================ */}
      <section id="torneos" className="relative mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
        <Titulo alto="Torneos de" resaltado="la semana" bajada="El premio se anuncia antes de abrir la inscripción y es el mismo con 4 o con 16 anotados." />

        {torneos.length === 0 && (
          <Vacio texto="No hay torneos abiertos en este momento. Entrá al Discord y te avisamos en cuanto se anuncie el próximo." />
        )}

        <div className="grid gap-4 md:grid-cols-3">
          {torneos.map((t) => {
            const gratis = t.inscripcionCentavos === 0 && t.premioCentavos === 0;
            const lleno = t.inscriptos >= t.cupo;
            return (
              <article key={t.id} className="tarjeta tarjeta-viva flex flex-col p-5">
                <div className="flex items-center gap-2">
                  <span className="pastilla">{t.juego} {t.formato}</span>
                  {gratis && (
                    <span className="pastilla border-acento/40 text-acento-2">Pista Libre</span>
                  )}
                </div>

                <h3 className="mt-3 text-lg font-bold leading-snug">{t.nombre}</h3>
                <p className="mt-1 text-sm text-tenue">{fechaLinda(t.empiezaEn)}</p>

                <dl className="mt-4 space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-tenue">Inscripción</dt>
                    <dd className="font-semibold">
                      {t.inscripcionCentavos === 0 ? "Gratis" : formatoARS(t.inscripcionCentavos)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-tenue">Premio</dt>
                    <dd className="font-semibold text-acento-2">
                      {t.premioCentavos === 0 ? "Rol + puntos" : formatoARS(t.premioCentavos)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-tenue">Lugares</dt>
                    <dd className="font-semibold">{t.inscriptos}/{t.cupo}</dd>
                  </div>
                </dl>

                {/* Barra de cupo: comunica urgencia sin decir nada. */}
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-panel-2">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-acento to-acento-2"
                    style={{ width: `${Math.min(100, (t.inscriptos / t.cupo) * 100)}%` }}
                  />
                </div>

                <BotonDiscord
                  variante={lleno ? "secundario" : "primario"}
                  className="mt-5 w-full text-sm"
                >
                  {lleno ? "Anotarme a la lista de espera" : "Anotarme"}
                </BotonDiscord>

                {!gratis && (
                  <p className="mt-2 text-center text-[11px] text-tenue">Sólo mayores de 18</p>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* ============================ CAMPEONES ============================ */}
      <section className="relative mx-auto max-w-6xl px-5 py-16">
        <Titulo
          alto="Salón de"
          resaltado="campeones"
          bajada={
            esEjemplo
              ? "Ejemplo de cómo se va a ver el salón. Los primeros campeones reales salen del próximo torneo."
              : "Los que ya se llevaron un torneo de la Kripta."
          }
        />

        {campeones.length === 0 && (
          <Vacio texto="El salón está vacío y alguien lo tiene que estrenar. Puede ser en el próximo torneo." />
        )}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {campeones.map((c, i) => (
            <div key={`${c.nombre}-${i}`} className="tarjeta tarjeta-viva flex items-center gap-3 p-4">
              {/* Decorativo: lo que importa de la tarjeta es el nombre del campeón. */}
              <Lobo tamano={34} />
              <div className="min-w-0">
                <p className="truncate font-bold">{c.nombre}</p>
                <p className="truncate text-xs text-tenue">{c.torneo}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================ HERRAMIENTAS ============================ */}
      <section className="relative mx-auto max-w-6xl px-5 py-16">
        <Titulo alto="Herramientas" resaltado="gratis" bajada="Sin registro y sin vueltas. Las hicimos para la comunidad y las dejamos abiertas." />

        <div className="grid gap-4 sm:grid-cols-2">
          <Herramienta
            href="/anotador"
            titulo="Anotador de Truco"
            texto="Malas y buenas hasta 30, con fósforos como en la mesa. Andá sumando desde el celular."
          />
          <Herramienta
            href="/sensibilidad"
            titulo="Convertidor de sensibilidad"
            texto="Pasá tu sensibilidad entre Valorant, CS2 y Apex sin perder la mira."
          />
        </div>
      </section>

      {/* ============================ REFERIDOS + CTA ============================ */}
      <section className="relative overflow-hidden py-16">
        <div className="resplandor left-1/2 top-1/2 h-[320px] w-[620px] -translate-x-1/2 -translate-y-1/2 bg-acento/15" />
        <div className="relative z-10 mx-auto max-w-3xl px-5 text-center">
          <div className="tarjeta p-8 sm:p-12">
            <Lobo tamano={54} className="mx-auto" />
            <h2 className="mt-5 text-2xl font-extrabold uppercase leading-tight sm:text-4xl">
              Traé un amigo y <span className="neon">los dos suman</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-tenue">
              Si el que invitás se queda y juega su primer torneo, los dos ganan puntos de
              temporada. Se pide el nombre de quien te invitó al entrar al Discord.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <BotonDiscord className="text-base">Entrar al Discord</BotonDiscord>
              <a href="#ranking" className="boton-sec text-base">
                Ver el ranking
              </a>
            </div>
            <p className="mt-5 text-xs text-tenue">
              Gratis. Las mesas de Pista Libre son abiertas a todos.
            </p>
          </div>
        </div>
      </section>

      </main>

      <Pie />
    </>
  );
}

/* ---------------------------------- piezas ---------------------------------- */

function Titulo({ alto, resaltado, bajada }: { alto: string; resaltado: string; bajada: string }) {
  return (
    <div className="mb-8 max-w-2xl">
      <h2 className="text-2xl font-extrabold uppercase leading-tight sm:text-4xl">
        {alto} <span className="neon">{resaltado}</span>
      </h2>
      <p className="mt-3 text-sm text-tenue sm:text-base">{bajada}</p>
    </div>
  );
}

/**
 * Estado vacío. Con datos reales las listas pueden venir sin nada (temporada recién abierta,
 * ningún torneo anunciado todavía), y una sección con el título puesto y la grilla vacía abajo
 * se lee como que la página está rota. Siempre hay que decir algo, y si se puede, invitar.
 */
function Vacio({ texto }: { texto: string }) {
  return (
    <div className="tarjeta p-6 text-center">
      <p className="text-sm text-tenue">{texto}</p>
    </div>
  );
}

function Medalla({ puesto }: { puesto: number }) {
  if (puesto <= 3) {
    const colores = ["text-acento-2", "text-texto", "text-alerta"];
    return (
      <span className={`text-base font-extrabold ${colores[puesto - 1]}`}>
        {puesto}°
      </span>
    );
  }
  return <span className="text-tenue">{puesto}</span>;
}

function Herramienta({ href, titulo, texto }: { href: string; titulo: string; texto: string }) {
  return (
    <Link href={href} className="tarjeta tarjeta-viva block p-6">
      <h3 className="text-lg font-bold">{titulo}</h3>
      <p className="mt-2 text-sm leading-relaxed text-tenue">{texto}</p>
      <span className="mt-4 inline-block text-sm font-semibold text-acento-2">Abrir →</span>
    </Link>
  );
}
