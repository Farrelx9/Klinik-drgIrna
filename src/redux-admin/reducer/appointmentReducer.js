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
    currentPage: 1,
    totalPages: 1,
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
        appointments: action.payload.data || [],
        meta: {
          totalItems: parseInt(action.payload.meta?.totalItems) || 0,
          currentPage: parseInt(action.payload.meta?.currentPage) || 1,
          totalPages: parseInt(action.payload.meta?.totalPages) || 1,
          hasNextPage: Boolean(action.payload.meta?.hasNextPage),
          hasPrevPage: Boolean(action.payload.meta?.hasPrevPage),
        },
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
    case "SET_PAGE_APPOINTMENT":
      return {
        ...state,
        currentPage: action.payload,
      };

    default:
      return state;
  }
};

export default appointmentReducer;
