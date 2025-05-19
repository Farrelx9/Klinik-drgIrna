import apiClient from "../../config/apiConfig";
import { toast } from "react-toastify";

export const FETCH_REKAM_MEDIS_REQUEST = "FETCH_REKAM_MEDIS_REQUEST";
export const FETCH_REKAM_MEDIS_SUCCESS = "FETCH_REKAM_MEDIS_SUCCESS";
export const FETCH_REKAM_MEDIS_FAILURE = "FETCH_REKAM_MEDIS_FAILURE";

export const CREATE_REKAM_MEDIS_REQUEST = "CREATE_REKAM_MEDIS_REQUEST";
export const CREATE_REKAM_MEDIS_SUCCESS = "CREATE_REKAM_MEDIS_SUCCESS";
export const CREATE_REKAM_MEDIS_FAILURE = "CREATE_REKAM_MEDIS_FAILURE";

export const UPDATE_REKAM_MEDIS_SUCCESS = "UPDATE_REKAM_MEDIS_SUCCESS";
export const DELETE_REKAM_MEDIS_SUCCESS = "DELETE_REKAM_MEDIS_SUCCESS";

export const SET_REKAM_MEDIS_PAGE = "SET_REKAM_MEDIS_PAGE";

// === Fetch All Rekam Medis ===
export const fetchRekamMedis =
  (page = 1, limit = 5, search = "") =>
  async (dispatch) => {
    dispatch({ type: FETCH_REKAM_MEDIS_REQUEST });

    try {
      const response = await apiClient.get("/rekamMedis/getAll", {
        params: { page, limit, search },
      });

      // Mapping data sebelum simpan ke Redux
      const mappedData = response.data.map((record) => ({
        id: record.id_rekam_medis,
        id_pasien: record.id_pasien,
        patient: record.pasien?.nama || "Pasien Tidak Diketahui",
        diagnosis: record.diagnosa,
        treatment: record.tindakan,
        resep_obat: record.resep_obat,
        doctor: record.dokter,
        date: record.tanggal,
        createdAt: record.createdAt,
      }));

      dispatch({
        type: FETCH_REKAM_MEDIS_SUCCESS,
        payload: {
          data: mappedData,
          meta: {
            totalItems: response.data.length,
            page,
            totalPages: Math.ceil(response.data.length / limit),
            itemCount: response.data.length,
            perPage: limit,
          },
        },
      });
    } catch (error) {
      dispatch({
        type: FETCH_REKAM_MEDIS_FAILURE,
        payload: error.message,
      });
      toast.error("Gagal memuat rekam medis");
    }
  };

// === Create Rekam Medis ===
export const createRekamMedis = (formData) => async (dispatch) => {
  dispatch({ type: CREATE_REKAM_MEDIS_REQUEST });

  try {
    const response = await apiClient.post("/rekamMedis/buat", formData);
    dispatch({
      type: CREATE_REKAM_MEDIS_SUCCESS,
      payload: response.data,
    });

    // Refresh list setelah tambah
    dispatch(fetchRekamMedis(1, 5, ""));
    toast.success("Rekam medis berhasil ditambahkan");
  } catch (error) {
    dispatch({
      type: CREATE_REKAM_MEDIS_FAILURE,
      payload: error.response?.data?.error || "Gagal menambahkan rekam medis",
    });
    toast.error(error.response?.data?.error || "Gagal menambahkan rekam medis");
  }
};

// === Update Rekam Medis ===
export const updateRekamMedis = (id, formData) => async (dispatch) => {
  try {
    const response = await apiClient.put(`/rekamMedis/update/${id}`, formData);
    dispatch({
      type: UPDATE_REKAM_MEDIS_SUCCESS,
      payload: response.data,
    });

    // Refresh list setelah update
    dispatch(fetchRekamMedis());
    toast.success("Rekam medis berhasil diperbarui");
  } catch (error) {
    toast.error("Gagal memperbarui rekam medis");
  }
};

// === Delete Rekam Medis ===
export const deleteRekamMedis = (id) => async (dispatch) => {
  try {
    await apiClient.delete(`/rekamMedis/hapus/${id}`);
    dispatch({
      type: DELETE_REKAM_MEDIS_SUCCESS,
      payload: id,
    });

    // Refresh list setelah hapus
    dispatch(fetchRekamMedis());
    toast.success("Rekam medis berhasil dihapus");
  } catch (error) {
    toast.error("Gagal menghapus rekam medis");
  }
};

// === Set Page ===
export const setPageRekamMedis = (newPage) => ({
  type: SET_REKAM_MEDIS_PAGE,
  payload: newPage,
});
