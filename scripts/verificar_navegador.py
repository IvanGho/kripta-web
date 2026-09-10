"""
Verificacion del sitio en un navegador de verdad.

Cubre lo que `next build`, `tsc` y `eslint` no pueden ver: que no haya errores de hidratacion,
que las herramientas funcionen y recuerden lo que hacen, que el foco se vea al navegar con
teclado, y que la estructura de la pagina sea la que un lector de pantalla necesita.

Esta en Python y no en Node para no sumarle Playwright al repo, que hoy tiene tres dependencias
de produccion. Playwright de Python vive en tu maquina.

Preparar una vez:
    pip install playwright
    python -m playwright install chromium

Usar:
    npm run dev                            (en otra terminal)
    npm run verificar-navegador

Variables: BASE (por defecto http://localhost:3000). Para verificar contra el sitio compilado,
que es lo que de verdad ve un visitante:

    npm run build && npm start -- --port 3100
    $env:BASE = "http://localhost:3100"; npm run verificar-navegador
"""

import gzip
import os
import re
import sys

from playwright.sync_api import sync_playwright

BASE = os.environ.get("BASE", "http://localhost:3000")

# Todas las paginas del sitio. Tiene que coincidir con PAGINAS de app/lib/sitio.ts: el chequeo del
# sitemap compara contra el largo de esta lista, asi que agregar una pagina alla y olvidarse aca
# hace fallar la verificacion en vez de pasar desapercibido.
RUTAS = [
    "/",
    "/anotador",
    "/sensibilidad",
    "/legal/privacidad",
    "/legal/terminos",
    "/legal/derechos",
]

# Las paginas que declaran datos estructurados para Google. Las dos legales no estan y no deberian:
# no hay ningun tipo de schema.org que corresponda a una politica de privacidad, y declarar uno
# inventado es peor que no declarar nada.
RUTAS_CON_SCHEMA = ["/", "/anotador", "/sensibilidad"]

# Las paginas de texto legal, que tienen sus propios chequeos.
RUTAS_LEGALES = ["/legal/privacidad", "/legal/terminos", "/legal/derechos"]

# Cabeceras de seguridad que tienen que venir en TODA respuesta, con el valor esperado. Se
# verifican contra el sitio compilado y no contra `next dev`: en desarrollo no salen igual.
#
# El valor se compara por "contiene" y no por igualdad, porque el CSP es largo y lo que importa es
# que la directiva este presente. Los motivos de cada una estan en next.config.ts.
CABECERAS_ESPERADAS = {
    "content-security-policy": "frame-ancestors 'none'",
    "strict-transport-security": "max-age=",
    "x-frame-options": "DENY",
    "x-content-type-options": "nosniff",
    "referrer-policy": "strict-origin",
    "permissions-policy": "camera=()",
}

# Vocabulario que no se usa nunca, ni negado. Es la misma lista que VOCABULARIO_PROHIBIDO de
# monsterland-panel/src/discord/revisor.js. Se compara como palabra completa para no marcar falsos
# positivos ("casa" aparece en "casaca").
VOCABULARIO_PROHIBIDO = ["pozo", "apuesta", "apuestas", "apostar", "banca", "casa de apuestas"]

# Cuando se considera cargada una pagina.
#
# Era "networkidle", y hay que no volver a ponerlo. El router de Next precarga las rutas enlazadas
# en cuanto la pagina aparece: son pedidos a `<ruta>?_rsc=<hash>` que traen el arbol de componentes
# de la ruta destino. Con la cabecera y el pie enlazando a cinco paginas, esos pedidos se encadenan
# de forma continua, la red nunca queda quieta los 500ms que "networkidle" espera, y `goto` agota
# los 30 segundos. Playwright ademas lo desaconseja por esto mismo.
#
# Con "load" alcanza porque cada chequeo espera por su propio elemento: los locators de Playwright
# ya reintentan solos hasta que aparece lo que buscan.
LISTA = "load"

# Cuanto esperar a que React tome el control de los controles antes de hacerles clic.
#
# El HTML que llega del servidor ya trae los botones dibujados, asi que un clic puede salir antes de
# que exista el manejador: el clic no hace nada y el chequeo falla por una razon que no es la que
# esta probando. Con "networkidle" esta espera venia de arado; ahora va explicita.
ESPERA_HIDRATACION = 800

