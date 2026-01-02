import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RapidoStyleMapPicker from "../components/RapidoStyleMapPicker";

const GroceryPickup = () => {
  const [formData, setFormData] = useState({
    shopLocation: "",
    dropLocation: "",
    shopName: "",
    groceryList: "",
  });
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropCoords, setDropCoords] = useState(null);
  const [groceryImage, setGroceryImage] = useState(null);
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
        setError("Image size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }
      setGroceryImage(file);
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

    if (!formData.shopLocation.trim()) {
      setError("Shop location is required");
      return;
    }
    if (!formData.dropLocation.trim()) {
      setError("Drop location is required");
      return;
    }
    if (!formData.shopName.trim()) {
      setError("Shop name is required");
      return;
    }
    if (!formData.groceryList.trim() && !groceryImage) {
      setError("Please provide grocery list or upload an image");
      return;
    }

    let imageUrl = null;
    if (groceryImage) {
      setLoading(true);
      const imageData = new FormData();
      imageData.append("file", groceryImage);
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

    navigate("/order-confirmation", {
      state: {
        orderData: {
          serviceType: "grocery-pickup",
          serviceId: 2,
          apiEndpoint: "grocery-order",
          pickup: { address: formData.shopLocation, ...pickupCoords },
          drop: { address: formData.dropLocation, ...dropCoords },
          formData: {
            shopLocation: formData.shopLocation,
            dropLocation: formData.dropLocation,
            shopName: formData.shopName,
            groceryList: formData.groceryList,
            groceryImageUrl: imageUrl,
          },
        },
      },
    });
  };

  return (
    <div className="container" style={{ maxWidth: "600px" }}>
      <div className="admin-header">
        <h2>🛒 Grocery Pickup</h2>
        <button
          onClick={() => navigate("/services")}
          style={{ width: "auto", background: "#6c757d" }}
        >
          Back to Services
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <RapidoStyleMapPicker
          placeholder="🏪 Shop Location"
          type="pickup"
          onLocationSelect={(location) => {
            setPickupCoords(location);
            setFormData({ ...formData, shopLocation: location.address });
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
          <label>🏬 Shop Name</label>
          <input
            type="text"
            name="shopName"
            value={formData.shopName}
            onChange={handleInputChange}
            placeholder="Enter shop name"
            required
          />
        </div>

        <div className="form-group">
          <label>📝 Grocery List</label>
          <textarea
            name="groceryList"
            value={formData.groceryList}
            onChange={handleInputChange}
            placeholder="List your grocery items (e.g., 1kg Rice, 2L Milk, 500g Sugar, Bread, Eggs)"
            rows="5"
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
          <label>📷 Upload Grocery List Image (Optional)</label>
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
            Upload shopping list photo or screenshot (Max 5MB)
          </small>
        </div>

        {imagePreview && (
          <div className="form-group">
            <label>Image Preview</label>
            <div
              style={{
                border: "2px solid #28a745",
                borderRadius: "8px",
                padding: "10px",
                textAlign: "center",
              }}
            >
              <img
                src={imagePreview}
                alt="Grocery List Preview"
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

        <button
          type="submit"
          disabled={loading}
          style={{ background: "#28a745" }}
        >
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
        <h4>🛍️ How it works:</h4>
        <ol style={{ margin: "10px 0", paddingLeft: "20px" }}>
          <li>Enter grocery shop location</li>
          <li>Enter your delivery address</li>
          <li>Specify shop name</li>
          <li>List your grocery items or upload image</li>
          <li>Our shopper will buy and deliver to you</li>
        </ol>
      </div>
    </div>
  );
};

export default GroceryPickup;
