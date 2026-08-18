import Link from "next/link";
import { Marca } from "./marca";
import { BotonDiscord } from "./boton-discord";

export function Cabecera() {
  return (
    <header className="sticky top-0 z-40 border-b border-borde/70 bg-fondo/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3">
        <Link href="/" aria-label="Inicio">
          <Marca />
        </Link>

        <nav className="ml-auto hidden items-center gap-6 text-sm text-tenue md:flex">
          <Link href="/#ranking" className="transition-colors hover:text-texto">Ranking</Link>
          <Link href="/#torneos" className="transition-colors hover:text-texto">Torneos</Link>
          <Link href="/anotador" className="transition-colors hover:text-texto">Anotador de Truco</Link>
          <Link href="/sensibilidad" className="transition-colors hover:text-texto">Sensibilidad</Link>
        </nav>

        <BotonDiscord className="ml-auto px-4 py-2 text-sm md:ml-0">
          Entrar al Discord
        </BotonDiscord>
      </div>
    </header>
  );
}
