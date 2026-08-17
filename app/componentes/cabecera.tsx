import Link from "next/link";
import { Marca } from "./marca";
import { URL_DISCORD } from "../lib/enlaces";

export function Cabecera() {
  return (
    <header className="sticky top-0 z-40 border-b border-borde/70 bg-fondo/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3">
        <Link href="/" aria-label="Inicio">
          <Marca />
        </Link>

        <nav className="ml-auto hidden items-center gap-6 text-sm text-tenue md:flex">
          <a href="/#ranking" className="transition-colors hover:text-texto">Ranking</a>
          <a href="/#torneos" className="transition-colors hover:text-texto">Torneos</a>
          <Link href="/anotador" className="transition-colors hover:text-texto">Anotador de Truco</Link>
          <Link href="/sensibilidad" className="transition-colors hover:text-texto">Sensibilidad</Link>
        </nav>

        <a href={URL_DISCORD} className="boton ml-auto px-4 py-2 text-sm md:ml-0" target="_blank" rel="noopener">
          Entrar al Discord
        </a>
      </div>
    </header>
  );
}
