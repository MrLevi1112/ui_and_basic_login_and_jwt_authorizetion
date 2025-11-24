@echo off
setlocal enabledelayedexpansion

REM Set JAVA_HOME
set "JAVA_HOME=C:\Program Files\Java\jdk-17"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo Building project with Maven Wrapper...
echo.

REM Use Maven wrapper with proper quoting
"%JAVA_HOME%\bin\java.exe" -classpath ".mvn\wrapper\maven-wrapper.jar" "-Dmaven.multiModuleProjectDirectory=%CD%" org.apache.maven.wrapper.MavenWrapperMain %*

endlocal
