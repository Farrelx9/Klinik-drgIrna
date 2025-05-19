// reducer/pasienReducer.js
import {
  FETCH_PASIEN_FAILURE,
  FETCH_PASIEN_REQUEST,
  FETCH_PASIEN_SUCCESS,
} from "../action/pasienAction";

const initialState = {
  loading: false,
  data: [],
  error: null,
};

const pasienReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PASIEN_REQUEST:
      return { ...state, loading: true };
    case FETCH_PASIEN_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload.data,
      };
    case FETCH_PASIEN_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default pasienReducer;
