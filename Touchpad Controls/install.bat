@echo off
echo Installing Mobile Touchpad Controller...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Node.js found!
echo Installing dependencies...
echo.

npm install

if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo ✅ Installation complete!
echo.
echo To start the server, run:
echo   npm start
echo.
echo Then open http://localhost:3000/controller in your browser
echo.
pause