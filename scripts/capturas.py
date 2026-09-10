"""
Capturas de la portada para revisar el diseno a ojo.

Saca la portada completa y cada seccion, en telefono y escritorio, a una carpeta que .gitignore
excluye. Es para mirar y adjuntar a un PR, no para versionar.

Preparar una vez:
    pip install playwright && python -m playwright install chromium

Usar:
    npm run build && npm start -- --port 3100     (en otra terminal)
    $env:BASE = "http://localhost:3100"; npm run capturas
"""

import os

from playwright.sync_api import sync_playwright

BASE = os.environ.get("BASE", "http://localhost:3100")
SALIDA = "capturas"

# Los dos viewports que importan: 390 es el telefono de referencia del proyecto y 1440 el escritorio.
VISTAS = [("tel", 390, 844), ("esc", 1440, 900)]

RUTAS = [
    ("/", "portada"),
    ("/anotador", "anotador"),
    ("/sensibilidad", "sensibilidad"),
    ("/legal/privacidad", "privacidad"),
    ("/legal/terminos", "terminos"),
    ("/legal/derechos", "derechos"),
    ("/esta-ruta-no-existe", "404"),
]

os.makedirs(SALIDA, exist_ok=True)

with sync_playwright() as p:
    navegador = p.chromium.launch()
    for nombre, ancho, alto in VISTAS:
        pagina = navegador.new_context(viewport={"width": ancho, "height": alto}).new_page()
        for ruta, archivo in RUTAS:
            pagina.goto(BASE + ruta, wait_until="load")

            # Las apariciones al scrollear estan atadas a la posicion del elemento en la ventana. En
            # una captura de pagina completa el navegador renderiza todo de una vez, asi que las
            # secciones que "todavia no entraron" saldrian en su estado inicial y la imagen apareceria
            # medio vacia.
            #
            # Se desactivan para capturar. No es esconder un problema: es que la captura muestre lo
            # que ve una persona que scrollea, que es lo que se quiere revisar. Que el efecto ande se
            # verifica aparte, en verificar_navegador.py.
            #
            # Va DESPUES del goto y dentro del bucle: cada navegacion es un documento nuevo, asi que
            # una etiqueta agregada antes se pierde.
            pagina.add_style_tag(
                content=".aparece { animation: none !important; opacity: 1 !important;"
                " transform: none !important; }"
            )
            pagina.wait_for_timeout(600)

            destino = f"{SALIDA}/{archivo}-{nombre}.png"
            pagina.screenshot(path=destino, full_page=True)
            print(f"  {destino}")
    navegador.close()

print("\nListo. Estan en la carpeta capturas/, que .gitignore excluye.\n")
