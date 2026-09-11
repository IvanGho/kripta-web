import type { Metadata } from "next";
import Link from "next/link";
import { Documento } from "../../componentes/documento";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: "Cómo funcionan la comunidad, las cuentas y los torneos de Kripta.",
  alternates: { canonical: "/legal/terminos" },
};

export default function Pagina() {
  return (
    <Documento
      titulo="Términos y"
      resaltado="condiciones"
      bajada="Cómo funciona la comunidad, qué podés esperar y qué se espera de vos."
      actualizado="2026-09-11"
    >
      <h2>Qué es Kripta</h2>
      <p>
        Kripta es la comunidad de gaming de Monsterland en Argentina. Organizamos torneos de Valorant,
        Truco y mesas gratuitas, con un ranking que se reinicia cada temporada.
      </p>

      <h2>Cuenta personal</h2>
      <p>
        Crear una cuenta es opcional y se hace con Discord o Google. Sirve para las funciones personales
        del sitio. No reemplaza el registro de jugador ni la identidad que se confirma en Discord para
        participar de un torneo.
      </p>
      <p>
        Cuidá la cuenta con la que entrás y cerrá la sesión si usás un dispositivo compartido. Podés
        pedir eliminar la cuenta desde el canal indicado en la política de privacidad.
      </p>

      <h2>Cómo se participa</h2>
      <ol>
        <li>Entrá al servidor de Discord y registrate con <strong>/registrarme</strong>.</li>
        <li>Anotate siguiendo el anuncio del torneo.</li>
        <li>Hacé check-in el día del encuentro para confirmar que vas a jugar.</li>
      </ol>
      <p>
        La llave se arma con quienes confirmaron su presencia. Si no hacés check-in, tu lugar puede
        avanzar para tu rival.
      </p>

      <h2>Premios y mayor de edad</h2>
      <p>
        El premio de cada torneo es fijo y se anuncia antes de abrir la inscripción. No cambia según
        la cantidad de participantes. Los torneos con inscripción o premio en dinero son sólo para
        mayores de 18 años; esa condición la revisa la organización.
      </p>
      <p>
        Las instancias Pista Libre son gratuitas y están abiertas a todo el servidor. Los puntos se
        ganan jugando y forman parte del ranking de temporada.
      </p>

      <h2>Conducta</h2>
      <p>
        Valen las reglas del servidor de Discord. El maltrato, la suplantación, las trampas o programas
        que den ventaja pueden dejar a una persona afuera de una competencia o de la comunidad.
      </p>

      <h2>Herramientas</h2>
      <p>
        El <Link href="/anotador" className="text-acento-2 underline">anotador de Truco</Link> y el{" "}
        <Link href="/sensibilidad" className="text-acento-2 underline">conversor de sensibilidad</Link>{" "}
        son gratuitos y no requieren una cuenta. Funcionan en tu dispositivo.
      </p>

      <h2>Cambios</h2>
      <p>
        Si estos términos cambian, cambia la fecha de arriba y se avisa por Discord. Un cambio no se
        aplica a un torneo cuya inscripción ya está abierta.
      </p>
      <p>
        Leé también la <Link href="/legal/privacidad" className="text-acento-2 underline">política de privacidad</Link>.
      </p>
    </Documento>
  );
}
