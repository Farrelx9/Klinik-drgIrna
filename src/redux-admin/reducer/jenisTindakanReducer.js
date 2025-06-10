import {
  FETCH_JENIS_TINDAKAN_REQUEST,
  FETCH_JENIS_TINDAKAN_SUCCESS,
  FETCH_JENIS_TINDAKAN_FAILURE,
  CREATE_JENIS_TINDAKAN_REQUEST,
  CREATE_JENIS_TINDAKAN_SUCCESS,
  CREATE_JENIS_TINDAKAN_FAILURE,
  UPDATE_JENIS_TINDAKAN_SUCCESS,
  DELETE_JENIS_TINDAKAN_SUCCESS,
  UPDATE_JENIS_TINDAKAN_REQUEST,
  UPDATE_JENIS_TINDAKAN_FAILURE,
  FETCH_ALL_JENIS_TINDAKAN_REQUEST,
  FETCH_ALL_JENIS_TINDAKAN_SUCCESS,
  FETCH_ALL_JENIS_TINDAKAN_FAILURE,
  SET_PAGE,
} from "../action/jenisTindakanAction";

const initialState = {
  loading: false,
  data: [], // Data dengan pagination
  allJenisTindakan: [], // Semua data tanpa pagination
  meta: {
    totalItems: 0,
    itemCount: 0,
    perPage: 5,
    page: 1,
    totalPages: 1,
  },
  error: null,
};

const jenisTindakanReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_JENIS_TINDAKAN_REQUEST:
    case CREATE_JENIS_TINDAKAN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_JENIS_TINDAKAN_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload.data,
        meta: action.payload.meta,
      };

    case FETCH_ALL_JENIS_TINDAKAN_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case CREATE_JENIS_TINDAKAN_SUCCESS:
      return {
        ...state,
        loading: false,
        data: [action.payload, ...state.data],
      };

    case FETCH_JENIS_TINDAKAN_FAILURE:
    case CREATE_JENIS_TINDAKAN_FAILURE:
    case UPDATE_JENIS_TINDAKAN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case UPDATE_JENIS_TINDAKAN_SUCCESS:
      return {
        ...state,
        loading: false,
        data: state.data.map((item) =>
          item.id_tindakan === action.payload.id_tindakan
            ? action.payload
            : item
        ),
      };

    case UPDATE_JENIS_TINDAKAN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case DELETE_JENIS_TINDAKAN_SUCCESS:
      return {
        ...state,
        loading: false,
        data: state.data.filter((item) => item.id_tindakan !== action.payload),
      };

    case SET_PAGE:
      return {
        ...state,
        meta: {
          ...state.meta,
          page: action.payload,
        },
      };

    default:
      return state;
  }
};

export default jenisTindakanReducer;
