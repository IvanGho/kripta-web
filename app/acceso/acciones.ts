"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESO_LISTO, proveedorDisponible } from "../lib/identidad";
import { URL_SITIO } from "../lib/sitio";
import { crearClienteServidor } from "../lib/supabase/server";

async function origenActual() {
  if (process.env.VERCEL_ENV === "production") return URL_SITIO;
  const urlVercel = process.env.VERCEL_URL?.trim();
  if (urlVercel) return `https://${urlVercel}`;

  const cabeceras = await headers();
  const host = cabeceras.get("host") || "localhost:3000";
  return host.startsWith("localhost") || host.startsWith("127.0.0.1")
    ? `http://${host}`
    : URL_SITIO;
}

export async function iniciarSesion(formData: FormData) {
  const proveedor = String(formData.get("proveedor") ?? "");
  if (!ACCESO_LISTO || !proveedorDisponible(proveedor)) return;
  const supabase = await crearClienteServidor();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: proveedor,
    options: { redirectTo: `${await origenActual()}/auth/callback?next=/mi-kripta` },
  });
  if (error || !data.url) redirect("/acceso?error=oauth");
  redirect(data.url);
}

export async function vincularDiscord() {
  if (!ACCESO_LISTO) return;
  const supabase = await crearClienteServidor();
  const { data, error } = await supabase.auth.linkIdentity({
    provider: "discord",
    options: { redirectTo: `${await origenActual()}/auth/callback?next=/mi-kripta` },
  });
  if (error || !data.url) redirect("/mi-kripta?error=vinculacion");
  redirect(data.url);
}

export async function cerrarSesion() {
  if (ACCESO_LISTO) {
    const supabase = await crearClienteServidor();
    await supabase.auth.signOut();
  }
  redirect("/acceso");
}
