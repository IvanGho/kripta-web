import type { EspecificacionEscena } from "./tipos";
import { normalizarTema, slugDeTema } from "./tipos";

export const BRIEF_MARCA = `
Monsterland / Kripta es una comunidad gaming argentina nocturna y competitiva.
La mascota es un lobo frontal oscuro con ojos verde neón, borde verde eléctrico y EXACTAMENTE
tres cicatrices rojas diagonales cruzando el lado derecho del rostro. Esos rasgos no cambian.
Paleta: grafito #090C0A, verde #5DFF86/#7CFF4F y rojo #E05A68 sólo en las cicatrices.
Estética: cinematográfica premium, intensa pero adulta; nunca infantil ni una plantilla genérica.
El video se usa detrás de contenido web: composición limpia, movimiento lento y contraste controlado.
Sin palabras, marcas de agua, logos de juegos, armas reconocibles ni personajes de terceros.
`.trim();

export function especificacionLocal(entrada: string): EspecificacionEscena {
  const tema = normalizarTema(entrada);
  const slug = slugDeTema(tema);
  return {
    slug,
    titulo: tema.charAt(0).toUpperCase() + tema.slice(1),
    tema,
    promptVeo: `${BRIEF_MARCA}\n\nEscena: ${tema}. Plano medio frontal del lobo. Respiración lenta, un parpadeo natural y energía verde muy sutil recorriendo el contorno. Humo fino y pocas brasas. Cámara fija con un desplazamiento mínimo de profundidad. El primer y el último fotograma deben sentirse equivalentes para permitir un loop suave. Sin diálogo; ambiente casi silencioso.`,
    promptNegativo: "texto, tipografía, watermark, cuarta cicatriz, cicatrices verdes, cámara temblorosa, zoom rápido, deformación facial, ojos asimétricos, anatomía extra, exceso de partículas, estética infantil, logos de terceros",
    duracionSegundos: 8,
    relacionAspecto: "16:9",
    resolucion: "1080p",
    publicarDesde: null,
    publicarHasta: null,
  };
}

export function instruccionParaGemini(tema: string): string {
  return `${BRIEF_MARCA}\n\nCreá una especificación de producción para esta escena: "${normalizarTema(tema)}". El promptVeo debe describir sujeto, acción, cámara, iluminación, ambiente y cierre apto para loop. No cambies los rasgos no negociables de la mascota. Fechas null salvo que el pedido incluya fechas inequívocas.`;
}
