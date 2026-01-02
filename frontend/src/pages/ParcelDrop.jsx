import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RapidoStyleMapPicker from "../components/RapidoStyleMapPicker";

const ParcelDrop = () => {
  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropLocation: "",
    receiverName: "",
    receiverPhone: "",
    parcelDescription: "",
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
    if (!formData.receiverName.trim()) {
      setError("Receiver name is required");
      return;
    }
    if (!formData.receiverPhone.trim()) {
      setError("Receiver phone number is required");
      return;
    }
    if (!formData.parcelDescription.trim()) {
      setError("Parcel description is required");
      return;
    }

    if (!/^\+?[\d\s-()]{10,}$/.test(formData.receiverPhone)) {
      setError("Please enter a valid phone number");
      return;
    }

    navigate("/order-confirmation", {
      state: {
        orderData: {
          serviceType: "parcel-drop",
          serviceId: 3,
          apiEndpoint: "parcel-order",
          pickup: { address: formData.pickupLocation, ...pickupCoords },
          drop: { address: formData.dropLocation, ...dropCoords },
          formData: {
            pickupLocation: formData.pickupLocation,
            dropLocation: formData.dropLocation,
            receiverName: formData.receiverName,
            receiverPhone: formData.receiverPhone,
            parcelDescription: formData.parcelDescription,
          },
        },
      },
    });
  };

  return (
    <div className="container" style={{ maxWidth: "600px" }}>
      <div className="admin-header">
        <h2>📦 Parcel Drop</h2>
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
          placeholder="🏠 Drop Location"
          type="drop"
          onLocationSelect={(location) => {
            setDropCoords(location);
            setFormData({ ...formData, dropLocation: location.address });
          }}
        />

        <div className="form-group">
          <label>👤 Receiver Name</label>
          <input
            type="text"
            name="receiverName"
            value={formData.receiverName}
            onChange={handleInputChange}
            placeholder="Enter receiver's full name"
            required
          />
        </div>

        <div className="form-group">
          <label>📱 Receiver Phone Number</label>
          <input
            type="tel"
            name="receiverPhone"
            value={formData.receiverPhone}
            onChange={handleInputChange}
            placeholder="Enter receiver's phone number"
            required
          />
          <small style={{ color: "#666", fontSize: "12px" }}>
            Example: +91 9876543210
          </small>
        </div>

        <div className="form-group">
          <label>📝 Parcel Description</label>
          <textarea
            name="parcelDescription"
            value={formData.parcelDescription}
            onChange={handleInputChange}
            placeholder="Describe the parcel (e.g., Documents, Books, Electronics, Clothes)"
            rows="4"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px",
              resize: "vertical",
            }}
            required
          />
        </div>

        {error && <div className="error">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          style={{ background: "#17a2b8" }}
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
        <h4>📋 How it works:</h4>
        <ol style={{ margin: "10px 0", paddingLeft: "20px" }}>
          <li>Enter pickup location (where parcel is)</li>
          <li>Enter drop location (where to deliver)</li>
          <li>Provide receiver's name and phone</li>
          <li>Describe the parcel contents</li>
          <li>Our delivery partner will collect and deliver</li>
        </ol>
        <div
          style={{
            marginTop: "10px",
            padding: "10px",
            background: "#fff3cd",
            borderRadius: "4px",
            border: "1px solid #ffeaa7",
          }}
        >
          <strong>⚠️ Note:</strong> Please ensure receiver is available at
          delivery location
        </div>
      </div>
    </div>
  );
};

export default ParcelDrop;
