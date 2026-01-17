@echo off
echo 🚀 Deploying Mobile Touchpad Controller to Vercel...
echo.

REM Add Node.js to PATH for this session
set PATH=C:\Program Files\nodejs;%PATH%

REM Check if we can run node and vercel
echo Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js first.
    pause
    exit /b 1
)

echo Checking Vercel CLI...
vercel --version
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI not found. Installing...
    npm install -g vercel
)

echo.
echo 🌐 Starting deployment...
echo.

REM Deploy to Vercel
vercel --prod

echo.
echo ✅ Deployment complete!
echo 📱 Your Mobile Touchpad Controller is now live!
echo.
pause