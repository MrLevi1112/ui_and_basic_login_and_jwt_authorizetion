@echo off
echo ========================================
echo    Starting Crash2Cost Application
echo ========================================
echo.

REM הפעלת Backend בטרמינל חדש
echo [1/2] Starting Backend Server...
start "Crash2Cost Backend" cmd /k "cd /d "%~dp0backend" && ..\\.venv\\Scripts\\python.exe run.py"

REM המתנה של 3 שניות
timeout /t 3 /nobreak > nul

REM הפעלת Frontend בטרמינל חדש
echo [2/2] Starting Frontend Server...
start "Crash2Cost Frontend" cmd /k "cd /d "%~dp0frontend\client" && npm run dev"

echo.
echo ========================================
echo    Both servers are starting!
echo ========================================
echo.
echo Backend:  http://127.0.0.1:8001
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit this window...
pause > nul
