import type { Metadata } from "next";
import Link from "next/link";
import { Documento } from "../../componentes/documento";
import { BotonDiscord } from "../../componentes/boton-discord";

export const metadata: Metadata = {
  title: "Tus derechos sobre tus datos",
  description: "Cómo pedir acceso, corrección o eliminación de tus datos personales en Kripta.",
  alternates: { canonical: "/legal/derechos" },
};

export default function Pagina() {
  return (
    <Documento
      titulo="Tus"
      resaltado="derechos"
      bajada="Cómo ver, corregir o borrar los datos que tenemos tuyos."
      actualizado="2026-09-11"
    >
      <h2>Qué podés pedir</h2>
      <ul>
        <li><strong>Acceso.</strong> Conocer los datos que tenemos y para qué se usan.</li>
        <li><strong>Corrección.</strong> Actualizar información incorrecta o desactualizada.</li>
        <li><strong>Eliminación.</strong> Borrar tu cuenta personal o tu ficha de jugador cuando corresponda.</li>
        <li><strong>Oposición.</strong> Pedir que dejemos de usar una información para una finalidad puntual.</li>
      </ul>

      <h2>Cómo pedirlo</h2>
      <p>
        Escribí por mensaje directo a la administración en Discord. Indicá qué querés solicitar y,
        si usaste una cuenta de Google, mencioná el mail de esa cuenta para que podamos encontrarla
        sin pedirte datos innecesarios.
      </p>
      <div className="my-6 flex">
        <BotonDiscord ubicacion="pagina-legal" variante="secundario" className="text-sm">
          Ir al Discord
        </BotonDiscord>
      </div>

      <h2>Plazos</h2>
      <p>
        La Ley 25.326 prevé hasta 10 días corridos para responder una solicitud de acceso y hasta
        5 días hábiles para rectificar, actualizar o suprimir datos. El acceso es gratuito en los
        intervalos previstos por la ley.
      </p>

      <h2>Qué se conserva</h2>
      <p>
        Al eliminar una cuenta se revocan sus sesiones y se borra la relación con el proveedor de
        acceso. Los resultados de torneos ya cerrados pueden quedar como historial anónimo para no
        modificar los puestos de otras personas.
      </p>

      <h2>Más información</h2>
      <p>
        El detalle sobre cuentas, agenda y participantes está en la{" "}
        <Link href="/legal/privacidad" className="text-acento-2 underline">política de privacidad</Link>.
      </p>
    </Documento>
  );
}
