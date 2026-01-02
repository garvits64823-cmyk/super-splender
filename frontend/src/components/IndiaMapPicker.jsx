import React, { useState } from 'react';

const IndiaMapPicker = ({ onLocationSelect, placeholder = "Select location from India map" }) => {
  const [selectedCity, setSelectedCity] = useState('');
  const [showMap, setShowMap] = useState(false);

  const indianCities = [
    { name: 'Mumbai', state: 'Maharashtra', coords: [19.0760, 72.8777] },
    { name: 'Delhi', state: 'Delhi', coords: [28.7041, 77.1025] },
    { name: 'Bangalore', state: 'Karnataka', coords: [12.9716, 77.5946] },
    { name: 'Hyderabad', state: 'Telangana', coords: [17.3850, 78.4867] },
    { name: 'Chennai', state: 'Tamil Nadu', coords: [13.0827, 80.2707] },
    { name: 'Kolkata', state: 'West Bengal', coords: [22.5726, 88.3639] },
    { name: 'Pune', state: 'Maharashtra', coords: [18.5204, 73.8567] },
    { name: 'Ahmedabad', state: 'Gujarat', coords: [23.0225, 72.5714] },
    { name: 'Jaipur', state: 'Rajasthan', coords: [26.9124, 75.7873] },
    { name: 'Surat', state: 'Gujarat', coords: [21.1702, 72.8311] },
    { name: 'Lucknow', state: 'Uttar Pradesh', coords: [26.8467, 80.9462] },
    { name: 'Kanpur', state: 'Uttar Pradesh', coords: [26.4499, 80.3319] },
    { name: 'Nagpur', state: 'Maharashtra', coords: [21.1458, 79.0882] },
    { name: 'Indore', state: 'Madhya Pradesh', coords: [22.7196, 75.8577] },
    { name: 'Thane', state: 'Maharashtra', coords: [19.2183, 72.9781] },
    { name: 'Bhopal', state: 'Madhya Pradesh', coords: [23.2599, 77.4126] },
    { name: 'Visakhapatnam', state: 'Andhra Pradesh', coords: [17.6868, 83.2185] },
    { name: 'Pimpri-Chinchwad', state: 'Maharashtra', coords: [18.6298, 73.7997] },
    { name: 'Patna', state: 'Bihar', coords: [25.5941, 85.1376] },
    { name: 'Vadodara', state: 'Gujarat', coords: [22.3072, 73.1812] }
  ];

  const handleCitySelect = (city) => {
    const fullAddress = `${city.name}, ${city.state}, India`;
    setSelectedCity(fullAddress);
    setShowMap(false);
    onLocationSelect({
      address: fullAddress,
      latitude: city.coords[0],
      longitude: city.coords[1],
      city: city.name,
      state: city.state
    });
  };

  const handleManualInput = (e) => {
    const address = e.target.value;
    setSelectedCity(address);
    onLocationSelect({
      address: address,
      latitude: null,
      longitude: null
    });
  };

  return (
    <div className="form-group">
      <label>{placeholder}</label>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <input
          type="text"
          value={selectedCity}
          onChange={handleManualInput}
          placeholder="Type address or select from map"
          style={{ flex: 1 }}
          required
        />
        <button
          type="button"
          onClick={() => setShowMap(!showMap)}
          style={{
            padding: '10px 15px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            width: 'auto'
          }}
        >
          🗺️ {showMap ? 'Hide' : 'Show'} India Map
        </button>
      </div>

      {showMap && (
        <div style={{
          border: '2px solid #007bff',
          borderRadius: '8px',
          padding: '15px',
          background: '#f8f9fa',
          marginBottom: '10px'
        }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#007bff' }}>🇮🇳 Select City from India Map</h4>
          
          {/* India Map Visual */}
          <div style={{
            background: 'linear-gradient(135deg, #ff9a56 0%, #ff6b35 100%)',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '15px',
            textAlign: 'center',
            color: 'white'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🇮🇳</div>
            <h3 style={{ margin: '0' }}>India</h3>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>Select your city from the list below</p>
          </div>

          {/* Cities Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '10px',
            maxHeight: '300px',
            overflowY: 'auto'
          }}>
            {indianCities.map((city, index) => (
              <div
                key={index}
                onClick={() => handleCitySelect(city)}
                style={{
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: 'white',
                  transition: 'all 0.2s',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#007bff';
                  e.target.style.color = 'white';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'white';
                  e.target.style.color = 'black';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{city.name}</div>
                <div style={{ fontSize: '12px', opacity: 0.7 }}>{city.state}</div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '15px',
            padding: '10px',
            background: '#e7f3ff',
            borderRadius: '4px',
            fontSize: '12px',
            textAlign: 'center'
          }}>
            💡 Click on any city to select it as your location
          </div>
        </div>
      )}

      <small style={{color: '#666', fontSize: '12px'}}>
        🗺️ Use India Map for quick city selection or type your address manually
      </small>
    </div>
  );
};

export default IndiaMapPicker;