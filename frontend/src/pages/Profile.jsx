import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [name, setName] = useState('Demo User');
  const [dateOfBirth, setDateOfBirth] = useState('1990-01-01');
  const [email] = useState('demo@example.com');
  const [phone] = useState('+1234567890');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess('Profile updated successfully! (Demo Mode)');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="container">
      <div className="admin-header">
        <h2>My Profile</h2>
        <button onClick={() => navigate('/dashboard')} style={{width: 'auto', background: '#6c757d'}}>
          Back to Dashboard
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
          />
        </div>

        <div className="form-group">
          <label>Date of Birth</label>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
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

        {success && <div className="success">{success}</div>}

        <button type="submit">
          Update Profile (Demo)
        </button>
      </form>
    </div>
  );
};

export default Profile;