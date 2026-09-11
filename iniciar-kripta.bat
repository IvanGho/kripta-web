@echo off
setlocal
cd /d "%~dp0"
set "PORT=3000"
set "URL=http://localhost:3000"

rem Abre el navegador solo cuando Next ya responde, para evitar una pagina de error al arrancar.
start "" /b powershell.exe -NoProfile -WindowStyle Hidden -Command "$url='%URL%'; for ($i = 0; $i -lt 80; $i++) { try { $respuesta = Invoke-WebRequest -UseBasicParsing $url -TimeoutSec 1; if ($respuesta.StatusCode -lt 500) { Start-Process $url; exit 0 } } catch {}; Start-Sleep -Milliseconds 500 }"
npm run dev
pause
