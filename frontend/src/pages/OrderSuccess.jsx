import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, serviceType, estimatedTime } = location.state || {};

  const serviceIcons = {
    "food-delivery": "🍔",
    "grocery-pickup": "🛒",
    "parcel-drop": "📦",
    "bike-taxi": "🏍️",
  };

  return (
    <div className="container" style={{ maxWidth: "500px", textAlign: "center" }}>
      <div style={{ padding: "40px 20px" }}>
        <div style={{ fontSize: "80px", marginBottom: "20px" }}>✅</div>
        <h2 style={{ color: "#28a745", marginBottom: "10px" }}>Order Placed Successfully!</h2>
        <p style={{ color: "#666", fontSize: "16px" }}>Your order has been confirmed</p>

        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          margin: "30px 0",
          textAlign: "left"
        }}>
          <div style={{ marginBottom: "15px" }}>
            <strong>Order ID:</strong> #{orderId}
          </div>
          <div style={{ marginBottom: "15px" }}>
            <strong>Service:</strong> {serviceIcons[serviceType]} {serviceType?.replace("-", " ").toUpperCase()}
          </div>
          <div style={{ marginBottom: "15px" }}>
            <strong>Estimated Time:</strong> {estimatedTime} minutes
          </div>
        </div>

        <div style={{
          background: "#e7f3ff",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
          fontSize: "14px"
        }}>
          📱 You will receive updates via SMS and Email
        </div>

        <button onClick={() => navigate("/services")} style={{ marginBottom: "10px" }}>
          Book Another Service
        </button>
        <button onClick={() => navigate("/dashboard")} style={{ background: "#6c757d" }}>
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
