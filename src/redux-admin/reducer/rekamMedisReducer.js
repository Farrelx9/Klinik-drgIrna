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
  error: null,
  meta: {
    totalItems: 0,
    page: 1,
    totalPages: 0,
  },
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
        data: Array.isArray(action.payload.data) ? action.payload.data : [], // Fallback jika bukan array
        meta: {
          totalItems: action.payload.meta?.totalItems || 0,
          page: action.payload.meta?.currentPage || 1,
          totalPages: action.payload.meta?.totalPages || 0,
        },
      };

    case CREATE_REKAM_MEDIS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: [...state.data, action.payload], // Tambahkan record baru ke akhir
        meta: {
          ...state.meta,
          totalItems: state.meta.totalItems + 1,
        },
      };

    case UPDATE_REKAM_MEDIS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: state.data.map((record) =>
          record.id_rekam_medis === action.payload.id_rekam_medis
            ? { ...record, ...action.payload }
            : record
        ),
      };

    case DELETE_REKAM_MEDIS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: state.data.filter(
          (item) => item.id_rekam_medis !== action.payload
        ),
        meta: {
          ...state.meta,
          totalItems: state.meta.totalItems - 1,
        },
      };

    case FETCH_REKAM_MEDIS_FAILURE:
    case CREATE_REKAM_MEDIS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
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
