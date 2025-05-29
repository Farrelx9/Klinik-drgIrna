import {
  LOGIN_ROLE_REQUEST,
  LOGIN_ROLE_SUCCESS,
  LOGIN_ROLE_FAILURE,
  LOGOUT,
} from "../types/authAdminTypes";
import apiClient from "../../config/apiConfigAdmin";

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
    const res = await apiClient.post("/auth/login/role", {
      email,
      password,
    });

    const { token, role } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    dispatch(loginRoleSuccess({ token, role }));
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Login gagal";
    dispatch(loginRoleFailure(errorMessage));
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  dispatch({ type: LOGOUT });
};
