import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import all pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import FoodDelivery from './pages/FoodDelivery';
import GroceryPickup from './pages/GroceryPickup';
import ParcelDrop from './pages/ParcelDrop';
import BikeTaxi from './pages/BikeTaxi';
import OrderConfirmation from './pages/OrderConfirmation';
import OrderSuccess from './pages/OrderSuccess';
import Profile from './pages/Profile';
import PublicProfile from './pages/PublicProfile';
import PasswordReset from './pages/PasswordReset';

// Admin pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import PricingManagement from './pages/PricingManagement';
import CompanySettings from './pages/CompanySettings';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/password-reset" element={<PasswordReset />} />
        <Route path="/profile/:userId" element={<PublicProfile />} />
        
        {/* User Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/services" element={<Services />} />
        <Route path="/food-delivery" element={<FoodDelivery />} />
        <Route path="/grocery-pickup" element={<GroceryPickup />} />
        <Route path="/parcel-drop" element={<ParcelDrop />} />
        <Route path="/bike-taxi" element={<BikeTaxi />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/pricing" element={<PricingManagement />} />
        <Route path="/admin/settings" element={<CompanySettings />} />
      </Routes>
    </Router>
  );
}

export default App;