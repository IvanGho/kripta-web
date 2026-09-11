import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Cabecera } from "./componentes/cabecera";
import { Pie } from "./componentes/pie";
import { Contador } from "./componentes/contador";
import { Lobo } from "./componentes/marca";
import { BotonDiscord } from "./componentes/boton-discord";
import { Brasas } from "./componentes/brasas";
import { Insignia } from "./componentes/llave";
import { AccionesAgendaTorneo } from "./componentes/acciones-agenda-torneo";
import { DatosEstructurados } from "./componentes/datos-estructurados";
import { obtenerDatos, formatoARS, fechaLinda } from "./lib/datos";
import {
  eventosDeTorneos,
  listaDeCampeones,
  organizacion,
} from "./lib/datos-estructurados";
import { HAY_DISCORD } from "./lib/enlaces";

export const metadata: Metadata = { alternates: { canonical: "/" } };
export const revalidate = 60;

export default async function Inicio() {
  const datos = await obtenerDatos();
  const {
    proximoTorneo,
    ranking,
    torneos,
    campeones,
    temporada,
    miembros,
    torneosProximos7Dias,
    esEjemplo,
  } = datos;
  const hayActividadPublica =
    !esEjemplo && (miembros > 0 || torneosProximos7Dias > 0);
  const eventos = eventosDeTorneos(torneos, esEjemplo);
  const campeonesEstructurados = listaDeCampeones(campeones, esEjemplo);
  return (
    <>
      <DatosEstructurados datos={organizacion()} />
      {eventos.length > 0 && <DatosEstructurados datos={eventos} />}
      {campeonesEstructurados && (
        <DatosEstructurados datos={campeonesEstructurados} />
      )}
      <Cabecera />
      <main id="contenido">
        <section className="portal" aria-labelledby="titulo-portada">
          <div className="portal-escena" aria-hidden="true">
            <Image
              src="/imagenes/hero-kripta-v2.webp"
              alt=""
              fill
              sizes="100vw"
              preload
            />
          </div>
          <div className="portal-velo" />
          <Brasas />
          <div className="portal-interior mx-auto max-w-6xl px-5">
            <div className="portal-texto">
              <p className="sobre-titulo">
                <span className="cortes" aria-hidden="true">
                  {"///"}
                </span>{" "}
                Monsterland · comunidad argentina
              </p>
              <h1 id="titulo-portada" className="titular">
                La noche
                <br />
                es nuestra.
                <span className="portal-nombre">Entrá a la Kripta.</span>
              </h1>
              <p className="portal-bajada">
                Una partida más. Un equipo que te espera.
                <br className="hidden sm:block" /> Valorant, Truco y noches que
                se comparten en Discord.
              </p>
              <div className="portal-acciones">
                <BotonDiscord ubicacion="hero" className="text-base">
                  Entrar al Discord <span aria-hidden="true">↗</span>
                </BotonDiscord>
                <a href="#torneos" className="boton-sec text-base">
                  Explorar torneos <span aria-hidden="true">↓</span>
                </a>
              </div>
              <ul className="portal-senales" aria-label="Cómo funciona la comunidad">
                <li>
                  <span aria-hidden="true" /> Todo empieza en Discord
                </li>
                <li>
                  <span aria-hidden="true" /> Sin cuenta ni formulario en la web
                </li>
                <li>
                  <span aria-hidden="true" /> 18+ sólo para instancias con plata
                </li>
              </ul>
              <p className="portal-nota">
                {HAY_DISCORD
                  ? "Sumarte es gratis. Tu próxima comunidad empieza acá."
                  : "La invitación se publicará pronto. Mientras tanto, conocé la comunidad."}
              </p>
            </div>
            <div className="portal-pie">
              <span>
                <i aria-hidden="true" /> Argentina · de 20 a 05
              </span>
              <span>
                Valorant <b aria-hidden="true">/</b> Truco{" "}
                <b aria-hidden="true">/</b> Amigos
              </span>
              <a href="#comunidad">
                Conocé la comunidad <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
        </section>

        <section
          id="comunidad"
          className="seccion-kripta aparece mx-auto max-w-6xl px-5"
        >
          <div className="comunidad-grid">
            <figure className="escena-comunidad">
              <Image
                src="/imagenes/comunidad-kripta-v2.webp"
                alt="Ilustración del universo Kripta: cuatro gamers reunidos en una sala de basalto con luz verde."
                fill
                sizes="(max-width: 767px) 100vw, 50vw"
              />
              <figcaption>El universo de la Kripta</figcaption>
              <span className="escena-sello" aria-hidden="true">
                LA MANADA
                <br />
                <b>SE ENCUENTRA ACÁ.</b>
              </span>
            </figure>
            <div className="comunidad-texto">
              <p className="sobre-titulo">Más que una partida</p>
              <h2 className="titular-seccion">
                Vení por el juego.
                <br />
                <span className="text-acento-2">Quedate por la gente.</span>
              </h2>
              <p className="text-tenue leading-relaxed">
                Un lugar para competir, encontrar compañeros y cerrar el día
                jugando. No hace falta ser el mejor para formar parte.
              </p>
              <ol className="pasos-kripta">
                {[
                  [
                    "Entrás al Discord",
                    "Te presentás, elegís tus juegos y encontrás con quién jugar.",
                  ],
                  [
                    "Elegís tu próxima partida",
                    "Mesas de Pista Libre gratis y torneos con premio fijo anunciado de antemano.",
                  ],
                  [
                    "Dejás tu marca",
                    "Participar suma puntos. Cada temporada es otra oportunidad de subir en el ranking.",
                  ],
                ].map(([titulo, texto], i) => (
                  <li key={titulo}>
                    <span className="paso-numero">0{i + 1}</span>
                    <div>
                      <h3>{titulo}</h3>
                      <p>{texto}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section
          id="explorar"
          className="seccion-kripta aparece mx-auto max-w-6xl scroll-mt-28 px-5"
          aria-labelledby="titulo-explorar"
        >
          <div className="encabezado-seccion explorador-encabezado">
            <Titulo
              rotulo="Tu noche, a tu manera"
              titulo="No venís sólo a mirar."
              texto="Elegí qué querés hacer ahora. Cada camino te lleva a algo que podés usar de verdad."
            />
            {hayActividadPublica && (
              <div className="actividad-publica" aria-label="Actividad actual de la comunidad">
                <span>
                  <i aria-hidden="true" /> Comunidad en movimiento
                </span>
                <div>
                  {miembros > 0 && (
                    <strong>{miembros.toLocaleString("es-AR")} miembros</strong>
                  )}
                  {miembros > 0 && torneosProximos7Dias > 0 && <b aria-hidden="true">/</b>}
                  {torneosProximos7Dias > 0 && (
                    <strong>
                      {torneosProximos7Dias} {torneosProximos7Dias === 1 ? "torneo" : "torneos"} esta semana
                    </strong>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="explorador-grid">
            <Link href="#torneos" className="explorador-tarjeta tarjeta-viva">
              <span className="explorador-numero">01</span>
              <span className="sobre-titulo">Competí</span>
              <h3>Encontrá tu próxima llave.</h3>
              <p>Fechas, cupos y premios claros antes de anotarte.</p>
              <span className="explorador-accion">Ver agenda <b aria-hidden="true">&#8595;</b></span>
            </Link>
            <Link href="#ranking" className="explorador-tarjeta tarjeta-viva">
              <span className="explorador-numero">02</span>
              <span className="sobre-titulo">Progresá</span>
              <h3>Dejá tu nombre en temporada.</h3>
              <p>Seguí el ranking y conocé a quienes ya dejaron su marca.</p>
              <span className="explorador-accion">Mirar ranking <b aria-hidden="true">&#8595;</b></span>
            </Link>
            <Link href="/sensibilidad" className="explorador-tarjeta tarjeta-viva">
              <span className="explorador-numero">03</span>
              <span className="sobre-titulo">Prepará tu juego</span>
              <h3>Encontrá tu sensibilidad.</h3>
              <p>Convertí tus ajustes entre juegos y guardá la configuración.</p>
              <span className="explorador-accion">Abrir conversor <b aria-hidden="true">&#8594;</b></span>
            </Link>
            <Link href="/anotador" className="explorador-tarjeta tarjeta-viva">
              <span className="explorador-numero">04</span>
              <span className="sobre-titulo">Jugá en equipo</span>
              <h3>Llevá el tanteador de la mesa.</h3>
              <p>Una herramienta rápida para que la partida siga siendo la prioridad.</p>
              <span className="explorador-accion">Abrir anotador <b aria-hidden="true">&#8594;</b></span>
            </Link>
          </div>
        </section>

        <section
          id="torneos"
          className="seccion-kripta aparece mx-auto max-w-6xl scroll-mt-28 px-5"
        >
          <div className="encabezado-seccion">
            <Titulo
              rotulo="El núcleo competitivo"
              titulo="Tu lugar en la próxima llave."
              texto="El premio se define antes de abrir la inscripción. El desafío lo ponemos entre todos."
            />
            <span className="pastilla">
              {esEjemplo
                ? "Vista previa · datos de ejemplo"
                : (temporada?.nombre ?? "Torneos")}
            </span>
          </div>
          <div className="arena">
            <Image
              src="/imagenes/torneos-kripta-v2.webp"
              alt=""
              fill
              sizes="(max-width: 1152px) 100vw, 1152px"
            />
            <div className="arena-velo" />
            <div className="arena-info">
              <p className="sobre-titulo">
                {esEjemplo
                  ? "Así se verá el próximo encuentro"
                  : "Próximo encuentro"}
              </p>
              <h3>
                {proximoTorneo?.nombre ?? "La próxima partida empieza con vos."}
              </h3>
              <p>
                {proximoTorneo
                  ? fechaLinda(proximoTorneo.empiezaEn)
                  : "Los próximos torneos se anuncian en Discord."}
              </p>
              {proximoTorneo && (
                <div className="arena-contador">
                  <Contador hasta={proximoTorneo.empiezaEn} />
                </div>
              )}
            </div>
          </div>
          {esEjemplo && (
            <p className="aviso-muestra">
              Los torneos, cupos y premios de esta vista son de muestra.
              Consultá los anuncios vigentes en Discord.
            </p>
          )}
          {torneos.length === 0 ? (
            <Vacio texto="Todavía no hay torneos abiertos. Entrá al Discord para enterarte del próximo." />
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {torneos.map((t) => {
                const gratis =
                  t.inscripcionCentavos === 0 && t.premioCentavos === 0;
                const lleno = t.inscriptos >= t.cupo;
                return (
                  <article
                    key={t.id}
                    className="tarjeta tarjeta-torneo tarjeta-viva flex flex-col p-5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="sobre-titulo">
                        {t.juego} · {t.formato}
                      </span>
                      <span className="estado-torneo">
                        {gratis ? "Pista Libre" : "18+"}
                      </span>
                    </div>
                    <h3 className="mt-5 text-xl font-bold leading-snug">
                      {t.nombre}
                    </h3>
                    <p className="mt-2 text-sm text-tenue">
                      {fechaLinda(t.empiezaEn)}
                    </p>
                    <dl className="torneo-datos">
                      <div>
                        <dt>Inscripción</dt>
                        <dd>
                          {t.inscripcionCentavos === 0
                            ? "Gratis"
                            : formatoARS(t.inscripcionCentavos)}
                        </dd>
                      </div>
                      <div>
                        <dt>Premio fijo</dt>
                        <dd>
                          {t.premioCentavos === 0
                            ? "Rol + puntos"
                            : formatoARS(t.premioCentavos)}
                        </dd>
                      </div>
                    </dl>
                    <div className="mt-auto">
                      <p className="mb-2 flex justify-between text-xs text-tenue">
                        <span>
                          {lleno ? "Cupo completo" : "Lugares ocupados"}
                        </span>
                        <span className="dato">
                          {t.inscriptos}/{t.cupo}
                        </span>
                      </p>
                      <div className="cupo-barra">
                        <span
                          style={{
                            width: `${t.cupo > 0 ? Math.max(0, Math.min(100, (t.inscriptos / t.cupo) * 100)) : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                    <BotonDiscord
                      ubicacion="tarjeta-torneo"
                      variante="secundario"
                      className="mt-5 w-full text-sm"
                    >
                      {lleno ? "Anotarme a la lista de espera" : "Anotarme"}
                      <span aria-hidden="true">↗</span>
                    </BotonDiscord>
                    <AccionesAgendaTorneo
                      torneo={{
                        id: t.id,
                        nombre: t.nombre,
                        empiezaEn: t.empiezaEn,
                      }}
                    />
                    {!gratis && (
                      <p className="mt-2 text-center text-[11px] text-tenue">
                        Sólo mayores de 18
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          )}
          <section
            id="empezar"
            className="ruta-inscripcion tarjeta aparece scroll-mt-28"
            aria-labelledby="titulo-empezar"
          >
            <div className="ruta-intro">
              <p className="sobre-titulo">Tu primer torneo</p>
              <h3 id="titulo-empezar">Sabé qué hacer antes de que arranque.</h3>
              <p>
                La inscripción, los avisos y el check-in viven en Discord. La web te muestra
                dónde está la acción; el servidor es donde jugás.
              </p>
            </div>
            <ol className="ruta-pasos">
              <li>
                <span>01</span>
                <div>
                  <strong>Entrá al servidor</strong>
                  <p>Elegí tus juegos y presentate a la comunidad.</p>
                </div>
              </li>
              <li>
                <span>02</span>
                <div>
                  <strong>Registrate una vez</strong>
                  <p>Usá <code>/registrarme</code> cuando quieras competir.</p>
                </div>
              </li>
              <li>
                <span>03</span>
                <div>
                  <strong>Anotate y hacé check-in</strong>
                  <p>Seguí las indicaciones del torneo y entrá a jugar.</p>
                </div>
              </li>
            </ol>
            <BotonDiscord ubicacion="ruta-inscripcion" className="ruta-accion text-sm">
              Ir al Discord <span aria-hidden="true">↗</span>
            </BotonDiscord>
          </section>
        </section>

        <section
          id="ranking"
          className="seccion-kripta aparece mx-auto max-w-6xl scroll-mt-28 px-5"
        >
          <div className="ranking-grid">
            <div>
              <Titulo
                rotulo={
                  esEjemplo ? "Ranking de muestra" : "Ranking de temporada"
                }
                titulo="Hacete un nombre."
                texto={
                  esEjemplo
                    ? "Estos nombres son de ejemplo. Acá vas a ver a quienes dejan su marca en la temporada."
                    : "Cada torneo cuenta. Cada partida suma. La próxima temporada también puede llevar tu nombre."
                }
              />
              <div className="ranking-emblema" aria-hidden="true">
                <Insignia puesto={1} />
                <span>
                  EL PANTEÓN
                  <br />
                  <b>DE LA KRIPTA</b>
                </span>
              </div>
              {!esEjemplo && temporada && (
                <p className="text-sm text-tenue">
                  Premio de temporada{" "}
                  <strong className="dato text-acento-2">
                    {formatoARS(temporada.premioFinalCentavos)}
                  </strong>
                </p>
              )}
            </div>
            {ranking.length === 0 ? (
              <Vacio texto="El ranking está por estrenarse. Participá del primer torneo de la temporada." />
            ) : (
              <div className="tarjeta overflow-hidden p-0">
                <table className="tabla-ranking w-full text-left text-sm">
                  <caption className="sr-only">
                    {esEjemplo
                      ? "Ranking de ejemplo de la temporada, ordenado por puntos"
                      : "Ranking de la temporada en curso, ordenado por puntos"}
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">
                        <span aria-hidden="true">#</span>
                        <span className="sr-only">Puesto</span>
                      </th>
                      <th scope="col">Jugador</th>
                      <th scope="col" className="text-right">
                        Puntos
                      </th>
                      <th
                        scope="col"
                        className="hidden text-right sm:table-cell"
                      >
                        Torneos
                      </th>
                      <th
                        scope="col"
                        className="hidden text-right sm:table-cell"
                      >
                        Títulos
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ranking.map((f) => (
                      <tr key={f.puesto}>
                        <td>
                          <span className="flex items-center gap-2">
                            {f.puesto <= 3 && (
                              <Insignia puesto={f.puesto as 1 | 2 | 3} />
                            )}
                            <span className="dato">{f.puesto}°</span>
                          </span>
                        </td>
                        <td className="font-semibold">{f.nombre}</td>
                        <td className="dato text-right text-base text-acento-2">
                          {f.puntos}
                        </td>
                        <td className="dato hidden text-right text-tenue sm:table-cell">
                          {f.torneos}
                        </td>
                        <td className="dato hidden text-right text-tenue sm:table-cell">
                          {f.titulos}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="campeones-encabezado">
            <h3>Salón de campeones</h3>
            <span className="rotulo">
              {esEjemplo ? "Nombres de muestra" : "Los que ya dejaron su marca"}
            </span>
          </div>
          {campeones.length === 0 ? (
            <Vacio texto="Los primeros campeones salen del próximo torneo." />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {campeones.map((c, i) => (
                <div
                  key={`${c.nombre}-${i}`}
                  className="tarjeta campeon tarjeta-viva flex items-center gap-3 p-4"
                >
                  <Lobo tamano={34} />
                  <div className="min-w-0">
                    <p className="font-bold">{c.nombre}</p>
                    <p className="truncate text-xs text-tenue">{c.torneo}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="seccion-kripta aparece mx-auto max-w-6xl px-5">
          <Titulo
            rotulo="Tu equipo fuera de la partida"
            titulo="Herramientas para jugar mejor."
            texto="Gratis, sin registro y listas para usar. Tus ajustes y tu partida quedan guardados en este navegador."
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Herramienta
              href="/sensibilidad"
              imagen="herramienta-sensibilidad-v2"
              numero="01"
              titulo="Encontrá tu sensibilidad."
              texto="Pasá tu configuración entre Valorant, CS2, Apex y Overwatch 2."
              accion="Abrir convertidor"
            />
            <Herramienta
              href="/anotador"
              imagen="herramienta-anotador-v2"
              numero="02"
              titulo="La cuenta, siempre clara."
              texto="Anotá el Truco con fósforos. Malas, buenas y revancha."
              accion="Abrir anotador"
            />
          </div>
        </section>
        <section className="cierre-kripta aparece mx-auto max-w-6xl px-5">
          <div className="cierre-interior">
            <Image
              src="/imagenes/hero-kripta-v2.webp"
              alt=""
              fill
              sizes="(max-width: 1152px) 100vw, 1152px"
            />
            <div className="cierre-velo" />
            <div className="cierre-texto">
              <p className="sobre-titulo">Hay lugar para uno más</p>
              <h2 className="titular-seccion">
                Traé a tu dúo.
                <br />
                <span className="text-acento-2">Encontrá a tu manada.</span>
              </h2>
              <p>
                Entrá al Discord, presentate y sumate a la próxima partida. Si
                invitás a un amigo y juega su primer torneo, los dos suman
                puntos de temporada.
              </p>
              <BotonDiscord ubicacion="cta-referidos" className="text-base">
                Entrar al Discord <span aria-hidden="true">↗</span>
              </BotonDiscord>
            </div>
          </div>
        </section>
      </main>
      <Pie />
    </>
  );
}
function Titulo({
  rotulo,
  titulo,
  texto,
}: {
  rotulo: string;
  titulo: string;
  texto: string;
}) {
  return (
    <div className="titulo-bloque">
      <p className="sobre-titulo">{rotulo}</p>
      <h2 className="titular-seccion">{titulo}</h2>
      <p className="text-tenue leading-relaxed">{texto}</p>
    </div>
  );
}
function Vacio({ texto }: { texto: string }) {
  return (
    <div className="tarjeta p-6 text-center">
      <p className="text-tenue">{texto}</p>
    </div>
  );
}
function Herramienta({
  href,
  imagen,
  numero,
  titulo,
  texto,
  accion,
}: {
  href: string;
  imagen: string;
  numero: string;
  titulo: string;
  texto: string;
  accion: string;
}) {
  return (
    <Link href={href} className="herramienta-visual tarjeta">
      <div className="herramienta-imagen">
        <Image
          src={`/imagenes/${imagen}.webp`}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, 560px"
        />
      </div>
      <div className="herramienta-texto">
        <span className="rotulo">Equipo de la Kripta / {numero}</span>
        <h3>{titulo}</h3>
        <p>{texto}</p>
        <span className="herramienta-accion">
          {accion}
          <span aria-hidden="true">↗</span>
        </span>
      </div>
    </Link>
  );
}
