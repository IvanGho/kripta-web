# kripta-web

**Pase visual de septiembre de 2026:** la dirección vigente está en [IDENTIDAD.md](IDENTIDAD.md).
La portada usa las cinco escenas generadas de `IMAGENES.md`, optimizadas en `public/imagenes/`;
los PNG originales y los prompts enviados están en `assets/`. `node scripts/optimizar-imagenes.mjs`
reproduce las versiones web y el fondo de la imagen para compartir. Los estilos del portal viven
en `app/identidad.css`. El resto de este documento conserva también contexto de etapas anteriores.

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

### Acceso con Discord y Google

El acceso personal usa Auth.js y Postgres. Es independiente de las tablas operativas del panel:
si se usa la misma base, guarda sus cuatro tablas dentro del esquema `kripta_auth`.

1. Conectá una base Postgres al proyecto web y cargá su URL como `DATABASE_URL`.
2. Ejecutá una vez `npm run preparar-auth` con esa variable cargada. Sólo crea el esquema y tablas
   idempotentes de cuentas y sesiones; no toca torneos, jugadores ni caja del panel.
3. Generá `AUTH_SECRET` con `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   y cargalo como variable de entorno del proyecto web.
4. Creá una aplicación OAuth de Discord y una de Google. Cargá `AUTH_DISCORD_ID`,
   `AUTH_DISCORD_SECRET`, `AUTH_GOOGLE_ID` y `AUTH_GOOGLE_SECRET`.
5. En ambos proveedores declarás exactamente estas URL de retorno:

   ```text
   https://kripta.infinixapp.com/api/auth/callback/discord
   https://kripta.infinixapp.com/api/auth/callback/google
   ```

   En local, las equivalentes usan `http://localhost:3000`.

6. Hacé redeploy. Mientras falte la base, el secreto o al menos un proveedor, `/acceso` deja los
   botones apagados en lugar de simular una cuenta que no se puede guardar.

Discord se pide solamente con el alcance `identify`. Google se usa para identidad y no para leer el
calendario. Los tokens de ambos proveedores se descartan después de validar el acceso; la cuenta y
la sesión se pueden revocar. Las cuentas no se unen automáticamente por tener el mismo mail: el
enlace entre proveedores será una acción explícita desde una sesión ya iniciada.

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
2. **Campo de llaves** (`.llaves`): el mosaico es una celda de llave de torneo —dos partidos que
   entran, un conector, una rama que sale— repetida y desvanecida hacia los bordes. Reemplazó a una
   cuadrícula de 56px que daba superficie pero no decía nada del contenido.
3. **Grano** (`.grano`): ruido casi invisible sobre todo el sitio, embebido como SVG. Es lo que
   más rinde: un fondo oscuro plano se ve digital y barato, y el grano lo hace parecer material.
4. **Tarjetas** (`.tarjeta`): borde, luz interna arriba y sombra proyectada, que es lo que las
   despega del fondo.

### La dirección visual está escrita en el código

El encabezado de `app/globals.css` tiene la dirección completa: por qué se fue Poppins, por qué la
página entera es una llave de torneo, y el presupuesto de JavaScript. **Leerla antes de tocar el
diseño**, porque cada decisión tiene un motivo y varias contradicen lo que uno haría por defecto.

Lo esencial:

- **Tipografía: Archivo variable** para titulares y texto, y **IBM Plex Mono** para números y
  etiquetas. Los titulares usan el eje de ancho al máximo (`.titular`), lo que los hace leer como una
  inscripción tallada en lugar del titular de una startup. La mono no es cosmética: alinea las
  columnas de números del ranking, que en una proporcional se ven torcidas.
- **Estructura: la página es una llave de muchos a uno.** Los separadores entre secciones van
  convergiendo (4 ramas, 3, 2, y el nodo final antes del llamado a la acción), y el ritmo vertical se
  aprieta hacia el final. Bajar por la página es avanzar en el torneo.
- **Las insignias del podio se distinguen por forma**, no sólo por color: mismo hexágono con tres,
  dos o una marca adentro. Antes eran el mismo número con tres colores, que falla para quien no
  distingue el verde del ámbar y falla del todo en contraste forzado.
- **Movimiento sin librerías.** Las apariciones al scrollear son `animation-timeline: view()`, que es
  CSS puro; las brasas del hero son un canvas propio de unas cuarenta líneas. El pedido original traía
  Framer Motion, GSAP, tsparticles y Lottie, que medidos suman entre 130 y 180 KB comprimidos y
  duplicaban el JavaScript de la página.

