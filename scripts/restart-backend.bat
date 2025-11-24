@echo off
echo Restarting Spring Boot backend...

REM Change to backend directory
cd /d "%~dp0..\backend"

REM Run Maven with PowerShell script
echo Starting backend...
echo Working directory: %CD%
powershell -ExecutionPolicy Bypass -File mvn.ps1 spring-boot:run
