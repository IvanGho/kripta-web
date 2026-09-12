/** Prepara las tablas persistentes del bot y del calendario de escenas. Es idempotente. */
import { Pool } from "pg";

try {
  process.loadEnvFile(".env.local");
} catch {
  // En hosting, las variables las inyecta la plataforma.
}

const url =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.NEON_DATABASE_URL;

if (!url) {
  console.log("No hay DATABASE_URL. Configurala y volvé a correr npm run preparar-automatizacion.");
  process.exit(0);
}

const pool = new Pool({ connectionString: url });

const sql = `
  CREATE SCHEMA IF NOT EXISTS kripta_automation;
  SET search_path TO kripta_automation, public;

  CREATE TABLE IF NOT EXISTS trabajos_escena (
    id UUID PRIMARY KEY,
    chat_id TEXT NOT NULL,
    usuario_id TEXT NOT NULL,
    estado TEXT NOT NULL CHECK (estado IN ('borrador','generando','listo','aprobado','publicado','rechazado','fallido')),
    especificacion JSONB NOT NULL,
    operacion_veo TEXT,
    video_origen_url TEXT,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS trabajos_estado_idx ON trabajos_escena (estado, creado_en);

  CREATE TABLE IF NOT EXISTS telegram_updates (
    update_id BIGINT PRIMARY KEY,
    recibido_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS escenas_publicadas (
    id UUID PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    titulo TEXT NOT NULL,
    video_webm_url TEXT NOT NULL,
    video_mp4_url TEXT NOT NULL,
    poster_url TEXT NOT NULL,
    activa_desde DATE,
    activa_hasta DATE,
    publicada_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (activa_hasta IS NULL OR activa_desde IS NULL OR activa_hasta >= activa_desde)
  );
`;

try {
  await pool.query(sql);
  console.log("Esquema kripta_automation listo.");
} finally {
  await pool.end();
}
