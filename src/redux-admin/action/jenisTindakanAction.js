import apiClient from "../../config/apiConfig";

export const FETCH_JENIS_TINDAKAN_REQUEST = "FETCH_JENIS_TINDAKAN_REQUEST";
export const FETCH_JENIS_TINDAKAN_SUCCESS = "FETCH_JENIS_TINDAKAN_SUCCESS";
export const FETCH_JENIS_TINDAKAN_FAILURE = "FETCH_JENIS_TINDAKAN_FAILURE";

// Action Creator: Fetch jenis tindakan dari API
export const fetchJenisTindakan =
  (page = 1, limit = 5, search = "") =>
  async (dispatch) => {
    dispatch({ type: FETCH_JENIS_TINDAKAN_REQUEST });

    try {
      const response = await apiClient.get("/jenisTindakan/getAll", {
        params: { page, limit, search },
      });

      dispatch({
        type: FETCH_JENIS_TINDAKAN_SUCCESS,
        payload: {
          data: response.data.data,
          meta: response.data.meta,
          search,
          page,
          limit,
        },
      });
    } catch (error) {
      dispatch({
        type: FETCH_JENIS_TINDAKAN_FAILURE,
        payload: error.message,
      });
    }
  };
