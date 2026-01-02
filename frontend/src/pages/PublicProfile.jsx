import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const PublicProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPublicProfile();
  }, [userId]);

  const fetchPublicProfile = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/public/profile/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setOrders(data.orders);
      } else {
        setError("Profile not found");
      }
    } catch (err) {
      setError("Failed to load profile");
    }
    setLoading(false);
  };

  const serviceIcons = {
    "food-delivery": "🍔",
    "grocery-pickup": "🛒",
    "parcel-drop": "📦",
    "bike-taxi": "🏍️"
  };

  if (loading) return <div style={{padding: "20px"}}>Loading profile...</div>;
  if (error) return <div style={{padding: "20px", color: "red"}}>{error}</div>;

  return (
    <div style={{
      maxWidth: "800px",
      margin: "0 auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        padding: "30px",
        borderRadius: "12px",
        textAlign: "center",
        marginBottom: "30px"
      }}>
        <div style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "white",
          color: "#667eea",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "32px",
          fontWeight: "bold",
          margin: "0 auto 20px"
        }}>
          {user.name.charAt(0).toUpperCase()}
        </div>
        <h1 style={{margin: "0 0 10px 0"}}>{user.name}</h1>
        <p style={{margin: "0", opacity: "0.9"}}>User #{user.user_number}</p>
        <p style={{margin: "10px 0 0 0", opacity: "0.8"}}>
          Member since {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div style={{
        background: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        marginBottom: "30px"
      }}>
        <h2 style={{margin: "0 0 20px 0", color: "#333"}}>📊 Activity Summary</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "15px"
        }}>
          <div style={{textAlign: "center", padding: "15px", background: "#f8f9fa", borderRadius: "8px"}}>
            <div style={{fontSize: "24px", fontWeight: "bold", color: "#28a745"}}>{orders.length}</div>
            <div style={{fontSize: "14px", color: "#666"}}>Total Orders</div>
          </div>
          <div style={{textAlign: "center", padding: "15px", background: "#f8f9fa", borderRadius: "8px"}}>
            <div style={{fontSize: "24px", fontWeight: "bold", color: "#007bff"}}>
              {orders.filter(o => o.service_type === 'food-delivery').length}
            </div>
            <div style={{fontSize: "14px", color: "#666"}}>Food Orders</div>
          </div>
          <div style={{textAlign: "center", padding: "15px", background: "#f8f9fa", borderRadius: "8px"}}>
            <div style={{fontSize: "24px", fontWeight: "bold", color: "#17a2b8"}}>
              {orders.filter(o => o.service_type === 'bike-taxi').length}
            </div>
            <div style={{fontSize: "14px", color: "#666"}}>Rides Taken</div>
          </div>
        </div>
      </div>

      <div style={{
        background: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{margin: "0 0 20px 0", color: "#333"}}>📋 Recent Orders</h2>
        {orders.length === 0 ? (
          <p style={{textAlign: "center", color: "#666", padding: "20px"}}>No orders yet</p>
        ) : (
          <div style={{display: "grid", gap: "15px"}}>
            {orders.slice(0, 5).map(order => (
              <div key={`${order.service_type}-${order.id}`} style={{
                padding: "15px",
                border: "1px solid #eee",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div>
                  <div style={{fontWeight: "bold", marginBottom: "5px"}}>
                    {serviceIcons[order.service_type]} {order.service_type.replace('-', ' ').toUpperCase()}
                  </div>
                  <div style={{fontSize: "14px", color: "#666"}}>
                    {new Date(order.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div style={{
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  background: order.status === "completed" ? "#d4edda" : "#fff3cd",
                  color: order.status === "completed" ? "#155724" : "#856404"
                }}>
                  {order.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{
        textAlign: "center",
        marginTop: "30px",
        padding: "20px",
        background: "#f8f9fa",
        borderRadius: "8px"
      }}>
        <p style={{margin: "0", color: "#666"}}>
          🌟 Powered by Super Splender - Your Super App for Everything
        </p>
      </div>
    </div>
  );
};

export default PublicProfile;