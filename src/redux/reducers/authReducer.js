import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGOUT,
  FETCH_PROFILE_REQUEST,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAILURE,
  REQUEST_CHANGE_PASSWORD_OTP_REQUEST,
  REQUEST_CHANGE_PASSWORD_OTP_SUCCESS,
  REQUEST_CHANGE_PASSWORD_OTP_FAILURE,
  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAILURE,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
} from "../types/authTypes";

const initialState = {
  isAuthenticated: !!localStorage.getItem("token"),
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  token: localStorage.getItem("token"),
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        error: null,
      };
    case LOGIN_FAILURE:
    case REGISTER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    case FETCH_PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
        error: null,
      };
    case FETCH_PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case REQUEST_CHANGE_PASSWORD_OTP_REQUEST:
      return { ...state, loading: true, error: null };
    case REQUEST_CHANGE_PASSWORD_OTP_SUCCESS:
      return { ...state, loading: false, error: null };
    case REQUEST_CHANGE_PASSWORD_OTP_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case CHANGE_PASSWORD_REQUEST:
      return { ...state, loading: true, error: null };
    case CHANGE_PASSWORD_SUCCESS:
      return { ...state, loading: false, error: null };
    case CHANGE_PASSWORD_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case UPDATE_PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_PROFILE_SUCCESS:
      console.log("Updated user in reducer:", action.payload);
      return {
        ...state,
        loading: false,
        user: action.payload,
        error: null,
      };
    case UPDATE_PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default authReducer;
