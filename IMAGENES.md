# Dirección de arte y prompts para GPT Image

Este documento no es una lista de “imágenes lindas”. Es un plan para construir una **familia visual
coherente** para Monsterland / Kripta y llevarla después al sitio sin perder calidad, legibilidad ni
rendimiento.

## 1. La decisión visual

### Qué es la Kripta

La Kripta es un **santuario gamer subterráneo moderno**: un punto de encuentro nocturno construido
en basalto negro, metal oscuro y vidrio ahumado, atravesado por líneas de energía verde. Combina la
solidez de una arquitectura monumental con la comodidad de un club de esports.

No es una cripta medieval. No es un cementerio. No es una mazmorra. No es un escenario de terror.
Tampoco es el cyberpunk genérico lleno de carteles, cables y luces de todos los colores.

La sensación debe ser:

- “Este lugar tiene identidad propia”.
- “Acá se compite en serio, pero también puedo quedarme con amigos”.
- “Es nocturno y misterioso, pero seguro y acogedor”.
- “Pertenezco a una comunidad, no estoy entrando a un casino ni a una página de apuestas”.

### Lenguaje material

- Basalto negro, piedra volcánica de cortes limpios y metal grafito cepillado.
- Vidrio ahumado y superficies mate; muy pocos reflejos pulidos.
- Luz integrada en ranuras arquitectónicas, nunca tubos de neón flotando sin sentido.
- Verde principal `#2fc94f` y verde de alta luz `#5dff86`.
- Fondo negro verdoso `#050806`.
- Geometría angular inspirada en colmillos y orejas de lobo, sin repetir lobos literales en todos lados.
- Una marca abstracta de tres cortes diagonales puede aparecer en la arquitectura como motivo propio.

### Qué NO debe aparecer

- Calaveras, huesos, cruces, tumbas, sangre, cadenas, telarañas, velas o símbolos religiosos.
- Castillos medievales, gótico ornamental, runas mágicas o fantasía demoníaca.
- Ciudad cyberpunk, lluvia, callejones, carteles luminosos o luces azules/violetas.
- Casinos, fichas, ruletas, dinero, apuestas o premios representados como efectivo.
- Logos de juegos, marcas comerciales, armas protagonistas ni personajes reconocibles.
- Texto generado dentro de la imagen.

---

## 2. Método de trabajo: una imagen maestra primero

**No generar todo en una tanda.** Incluso si ChatGPT lo permite, las imágenes salen con estilos,
materiales y tonos distintos. La coherencia profesional se obtiene así:

1. Generar únicamente **G1 — Hero / imagen maestra**.
2. Evaluarla con la lista de control de este documento.
3. Corregirla en el mismo chat hasta aprobarla.
4. Descargar el PNG original, sin captura de pantalla ni compresión adicional.
5. Para cada imagen siguiente, **adjuntar nuevamente la G1 aprobada** y pegar primero el bloque
   “Continuidad obligatoria”.
6. Generar una imagen por mensaje.
7. Si una generación sale mal, corregir esa misma imagen; no iniciar otra conversación desde cero.

La G1 es al mismo tiempo una imagen utilizable en el hero y la **biblia visual** del resto del sitio.

### Continuidad obligatoria para G2–G5

Pegar esto antes del prompt de cada imagen posterior y adjuntar la G1 aprobada:

```text
Usá la imagen adjunta como referencia visual obligatoria para construir otra escena del MISMO
lugar y del MISMO universo. No copies su composición; copiá con precisión su dirección de arte:
la arquitectura, el basalto negro, el metal grafito, la forma de las ranuras de luz verde, la
paleta, el nivel de realismo, la iluminación, la atmósfera y el tratamiento cinematográfico.

La nueva imagen debe parecer fotografiada dentro del mismo complejo subterráneo, por el mismo
equipo creativo y con la misma cámara. No cambies a fantasía medieval, terror, cyberpunk urbano,
ilustración, dibujo animado ni otro color de iluminación.
```

---

# 3. Imágenes que SÍ se generan con GPT Image

Sólo cinco. Son escenas donde el generador aporta volumen, atmósfera y acabado cinematográfico.

## G1 — Hero e imagen maestra: “La entrada”

**Nombre:** `hero-kripta.png`
**Prioridad:** imprescindible
**Formato solicitado:** horizontal 3:2, máxima resolución disponible
**Uso:** hero de escritorio; también será la referencia visual de todas las demás imágenes

