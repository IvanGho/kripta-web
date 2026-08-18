# kripta-web

Sitio público de captación de **Monsterland / Kripta**. Su único objetivo es que el de afuera
termine entrando al Discord.

Es el segundo de los dos proyectos: la operación (torneos, pagos, ranking, caja) vive en
[`monsterland-panel`](https://github.com/IvanGho/monsterland-panel), que es privado.

## Cómo desplegarlo en Vercel

Importalo en [vercel.com/new](https://vercel.com/new) y dale **Deploy**. No hay nada que
configurar: Vercel reconoce Next.js solo. Se despliega y funciona con datos de ejemplo.

Después, en **Settings → Environment Variables**, sólo una es importante:

| Variable | Para qué |
|---|---|
| `NEXT_PUBLIC_URL_DISCORD` | El link de invitación. **Es la conversión del sitio**: sin esto el botón principal no lleva a ningún lado. Usá una invitación que **no expire**. |
| `NEXT_PUBLIC_URL_SITIO` | Tu dominio, para los links de compartir y el SEO. Ej: `https://monsterland.gg` |
| `PANEL_API_URL` | La URL del panel, para mostrar el ranking y los torneos de verdad. Sin esto usa datos de ejemplo. |

## Datos: por qué no lee la base directamente

El sitio **no** calcula reglas de negocio ni consulta Postgres. Le pide al panel un JSON ya
resuelto (ver `app/lib/datos.ts`).

El ranking, los puestos y las llaves son lógica de negocio y viven en el dominio del panel.
Si el sitio los recalculara habría dos implementaciones de la misma regla, y tarde o temprano
dirían cosas distintas: el panel mostraría un campeón y la web otro.

El panel ya expone esa ruta: **`GET {PANEL_API_URL}/publico/datos`** devuelve el tipo
`DatosPublicos` de `app/lib/datos.ts`. Alcanza con cargar `PANEL_API_URL` para que el sitio pase
de los datos de ejemplo a la temporada real.

Sin `PANEL_API_URL`, o si el panel no responde, el sitio cae en los datos de ejemplo en lugar de
mostrar un error: una caída del panel no puede tirar abajo la página de captación.

Cuando lo que se muestra son datos de ejemplo, el sitio lo dice (la pastilla del hero pasa de
"en vivo" a "vista previa" y el ranking aclara que los nombres son de muestra). El panel manda
ese dato en `esEjemplo`, y es `true` cuando el panel corre en modo demo. **Si cambia el shape de
un lado hay que cambiarlo del otro**: son dos repos y no hay nada que los sincronice solo.

## Cómo se logra que no se vea plano

Sin una sola imagen, porque todavía no hay assets del logo definitivo. Son cuatro capas, todas
en `app/globals.css`:

1. **Resplandores** (`.resplandor`): manchas de verde desenfocadas detrás del contenido.
2. **Grilla** (`.grilla`): una cuadrícula muy tenue que se desvanece en los bordes, para que
   dé sensación de superficie y no de vacío.
3. **Grano** (`.grano`): ruido casi invisible sobre todo el sitio, embebido como SVG. Es lo que
   más rinde: un fondo oscuro plano se ve digital y barato, y el grano lo hace parecer material.
4. **Tarjetas** (`.tarjeta`): borde, luz interna arriba y sombra proyectada, que es lo que las
   despega del fondo.

Más tipografía grande (Poppins 800 en mayúsculas) y el verde del logo como acento.

## El logo

`app/componentes/marca.tsx` tiene un lobo geométrico **escrito en SVG a mano**. Es un vector de
verdad: se ve nítido en cualquier tamaño y pesa menos de 1 KB.

Cuando esté el logo definitivo del servidor, se reemplaza **sólo ese archivo** y cambia en todo
el sitio, incluido el ícono de la app.

## Paleta

Los mismos tokens que el panel, en `app/globals.css`. Si cambia uno, cambia en los dos lados.

## Correrlo local

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # como lo compila Vercel
```

## Estructura

```
app/
  page.tsx              la landing completa
  layout.tsx            Poppins, metadatos y Open Graph
  globals.css           paleta y las capas de profundidad
  manifest.ts           PWA: se instala en el celular como app
  icon.svg              ícono
  componentes/          marca (logo SVG), cabecera, pie, contador
  lib/                  datos y enlaces
  anotador/             anotador de Truco
  sensibilidad/         convertidor de sensibilidad
```

Las dos herramientas no son un adorno: son para traer tráfico de Google de gente que busca
"anotador de truco" o "convertir sensibilidad de Valorant a CS2" y todavía no conoce el servidor.
