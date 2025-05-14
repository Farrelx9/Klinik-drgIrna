import {
  LOGIN_ROLE_REQUEST,
  LOGIN_ROLE_SUCCESS,
  LOGIN_ROLE_FAILURE,
  LOGOUT,
} from "../types/authAdminTypes";

const initialState = {
  token: localStorage.getItem("token") || null,
  role: null,
  isAuthenticated: !!localStorage.getItem("token"),
  loadingAdmin: false,
  errorAdmin: null,
};

export default function authAdminReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_ROLE_REQUEST:
      return {
        ...state,
        loadingAdmin: true,
        errorAdmin: null,
      };
    case LOGIN_ROLE_SUCCESS:
      return {
        ...state,
        loadingAdmin: false,
        token: action.payload.token,
        role: action.payload.role,
        isAuthenticated: true,
      };
    case LOGIN_ROLE_FAILURE:
      return {
        ...state,
        loadingAdmin: false,
        errorAdmin: action.payload,
        token: null,
        role: null,
        isAuthenticated: false,
      };
    case LOGOUT:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        role: null,
        isAuthenticated: false,
        loadingAdmin: false,
        errorAdmin: null,
      };
    default:
      return state;
  }
}