### Prompt

```text
Creá una imagen de key art premium para el hero de un sitio web de una comunidad argentina de
gaming y torneos llamada Monsterland. El concepto visual se llama “la Kripta”. No incluyas el
nombre ni ningún texto dentro de la imagen.

ESCENA
Un santuario gamer subterráneo moderno excavado en basalto negro. No es una cripta medieval ni
un cementerio: es una arquitectura contemporánea, monumental y habitable. A la derecha de la
escena hay un gran portal angular construido con bloques de piedra volcánica negra y metal
grafito. El portal conduce a una sala de esports cálida y activa, visible parcialmente al fondo:
mesas oscuras, varias estaciones de juego y pequeños puntos de luz verde, sin interfaces legibles.
No hay personas visibles en primer plano.

La estructura del portal sugiere sutilmente la cabeza de un lobo mediante dos planos superiores
que recuerdan orejas y una abertura central en forma de hocico, pero NO debe ser una estatua ni
un lobo literal. En una pared aparece, tallado muy discretamente, un motivo abstracto de tres
cortes diagonales como marca recurrente del lugar.

MATERIALES Y COLOR
Basalto negro mate de grano fino, piedra volcánica de cortes limpios, metal grafito cepillado y
vidrio ahumado. Ranuras delgadas integradas en la arquitectura emiten luz verde #2fc94f; sólo los
puntos de máxima intensidad llegan a #5dff86. Fondo y sombras con dominante negro verdoso
#050806. El verde es la única luz de color. No usar azul, cian, turquesa, violeta, rojo ni naranja.

ILUMINACIÓN Y ATMÓSFERA
Iluminación cinematográfica realista y controlada: luz verde indirecta rebotando sobre piedra
negra, niebla atmosférica muy sutil únicamente cerca del suelo, sombras profundas pero con detalle
en los materiales. La luz que sale de la sala interior debe sentirse acogedora y generar curiosidad:
“quiero entrar y ver qué hay”, nunca miedo.

COMPOSICIÓN PARA WEB — MUY IMPORTANTE
Lienzo horizontal 3:2. La arquitectura y el foco visual principal ocupan el 55% derecho. El 42%
izquierdo debe quedar deliberadamente oscuro, limpio y con poco detalle para colocar encima un
título grande y dos botones sin perder legibilidad. No pongas objetos importantes en el borde.
El portal debe seguir entendiéndose si luego recorto la imagen a 16:9. El centro geométrico no debe
estar saturado, porque en teléfonos el recorte será más estrecho.

CÁMARA Y ACABADO
Vista a la altura de los ojos, lente cinematográfica equivalente a 28–35 mm, perspectiva natural,
profundidad realista, materiales físicamente plausibles, render 3D fotorrealista de calidad AAA,
acabado editorial premium, detalle nítido sin sobreenfoque. No ilustración, no concept sketch, no
low-poly visible, no caricatura.

EXCLUSIONES OBLIGATORIAS
Sin texto, letras, números, carteles, marcas de agua ni logotipos. Sin cartas de truco. Sin armas
como objeto principal. Sin calaveras, tumbas, velas, cadenas, sangre, telarañas, símbolos religiosos,
runas mágicas ni decoración gótica. Sin ciudad cyberpunk, lluvia, callejón ni exceso de cables.
Sin luz azul o violeta. Sin estética de casino, apuestas o dinero.
```

### Qué aprobar antes de seguir

- Se siente como **un club gamer subterráneo**, no como una tumba.
- La mitad izquierda permite leer texto blanco sin tapar nada importante.
- El verde es puro y controlado; no se volvió turquesa.
- El portal tiene personalidad propia sin ser un lobo gigante literal.
- Hay profundidad y materiales creíbles, no una ilustración fantástica genérica.
- Da curiosidad y comodidad, no miedo.

Si falla alguno, no generar G2: corregir G1 primero.

---

## G2 — Comunidad: “La mesa de la Kripta”

**Nombre:** `comunidad-kripta.png`
**Formato:** horizontal 3:2
**Uso:** sección “Cómo funciona” o presentación de la comunidad
**Requisito:** adjuntar G1 aprobada + bloque de continuidad

### Prompt

