import axios from "axios";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGOUT,
  VERIFY_OTP_REQUEST,
  VERIFY_OTP_SUCCESS,
  VERIFY_OTP_FAILURE,
  FETCH_PROFILE_REQUEST,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAILURE,
  REQUEST_CHANGE_PASSWORD_OTP_REQUEST,
  REQUEST_CHANGE_PASSWORD_OTP_SUCCESS,
  REQUEST_CHANGE_PASSWORD_OTP_FAILURE,
  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAILURE,
} from "../types/authTypes";

// Login Actions
export const loginRequest = () => ({
  type: LOGIN_REQUEST,
});

export const loginSuccess = (user) => ({
  type: LOGIN_SUCCESS,
  payload: user,
});

export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: error,
});

// Register Actions
export const registerRequest = () => ({
  type: REGISTER_REQUEST,
});

export const registerSuccess = (user) => ({
  type: REGISTER_SUCCESS,
  payload: user,
});

export const registerFailure = (error) => ({
  type: REGISTER_FAILURE,
  payload: error,
});

export const logout = () => ({
  type: LOGOUT,
});

// OTP Verification Actions
export const verifyOtpRequest = () => ({
  type: VERIFY_OTP_REQUEST,
});

export const verifyOtpSuccess = (data) => ({
  type: VERIFY_OTP_SUCCESS,
  payload: data,
});

export const verifyOtpFailure = (error) => ({
  type: VERIFY_OTP_FAILURE,
  payload: error,
});

// Resend OTP Actions
export const resendOtpRequest = () => ({
  type: "RESEND_OTP_REQUEST",
});

export const resendOtpSuccess = (data) => ({
  type: "RESEND_OTP_SUCCESS",
  payload: data,
});

export const resendOtpFailure = (error) => ({
  type: "RESEND_OTP_FAILURE",
  payload: error,
});

// Fetch Profile Actions
export const fetchProfileRequest = () => ({
  type: FETCH_PROFILE_REQUEST,
});

export const fetchProfileSuccess = (profile) => ({
  type: FETCH_PROFILE_SUCCESS,
  payload: profile,
});

export const fetchProfileFailure = (error) => ({
  type: FETCH_PROFILE_FAILURE,
  payload: error,
});

// Action creator untuk login menggunakan axios
export const login = (email, password) => {
  return async (dispatch) => {
    dispatch(loginRequest());
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        const data = response.data;
        console.log("Login response:", data);

        // Simpan data user dan token ke localStorage
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        dispatch(loginSuccess(data));
        return true; // Return true to indicate successful login
      } else {
        dispatch(loginFailure("Login failed"));
        return false;
      }
    } catch (error) {
      console.error("Login error:", error.response?.data);
      let errorMessage = "An error occurred during login";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      dispatch(loginFailure(errorMessage));
      return false;
    }
  };
};

// Action creator untuk register menggunakan axios
export const register = (userData) => {
  return async (dispatch) => {
    dispatch(registerRequest());
    try {
      console.log("Sending registration data:", userData);
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        userData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201) {
        const data = response.data;
        console.log("Registration response:", data);

        // Simpan data user ke localStorage
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        dispatch(registerSuccess(data));
        return true; // Return true to indicate successful registration
      } else {
        dispatch(registerFailure("Registration failed"));
        return false;
      }
    } catch (error) {
      console.error("Registration error:", error.response?.data);
      let errorMessage = "An error occurred during registration";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      dispatch(registerFailure(errorMessage));
      return false;
    }
  };
};

export const verifyOtp = (userId, otp) => {
  return async (dispatch) => {
    dispatch(verifyOtpRequest());
    try {
      // Get user data from localStorage to get email
      const userData = localStorage.getItem("user");
      if (!userData) {
        dispatch(verifyOtpFailure("User data not found"));
        return false;
      }

      const { email } = JSON.parse(userData);
      console.log("Sending OTP verification data:", { email, kode_otp: otp });

      const response = await axios.post(
        "http://localhost:3000/api/auth/verifyOtp",
        {
          email,
          kode_otp: otp,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        const data = response.data;
        console.log("OTP verification response:", data);

        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        dispatch(verifyOtpSuccess(data));
        return true;
      } else {
        dispatch(verifyOtpFailure("OTP verification failed"));
        return false;
      }
    } catch (error) {
      console.error("OTP verification error:", error.response?.data);
      let errorMessage = "An error occurred during OTP verification";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      dispatch(verifyOtpFailure(errorMessage));
      return false;
    }
  };
};

export const resendOtp = () => {
  return async (dispatch) => {
    dispatch(resendOtpRequest());
    try {
      // Get user data from localStorage
      const userData = localStorage.getItem("user");
      if (!userData) {
        dispatch(resendOtpFailure("User data not found"));
        return false;
      }

      const { email } = JSON.parse(userData);
      console.log("Sending resend OTP request for:", email);

      const response = await axios.post(
        "http://localhost:3000/api/auth/sendOtp",
        { email },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        const data = response.data;
        console.log("Resend OTP response:", data);
        dispatch(resendOtpSuccess(data));
        return true;
      } else {
        dispatch(resendOtpFailure("Failed to resend OTP"));
        return false;
      }
    } catch (error) {
      console.error("Resend OTP error:", error.response?.data);
      let errorMessage = "An error occurred while resending OTP";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      dispatch(resendOtpFailure(errorMessage));
      return false;
    }
  };
};

export const fetchProfile = () => {
  return async (dispatch) => {
    dispatch(fetchProfileRequest());
    try {
      // Ambil token dari localStorage jika perlu autentikasi
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3000/api/auth/profile",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;
        // Pastikan backend mengirim data sesuai body yang Anda sebutkan
        dispatch(fetchProfileSuccess(data));
      } else {
        dispatch(fetchProfileFailure("Failed to fetch profile"));
      }
    } catch (error) {
      let errorMessage = "An error occurred while fetching profile";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      dispatch(fetchProfileFailure(errorMessage));
    }
  };
};

// Request OTP untuk perubahan password
export const requestChangePasswordOtp = (oldPassword) => {
  return async (dispatch) => {
    dispatch({ type: REQUEST_CHANGE_PASSWORD_OTP_REQUEST });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/auth/requestChangePasswordOtp",
        { oldPassword },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch({
        type: REQUEST_CHANGE_PASSWORD_OTP_SUCCESS,
        payload: response.data,
      });
      return true;
    } catch (error) {
      dispatch({
        type: REQUEST_CHANGE_PASSWORD_OTP_FAILURE,
        payload: error.response?.data?.message || "Gagal request OTP",
      });
      return false;
    }
  };
};

// Change password dengan OTP
export const changePassword = (kode_otp, newPassword, oldPassword) => {
  return async (dispatch) => {
    dispatch({ type: CHANGE_PASSWORD_REQUEST });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/auth/changePassword",
        { kode_otp, newPassword, oldPassword },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch({ type: CHANGE_PASSWORD_SUCCESS, payload: response.data });
      return true;
    } catch (error) {
      dispatch({
        type: CHANGE_PASSWORD_FAILURE,
        payload: error.response?.data?.message || "Gagal change password",
      });
      return false;
    }
  };
};
