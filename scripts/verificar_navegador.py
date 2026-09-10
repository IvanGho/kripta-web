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

import os
import re
import sys

from playwright.sync_api import sync_playwright

BASE = os.environ.get("BASE", "http://localhost:3000")

# Todas las paginas del sitio. Tiene que coincidir con PAGINAS de app/lib/sitio.ts: el chequeo del
# sitemap compara contra el largo de esta lista, asi que agregar una pagina alla y olvidarse aca
# hace fallar la verificacion en vez de pasar desapercibido.
RUTAS = ["/", "/anotador", "/sensibilidad", "/privacidad", "/terminos"]

# Las paginas que declaran datos estructurados para Google. Las dos legales no estan y no deberian:
# no hay ningun tipo de schema.org que corresponda a una politica de privacidad, y declarar uno
# inventado es peor que no declarar nada.
RUTAS_CON_SCHEMA = ["/", "/anotador", "/sensibilidad"]

# Las dos paginas de texto legal, que tienen sus propios chequeos.
RUTAS_LEGALES = ["/privacidad", "/terminos"]

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
