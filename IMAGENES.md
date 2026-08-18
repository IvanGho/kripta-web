# Imágenes del sitio: qué hace falta y cómo pedirlas

El sitio no tiene ninguna imagen: todo lo que se ve es tipografía y CSS (las cuatro capas de
profundidad que están explicadas en el README). Funciona, pero es lo único que lo separa de una
referencia como `trucochon.com`, que apoya todo en imaginería.

Este documento tiene los prompts para generar esas imágenes con ChatGPT. **Están escritos para
copiar y pegar tal cual**, con la paleta de Kripta metida adentro para que no salgan genéricas.

## Antes de empezar: tres cosas que arruinan el resultado

1. **Nunca pedir texto.** Los generadores de imágenes escriben mal, y peor en español. Todos los
   prompts dicen explícitamente "sin texto". Los títulos los pone el sitio con tipografía real,
   que además se puede leer, traducir e indexar en Google.
2. **Nunca pedir logos de juegos.** "Logo de Valorant" o "de CS2" son marcas registradas de Riot y
   Valve. Los prompts piden objetos genéricos (una mira, un casco táctico) en lugar de marcas.
3. **Pedir siempre el fondo negro liso `#050806`.** Es exactamente el fondo del sitio, así que la
   imagen se integra sin necesidad de recortar nada. Un fondo blanco o con degradado obliga a
   recortar y casi siempre se ve el borde.

## El mensaje de contexto (pegar una sola vez, al principio del chat)

```
Vas a ayudarme a generar imágenes para el sitio de una comunidad argentina de gaming
llamada Monsterland, cuya identidad visual se llama "Kripta": lobo verde neón sobre
negro. La comunidad juega Valorant, CS y Truco.

Reglas fijas para TODAS las imágenes que te pida:

- Paleta estricta: fondo negro verdoso muy oscuro #050806; verde #2fc94f y verde neón
  brillante #5dff86 para las luces, los filos y los detalles. Nada de azul, celeste,
  violeta, rojo ni naranja. Si dudás, más verde y más oscuro.
- Estética nocturna, oscura, tipo esports, con luz neón verde. Elegante, filosa y de
  alto contraste. Nada infantil ni caricaturesco.
- SIN NINGÚN TEXTO: ni letras, ni números, ni palabras, ni firmas, ni marcas de agua.
  El texto lo agrego yo después con tipografía real.
- Sin logos, personajes ni elementos de juegos o marcas que existan.
- Fondo negro liso y parejo (#050806), sin degradado fuerte ni viñeta, porque es el
  mismo fondo de mi sitio y necesito que se integre.
- PNG, en la máxima resolución y calidad que puedas.

Te voy a pedir las imágenes de a una. Confirmame que entendiste y esperá el primer pedido.
```

---

## 1. Imagen del hero — **la más importante**

Es la pieza que reemplaza al abanico de cartas de trucochon. Va arriba, es lo primero que se ve.

Guardala como **`hero-cartas.png`**

```
Imagen horizontal, relación 3:2, la más grande que puedas.

Cuatro cartas de baraja española de truco desplegadas en abanico, flotando en el aire,
inclinadas en perspectiva, vistas de frente y un poco desde abajo. Los cuatro palos:
espada, bastón, moneda y copa.

Las cartas son oscuras: el cuerpo es negro y los símbolos y las orlas están dibujados en
verde neón brillante que emite luz propia, como si fueran de vidrio iluminado por dentro.
Cada carta tiene un filo de luz verde en el borde. Debajo del abanico hay un resplandor
verde intenso que las ilumina desde abajo y se difumina hacia los costados.

Fondo negro verdoso liso (#050806), con humo o niebla muy tenue apenas visible cerca de
la base. Composición centrada, con aire libre alrededor del abanico.

Estilo: render 3D realista, alto contraste, brillo neón, cinematográfico.

Muy importante: las cartas NO llevan ningún número, letra ni texto. Sólo los símbolos de
los palos: la espada, el bastón, la moneda y la copa.
```

## 2. Imagen para compartir el link (open graph)

Es lo que se ve cuando pegás el link del sitio en Discord o WhatsApp. **Hoy no existe, así que el
link aparece pelado.** Como tu canal principal es Discord, esta imagen rinde muchísimo.

Guardala como **`compartir.png`**

