@echo off
echo ================================
echo Installing Maven Wrapper...
echo ================================

cd backend-springboot

REM Download Maven Wrapper if it doesn't exist
if not exist "mvnw.cmd" (
    mvn -N io.takari:maven:wrapper
)

echo.
echo ✅ Maven wrapper installed successfully!
echo.
echo You can now run the application with:
echo   start-springboot.bat
echo   Or manually: cd backend-springboot ^&^& mvnw.cmd spring-boot:run

pause
