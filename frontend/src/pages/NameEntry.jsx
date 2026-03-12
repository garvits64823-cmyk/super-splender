import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NameEntry = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    // Store user data in localStorage for demo purposes
    const userData = {
      name: name.trim(),
      id: Date.now(), // Simple ID generation
      joinedAt: new Date().toISOString()
    };

    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    
    navigate('/services');
  };

  return (
    <div className="container" style={{maxWidth: '400px', marginTop: '100px'}}>
      <div style={{textAlign: 'center', marginBottom: '30px'}}>
        <h2 style={{color: '#333', marginBottom: '10px'}}>Welcome!</h2>
        <p style={{color: '#666', fontSize: '16px'}}>
          Enter your name to explore our services
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label style={{fontSize: '16px', fontWeight: '500'}}>Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            style={{
              padding: '15px',
              fontSize: '16px',
              borderRadius: '8px',
              border: '2px solid #e0e0e0',
              width: '100%',
              marginTop: '8px'
            }}
            required
          />
        </div>

        {error && (
          <div style={{
            color: '#dc3545',
            background: '#f8d7da',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '15px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <button 
          type="submit"
          style={{
            width: '100%',
            padding: '15px',
            fontSize: '16px',
            fontWeight: '600',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          Continue to Services
        </button>
      </form>

      <div style={{
        textAlign: 'center',
        marginTop: '30px',
        padding: '20px',
        background: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <h4 style={{margin: '0 0 10px 0', color: '#333'}}>Available Services</h4>
        <div style={{display: 'flex', justifyContent: 'center', gap: '15px', fontSize: '24px'}}>
          <span title="Food Delivery">🍔</span>
          <span title="Grocery Pickup">🛒</span>
          <span title="Parcel Drop">📦</span>
          <span title="Bike Taxi">🏍️</span>
        </div>
      </div>
    </div>
  );
};

export default NameEntry;