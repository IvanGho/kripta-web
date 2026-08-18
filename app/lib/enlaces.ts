/**
 * Enlaces externos, todos en un solo lugar.
 *
 * El del Discord es el más importante del sitio: es la conversión. Va por variable de
 * entorno para poder cambiarlo sin tocar código, porque las invitaciones de Discord se
 * pueden vencer y no queremos que el botón principal quede muerto.
 *
 * Cuando lo configures, usá una invitación **que no expire**.
 */
const CONFIGURADA = (process.env.NEXT_PUBLIC_URL_DISCORD ?? "").trim();

/**
 * ¿Tenemos una invitación de verdad?
 *
 * No alcanza con que la variable exista. Una invitación de Discord es `discord.gg/<código>`, y
 * tanto `""` como `"https://discord.gg/"` (el valor al que caía el sitio por defecto) apuntan a
 * la página institucional de Discord, donde el visitante se pierde. Se exige que haya algo
 * después de la barra para no dar por buena una URL que no invita a ningún lado.
 */
export const HAY_DISCORD = /^https?:\/\/(discord\.gg|discord\.com\/invite)\/[^/\s]+$/i.test(
  CONFIGURADA,
);

export const URL_DISCORD = HAY_DISCORD ? CONFIGURADA : "https://discord.gg/";

/*
 * Si la invitación falta o está mal escrita, avisarlo en el build. En Vercel esto sale en el log
 * de deploy: es la única forma de que se note antes de que lo note un visitante.
 */
if (!HAY_DISCORD) {
  console.warn(
    "[kripta-web] NEXT_PUBLIC_URL_DISCORD no está configurada o no es una invitación válida " +
      "(se espera https://discord.gg/<código>). Los botones de Discord van a aparecer " +
      "deshabilitados para no mandar a la gente a una página equivocada.",
  );
}
