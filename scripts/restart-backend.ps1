# Restart Backend Script
Write-Host "Restarting Spring Boot backend..." -ForegroundColor Cyan

# Set Java Home
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"

# Kill any existing Java processes on port 8001
$process = Get-NetTCPConnection -LocalPort 8001 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
if ($process) {
    Write-Host "Stopping existing backend on port 8001..." -ForegroundColor Yellow
    Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

# Change to backend directory
Set-Location "..\backend"

# Run Maven
Write-Host "Starting backend..." -ForegroundColor Green
$mavenWrapperJar = ".\.mvn\wrapper\maven-wrapper.jar"
& "$env:JAVA_HOME\bin\java.exe" -jar $mavenWrapperJar org.springframework.boot:spring-boot-maven-plugin:3.2.0:run
