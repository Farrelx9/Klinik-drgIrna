// config/axiosConfig.js

import axios from "axios";
import store from "../store";

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

      // Dispatch error ke Redux hanya sekali
      store.dispatch(loginFailure("Token tidak valid atau kadaluarsa"));

      // Simpan error ke localStorage agar bisa dibaca di halaman login
      localStorage.setItem("authError", "Token tidak valid atau kadaluarsa");

      // Redirect via event custom (bukan window.location)
      const event = new CustomEvent("unauthorized", {
        detail: { message: "Token tidak valid atau kadaluarsa" },
      });
      window.dispatchEvent(event);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
