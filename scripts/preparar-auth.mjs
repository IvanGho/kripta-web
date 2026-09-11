/**
 * Prepara las tablas persistentes del acceso de usuarios.
 *
 * Se puede ejecutar cada vez que se necesite: todas las sentencias son idempotentes y el esquema
 * `kripta_auth` mantiene estas tablas fuera del espacio de nombres operativo del panel.
 *
 * Uso:
 *   DATABASE_URL=... npm run preparar-auth
 *
 * En Windows, si ya existe `.env.local`, Node 22 la lee antes de mirar DATABASE_URL.
 */
import { Pool } from "pg";

try {
  process.loadEnvFile(".env.local");
} catch {
  // En Vercel no hay archivo local. Ahí la variable la aporta el proyecto.
}

const url =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.NEON_DATABASE_URL;

if (!url) {
  console.log("No hay DATABASE_URL. Configurala y volvé a correr npm run preparar-auth.");
  process.exit(0);
}

const pool = new Pool({ connectionString: url });

const esquema = `
  CREATE SCHEMA IF NOT EXISTS kripta_auth;
  SET search_path TO kripta_auth, public;

  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    "emailVerified" TIMESTAMPTZ,
    image TEXT
  );

  CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at BIGINT,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    UNIQUE (provider, "providerAccountId")
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires TIMESTAMPTZ NOT NULL,
    "sessionToken" TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS verification_token (
    identifier TEXT NOT NULL,
    expires TIMESTAMPTZ NOT NULL,
    token TEXT NOT NULL,
    PRIMARY KEY (identifier, token)
  );

  CREATE INDEX IF NOT EXISTS sessions_usuario_idx ON sessions ("userId");
  CREATE INDEX IF NOT EXISTS accounts_usuario_idx ON accounts ("userId");
`;

try {
  await pool.query(esquema);
  console.log("Esquema kripta_auth listo: usuarios, sesiones y cuentas OAuth preparados.");
} finally {
  await pool.end();
}
