# Kripta — portal de la comunidad

Dirección V2 del 10 de septiembre de 2026. Referencias: lobo negro, verde eléctrico y cicatriz roja aportados por el dueño; jerarquía y acabado observados en plataformas de esports y SaaS, sin reproducir sus recursos.

La pieza distintiva es una entrada arquitectónica que toma las orejas y el hocico del lobo. La web invita a entrar; el panel usa el mismo mundo con menos protagonismo de la imagen para mantener legibles las tareas.

## Paleta

| Rol | Color |
| --- | --- |
| Obsidiana / fondo | `#050806` |
| Grafito / superficie | `#111813` |
| Superficie elevada | `#1a251d` |
| Borde | `#304335` |
| Texto principal | `#eff7eb` |
| Texto secundario | `#a6b5a8` |
| Jade técnico / datos | `#00c9a7` |
| Neón / acción | `#52f52b` |
| Alta luz | `#a3ff73` |
| Resuelto | `#69ed9a` |
| Atención | `#f2c76a` |
| Error / cicatriz | `#ff727c` |

Archivo conserva titulares y lectura en la web; IBM Plex Mono identifica datos. El jade organiza rótulos, líneas técnicas y puntos de datos; el neón se concentra en acciones y focos. La cicatriz roja aparece como firma puntual, nunca como alerta de rutina.

## Composición

```text
WEB    [ invitación + acción | portal del lobo ]
       [ juegos · horario · comunidad          ]
       [ comunidad | tres pasos               ]
       [ arena + torneos ] [ ranking ]
       [ herramientas ilustradas ] [ sumarse  ]
PANEL  [ navegación | cabecera del espacio    ]
       [            | atención y tareas      ]
       [            | métricas y tablas      ]
```

Las escenas son ilustraciones del universo de marca: no representan un local físico ni fotografías de miembros reales. No se usan como prueba social. Los datos de ejemplo siguen identificados.

## Movimiento y entrega

Entrada breve de la portada, respiración de luz, imágenes que se acercan sutilmente al enfocar tarjetas y transiciones de controles. Sin movimiento de filas o botones operativos. Todo respeta `prefers-reduced-motion`.

Generación con la herramienta integrada `imagegen`; base de los prompts: G1–G5 de IMAGENES.md. Los PNG originales V2 viven en assets/originales y sus derivados WebP en public/imagenes. Regenerar derivados con `node scripts/optimizar-imagenes.mjs`.
