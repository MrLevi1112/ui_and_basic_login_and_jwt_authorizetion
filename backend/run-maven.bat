@echo off
setlocal

REM Set JAVA_HOME
set "JAVA_HOME=C:\Program Files\Java\jdk-17"

REM Run Maven wrapper
call mvnw.cmd %*
