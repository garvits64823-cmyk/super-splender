import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  // Check for admin token first, then regular token
  const adminToken = localStorage.getItem("adminToken");
  const userToken = localStorage.getItem("token");
  const token = adminToken || userToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  sendOTP: (identifier, type) => api.post("/send-otp", { identifier, type }),

  verifyOTP: (identifier, otp) => api.post("/verify-otp", { identifier, otp }),

  completeRegistration: (data) => api.post("/complete-registration", data),

  updateProfile: (data) => api.put("/update-profile", data),

  sendResetOTP: (identifier, type) =>
    api.post("/send-reset-otp", { identifier, type }),

  verifyResetOTP: (identifier, otp) =>
    api.post("/verify-reset-otp", { identifier, otp }),

  resetPassword: (identifier, otp, newPassword) =>
    api.post("/reset-password", { identifier, otp, newPassword }),
};

export const adminAPI = {
  login: (email, password) => api.post("/admin/login", { email, password }),

  getUsers: (search = "", filter = "") =>
    api.get(`/admin/users?search=${search}&filter=${filter}`),

  blockUser: (id, isBlocked) =>
    api.patch(`/admin/users/${id}/block`, { isBlocked }),

  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  getCompanyInfo: () => api.get("/company-info"),

  updateCompanyInfo: (data) => api.post("/admin/company-info", data),
  
  getServicePricing: () => api.get("/admin/service-pricing"),
  
  updateServicePricing: (serviceId, data) => 
    api.put(`/admin/service-pricing/${serviceId}`, data),
};

export default api;
