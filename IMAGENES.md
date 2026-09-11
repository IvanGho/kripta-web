# Dirección de arte V3 — Monsterland / Kripta

Esta guía reemplaza V2. La versión anterior era técnicamente buena, pero cayó en tres clichés: el
guerrero enmascarado, el templo de ciencia ficción y el verde usado como iluminación de todo. Eso
no explicaba que Monsterland es una comunidad donde se viene a competir, encontrar gente y quedarse.

## Idea central

**Un club competitivo nocturno.** El mundo visual es una sede imaginaria de Monsterland: grafito,
piedra oscura, vidrio ahumado, espacios habitables y tecnología discreta. El lobo aparece como una
forma arquitectónica y las tres cicatrices escarlata como una firma física. Nunca hay un lobo literal
ni un personaje genérico que se haga pasar por la identidad de la comunidad.

Las personas son adultas, naturales y secundarias; muestran pertenencia, no un supuesto equipo
profesional. Las imágenes no constituyen prueba social ni representan a miembros reales.

## Paleta y roles

| Rol | Color | Uso |
| --- | --- | --- |
| Tinta | `#090B0F` | Fondo y sombra profunda |
| Grafito | `#121722` | Superficie operativa |
| Elevación | `#19202B` | Tarjetas y capas cercanas |
| Lima Volt | `#B7F34A` | Acción, ruta de torneo, foco |
| Menta técnico | `#74E2A0` | Dato, reflejo y detalle secundario |
| Escarlata | `#FF6B7A` | Una cicatriz física o error, nunca luz ambiente |
| Blanco cálido | `#F2F5F7` | Lectura y luz práctica |

El verde no se usa para bañar una escena. Ilumina líneas integradas, indicadores y recorridos. La
luz práctica es blanca cálida y tenue: hace que el lugar parezca habitable y reduce la estética de
"render gamer".

## Reglas comunes para generar

- Sin texto, números, logos, marcas, interfaces legibles ni marcas de agua.
- Sin guerreros enmascarados, armaduras, armas, neón saturado, ciudades cyberpunk, casinos, apuestas
  o símbolos místicos.
- No luz azul, violeta, naranja ni rojo ambiente. El escarlata sólo puede aparecer como tres cortes
  grabados en una superficie.
- Materiales físicos: piedra de basalto satinada, metal grafito cepillado, vidrio ahumado y textiles
  oscuros. El resultado debe resistir un recorte móvil.
- Los títulos y los datos viven en HTML. La imagen deja zona tranquila cuando el diseño la necesita.

## Piezas de producción

### G1 — Entrada de la Kripta

**Archivo:** `assets/originales/hero-kripta-v3.png` · 16:9 · hero y Open Graph.

> Fotografía editorial arquitectónica nocturna de la entrada de un club gaming premium. A la derecha,
> un portal de piedra grafito y vidrio ahumado insinúa orejas y hocico de lobo mediante su geometría;
> detrás se ven estaciones compactas y un lounge acogedor. Tres cortes escarlata están grabados en un
> panel de piedra. La izquierda queda oscura, limpia y con bajo detalle para el copy HTML. Luz práctica
> cálida y líneas muy finas Lima Volt, tinta y grafito predominantes. Sin personas centrales, máscaras,
> texto, logos, armas, símbolos ni luz neón excesiva. Composición horizontal 16:9, altura de ojos, 35 mm.

### G2 — La mesa

**Archivo:** `assets/originales/comunidad-kripta-v3.png` · 3:2 · sección Comunidad.

> Fotografía editorial de cuatro adultos compartiendo una sesión nocturna en una mesa junto a estaciones
> de juego del club Monsterland. Risas y conversación natural, sin protagonista; monitores sólo muestran
> formas verdes abstractas. El grupo vive a la derecha y el espacio conserva arquitectura tranquila a la
> izquierda. Basalto, textiles oscuros, luz blanca cálida y pequeños reflejos Lima Volt / Menta técnico.
> Tres cortes escarlata sutiles en una pared. Sin UI, texto, marcas, armaduras, poses de e-sports ni look
> de discoteca. Horizontal 3:2, altura de ojos, 40 mm.

### G3 — Próxima llave

**Archivo:** `assets/originales/torneos-kripta-v3.png` · 16:9 · sección Torneos.

> Fotografía arquitectónica de un espacio de competencia organizado y humano. Dos filas de estaciones
> compactas bordean un pasillo; las líneas Lima Volt incrustadas en el piso forman una llave abstracta
> que converge a un círculo distante. Un arco de vidrio con orejas de lobo queda al fondo; jugadores
> adultos son siluetas pequeñas preparando su partida. Reservar el 42 % izquierdo oscuro para la agenda
> y el contador. Sin estadio monumental, trofeos, dinero, casino, armamento, interfaces ni texto.
> Horizontal 16:9, 28 mm, grafito y tinta predominantes, luz práctica cálida.

### G4 — Precisión

**Archivo:** `assets/originales/herramienta-sensibilidad-v3.png` · 1:1 · convertidor de sensibilidad.

> Fotografía de producto de un mouse de gaming original, sin marca, sobre basalto y mousepad grafito.
> Detrás, un panel de vidrio desenfocado muestra dos círculos y cuatro marcas abstractas, sin números ni
> interfaz. El mouse se ve completo, un poco a la derecha; una línea Lima Volt delgada y un grabado de
> tres cortes escarlata son los únicos acentos. Escena calmada, precisa y material. Sin manos, texto,
> logos, HUD, armas, RGB, humo o ciudad cyberpunk. Cuadrado 1:1, ángulo bajo de tres cuartos, 50 mm.

### G5 — Cinco marcas

**Archivo:** `assets/originales/herramienta-anotador-v3.png` · 1:1 · anotador de Truco.

> Bodegón editorial en una mesa de basalto oscuro: exactamente cinco fósforos de madera totalmente
> visibles; cuatro forman un cuadrado y el quinto lo cruza en diagonal. Un mazo español sin marca se ve
> sólo de dorso y fuera de foco. El conteo es el protagonista y debe leerse en miniatura. Luz práctica
> cálida, un borde Lima Volt y un pequeño clip de metal con tres cortes escarlata. Sin cartas abiertas,
> números, texto, dinero, apuestas, fuego, humo o estereotipo gauchesco. Cuadrado 1:1, macro 50 mm.

## Entrega

Los PNG maestros se conservan en `assets/originales/`. Ejecutar
`node scripts/optimizar-imagenes.mjs` para crear los WebP de `public/imagenes/` y el JPG social que
usa Open Graph. La web consume los archivos `-v3`; V2 queda sólo como historial visual.
