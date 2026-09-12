import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import Google from "next-auth/providers/google";
import PostgresAdapter from "@auth/pg-adapter";
import type { Adapter, AdapterAccount } from "@auth/core/adapters";
import { Pool } from "pg";
import {
  ACCESO_LISTO,
  PROVEEDORES_DISPONIBLES,
  URL_BASE_IDENTIDAD,
} from "./app/lib/identidad";

declare global {
  // Una instancia caliente de Next no abre otro pool por cada recarga de módulos en desarrollo.
  var kriptaPoolIdentidad: Pool | undefined;
}

const sslPoolerSinCA = process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === "false";

function conexionPooler(url: string): string {
  if (!sslPoolerSinCA) return url;
  // node-postgres deja que sslmode de la URI pise la opción ssl del cliente. Lo retiramos
  // únicamente cuando la compatibilidad explícita de este pooler está habilitada.
  const uri = new URL(url);
  uri.searchParams.delete("sslmode");
  return uri.toString();
}

const pool = URL_BASE_IDENTIDAD
  ? (globalThis.kriptaPoolIdentidad ??= new Pool({
      connectionString: conexionPooler(URL_BASE_IDENTIDAD),
      // Las tablas del acceso viven aisladas de las tablas del panel aunque compartan Postgres.
      options: "-c search_path=kripta_auth,public",
      // En Vercel cada instancia caliente tiene su propio pool. Un único socket por instancia
      // evita agotar el pool de Supabase y basta para este flujo de identidad.
      max: 1,
      // El pooler compartido de Supabase cifra la conexión pero presenta una cadena que el
      // runtime serverless no puede validar sin instalar su CA. Esta excepción se habilita
      // únicamente de forma explícita; cuando tengamos la CA, se elimina.
      ssl:
        sslPoolerSinCA
          ? { rejectUnauthorized: false }
          : undefined,
    }))
  : undefined;

function adaptadorSeguro(base: Pool): Adapter {
  const adaptador = PostgresAdapter(base);
  return {
    ...adaptador,
    /**
     * Entrar no autoriza a la web a operar Google ni Discord en nombre de la persona. Los tokens
     * que devuelven los proveedores se descartan después de verificar la identidad; sólo queda la
     * relación con la cuenta y la sesión revocable.
     */
    async linkAccount(cuenta: AdapterAccount) {
      await adaptador.linkAccount!({
        ...cuenta,
        access_token: undefined,
        refresh_token: undefined,
        id_token: undefined,
        expires_at: undefined,
        token_type: undefined,
        scope: undefined,
        session_state: undefined,
      });
    },
  };
}

const proveedores = ACCESO_LISTO
  ? [
      ...(PROVEEDORES_DISPONIBLES.includes("discord")
        ? [
            Discord({
              // Para iniciar sesión alcanza con identificar la cuenta. No pedimos servidores,
              // mensajes, contactos ni permisos del bot.
              authorization: { params: { scope: "identify" } },
              // Dos proveedores con el mismo email no se unen solos. Vincular es una acción que
              // vamos a pedir desde una sesión ya autenticada, no una suposición del servidor.
              allowDangerousEmailAccountLinking: false,
            }),
          ]
        : []),
      ...(PROVEEDORES_DISPONIBLES.includes("google")
        ? [Google({ allowDangerousEmailAccountLinking: false })]
        : []),
    ]
  : [];

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: pool ? adaptadorSeguro(pool) : undefined,
  providers: proveedores,
  pages: { signIn: "/acceso" },
  session: { strategy: pool ? "database" : "jwt", maxAge: 30 * 24 * 60 * 60 },
  // Vercel ya conoce el host de la solicitud. En desarrollo se declara de forma explícita en .env.
  trustHost: process.env.VERCEL === "1" || process.env.AUTH_TRUST_HOST === "true",
});
