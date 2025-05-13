import {
  JANJITEMU_REQUEST,
  JANJITEMU_SUCCESS,
  JANJITEMU_FAILURE,
  BOOK_JANJITEMU_REQUEST,
  BOOK_JANJITEMU_SUCCESS,
  BOOK_JANJITEMU_FAILURE,
} from "../types/janjiTemuTypes";

const initialState = {
  list: [],
  meta: {
    totalItems: 0,
    itemCount: 10,
    totalPages: 1,
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
  },
  loading: false,
  error: null,

  // 🔹 Tambah state untuk booking
  isBooking: false,
  bookingError: null,
};

const janjiTemuReducer = (state = initialState, action) => {
  switch (action.type) {
    case JANJITEMU_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case JANJITEMU_SUCCESS:
      return {
        ...state,
        list: action.payload.data || [],
        meta: action.payload.meta || state.meta,
        loading: false,
      };

    case JANJITEMU_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        list: [],
      };

    // 🔹 BOOKING REDUCER
    case BOOK_JANJITEMU_REQUEST:
      return {
        ...state,
        isBooking: true,
        bookingError: null,
      };

    case BOOK_JANJITEMU_SUCCESS:
      return {
        ...state,
        isBooking: false,
        list: state.list.map((item) =>
          item.id_janji === action.payload.id_janji ? action.payload : item
        ),
      };

    case BOOK_JANJITEMU_FAILURE:
      return {
        ...state,
        isBooking: false,
        bookingError: action.payload,
      };

    default:
      return state;
  }
};

export default janjiTemuReducer;
