import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Login = () => {
  const [step, setStep] = useState(1); // 1: credentials, 2: email OTP, 3: phone OTP, 4: success
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91'); // Default India
  const [emailOtp, setEmailOtp] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const navigate = useNavigate();

  const countryCodes = [
    { code: '+91', country: 'India' },
    { code: '+1', country: 'USA/Canada' },
    { code: '+44', country: 'UK' },
    { code: '+86', country: 'China' },
    { code: '+81', country: 'Japan' },
    { code: '+49', country: 'Germany' },
    { code: '+33', country: 'France' },
    { code: '+61', country: 'Australia' },
    { code: '+971', country: 'UAE' },
    { code: '+65', country: 'Singapore' }
  ];

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[\d]{10}$/.test(phone);

  const handleSendOTPs = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!validatePhone(phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    try {
      // Send email OTP
      await authAPI.sendOTP(email, 'email');
      // Send phone OTP
      const fullPhone = countryCode + phone;
      await authAPI.sendOTP(fullPhone, 'phone');
      
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTPs');
    }
    setLoading(false);
  };

  const handleVerifyEmail = async () => {
    if (!emailOtp || emailOtp.length !== 6) {
      setError('Please enter a valid 6-digit email OTP');
      return;
    }

    setLoading(true);
    try {
      await authAPI.verifyOTP(email, emailOtp);
      setEmailVerified(true);
      setError('');
      
      if (phoneVerified) {
        handleCompleteLogin();
      }
    } catch (err) {
      setError('Invalid email OTP');
    }
    setLoading(false);
  };

  const handleVerifyPhone = async () => {
    if (!phoneOtp || phoneOtp.length !== 6) {
      setError('Please enter a valid 6-digit phone OTP');
      return;
    }

    setLoading(true);
    try {
      const fullPhone = countryCode + phone;
      await authAPI.verifyOTP(fullPhone, phoneOtp);
      setPhoneVerified(true);
      setError('');
      
      if (emailVerified) {
        handleCompleteLogin();
      }
    } catch (err) {
      setError('Invalid phone OTP');
    }
    setLoading(false);
  };

  const handleCompleteLogin = async () => {
    try {
      // Check if user exists with email
      const response = await authAPI.verifyOTP(email, emailOtp);
      localStorage.setItem('token', response.data.token);
      
      if (response.data.isNewUser) {
        navigate('/register', { state: { email, phone: countryCode + phone } });
      } else {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div className="container">
      <h2>Login to Your Account</h2>
      
      {step === 1 ? (
        <form onSubmit={handleSendOTPs}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <div style={{display: 'flex', gap: '10px'}}>
              <select 
                value={countryCode} 
                onChange={(e) => setCountryCode(e.target.value)}
                style={{width: '120px'}}
              >
                {countryCodes.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.code} ({country.country})
                  </option>
                ))}
              </select>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 10-digit number"
                maxLength="10"
                style={{flex: 1}}
                required
              />
            </div>
          </div>

          {error && <div className="error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Sending OTPs...' : 'Send OTPs'}
          </button>
        </form>
      ) : (
        <div>
          <h3>Verify Both Email and Phone</h3>
          <p>OTPs sent to {email} and {countryCode}{phone}</p>
          
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px'}}>
            {/* Email OTP */}
            <div className="form-group">
              <label>Email OTP {emailVerified && '✅'}</label>
              <input
                type="text"
                value={emailOtp}
                onChange={(e) => setEmailOtp(e.target.value)}
                placeholder="Enter email OTP"
                maxLength="6"
                disabled={emailVerified}
              />
              <button 
                type="button" 
                onClick={handleVerifyEmail}
                disabled={loading || emailVerified}
                style={{marginTop: '10px', width: '100%'}}
              >
                {emailVerified ? 'Verified' : 'Verify Email'}
              </button>
            </div>

            {/* Phone OTP */}
            <div className="form-group">
              <label>Phone OTP {phoneVerified && '✅'}</label>
              <input
                type="text"
                value={phoneOtp}
                onChange={(e) => setPhoneOtp(e.target.value)}
                placeholder="Enter phone OTP"
                maxLength="6"
                disabled={phoneVerified}
              />
              <button 
                type="button" 
                onClick={handleVerifyPhone}
                disabled={loading || phoneVerified}
                style={{marginTop: '10px', width: '100%'}}
              >
                {phoneVerified ? 'Verified' : 'Verify Phone'}
              </button>
            </div>
          </div>

          {error && <div className="error" style={{marginTop: '20px'}}>{error}</div>}

          {emailVerified && phoneVerified && (
            <div style={{marginTop: '20px', textAlign: 'center'}}>
              <div style={{color: 'green', marginBottom: '10px'}}>✅ Both verifications complete!</div>
              <button onClick={handleCompleteLogin} style={{background: '#28a745'}}>
                Complete Login
              </button>
            </div>
          )}

          <button 
            type="button" 
            onClick={() => setStep(1)} 
            style={{marginTop: '20px', background: '#6c757d', width: '100%'}}
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;