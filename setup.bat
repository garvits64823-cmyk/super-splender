@echo off
echo ========================================
echo    Super Splender - Setup Script
echo ========================================
echo.

echo Installing backend dependencies...
cd backend
npm install
if %errorlevel% neq 0 (
    echo Failed to install backend dependencies!
    pause
    exit /b 1
)

echo.
echo Installing frontend dependencies...
cd ..
cd frontend
npm install
if %errorlevel% neq 0 (
    echo Failed to install frontend dependencies!
    pause
    exit /b 1
)

echo.
echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo To start the application:
echo 1. Backend: cd backend ^&^& npm run dev
echo 2. Frontend: cd frontend ^&^& npm run dev
echo.
echo Default Admin Credentials:
echo Email: supersplender@superapp.com
echo Password: garvit@648
echo.
echo Access URLs:
echo - User App: http://localhost:3000
echo - Admin Panel: http://localhost:3000/admin
echo - Backend API: http://localhost:5001
echo.
pause