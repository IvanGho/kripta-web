@echo off
setlocal
cd /d "%~dp0"
set "PORT=3000"
set "URL=http://localhost:3000"
set "LAN_IP="

for /f %%i in ('powershell.exe -NoProfile -Command "Get-NetIPAddress -AddressFamily IPv4 ^| Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254*' -and $_.InterfaceAlias -notmatch 'Loopback' } ^| Select-Object -First 1 -ExpandProperty IPAddress"') do set "LAN_IP=%%i"

echo.
echo  Kripta se abrira en esta PC: %URL%
if defined LAN_IP echo  Para verla desde el celular conectado al mismo Wi-Fi: http://%LAN_IP%:%PORT%
echo.

rem Abre el navegador solo cuando Next ya responde, para evitar una pagina de error al arrancar.
start "" /b powershell.exe -NoProfile -WindowStyle Hidden -Command "$url='%URL%'; for ($i = 0; $i -lt 80; $i++) { try { $respuesta = Invoke-WebRequest -UseBasicParsing $url -TimeoutSec 1; if ($respuesta.StatusCode -lt 500) { Start-Process $url; exit 0 } } catch {}; Start-Sleep -Milliseconds 500 }"
npm run dev:lan
pause