# Techo de JavaScript servido en la portada, en KB, tal como viaja por la red.
#
# El valor sale de la direccion visual declarada en app/globals.css. La linea base antes del pase
# visual eran 198 KB, y el pase visual no agrego nada medible: las tipografias son archivos de fuente,
# las llaves y las insignias son SVG renderizado en el servidor, las apariciones al scrollear son CSS,
# y el canvas de brasas son unas cuarenta lineas.
#
# El margen de 12 KB esta para no fallar por un cambio de version de Next. Si hace falta subirlo, la
# pregunta a contestar antes es que se gano a cambio.
TECHO_JS_KB = 210

fallas = []


def chequear(nombre, condicion, detalle=""):
    if condicion:
        print(f"  ok    {nombre}")
    else:
        print(f"  FALLA {nombre}" + (f" - {detalle}" if detalle else ""))
        fallas.append(nombre)


with sync_playwright() as p:
    navegador = p.chromium.launch()
    # Viewport de telefono: es como entra la mayoria a un sitio de una comunidad de Discord.
    contexto = navegador.new_context(viewport={"width": 390, "height": 844})
    pagina = contexto.new_page()

    problemas = []
    pagina.on("console", lambda m: problemas.append(m.text) if m.type == "error" else None)
    pagina.on("pageerror", lambda e: problemas.append(f"pageerror: {e}"))

    print(f"\nVerificacion del sitio contra {BASE} (viewport 390x844)\n")

    # ---------------- carga sin errores ni fallos de hidratacion ----------------
    print("carga")
    for ruta in RUTAS:
        antes = len(problemas)
        respuesta = pagina.goto(BASE + ruta, wait_until=LISTA)
        nuevos = problemas[antes:]
        chequear(
            f"{ruta} carga sin errores de consola",
            respuesta is not None and respuesta.status == 200 and not nuevos,
            f"status {respuesta.status if respuesta else '?'} | {' | '.join(nuevos)}",
        )
        # Los errores de hidratacion se reportan en consola y son faciles de dejar pasar.
        hidratacion = [x for x in nuevos if "hydrat" in x.lower() or "did not match" in x.lower()]
        chequear(f"{ruta} sin errores de hidratacion", not hidratacion, " | ".join(hidratacion))

    # ---------------- estructura para lectores de pantalla ----------------
    print("\nestructura")
    for ruta in RUTAS:
        pagina.goto(BASE + ruta, wait_until=LISTA)
        chequear(f"{ruta} tiene un <main>", pagina.locator("main").count() == 1)
        chequear(f"{ruta} tiene exactamente un h1", pagina.locator("h1").count() == 1)
        # Un enlace para saltar el header pegajoso, que tiene varios elementos tabulables.
        salto = pagina.locator('a[href="#contenido"]')
        chequear(f"{ruta} tiene enlace para saltar al contenido", salto.count() == 1)

    # ---------------- la tabla del ranking ----------------
    print("\ntabla del ranking")
    pagina.goto(BASE + "/", wait_until=LISTA)
    tabla = pagina.locator("table").first
    if tabla.count() > 0:
        encabezados = pagina.locator("table th").count()
        con_scope = pagina.locator('table th[scope="col"]').count()
        chequear("los th declaran scope=col", encabezados > 0 and encabezados == con_scope, f"{con_scope}/{encabezados}")
        chequear("la tabla tiene caption", pagina.locator("table caption").count() > 0)
    else:
        chequear("hay tabla de ranking", False, "no se encontro ninguna tabla")

    # ---------------- navegacion en telefono ----------------
    print("\nnavegacion en telefono")
    pagina.goto(BASE + "/", wait_until=LISTA)
    # Hay dos <nav> en la cabecera: el de escritorio (oculto en telefono) y el de telefono.
    # Hay que mirar si ALGUNA de las coincidencias es visible, no la primera: la primera en el
    # DOM es la de escritorio y a 390px esta oculta.
    enlaces_visibles = 0
    for texto in ["Ranking", "Torneos", "Anotador", "Sensibilidad"]:
        candidatos = pagina.locator(f'header a:has-text("{texto}")')
        if any(candidatos.nth(i).is_visible() for i in range(candidatos.count())):
            enlaces_visibles += 1
    chequear(
        "se puede navegar desde la cabecera en telefono",
        enlaces_visibles > 0,
        f"{enlaces_visibles} de 4 enlaces visibles a 390px de ancho",
    )

    # ---------------- foco visible ----------------
    print("\nfoco visible")
    pagina.goto(BASE + "/sensibilidad", wait_until=LISTA)
    contorno = pagina.evaluate(
        """() => {
            const campo = document.querySelector('select, input');
            if (!campo) return 'sin-campo';
            campo.focus();
            const estilo = getComputedStyle(campo);
            // Se considera visible si hay outline con grosor, o un anillo de box-shadow.
            const anchoOutline = parseFloat(estilo.outlineWidth) || 0;
            const tieneOutline = estilo.outlineStyle !== 'none' && anchoOutline >= 1;
            const tieneSombra = estilo.boxShadow && estilo.boxShadow !== 'none';
            return (tieneOutline || tieneSombra) ? 'visible' : `invisible (outline: ${estilo.outlineStyle} ${estilo.outlineWidth}, shadow: ${estilo.boxShadow})`;
        }"""
    )
    chequear("los campos muestran el foco", contorno == "visible", str(contorno))

    # ---------------- el boton de Discord ----------------
    print("\nboton de Discord")
    pagina.goto(BASE + "/", wait_until=LISTA)
    estado_boton = pagina.evaluate(
        """() => {
            // Sin invitacion valida el boton se deshabilita. Deshabilitado o no, tiene que
            // ser alcanzable con el teclado y tener un rol que un lector de pantalla entienda.
            const candidatos = [...document.querySelectorAll('a, button, [role="button"]')]
                .filter(el => /discord/i.test(el.textContent || '') || /discord/i.test(el.getAttribute('aria-label') || ''));
            if (candidatos.length === 0) return { encontrados: 0 };
            const el = candidatos[0];
            return {
                encontrados: candidatos.length,
                etiqueta: el.tagName.toLowerCase(),
                rol: el.getAttribute('role'),
                tabindex: el.getAttribute('tabindex'),
                deshabilitado: el.getAttribute('aria-disabled'),
                focusable: el.tabIndex >= 0,
                texto: (el.textContent || '').trim().slice(0, 40),
            };
        }"""
    )
    chequear("hay boton de Discord", estado_boton.get("encontrados", 0) > 0, str(estado_boton))
    if estado_boton.get("encontrados", 0) > 0:
        chequear(
            "el boton de Discord es alcanzable con teclado",
            estado_boton.get("focusable") is True,
            str(estado_boton),
        )
        # Si esta deshabilitado tiene que decirlo con un rol que lo soporte, no en un span suelto.
        if estado_boton.get("deshabilitado") == "true":
            chequear(
                "si esta deshabilitado, tiene rol de boton",
                estado_boton.get("etiqueta") == "button" or estado_boton.get("rol") == "button",
                str(estado_boton),
            )

    # ---------------- anotador: funciona y recuerda ----------------
    print("\nanotador")
    pagina.goto(BASE + "/anotador", wait_until=LISTA)
    pagina.evaluate("() => window.localStorage.removeItem('kripta:anotador')")
    pagina.reload(wait_until=LISTA)
    pagina.wait_for_timeout(ESPERA_HIDRATACION)

    def puntaje(indice):
        return int(pagina.locator(".tabular-nums").nth(indice).inner_text().strip())

    pagina.locator('button[aria-label^="Sumar 3"]').first.click()
    pagina.locator('button[aria-label^="Sumar 2"]').first.click()
    pagina.wait_for_timeout(200)
    chequear("sumar acumula puntos", puntaje(0) == 5, f"quedo en {puntaje(0)}")

    pagina.locator('button:has-text("Deshacer")').click()
    pagina.wait_for_timeout(200)
    chequear("deshacer vuelve al puntaje anterior", puntaje(0) == 3, f"quedo en {puntaje(0)}")

    # Lo que antes se perdia: recargar borraba la partida.
    pagina.reload(wait_until=LISTA)
    pagina.wait_for_timeout(ESPERA_HIDRATACION)
    chequear("la partida sobrevive a recargar", puntaje(0) == 3, f"quedo en {puntaje(0)}")

    # Reiniciar con partida en curso tiene que preguntar.
    pregunto = {"si": False}
    def al_dialogo(d):
        pregunto["si"] = True
        d.dismiss()
    pagina.once("dialog", al_dialogo)
    pagina.locator('button:has-text("Reiniciar")').click()
    pagina.wait_for_timeout(500)
    chequear("reiniciar pide confirmacion", pregunto["si"], "no aparecio ningun dialogo")
    chequear("cancelar no borra la partida", puntaje(0) == 3, f"quedo en {puntaje(0)}")

    # El puntaje se anuncia.
    chequear(
        "el puntaje esta en una region que se anuncia",
        pagina.locator('[aria-live="polite"]').count() > 0,
    )

    # ---------------- convertidor ----------------
    print("\nconvertidor")
    pagina.goto(BASE + "/sensibilidad", wait_until=LISTA)
    pagina.evaluate("() => window.localStorage.removeItem('kripta:sensibilidad')")
    pagina.reload(wait_until=LISTA)
    pagina.wait_for_timeout(ESPERA_HIDRATACION)

    campos = pagina.locator("input")
    selects = pagina.locator("select")

    # Valorant 1.0 -> CS2 son 3,18 (0,07 / 0,022). Es el caso conocido del nicho.
    selects.nth(0).select_option("valorant")
    selects.nth(1).select_option("cs2")
    campos.nth(0).fill("1")
    campos.nth(1).fill("800")
    pagina.wait_for_timeout(300)
    resultado = pagina.locator(".texto-degradado").first.inner_text().strip()
    chequear("Valorant 1 a CS2 da 3,18", resultado.startswith("3,18"), f"dio {resultado}")

    # El DPI con separador de miles: Number("1.600") daba 1,6 en silencio.
    campos.nth(1).fill("1.600")
    pagina.wait_for_timeout(300)
    cm_con_punto = pagina.locator("text=/cm$/").first.inner_text() if pagina.locator("text=/cm$/").count() else ""
    campos.nth(1).fill("1600")
    pagina.wait_for_timeout(300)
    cm_sin_punto = pagina.locator("text=/cm$/").first.inner_text() if pagina.locator("text=/cm$/").count() else ""
    chequear(
        "el DPI acepta separador de miles",
        cm_con_punto == cm_sin_punto and cm_con_punto != "",
        f'"1.600" dio {cm_con_punto} y "1600" dio {cm_sin_punto}',
    )

    # Elegir el mismo juego en los dos lados tiene que avisar.
    selects.nth(1).select_option("valorant")
    pagina.wait_for_timeout(300)
    chequear(
        "avisa si origen y destino son el mismo juego",
        pagina.locator("text=/mismo juego/i").count() > 0,
    )

    # Y las elecciones se recuerdan.
    selects.nth(1).select_option("ow2")
    campos.nth(0).fill("0,25")
    pagina.wait_for_timeout(400)
    pagina.reload(wait_until=LISTA)
    pagina.wait_for_timeout(ESPERA_HIDRATACION)
    chequear(
        "el convertidor recuerda lo elegido",
        pagina.locator("select").nth(1).input_value() == "ow2"
        and pagina.locator("input").nth(0).input_value() == "0,25",
        f'destino={pagina.locator("select").nth(1).input_value()} sens={pagina.locator("input").nth(0).input_value()}',
    )

    # ---------------- SEO ----------------
    print("\nSEO")

    robots = pagina.request.get(f"{BASE}/robots.txt")
    chequear("robots.txt responde 200", robots.status == 200, f"status {robots.status}")
    cuerpo_robots = robots.text()
    chequear("robots.txt declara el sitemap", "Sitemap:" in cuerpo_robots, cuerpo_robots[:120])

    mapa = pagina.request.get(f"{BASE}/sitemap.xml")
    chequear("sitemap.xml responde 200", mapa.status == 200, f"status {mapa.status}")
    cuerpo_mapa = mapa.text()
    for ruta in RUTAS:
        if ruta != "/":
            chequear(f"el sitemap incluye {ruta}", ruta in cuerpo_mapa)
    chequear(
        f"el sitemap tiene las {len(RUTAS)} paginas",
        cuerpo_mapa.count("<loc>") == len(RUTAS),
        f'{cuerpo_mapa.count("<loc>")} urls, se esperaban {len(RUTAS)}',
    )

    # La imagen para compartir. Declarar summary_large_image sin imagen deja la tarjeta vacia,
    # que es peor que no declararla.
    og = pagina.request.get(f"{BASE}/opengraph-image")
    chequear("la imagen para compartir responde 200", og.status == 200, f"status {og.status}")
    chequear(
        "la imagen para compartir es un PNG con contenido",
        og.headers.get("content-type", "").startswith("image/png") and len(og.body()) > 10000,
        f'{og.headers.get("content-type")} / {len(og.body())} bytes',
    )

    # Los iconos PNG del manifiesto: sin ellos Android recorta el logo.
    manifiesto = pagina.request.get(f"{BASE}/manifest.webmanifest").json()
    proposito = [i.get("purpose") for i in manifiesto.get("icons", [])]
    chequear("el manifiesto declara un icono maskable", "maskable" in proposito, str(proposito))
    for tamano in ["192", "512"]:
        icono = pagina.request.get(f"{BASE}/icono/{tamano}")
        chequear(
            f"el icono de {tamano}px se genera",
            icono.status == 200 and icono.headers.get("content-type", "").startswith("image/png"),
            f'status {icono.status} / {icono.headers.get("content-type")}',
        )

    # Canonical en las tres paginas. La home era la unica que no lo tenia.
    for ruta in RUTAS:
        pagina.goto(BASE + ruta, wait_until=LISTA)
        canonical = pagina.locator('link[rel="canonical"]')
        chequear(
            f"{ruta} declara canonical",
            canonical.count() == 1,
            f"encontrados {canonical.count()}",
        )

    # JSON-LD: que exista y que sea JSON valido. Un bloque roto no da error visible en la
    # pagina, simplemente lo ignoran los buscadores y nadie se entera.
    import json as _json

    for ruta in RUTAS_CON_SCHEMA:
        pagina.goto(BASE + ruta, wait_until=LISTA)
        bloques = pagina.locator('script[type="application/ld+json"]')
        cantidad = bloques.count()
        chequear(f"{ruta} tiene datos estructurados", cantidad > 0, f"{cantidad} bloques")
        todos_validos = True
        tipos = []
        for i in range(cantidad):
            try:
                datos = _json.loads(bloques.nth(i).inner_text())
                if isinstance(datos, list):
                    tipos += [d.get("@type") for d in datos]
                else:
                    tipos.append(datos.get("@type"))
            except Exception:
                todos_validos = False
        chequear(f"{ruta} el JSON-LD es JSON valido", todos_validos, str(tipos))

    # ---------------- paginas legales ----------------
    # Existen para poder mandar trafico pago: las plataformas de anuncios piden una politica de
    # privacidad alcanzable en el dominio, y el sitio menciona inscripciones y mayoria de edad.
    print("\npaginas legales")
    for ruta in RUTAS_LEGALES:
        pagina.goto(BASE + ruta, wait_until=LISTA)

        # Que conserven la identidad del sitio y no parezcan otra pagina.
        chequear(f"{ruta} tiene cabecera", pagina.locator("header").count() == 1)
        chequear(f"{ruta} tiene pie", pagina.locator("footer").count() == 1)

        # La fecha de actualizacion es lo que le dice al lector si el texto esta vigente.
        chequear(f"{ruta} declara fecha de actualizacion", pagina.locator("time[datetime]").count() > 0)

        # Cero vocabulario de la lista prohibida en lo que se ve. Se mira el texto renderizado y no
        # el codigo fuente a proposito: los comentarios de los archivos nombran la lista justamente
        # para explicar la regla, y eso no llega a la pantalla.
        texto = (pagina.locator("body").inner_text() or "").lower()
        encontrados = [t for t in VOCABULARIO_PROHIBIDO if re.search(rf"\b{re.escape(t)}\b", texto)]
        chequear(f"{ruta} sin vocabulario prohibido", not encontrados, f"aparecen: {encontrados}")

    # Alcanzables desde cualquier pagina, que es donde la gente (y quien revisa una campana) las busca.
    pagina.goto(BASE + "/", wait_until=LISTA)
    for ruta in RUTAS_LEGALES:
        chequear(
            f"el pie enlaza a {ruta}",
            pagina.locator(f'footer a[href="{ruta}"]').count() > 0,
        )

    # ---------------- contraste, area tactil y desplazamiento ----------------
    #
    # Esto es lo que no se ve mirando una captura: un texto tenue puede quedar lindo y ser ilegible
    # para alguien con vision reducida, y un boton de 30px se toca mal en un telefono.
    print("\naccesibilidad medida")

    for ruta in RUTAS:
        pagina.goto(BASE + ruta, wait_until=LISTA)
        pagina.wait_for_timeout(ESPERA_HIDRATACION)

        # Sin desplazamiento horizontal a 390 puntos. Es el ancho del viewport de este contexto.
        desborde = pagina.evaluate(
            "() => document.documentElement.scrollWidth - document.documentElement.clientWidth"
        )
        chequear(
            f"{ruta} sin desplazamiento horizontal a 390px",
            desborde <= 1,  # 1px de tolerancia por redondeo del navegador
            f"se desborda {desborde}px",
        )

        # Contraste del texto real contra el fondo real que le toca.
        #
        # Se mide sobre los elementos que de verdad hay en la pagina, resolviendo el color de fondo
        # heredado. El umbral de WCAG AA es 4.5:1 para cuerpo y 3:1 para texto grande (>=24px, o
        # >=18.66px si es negrita), asi que el umbral se elige por elemento.
        malos = pagina.evaluate(
            """() => {
                function aRgb(css) {
                    const m = css.match(/\\d+(\\.\\d+)?/g);
                    return m ? m.slice(0, 3).map(Number) : null;
                }
                function luminancia([r, g, b]) {
                    const f = c => {
                        c /= 255;
                        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
                    };
                    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
                }
                // Devuelve el fondo opaco mas cercano, o null si en el camino hay un degradado.
                //
                // Lo del degradado importa y fue un error de la primera version de este chequeo:
                // los botones del sitio tienen `background: linear-gradient(...)`, asi que su
                // `backgroundColor` es transparente. El codigo subia hasta el fondo de la pagina y
                // comparaba el texto oscuro del boton contra el negro de la pagina, dando 1:1 y
                // reportando como ilegible el control mas legible del sitio.
                //
                // Un degradado no tiene "un" color de fondo, asi que no se puede calcular una razon
                // de contraste unica: se devuelve null y el elemento se saltea. Su legibilidad se
                // decide mirandolo, no midiendo.
                function fondoDe(el) {
                    let n = el;
                    while (n && n !== document.documentElement) {
                        const est = getComputedStyle(n);
                        if (est.backgroundImage && est.backgroundImage !== 'none') return null;
                        const c = est.backgroundColor;
                        const rgb = aRgb(c);
                        const alfa = c.startsWith('rgba') ? parseFloat(c.split(',')[3]) : 1;
                        if (rgb && alfa > 0.85) return rgb;
                        n = n.parentElement;
                    }
                    return [5, 8, 6];
                }
                const malos = [];
                const nodos = document.querySelectorAll(
                    'p, li, td, th, h1, h2, h3, dt, dd, span, a, button, caption, time'
                );
                for (const el of nodos) {
                    const texto = (el.textContent || '').trim();
                    if (!texto) continue;
                    // Solo hojas: si tiene hijos con texto, el que manda es el hijo.
                    if ([...el.children].some(h => (h.textContent || '').trim())) continue;
                    const est = getComputedStyle(el);
                    if (est.visibility === 'hidden' || est.display === 'none') continue;
                    if (parseFloat(est.opacity) < 0.9) continue;
                    const caja = el.getBoundingClientRect();
                    if (caja.width < 2 || caja.height < 2) continue;
                    // El degradado recorta el texto y deja el color transparente a proposito: su
                    // legibilidad no se mide asi, y tiene su propio respaldo en contraste forzado.
                    if (el.classList.contains('texto-degradado')) continue;

                    const frente = aRgb(est.color);
                    if (!frente) continue;
                    const fondo = fondoDe(el);
                    if (!fondo) continue;  // fondo con degradado: ver el comentario de fondoDe
                    const l1 = luminancia(frente);
                    const l2 = luminancia(fondo);
                    const razon = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

                    const px = parseFloat(est.fontSize);
                    const peso = parseInt(est.fontWeight, 10) || 400;
                    const grande = px >= 24 || (px >= 18.66 && peso >= 700);
                    const umbral = grande ? 3 : 4.5;

                    if (razon < umbral) {
                        malos.push({
                            texto: texto.slice(0, 42),
                            razon: Math.round(razon * 100) / 100,
                            umbral,
                            px: Math.round(px * 10) / 10,
                        });
                    }
                }
                return malos;
            }"""
        )
        chequear(
            f"{ruta} contraste AA en todo el texto",
            len(malos) == 0,
            "; ".join(f'"{m["texto"]}" {m["razon"]}:1 < {m["umbral"]} ({m["px"]}px)' for m in malos[:4]),
        )

        # Area tactil de los controles.
        #
        # El umbral es 24x24 y no 44x44, y conviene saber por que: el criterio de WCAG que exige
        # 44x44 es el 2.5.5, que es nivel **AAA**. El que corresponde a AA es el 2.5.8 de WCAG 2.2,
        # que pide 24x24. Medir contra 44 y llamarlo AA seria decir que el sitio no cumple algo que
        # si cumple.
        #
        # Eso no significa que 24px sea comodo: los controles principales de este sitio pasan
        # holgadamente los 44px porque se tocan con el pulgar, y eso es una decision de diseno, no
        # una exigencia de la norma.
        chicos = pagina.evaluate(
            """() => {
                const chicos = [];
                for (const el of document.querySelectorAll('a, button')) {
                    const c = el.getBoundingClientRect();
                    if (c.width < 2 || c.height < 2) continue;              // fuera de pantalla
                    if (getComputedStyle(el).display === 'inline') continue; // enlace dentro de un parrafo
                    if (c.height < 24 || c.width < 24) {
                        chicos.push({
                            texto: (el.textContent || '').trim().slice(0, 30),
                            alto: Math.round(c.height),
                            ancho: Math.round(c.width),
                        });
                    }
                }
                return chicos;
            }"""
        )
        chequear(
            f"{ruta} controles de 24x24 o mas (WCAG 2.2 AA)",
            len(chicos) == 0,
            "; ".join(f'"{c["texto"]}" {c["ancho"]}x{c["alto"]}' for c in chicos[:4]),
        )

        # Un solo h1 y sin saltos de nivel (un h4 despues de un h2 desorienta a quien navega por
        # encabezados, que es como se recorre una pagina con lector de pantalla).
        niveles = pagina.evaluate(
            "() => [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h => Number(h.tagName[1]))"
        )
        chequear(f"{ruta} tiene exactamente un h1", niveles.count(1) == 1, f"h1: {niveles.count(1)}")
        saltos = [
            (a, b) for a, b in zip(niveles, niveles[1:]) if b > a + 1
        ]
        chequear(f"{ruta} sin saltos de nivel de encabezado", not saltos, f"saltos: {saltos}")

    # La preferencia de menos movimiento tiene que apagar las animaciones de verdad.
    print("\npreferencia de menos movimiento")
    contexto_quieto = navegador.new_context(
        viewport={"width": 390, "height": 844}, reduced_motion="reduce"
    )
    pagina_quieta = contexto_quieto.new_page()
    pagina_quieta.goto(BASE + "/", wait_until=LISTA)
    pagina_quieta.wait_for_timeout(ESPERA_HIDRATACION)
    animando = pagina_quieta.evaluate(
        """() => document.getAnimations()
              .filter(a => a.playState === 'running')
              .map(a => a.animationName || 'sin-nombre')"""
    )
    chequear(
        "con menos movimiento no queda ninguna animacion corriendo",
        len(animando) == 0,
        f"siguen: {animando}",
    )
    # El canvas de brasas no tiene que dibujar ni un cuadro.
    sin_brasas = pagina_quieta.evaluate(
        """() => {
            const c = document.querySelector('canvas');
            if (!c) return 'no hay canvas';
            const ctx = c.getContext('2d');
            const d = ctx.getImageData(0, 0, c.width, c.height).data;
            for (let i = 3; i < d.length; i += 4) if (d[i] !== 0) return 'dibujo algo';
            return 'vacio';
        }"""
    )
    chequear(
        "con menos movimiento el canvas de brasas no dibuja",
        sin_brasas in ("vacio", "no hay canvas"),
        str(sin_brasas),
    )
    contexto_quieto.close()

    # ---------------- cabeceras de seguridad ----------------
    # No cambian nada de lo que se ve, asi que se rompen sin que nadie lo note. Por eso se chequean.
    print("\ncabeceras de seguridad")
    respuesta_cab = pagina.request.get(BASE + "/")
    recibidas = {k.lower(): v for k, v in respuesta_cab.headers.items()}
    for cabecera, esperado in CABECERAS_ESPERADAS.items():
        valor = recibidas.get(cabecera, "")
        chequear(
            f"{cabecera} presente y con {esperado}",
            esperado.lower() in valor.lower(),
            f'valor recibido: "{valor}"' if valor else "la cabecera no vino",
        )

    # El CSP no puede permitir scripts de cualquier origen: eso lo volveria decorativo.
    csp = recibidas.get("content-security-policy", "")
    chequear(
        "el CSP no abre script-src a cualquier dominio",
        "script-src" in csp and "*" not in csp.split("script-src")[1].split(";")[0],
        csp,
    )
    # Sin esta, el CSP no protege contra que le cambien la base a todos los links relativos.
    chequear("el CSP declara base-uri", "base-uri" in csp, csp)

    # Que no se filtre el servidor ni su version.
    chequear(
        "no se anuncia la tecnologia del servidor",
        "x-powered-by" not in recibidas,
        f'x-powered-by: {recibidas.get("x-powered-by")}',
    )

    # ---------------- presupuesto de JavaScript ----------------
    #
    # La direccion visual de globals.css declara un techo: el JavaScript servido no pasa de
    # TECHO_JS_KB comprimido. Existe porque el pedido original de la parte visual traia cuatro
    # librerias de animacion que medidas suman entre 130 y 180 KB y duplicaban el peso de la pagina.
    # Se resolvio con CSS y un canvas propio.
    #
    # Sin este chequeo el techo es una frase en un comentario. Con el, agregar una libreria grande
    # rompe la verificacion en vez de pasar desapercibido hasta que alguien mire el informe de
    # rendimiento.
    print("\npresupuesto de JavaScript")
    contexto_medido = navegador.new_context(viewport={"width": 390, "height": 844})
    pagina_medida = contexto_medido.new_page()

    bytes_js = {}

    def anotar(respuesta):
        """
        Anota cuanto pesaria cada archivo JS al viajar por la red.

        Se comprime el cuerpo aca en lugar de leer `content-length`, y el motivo aparecio midiendo:
        el servidor local devolvia los archivos sin comprimir, asi que `content-length` daba 508 KB
        contra un techo declarado en 210 KB comprimidos. Comparaba dos unidades distintas.

        Comprimiendo nosotros, el numero es el mismo corriendo contra el servidor local o contra
        Vercel, y no depende de que el servidor de turno tenga la compresion prendida.
        """
        url = respuesta.url
        if not url.endswith(".js"):
            return
        try:
            bytes_js[url] = len(gzip.compress(respuesta.body(), compresslevel=6))
        except Exception:
            pass

    pagina_medida.on("response", anotar)
    pagina_medida.goto(BASE + "/", wait_until=LISTA)
    pagina_medida.wait_for_timeout(ESPERA_HIDRATACION)

    total_kb = round(sum(bytes_js.values()) / 1024)
    chequear(
        f"la portada sirve {total_kb} KB de JavaScript comprimido, techo {TECHO_JS_KB} KB",
        total_kb <= TECHO_JS_KB,
        f"{len(bytes_js)} archivos; los mas grandes: "
        + ", ".join(
            f"{u.split('/')[-1]} {round(b / 1024)}KB"
            for u, b in sorted(bytes_js.items(), key=lambda x: -x[1])[:3]
        ),
    )
    contexto_medido.close()

    # ---------------- pagina de 404 ----------------
    # Desde una campana de anuncios este caso pasa seguido: cualquier link mal copiado cae aca. La
    # 404 por defecto de Next no tiene los estilos del sitio y se lee como haberse ido del sitio.
    print("\npagina de 404")
    respuesta_404 = pagina.goto(BASE + "/esta-ruta-no-existe-nunca", wait_until=LISTA)
    chequear(
        "una ruta inexistente responde 404",
        respuesta_404 is not None and respuesta_404.status == 404,
        f"status {respuesta_404.status if respuesta_404 else '?'}",
    )
    chequear("la 404 conserva la cabecera", pagina.locator("header").count() == 1)
    chequear("la 404 conserva el pie", pagina.locator("footer").count() == 1)
    chequear("la 404 tiene exactamente un h1", pagina.locator("h1").count() == 1)
    chequear(
        "la 404 ofrece volver a la portada",
        pagina.locator('main a[href="/"]').count() > 0,
    )
    # Next inyecta noindex en las paginas que responden 404: sin eso Google indexa la pagina de error.
    chequear(
        "la 404 declara noindex",
        pagina.locator('meta[name="robots"][content*="noindex"]').count() > 0,
    )

    navegador.close()

print("")
if fallas:
    print(f"FALLARON {len(fallas)} chequeos:")
    for f in fallas:
        print(f"  - {f}")
    print("")
    sys.exit(1)
print("TODO OK\n")
sys.exit(0)
