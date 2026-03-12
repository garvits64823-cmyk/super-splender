import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn || !userData) {
      navigate('/enter-name');
      return;
    }

    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleBackToEntry = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    navigate('/enter-name');
  };

  const services = [
    {
      id: 1,
      name: 'Food Delivery',
      icon: '🍔',
      description: 'Order food from restaurants',
      route: '/food-delivery'
    },
    {
      id: 2,
      name: 'Grocery Pickup',
      icon: '🛒',
      description: 'Get groceries delivered',
      route: '/grocery-pickup'
    },
    {
      id: 3,
      name: 'Parcel Drop',
      icon: '📦',
      description: 'Send parcels anywhere',
      route: '/parcel-drop'
    },
    {
      id: 4,
      name: 'Bike Taxi',
      icon: '🏍️',
      description: 'Quick bike rides',
      route: '/bike-taxi'
    }
  ];

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container" style={{maxWidth: '800px'}}>
      <div className="admin-header">
        <h2>Welcome, {user.name}!</h2>
        <div>
          <button 
            onClick={() => navigate('/about')} 
            style={{width: 'auto', marginRight: '10px', background: '#17a2b8'}}
          >
            About
          </button>
          <button 
            onClick={() => navigate('/profile')} 
            style={{width: 'auto', marginRight: '10px', background: '#28a745'}}
          >
            Profile
          </button>
          <button onClick={handleBackToEntry} style={{width: 'auto', background: '#dc3545'}}>
            Change Name
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
        background: '#fff3cd',
        border: '1px solid #ffeaa7',
        padding: '25px',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h4 style={{margin: '0 0 15px 0', color: '#856404', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
          <span>🚧</span> Prototype Notice <span>🚧</span>
        </h4>
        <p style={{margin: '0 0 15px 0', color: '#856404', fontSize: '14px', lineHeight: '1.6'}}>
          You are currently viewing an early prototype of the QOX Transit platform. This version is intended only to demonstrate the concept and user flow of the product.
        </p>
        <p style={{margin: '0 0 15px 0', color: '#856404', fontSize: '14px', lineHeight: '1.6'}}>
          <strong>Certain features may be inactive, incomplete, or simulated.</strong>
        </p>
        <p style={{margin: '0 0 15px 0', color: '#856404', fontSize: '14px', lineHeight: '1.6'}}>
          Our team is working on launching the full-featured application soon.
        </p>
        <p style={{margin: '0 0 15px 0', color: '#856404', fontSize: '14px', lineHeight: '1.6'}}>
          Thank you for your patience and support.
        </p>
        <div style={{marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #ffeaa7'}}>
          <p style={{margin: '0 0 8px 0', color: '#856404', fontSize: '14px', fontWeight: 'bold'}}>
            We would love to hear your feedback or suggestions:
          </p>
          <a href="mailto:qoxtransit@gmail.com" style={{color: '#007bff', textDecoration: 'none', fontSize: '14px'}}>
            qoxtransit@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default Services;