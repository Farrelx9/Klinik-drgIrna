import axios from "axios";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGOUT,
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

// Action creator untuk login menggunakan axios
export const login = (emailOrPhoneNumber, password) => {
  return async (dispatch) => {
    dispatch(loginRequest());
    try {
      const response = await axios.post(
        "https://mudajayaexport-be.vercel.app/api/v1/auth/login",
        { emailOrPhoneNumber, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        const data = response.data;
        console.log(data);
        dispatch(loginSuccess(data));
        // Simpan token ke localStorage
        localStorage.setItem("token", data.token);
      } else {
        dispatch(loginFailure("Login failed"));
      }
    } catch (error) {
      dispatch(
        loginFailure(
          error.response?.data?.message || "An error occurred during login"
        )
      );
    }
  };
};

// Action creator untuk register menggunakan axios
export const register = (userData) => {
  return async (dispatch) => {
    dispatch(registerRequest());
    try {
      const response = await axios.post(
        "https://mudajayaexport-be.vercel.app/api/v1/auth/register",
        userData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201) {
        const data = response.data;
        dispatch(registerSuccess(data));
        // Simpan token ke localStorage
        localStorage.setItem("token", data.token);
      } else {
        dispatch(registerFailure("Registration failed"));
      }
    } catch (error) {
      dispatch(
        registerFailure(
          error.response?.data?.message ||
            "An error occurred during registration"
        )
      );
    }
  };
};
