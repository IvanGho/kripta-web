# Kripta — identidad de producto V3

Dirección vigente desde el 11 de septiembre de 2026. Conserva la firma aportada por Monsterland:
lobo negro, verde eléctrico y tres cicatrices rojas. Cambia el tratamiento para que la web se lea
como un producto confiable y una comunidad real, no como un afiche genérico de gaming.

## Posicionamiento visual

La Kripta es un **club competitivo nocturno**. La web pública invita, informa y lleva a Discord;
el panel del staff prioriza decisiones, estados y velocidad. Comparten materiales y tokens, pero no
la misma intensidad: la web puede usar arte editorial; el panel usa el color con más contención.

El lobo no se repite como mascota en cada bloque. Se reconoce en el portal arquitectónico, la marca
y las tres cicatrices. Eso construye memoria sin transformar la interfaz en una pantalla de juego.

## Paleta semántica

| Rol | Token | Color | Uso |
| --- | --- | --- | --- |
| Base | `--fondo` | `#090B0F` | fondo de tinta |
| Superficie | `--panel` | `#121722` | tarjetas y controles |
| Elevación | `--panel-2` | `#19202B` | capas próximas y hover suave |
| Separador | `--borde` | `#293341` | estructura, nunca texto |
| Texto | `--texto` | `#F2F5F7` | lectura primaria |
| Texto secundario | `--tenue` | `#AEB8C5` | contexto y ayuda |
| Datos | `--jade` | `#74E2A0` | etiquetas técnicas y señales secundarias |
| Acción | `--acento` | `#B7F34A` | CTA principal, foco y avance |
| Alta luz | `--acento-2` | `#D8FF8C` | foco de teclado y jerarquía puntual |
| Correcto | `--ok` | `#75E5A4` | éxito confirmado |
| Atención | `--alerta` | `#F7CA70` | revisión necesaria |
| Error / cicatriz | `--grave` | `#FF6B7A` | error o firma física limitada |

Cada color tiene un significado único. El lima Volt no se usa en tarjetas decorativas, enlaces
inactivos o fondos enteros; conserva energía para una acción importante. El rojo no comunica éxito
ni "en vivo". Los estados siempre suman texto, forma o icono: el color no es la única señal.

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