```text
Creá una escena horizontal 3:2 dentro del mismo santuario gamer subterráneo de la imagen de
referencia.

ESCENA
Una mesa comunitaria amplia de basalto negro y metal grafito, ubicada en una sala cómoda de la
Kripta. Alrededor hay cuatro gamers adultos compartiendo una sesión nocturna; se ven únicamente
de espaldas o en silueta de tres cuartos, sin rostros identificables y sin que una persona sea la
“estrella”. La imagen debe comunicar grupo, pertenencia y colaboración, no aislamiento.

Sobre la mesa hay periféricos oscuros de diseño limpio: monitores delgados, teclados y auriculares.
Las pantallas muestran solamente formas abstractas verdes desenfocadas, sin interfaces, texto,
logos ni videojuegos reconocibles. En el fondo hay bancos acolchados oscuros, una pequeña zona de
descanso y el portal angular característico de la Kripta. Todo debe verse ordenado, cuidado y
habitable, no como un sótano abandonado.

COMPOSICIÓN
El grupo y la mesa ocupan el centro-derecha. Dejá aire oscuro alrededor, especialmente en la parte
superior izquierda, para que la escena respire y pueda convivir con contenido web. Plano general
íntimo a la altura de los ojos, lente equivalente a 35 mm. No primer plano de personas.

INTENCIÓN EMOCIONAL
Una comunidad argentina que se reúne de noche para competir, conversar y quedarse. Energía
tranquila antes de un torneo. Acogedor, inclusivo y premium, sin parecer una oficina corporativa,
un cibercafé barato ni una discoteca.

Mantené exactamente los materiales, verdes, luces arquitectónicas, realismo y atmósfera de la
referencia adjunta.

Sin texto, letras, números, logos, marcas de agua, armas, cartas, dinero, bebidas alcohólicas,
terror, decoración gótica, luz azul, violeta o roja.
```

---

## G3 — Torneos: “El núcleo competitivo”

**Nombre:** `torneos-kripta.png`
**Formato:** horizontal 3:2
**Uso:** sección de torneos y competencia
**Requisito:** adjuntar G1 aprobada + bloque de continuidad

### Prompt

```text
Creá una escena horizontal 3:2 dentro del mismo complejo subterráneo de esports de la imagen de
referencia.

ESCENA
El núcleo competitivo de la Kripta: una arena de esports íntima y elegante, no un estadio gigante.
Dos filas cortas de estaciones de juego oscuras se enfrentan a ambos lados de un pasillo central.
En el piso de basalto, líneas verdes integradas forman una estructura geométrica de eliminación:
ramas simétricas que avanzan hacia un único círculo luminoso al fondo, una alusión abstracta a una
llave de torneo, sin texto, nombres ni números.

Al final del pasillo hay una pieza central pequeña con forma de colmillo de obsidiana suspendido,
iluminado desde dentro por verde, como símbolo de victoria. Puede haber competidores adultos como
siluetas secundarias sentadas en las estaciones, pero sin rostros identificables, poses agresivas ni
armas visibles. El protagonismo es del espacio y de la estructura competitiva.

COMPOSICIÓN
Perspectiva frontal con punto de fuga central. Sensación de orden, reglas claras y tensión previa al
inicio. El pasillo luminoso guía la mirada. Dejá sombras suficientes en los laterales para que las
tarjetas y textos del sitio puedan convivir cerca de la imagen. Plano general, lente equivalente a
28 mm, sin gran angular extremo.

INTENCIÓN
Competencia de habilidad organizada por una comunidad, no apuestas. Profesional pero alcanzable:
una arena donde cualquier miembro puede anotarse, no una final mundial inaccesible.

Mantené exactamente los materiales, verdes, luces arquitectónicas, realismo y atmósfera de la
referencia adjunta.

Sin texto, letras, números, logos, trofeos con inscripciones, dinero, fichas, ruletas, casinos,
armas protagonistas, violencia, cartas, terror, decoración medieval, luz azul, violeta o roja.
```

---

## G4 — Herramienta gamer: “Precisión”

**Nombre:** `herramienta-sensibilidad.png`
**Formato:** cuadrado 1:1
**Uso:** tarjeta del convertidor de sensibilidad
**Requisito:** adjuntar G1 aprobada + bloque de continuidad

### Prompt

