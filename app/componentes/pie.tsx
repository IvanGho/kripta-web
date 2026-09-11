import Link from "next/link";
import { Lobo } from "./marca";
import { BotonDiscord } from "./boton-discord";

export function Pie() {
  return (
    <footer className="relative mt-24 border-t border-borde/70">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <Lobo tamano={38} />
            <p className="mt-3 text-sm text-tenue">
              Comunidad argentina de gaming. Torneos de Valorant y Truco, de 20 a 05.
            </p>
          </div>

          {/*
            `flex-wrap` no es decorativo: con la columna de legales son tres listas, y en un teléfono
            de 390px "Convertir sensibilidad" más las otras dos columnas y sus separaciones no entran
            en el ancho. Sin esto aparece desplazamiento horizontal en todas las páginas, que es
            justamente lo que verifica el script del navegador.
          */}
          <div className="flex flex-wrap gap-x-10 gap-y-8 text-sm">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.14em] text-tenue">Comunidad</p>
              <ul className="space-y-2">
                <li><BotonDiscord ubicacion="pie" variante="enlace" className="text-texto hover:text-acento-2">Discord</BotonDiscord></li>
                <li><Link href="/mi-kripta" className="text-texto hover:text-acento-2">Mi Kripta</Link></li>
                <li><Link href="/#empezar" className="text-texto hover:text-acento-2">Cómo participar</Link></li>
                <li><Link href="/#ranking" className="text-texto hover:text-acento-2">Ranking</Link></li>
                <li><Link href="/#torneos" className="text-texto hover:text-acento-2">Torneos</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.14em] text-tenue">Herramientas</p>
              <ul className="space-y-2">
                <li><Link href="/anotador" className="text-texto hover:text-acento-2">Anotador de Truco</Link></li>
                <li><Link href="/sensibilidad" className="text-texto hover:text-acento-2">Convertir sensibilidad</Link></li>
              </ul>
            </div>
            {/*
              Privacidad y términos van en el pie y en una columna propia porque tienen que estar
              alcanzables desde cualquier página del sitio: es donde la gente las busca, y donde las
              busca también quien revisa un sitio antes de aprobarle una campaña de anuncios.
            */}
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.14em] text-tenue">Legales</p>
              <ul className="space-y-2">
                <li><Link href="/legal/privacidad" className="text-texto hover:text-acento-2">Privacidad</Link></li>
                <li><Link href="/legal/terminos" className="text-texto hover:text-acento-2">Términos</Link></li>
                <li><Link href="/legal/derechos" className="text-texto hover:text-acento-2">Tus derechos</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/*
          Esta letra chica no es relleno legal: es la posición de la organización sobre por qué
          los torneos son concursos de habilidad y no apuestas. Va en todas las páginas.
        */}
        <div className="mt-10 border-t border-borde/60 pt-6 text-xs leading-relaxed text-tenue">
          <p>
            El premio de cada torneo es fijo, se anuncia antes de abrir la inscripción y lo paga la
            organización: no se forma con las inscripciones y no cambia según cuánta gente se anote.
            Los torneos con inscripción o premio son sólo para mayores de 18 años. Las mesas de
            Pista Libre son gratuitas y abiertas a todo el servidor.
          </p>
          <p className="mt-3">© {new Date().getFullYear()} Monsterland · Kripta</p>
        </div>
      </div>
    </footer>
  );
}
