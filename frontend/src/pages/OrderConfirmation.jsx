import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OrderConfirmation = () => {
  const [orderData, setOrderData] = useState(null);
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.orderData) {
      setOrderData(location.state.orderData);
      fetchPricing(location.state.orderData.serviceId);
    } else {
      navigate("/services");
    }
  }, [location, navigate]);

  const fetchPricing = async (serviceId) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/service-pricing/${serviceId}`
      );
      const data = await response.json();
      setPricing(data);
    } catch (error) {
      console.error("Error fetching pricing:", error);
    }
    setLoading(false);
  };

  const calculateDistance = (pickup, drop) => {
    // Simplified distance calculation (in real app, use Google Maps Distance Matrix API)
    // For now, using approximate calculation
    const lat1 = pickup.latitude || 12.9716;
    const lon1 = pickup.longitude || 77.5946;
    const lat2 = drop.latitude || 12.9716;
    const lon2 = drop.longitude || 77.5946;

    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.max(distance, 2); // Minimum 2km
  };

  const calculatePricing = () => {
    if (!orderData || !pricing) return null;

    const distance = calculateDistance(orderData.pickup, orderData.drop);
    const baseTime = (distance / 35) * 2; // Travel time calculation
    const additionalTime = pricing.additional_time || 0;
    const totalTime = Math.ceil(baseTime + additionalTime);

    const fixedPrice = pricing.fixed_price || 0;
    const timePrice = totalTime * (pricing.per_minute_price || 0);
    const totalPrice = fixedPrice + timePrice;

    return {
      distance: distance.toFixed(1),
      totalTime,
      fixedPrice,
      timePrice,
      totalPrice: totalPrice.toFixed(2),
    };
  };

  const handleConfirmOrder = async () => {
    setConfirming(true);
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token); // Debug log
      
      if (!token) {
        alert("Please login again");
        navigate("/login");
        return;
      }
      
      const calc = calculatePricing();

      const orderPayload = {
        ...orderData.formData,
        serviceType: orderData.serviceType,
        estimatedTime: calc.totalTime,
        distance: calc.distance,
      };

      console.log("Order payload:", orderPayload); // Debug log

      const response = await fetch(
        `http://localhost:5001/api/${orderData.apiEndpoint}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderPayload),
        }
      );

      const result = await response.json();
      console.log("Response:", response.status, result); // Debug log

      if (response.ok) {
        navigate("/order-success", {
          state: {
            orderId: result.orderId,
            serviceType: orderData.serviceType,
            estimatedTime: calc.totalTime,
          },
        });
      } else {
        if (response.status === 401) {
          alert("Session expired. Please login again.");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          alert("Failed to place order: " + result.error);
        }
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("Failed to place order. Please try again.");
    }
    setConfirming(false);
  };

  if (loading) {
    return <div className="container">Loading order details...</div>;
  }

  if (!orderData || !pricing) {
    return <div className="container">Order data not found</div>;
  }

  const calc = calculatePricing();
  const serviceIcons = {
    "food-delivery": "🍔",
    "grocery-pickup": "🛒",
    "parcel-drop": "📦",
    "bike-taxi": "🏍️",
  };

  return (
    <div className="container" style={{ maxWidth: "600px" }}>
      <div className="admin-header">
        <h2>{serviceIcons[orderData.serviceType]} Order Confirmation</h2>
        <button
          onClick={() => navigate(-1)}
          style={{ width: "auto", background: "#6c757d" }}
        >
          Back
        </button>
      </div>

      {/* Order Summary */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          marginBottom: "20px",
        }}
      >
        <h3 style={{ margin: "0 0 15px 0", color: "#333" }}>
          📋 Order Summary
        </h3>

        <div style={{ marginBottom: "15px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span>📍 Pickup:</span>
            <span style={{ textAlign: "right", maxWidth: "60%" }}>
              {orderData.pickup.address}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span>🏁 Drop:</span>
            <span style={{ textAlign: "right", maxWidth: "60%" }}>
              {orderData.drop.address}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span>📏 Distance:</span>
            <span>{calc.distance} km</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>⏱️ Estimated Time:</span>
            <span>{calc.totalTime} minutes</span>
          </div>
        </div>

        {orderData.serviceType === "food-delivery" && (
          <div
            style={{
              padding: "10px",
              background: "#f8f9fa",
              borderRadius: "4px",
              marginBottom: "15px",
            }}
          >
            <strong>🏪 Restaurant:</strong> {orderData.formData.restaurantName}
            <br />
            <strong>📝 Order:</strong> {orderData.formData.orderDescription}
          </div>
        )}

        {orderData.serviceType === "grocery-pickup" && (
          <div
            style={{
              padding: "10px",
              background: "#f8f9fa",
              borderRadius: "4px",
              marginBottom: "15px",
            }}
          >
            <strong>🏬 Shop:</strong> {orderData.formData.shopName}
            <br />
            <strong>🛍️ Items:</strong> {orderData.formData.groceryList}
          </div>
        )}

        {orderData.serviceType === "parcel-drop" && (
          <div
            style={{
              padding: "10px",
              background: "#f8f9fa",
              borderRadius: "4px",
              marginBottom: "15px",
            }}
          >
            <strong>👤 Receiver:</strong> {orderData.formData.receiverName}
            <br />
            <strong>📱 Phone:</strong> {orderData.formData.receiverPhone}
            <br />
            <strong>📦 Description:</strong>{" "}
            {orderData.formData.parcelDescription}
          </div>
        )}
      </div>

      {/* Confirm Button */}
      <button
        onClick={handleConfirmOrder}
        disabled={confirming}
        style={{
          width: "100%",
          padding: "15px",
          fontSize: "18px",
          fontWeight: "bold",
          background: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        {confirming ? "Placing Order..." : "Confirm Order"}
      </button>

      <div
        style={{
          marginTop: "15px",
          padding: "10px",
          background: "#e7f3ff",
          borderRadius: "4px",
          fontSize: "12px",
          textAlign: "center",
        }}
      >
        💡 Billing will be done after delivery completion
      </div>
    </div>
  );
};

export default OrderConfirmation;
