// config/axiosConfig.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Request Interceptor - tambahkan token otomatis
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor - tangkap error 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login"; // redirect ke halaman login
    }
    return Promise.reject(error);
  }
);

export default apiClient;