```
Imagen horizontal, relación 3:2.

Portada para un sitio de torneos de gaming. En el centro-izquierda, la cabeza de un lobo
estilizado y geométrico, de perfil tres cuartos, formada por planos angulares, hecha de
luz verde neón (#5dff86) sobre negro, con los ojos brillando con luz propia. A la derecha,
tres o cuatro cartas de baraja española flotando en abanico, oscuras, con los símbolos de
los palos en verde luminoso.

Fondo negro verdoso liso (#050806), con un resplandor verde difuso detrás del lobo y una
grilla de líneas verdes finas muy tenue, apenas perceptible.

Dejá la franja inferior de la imagen más despejada y oscura, con espacio vacío, porque ahí
voy a escribir un título encima.

Estilo: emblema de esports, oscuro, neón, alto contraste, cinematográfico.

Sin texto, sin letras, sin números, sin logos.
```

## 3. Patrón de fondo repetible

Una textura muy tenue que se repite en mosaico. Es lo que le saca lo plano al fondo sin competir
con el contenido: trucochon usa una igual con cartas.

Guardala como **`patron-fondo.png`**

```
Imagen cuadrada. Patrón repetible sin costuras (seamless tileable pattern).

Los cuatro símbolos de la baraja española —espada, bastón, moneda y copa— distribuidos de
forma regular y bien espaciada, dibujados con líneas finas en verde (#2fc94f) sobre fondo
negro verdoso (#050806).

Extremadamente sutil y de bajo contraste: los símbolos casi se pierden en el fondo, como
una marca de agua o un empapelado oscuro. Que sean chicos y que haya mucho espacio negro
entre uno y otro.

Estilo plano y minimalista, sólo líneas finas, sin volumen, sin sombras, sin brillo.

Tiene que poder repetirse en mosaico sin que se noten los bordes ni las uniones.
Sin texto ni números.
```

## 4. El lobo de Kripta

**Salteala si ya tenés el logo del servidor.** Hoy hay un lobo provisorio dibujado a mano en SVG
(`app/componentes/marca.tsx`) que funciona bien; si conseguís el definitivo, se reemplaza sólo ese
archivo.

Guardala como **`lobo.png`**

```
Imagen cuadrada.

Emblema de una cabeza de lobo estilizada y geométrica, de frente, con las orejas en punta
hacia arriba, construida con planos angulares y facetas, estilo low poly. Hecha de verde
neón brillante (#5dff86) con degradado hacia un verde más oscuro (#2fc94f), sobre fondo
negro verdoso liso (#050806).

Los ojos son dos cuñas afiladas e inclinadas que brillan con luz propia. El contorno emite
un resplandor verde suave.

Aspecto de logo de equipo de esports: simétrico, limpio, de formas simples y decididas,
que se siga entendiendo en tamaño chico.

Centrado, con margen libre alrededor. Sin texto, sin letras, sin marco, sin fondo con
degradado.
```

## 5. Las tres insignias de rango — **tres en una sola imagen**

Panteón, Guardianes y Combatientes. Van las tres juntas en una imagen y después las recorto: así
gastás **una** generación en lugar de tres, que con el plan gratis importa.

Guardala como **`rangos.png`**

```
Imagen horizontal, relación 3:2. Una sola imagen con tres insignias alineadas en fila,
cada una centrada en su tercio, todas del mismo tamaño, del mismo estilo y bien separadas
entre sí.

Son insignias circulares de rango para una comunidad de gaming, de metal oscuro con
detalles y filos de luz verde neón, sobre fondo negro verdoso liso (#050806):

- Izquierda, la más simple: un círculo con un colmillo apuntando hacia arriba, con luz
  verde tenue y poco detalle.
- Centro, intermedia: un círculo con un escudo y dos colmillos cruzados, más detalle y
  más brillo.
- Derecha, la más imponente: un círculo con una corona de puntas sobre una cabeza de lobo,
  con mucho brillo verde y rayos de luz saliendo del borde.

Estilo: iconos de rango de videojuego, render 3D, metal oscuro con neón verde, alto
contraste. Las tres tienen que leerse claramente como una progresión de menor a mayor
jerarquía.

Sin texto, sin números, sin letras.
```

## 6. Los íconos de las dos herramientas — **dos en una sola imagen**

Para las tarjetas del anotador de Truco y del convertidor de sensibilidad.

Guardala como **`herramientas.png`**

