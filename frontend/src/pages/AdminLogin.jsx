import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      console.log('Attempting admin login...');
      const response = await adminAPI.login(email, password);
      console.log('Login response:', response.data);
      localStorage.setItem('adminToken', response.data.token);
      console.log('Token saved, navigating to dashboard');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h2>Admin Login</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter admin email"
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            required
          />
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div style={{marginTop: '20px', padding: '15px', background: '#e9ecef', borderRadius: '4px'}}>
        <small>
          <strong>Default Admin Credentials:</strong><br/>
          Email: admin@app.com<br/>
          Password: admin123
        </small>
      </div>

      <div style={{marginTop: '20px', textAlign: 'center'}}>
        <a href="/login" style={{color: '#007bff', textDecoration: 'none'}}>
          Back to User Login
        </a>
      </div>
    </div>
  );
};

export default AdminLogin;