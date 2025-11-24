@echo off
echo ================================
echo Starting Crash2Cost Application
echo ================================
echo.

REM Check if Java is installed
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java 17 or higher from: https://adoptium.net/
    pause
    exit /b 1
)

echo OK - Java is installed

REM Start Spring Boot Backend
echo [1/2] Starting Spring Boot backend on port 8001...
start "Crash2Cost Backend" cmd /k "cd /d "%~dp0backend" && powershell -ExecutionPolicy Bypass -File mvn.ps1 spring-boot:run"

timeout /t 5 /nobreak > nul

REM Start React Frontend
echo [2/2] Starting React frontend on port 5173...
start "Crash2Cost Frontend" cmd /k "cd /d "%~dp0frontend\client" && npm run dev"

echo.
echo ================================
echo Both servers are starting...
echo Backend: http://127.0.0.1:8001
echo Frontend: http://localhost:5173
echo ================================
echo.
echo Tip: Wait ~10 seconds for backend to fully start
pause
