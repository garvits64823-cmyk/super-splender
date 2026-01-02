import React, { useState } from 'react';

const LocationPicker = ({ onLocationSelect, placeholder = "Select location" }) => {
  const [address, setAddress] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddressChange = (e) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    onLocationSelect({
      address: newAddress,
      latitude: null,
      longitude: null
    });
  };

  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
            );
            const data = await response.json();
            
            if (data && data.display_name) {
              setAddress(data.display_name);
              onLocationSelect({
                latitude,
                longitude,
                address: data.display_name
              });
            }
          } catch (error) {
            console.error('Error getting address:', error);
            const coords = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
            setAddress(coords);
            onLocationSelect({
              latitude,
              longitude,
              address: coords
            });
          }
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoading(false);
          alert('Unable to get your location. Please enter manually.');
        }
      );
    } else {
      setLoading(false);
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="form-group">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '5px'
      }}>
        <label>{placeholder}</label>
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={loading}
          style={{
            padding: '5px 10px',
            fontSize: '12px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            width: 'auto'
          }}
        >
          {loading ? 'Getting...' : '📍 Use Current Location'}
        </button>
      </div>
      
      <input
        type="text"
        value={address}
        onChange={handleAddressChange}
        placeholder="Enter address or use current location"
        required
      />
      
      <small style={{color: '#666', fontSize: '12px'}}>
        💡 Click "Use Current Location" for GPS or type address manually
      </small>
    </div>
  );
};

export default LocationPicker;