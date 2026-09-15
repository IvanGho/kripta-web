/** Destinos internos que pueden sobrevivir al viaje de OAuth sin habilitar redirecciones abiertas. */
export function destinoCuentaSeguro(valor: string | null | undefined): string {
  if (!valor) return "/mi-kripta";
  try {
    const url = new URL(valor, "https://destino-interno.invalid");
    if (url.origin !== "https://destino-interno.invalid") return "/mi-kripta";
    if (url.pathname === "/mi-kripta" && !url.search) return "/mi-kripta";
    if (url.pathname === "/pago/iniciar") {
      const torneo = Number(url.searchParams.get("torneo"));
      if (Number.isSafeInteger(torneo) && torneo > 0) return `/pago/iniciar?torneo=${torneo}`;
    }
  } catch {
    // Cualquier URL ilegible cae al destino inocuo de la cuenta.
  }
  return "/mi-kripta";
}
