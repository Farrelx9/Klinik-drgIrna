import axios from "axios";
import store from "../store"; // Pastikan path import store ini benar
import { loginRoleFailure } from "../redux-admin/action/authAdminActions";

const apiClient = axios.create({
  baseURL: "https://bejs-klinik.vercel.app/api",
});

// Request Interceptor - tambahkan token otomatis (Admin)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Ambil token dari localStorage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor - tangkap error 401 (Admin)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("Interceptor triggered for error:", error);

    if (error.response?.status === 401) {
      console.log("401 Unauthorized detected in interceptor");

      // Clear auth data from localStorage (Admin)
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      // Dispatch loginRoleFailure action (Admin)
      store.dispatch(
        loginRoleFailure(
          "Token tidak valid atau kadaluarsa. Silakan login kembali."
        )
      );

      // Redirect to login page (Admin)
      window.location.href = "/login-admin";
    }

    return Promise.reject(error);
  }
);

export default apiClient;
