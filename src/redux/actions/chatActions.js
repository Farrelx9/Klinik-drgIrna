import apiClient from "../../config/apiConfig";
import { createAsyncThunk } from "@reduxjs/toolkit";

// getChatListForUser
export const getChatListForUser = createAsyncThunk(
  "chat/getChatListForUser",
  async ({ id_pasien, page, limit }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `/konsultasi/chat/pasien/${id_pasien}`,
        {
          params: { page, limit },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Gagal mengambil daftar chat"
      );
    }
  }
);

// getChatDetailForUser
export const getChatDetailForUser = createAsyncThunk(
  "chat/getChatDetailForUser",
  async (id_chat, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `/konsultasi/chat/admin/detail/${id_chat}`,
        { include: { reviews: true } }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Gagal mengambil detail chat"
      );
    }
  }
);

// kirimPesanPasien
export const kirimPesanPasien = createAsyncThunk(
  "chat/kirimPesanPasien",
  async ({ isi, id_chat }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/konsultasi/chat/kirim", {
        isi,
        pengirim: "pasien",
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

export const fetchUnreadCountUser = async (id_chat) => {
  const token = localStorage.getItem("token");
  const res = await apiClient.get(`/konsultasi/${id_chat}/unread`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data.unread_count;
};

export const markAllMessagesAsReadUser = async (id_chat) => {
  const token = localStorage.getItem("token");
  await apiClient.patch(
    `/konsultasi/${id_chat}/mark-read`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
