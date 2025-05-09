import {
  JANJITEMU_REQUEST,
  JANJITEMU_SUCCESS,
  JANJITEMU_FAILURE,
} from "../types/janjiTemuTypes";

// Action: fetch janji temu
export const fetchJanjiTemuRequest = () => ({
  type: JANJITEMU_REQUEST,
});

export const fetchJanjiTemuSuccess = (data, meta) => ({
  type: JANJITEMU_SUCCESS,
  payload: { data, meta },
});

export const fetchJanjiTemuFailure = (error) => ({
  type: JANJITEMU_FAILURE,
  payload: error,
});

// Async Action: fetching dari API
export const fetchJanjiTemu = ({ page = 1, limit = 10 }) => {
  return async (dispatch) => {
    dispatch(fetchJanjiTemuRequest()); // ✅ Sekarang fungsi ini didefinisikan

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Token tidak tersedia");
      }

      const response = await fetch(
        `http://localhost:3000/api/janjiTemu/available?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Kirim token
          },
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Gagal memuat data");
      }

      dispatch(fetchJanjiTemuSuccess(result.data, result.meta));
    } catch (error) {
      dispatch(fetchJanjiTemuFailure(error.message));
    }
  };
};
