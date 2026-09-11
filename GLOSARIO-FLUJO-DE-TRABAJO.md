# Glosario y flujo de trabajo — Kripta

Esta guía está pensada para trabajar desde Orca y desde el celular sin mezclar cambios en prueba con la web pública.

## El circuito recomendado

Orca en el celular → rama vista-previa → GitHub → Vercel Preview → enlace para revisar → aprobación → main → Vercel Production → web pública.

La rama vista-previa sirve para probar. main es la versión pública. Cada vez que yo suba un cambio a vista-previa, Vercel crea una versión revisable; cuando confirmes que está bien, la incorporo a main y Vercel publica la versión oficial.

## Cómo editar desde Orca en el celular

1. Abrí el enlace de preview que te pase y agregalo a favoritos.
2. Activá el selector de elementos de Orca si aparece en la interfaz.
3. Tocá el bloque, texto o botón que querés cambiar.
4. Escribime el cambio concreto. Ejemplos:
   - “En el hero, cambiá ‘La noche es nuestra’ por ‘Tu comunidad empieza de noche’.”
   - “Este botón debe decir ‘Ver torneos’ y llevar a la agenda.”
   - “Esta tarjeta tiene demasiado verde; hacela más sobria.”
5. Yo modifico, pruebo, hago commit y push a vista-previa. Te paso el enlace actualizado.

Si Orca no muestra un selector en el celular, no pasa nada: copiá el título visible del bloque o mandame una captura y describí la modificación. La estructura de la web permite localizar cada sección por su título.

## Enlaces actuales

| Para qué | Enlace |
| --- | --- |
| Producción pública | https://kripta-web.vercel.app |
| Vista previa para Orca | https://kripta-web-git-vista-previa-monsterland.vercel.app |
| Local en la PC | http://localhost:3000 |
| Local de revisión temporal | http://localhost:3208 |
| Panel Vercel | https://vercel.com/monsterland |

El dominio kripta.infinixapp.com se usará cuando su DNS esté configurado. Mientras tanto, kripta-web.vercel.app es el enlace público válido.

## Cuándo usar cada término

| Término | Qué significa | Cuándo usarlo |
| --- | --- | --- |
| Modificar | Cambiar código, textos, estilos o imágenes. | Cuando definimos un ajuste. |
| Testear | Comprobar que el cambio funciona, carga bien y no rompe otra sección. | Siempre antes de publicar. |
| Commit | Guardar una versión identificable en Git en la computadora. | Cuando un cambio ya está probado. |
| Push | Subir los commits a GitHub. | Para respaldar y activar Vercel. |
| Rama | Línea de trabajo separada. | vista-previa para probar; main para producción. |
| Preview | Despliegue temporal de Vercel vinculado a una rama. | Para revisar desde Orca o el celular antes de publicar. |
| Merge | Integrar una rama aprobada dentro de otra. | Cuando aprobás el preview para producción. |
| Deploy | Proceso que construye y publica Vercel. | Automático después del push. |
| Producción | La versión que ven visitantes reales. | La rama main. |
| Rollback o revertir | Crear una versión que deshace un cambio publicado. | Si una publicación presenta un problema. |

## Comandos esenciales

Los comandos se usan solamente desde la PC, dentro de la carpeta kripta-web. Desde el celular usás Orca y los enlaces de Vercel.

| Objetivo | Comando o acción | Cuándo |
| --- | --- | --- |
| Abrir la web local | Doble clic en iniciar-kripta.bat | Para verla y editar desde la PC. Abre el navegador solo. |
| Instalar dependencias | npm install | Sólo al preparar una PC nueva o si cambia package.json. |
| Servidor local manual | npm run dev | Cuando preferís usar terminal en vez del archivo .bat. |
| Compilar como Vercel | npm run build | Antes de un cambio importante o publicación. |
| Prueba completa de navegador | npm run verificar-navegador | Después de cambios de interfaz o funcionalidades. Requiere que la web esté abierta. |
| Ver cambios pendientes | git status | Antes de guardar o subir cambios. |
| Guardar una versión | git commit -m "descripción clara" | Después de pruebas exitosas. |
| Subir a preview | git push origin vista-previa | Para que Vercel prepare una vista revisable. |
| Subir producción | git push origin main | Sólo después de aprobar una preview. |
| Ver estado de Vercel | GitHub → commit → checks, o panel de Vercel | Cuando esperás un deploy. |

No necesitás memorizar esto: antes de cada paso que dependa de un comando, voy a recordarte qué usar, para qué sirve y qué resultado esperar.

## Regla práctica

- Cambio visual pequeño: preview.
- Cambio funcional, login, pagos o datos: preview más pruebas completas.
- Cambio aprobado: merge a main más deploy.
- Error en producción: avisame qué viste y la URL; primero verifico y después revierto de forma recuperable si hace falta.

## Flujo para una sesión desde el celular

1. Abrís el preview en Orca.
2. Elegís un elemento con el selector o me mandás una captura.
3. Describís la modificación.
4. Yo implemento, pruebo y publico la preview.
5. Repetimos hasta que quede como querés.
6. Decís “pasalo a producción”.
7. Integro la preview a main y Vercel la publica.

La guía de identidad visual está en IDENTIDAD.md y los prompts de las imágenes en IMAGENES.md.
