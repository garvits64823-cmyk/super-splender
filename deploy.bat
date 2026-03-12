@echo off
echo ========================================
echo    Super Splender - Deployment Setup
echo ========================================
echo.

echo Step 1: Building Frontend for Production...
cd frontend
call npm run build
echo ✅ Frontend built successfully!
echo.

echo Step 2: Deployment Options:
echo.
echo 🚀 BACKEND DEPLOYMENT:
echo   1. Railway: https://railway.app
echo   2. Render: https://render.com  
echo   3. Heroku: https://heroku.com
echo.
echo 🌐 FRONTEND DEPLOYMENT:
echo   1. Netlify: https://netlify.com
echo   2. Vercel: https://vercel.com
echo   3. GitHub Pages
echo.

echo 📋 DEPLOYMENT CHECKLIST:
echo   [ ] Push code to GitHub repository
echo   [ ] Deploy backend first (Railway/Render/Heroku)
echo   [ ] Update frontend/src/config.js with backend URL
echo   [ ] Deploy frontend (Netlify/Vercel)
echo   [ ] Test the live application
echo.

echo 🔗 Your app will be live at:
echo   Frontend: https://your-app-name.netlify.app
echo   Backend: https://your-app-name.railway.app
echo.

echo ========================================
echo Ready for deployment! 🚀
echo ========================================
pause