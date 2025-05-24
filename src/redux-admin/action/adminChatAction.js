import apiClient from "../../config/apiConfig";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Ambil daftar chat aktif/selesai untuk admin
export const getChatListForAdmin = createAsyncThunk(
  "chatAdmin/getChatListForAdmin",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/konsultasi/chat/admin/daftar`, {
        params: { page, limit },
      });

      return {
        data: response.data.data,
        meta: response.data.meta,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Gagal mengambil daftar chat"
      );
    }
  }
);

// Ambil detail chat tertentu
export const getChatDetail = createAsyncThunk(
  "chatAdmin/getChatDetail",
  async (id_chat, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `/konsultasi/chat/admin/detail/${id_chat}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Gagal mengambil detail chat"
      );
    }
  }
);

// Kirim pesan baru dari admin
export const kirimPesanAdmin = createAsyncThunk(
  "chatAdmin/kirimPesanAdmin",
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

export const aktifkanSesi = createAsyncThunk(
  "chatAdmin/aktifkanSesi",
  async (id_chat, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(
        `/konsultasi/admin/aktifkan/${id_chat}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Gagal mengaktifkan sesi"
      );
    }
  }
);
