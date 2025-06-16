import apiClient from "../../config/apiConfigAdmin";

// === Action Types ===
export const FETCH_REKAP_PEMBAYARAN_REQUEST = "FETCH_REKAP_PEMBAYARAN_REQUEST";
export const FETCH_REKAP_PEMBAYARAN_SUCCESS = "FETCH_REKAP_PEMBAYARAN_SUCCESS";
export const FETCH_REKAP_PEMBAYARAN_FAILURE = "FETCH_REKAP_PEMBAYARAN_FAILURE";

export const FETCH_REKAP_PEMBAYARAN_BY_ID_REQUEST =
  "FETCH_REKAP_PEMBAYARAN_BY_ID_REQUEST";
export const FETCH_REKAP_PEMBAYARAN_BY_ID_SUCCESS =
  "FETCH_REKAP_PEMBAYARAN_BY_ID_SUCCESS";
export const FETCH_REKAP_PEMBAYARAN_BY_ID_FAILURE =
  "FETCH_REKAP_PEMBAYARAN_BY_ID_FAILURE";

export const FETCH_REKAP_PEMBAYARAN_BY_PASIEN_REQUEST =
  "FETCH_REKAP_PEMBAYARAN_BY_PASIEN_REQUEST";
export const FETCH_REKAP_PEMBAYARAN_BY_PASIEN_SUCCESS =
  "FETCH_REKAP_PEMBAYARAN_BY_PASIEN_SUCCESS";
export const FETCH_REKAP_PEMBAYARAN_BY_PASIEN_FAILURE =
  "FETCH_REKAP_PEMBAYARAN_BY_PASIEN_FAILURE";

export const CREATE_REKAP_PEMBAYARAN_REQUEST =
  "CREATE_REKAP_PEMBAYARAN_REQUEST";
export const CREATE_REKAP_PEMBAYARAN_SUCCESS =
  "CREATE_REKAP_PEMBAYARAN_SUCCESS";
export const CREATE_REKAP_PEMBAYARAN_FAILURE =
  "CREATE_REKAP_PEMBAYARAN_FAILURE";

export const DELETE_REKAP_PEMBAYARAN_REQUEST =
  "DELETE_REKAP_PEMBAYARAN_REQUEST";
export const DELETE_REKAP_PEMBAYARAN_SUCCESS =
  "DELETE_REKAP_PEMBAYARAN_SUCCESS";
export const DELETE_REKAP_PEMBAYARAN_FAILURE =
  "DELETE_REKAP_PEMBAYARAN_FAILURE";

export const UPDATE_REKAP_PEMBAYARAN_REQUEST =
  "UPDATE_REKAP_PEMBAYARAN_REQUEST";
export const UPDATE_REKAP_PEMBAYARAN_SUCCESS =
  "UPDATE_REKAP_PEMBAYARAN_SUCCESS";
export const UPDATE_REKAP_PEMBAYARAN_FAILURE =
  "UPDATE_REKAP_PEMBAYARAN_FAILURE";

export const SET_PAGE = "SET_PAGE";

// === Fetch All Rekap Pembayaran ===
export const fetchRekapPembayaran =
  (page = 1, limit = 5, search = "") =>
  async (dispatch) => {
    dispatch({ type: FETCH_REKAP_PEMBAYARAN_REQUEST });

    try {
      const response = await apiClient.get("/rekapPembayaran", {
        params: { page, limit, q: search },
      });

      dispatch({
        type: FETCH_REKAP_PEMBAYARAN_SUCCESS,
        payload: {
          data: response.data.data,
          meta: response.data.meta,
        },
      });
    } catch (error) {
      dispatch({
        type: FETCH_REKAP_PEMBAYARAN_FAILURE,
        payload: error.message,
      });
    }
  };

// === Fetch Rekap Pembayaran By ID ===
export const fetchRekapPembayaranById = (id) => async (dispatch) => {
  dispatch({ type: FETCH_REKAP_PEMBAYARAN_BY_ID_REQUEST });

  try {
    const response = await apiClient.get(`/rekapPembayaran/${id}`);

    dispatch({
      type: FETCH_REKAP_PEMBAYARAN_BY_ID_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: FETCH_REKAP_PEMBAYARAN_BY_ID_FAILURE,
      payload: error.message,
    });
  }
};

// === Fetch Rekap Pembayaran By Pasien ===
export const fetchRekapPembayaranByPasien = (id_pasien) => async (dispatch) => {
  dispatch({ type: FETCH_REKAP_PEMBAYARAN_BY_PASIEN_REQUEST });

  try {
    const response = await apiClient.get(
      `/rekapPembayaran/pasien/${id_pasien}`
    );

    dispatch({
      type: FETCH_REKAP_PEMBAYARAN_BY_PASIEN_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: FETCH_REKAP_PEMBAYARAN_BY_PASIEN_FAILURE,
      payload: error.message,
    });
  }
};

// === Create Rekap Pembayaran ===
export const createRekapPembayaran = (formData) => async (dispatch) => {
  dispatch({ type: CREATE_REKAP_PEMBAYARAN_REQUEST });

  try {
    const response = await apiClient.post("/rekapPembayaran", formData);
    dispatch({
      type: CREATE_REKAP_PEMBAYARAN_SUCCESS,
      payload: response.data,
    });

    dispatch(fetchRekapPembayaran()); // Refresh list
  } catch (error) {
    dispatch({
      type: CREATE_REKAP_PEMBAYARAN_FAILURE,
      payload:
        error.response?.data?.error || "Gagal menambahkan rekap pembayaran",
    });
  }
};

// === Delete Rekap Pembayaran ===
export const deleteRekapPembayaran = (id) => async (dispatch) => {
  dispatch({ type: DELETE_REKAP_PEMBAYARAN_REQUEST });

  try {
    const response = await apiClient.delete(`/rekapPembayaran/${id}`);
    dispatch({
      type: DELETE_REKAP_PEMBAYARAN_SUCCESS,
      payload: id,
    });

    dispatch(fetchRekapPembayaran()); // Refresh list
  } catch (error) {
    dispatch({
      type: DELETE_REKAP_PEMBAYARAN_FAILURE,
      payload:
        error.response?.data?.error || "Gagal menghapus rekap pembayaran",
    });
  }
};

export const updateRekapPembayaran = (id, formData) => async (dispatch) => {
  dispatch({ type: UPDATE_REKAP_PEMBAYARAN_REQUEST });

  try {
    const response = await apiClient.put(`/rekapPembayaran/${id}`, formData);
    dispatch({
      type: UPDATE_REKAP_PEMBAYARAN_SUCCESS,
      payload: response.data,
    });

    // Refresh list setelah update
    dispatch(fetchRekapPembayaran());
  } catch (error) {
    dispatch({
      type: UPDATE_REKAP_PEMBAYARAN_FAILURE,
      payload: error.message,
    });
  }
};

// === Update Halaman ===
export const setPage = (newPage) => ({
  type: SET_PAGE,
  payload: newPage,
});
