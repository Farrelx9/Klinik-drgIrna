import {
  FETCH_JENIS_TINDAKAN_REQUEST,
  FETCH_JENIS_TINDAKAN_SUCCESS,
  FETCH_JENIS_TINDAKAN_FAILURE,
} from "../action/jenisTindakanAction";
const initialState = {
  loading: false,
  data: [],
  meta: {
    totalItems: 0,
    itemCount: 0,
    perPage: 5,
    page: 1,
    totalPages: 1,
  },
  error: null,
  filters: {
    search: "",
    page: 1,
    limit: 5,
  },
};

const jenisTindakanReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_JENIS_TINDAKAN_REQUEST:
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
        filters: {
          ...state.filters,
          search: action.payload.search,
          page: action.payload.page,
          limit: action.payload.limit,
        },
      };
    case FETCH_JENIS_TINDAKAN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default jenisTindakanReducer;
