import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../config/apiConfig";

export const createPembayaranChat = createAsyncThunk(
  "pembayaran/buatTransaksi",
  async ({ id_chat }, { rejectWithValue }) => {
    try {
      if (!id_chat || typeof id_chat !== "string") {
        return rejectWithValue("Format ID Chat tidak valid");
      }

      const response = await apiClient.post("/pembayaran/chat/bayar", {
        id_chat,
        jumlah: 50000,
        metode_pembayaran: "midtrans",
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        const message =
          error.response.data.message || "Gagal membuat transaksi";
        return rejectWithValue(message);
      }

      return rejectWithValue("Tidak dapat terhubung ke server");
    }
  }
);

// Cek status pembayaran
export const cekStatusPembayaran = createAsyncThunk(
  "pembayaran/cekStatusPembayaran",
  async ({ id_konsultasi }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `/pembayaran/chat/status/${id_konsultasi}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Gagal cek status pembayaran"
      );
    }
  }
);
