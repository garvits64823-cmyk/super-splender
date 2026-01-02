import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';

const PricingManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
      return;
    }
    fetchPricing();
  }, [navigate]);

  const fetchPricing = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/admin/service-pricing', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      const result = await response.json();
      setServices(result.data || []);
    } catch (err) {
      setError('Failed to fetch pricing data');
    }
    setLoading(false);
  };

  const handlePriceChange = (serviceId, field, value) => {
    setServices(services.map(service => 
      service.service_id === serviceId 
        ? { ...service, [field]: parseFloat(value) || 0 }
        : service
    ));
  };

  const handleSave = async (serviceId) => {
    setSaving(true);
    setError('');
    setSuccess('');

    const service = services.find(s => s.service_id === serviceId);
    
    try {
      await fetch(`http://localhost:5001/api/admin/service-pricing/${serviceId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fixed_price: service.fixed_price,
          per_minute_price: service.per_minute_price,
          additional_time: service.additional_time
        })
      });
      setSuccess(`${service.name} pricing updated successfully!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update pricing');
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="container">Loading pricing data...</div>;
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>💰 Service Pricing Management</h2>
        <div>
          <button 
            onClick={() => navigate('/admin/dashboard')} 
            style={{width: 'auto', marginRight: '10px', background: '#6c757d'}}
          >
            Back to Dashboard
          </button>
          <button 
            onClick={() => {
              localStorage.removeItem('adminToken');
              navigate('/admin');
            }} 
            style={{width: 'auto', background: '#dc3545'}}
          >
            Logout
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '20px',
        marginTop: '20px'
      }}>
        {services.map(service => (
          <div 
            key={service.service_id}
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}
          >
            <h3 style={{margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px'}}>
              <span style={{fontSize: '32px'}}>{service.icon}</span>
              {service.name}
            </h3>

            <div className="form-group">
              <label>Fixed Base Price (₹)</label>
              <input
                type="number"
                step="0.01"
                value={service.fixed_price}
                onChange={(e) => handlePriceChange(service.service_id, 'fixed_price', e.target.value)}
                placeholder="Enter base price"
              />
              <small style={{color: '#666', fontSize: '12px'}}>
                Base charge for every order
              </small>
            </div>

            <div className="form-group">
              <label>Per Minute Price (₹)</label>
              <input
                type="number"
                step="0.01"
                value={service.per_minute_price}
                onChange={(e) => handlePriceChange(service.service_id, 'per_minute_price', e.target.value)}
                placeholder="Enter per minute price"
              />
              <small style={{color: '#666', fontSize: '12px'}}>
                Charge per minute of delivery time
              </small>
            </div>

            <div className="form-group">
              <label>Additional Time (minutes)</label>
              <input
                type="number"
                value={service.additional_time}
                onChange={(e) => handlePriceChange(service.service_id, 'additional_time', e.target.value)}
                placeholder="Enter additional time"
              />
              <small style={{color: '#666', fontSize: '12px'}}>
                Extra time added for service preparation (e.g., 15 min for food)
              </small>
            </div>

            {/* Pricing Example */}
            <div style={{
              marginTop: '15px',
              padding: '15px',
              background: '#f8f9fa',
              borderRadius: '4px',
              border: '1px solid #dee2e6'
            }}>
              <h4 style={{margin: '0 0 10px 0', fontSize: '14px'}}>💡 Pricing Example:</h4>
              <div style={{fontSize: '13px', color: '#666'}}>
                <div>Base Price: ₹{service.fixed_price}</div>
                <div>Time (20 min + {service.additional_time} min): ₹{((20 + service.additional_time) * service.per_minute_price).toFixed(2)}</div>
                <hr style={{margin: '8px 0', border: 'none', borderTop: '1px solid #ddd'}}/>
                <div style={{fontWeight: 'bold', color: '#28a745'}}>
                  Total: ₹{(service.fixed_price + ((20 + service.additional_time) * service.per_minute_price)).toFixed(2)}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSave(service.service_id)}
              disabled={saving}
              style={{
                width: '100%',
                marginTop: '15px',
                background: '#28a745'
              }}
            >
              {saving ? 'Saving...' : 'Save Pricing'}
            </button>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '30px',
        padding: '20px',
        background: '#e7f3ff',
        borderRadius: '8px',
        border: '1px solid #b3d9ff'
      }}>
        <h4>📊 Pricing Formula:</h4>
        <div style={{fontSize: '14px', marginTop: '10px'}}>
          <strong>Total Price = Fixed Price + (Delivery Time × Per Minute Price)</strong>
          <br/><br/>
          <strong>Delivery Time Calculation:</strong>
          <ul style={{marginTop: '5px'}}>
            <li>Travel Time = (Distance in km / 35) × 2</li>
            <li>Total Time = Travel Time + Additional Time</li>
            <li>Food & Grocery: +15 minutes additional time</li>
            <li>Parcel & Bike Taxi: No additional time</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PricingManagement;