import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RapidoStyleMapPicker from "../components/RapidoStyleMapPicker";

const FoodDelivery = () => {
  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropLocation: "",
    restaurantName: "",
    orderDescription: "",
  });
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropCoords, setDropCoords] = useState(null);
  const [orderImage, setOrderImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError("Image size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }
      setOrderImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!pickupCoords || !dropCoords) {
      setError("Please select both pickup and drop locations from the map");
      return;
    }

    // Validation
    if (!formData.pickupLocation.trim()) {
      setError("Pickup location is required");
      return;
    }
    if (!formData.dropLocation.trim()) {
      setError("Drop location is required");
      return;
    }
    if (!formData.restaurantName.trim()) {
      setError("Restaurant name is required");
      return;
    }
    if (!formData.orderDescription.trim() && !orderImage) {
      setError("Please provide order description or upload an image");
      return;
    }

    // Upload image to Cloudinary if present
    let imageUrl = null;
    if (orderImage) {
      setLoading(true);
      const imageData = new FormData();
      imageData.append("file", orderImage);
      imageData.append("upload_preset", "ml_default");

      try {
        const cloudinaryResponse = await fetch(
          "https://api.cloudinary.com/v1_1/dzg9rjqcn/image/upload",
          { method: "POST", body: imageData }
        );
        const cloudinaryResult = await cloudinaryResponse.json();
        imageUrl = cloudinaryResult.secure_url;
      } catch (err) {
        setError("Failed to upload image");
        setLoading(false);
        return;
      }
      setLoading(false);
    }

    // Navigate to order confirmation
    navigate("/order-confirmation", {
      state: {
        orderData: {
          serviceType: "food-delivery",
          serviceId: 1,
          apiEndpoint: "food-order",
          pickup: { address: formData.pickupLocation, ...pickupCoords },
          drop: { address: formData.dropLocation, ...dropCoords },
          formData: {
            pickupLocation: formData.pickupLocation,
            dropLocation: formData.dropLocation,
            restaurantName: formData.restaurantName,
            orderDescription: formData.orderDescription,
            orderImageUrl: imageUrl,
          },
        },
      },
    });
  };

  return (
    <div className="container" style={{ maxWidth: "600px" }}>
      <div className="admin-header">
        <h2>🍔 Food Delivery</h2>
        <button
          onClick={() => navigate("/services")}
          style={{ width: "auto", background: "#6c757d" }}
        >
          Back to Services
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <RapidoStyleMapPicker
          placeholder="📍 Pickup Location (Restaurant/Shop)"
          type="pickup"
          onLocationSelect={(location) => {
            setPickupCoords(location);
            setFormData({ ...formData, pickupLocation: location.address });
          }}
        />

        <RapidoStyleMapPicker
          placeholder="🏠 Drop Location (Your Address)"
          type="drop"
          onLocationSelect={(location) => {
            setDropCoords(location);
            setFormData({ ...formData, dropLocation: location.address });
          }}
        />

        <div className="form-group">
          <label>🏪 Restaurant/Shop Name</label>
          <input
            type="text"
            name="restaurantName"
            value={formData.restaurantName}
            onChange={handleInputChange}
            placeholder="Enter restaurant or shop name"
            required
          />
        </div>

        <div className="form-group">
          <label>📝 Order Description</label>
          <textarea
            name="orderDescription"
            value={formData.orderDescription}
            onChange={handleInputChange}
            placeholder="Describe your order (e.g., 2x Burger, 1x Fries, 1x Coke)"
            rows="4"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px",
              resize: "vertical",
            }}
          />
        </div>

        <div className="form-group">
          <label>📷 Upload Order Image (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{
              padding: "10px",
              border: "2px dashed #ddd",
              borderRadius: "4px",
              width: "100%",
              cursor: "pointer",
            }}
          />
          <small style={{ color: "#666", fontSize: "12px" }}>
            Upload menu screenshot or order image (Max 5MB)
          </small>
        </div>

        {imagePreview && (
          <div className="form-group">
            <label>Image Preview</label>
            <div
              style={{
                border: "2px solid #007bff",
                borderRadius: "8px",
                padding: "10px",
                textAlign: "center",
              }}
            >
              <img
                src={imagePreview}
                alt="Order Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "200px",
                  borderRadius: "4px",
                }}
              />
            </div>
          </div>
        )}

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Uploading Image..." : "Continue to Confirmation"}
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
          <li>Enter pickup location (restaurant address)</li>
          <li>Enter your delivery address</li>
          <li>Specify restaurant/shop name</li>
          <li>Describe your order or upload image</li>
          <li>Our delivery partner will collect and deliver</li>
        </ol>
      </div>
    </div>
  );
};

export default FoodDelivery;
