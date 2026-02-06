# User Authentication App - Public Demo

A full-stack user authentication prototype with admin panel.

## 🚀 Quick Start

### Local Setup

**Backend:**
```bash
cd backend
npm install
npm start
```
Server runs on: http://localhost:5000

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
App runs on: http://localhost:3000

## 📱 Features

- ✅ Public Dashboard (No Login Required)
- ✅ User Profile Management
- ✅ 4 Service Options (Food, Grocery, Parcel, Bike Taxi)
- ✅ Admin Panel with User Management
- ✅ Email/SMS Notifications
- ✅ Password Reset Functionality

## 🔑 Admin Access

- URL: http://localhost:3000/admin
- Email: `admin@app.com`
- Password: `admin123`

## 🌐 Deploy to GitHub Pages / Vercel / Netlify

### For Frontend (Vercel/Netlify):
1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variable: `VITE_API_URL=your-backend-url`

### For Backend (Render/Railway):
1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set start command: `npm start`
4. Add environment variables from `.env`

## 📦 Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: SQLite
- Authentication: JWT

## 🎯 Public Access

The app is configured for public access - no login required to view dashboard and services!

---

**Ready for deployment!**