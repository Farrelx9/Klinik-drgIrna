import {
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
  CREATE_USER_SUCCESS,
  UPDATE_USER_SUCCESS,
  DELETE_USER_SUCCESS,
  SET_USER_PAGE,
} from "../action/userAdminAction";

const initialState = {
  loading: false,
  users: [],
  meta: {
    totalItems: 0,
    page: 1,
    totalPages: 1,
  },
  error: null,
};

const userAdminReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload.users || action.payload.data || [],
        meta: action.payload.meta || state.meta,
      };

    case FETCH_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CREATE_USER_SUCCESS:
      return {
        ...state,
        users: [action.payload, ...state.users],
      };

    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        users: state.users.map((item) =>
          item.id_pasien === action.payload.id_pasien ? action.payload : item
        ),
      };

    case DELETE_USER_SUCCESS:
      return {
        ...state,
        users: state.users.filter((item) => item.id_pasien !== action.payload),
      };

    case SET_USER_PAGE:
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

export default userAdminReducer;
