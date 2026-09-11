"use server";

import { signIn, signOut } from "../../auth";
import { ACCESO_LISTO, proveedorDisponible } from "../lib/identidad";

export async function iniciarSesion(formData: FormData) {
  const proveedor = String(formData.get("proveedor") ?? "");
  if (!ACCESO_LISTO || !proveedorDisponible(proveedor)) return;
  await signIn(proveedor, { redirectTo: "/mi-kripta" });
}

export async function cerrarSesion() {
  await signOut({ redirectTo: "/acceso" });
}
