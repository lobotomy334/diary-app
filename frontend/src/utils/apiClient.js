import axios from "axios";
import "../pages/AuthPage.css";

const apiClient = axios.create({
  baseURL: "https://diary-backend-a496.onrender.com",
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;