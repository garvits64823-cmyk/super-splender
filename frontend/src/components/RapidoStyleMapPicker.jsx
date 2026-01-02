import React, { useState, useEffect } from 'react';

const RapidoStyleMapPicker = ({ onLocationSelect, placeholder = "Select location on map", type = "pickup" }) => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [currentCoords, setCurrentCoords] = useState({ lat: 12.9716, lng: 77.5946 }); // Default Bangalore

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentCoords({ lat: latitude, lng: longitude });
          reverseGeocode(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please select on map.');
        }
      );
    }
  };

  // Convert coordinates to address
  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        setSelectedLocation(data.display_name);
        onLocationSelect({
          address: data.display_name,
          latitude: lat,
          longitude: lng
        });
      }
    } catch (error) {
      console.error('Error getting address:', error);
      const coords = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      setSelectedLocation(coords);
      onLocationSelect({
        address: coords,
        latitude: lat,
        longitude: lng
      });
    }
  };

  // Handle map click
  const handleMapClick = (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convert click position to approximate coordinates (simplified)
    const lat = currentCoords.lat + (0.01 * (250 - y) / 100);
    const lng = currentCoords.lng + (0.01 * (x - 250) / 100);
    
    setCurrentCoords({ lat, lng });
    reverseGeocode(lat, lng);
  };

  const pinColor = type === 'pickup' ? '#28a745' : '#dc3545';
  const pinIcon = type === 'pickup' ? '📍' : '🏁';

  return (
    <div className="form-group">
      <label>{placeholder}</label>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <input
          type="text"
          value={selectedLocation}
          onChange={(e) => {
            setSelectedLocation(e.target.value);
            onLocationSelect({ address: e.target.value });
          }}
          placeholder="Selected location will appear here"
          style={{ flex: 1 }}
          required
        />
        <button
          type="button"
          onClick={() => setShowMap(!showMap)}
          style={{
            padding: '10px 15px',
            background: pinColor,
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            width: 'auto'
          }}
        >
          {pinIcon} {showMap ? 'Hide Map' : 'Select on Map'}
        </button>
      </div>

      {showMap && (
        <div style={{
          border: `2px solid ${pinColor}`,
          borderRadius: '8px',
          padding: '15px',
          background: '#f8f9fa',
          marginBottom: '10px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h4 style={{ margin: 0, color: pinColor }}>
              {pinIcon} Select {type === 'pickup' ? 'Pickup' : 'Drop'} Location
            </h4>
            <button
              type="button"
              onClick={getCurrentLocation}
              style={{
                padding: '5px 10px',
                fontSize: '12px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              📍 Use Current Location
            </button>
          </div>

          {/* Interactive Map Area */}
          <div 
            onClick={handleMapClick}
            style={{
              width: '100%',
              height: '300px',
              background: 'linear-gradient(45deg, #e8f5e8 25%, transparent 25%), linear-gradient(-45deg, #e8f5e8 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e8f5e8 75%), linear-gradient(-45deg, transparent 75%, #e8f5e8 75%)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              position: 'relative',
              cursor: 'crosshair',
              overflow: 'hidden'
            }}
          >
            {/* Map Background */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                radial-gradient(circle at 30% 20%, #4CAF50 2px, transparent 2px),
                radial-gradient(circle at 70% 40%, #2196F3 2px, transparent 2px),
                radial-gradient(circle at 20% 80%, #FF9800 2px, transparent 2px),
                radial-gradient(circle at 80% 70%, #9C27B0 2px, transparent 2px),
                linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%)
              `,
              opacity: 0.7
            }} />

            {/* Roads/Streets */}
            <div style={{
              position: 'absolute',
              top: '40%',
              left: 0,
              right: 0,
              height: '3px',
              background: '#666',
              opacity: 0.3
            }} />
            <div style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '60%',
              width: '3px',
              background: '#666',
              opacity: 0.3
            }} />

            {/* Location Pin */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -100%)',
              fontSize: '32px',
              color: pinColor,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              animation: 'bounce 1s infinite'
            }}>
              {pinIcon}
            </div>

            {/* Crosshair */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '20px',
              height: '20px',
              border: `2px solid ${pinColor}`,
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(255,255,255,0.8)'
            }} />
          </div>

          {/* Instructions */}
          <div style={{
            marginTop: '15px',
            padding: '10px',
            background: '#e7f3ff',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>📍 How to select location:</div>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>Click anywhere on the map to place your pin</li>
              <li>Use "📍 Current Location" for GPS location</li>
              <li>The address will auto-update when you select</li>
            </ul>
          </div>

          {/* Current Selection */}
          {selectedLocation && (
            <div style={{
              marginTop: '10px',
              padding: '10px',
              background: 'white',
              border: `1px solid ${pinColor}`,
              borderRadius: '4px',
              fontSize: '14px'
            }}>
              <strong>Selected:</strong> {selectedLocation}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translate(-50%, -100%) translateY(0);
          }
          40% {
            transform: translate(-50%, -100%) translateY(-10px);
          }
          60% {
            transform: translate(-50%, -100%) translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
};

export default RapidoStyleMapPicker;