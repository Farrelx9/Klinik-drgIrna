import {
  JANJITEMU_REQUEST,
  JANJITEMU_SUCCESS,
  JANJITEMU_FAILURE,
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
        list: action.payload.data,
        meta: action.payload.meta,
        loading: false,
      };

    case JANJITEMU_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default janjiTemuReducer;
