@echo off
setlocal
cd /d "%~dp0"
set "PORT=3000"

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
ssh -o StrictHostKeyChecking=accept-new -o ServerAliveInterval=30 -R 80:localhost:%PORT% nokey@localhost.run
pause
