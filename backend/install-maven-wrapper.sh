#!/bin/bash

echo "================================"
echo "Installing Maven Wrapper..."
echo "================================"

cd backend-springboot

# Download Maven Wrapper if it doesn't exist
if [ ! -f "mvnw" ]; then
    mvn -N io.takari:maven:wrapper
fi

# Make mvnw executable
chmod +x mvnw

echo "✅ Maven wrapper installed successfully!"
echo ""
echo "You can now run the application with:"
echo "  Windows: start-springboot.bat"
echo "  PowerShell: start-springboot.ps1"
echo "  Or manually: cd backend-springboot && ./mvnw spring-boot:run"
