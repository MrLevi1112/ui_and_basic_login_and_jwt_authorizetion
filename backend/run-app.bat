@echo off
setlocal enabledelayedexpansion

REM Set JAVA_HOME
set "JAVA_HOME=C:\Program Files\Java\jdk-17"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo Starting Crash2Cost API...
echo.

REM Run the application
java -jar target\crash2cost-api-1.0.0.jar

endlocal
