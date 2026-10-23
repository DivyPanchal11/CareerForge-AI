import axios from "axios";

export const API_BASE_URL = "http://localhost:5000";

const API = axios.create({
  baseURL: `${API_BASE_URL}/api/profile`,
});

// Interceptor to add Authorization Bearer token to headers automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper to format avatar image URL safely
export const getAvatarUrl = (avatar) => {
  if (!avatar || typeof avatar !== "string" || !avatar.trim()) {
    return null;
  }
  const clean = avatar.trim();
  if (clean.startsWith("http://") || clean.startsWith("https://") || clean.startsWith("data:")) {
    return clean;
  }
  return `${API_BASE_URL}${clean.startsWith("/") ? "" : "/"}${clean}`;
};

/**
 * Fetch authenticated user profile and completion stats
 */
export const getProfile = async () => {
  const response = await API.get("/");
  if (response.data.success && response.data.user) {
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }
  return response.data;
};

/**
 * Update authenticated user profile fields
 */
export const updateProfile = async (profileData) => {
  const response = await API.put("/", profileData);
  if (response.data.success && response.data.user) {
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }
  return response.data;
};

/**
 * Upload profile avatar (base64 image or direct URL)
 */
export const uploadAvatar = async (payload) => {
  const response = await API.post("/avatar", payload);
  if (response.data.success && response.data.user) {
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }
  return response.data;
};

/**
 * Update account password
 */
export const changePassword = async ({ currentPassword, newPassword }) => {
  const response = await API.put("/change-password", {
    currentPassword,
    newPassword,
  });
  return response.data;
};
