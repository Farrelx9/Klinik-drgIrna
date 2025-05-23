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
  FETCH_BOOKED_APPOINTMENTS_REQUEST,
  FETCH_BOOKED_APPOINTMENTS_SUCCESS,
  FETCH_BOOKED_APPOINTMENTS_FAILURE,
} from "../types/authTypes";

const initialState = {
  loading: false,
  error: null,
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  isAuthenticated: !!localStorage.getItem("token"),
  token: localStorage.getItem("token"),
  bookedAppointments: [],
  appointmentsLoading: false,
  appointmentsError: null,
  currentPage: 1,
  totalPages: 1,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
    case "AUTH_REQUEST":
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
    case "AUTH_SUCCESS":
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };
    case LOGIN_FAILURE:
    case REGISTER_FAILURE:
    case "AUTH_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
      };
    case LOGOUT:
      return {
        ...initialState,
        user: null,
        token: null,
        isAuthenticated: false,
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
    case "PASSWORD_RESET_REQUEST_SUCCESS":
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
    case "OTP_VERIFY_SUCCESS":
      return {
        ...state,
        loading: false,
        error: null,
      };
    case "PASSWORD_RESET_SUCCESS":
      return {
        ...state,
        loading: false,
        error: null,
      };
    case FETCH_BOOKED_APPOINTMENTS_REQUEST:
      return {
        ...state,
        appointmentsLoading: true,
        appointmentsError: null,
      };

    case FETCH_BOOKED_APPOINTMENTS_SUCCESS:
      return {
        ...state,
        appointmentsLoading: false,
        bookedAppointments: action.payload.data || action.payload,
        currentPage: action.payload.meta?.page || 1,
        totalPages: action.payload.meta?.totalPages || 1,
        appointmentsError: null,
      };

    case FETCH_BOOKED_APPOINTMENTS_FAILURE:
      return {
        ...state,
        appointmentsLoading: false,
        appointmentsError: action.payload,
      };
    default:
      return state;
  }
};

export default authReducer;
