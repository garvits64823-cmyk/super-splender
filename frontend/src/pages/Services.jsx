import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const services = [
    {
      id: 1,
      name: 'Food Delivery',
      icon: '🍔',
      description: 'Order food from restaurants',
      route: '/services/food-delivery'
    },
    {
      id: 2,
      name: 'Grocery Pickup',
      icon: '🛒',
      description: 'Get groceries delivered',
      route: '/services/grocery-pickup'
    },
    {
      id: 3,
      name: 'Parcel Drop',
      icon: '📦',
      description: 'Send parcels anywhere',
      route: '/services/parcel-drop'
    },
    {
      id: 4,
      name: 'Bike Taxi',
      icon: '🏍️',
      description: 'Quick bike rides',
      route: '/services/bike-taxi'
    }
  ];

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container" style={{maxWidth: '800px'}}>
      <div className="admin-header">
        <h2>Welcome, {user.name}!</h2>
        <div>
          <button 
            onClick={() => navigate('/profile')} 
            style={{width: 'auto', marginRight: '10px', background: '#28a745'}}
          >
            Profile
          </button>
          <button onClick={handleLogout} style={{width: 'auto', background: '#dc3545'}}>
            Logout
          </button>
        </div>
      </div>

      <div style={{marginBottom: '30px'}}>
        <h3>Choose a Service</h3>
        <p style={{color: '#666'}}>Select the service you need</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {services.map(service => (
          <div
            key={service.id}
            onClick={() => navigate(service.route)}
            style={{
              background: 'white',
              padding: '30px',
              borderRadius: '12px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'transform 0.2s, box-shadow 0.2s',
              border: '1px solid #f0f0f0'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-5px)';
              e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
            }}
          >
            <div style={{
              fontSize: '48px',
              marginBottom: '15px'
            }}>
              {service.icon}
            </div>
            <h3 style={{
              margin: '0 0 10px 0',
              color: '#333',
              fontSize: '20px'
            }}>
              {service.name}
            </h3>
            <p style={{
              margin: '0',
              color: '#666',
              fontSize: '14px'
            }}>
              {service.description}
            </p>
          </div>
        ))}
      </div>

      <div style={{
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h4 style={{margin: '0 0 10px 0'}}>Need Help?</h4>
        <p style={{margin: '0', color: '#666', fontSize: '14px'}}>
          Contact support for any assistance with our services
        </p>
      </div>
    </div>
  );
};

export default Services;