@echo off
setlocal
cd /d "%~dp0"
set "PORT=3000"
set "CLOUDFLARED="

for /f "delims=" %%i in ('where cloudflared 2^>nul') do if not defined CLOUDFLARED set "CLOUDFLARED=%%i"
if not defined CLOUDFLARED set "CLOUDFLARED=%LOCALAPPDATA%\Microsoft\WinGet\Packages\Cloudflare.cloudflared_Microsoft.Winget.Source_8wekyb3d8bbwe\cloudflared.exe"

if not exist "%CLOUDFLARED%" (
  echo Falta Cloudflare Tunnel. Ejecuta una vez este comando en PowerShell:
  echo winget install --id Cloudflare.cloudflared --exact --scope user
  pause
  exit /b 1
)

rem Inicia el servidor si Kripta no esta ya abierta en el puerto local.
powershell.exe -NoProfile -Command "exit [int](-not (Test-NetConnection -ComputerName 127.0.0.1 -Port %PORT% -InformationLevel Quiet))"
if errorlevel 1 (
  start "Kripta: servidor local" /d "%cd%" cmd /k call iniciar-kripta.bat
)

rem Espera a que Next responda antes de crear el enlace publico temporal.
for /l %%i in (1,1,60) do (
  powershell.exe -NoProfile -Command "exit [int](-not (Test-NetConnection -ComputerName 127.0.0.1 -Port %PORT% -InformationLevel Quiet))"
  if not errorlevel 1 goto compartir
  timeout /t 1 /nobreak >nul
)

echo No se pudo iniciar Kripta en el puerto %PORT%.
pause
exit /b 1

:compartir
echo.
echo Creando un enlace temporal para el celular...
echo Copia la URL https que aparecera abajo y abrila en Chrome.
echo Mantene esta ventana abierta mientras revisas la web.
echo.
"%CLOUDFLARED%" tunnel --url http://localhost:%PORT%
pause
