import axios from "axios";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
} from "../types/authTypes";

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
