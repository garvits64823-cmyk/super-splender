import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const PasswordReset = () => {
  const [step, setStep] = useState(1); // 1: identifier, 2: OTP, 3: new password
  const [identifier, setIdentifier] = useState('');
  const [type, setType] = useState('email');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^\+?[\d\s-()]{10,}$/.test(phone);

  const handleSendResetOTP = async (e) => {
    e.preventDefault();
    setError('');

    if (type === 'email' && !validateEmail(identifier)) {
      setError('Please enter a valid email address');
      return;
    }
    if (type === 'phone' && !validatePhone(identifier)) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      await authAPI.sendResetOTP(identifier, type);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset OTP');
    }
    setLoading(false);
  };

  const handleVerifyResetOTP = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      await authAPI.verifyResetOTP(identifier, otp);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP');
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await authAPI.resetPassword(identifier, otp, newPassword);
      alert('Password reset successful! Please login with your new password.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password');
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h2>Reset Password</h2>
      
      {step === 1 && (
        <form onSubmit={handleSendResetOTP}>
          <div className="form-group">
            <label>Reset Method</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="email">Email</option>
              <option value="phone">Phone Number</option>
            </select>
          </div>

          <div className="form-group">
            <label>{type === 'email' ? 'Email Address' : 'Phone Number'}</label>
            <input
              type={type === 'email' ? 'email' : 'tel'}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={type === 'email' ? 'Enter your email' : 'Enter your phone number'}
              required
            />
          </div>

          {error && <div className="error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset OTP'}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyResetOTP}>
          <div className="form-group">
            <label>Enter Reset OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              maxLength="6"
              required
            />
            <small>Reset OTP sent to {identifier}</small>
          </div>

          {error && <div className="error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>

          <button type="button" onClick={() => setStep(1)} style={{marginTop: '10px', background: '#6c757d'}}>
            Back
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleResetPassword}>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min 6 characters)"
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
          </div>

          {error && <div className="error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}

      <div style={{marginTop: '20px', textAlign: 'center'}}>
        <a href="/login" style={{color: '#007bff', textDecoration: 'none'}}>
          Back to Login
        </a>
      </div>
    </div>
  );
};

export default PasswordReset;