# Dirección de arte V2 — Kripta

Esta es la guía vigente para cualquier imagen generada del proyecto. Reemplaza la primera
dirección, que describía bien el mundo pero no daba a Monsterland una presencia competitiva
inmediata.

## Qué se toma de las referencias

La referencia de **STANDOFF** aportó contraste negro/jade, titulares geométricos de gran escala,
marcos técnicos con esquinas recortadas, puntos de datos en el fondo y un personaje central como
ancla emocional. Roarena aporta la prioridad de torneo, calendario y llave; Stromy, las capas
cinematográficas y el uso de contenido en una portada.

Son referencias de lenguaje, no piezas a reproducir. Kripta no usa sus personajes, nombres,
copy, interfaces, composición ni juegos. Su identidad nace del lobo negro de Monsterland, el verde
eléctrico y la cicatriz roja aportados por el dueño.

## Sistema visual

| Rol | Color |
| --- | --- |
| Obsidiana | `#050806` |
| Grafito | `#111813` |
| Jade técnico | `#00c9a7` |
| Verde del lobo / acción | `#62ff38` |
| Blanco mineral | `#eef7eb` |
| Cicatriz | `#ff5263` |

El jade organiza líneas, puntos y etiquetas. El verde del lobo se reserva para acciones y focos.
La cicatriz roja aparece una sola vez por escena, como firma y nunca como iluminación dominante.
Los titulares se escriben con HTML: ninguna imagen contiene palabras, números o una interfaz.

## Continuidad obligatoria

Para G2–G5, adjuntar `hero-kripta-v2.png` como referencia visual. Es una referencia de materiales,
contraste y atmósfera, no de composición ni sujeto. Cada escena debe sentirse creada por el mismo
equipo: basalto negro, metal grafito, luz jade y verde integrada, puntos de datos, profundidad
cinematográfica y una arquitectura contemporánea de esports.

Excluir siempre: texto, logotipos, marcas, personajes de juegos, armas, dinero, apuestas, casino,
fantasía medieval, calaveras, terror, ciudad cyberpunk, azul, violeta, naranja y marcas de agua.

## Las cinco piezas de producción

### G1 — Guardián de la Kripta

**Archivo:** `hero-kripta-v2.png` · 16:9 · hero y Open Graph.

```text
Use case: stylized-concept. Asset type: premium wide key art for the hero of Monsterland / Kripta,
an Argentine gaming community and tournament platform.

Create an original, high-end cinematic campaign image named “The Gatekeeper of Kripta”. A single
anonymous adult esports competitor is shown from the waist up on the RIGHT half of the frame,
wearing a black graphite technical jacket with clean angular panels and a matte geometric visor
that subtly recalls a wolf without literal ears, fur, or an animal mask. The face is mostly in
shadow; one restrained electric-green eye light and a short, thin red diagonal light mark across
the visor are the only aggressive details. The person is calm, focused, and credible.

Behind them: a monumental contemporary esports chamber made from matte obsidian, smoked glass and
brushed graphite. Integrated emerald seams create a minimal angular gateway and a few vertical
halftone dot columns. The LEFT 42% is dark and intentionally quiet for live HTML copy.

Original cinematic 3D key art with photoreal materials and editorial polish. 16:9, eye-level 50 mm,
subject sharply defined on the right, clean left negative space. Palette: #050806, #111813,
#00c9a7, #62ff38, #eef7eb and #ff5263 only as a tiny scar. No text, brands, weapons, game IP,
medieval motifs, blue, violet, orange, money, casino or watermark.
```

### G2 — La mesa de la Kripta

**Archivo:** `comunidad-kripta-v2.png` · 3:2 · comunidad.

```text
Create “The Kripta Table”, an original image about belonging before competition. Four adult gamers
in black contemporary technical streetwear gather around a low graphite table inside an elegant
underground esports lounge. They are seen from a varied three-quarter back angle, sharing a relaxed
strategic moment; no person dominates. Two thin monitors show abstract non-legible green forms.

The room is orderly black basalt, smoked glass, a distant angular gateway, green dot-matrix light
columns and integrated jade seams. The group and table occupy centre-right; upper left retains dark
breathing room. 3:2 landscape, eye-level 35 mm, cinematic 3D campaign image, deep blacks, jade
ambience, electric-green edge lights, one tiny red diagonal LED detail. No text, logos, game IP,
weapons, masks, nightclub or watermark.
```

### G3 — Núcleo competitivo

**Archivo:** `torneos-kripta-v2.png` · 3:2 · torneos y cabecera del panel.

```text
Create “The Competitive Core”, an original nonviolent esports arena. Two compact rows of adult
competitors in anonymous black technical jackets sit at dark stations facing a central runway. The
floor contains a precise abstract tournament bracket: thin jade-green branches converge on a
suspended black-glass hexagonal beacon with an electric-green internal glow. People are secondary;
the organized path toward competition is the focus.

Refined subterranean chamber of basalt pillars and smoked glass, a tall angular gateway, dotted
data-light and exactly one red diagonal architectural seam. 3:2 landscape, frontal 28 mm,
premium cinematic 3D, crisp green guidance lines, black graphite surfaces and controlled low haze.
No words, game brands, trophies, prize money, casino, weapons, fantasy, blue/violet/orange or
watermark.
```

### G4 — Precisión

**Archivo:** `herramienta-sensibilidad-v2.png` · 1:1 · convertidor de sensibilidad.

```text
Create “Precision”, an original premium product portrait of an unbranded graphite gaming mouse on
a matte obsidian surface. It has exactly one fine electric-green light seam. Behind it, out of
focus, smoked glass projects an abstract jade target formed only by thin circles and short ticks;
no numbers or interface. A braided cable traces one clean curve; one tiny red diagonal reflection
appears on the desk edge.

Square 1:1, low three-quarter 50 mm camera, complete mouse slightly right of centre and abundant
black negative space. High-end cinematic 3D product photography with the Kripta material system.
No text, logos, hands, measurements, game imagery, city cyberpunk or watermark.
```

### G5 — Cinco marcas

**Archivo:** `herramienta-anotador-v2.png` · 1:1 · anotador de Truco.

```text
Create “Five Marks”, an original macro still-life for a modern Truco tool. EXACTLY FIVE short dark
wooden matchsticks rest on a matte basalt table: four clearly form a square and the fifth lies
cleanly across its diagonal. The match heads are not burning; each holds a tiny contained
electric-green ember. In the deep blurred background, one dark Spanish-deck card back adds context
without suits, numerals, text or recognizable pattern. One thin red diagonal inlay on the table edge
is the only red detail.

Square 1:1, overhead three-quarter 50 mm macro view, all five fully visible and sharp at thumbnail
size, cinematic 3D product photography. No text, hands, flames, smoke, open cards, gambling,
gaucho caricature, blue/violet/orange or watermark.
```

## Archivos y uso

Los PNG maestros viven en `assets/originales/`. `node scripts/optimizar-imagenes.mjs` crea los WebP
de `public/imagenes/` y `assets/hero-social-v2.jpg`. Las páginas consumen los nombres con sufijo
`-v2`, por lo que G1–G5 originales se conservan para comparación.
