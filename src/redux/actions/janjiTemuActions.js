import apiClient from "../config/apiConfig";
import {
  JANJITEMU_REQUEST,
  JANJITEMU_SUCCESS,
  JANJITEMU_FAILURE,
  BOOK_JANJITEMU_REQUEST,
  BOOK_JANJITEMU_SUCCESS,
  BOOK_JANJITEMU_FAILURE,
} from "../types/janjiTemuTypes";

// FETCH JANJI TEMU — sudah ada sebelumnya
export const fetchJanjiTemuRequest = () => ({ type: JANJITEMU_REQUEST });
export const fetchJanjiTemuSuccess = (data, meta) => ({
  type: JANJITEMU_SUCCESS,
  payload: { data, meta },
});
export const fetchJanjiTemuFailure = (error) => ({
  type: JANJITEMU_FAILURE,
  payload: error,
});

// FETCH JANJI TEMU ASYNC — sudah ada sebelumnya
export const fetchJanjiTemu = ({ page = 1, limit = 5, tanggal = null }) => {
  return async (dispatch) => {
    dispatch(fetchJanjiTemuRequest());

    try {
      const token = localStorage.getItem("token");

      if (!token) throw new Error("Token tidak tersedia");

      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);
      if (tanggal) params.append("tanggal", tanggal);

      const response = await apiClient.get(
        `/janjiTemu/available?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await response.data;

      if (!result.success)
        throw new Error(result.message || "Gagal memuat data");

      dispatch(fetchJanjiTemuSuccess(result.data, result.meta));
    } catch (error) {
      dispatch(fetchJanjiTemuFailure(error.message));
    }
  };
};

// 🔹 BOOK JANJI TEMU ACTION
export const bookJanjiTemuRequest = () => ({ type: BOOK_JANJITEMU_REQUEST });
export const bookJanjiTemuSuccess = (data) => ({
  type: BOOK_JANJITEMU_SUCCESS,
  payload: data,
});
export const bookJanjiTemuFailure = (error) => ({
  type: BOOK_JANJITEMU_FAILURE,
  payload: error,
});

// 🔹 BOOK JANJI TEMU ASYNC
export const bookJanjiTemu = ({ id_janji, id_pasien, keluhan }) => {
  return async (dispatch) => {
    dispatch(bookJanjiTemuRequest());

    try {
      const token = localStorage.getItem("token");

      if (!token) throw new Error("Token tidak tersedia");
      if (!id_pasien) throw new Error("ID Pasien tidak ditemukan");

      const response = await apiClient.patch(
        `/janjiTemu/${id_janji}/book`,
        {
          id_pasien,
          keluhan,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = response.data;

      if (!result.success) {
        throw new Error(result.message || "Gagal booking janji temu");
      }

      dispatch(bookJanjiTemuSuccess(result.data));
      dispatch(fetchJanjiTemu({ page: 1, limit: 5 }));

      return result;
    } catch (error) {
      let errorMessage = "Terjadi kesalahan";

      if (error.response) {
        errorMessage =
          error.response.data.message ||
          `Error ${error.response.status}: Gagal memesan janji temu`;
      } else if (error.request) {
        errorMessage = "Tidak dapat terhubung ke server";
      } else {
        errorMessage = error.message;
      }

      dispatch(bookJanjiTemuFailure(errorMessage));
      throw new Error(errorMessage);
    }
  };
};
