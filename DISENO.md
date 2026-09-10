# Cómo trabajar el diseño con el agente

Este documento existe porque el primer pase visual salió por debajo de lo esperado, y la causa
principal fue de proceso, no de capacidad: **el agente nunca vio las referencias.** Se le pasaron
links de Dribbble, y Dribbble sirve las imágenes detrás de una página que el agente no puede leer.
Trabajó sobre las palabras del pedido ("oscuro, partículas, glow neón, animaciones fluidas"), que es
la descripción de un estilo genérico.

Acá está qué darle, cómo, y qué esperar de vuelta.

---

## 1. Referencias visuales: dejalas en `referencias/`

Es lo que más cambia el resultado, y es gratis.

**Cómo:** entrá a la referencia, sacale una captura de pantalla (o descargá la imagen) y guardala en
la carpeta `referencias/` de este repo. Nombres descriptivos: `eplay-hero.png`,
`chumbi-scroll.png`, `k8-mobile-cards.png`.

**Por qué así y no con el link:** el agente **sí puede mirar imágenes** que estén en el disco. No
puede abrir Dribbble. La diferencia entre las dos cosas es la diferencia entre copiar decisiones
concretas —la escala tipográfica, cómo está construido el glow, cuántas capas tiene el fondo, el
ritmo de los espacios— y adivinar a partir de un adjetivo.

**`referencias/` está en `.gitignore` a propósito.** Son trabajos con derechos de autor de otras
personas y este repositorio es público: sirven para mirar, no para redistribuir.

Con dos o tres referencias buenas alcanza. Y decí de cada una **qué te gustó**: no es lo mismo
"me gusta el hero de esta" que "me gusta cómo se mueve el fondo de esta".

---

## 2. Video y animación: sí, CapCut sirve

Un video de fondo en el hero es la forma más rápida de que la página deje de verse estática, y es
algo que el agente no puede generar pero sí puede integrar bien.

**Dejá los archivos en `public/video/`.** Esos sí se versionan.

### Cómo exportarlo desde CapCut

| Qué | Valor | Por qué |
|---|---|---|
| Resolución | **1920x1080** máximo | Se sirve escalado. Más que eso son megas que nadie ve. |
| Duración | **6 a 10 segundos**, en loop | Un fondo se repite. Más largo es peso muerto. |
| Formato | **MP4 (H.264)** y si podés también **WebM (VP9)** | El navegador elige el más liviano que soporta. |
| Sin audio | Quitá la pista | Un fondo no suena, y el audio pesa. |
| Peso objetivo | **menos de 1,5 MB** | Es el número que importa. Si sale más, bajá la duración antes que la calidad. |

También exportá **un fotograma como imagen** (`hero-poster.jpg`), que es lo que se ve mientras el
video carga y lo que ve quien pidió menos movimiento.

**Qué hace el agente con eso:** lo monta con `muted`, `autoplay`, `loop`, `playsinline` y `poster`,
lo apaga con `prefers-reduced-motion`, y lo deja detrás del texto con el contraste medido. Sin eso
último un video de fondo vuelve ilegible el titular en la mitad de los fotogramas.

### Sobre Lottie

Se puede, pero conviene saber el costo: la librería que reproduce Lottie pesa unos 65 KB
comprimidos, que es más que todo el JavaScript que agregó el pase visual completo. Para un ícono que
se mueve, un SVG animado con CSS cuesta 0 KB y lo puede escribir el agente. Para algo complejo de
verdad, Lottie vale la pena; para un adorno, no.

---

## 3. Imágenes generadas: los cinco prompts ya están escritos

`IMAGENES.md` tiene la dirección de arte completa y los cinco prompts para GPT Image, con el método
para que salgan coherentes entre sí (generar la maestra primero, y adjuntarla en cada una de las
siguientes). El agente no puede generar imágenes; esos cinco archivos son tarea tuya.

Dejalos en `public/imagenes/` con los nombres que indica ese documento.

**La más importante es la primera** (`hero-kripta.png`). Con esa sola el hero se puede rehacer
alrededor de una imagen en lugar de sólo tipografía.

---

## 4. El proceso que conviene usar de acá en adelante

Lo que falló no fue la falta de herramientas, fue iterar una vez y mostrar el resultado. Un
diseñador prueba diez variantes antes de elegir.

**La propuesta: un laboratorio de variantes.** El agente arma una ruta interna —no indexada, sólo
para desarrollo— con tres o cuatro versiones distintas del hero lado a lado, saca capturas de las
tres y vos elegís. Después se itera sobre la elegida.

Es mucho más rápido que describir con palabras qué te gustaría, y evita justamente lo que pasó: que
el agente entregue una interpretación y recién ahí se descubra que no era eso.

---

## 5. Lo que el agente puede y no puede hacer

**Puede:**

- Mirar imágenes que estén en el disco y extraer decisiones concretas de ellas.
- Escribir SVG, CSS y canvas a mano: patrones, emblemas, insignias, partículas, degradados.
- Animar con CSS, incluido movimiento atado al scroll sin una línea de JavaScript.
- Integrar video, imágenes y Lottie que le dejes en `public/`.
- Sacar capturas con un navegador de verdad y mirarlas para corregirse.
- Medir lo que promete: contraste, peso del JavaScript, desbordes, área táctil.

**No puede:**

- Generar imágenes ni video. Nada de fotos, ilustraciones ni renders.
- Abrir Dribbble, Behance ni Instagram: sirven las imágenes detrás de páginas que no puede leer.
- Ver la página como la ves vos. Ve capturas, que es parecido pero no igual: el movimiento y la
  sensación de fluidez hay que probarlos en el navegador.

**Sobre "que sea como Lovable":** Lovable produce rápido un look reconocible porque tiene un sistema
de plantillas muy opinado detrás. No es mejor diseñando; es más rápido llegando a *ese* aspecto. Y
ese aspecto es justamente el que este proyecto quiere evitar, porque la identidad tiene que ser de
Monsterland y no de una plantilla.

---

## 6. El presupuesto no es negociable en silencio

Cualquier cosa que se agregue pasa por el techo declarado: **210 KB de JavaScript comprimido**, que
`scripts/verificar_navegador.py` mide en cada corrida. Hoy la portada usa 156 KB.

Eso no es una manía de rendimiento: la página recibe tráfico pago desde teléfonos en Argentina, y
cada segundo de carga se paga en visitas que se van antes de ver el botón. Si algo vale más que el
peso que cuesta, se sube el techo **a conciencia y anotando qué se ganó**. Lo que no se hace es
sumar librerías sin mirar el número.
