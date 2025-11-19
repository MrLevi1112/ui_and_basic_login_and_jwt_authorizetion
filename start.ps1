# Crash2Cost - הפעלת המערכת

# צבעים להדפסה
$Green = "Green"
$Cyan = "Cyan"
$Yellow = "Yellow"

Write-Host "========================================" -ForegroundColor $Cyan
Write-Host "   Starting Crash2Cost Application" -ForegroundColor $Cyan
Write-Host "========================================" -ForegroundColor $Cyan
Write-Host ""

# נתיב בסיס
$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# הפעלת Backend
Write-Host "[1/2] Starting Backend Server..." -ForegroundColor $Green
$backendPath = Join-Path $baseDir "backend"
$venvPython = Join-Path $baseDir ".venv\Scripts\python.exe"
$runScript = Join-Path $backendPath "run.py"

Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "& {Set-Location '$backendPath'; & '$venvPython' '$runScript'}"
) -WindowStyle Normal

# המתנה של 3 שניות
Write-Host "Waiting for backend to initialize..." -ForegroundColor $Yellow
Start-Sleep -Seconds 3

# הפעלת Frontend
Write-Host "[2/2] Starting Frontend Server..." -ForegroundColor $Green
$frontendPath = Join-Path $baseDir "client"

Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "& {Set-Location '$frontendPath'; npm run dev}"
) -WindowStyle Normal

Write-Host ""
Write-Host "========================================" -ForegroundColor $Cyan
Write-Host "   Both servers are starting!" -ForegroundColor $Cyan
Write-Host "========================================" -ForegroundColor $Cyan
Write-Host ""
Write-Host "Backend:  " -NoNewline
Write-Host "http://127.0.0.1:8001" -ForegroundColor $Yellow
Write-Host "Frontend: " -NoNewline
Write-Host "http://localhost:5173" -ForegroundColor $Yellow
Write-Host ""
Write-Host "Press any key to exit this window..." -ForegroundColor $Green
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
