import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import all pages
import LandingPage from './pages/LandingPage';
import NameEntry from './pages/NameEntry';
import Services from './pages/Services';
import About from './pages/About';
import FoodDelivery from './pages/FoodDelivery';
import GroceryPickup from './pages/GroceryPickup';
import ParcelDrop from './pages/ParcelDrop';
import BikeTaxi from './pages/BikeTaxi';
import OrderConfirmation from './pages/OrderConfirmation';
import OrderSuccess from './pages/OrderSuccess';
import Profile from './pages/Profile';
import PublicProfile from './pages/PublicProfile';

// Admin pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import PricingManagement from './pages/PricingManagement';
import CompanySettings from './pages/CompanySettings';
import AboutManagement from './pages/AboutManagement';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/enter-name" element={<NameEntry />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile/:userId" element={<PublicProfile />} />
        
        {/* User Routes */}
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
        <Route path="/admin/about" element={<AboutManagement />} />
      </Routes>
    </Router>
  );
}

export default App;