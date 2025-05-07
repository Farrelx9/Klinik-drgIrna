import {
  CREATE_JANJI_TEMU_REQUEST,
  CREATE_JANJI_TEMU_SUCCESS,
  CREATE_JANJI_TEMU_FAIL,
  GET_JANJI_TEMU_REQUEST,
  GET_JANJI_TEMU_SUCCESS,
  GET_JANJI_TEMU_FAIL,
} from "../types/janjiTemuTypes";

const initialState = {
  loading: false,
  janjiTemu: null,
  janjiTemuList: [],
  error: null,
};

export const janjiTemuReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_JANJI_TEMU_REQUEST:
    case GET_JANJI_TEMU_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case CREATE_JANJI_TEMU_SUCCESS:
      return {
        ...state,
        loading: false,
        janjiTemu: action.payload,
        error: null,
      };

    case GET_JANJI_TEMU_SUCCESS:
      return {
        ...state,
        loading: false,
        janjiTemuList: action.payload,
        error: null,
      };

    case CREATE_JANJI_TEMU_FAIL:
    case GET_JANJI_TEMU_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
