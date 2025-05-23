import { createSlice } from "@reduxjs/toolkit";
import {
  fetchJadwalKonsultasi,
  pilihJadwal,
} from "../../redux/actions/konsultasiApi";

const initialState = {
  data: [], // Fallback array kosong
  meta: {
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    itemCount: 5,
  },
  isLoading: false,
  error: null,
};

const konsultasiSlice = createSlice({
  name: "konsultasi",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchJadwalKonsultasi.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchJadwalKonsultasi.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = Array.isArray(action.payload.data)
        ? action.payload.data
        : [];
      state.meta = action.payload.meta || initialState.meta;
    });
    builder.addCase(fetchJadwalKonsultasi.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Gagal mengambil jadwal";
    });
  },
});

export default konsultasiSlice.reducer;