```
Imagen horizontal, relación 2:1. Una sola imagen dividida en dos mitades, con un objeto
centrado en cada mitad, los dos del mismo tamaño y el mismo estilo.

Fondo negro verdoso liso (#050806) en las dos mitades. Los objetos son oscuros y están
iluminados por luz verde neón (#5dff86 y #2fc94f).

- Mitad izquierda: cinco fósforos de madera apoyados sobre una superficie oscura, puestos
  formando un cuadrado con una diagonal que lo cruza, como se anotan los puntos en el
  truco. Las cabezas de los fósforos brillan en verde.
- Mitad derecha: un mouse de computadora visto en perspectiva de tres cuartos, oscuro, con
  una franja de luz verde encendida, y flotando detrás una mira de puntería circular de
  líneas finas y luminosas.

Estilo: render 3D limpio y minimalista, objetos oscuros sobre negro iluminados por neón
verde, alto contraste.

Sin texto, sin números, sin marcas.
```

## 7. Marco para la foto de los campeones (opcional)

Hoy las cuatro tarjetas del salón de campeones muestran el mismo lobo como avatar. Con este marco,
cada campeón puede llevar su foto de perfil de Discord adentro.

Guardala como **`marco-campeon.png`**

```
Imagen cuadrada.

Un marco circular ornamentado y VACÍO, para poner adentro la foto de perfil de un jugador.
El marco es de metal oscuro con filos de luz verde neón (#5dff86), con dos colmillos chicos
enfrentados en la parte de abajo y una punta de corona en la parte de arriba.

El interior del círculo está completamente vacío, de un negro plano y parejo (#050806), sin
absolutamente nada dibujado adentro: ni cara, ni personaje, ni figura, ni textura.

El fondo alrededor del marco también es negro verdoso liso. Centrado y simétrico, con
margen libre.

Estilo: marco de avatar de videojuego, render 3D, alto contraste.
Sin texto, sin letras, sin números.
```

---

## En qué orden generarlas

Con el plan gratis alcanzan pocas imágenes por día, así que conviene ir por las que más rinden:

| Orden | Imagen | Por qué primero |
|---|---|---|
| 1 | **1. Hero** | Es la que cambia la cara del sitio y la que se compara con trucochon |
| 2 | **2. Compartir** | Hoy los links en Discord se ven pelados. Es tu canal principal |
| 3 | **3. Patrón** | Barata de integrar y le da textura a todas las páginas de una |
| 4 | **5. Rangos** | Tres piezas por una sola generación |
| 5 | **6. Herramientas** | Dos piezas por una sola generación |
| 6 | **4. Lobo** | Salteala si ya tenés el logo del servidor |
| 7 | **7. Marco** | Sólo si vamos a traer los avatares de Discord |

## Si sale mal

Los generadores fallan siempre de las mismas maneras. Pedile la corrección en el mismo chat, sin
volver a escribir el prompt entero:

| Qué pasó | Qué pedirle |
|---|---|
| Salió con letras o números | `Quitá todo el texto, las letras y los números. Que no haya ninguna palabra en la imagen.` |
| El verde salió azulado o celeste | `El verde está tirando a azul. Usá exactamente #2fc94f y #5dff86, un verde puro y brillante.` |
| Quedó gris, apagado o lavado | `Más oscuro y con más contraste: el fondo tiene que ser casi negro y el verde tiene que brillar mucho más.` |
| El fondo no es negro | `El fondo tiene que ser negro verdoso liso #050806, parejo, sin degradado ni viñeta.` |
| Quedó cargado o confuso | `Simplificá: menos elementos, más espacio vacío alrededor, composición más limpia.` |
| Las cartas tienen números | `Las cartas no llevan ningún número ni letra: sólo el símbolo del palo.` |

Si una imagen queda casi bien, pedile `generá tres variantes de esta misma imagen` y elegís.

## Cuando las tengas

Mandámelas con el nombre de archivo de cada una y yo me encargo de:

- Recortarlas a las medidas exactas que necesita cada lugar del sitio.
- Convertirlas a WebP y AVIF, que pesan mucho menos sin perder calidad visible. Importa: buena
  parte de tu comunidad entra desde el celular con datos.
- Servirlas con `next/image`, que genera los tamaños para cada pantalla y evita que el texto salte
  mientras la imagen carga.
- Integrarlas en el sitio y mostrarte una captura de cómo quedó antes de mergear nada.

No hace falta que estén todas: en cuanto tengas la del hero ya se puede ver el cambio.
