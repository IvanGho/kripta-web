import type { Metadata } from "next";
import Link from "next/link";
import { Documento } from "../../componentes/documento";

export const metadata: Metadata = {
  title: "Privacidad",
  description: "Cómo se usan los datos de acceso, agenda y torneos en Kripta.",
  alternates: { canonical: "/legal/privacidad" },
};

export default function Pagina() {
  return (
    <Documento
      titulo="Política de"
      resaltado="privacidad"
      bajada="Qué datos se recolectan, quién los ve y cómo pedir que se borren."
      actualizado="2026-09-11"
    >
      <h2>Lo corto</h2>
      <p>
        Podés recorrer el sitio, usar las herramientas y consultar los torneos <strong>sin crear una
        cuenta</strong>. Si elegís entrar a tu Kripta, Discord o Google confirman tu identidad: tu
        contraseña nunca pasa por nuestros servidores.
      </p>
      <p>
        La cuenta sirve para construir una agenda y un perfil personal. La inscripción, el check-in
        y la confirmación de mayoría de edad para competir siguen pasando <strong>dentro de Discord</strong>.
      </p>

      <h2>Información de visita</h2>
      <ul>
        <li>
          <strong>Estadísticas agregadas.</strong> Vercel Web Analytics cuenta páginas vistas,
          procedencia general y tipo de dispositivo. No crea un perfil publicitario ni sigue a una
          persona entre sitios.
        </li>
        <li>
          <strong>Acciones generales.</strong> Medimos desde dónde se abre Discord y cuándo se agrega
          un torneo al calendario. Es información de uso, no una ficha de la persona que hizo clic.
        </li>
        <li>
          <strong>Agenda en este dispositivo.</strong> Al guardar un torneo, el navegador conserva
          solamente su identificador público. Sirve para mostrarte que ya lo agendaste y no se envía
          al servidor mientras no exista una función de sincronización que te la pida.
        </li>
        <li>
          <strong>Registros técnicos.</strong> El alojamiento registra pedidos e IP de forma temporal
          para entregar las páginas y defender el servicio de abusos.
        </li>
      </ul>

      <h2>Información de tu cuenta</h2>
      <p>
        Sólo existe si entrás. Guardamos la identidad que devuelve el proveedor elegido, tu nombre
        visible, la imagen de perfil si la comparte y, en el caso de Google, el mail que entrega esa
        cuenta verificada. Guardamos además una sesión revocable que vence a los 30 días.
      </p>
      <p>
        Discord se usa con el permiso mínimo de identificación: no leemos mensajes, contactos ni
        servidores. Los tokens de Google y Discord se descartan después de validar el acceso, por lo
        que la web no puede operar esos servicios en tu nombre. Tampoco unimos cuentas sólo porque
        tengan el mismo mail.
      </p>

      <h2>Datos de quienes compiten</h2>
      <p>
        Al registrarte con <strong>/registrarme</strong> dentro de Discord, la organización puede guardar
        tu identidad de Discord, nombre de juego, confirmación de mayoría de edad, alias para acreditar
        un premio cuando corresponda y resultados de competencia. El ranking puede mostrar tu nombre,
        puntos, torneos y títulos.
      </p>
      <p>
        El resto de la ficha de jugador no se publica. La web pública recibe datos agregados y resultados
        necesarios para mostrar los torneos y el ranking; tu navegador no se conecta directamente al
        sistema de administración.
      </p>

      <h2>Quién accede</h2>
      <p>
        La administración y la moderación de torneos acceden a la información operativa necesaria.
        Vercel aloja el sitio y la base de datos guarda las sesiones. Si elegís entrar, Discord o Google
        procesan la autenticación según su propia política de privacidad. No vendemos ni cedemos datos.
      </p>

      <h2>Conservación y eliminación</h2>
      <p>
        La relación con un proveedor se conserva mientras tu cuenta siga activa y se borra cuando pedís
        eliminarla. Los resultados y puntos se mantienen como historial de las temporadas; si pedís la
        baja, el historial puede conservarse de forma anónima para no alterar resultados ya cerrados.
      </p>

      <h2>Tus derechos</h2>
      <p>
        Podés saber qué datos tenemos, corregirlos o pedir su eliminación. En Argentina estos derechos
        están contemplados por la Ley 25.326. Encontrás el canal y los plazos en la página de{" "}
        <Link href="/legal/derechos" className="text-acento-2 underline">tus derechos</Link>.
      </p>
      <p>
        Ver también los <Link href="/legal/terminos" className="text-acento-2 underline">términos de la comunidad</Link>.
      </p>
    </Documento>
  );
}
