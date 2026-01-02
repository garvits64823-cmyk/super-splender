import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RapidoStyleMapPicker from "../components/RapidoStyleMapPicker";

const BikeTaxi = () => {
  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropLocation: "",
  });
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropCoords, setDropCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!pickupCoords || !dropCoords) {
      setError("Please select both pickup and drop locations from the map");
      return;
    }

    if (!formData.pickupLocation.trim()) {
      setError("Pickup location is required");
      return;
    }
    if (!formData.dropLocation.trim()) {
      setError("Drop location is required");
      return;
    }

    navigate("/order-confirmation", {
      state: {
        orderData: {
          serviceType: "bike-taxi",
          serviceId: 4,
          apiEndpoint: "bike-taxi-order",
          pickup: { address: formData.pickupLocation, ...pickupCoords },
          drop: { address: formData.dropLocation, ...dropCoords },
          formData: {
            pickupLocation: formData.pickupLocation,
            dropLocation: formData.dropLocation,
          },
        },
      },
    });
  };

  return (
    <div className="container" style={{ maxWidth: "600px" }}>
      <div className="admin-header">
        <h2>🏍️ Bike Taxi</h2>
        <button
          onClick={() => navigate("/services")}
          style={{ width: "auto", background: "#6c757d" }}
        >
          Back to Services
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <RapidoStyleMapPicker
          placeholder="📍 Pickup Location"
          type="pickup"
          onLocationSelect={(location) => {
            setPickupCoords(location);
            setFormData({ ...formData, pickupLocation: location.address });
          }}
        />

        <RapidoStyleMapPicker
          placeholder="🏁 Drop Location"
          type="drop"
          onLocationSelect={(location) => {
            setDropCoords(location);
            setFormData({ ...formData, dropLocation: location.address });
          }}
        />

        {error && <div className="error">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          style={{ background: "#fd7e14" }}
        >
          Continue to Confirmation
        </button>
      </form>

      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          background: "#f8f9fa",
          borderRadius: "8px",
          fontSize: "14px",
        }}
      >
        <h4>🚀 How it works:</h4>
        <ol style={{ margin: "10px 0", paddingLeft: "20px" }}>
          <li>Enter your pickup location</li>
          <li>Enter your destination</li>
          <li>Book your ride</li>
          <li>Driver will contact you for pickup</li>
          <li>Enjoy your quick bike ride!</li>
        </ol>
      </div>

      <div
        style={{
          marginTop: "15px",
          padding: "15px",
          background: "#e7f3ff",
          borderRadius: "8px",
          fontSize: "14px",
          border: "1px solid #b3d9ff",
        }}
      >
        <h4>✨ Benefits:</h4>
        <ul style={{ margin: "10px 0", paddingLeft: "20px" }}>
          <li>🚀 Fast and quick rides</li>
          <li>💰 Affordable pricing</li>
          <li>🛣️ Beat the traffic</li>
          <li>🌱 Eco-friendly transport</li>
          <li>📱 Easy booking process</li>
        </ul>
      </div>

      <div
        style={{
          marginTop: "15px",
          padding: "10px",
          background: "#fff3cd",
          borderRadius: "4px",
          border: "1px solid #ffeaa7",
          fontSize: "12px",
        }}
      >
        <strong>⚠️ Safety Note:</strong> Please wear helmet and follow traffic
        rules during the ride.
      </div>
    </div>
  );
};

export default BikeTaxi;
