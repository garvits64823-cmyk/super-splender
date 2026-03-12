import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn || !userData) {
      navigate('/enter-name');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setName(parsedUser.name || '');
    setDateOfBirth(parsedUser.dateOfBirth || '');
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Update user data in localStorage
    const updatedUser = {
      ...user,
      name,
      dateOfBirth
    };
    
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setSuccess('Profile updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container">
      <div className="admin-header">
        <h2>My Profile</h2>
        <button onClick={() => navigate('/services')} style={{width: 'auto', background: '#6c757d'}}>
          Back to Services
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
            required
          />
        </div>

        <div className="form-group">
          <label>Date of Birth (Optional)</label>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>User ID</label>
          <input
            type="text"
            value={user.id}
            disabled
            style={{background: '#f8f9fa'}}
          />
        </div>

        <div className="form-group">
          <label>Joined</label>
          <input
            type="text"
            value={new Date(user.joinedAt).toLocaleDateString()}
            disabled
            style={{background: '#f8f9fa'}}
          />
        </div>

        {success && <div className="success">{success}</div>}

        <button type="submit">
          Update Profile
        </button>
      </form>

      <div style={{
        marginTop: '30px',
        padding: '20px',
        background: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <h4>Public Profile</h4>
        <p>Your public profile can be accessed at:</p>
        <code style={{
          background: '#e9ecef',
          padding: '5px 10px',
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          /profile/{user.id}
        </code>
      </div>
    </div>
  );
};

export default Profile;