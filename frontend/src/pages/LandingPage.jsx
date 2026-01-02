import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [companyData, setCompanyData] = useState({
    name: 'Your Company Name',
    logo: '/default-logo.png'
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch company data from backend
    fetchCompanyData();
    
    // Auto redirect after 3 seconds
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const fetchCompanyData = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/company-info');
      if (response.ok) {
        const data = await response.json();
        setCompanyData(data);
      }
    } catch (error) {
      console.log('Using default company data');
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Logo */}
      <div style={{
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '30px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        animation: 'fadeInScale 1s ease-out'
      }}>
        {companyData.logo !== '/default-logo.png' ? (
          <img 
            src={companyData.logo} 
            alt="Company Logo" 
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <div style={{
            fontSize: '48px',
            color: '#667eea',
            fontWeight: 'bold'
          }}>
            🏢
          </div>
        )}
      </div>

      {/* Company Name */}
      <h1 style={{
        fontSize: '48px',
        fontWeight: 'bold',
        margin: '0 0 20px 0',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        animation: 'fadeInUp 1s ease-out 0.3s both'
      }}>
        {companyData.name}
      </h1>

      {/* Subtitle */}
      <p style={{
        fontSize: '18px',
        opacity: 0.9,
        margin: '0 0 40px 0',
        animation: 'fadeInUp 1s ease-out 0.6s both'
      }}>
        Secure Authentication System
      </p>

      {/* Loading indicator */}
      <div style={{
        width: '50px',
        height: '4px',
        background: 'rgba(255,255,255,0.3)',
        borderRadius: '2px',
        overflow: 'hidden',
        animation: 'fadeInUp 1s ease-out 0.9s both'
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          background: 'white',
          borderRadius: '2px',
          animation: 'loading 3s linear'
        }}></div>
      </div>

      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes loading {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;