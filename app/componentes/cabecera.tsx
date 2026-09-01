import Link from "next/link";
import { Marca } from "./marca";
import { BotonDiscord } from "./boton-discord";

const ENLACES = [
  { href: "/#ranking", texto: "Ranking" },
  { href: "/#torneos", texto: "Torneos" },
  { href: "/anotador", texto: "Anotador de Truco", cortoEnTelefono: "Anotador" },
  { href: "/sensibilidad", texto: "Sensibilidad" },
];

export function Cabecera() {
  return (
    <header className="sticky top-0 z-40 border-b border-borde/70 bg-fondo/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3">
        {/*
          Sin `aria-label="Inicio"`. El enlace envuelve el texto visible "Kripta / Monsterland",
          y un aria-label lo pisa: el nombre accesible pasaba a ser "Inicio", que no contiene
          nada de lo que se ve. Eso rompe el control por voz (decir "hacé clic en Kripta" no
          encuentra nada) y desconcierta a quien escucha una cosa y ve otra.
        */}
        <Link href="/" className="rounded-lg">
          <Marca />
        </Link>

        {/* En pantallas anchas la navegación va en la misma fila. */}
        <nav aria-label="Secciones" className="ml-auto hidden items-center gap-6 text-sm text-tenue md:flex">
          {ENLACES.map((e) => (
            <Link key={e.href} href={e.href} className="rounded transition-colors hover:text-texto">
              {e.texto}
            </Link>
          ))}
        </nav>

        <BotonDiscord className="ml-auto px-4 py-2 text-sm md:ml-0">
          Entrar al Discord
        </BotonDiscord>
      </div>

      {/*
        En teléfono la navegación no existía: el <nav> estaba `hidden md:flex` y no había
        hamburguesa, así que a 390px de ancho sólo quedaban el logo y el botón de Discord. Los
        cuatro enlaces se alcanzaban únicamente desde el pie, después de scrollear todo.

        Se resuelve con una fila propia que se desliza en horizontal, y no con un menú
        desplegable, por dos razones: son cuatro enlaces (un menú para cuatro cosas es esconder
        lo que se podría mostrar), y un desplegable necesita JavaScript de estado, mientras que
        esto es HTML y CSS. Lo visible siempre gana sobre lo que hay que descubrir.
      */}
      <nav
        aria-label="Secciones"
        className="flex gap-5 overflow-x-auto border-t border-borde/50 px-5 py-2 text-[13px] text-tenue md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {ENLACES.map((e) => (
          <Link
            key={e.href}
            href={e.href}
            className="shrink-0 rounded transition-colors hover:text-texto"
          >
            {e.cortoEnTelefono ?? e.texto}
          </Link>
        ))}
      </nav>
    </header>
  );
}
