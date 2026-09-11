# Ver Kripta en vivo desde el celular

Este flujo muestra el servidor local de desarrollo: los cambios aparecen al guardar, sin commit, push, Vercel ni deploy.

## Inicio con un doble clic

1. En la PC, hace doble clic en `abrir-kripta-en-celular.bat`.
2. El archivo inicia Kripta si todavia no esta corriendo y crea una URL temporal `https://...lhr.life`.
3. Copia esa URL desde la ventana negra y pegala en Chrome del celular.
4. Mantene abiertas las dos ventanas de la PC mientras revisas. Cuando cierres la ventana del enlace, la URL deja de funcionar.

El enlace temporal sirve tambien cuando el celular usa datos moviles, como en la captura donde aparece 4G.

## Si el celular y la PC usan el mismo Wi-Fi

No hace falta un enlace temporal. Con `iniciar-kripta.bat` abierto, visita en el celular la direccion que muestra la ventana, por ejemplo `http://192.168.0.191:3000`.

La direccion puede cambiar cuando se reinicia el router. El archivo `.bat` siempre muestra la correcta al iniciar.

## Que usar en cada caso

| Necesidad | Usar |
| --- | --- |
| Quiero ver un cambio mientras lo estamos editando | `abrir-kripta-en-celular.bat` |
| Estoy en el mismo Wi-Fi y no quiero publicar un enlace temporal | `iniciar-kripta.bat` y la URL de red que muestra |
| Quiero revisar una version ya subida sin que la PC este encendida | Vercel Preview |
| Quiero que los visitantes reales vean el cambio | Merge a `main` y deploy de produccion |

La URL temporal permite ver una pagina local desde fuera de la red. Usala solo para revision visual mientras trabajamos; no cargues secretos ni datos reales en esa sesion.
