import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config.js';

const About = () => {
  const [aboutData, setAboutData] = useState({
    title: 'About Super Splender',
    description: 'Your Ultimate Super App for all daily needs',
    mission: 'To provide convenient, reliable, and affordable services that make your life easier.',
    vision: 'To become the most trusted super app connecting people with essential services.',
    features: [
      'Food Delivery from your favorite restaurants',
      'Grocery Pickup and delivery service',
      'Parcel Drop for quick deliveries',
      'Bike Taxi for fast transportation'
    ],
    contact: {
      email: 'qoxtransit@gmail.com',
      phone: '+91 9729832025'
    },
    socialMedia: {
      youtube: 'https://youtube.com/@qoxtransit',
      instagram: 'https://www.instagram.com/qox.transit',
      linkedin: 'https://www.linkedin.com/company/qox-transit-private-limited/'
    }
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/about-info`);
      if (response.ok) {
        const data = await response.json();
        console.log('About data from API:', data);
        setAboutData(data);
      } else {
        console.log('API response not ok, using default data');
      }
    } catch (error) {
      console.log('API error, using default about data:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="container" style={{textAlign: 'center', marginTop: '100px'}}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="container" style={{maxWidth: '800px'}}>
      <div className="admin-header">
        <h2>{aboutData.title}</h2>
        <button 
          onClick={() => navigate('/services')} 
          style={{width: 'auto', background: '#6c757d'}}
        >
          Back to Services
        </button>
      </div>

      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '40px',
        borderRadius: '12px',
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <h3 style={{margin: '0 0 15px 0', fontSize: '24px'}}>
          {aboutData.description}
        </h3>
        <div style={{display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '32px'}}>
          <span>🍔</span>
          <span>🛒</span>
          <span>📦</span>
          <span>🏍️</span>
        </div>
      </div>

      {/* Mission & Vision */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: '#f8f9fa',
          padding: '25px',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h4 style={{color: '#007bff', margin: '0 0 15px 0'}}>🎯 Our Mission</h4>
          <p style={{margin: '0', lineHeight: '1.6', color: '#333'}}>
            {aboutData.mission}
          </p>
        </div>
        
        <div style={{
          background: '#f8f9fa',
          padding: '25px',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h4 style={{color: '#28a745', margin: '0 0 15px 0'}}>🚀 Our Vision</h4>
          <p style={{margin: '0', lineHeight: '1.6', color: '#333'}}>
            {aboutData.vision}
          </p>
        </div>
      </div>

      {/* Features */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h4 style={{margin: '0 0 20px 0', color: '#333'}}>✨ What We Offer</h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '15px'
        }}>
          {aboutData.features.map((feature, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px',
              background: '#f8f9fa',
              borderRadius: '6px'
            }}>
              <span style={{marginRight: '10px', fontSize: '18px'}}>✅</span>
              <span style={{color: '#333', fontSize: '14px'}}>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h4 style={{margin: '0 0 20px 0', color: '#333'}}>📞 Contact Us</h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          <div>
            <strong style={{color: '#007bff'}}>📧 Email:</strong>
            <br />
            <a href={`mailto:${aboutData.contact?.email || 'qoxtransit@gmail.com'}`} style={{color: '#333', textDecoration: 'none'}}>
              {aboutData.contact?.email || 'qoxtransit@gmail.com'}
            </a>
          </div>
          <div>
            <strong style={{color: '#28a745'}}>📱 Phone:</strong>
            <br />
            <a href={`tel:${aboutData.contact?.phone || '+919729832025'}`} style={{color: '#333', textDecoration: 'none'}}>
              {aboutData.contact?.phone || '+91 9729832025'}
            </a>
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h4 style={{margin: '0 0 20px 0', color: '#333'}}>🌐 Follow Us</h4>
        <div style={{display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap'}}>
          {aboutData.socialMedia?.youtube && (
            <a 
              href={aboutData.socialMedia.youtube} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                background: '#FF0000',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              📺 YouTube
            </a>
          )}
          {aboutData.socialMedia?.instagram && (
            <a 
              href={aboutData.socialMedia.instagram} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                background: '#E4405F',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              📷 Instagram
            </a>
          )}
          {aboutData.socialMedia?.linkedin && (
            <a 
              href={aboutData.socialMedia.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                background: '#0077B5',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              💼 LinkedIn
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default About;