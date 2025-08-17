@echo off
echo Starting TikiriCare Backend...
echo.

REM Check if Ballerina is installed
bal --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Ballerina is not installed or not in PATH
    echo Please install Ballerina from https://ballerina.io/
    pause
    exit /b 1
)

echo Building project...
bal build
if %errorlevel% neq 0 (
    echo Error: Build failed
    pause
    exit /b 1
)

echo.
echo Starting server on port 8080...
echo Press Ctrl+C to stop the server
echo.

bal run

pause 