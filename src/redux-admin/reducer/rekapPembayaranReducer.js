// src/redux-admin/reducer/rekapPembayaranReducer.js

import {
  FETCH_REKAP_PEMBAYARAN_REQUEST,
  FETCH_REKAP_PEMBAYARAN_SUCCESS,
  FETCH_REKAP_PEMBAYARAN_FAILURE,
  FETCH_REKAP_PEMBAYARAN_BY_ID_REQUEST,
  FETCH_REKAP_PEMBAYARAN_BY_ID_SUCCESS,
  FETCH_REKAP_PEMBAYARAN_BY_ID_FAILURE,
  FETCH_REKAP_PEMBAYARAN_BY_PASIEN_REQUEST,
  FETCH_REKAP_PEMBAYARAN_BY_PASIEN_SUCCESS,
  FETCH_REKAP_PEMBAYARAN_BY_PASIEN_FAILURE,
  CREATE_REKAP_PEMBAYARAN_REQUEST,
  CREATE_REKAP_PEMBAYARAN_SUCCESS,
  CREATE_REKAP_PEMBAYARAN_FAILURE,
  DELETE_REKAP_PEMBAYARAN_REQUEST,
  DELETE_REKAP_PEMBAYARAN_SUCCESS,
  DELETE_REKAP_PEMBAYARAN_FAILURE,
  UPDATE_REKAP_PEMBAYARAN_REQUEST,
  UPDATE_REKAP_PEMBAYARAN_SUCCESS,
  UPDATE_REKAP_PEMBAYARAN_FAILURE,
  SET_PAGE,
} from "../action/rekapPembayaranAction";

const initialState = {
  data: [],
  itemById: null,
  itemsByPasien: [],
  loading: false,
  error: null,
  meta: {},
};

export default function rekapPembayaranReducer(state = initialState, action) {
  switch (action.type) {
    // === Fetch All Rekap Pembayaran ===
    case FETCH_REKAP_PEMBAYARAN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_REKAP_PEMBAYARAN_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload.data,
        meta: action.payload.meta,
      };
    case FETCH_REKAP_PEMBAYARAN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // === Fetch By ID ===
    case FETCH_REKAP_PEMBAYARAN_BY_ID_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_REKAP_PEMBAYARAN_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        itemById: action.payload,
      };
    case FETCH_REKAP_PEMBAYARAN_BY_ID_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // === Fetch By Pasien ===
    case FETCH_REKAP_PEMBAYARAN_BY_PASIEN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_REKAP_PEMBAYARAN_BY_PASIEN_SUCCESS:
      return {
        ...state,
        loading: false,
        itemsByPasien: action.payload,
      };
    case FETCH_REKAP_PEMBAYARAN_BY_PASIEN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // === Create ===
    case CREATE_REKAP_PEMBAYARAN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case CREATE_REKAP_PEMBAYARAN_SUCCESS:
      return {
        ...state,
        loading: false,
        data: [action.payload, ...state.data],
      };
    case CREATE_REKAP_PEMBAYARAN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // === Delete ===
    case DELETE_REKAP_PEMBAYARAN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DELETE_REKAP_PEMBAYARAN_SUCCESS:
      return {
        ...state,
        loading: false,
        data: state.data.filter((item) => item.id_rekap !== action.payload),
      };
    case DELETE_REKAP_PEMBAYARAN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_REKAP_PEMBAYARAN_SUCCESS:
      return {
        ...state,
        loading: false,
        data: state.data.map((item) =>
          item.id_rekap === action.payload.id_rekap ? action.payload : item
        ),
      };

    case UPDATE_REKAP_PEMBAYARAN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // === Update Page ===
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
}
