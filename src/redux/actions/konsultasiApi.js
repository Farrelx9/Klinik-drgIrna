import apiClient from "../../config/apiConfig";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Ambil jadwal chat
export const fetchJadwalKonsultasi = createAsyncThunk(
  "konsultasi/fetchJadwalKonsultasi",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/konsultasi/chat/jadwal", {
        params: {
          page: payload.page,
          limit: payload.limit,
          ...(payload.tanggal && { tanggal: payload.tanggal }),
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Gagal mengambil jadwal konsultasi"
      );
    }
  }
);

// Pilih jadwal chat
export const pilihJadwal = createAsyncThunk(
  "konsultasi/pilihJadwal",
  async ({ id_jadwal, id_pasien }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/konsultasi/chat/pilih-jadwal", {
        id_jadwal,
        id_pasien,
      });

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Gagal memilih jadwal"
      );
    }
  }
);

// Cek sesi aktif pasien
export const getSesiAktifByPasien = createAsyncThunk(
  "konsultasi/getSesiAktifByPasien",
  async (id_pasien, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `/konsultasi/chat/sesi-aktif/${id_pasien}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Tidak ada sesi aktif"
      );
    }
  }
);
