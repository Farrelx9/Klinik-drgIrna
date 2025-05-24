import apiClient from "../../config/apiConfig";

export const FETCH_REKAM_MEDIS_REQUEST = "FETCH_REKAM_MEDIS_REQUEST";
export const FETCH_REKAM_MEDIS_SUCCESS = "FETCH_REKAM_MEDIS_SUCCESS";
export const FETCH_REKAM_MEDIS_FAILURE = "FETCH_REKAM_MEDIS_FAILURE";

export const CREATE_REKAM_MEDIS_REQUEST = "CREATE_REKAM_MEDIS_REQUEST";
export const CREATE_REKAM_MEDIS_SUCCESS = "CREATE_REKAM_MEDIS_SUCCESS";
export const CREATE_REKAM_MEDIS_FAILURE = "CREATE_REKAM_MEDIS_FAILURE";

export const UPDATE_REKAM_MEDIS_SUCCESS = "UPDATE_REKAM_MEDIS_SUCCESS";
export const DELETE_REKAM_MEDIS_SUCCESS = "DELETE_REKAM_MEDIS_SUCCESS";

export const FETCH_REKAM_MEDIS_BY_PASIEN_REQUEST =
  "FETCH_REKAM_MEDIS_BY_PASIEN_REQUEST";
export const FETCH_REKAM_MEDIS_BY_PASIEN_SUCCESS =
  "FETCH_REKAM_MEDIS_BY_PASIEN_SUCCESS";
export const FETCH_REKAM_MEDIS_BY_PASIEN_FAILURE =
  "FETCH_REKAM_MEDIS_BY_PASIEN_FAILURE";

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

      // Pastikan respons API valid
      if (!response.data || !Array.isArray(response.data.data)) {
        throw new Error("Invalid response format");
      }

      const mappedData = response.data.data.map((record) => ({
        id_rekam_medis: record.id_rekam_medis,
        id_pasien: record.id_pasien,

        // 🔁 Gunakan field hasil mapping dari backend
        nama_pasien: record.nama_pasien || "-",
        alamat_pasien: record.alamat_pasien || "-",
        jenis_kelamin_pasien: record.jenis_kelamin_pasien || "-",
        tanggal_lahir_pasien: record.tanggal_lahir_pasien || null,

        // 🔹 Field rekam medis
        keluhan: record.keluhan,
        diagnosa: record.diagnosa,
        tindakan: record.tindakan,
        resep_obat: record.resep_obat,
        dokter: record.dokter,
        tanggal: record.tanggal,
        createdAt: record.createdAt,
      }));

      dispatch({
        type: FETCH_REKAM_MEDIS_SUCCESS,
        payload: {
          data: mappedData,
          meta: {
            totalItems: response.data.meta?.totalItems || mappedData.length,
            currentPage: response.data.meta?.currentPage || page,
            totalPages:
              response.data.meta?.totalPages ||
              Math.ceil(mappedData.length / limit),
          },
        },
      });
    } catch (error) {
      dispatch({
        type: FETCH_REKAM_MEDIS_FAILURE,
        payload: error.message,
      });
    }
  };

// === Create Rekam Medis ===
export const createRekamMedis = (formData) => async (dispatch) => {
  dispatch({ type: CREATE_REKAM_MEDIS_REQUEST });

  try {
    const response = await apiClient.post("/rekamMedis/buat", formData);
    dispatch({
      type: CREATE_REKAM_MEDIS_SUCCESS,
      payload: {
        ...response.data,
        nama_pasien: response.data.nama_pasien || "-",
        alamat_pasien: response.data.alamat_pasien || "-",
        jenis_kelamin_pasien: response.data.jenis_kelamin_pasien || "-",
        tanggal_lahir_pasien: response.data.tanggal_lahir_pasien || null,
      },
    });

    // Refresh list setelah tambah
    dispatch(fetchRekamMedis(1, 5, ""));
    ("Rekam medis berhasil ditambahkan");
  } catch (error) {
    dispatch({
      type: CREATE_REKAM_MEDIS_FAILURE,
      payload: error.response?.data?.error || "Gagal menambahkan rekam medis",
    });
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
    ("Rekam medis berhasil diperbarui");
  } catch (error) {
    ("Gagal memperbarui rekam medis");
  }
};

//rekam medis by id
export const fetchRekamMedisByPatient = (id_pasien) => async (dispatch) => {
  dispatch({ type: FETCH_REKAM_MEDIS_BY_PASIEN_REQUEST });

  try {
    const response = await apiClient.get(`/rekamMedis/${id_pasien}`);

    // Pastikan format respons valid
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error("Invalid response format");
    }

    dispatch({
      type: FETCH_REKAM_MEDIS_BY_PASIEN_SUCCESS,
      payload: response.data,
    });

    return response.data;
  } catch (error) {
    dispatch({
      type: FETCH_REKAM_MEDIS_BY_PASIEN_FAILURE,
      payload: error.message,
    });
    console.error("Gagal mengambil rekam medis pasien:", error);
    return [];
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
    ("Rekam medis berhasil dihapus");
  } catch (error) {
    ("Gagal menghapus rekam medis");
  }
};

// === Set Page ===
export const setPageRekamMedis = (newPage) => ({
  type: SET_REKAM_MEDIS_PAGE,
  payload: newPage,
});
