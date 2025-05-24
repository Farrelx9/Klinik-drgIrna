import {
  LOGIN_ROLE_REQUEST,
  LOGIN_ROLE_SUCCESS,
  LOGIN_ROLE_FAILURE,
  LOGOUT,
} from "../types/authAdminTypes";
import axios from "axios";

export const loginRoleRequest = () => ({
  type: LOGIN_ROLE_REQUEST,
});

export const loginRoleSuccess = (payload) => ({
  type: LOGIN_ROLE_SUCCESS,
  payload,
});

export const loginRoleFailure = (error) => ({
  type: LOGIN_ROLE_FAILURE,
  error,
});

export const loginRole = (email, password) => async (dispatch) => {
  dispatch(loginRoleRequest());

  try {
    const res = await axios.post(
      "https://bejs-klinik.vercel.app/api/auth/login/role",
      {
        email,
        password,
      }
    );

    const { token, role } = res.data;

    localStorage.setItem("token", token);

    dispatch(loginRoleSuccess({ token, role }));
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Login gagal";
    dispatch(loginRoleFailure(errorMessage));
    localStorage.removeItem("token");
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("token");
  dispatch({ type: LOGOUT });
};
