import * as types from "../action/userAdminAction";

const initialState = {
  users: [],
  loading: false,
  error: null,
  meta: {},
};

const userAdminReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_USERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.FETCH_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload.users,
        meta: action.payload.meta,
      };
    case types.FETCH_USERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case types.SET_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };
    default:
      return state;
  }
};

export default userAdminReducer;
