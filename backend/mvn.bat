@echo off
setlocal

REM Set JAVA_HOME
set "JAVA_HOME=C:\Program Files\Java\jdk-17"

REM Set project base directory
set "MAVEN_PROJECTBASEDIR=%~dp0"

REM Run Maven wrapper directly
"%JAVA_HOME%\bin\java.exe" ^
  -classpath "%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.jar" ^
  "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" ^
  org.apache.maven.wrapper.MavenWrapperMain %*
