import apiClient from "../../config/apiConfigAdmin";

export const FETCH_PASIEN_REQUEST = "FETCH_PASIEN_REQUEST";
export const FETCH_PASIEN_SUCCESS = "FETCH_PASIEN_SUCCESS";
export const FETCH_PASIEN_FAILURE = "FETCH_PASIEN_FAILURE";

// Fetch All Pasien
export const fetchUser =
  (page = 1, limit = 999, search = "") =>
  async (dispatch) => {
    dispatch({ type: FETCH_PASIEN_REQUEST });

    try {
      const response = await apiClient.get("/pasienAdmin/pasien", {
        params: { page, limit, search },
      });

      dispatch({
        type: FETCH_PASIEN_SUCCESS,
        payload: {
          data: response.data.data,
          meta: response.data.meta,
        },
      });
    } catch (error) {
      dispatch({
        type: FETCH_PASIEN_FAILURE,
        payload: error.message,
      });
      console.error("Gagal memuat data pasien:", error);
    }
  };
