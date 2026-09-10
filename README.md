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
| `NEXT_PUBLIC_URL_SITIO` | El dominio, para los links de compartir y el SEO. Ya viene por defecto en `https://kripta.infinixapp.com`, así que sólo hace falta si el dominio cambia. |
| `PANEL_API_URL` | La URL del panel, para mostrar el ranking y los torneos de verdad. Sin esto usa datos de ejemplo. |

Después de cargarlas hay que hacer **Redeploy**: las variables se leen al compilar.

### El dominio propio

El dominio es **`kripta.infinixapp.com`** y no hace falta ningún servidor propio: Vercel sirve
dominios propios de fábrica. En el proyecto, **Settings → Domains → Add**, se escribe el subdominio
y Vercel muestra el registro DNS que hay que crear en Spaceship (un `CNAME` apuntando a
`cname.vercel-dns.com`). El certificado HTTPS lo emite y lo renueva Vercel solo.

El panel se queda en su URL `.vercel.app`, **sin subdominio propio**, a propósito: `PANEL_API_URL`
se consume del lado del servidor y nunca llega al navegador de nadie.

### Analítica

El sitio incluye Vercel Web Analytics, que hay que **activar una vez** en el proyecto: pestaña
**Analytics → Enable**. Mide visitas y el evento `clic_discord`, que dice desde qué parte de la
página entró cada persona al Discord (ver `app/lib/medicion.ts`). Es el único instrumento que va a
decir si una campaña de anuncios sirvió.

No usa cookies, así que no hace falta cartel de consentimiento. Y el script se inyecta **sólo**
corriendo en Vercel: en local esa ruta no existe y pedirla daría 404 en cada carga.

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

En Windows, **`iniciar-kripta.bat`** hace lo mismo con doble clic: se para en la carpeta del repo,
levanta el servidor de desarrollo y deja la ventana abierta para que se pueda leer el error si algo
falla. Está versionado a propósito, porque el dueño del proyecto no programa y abrir una terminal
para escribir `npm run dev` es una barrera real y evitable. El panel tiene el equivalente en
`Iniciar-panel-ML.bat`.

### Verificar en un navegador de verdad

```bash
npm run dev                    # en otra terminal
npm run verificar-navegador
```

Cubre lo que `next build` y `eslint` no ven: errores de hidratación, que las dos herramientas
funcionen y recuerden, que el foco se vea al navegar con teclado, la estructura que necesita un
lector de pantalla, el SEO (canonical, sitemap, robots, imagen para compartir) y que las páginas
legales no usen vocabulario de apuestas.

Está en **Python** y no en Node a propósito: sumar Playwright como dependencia significa bajar un
navegador de cientos de megas a un repo cuyo stack son cuatro dependencias. Requiere una vez:

```bash
pip install playwright && python -m playwright install chromium
```

## Estructura

```
app/
  page.tsx              la landing completa
  layout.tsx            Poppins, metadatos, Open Graph y la analítica
  globals.css           paleta y las capas de profundidad
  not-found.tsx         el 404 propio, con la identidad del sitio
  error.tsx             la pantalla si falla el renderizado
  manifest.ts           PWA: se instala en el celular como app
  icon.svg              ícono
  privacidad/           qué datos se recolectan y cuáles no
  terminos/             cómo funcionan los torneos
  componentes/          marca (logo SVG), cabecera, pie, contador, documento
  lib/                  datos, enlaces, sitio y medición
  anotador/             anotador de Truco
  sensibilidad/         convertidor de sensibilidad
scripts/
  verificar_navegador.py  la verificación en un navegador de verdad
```

### Privacidad y términos

No son relleno legal: **una plataforma de anuncios no aprueba una campaña** hacia un dominio sin
política de privacidad alcanzable, y el sitio menciona inscripciones y mayoría de edad.

La regla al tocarlas es que **cada afirmación tiene que ser verificable en el código**. Una política
que promete más de lo que el sistema hace es peor que no tenerla, porque pasa de ser una protección a
ser una declaración falsa. Cada archivo tiene arriba la lista de dónde se comprueba cada cosa. Si el
sitio suma un formulario, esas páginas quedan desactualizadas y hay que tocarlas en el mismo cambio.

Y no se usa vocabulario de apuestas, ni siquiera negado: la lista es la misma que audita
`monsterland-panel/src/discord/revisor.js`, y `verificar_navegador.py` la chequea sobre el texto
renderizado en cada corrida.

Las dos herramientas no son un adorno: son para traer tráfico de Google de gente que busca
"anotador de truco" o "convertir sensibilidad de Valorant a CS2" y todavía no conoce el servidor.