```text
Creá una imagen cuadrada 1:1, como fotografía editorial de producto tomada dentro de la misma
Kripta de la referencia.

ESCENA
Primer plano de un mouse gamer de diseño original, sin marca, apoyado sobre una superficie de
basalto negro. El mouse es de metal grafito mate y tiene una única ranura lateral con luz verde
#2fc94f. Detrás del mouse, fuera de foco, una pantalla oscura proyecta una retícula geométrica verde
muy simple y abstracta: dos círculos finos concéntricos y cuatro marcas cortas, sin números, letras,
mediciones ni interfaz.

Un cable trenzado oscuro traza una curva limpia sobre la piedra. Pequeñas partículas de polvo
iluminadas por el verde aportan profundidad, sin parecer chispas ni magia.

COMPOSICIÓN
Objeto completo, centrado levemente hacia la derecha, mucho espacio negativo negro alrededor,
ángulo de cámara bajo de tres cuartos, lente equivalente a 50 mm, profundidad de campo controlada.
Debe seguir siendo legible cuando se muestre dentro de una tarjeta pequeña.

ACABADO
Fotografía de producto premium, materiales físicamente realistas, bordes limpios, contraste alto,
luz verde controlada y fondo negro verdoso #050806. Misma dirección de arte que la referencia.

Sin texto, números, logos, marcas, manos, armas, videojuegos reconocibles, colores azules o violetas,
cyberpunk urbano ni decoración de truco.
```

---

## G5 — Herramienta de Truco: “El anotador”

**Nombre:** `herramienta-anotador.png`
**Formato:** cuadrado 1:1
**Uso:** únicamente la tarjeta del anotador de Truco
**Requisito:** adjuntar G1 aprobada + bloque de continuidad
**Nota:** ésta es la única imagen donde el Truco es protagonista.

### Prompt

```text
Creá una imagen cuadrada 1:1, como fotografía editorial de producto tomada dentro de la misma
Kripta de la referencia.

ESCENA
Cinco fósforos de madera oscura apoyados sobre una pequeña mesa de basalto negro, vistos desde
arriba con una inclinación leve. Están dispuestos como el sistema tradicional de conteo: cuatro
forman un cuadrado y el quinto cruza en diagonal. Las cabezas de los fósforos NO están prendidas:
contienen una brasa verde suave y controlada que ilumina apenas la piedra alrededor.

En el fondo, muy desenfocado y ocupando menos del 15% de la imagen, se insinúa el reverso de un
mazo de baraja española oscuro, sin cartas abiertas, sin palos visibles, sin números ni letras. Es
un detalle contextual secundario; el protagonista absoluto son los cinco fósforos.

COMPOSICIÓN
Los fósforos ocupan el centro y deben leerse con claridad incluso en una tarjeta pequeña. Mucho
espacio negativo negro alrededor. Lente equivalente a 50 mm, macro editorial, profundidad de campo
suave pero con los cinco fósforos nítidos.

ACABADO
Fotografía de producto premium, piedra y madera físicamente realistas, luz verde controlada, fondo
negro verdoso #050806. Debe pertenecer al mismo universo visual de la referencia, sin copiar la
estética colorida o ilustrada de otros sitios de Truco.

Sin texto, letras, números, logos, manos, fuego real, humo excesivo, cartas abiertas, casino,
dinero, estética gauchesca caricaturesca, colores azules, violetas o rojos.
```

---

# 4. Recursos que NO conviene generar con IA

Los siguientes se hacen con SVG, CSS o código. GPT Image puede producir algo visualmente atractivo,
pero no ofrece la precisión, transparencia, repetición ni consistencia que estos recursos necesitan.

| Recurso | Cómo se hará | Por qué no con IA |
|---|---|---|
| Logo / lobo | SVG vectorial | Debe ser nítido a 16 px, simétrico y reutilizable |
| Patrón de fondo | SVG/CSS repetible | Un patrón de IA rara vez cierra realmente sin costuras |
| Insignias de rango | Familia de SVG | Las tres deben compartir geometría exacta y escalar bien |
| Colmillo / puntos | SVG o ícono 3D derivado | Debe leerse como ícono pequeño y mantener siempre la misma forma |
| Marco de campeón | CSS/SVG sobre avatar | Necesita transparencia real y encajar exactamente sobre una foto |
| Imagen Open Graph | Código con hero + texto real | El título debe escribirse perfecto y poder actualizarse sin regenerar |
| Medallas 1°, 2°, 3° | CSS/SVG | Son elementos de interfaz, no ilustraciones |

