/**
 * Enlaces externos, todos en un solo lugar.
 *
 * El del Discord es el más importante del sitio: es la conversión. Va por variable de
 * entorno para poder cambiarlo sin tocar código, porque las invitaciones de Discord se
 * pueden vencer y no queremos que el botón principal quede muerto.
 *
 * Cuando lo configures, usá una invitación **que no expire**.
 */
export const URL_DISCORD = process.env.NEXT_PUBLIC_URL_DISCORD ?? "https://discord.gg/";

export const HAY_DISCORD = Boolean(process.env.NEXT_PUBLIC_URL_DISCORD);
