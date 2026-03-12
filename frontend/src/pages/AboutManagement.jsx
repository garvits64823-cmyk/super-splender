import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AboutManagement = () => {
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
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/about-info');
      if (response.ok) {
        const data = await response.json();
        setAboutData(data);
      }
    } catch (error) {
      console.log('Using default about data');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setAboutData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setAboutData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...aboutData.features];
    newFeatures[index] = value;
    setAboutData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const addFeature = () => {
    setAboutData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index) => {
    const newFeatures = aboutData.features.filter((_, i) => i !== index);
    setAboutData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5001/api/admin/about-info', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aboutData)
      });

      if (response.ok) {
        setSuccess('About information updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error('Failed to update about information');
      }
    } catch (err) {
      setError('Failed to update about information. Using local storage for demo.');
      // Store in localStorage as fallback
      localStorage.setItem('aboutData', JSON.stringify(aboutData));
      setSuccess('About information saved locally!');
      setTimeout(() => setSuccess(''), 3000);
    }
    setLoading(false);
  };

  return (
    <div className="container" style={{maxWidth: '800px'}}>
      <div className="admin-header">
        <h2>📝 Manage About Page</h2>
        <div>
          <button 
            onClick={() => navigate('/about')} 
            style={{width: 'auto', marginRight: '10px', background: '#28a745'}}
          >
            Preview About
          </button>
          <button 
            onClick={() => navigate('/admin/dashboard')} 
            style={{width: 'auto', background: '#6c757d'}}
          >
            Back to Admin
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h4 style={{margin: '0 0 20px 0', color: '#333'}}>Basic Information</h4>
          
          <div className="form-group">
            <label>Page Title</label>
            <input
              type="text"
              name="title"
              value={aboutData.title}
              onChange={handleInputChange}
              placeholder="About page title"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              name="description"
              value={aboutData.description}
              onChange={handleInputChange}
              placeholder="Brief description"
              required
            />
          </div>

          <div className="form-group">
            <label>Mission Statement</label>
            <textarea
              name="mission"
              value={aboutData.mission}
              onChange={handleInputChange}
              placeholder="Company mission"
              rows="3"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                resize: 'vertical'
              }}
              required
            />
          </div>

          <div className="form-group">
            <label>Vision Statement</label>
            <textarea
              name="vision"
              value={aboutData.vision}
              onChange={handleInputChange}
              placeholder="Company vision"
              rows="3"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                resize: 'vertical'
              }}
              required
            />
          </div>
        </div>

        {/* Features */}
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
            <h4 style={{margin: '0', color: '#333'}}>Features</h4>
            <button 
              type="button" 
              onClick={addFeature}
              style={{
                background: '#28a745',
                color: 'white',
                border: 'none',
                padding: '8px 15px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              + Add Feature
            </button>
          </div>

          {aboutData.features.map((feature, index) => (
            <div key={index} style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
              <input
                type="text"
                value={feature}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
                placeholder={`Feature ${index + 1}`}
                style={{
                  flex: 1,
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
                required
              />
              <button
                type="button"
                onClick={() => removeFeature(index)}
                style={{
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '10px 15px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Contact Information */}
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h4 style={{margin: '0 0 20px 0', color: '#333'}}>Contact Information</h4>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="contact.email"
              value={aboutData.contact?.email || ''}
              onChange={handleInputChange}
              placeholder="qoxtransit@gmail.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              name="contact.phone"
              value={aboutData.contact?.phone || ''}
              onChange={handleInputChange}
              placeholder="+91 9729832025"
              required
            />
          </div>
        </div>

        {/* Social Media */}
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h4 style={{margin: '0 0 20px 0', color: '#333'}}>Social Media Links</h4>
          
          <div className="form-group">
            <label>YouTube URL</label>
            <input
              type="url"
              name="socialMedia.youtube"
              value={aboutData.socialMedia?.youtube || ''}
              onChange={handleInputChange}
              placeholder="https://youtube.com/@qoxtransit"
            />
          </div>

          <div className="form-group">
            <label>Instagram URL</label>
            <input
              type="url"
              name="socialMedia.instagram"
              value={aboutData.socialMedia?.instagram || ''}
              onChange={handleInputChange}
              placeholder="https://www.instagram.com/qox.transit"
            />
          </div>

          <div className="form-group">
            <label>LinkedIn URL</label>
            <input
              type="url"
              name="socialMedia.linkedin"
              value={aboutData.socialMedia?.linkedin || ''}
              onChange={handleInputChange}
              placeholder="https://www.linkedin.com/company/qox-transit-private-limited/"
            />
          </div>
        </div>

        {error && <div className="error" style={{marginBottom: '20px'}}>{error}</div>}
        {success && <div className="success" style={{marginBottom: '20px'}}>{success}</div>}

        <button type="submit" disabled={loading} style={{width: '100%', padding: '15px'}}>
          {loading ? 'Updating...' : 'Update About Information'}
        </button>
      </form>
    </div>
  );
};

export default AboutManagement;