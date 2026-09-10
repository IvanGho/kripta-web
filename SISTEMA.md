# Sistema visual de Monsterland

Extraído de nueve referencias que aportó el dueño. **Esto no es una lista de cosas lindas: es el
inventario de mecanismos que se van a usar, con el motivo de cada uno y qué se descartó.**

La paleta y la tipografía ya estaban fijadas (verde neón sobre negro, Archivo + IBM Plex Mono, ver el
encabezado de `app/globals.css`). Este documento resuelve la capa que faltaba: **cómo se construyen
las superficies, cómo se muestran los datos y dónde va el movimiento.**

Aplica a los dos proyectos. Donde difieren se dice.

---

## Lo que las referencias tienen en común, y es lo que importa

Se revisaron nueve piezas: un panel de finanzas oscuro, dos apps de streaming de gaming, una de
desafíos, un panel de logística, un caso de estudio muy oscuro con violeta, un tablero de tareas en
crema, un panel de pagos con lima, y un manual de identidad en rojo y lima.

Son estilos muy distintos. Lo que comparten las que **funcionan** son seis mecanismos, y ninguno tiene
que ver con el color.

### 1. La profundidad sale del valor, no del borde

En todas las oscuras que funcionan, el fondo es casi negro y las tarjetas son **un escalón más
claras**, sin borde o con uno apenas perceptible. La jerarquía se lee por luminosidad.

Los dos proyectos hoy hacen lo contrario: fondo, tarjeta del mismo valor, y un borde verde que hace el
trabajo de separar. El resultado es una reja: muchas líneas compitiendo, y ningún plano que se lea
como "más cerca".

**Qué se cambia:** las tarjetas suben un escalón de luminosidad y el borde baja a casi invisible. El
borde con color queda reservado para el estado (ver punto 3).

### 2. Un solo bloque con acento, y el resto callado

El panel de finanzas tiene **exactamente una** tarjeta con degradado de color; el de logística tiene
**un** botón azul. Todo lo demás es blanco, gris y negro. Por eso el ojo sabe adónde ir.

Los dos proyectos hoy reparten verde por todas partes: títulos en verde, números en verde, bordes en
verde, botones en verde. Cuando todo brilla, nada resalta.

**Qué se cambia:** en cada pantalla, **un** elemento lleva el verde saturado. En el sitio es el botón
de Discord. En el panel es el bloque de "Requiere tu atención". Los títulos de sección pasan a blanco.

### 3. El color codifica estado, no decora

El panel de logística tiene pastillas de estado en rojo, verde y azul: *Unpaid*, *Paid*, *Partial*. El
color **es** el dato. Se lee la tabla sin leer las palabras.

**Qué se aplica:** una escala de estado fija, la misma en los dos proyectos.

| Estado | Color | Dónde |
|---|---|---|
| Pendiente de acción | `--alerta` (ámbar) | cobros sin confirmar, edad sin verificar |
| Resuelto | `--acento` (verde) | pagado, presente, confirmado |
| Bloqueado o vencido | `--grave` (rojo) | borrador con fecha pasada, baneado |
| Informativo | `--tenue` (gris) | borrador a tiempo, finalizado |

Y la regla que ya rige en el sitio se mantiene: **el color nunca es la única señal.** Cada pastilla
lleva su palabra, y las insignias del podio se distinguen por cantidad de marcas.

### 4. El número grande viene con su variación

Todas las referencias de tablero muestran el dato así: etiqueta chica en gris, número grande, y al
lado **la variación** — `+25%`, `+12% from last week`, `-5% from last week`.

Esa tercera línea es la que convierte un número en información. "Ingresos del mes: $29.000" no dice
nada solo. "$29.000, +18% que el mes pasado" dice si el negocio crece.

**Qué se agrega:** cada métrica del panel lleva su variación contra el mes anterior. Es más barato de
leer que el gráfico de seis meses que ya está, y los dos sirven para preguntas distintas.

### 5. Micrográficos sin ejes

El panel de finanzas pone una línea diminuta al lado de cada fila de cripto: sin ejes, sin números,
sin leyenda. Sólo la forma. Contesta "¿viene subiendo?" en un vistazo y ocupa el ancho de una celda.

**Qué se agrega:** una línea de este tipo al lado de las métricas que tienen serie. Son unas líneas de
SVG y cuestan cero.

### 6. El contenido se sale de la tarjeta

En la app de streaming, el personaje **desborda el borde superior** de su tarjeta. Es un truco viejo y
funciona: rompe la cuadrícula sin desordenarla, y le da a una tarjeta el protagonismo que ninguna
sombra le da.

**Qué se aplica:** en el sitio, el emblema de las tarjetas de campeón y el lobo del bloque final
desbordan su contenedor. En el panel no: ahí la prolijidad vale más que el efecto.

---

## Tres mecanismos que se roban de una referencia sola

