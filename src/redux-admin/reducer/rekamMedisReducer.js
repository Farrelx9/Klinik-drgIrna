import {
  FETCH_REKAM_MEDIS_REQUEST,
  FETCH_REKAM_MEDIS_SUCCESS,
  FETCH_REKAM_MEDIS_FAILURE,
  CREATE_REKAM_MEDIS_REQUEST,
  CREATE_REKAM_MEDIS_SUCCESS,
  CREATE_REKAM_MEDIS_FAILURE,
  UPDATE_REKAM_MEDIS_SUCCESS,
  DELETE_REKAM_MEDIS_SUCCESS,
  SET_REKAM_MEDIS_PAGE,

  // Tambahkan ini
  FETCH_REKAM_MEDIS_BY_PASIEN_REQUEST,
  FETCH_REKAM_MEDIS_BY_PASIEN_SUCCESS,
  FETCH_REKAM_MEDIS_BY_PASIEN_FAILURE,
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
  patientRecords: {
    loading: false,
    error: null,
    data: [],
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
        data: Array.isArray(action.payload.data) ? action.payload.data : [],
        meta: {
          totalItems: action.payload.meta?.totalItems || 0,
          page: action.payload.meta?.currentPage || 1,
          totalPages: action.payload.meta?.totalPages || 0,
        },
      };

    case FETCH_REKAM_MEDIS_BY_PASIEN_REQUEST:
      return {
        ...state,
        patientRecords: {
          ...state.patientRecords,
          loading: true,
          error: null,
        },
      };

    case FETCH_REKAM_MEDIS_BY_PASIEN_SUCCESS:
      return {
        ...state,
        patientRecords: {
          loading: false,
          error: null,
          data: Array.isArray(action.payload) ? action.payload : [],
        },
      };

    case FETCH_REKAM_MEDIS_BY_PASIEN_FAILURE:
      return {
        ...state,
        patientRecords: {
          loading: false,
          error: action.payload,
          data: [],
        },
      };

    case CREATE_REKAM_MEDIS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: [...state.data, action.payload],
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
