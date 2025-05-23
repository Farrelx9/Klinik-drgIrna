import apiClient from "../../config/apiConfig";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Ambil riwayat chat
export const getRiwayatChat = createAsyncThunk(
  "chat/getRiwayatChat",
  async (id_chat, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `/konsultasi/chat/riwayat/${id_chat}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Gagal mengambil riwayat chat"
      );
    }
  }
);

// Kirim pesan baru
export const kirimPesan = createAsyncThunk(
  "chat/kirimPesan",
  async ({ isi, pengirim, id_chat }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/konsultasi/chat/kirim", {
        isi,
        pengirim,
        id_chat,
      });

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Gagal mengirim pesan"
      );
    }
  }
);

// Cek sesi aktif pasien
export const cekSesiAktifByPasien = createAsyncThunk(
  "chat/cekSesiAktifByPasien",
  async (id_pasien, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `/konsultasi/chat/aktif/${id_pasien}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Tidak ada sesi aktif"
      );
    }
  }
);
