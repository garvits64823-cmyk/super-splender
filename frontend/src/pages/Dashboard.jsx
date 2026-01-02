import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }

    // Redirect to services page
    navigate('/services');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container">
      <div className="admin-header">
        <h2>Welcome, {user.name}!</h2>
        <div>
          <button onClick={() => navigate('/profile')} style={{width: 'auto', marginRight: '10px', background: '#28a745'}}>
            Edit Profile
          </button>
          <button onClick={handleLogout} style={{width: 'auto', background: '#dc3545'}}>
            Logout
          </button>
        </div>
      </div>

      <div style={{background: '#f8f9fa', padding: '20px', borderRadius: '8px'}}>
        <h3>Your Profile</h3>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email || 'Not provided'}</p>
        <p><strong>Phone:</strong> {user.phone || 'Not provided'}</p>
      </div>

      <div style={{marginTop: '20px', textAlign: 'center'}}>
        <p>You have successfully logged in to the application!</p>
      </div>
    </div>
  );
};

export default Dashboard;