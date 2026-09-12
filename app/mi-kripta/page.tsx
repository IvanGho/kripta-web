import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Cabecera } from "../componentes/cabecera";
import { Pie } from "../componentes/pie";
import { ACCESO_LISTO } from "../lib/identidad";
import { sincronizarJugador } from "../lib/sincronizar-jugador";
import { crearClienteServidor } from "../lib/supabase/server";
import { cerrarSesion, vincularDiscord } from "../acceso/acciones";

export const metadata: Metadata = {
  title: "Mi Kripta",
  description: "Tu lugar personal para seguir Monsterland.",
  alternates: { canonical: "/mi-kripta" },
  robots: { index: false, follow: false },
};

export default async function MiKripta({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (!ACCESO_LISTO) redirect("/acceso");
  const supabase = await crearClienteServidor();
  const { data } = await supabase.auth.getUser();
  const usuario = data.user;
  if (!usuario) redirect("/acceso");

  const nombre = String(usuario.user_metadata?.full_name ?? usuario.user_metadata?.name ?? "Jugador").trim();
  const proveedores = new Set(usuario.identities?.map((identidad) => identidad.provider) ?? []);
  const tieneDiscord = proveedores.has("discord");
  const tieneGoogle = proveedores.has("google");
  const estado = await sincronizarJugador(usuario);
  const errorVinculacion = (await searchParams).error === "vinculacion";
  const mensajeDiscord = !tieneDiscord
    ? "Podés entrar con Google, pero necesitás Discord para anotarte, recibir avisos y hacer check-in."
    : estado === "sincronizado"
      ? "Tu cuenta ya está vinculada al panel. El staff puede encontrarte sin cargar tus datos a mano."
      : estado === "conflicto"
        ? "Este Discord ya está asociado a otra cuenta. Pedile al staff que revise la vinculación antes de anotarte."
        : estado === "no_disponible"
          ? "Discord está confirmado, pero el panel no respondió. La vinculación se reintenta automáticamente al volver."
          : "Discord está confirmado. La vinculación al panel se activará al publicar la integración.";

  return (
    <>
      <Cabecera />
      <main id="contenido" className="mi-kripta mx-auto w-full max-w-6xl px-5">
        <section className="mi-kripta-cabecera">
          <p className="sobre-titulo">Sesión protegida</p>
          <h1 className="titular-seccion">Bienvenido, <span className="text-acento-2">{nombre}.</span></h1>
          <p>Tu cuenta concentra tu identidad, torneos y accesos. Discord es obligatorio para competir y coordinar con el staff.</p>
        </section>

        <div className="mi-kripta-grid">
          <section className={`tarjeta mi-kripta-paso ${tieneDiscord ? "identidad-lista" : "identidad-pendiente"}`} aria-labelledby="titulo-discord">
            <span>01 · Identidad competitiva</span>
            <h2 id="titulo-discord">{tieneDiscord ? "Discord conectado" : "Conectá Discord"}</h2>
            <p>{mensajeDiscord}</p>
            {!tieneDiscord && (
              <form action={vincularDiscord}>
                <button type="submit" className="boton text-sm">Vincular Discord</button>
              </form>
            )}
            {errorVinculacion && <p className="identidad-error" role="alert">No se pudo vincular. Revisaremos la configuración de Supabase.</p>}
          </section>
          <section className="tarjeta mi-kripta-paso" aria-labelledby="titulo-accesos">
            <span>02 · Accesos</span>
            <h2 id="titulo-accesos">Tus conexiones</h2>
            <p>Discord: <strong>{tieneDiscord ? "conectado" : "pendiente"}</strong><br />Google: <strong>{tieneGoogle ? "conectado" : "no conectado"}</strong></p>
            <Link href="/#torneos" className="boton-sec text-sm">Explorar torneos <b aria-hidden="true">↓</b></Link>
          </section>
          <section className="tarjeta mi-kripta-paso" aria-labelledby="titulo-sesion">
            <span>03 · Seguridad</span>
            <h2 id="titulo-sesion">Tu sesión</h2>
            <p>La sesión se guarda en una cookie segura. Podés cerrarla en cualquier momento desde este dispositivo.</p>
            <form action={cerrarSesion}>
              <button type="submit" className="boton-sec text-sm">Cerrar sesión</button>
            </form>
          </section>
        </div>
      </main>
      <Pie />
    </>
  );
}
