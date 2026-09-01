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
    python scripts/verificar_navegador.py

Variables: BASE (por defecto http://localhost:3000).
"""

import os
import sys

from playwright.sync_api import sync_playwright

BASE = os.environ.get("BASE", "http://localhost:3000")
RUTAS = ["/", "/anotador", "/sensibilidad"]

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
        respuesta = pagina.goto(BASE + ruta, wait_until="networkidle")
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
        pagina.goto(BASE + ruta, wait_until="networkidle")
        chequear(f"{ruta} tiene un <main>", pagina.locator("main").count() == 1)
        chequear(f"{ruta} tiene exactamente un h1", pagina.locator("h1").count() == 1)
        # Un enlace para saltar el header pegajoso, que tiene varios elementos tabulables.
        salto = pagina.locator('a[href="#contenido"]')
        chequear(f"{ruta} tiene enlace para saltar al contenido", salto.count() == 1)

    # ---------------- la tabla del ranking ----------------
    print("\ntabla del ranking")
    pagina.goto(BASE + "/", wait_until="networkidle")
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
    pagina.goto(BASE + "/", wait_until="networkidle")
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
    pagina.goto(BASE + "/sensibilidad", wait_until="networkidle")
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
    pagina.goto(BASE + "/", wait_until="networkidle")
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
    pagina.goto(BASE + "/anotador", wait_until="networkidle")
    pagina.evaluate("() => window.localStorage.removeItem('kripta:anotador')")
    pagina.reload(wait_until="networkidle")

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
    pagina.reload(wait_until="networkidle")
    pagina.wait_for_timeout(300)
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
    pagina.goto(BASE + "/sensibilidad", wait_until="networkidle")
    pagina.evaluate("() => window.localStorage.removeItem('kripta:sensibilidad')")
    pagina.reload(wait_until="networkidle")

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
    pagina.reload(wait_until="networkidle")
    pagina.wait_for_timeout(300)
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
    for ruta in ["/anotador", "/sensibilidad"]:
        chequear(f"el sitemap incluye {ruta}", ruta in cuerpo_mapa)
    chequear("el sitemap tiene las tres paginas", cuerpo_mapa.count("<loc>") == 3, f'{cuerpo_mapa.count("<loc>")} urls')

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
        pagina.goto(BASE + ruta, wait_until="networkidle")
        canonical = pagina.locator('link[rel="canonical"]')
        chequear(
            f"{ruta} declara canonical",
            canonical.count() == 1,
            f"encontrados {canonical.count()}",
        )

    # JSON-LD: que exista y que sea JSON valido. Un bloque roto no da error visible en la
    # pagina, simplemente lo ignoran los buscadores y nadie se entera.
    import json as _json

    for ruta in RUTAS:
        pagina.goto(BASE + ruta, wait_until="networkidle")
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
