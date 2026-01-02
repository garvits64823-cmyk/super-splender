import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../services/api";

const CompanySettings = () => {
  const [companyName, setCompanyName] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [currentLogo, setCurrentLogo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin");
      return;
    }
    fetchCompanyData();
  }, [navigate]);

  const fetchCompanyData = async () => {
    try {
      const response = await adminAPI.getCompanyInfo();
      setCompanyName(response.data.name);
      setCurrentLogo(response.data.logo);
    } catch (err) {
      console.log("Using default values");
      setCompanyName("Your Company Name");
      setCurrentLogo("/default-logo.png");
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError("Logo file size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }
      setLogoFile(file);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!companyName.trim()) {
      setError("Company name is required");
      return;
    }

    setLoading(true);
    try {
      // Send as JSON for now (logo upload can be added later)
      await adminAPI.updateCompanyInfo({
        name: companyName.trim(),
      });

      setSuccess("Company information updated successfully!");
      setLogoFile(null);
      fetchCompanyData(); // Refresh data
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to update company information"
      );
    }
    setLoading(false);
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Company Settings</h2>
        <div>
          <button
            onClick={() => navigate("/admin/dashboard")}
            style={{
              width: "auto",
              marginRight: "10px",
              background: "#6c757d",
            }}
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("adminToken");
              navigate("/admin");
            }}
            style={{ width: "auto", background: "#dc3545" }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name"
              required
            />
          </div>

          <div className="form-group">
            <label>Current Logo</label>
            <div
              style={{
                width: "100px",
                height: "100px",
                border: "2px dashed #ddd",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "10px",
                background: "#f8f9fa",
              }}
            >
              {currentLogo && currentLogo !== "/default-logo.png" ? (
                <img
                  src={currentLogo}
                  alt="Current Logo"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "4px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div style={{ fontSize: "32px", color: "#666" }}>🏢</div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Upload New Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              style={{
                padding: "10px",
                border: "2px dashed #ddd",
                borderRadius: "4px",
                width: "100%",
                cursor: "pointer",
              }}
            />
            <small style={{ color: "#666", fontSize: "12px" }}>
              Supported formats: JPG, PNG, GIF. Max size: 5MB
            </small>
          </div>

          {logoFile && (
            <div className="form-group">
              <label>Preview New Logo</label>
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  border: "2px solid #007bff",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#f8f9fa",
                }}
              >
                <img
                  src={URL.createObjectURL(logoFile)}
                  alt="Logo Preview"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "4px",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          )}

          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Company Info"}
          </button>
        </form>

        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            background: "#f8f9fa",
            borderRadius: "8px",
            border: "1px solid #dee2e6",
          }}
        >
          <h4>Preview Landing Page</h4>
          <div
            style={{
              padding: "20px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "8px",
              color: "white",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 15px auto",
              }}
            >
              {currentLogo && currentLogo !== "/default-logo.png" ? (
                <img
                  src={currentLogo}
                  alt="Logo"
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div style={{ fontSize: "24px", color: "#667eea" }}>🏢</div>
              )}
            </div>
            <h3 style={{ margin: "0", fontSize: "24px" }}>{companyName}</h3>
            <p style={{ margin: "5px 0 0 0", fontSize: "12px", opacity: 0.8 }}>
              Secure Authentication System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySettings;
