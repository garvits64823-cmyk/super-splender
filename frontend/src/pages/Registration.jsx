import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';

const Registration = () => {
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { email, phone } = location.state || {};

  if (!email || !phone) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!dateOfBirth) {
      setError('Please select your date of birth');
      return;
    }

    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    if (birthDate >= today) {
      setError('Please enter a valid date of birth');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await authAPI.completeRegistration({
        token,
        name: name.trim(),
        dateOfBirth,
        email,
        phone,
        loginMethod: 'dual'
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h2>Complete Your Registration</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="form-group">
          <label>Date of Birth</label>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="text"
            value={email}
            disabled
            style={{background: '#f8f9fa'}}
          />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            type="text"
            value={phone}
            disabled
            style={{background: '#f8f9fa'}}
          />
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Completing...' : 'Complete Registration'}
        </button>
      </form>
    </div>
  );
};

export default Registration;