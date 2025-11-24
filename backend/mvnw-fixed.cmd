@echo off
REM Simple Maven Wrapper Script

setlocal

REM Check JAVA_HOME
if "%JAVA_HOME%" == "" (
    echo Error: JAVA_HOME not found in your environment.
    echo Please set the JAVA_HOME variable in your environment to match the
    echo location of your Java installation.
    exit /b 1
)

if not exist "%JAVA_HOME%\bin\java.exe" (
    echo Error: JAVA_HOME is set to an invalid directory: %JAVA_HOME%
    echo Please set the JAVA_HOME variable in your environment to match the
    echo location of your Java installation.
    exit /b 1
)

REM Get script directory
set "SCRIPT_DIR=%~dp0"
set "MAVEN_PROJECTBASEDIR=%SCRIPT_DIR%"

REM Check if wrapper jar exists
if not exist "%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.jar" (
    echo Downloading Maven Wrapper...
    powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar' -OutFile '%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.jar'}"
    if errorlevel 1 (
        echo Error downloading Maven Wrapper
        exit /b 1
    )
)

REM Execute Maven
"%JAVA_HOME%\bin\java.exe" ^
    -classpath "%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.jar" ^
    "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" ^
    org.apache.maven.wrapper.MavenWrapperMain %*

endlocal