La imagen para compartir se compondrá con código usando un recorte de G1, el lobo SVG y texto real.
Así el nombre “KRIPTA”, el título y las fechas nunca salen deformados y se pueden actualizar.

---

# 5. Correcciones profesionales para usar en el mismo chat

No pedir “hacela mejor”. Indicar qué conservar y qué cambiar.

## Si quedó demasiado medieval o terrorífica

```text
Conservá la composición, la cámara y la iluminación, pero reemplazá toda lectura medieval o de
terror por arquitectura contemporánea de esports. Eliminá adornos góticos, ruinas, runas, velas,
calaveras y piedra envejecida. Usá basalto negro de cortes limpios, metal grafito, vidrio ahumado y
luz integrada. Tiene que sentirse como un club gamer premium y seguro, no como una tumba.
```

## Si quedó cyberpunk genérica

```text
Conservá la composición y los materiales principales, pero reducí radicalmente el cyberpunk:
eliminá ciudad, carteles, cables, lluvia, luces múltiples y detalles tecnológicos innecesarios.
Dejá una arquitectura subterránea limpia, monumental y silenciosa. La única luz de color es verde y
sale de ranuras integradas en la piedra.
```

## Si el verde salió azul o turquesa

```text
Conservá toda la imagen, pero corregí únicamente la gradación de color: el verde debe ser puro,
cercano a #2fc94f, y las altas luces #5dff86. Eliminá por completo cian, turquesa, azul y violeta.
Las sombras deben tender a negro verdoso #050806, no a azul.
```

## Si no dejó espacio para el texto del hero

```text
Conservá la escena y su estilo, pero reencuadrala para uso web: mové toda la arquitectura y el foco
visual al 55% derecho. Dejá el 42% izquierdo oscuro, limpio y sin objetos importantes, con contraste
uniforme suficiente para colocar un título blanco grande y dos botones.
```

## Si quedó sobrecargada

```text
Conservá el concepto, pero aplicá una edición más premium y minimalista: eliminá aproximadamente el
40% de los objetos pequeños, partículas, luces y ornamentos. Priorizá una sola silueta arquitectónica,
materiales creíbles, espacio negativo y jerarquía visual clara.
```

## Si agregó texto o logos

```text
Conservá exactamente la escena, pero eliminá todo texto, letras, números, carteles, símbolos de
marcas, logos e interfaces legibles. No reemplaces el texto por otros signos; dejá esas superficies
oscuras y limpias.
```

## Si querés variantes sin perder la dirección

```text
Generá tres variaciones de esta misma dirección de arte. Conservá de forma estricta la arquitectura,
los materiales, la paleta, la iluminación, la cámara y las zonas de espacio negativo. Variá sólo
detalles secundarios y la distribución sutil de las luces. No cambies de estilo.
```

---

# 6. Orden recomendado

1. **G1 Hero / imagen maestra.** No avanzar hasta aprobarla.
2. **G2 Comunidad.** Comprueba si el mundo también funciona con personas y calidez.
3. **G3 Torneos.** Le da identidad propia al sistema competitivo.
4. **G4 Sensibilidad.** Primera herramienta; gaming puro.
5. **G5 Anotador.** Truco contenido en el lugar correcto.

Con G1 sola ya puedo rediseñar el hero y generar por código la primera imagen para compartir. No
hace falta esperar las cinco.

---

# 7. Cómo entregar los archivos

- Descargar siempre el **PNG original** generado por ChatGPT.
- No mandar captura de pantalla, archivo reenviado por WhatsApp ni imagen pegada en un documento.
- No recortar, comprimir ni borrar el fondo antes de enviarla.
- Conservar nombres: `hero-kripta.png`, `comunidad-kripta.png`, `torneos-kripta.png`,
  `herramienta-sensibilidad.png`, `herramienta-anotador.png`.
- Si hay dos opciones, conservar ambas como `hero-kripta-a.png` y `hero-kripta-b.png`.

Después se hará en el repo:

- Recorte responsivo para escritorio y celular.
- Conversión a WebP/AVIF.
- Uso de `next/image` con medidas declaradas para evitar saltos de contenido.
- Gradientes CSS para integrar los bordes al fondo `#050806`.
- Open Graph generado con código, texto real y un recorte de G1.
- Verificación visual a 390 px (celular) y 1440 px (escritorio) antes de mergear.
