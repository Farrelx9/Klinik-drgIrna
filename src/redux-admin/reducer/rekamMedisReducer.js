import {
  CREATE_REKAM_MEDIS_FAILURE,
  CREATE_REKAM_MEDIS_REQUEST,
  CREATE_REKAM_MEDIS_SUCCESS,
  DELETE_REKAM_MEDIS_SUCCESS,
  FETCH_REKAM_MEDIS_FAILURE,
  FETCH_REKAM_MEDIS_REQUEST,
  FETCH_REKAM_MEDIS_SUCCESS,
  SET_REKAM_MEDIS_PAGE,
  UPDATE_REKAM_MEDIS_SUCCESS,
} from "../action/rekamMedisAction";

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
};

const rekamMedisReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_REKAM_MEDIS_REQUEST:
    case CREATE_REKAM_MEDIS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_REKAM_MEDIS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload.data,
        meta: {
          ...state.meta,
          totalItems: action.payload.meta.totalItems,
          page: action.payload.meta.page,
          totalPages: action.payload.meta.totalPages,
        },
      };

    case CREATE_REKAM_MEDIS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: [action.payload, ...state.data],
      };

    case FETCH_REKAM_MEDIS_FAILURE:
    case CREATE_REKAM_MEDIS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case UPDATE_REKAM_MEDIS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: state.data.map((item) =>
          item.id_rekam_medis === action.payload.id_rekam_medis
            ? action.payload
            : item
        ),
      };

    case DELETE_REKAM_MEDIS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: state.data.filter(
          (item) => item.id_rekam_medis !== action.payload
        ),
      };

    case SET_REKAM_MEDIS_PAGE:
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

export default rekamMedisReducer;
