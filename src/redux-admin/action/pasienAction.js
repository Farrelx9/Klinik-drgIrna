import apiClient from "../../config/apiConfig";

export const FETCH_PASIEN_REQUEST = "FETCH_PASIEN_REQUEST";
export const FETCH_PASIEN_SUCCESS = "FETCH_PASIEN_SUCCESS";
export const FETCH_PASIEN_FAILURE = "FETCH_PASIEN_FAILURE";

// Fetch Pasien
export const fetchPasien = () => async (dispatch) => {
  dispatch({ type: FETCH_PASIEN_REQUEST });

  try {
    const response = await apiClient.get("/pasienAdmin/pasien");
    dispatch({
      type: FETCH_PASIEN_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: FETCH_PASIEN_FAILURE,
      payload: error.message,
    });
  }
};
