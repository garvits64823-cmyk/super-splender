import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Services from './pages/Services';
import FoodDelivery from './pages/FoodDelivery';
import GroceryPickup from './pages/GroceryPickup';
import ParcelDrop from './pages/ParcelDrop';
import BikeTaxi from './pages/BikeTaxi';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import PasswordReset from './pages/PasswordReset';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import CompanySettings from './pages/CompanySettings';
import PricingManagement from './pages/PricingManagement';
import OrderConfirmation from './pages/OrderConfirmation';
import PublicProfile from './pages/PublicProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/food-delivery" element={<FoodDelivery />} />
        <Route path="/services/grocery-pickup" element={<GroceryPickup />} />
        <Route path="/services/parcel-drop" element={<ParcelDrop />} />
        <Route path="/services/bike-taxi" element={<BikeTaxi />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reset-password" element={<PasswordReset />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/company" element={<CompanySettings />} />
        <Route path="/admin/pricing" element={<PricingManagement />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/profile/:userId" element={<PublicProfile />} />
      </Routes>
    </Router>
  );
}

export default App;