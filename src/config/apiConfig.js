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
    console.log("Interceptor triggered for error:", error);

    if (error.response?.status === 401) {
      console.log("401 Unauthorized detected in interceptor");

      localStorage.setItem("authError", "Token tidak valid atau kadaluarsa");
      store.dispatch(loginFailure("Token tidak valid atau kadaluarsa"));

      window.dispatchEvent(new CustomEvent("unauthorized"));
    }

    return Promise.reject(error);
  }
);

export default apiClient;
