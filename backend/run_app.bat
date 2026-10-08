@echo off
cd /d "%~dp0"

echo Starting Road Damage AI...
start "Road Damage AI Server" cmd /k "python server.py"

timeout /t 8 /nobreak >nul

start "" "http://127.0.0.1:5000/"

exit