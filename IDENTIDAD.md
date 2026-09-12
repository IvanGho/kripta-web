# Kripta — identidad de producto V4

Dirección vigente desde el 11 de septiembre de 2026. Conserva la firma aportada por Monsterland:
lobo oscuro, verde espectral y tres cicatrices rojas apagadas. La web se lee como un producto
confiable y una comunidad real, no como un afiche genérico de gaming.

## Posicionamiento visual

La Kripta es una **plataforma competitiva y social**. La web pública invita, informa y lleva a
Discord; el panel del staff prioriza decisiones, estados y velocidad. Comparten materiales y tokens,
pero no la misma intensidad: la web puede usar arte editorial; el panel usa el color con más
contención.

El lobo no se repite como mascota en cada bloque. Se reconoce en el avatar original del hero, la
marca y las tres cicatrices. Eso construye memoria sin transformar la interfaz en una pantalla de
juego.

## Paleta semántica

| Rol | Token | Color | Uso |
| --- | --- | --- | --- |
| Base | `--fondo` | `#090C0A` | fondo de basalto |
| Superficie | `--panel` | `#141C17` | tarjetas y controles |
| Elevación | `--panel-2` | `#1A241E` | capas próximas y hover suave |
| Separador | `--borde` | `#29352E` | estructura, nunca texto |
| Texto | `--texto` | `#F3F6F1` | lectura primaria |
| Texto secundario | `--tenue` | `#A9B5AD` | contexto y ayuda |
| Marca / dato | `--jade` | `#5DFF86` | señal de marca y datos secundarios |
| Acción | `--acento` | `#7CFF4F` | CTA principal, foco y avance |
| Alta luz | `--acento-2` | `#A0FF78` | hover y jerarquía puntual |
| Correcto | `--ok` | `#5DFF86` | éxito confirmado |
| Atención | `--alerta` | `#D6A94D` | revisión necesaria |
| Error / cicatriz | `--grave` | `#E05A68` | error o firma física limitada |

Cada color tiene un significado único. El verde de acción no se usa en tarjetas decorativas, enlaces
inactivos o fondos enteros; conserva energía para una acción importante. El rojo no comunica éxito
ni "en vivo". Los estados siempre suman texto, forma o icono: el color no es la única señal. Los
componentes también tienen equivalentes light mode con los mismos tokens semánticos.

## Tipografía y superficie

Archivo en pesos altos y ancho expandido se usa para titulares. Archivo normal sirve para lectura.
IBM Plex Mono identifica números, métricas y etiquetas cortas. Las capas oscuras se distinguen por
elevación y borde, no por llenar cada bloque con un color nuevo.

Los fondos de imagen conservan una zona tranquila para HTML. El texto nunca se incrusta en una imagen.
Las luces son líneas físicas, no halos que afecten toda la página.

## Movimiento

Entradas breves, transiciones de control y acercamiento mínimo de una imagen al enfocar una tarjeta.
No animar datos, filas ni acciones operativas. Todo respeta `prefers-reduced-motion` y la página debe
permanecer comprensible si no se ejecuta una animación.

## Producción

Los prompts y los activos pertenecen a [IMAGENES.md](IMAGENES.md). Los PNG maestros V3 están en
`assets/originales/`, los WebP de entrega en `public/imagenes/`, y
`node scripts/optimizar-imagenes.mjs` crea sus derivados. Al rediseñar el panel, estos tokens se
adoptan primero allí para mantener coherencia sin sacrificar densidad de datos.