**El presupuesto está verificado, no prometido:** el techo es 210 KB de JavaScript comprimido y
`verificar_navegador.py` lo mide en cada corrida. El pase visual completo no agregó nada medible.

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
  legal/
    privacidad/         qué datos se recolectan y cuáles no
    terminos/           cómo funcionan los torneos
    derechos/           cómo ejercer los derechos de la Ley 25.326
  componentes/          marca (logo SVG), cabecera, pie, contador, documento
  lib/                  datos, enlaces, sitio y medición
  anotador/             anotador de Truco
  sensibilidad/         convertidor de sensibilidad
scripts/
  verificar_navegador.py  la verificación en un navegador de verdad
```

### Cabeceras de seguridad

Van en `next.config.ts` y se aplican a todas las rutas: CSP, HSTS, `X-Frame-Options`,
`X-Content-Type-Options`, `Referrer-Policy` y `Permissions-Policy`, más `poweredByHeader: false`.

**No cambian nada de lo que se ve**, y por eso se pueden romper sin que nadie lo note: hay un
chequeo de cada una en `verificar_navegador.py`. Se verifican contra el sitio compilado, porque en
`next dev` no salen igual.

La única decisión discutible es `unsafe-inline` en `script-src`. El motivo largo está escrito en
`next.config.ts`: el CSP con nonce obliga a renderizado dinámico y con eso se pierde la generación
estática y el caché de CDN en las 15 rutas, que en una página que recibe tráfico pago se paga en
conversión. El `unsafe-inline` debilita la defensa contra XSS, y hoy este sitio no renderiza
contenido escrito por desconocidos, así que ese vector no existe. **Si algún día lo hace, hay que
revisar esa decisión**, y el camino de salida está anotado ahí.

La lista de CSP no nombra ningún dominio externo, y eso es una propiedad del sitio: la tipografía y
la analítica se sirven desde el mismo origen. Si alguien agrega un script de terceros, va a fallar
ahí y de forma visible. Es a propósito.

### Privacidad, términos y derechos

No son relleno legal: **una plataforma de anuncios no aprueba una campaña** hacia un dominio sin
política de privacidad alcanzable, y el sitio menciona inscripciones y mayoría de edad.

La regla al tocarlas es que **cada afirmación tiene que ser verificable en el código**. Una política
que promete más de lo que el sistema hace es peor que no tenerla, porque pasa de ser una protección a
ser una declaración falsa. Cada archivo tiene arriba la lista de dónde se comprueba cada cosa. Si el
sitio suma un formulario, esas páginas quedan desactualizadas y hay que tocarlas en el mismo cambio.

**Los plazos de `/legal/derechos` los fija la ley, no nosotros:** 10 días corridos para el acceso
(Ley 25.326 art. 14 inc. 2) y 5 días hábiles para rectificar, actualizar o suprimir (art. 16 inc. 2).
Anunciar un plazo más largo que el legal es anunciar que no se va a cumplir.

Esa página es un **canal, no un formulario**, y el motivo está escrito en el archivo: la ley pide un
reclamo identificable, un formulario obligaría a debilitar la afirmación más fuerte de la política de
privacidad, y sería la primera entrada de datos del sitio, de la que dependen la decisión de no tener
base ni sesiones y el `unsafe-inline` del CSP.

### Por qué no hay cartel de cookies

Porque **el sitio no usa cookies**, ni propias ni de terceros, y Vercel Web Analytics tampoco.
Un cartel pidiendo consentimiento donde no hay nada que consentir le dice al visitante algo que no es
cierto, y mete un modal delante de una página que recibe tráfico pago.

**Cambia el día que se agregue un píxel de publicidad.** Un píxel de Meta o de Google sí requiere
consentimiento previo, y en ese momento el cartel deja de ser opcional: hay que construirlo *antes*
del píxel, y el píxel no se carga hasta que la persona acepta. Ese es el orden correcto y no el
inverso.

Y no se usa vocabulario de apuestas, ni siquiera negado: la lista es la misma que audita
`monsterland-panel/src/discord/revisor.js`, y `verificar_navegador.py` la chequea sobre el texto
renderizado en cada corrida.

Las dos herramientas no son un adorno: son para traer tráfico de Google de gente que busca
"anotador de truco" o "convertir sensibilidad de Valorant a CS2" y todavía no conoce el servidor.
