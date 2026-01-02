import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import api from '../services/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
      return;
    }
    // Set the token in axios defaults
    api.defaults.headers.Authorization = `Bearer ${token}`;
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getUsers(search, filter);
      setUsers(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/admin');
      } else {
        setError('Failed to fetch users');
      }
    }
    setLoading(false);
  };

  const handleSearch = () => {
    fetchUsers();
  };

  const handleBlockUser = async (userId, isBlocked) => {
    try {
      await adminAPI.blockUser(userId, !isBlocked);
      fetchUsers(); // Refresh the list
    } catch (err) {
      setError('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to permanently delete ${userName}'s account? This action cannot be undone.`)) {
      try {
        await adminAPI.deleteUser(userId);
        fetchUsers(); // Refresh the list
        setError(''); // Clear any previous errors
      } catch (err) {
        setError('Failed to delete user account');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <div>
          <button 
            onClick={() => navigate('/admin/pricing')} 
            style={{width: 'auto', marginRight: '10px', background: '#ff9800'}}
          >
            💰 Pricing
          </button>
          <button 
            onClick={() => navigate('/admin/company')} 
            style={{width: 'auto', marginRight: '10px', background: '#28a745'}}
          >
            Company Settings
          </button>
          <button onClick={handleLogout} style={{width: 'auto', background: '#dc3545'}}>
            Logout
          </button>
        </div>
      </div>

      <div className="search-filters">
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{flex: 1}}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All Users</option>
          <option value="email">Email Users</option>
          <option value="phone">Phone Users</option>
        </select>
        <button onClick={handleSearch} style={{width: 'auto'}}>
          Search
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div>Loading users...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>User #</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Date of Birth</th>
              <th>Login Method</th>
              <th>Registered</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="9" style={{textAlign: 'center', padding: '20px'}}>
                  No users found
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id}>
                  <td>{user.user_number || 'N/A'}</td>
                  <td>{user.name}</td>
                  <td>{user.email || '-'}</td>
                  <td>{user.phone || '-'}</td>
                  <td>{user.dateOfBirth ? formatDate(user.dateOfBirth) : '-'}</td>
                  <td>{user.loginMethod}</td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>
                    <span className={user.isBlocked ? 'status-blocked' : 'status-active'}>
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <div style={{display: 'flex', gap: '5px'}}>
                      <button
                        className="btn-small"
                        onClick={() => handleBlockUser(user.id, user.isBlocked)}
                        style={{
                          background: user.isBlocked ? '#28a745' : '#dc3545'
                        }}
                      >
                        {user.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                      <button
                        className="btn-small"
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        style={{
                          background: '#6c757d',
                          fontSize: '12px'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      <div style={{marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '4px'}}>
        <h4>Admin Panel Features:</h4>
        <ul>
          <li>View all registered users</li>
          <li>Search users by name, email, or phone</li>
          <li>Filter users by login method</li>
          <li>Block/Unblock users</li>
          <li>Delete user accounts permanently</li>
          <li>View user registration details</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;