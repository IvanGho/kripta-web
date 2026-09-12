# Loop de avatar V4

El hero ya usa `hero-lobo-kripta-v4.webp` como póster y fallback. Para que el avatar se anime sin
perder velocidad, el archivo final debe ser un clip original y autocontenido, no un GIF ni un iframe
de un catálogo.

## Entrega para web

- `public/animaciones/lobo-kripta-v4.webm` — VP9, sin audio, 4 a 6 segundos, loop cerrado, 24 fps,
  máximo 2 MB.
- `public/animaciones/lobo-kripta-v4.mp4` — H.264, sin audio, mismo encuadre, máximo 3 MB; sólo
  como fallback para navegadores sin WebM.
- Mantener al lobo en el tercio derecho y dejar el 45 % izquierdo oscuro y limpio para el copy.
- Movimiento: respiración muy leve, mirada que recorre una vez, oreja o capa con movimiento corto;
  sin ataques, zoom violento, flashes ni texto.

## Integración prevista

El componente debe usar el elemento HTML `<video>` con `muted`, `playsInline`, `loop`, `preload="metadata"`
y `poster="/imagenes/hero-lobo-kripta-v4.webp"`. Debe servir la imagen estática cuando exista
`prefers-reduced-motion: reduce` o falle la reproducción. Ambos archivos se alojan localmente:
la CSP actual los admite sin abrir dominios externos ni agregar JavaScript.
