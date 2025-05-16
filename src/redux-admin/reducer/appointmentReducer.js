// appointmentReducer.js
import {
  FETCH_APPOINTMENTS_REQUEST,
  FETCH_APPOINTMENTS_SUCCESS,
  FETCH_APPOINTMENTS_FAILURE,
  CONFIRM_APPOINTMENT_REQUEST,
  CONFIRM_APPOINTMENT_SUCCESS,
  CONFIRM_APPOINTMENT_FAILURE,
  UPDATE_PAYMENT_REQUEST,
  UPDATE_PAYMENT_SUCCESS,
  UPDATE_PAYMENT_FAILURE,
} from "../action/appointmentAction";

const initialState = {
  loading: false,
  appointments: [],
  meta: {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
  },
  error: null,
  updatingId: null,
};

const appointmentReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_APPOINTMENTS_REQUEST:
    case CONFIRM_APPOINTMENT_REQUEST:
    case UPDATE_PAYMENT_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_APPOINTMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        appointments: action.payload.data || [], // Fallback ke array kosong
        meta: action.payload.meta || state.meta,
      };

    case FETCH_APPOINTMENTS_FAILURE:
    case CONFIRM_APPOINTMENT_FAILURE:
    case UPDATE_PAYMENT_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case CONFIRM_APPOINTMENT_SUCCESS:
    case UPDATE_PAYMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        appointments: state.appointments.map((apt) =>
          apt.id_janji === action.payload.id_janji ? action.payload : apt
        ),
      };

    default:
      return state;
  }
};

export default appointmentReducer;
