import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="admin-header">
        <h2>Welcome to User Auth App Demo</h2>
      </div>

      <div style={{background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px'}}>
        <h3>Demo User Profile</h3>
        <p><strong>Name:</strong> Demo User</p>
        <p><strong>Email:</strong> demo@example.com</p>
        <p><strong>Phone:</strong> +1234567890</p>
        <p><strong>Status:</strong> Active</p>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px'}}>
        <button onClick={() => navigate('/profile')} style={{background: '#28a745'}}>
          View Profile
        </button>
        <button onClick={() => navigate('/admin')} style={{background: '#007bff'}}>
          Admin Panel
        </button>
        <button onClick={() => navigate('/login')} style={{background: '#6c757d'}}>
          Login Page (Demo)
        </button>
      </div>

      <div style={{marginTop: '30px', padding: '20px', background: '#e9ecef', borderRadius: '8px'}}>
        <h4>App Features:</h4>
        <ul>
          <li>✅ User Authentication (Email/Phone + OTP)</li>
          <li>✅ Profile Management</li>
          <li>✅ Password Reset</li>
          <li>✅ Admin Dashboard</li>
          <li>✅ User Management (Block/Unblock)</li>
          <li>✅ Email/SMS Notifications</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;