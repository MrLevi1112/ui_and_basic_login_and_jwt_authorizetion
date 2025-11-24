# Start Spring Boot Backend
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Starting Crash2Cost Application" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if Java is installed
try {
    $javaVersion = java -version 2>&1 | Out-String
    Write-Host "OK - Java is installed" -ForegroundColor Green
}
catch {
    Write-Host "ERROR: Java is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Java 17 or higher from: https://adoptium.net/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

$rootDir = Join-Path $PSScriptRoot ".."

Write-Host "[1/2] Starting Spring Boot backend on port 8001..." -ForegroundColor Yellow
$backendScript = Join-Path $rootDir "backend\mvn.ps1"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\backend'; & '$backendScript' spring-boot:run"

Start-Sleep -Seconds 5

Write-Host "[2/2] Starting React frontend on port 5173..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\frontend\client'; npm run dev"

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "Both servers are starting..." -ForegroundColor Green
Write-Host "Backend: http://127.0.0.1:8001" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Tip: Wait ~10 seconds for backend to fully start" -ForegroundColor Yellow
