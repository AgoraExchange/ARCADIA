@echo off
setlocal
cd /d "%~dp0"
powershell.exe -NoProfile -WindowStyle Hidden -Command "Start-Process -FilePath 'node.exe' -ArgumentList @('arcadia-local-server.mjs','--open') -WorkingDirectory (Get-Location).Path -WindowStyle Hidden"
endlocal
