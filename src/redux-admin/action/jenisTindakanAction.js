import apiClient from "../../config/apiConfigAdmin";

// === Action Types ===
export const FETCH_JENIS_TINDAKAN_REQUEST = "FETCH_JENIS_TINDAKAN_REQUEST";
export const FETCH_JENIS_TINDAKAN_SUCCESS = "FETCH_JENIS_TINDAKAN_SUCCESS";
export const FETCH_JENIS_TINDAKAN_FAILURE = "FETCH_JENIS_TINDAKAN_FAILURE";

// === Action Types untuk Create ===
export const CREATE_JENIS_TINDAKAN_REQUEST = "CREATE_JENIS_TINDAKAN_REQUEST";
export const CREATE_JENIS_TINDAKAN_SUCCESS = "CREATE_JENIS_TINDAKAN_SUCCESS";
export const CREATE_JENIS_TINDAKAN_FAILURE = "CREATE_JENIS_TINDAKAN_FAILURE";

export const UPDATE_JENIS_TINDAKAN_REQUEST = "UPDATE_JENIS_TINDAKAN_REQUEST";
export const UPDATE_JENIS_TINDAKAN_SUCCESS = "UPDATE_JENIS_TINDAKAN_SUCCESS";
export const UPDATE_JENIS_TINDAKAN_FAILURE = "UPDATE_JENIS_TINDAKAN_FAILURE";

export const DELETE_JENIS_TINDAKAN_REQUEST = "DELETE_JENIS_TINDAKAN_REQUEST";
export const DELETE_JENIS_TINDAKAN_SUCCESS = "DELETE_JENIS_TINDAKAN_SUCCESS";
export const DELETE_JENIS_TINDAKAN_FAILURE = "DELETE_JENIS_TINDAKAN_FAILURE";

export const SET_PAGE = "SET_PAGE";

// === Fetch All Jenis Tindakan ===
export const fetchJenisTindakan =
  (page = 1, limit = 5, search = "") =>
  async (dispatch) => {
    dispatch({ type: FETCH_JENIS_TINDAKAN_REQUEST });

    try {
      const response = await apiClient.get("/jenisTindakan/getAll", {
        params: { page, limit, search },
      });

      // ✅ Perbaiki mapping meta agar selaras dengan respons API
      const mappedMeta = {
        page: response.data.meta.page,
        totalItems: response.data.meta.totalItems,
        totalPages: response.data.meta.totalPages,
        hasNextPage: response.data.meta.hasNextPage,
        hasPrevPage: response.data.meta.hasPrevPage,
      };

      dispatch({
        type: FETCH_JENIS_TINDAKAN_SUCCESS,
        payload: {
          data: response.data.data,
          meta: mappedMeta,
        },
      });
    } catch (error) {
      dispatch({
        type: FETCH_JENIS_TINDAKAN_FAILURE,
        payload: error.message,
      });
    }
  };

// === Create Jenis Tindakan ===
export const createJenisTindakan = (formData) => async (dispatch) => {
  dispatch({ type: CREATE_JENIS_TINDAKAN_REQUEST });

  try {
    const response = await apiClient.post("/jenisTindakan/buat", formData);
    dispatch({
      type: CREATE_JENIS_TINDAKAN_SUCCESS,
      payload: response.data,
    });

    dispatch(fetchJenisTindakan(1, 5, ""));
  } catch (error) {
    dispatch({
      type: CREATE_JENIS_TINDAKAN_FAILURE,
      payload:
        error.response?.data?.error || "Gagal menambahkan jenis tindakan",
    });
  }
};

// === Update Jenis Tindakan ===
export const updateJenisTindakan = (id, formData) => async (dispatch) => {
  dispatch({ type: UPDATE_JENIS_TINDAKAN_REQUEST });

  try {
    const response = await apiClient.put(
      `/jenisTindakan/update/${id}`,
      formData
    );
    dispatch({
      type: UPDATE_JENIS_TINDAKAN_SUCCESS,
      payload: response.data,
    });

    // Refresh data setelah update
    dispatch(fetchJenisTindakan(1, 5, ""));
    ("Jenis tindakan berhasil diperbarui");
  } catch (error) {
    dispatch({
      type: UPDATE_JENIS_TINDAKAN_FAILURE,
      payload:
        error.response?.data?.error || "Gagal memperbarui jenis tindakan",
    });
  }
};

// === Delete Jenis Tindakan ===
export const deleteJenisTindakan = (id) => async (dispatch) => {
  dispatch({ type: DELETE_JENIS_TINDAKAN_REQUEST });

  try {
    const response = await apiClient.delete(`/jenisTindakan/delete/${id}`);
    dispatch({
      type: DELETE_JENIS_TINDAKAN_SUCCESS,
      payload: id,
    });

    // Refresh data setelah hapus
    dispatch(fetchJenisTindakan(1, 5, ""));
    response.data.message || "Jenis tindakan berhasil dihapus";
  } catch (error) {
    dispatch({
      type: DELETE_JENIS_TINDAKAN_FAILURE,
      payload: error.response?.data?.error || "Gagal menghapus jenis tindakan",
    });
  }
};

// === Update Halaman ===
export const setPage = (newPage) => ({
  type: SET_PAGE,
  payload: newPage,
});