### La línea de tiempo con nodos, del panel de logística

Muestra un envío como una línea horizontal con puntos: *Started today · Reached KOL · Expected by 24
March*. El punto lleno indica dónde está.

**Es exactamente el ciclo de vida de un torneo**, y el panel hoy lo muestra como una etiqueta de
estado suelta que no dice cuánto falta ni qué viene:

```
borrador ──── inscripción ──── check-in ──── en juego ──── finalizado
                    ●
```

Va en la ficha de cada torneo y en la lista del tablero. Es el robo de mayor valor de las nueve
referencias, porque reemplaza una palabra por una posición.

### Las marcas de anotación técnica, del manual de identidad

El manual en rojo y lima rodea cada elemento con corchetes de esquina y etiquetas chiquitas en
monoespaciada, como un plano técnico. Es lo que hace que ese board se vea deliberado y no decorado.

**Encaja con la Kripta** —piedra tallada, arquitectura, cortes limpios— y encaja con la mono que ya
está cargada. Se aplica con moderación: corchetes de esquina en la tarjeta del hero y en el bloque de
pendientes del panel, nada más. Es CSS con `::before` y `::after`, cuesta cero.

### El relleno rayado en las barras, del panel de pagos

Sus barras no son bloques de color plano: tienen una trama de líneas finas. Le da textura al gráfico
sin sumar color.

Se aplica a las barras de egresos del panel: **ingresos en verde lleno, egresos en ámbar rayado.** De
paso resuelve algo real: distingue las dos series por textura y no sólo por color.

---

## Lo que se descarta, y por qué

**El tablero en crema con terracota.** Es una identidad opuesta a Monsterland, y además es uno de los
tres aspectos que produce cualquier generador por defecto. Se descarta por las dos razones.

**El violeta y el púrpura** de las tres referencias que los usan. La paleta está fijada e
`IMAGENES.md` los prohíbe explícitamente. Lo que sí se toma de esas piezas es el manejo de la
oscuridad, no el tinte.

**El arte oficial de los juegos.** Dos referencias apoyan todo su peso visual en las carátulas de
PUBG, Apex y God of War. **No se puede.** Usar arte de Riot o de Activision en una landing que
promociona torneos con premio en dinero es un problema de marca ajena, no un detalle. Ese lugar lo
ocupan las cinco imágenes propias de `IMAGENES.md`.

**Los personajes 3D renderizados.** No hay forma de generarlos acá, y encargarlos es un proyecto
propio. El emblema y el lobo en SVG cumplen la misma función estructural.

**La barra de navegación flotante en píldora** de la app de streaming. Se ve bien en una app de
consumo; en un sitio de captación tapa contenido en el viewport más chico, que es donde llega el
tráfico pago.

---

## Lo que cambia en cada proyecto

### Sitio público (`kripta-web`)

1. Tarjetas un escalón más claras, borde casi invisible.
2. Títulos de sección en blanco; el verde queda para el botón de Discord y los números del ranking.
3. Emblema desbordando la tarjeta en campeones y en el bloque final.
4. Corchetes de esquina en la tarjeta del hero.
5. Tarjetas de torneo en carrusel horizontal con la siguiente asomando, en teléfono.
6. Pastillas de estado con la escala de arriba.

### Panel (`monsterland-panel`)

1. **Barra lateral de íconos, colapsable**, en lugar de la navegación horizontal de arriba. Es lo que
   pedía el pedido original y lo que hacen tres de las referencias: con ocho secciones, una fila
   horizontal se queda sin lugar y una lateral no.
2. Tarjetas un escalón más claras, borde casi invisible.
3. Cada métrica con **cuadradito de ícono con color**, número grande, y **variación contra el mes
   anterior**.
4. Micrográfico al lado de las métricas con serie.
5. Pastillas de estado semánticas en las tablas.
6. **Línea de tiempo del torneo** en la ficha y en la lista.
7. Egresos con relleno rayado en el gráfico.
8. Corchetes de esquina en el bloque de pendientes, que es el único acento de la pantalla.

---

## Lo que no cambia

**El presupuesto.** Todo lo de arriba se hace con CSS y SVG en el servidor. El techo del sitio sigue
siendo 210 KB de JavaScript comprimido, medido en cada corrida, y el panel se queda en tres
dependencias de producción. Nada de esta lista necesita una librería.

**Los tokens de color.** Son los mismos y son compartidos con el panel. Lo que cambia es **cómo se
usan**: menos superficie con verde, y el color pasa a codificar estado.

**Las reglas de accesibilidad.** Contraste medido, el color nunca como única señal, `prefers-reduced-motion`
respetado, y sin desplazamiento horizontal a 390 puntos. Los 135 chequeos siguen teniendo que pasar,
y varios de los cambios de arriba los van a poner a prueba: subir el valor de las tarjetas cambia
todos los contrastes de la página.
