import "server-only";

import { Pool } from "pg";
import { URL_BASE_IDENTIDAD } from "../identidad";
import type { EspecificacionEscena, EstadoTrabajo, TrabajoEscena } from "./tipos";

declare global {
  var kriptaPoolAutomatizacion: Pool | undefined;
}

const pool = URL_BASE_IDENTIDAD
  ? (globalThis.kriptaPoolAutomatizacion ??= new Pool({
      connectionString: URL_BASE_IDENTIDAD,
      options: "-c search_path=kripta_automation,public",
      // Las funciones serverless se escalan por instancia; no por conexiones locales.
      max: 1,
    }))
  : undefined;

function exigirPool(): Pool {
  if (!pool) {
    throw new Error("La automatización necesita DATABASE_URL y el esquema preparado.");
  }
  return pool;
}

export async function registrarUpdateTelegram(updateId: number): Promise<boolean> {
  const resultado = await exigirPool().query(
    "INSERT INTO telegram_updates (update_id) VALUES ($1) ON CONFLICT DO NOTHING",
    [updateId],
  );
  return resultado.rowCount === 1;
}

type FilaTrabajo = {
  id: string;
  chat_id: string;
  usuario_id: string;
  estado: EstadoTrabajo;
  especificacion: EspecificacionEscena;
  operacion_veo: string | null;
  video_origen_url: string | null;
  creado_en: Date;
  actualizado_en: Date;
};

function desdeFila(fila: FilaTrabajo): TrabajoEscena {
  return {
    id: fila.id,
    chatId: fila.chat_id,
    usuarioId: fila.usuario_id,
    estado: fila.estado,
    especificacion: fila.especificacion,
    operacionVeo: fila.operacion_veo,
    videoOrigenUrl: fila.video_origen_url,
    creadoEn: fila.creado_en.toISOString(),
    actualizadoEn: fila.actualizado_en.toISOString(),
  };
}

export async function guardarBorrador(params: {
  chatId: string;
  usuarioId: string;
  especificacion: EspecificacionEscena;
}): Promise<TrabajoEscena> {
  const id = crypto.randomUUID();
  const resultado = await exigirPool().query<FilaTrabajo>(
    `INSERT INTO trabajos_escena (id, chat_id, usuario_id, estado, especificacion)
     VALUES ($1, $2, $3, 'borrador', $4::jsonb)
     RETURNING *`,
    [id, params.chatId, params.usuarioId, JSON.stringify(params.especificacion)],
  );
  return desdeFila(resultado.rows[0]);
}

export async function buscarTrabajo(id: string): Promise<TrabajoEscena | null> {
  const resultado = await exigirPool().query<FilaTrabajo>(
    "SELECT * FROM trabajos_escena WHERE id = $1",
    [id],
  );
  return resultado.rows[0] ? desdeFila(resultado.rows[0]) : null;
}

export async function cambiarEstado(params: {
  id: string;
  desde: EstadoTrabajo;
  hacia: EstadoTrabajo;
  operacionVeo?: string;
  videoOrigenUrl?: string;
}): Promise<TrabajoEscena | null> {
  const resultado = await exigirPool().query<FilaTrabajo>(
    `UPDATE trabajos_escena
       SET estado = $3,
           operacion_veo = COALESCE($4, operacion_veo),
           video_origen_url = COALESCE($5, video_origen_url),
           actualizado_en = NOW()
     WHERE id = $1 AND estado = $2
     RETURNING *`,
    [params.id, params.desde, params.hacia, params.operacionVeo ?? null, params.videoOrigenUrl ?? null],
  );
  return resultado.rows[0] ? desdeFila(resultado.rows[0]) : null;
}

export async function trabajosGenerando(limite = 8): Promise<TrabajoEscena[]> {
  const resultado = await exigirPool().query<FilaTrabajo>(
    "SELECT * FROM trabajos_escena WHERE estado = 'generando' ORDER BY creado_en ASC LIMIT $1",
    [Math.min(Math.max(limite, 1), 20)],
  );
  return resultado.rows.map(desdeFila);
}

export async function contarTrabajosRecientes(usuarioId: string): Promise<number> {
  const resultado = await exigirPool().query<{ cantidad: string }>(
    `SELECT COUNT(*)::text AS cantidad
       FROM trabajos_escena
      WHERE usuario_id = $1 AND creado_en >= NOW() - INTERVAL '24 hours'`,
    [usuarioId],
  );
  return Number(resultado.rows[0]?.cantidad ?? 0);
}

export async function ultimoTrabajo(usuarioId: string): Promise<TrabajoEscena | null> {
  const resultado = await exigirPool().query<FilaTrabajo>(
    "SELECT * FROM trabajos_escena WHERE usuario_id = $1 ORDER BY creado_en DESC LIMIT 1",
    [usuarioId],
  );
  return resultado.rows[0] ? desdeFila(resultado.rows[0]) : null;
}
