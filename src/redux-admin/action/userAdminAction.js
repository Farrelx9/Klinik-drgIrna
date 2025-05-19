import apiClient from "../../config/apiConfig";

// === Action Types ===
export const FETCH_USER_REQUEST = "FETCH_USER_REQUEST";
export const FETCH_USER_SUCCESS = "FETCH_USER_SUCCESS";
export const FETCH_USER_FAILURE = "FETCH_USER_FAILURE";

export const CREATE_USER_REQUEST = "CREATE_USER_REQUEST";
export const CREATE_USER_SUCCESS = "CREATE_USER_SUCCESS";
export const CREATE_USER_FAILURE = "CREATE_USER_FAILURE";

export const UPDATE_USER_SUCCESS = "UPDATE_USER_SUCCESS";
export const DELETE_USER_SUCCESS = "DELETE_USER_SUCCESS";

export const SET_USER_PAGE = "SET_USER_PAGE";

// Fetch All Pasien
export const fetchUser =
  (page = 1, limit = 5, search = "") =>
  async (dispatch) => {
    dispatch({ type: FETCH_USER_REQUEST });

    try {
      const response = await apiClient.get("/pasienAdmin/pasien", {
        params: { page, limit, search },
      });

      dispatch({
        type: FETCH_USER_SUCCESS,
        payload: {
          users: response.data.data,
          meta: response.data.meta,
        },
      });
    } catch (error) {
      dispatch({
        type: FETCH_USER_FAILURE,
        payload: error.message,
      });
      ("Gagal memuat data pasien");
    }
  };

// Tambah Pasien
export const createUser = (formData) => async (dispatch) => {
  dispatch({ type: CREATE_USER_REQUEST });

  try {
    const response = await apiClient.post("/pasienAdmin/buat", formData);
    dispatch({
      type: CREATE_USER_SUCCESS,
      payload: response.data,
    });

    ("Pasien berhasil ditambahkan");
    return response.data;
  } catch (error) {
    dispatch({
      type: CREATE_USER_FAILURE,
      payload: error.message,
    });
    ("Gagal menambahkan pasien");
  }
};

// Update Pasien
export const updateUser = (id_pasien, formData) => async (dispatch) => {
  try {
    const response = await apiClient.put(
      `/pasienAdmin/update/${id_pasien}`,
      formData
    );
    dispatch({
      type: UPDATE_USER_SUCCESS,
      payload: response.data,
    });
    ("Pasien berhasil diperbarui");
  } catch (error) {
    ("Gagal memperbarui pasien");
  }
};

// Hapus Pasien
export const deleteUser = (id_pasien) => async (dispatch) => {
  try {
    await apiClient.delete(`/pasienAdmin/hapus/${id_pasien}`);
    dispatch({
      type: DELETE_USER_SUCCESS,
      payload: id_pasien,
    });

    ("Pasien berhasil dihapus");
  } catch (error) {
    ("Gagal menghapus pasien");
  }
};

// Set Halaman
export const setPage = (newPage) => ({
  type: SET_USER_PAGE,
  payload: newPage,
});
