import apiClient from "../../config/apiConfig";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Kirim ulasan baru
export const submitReview = createAsyncThunk(
  "review/submitReview",
  async (
    { id_pasien, id_janji, id_konsultasi, rating, komentar },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post("/review", {
        id_pasien,
        id_janji,
        id_konsultasi,
        rating,
        komentar,
      });

      return response.data.review;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Gagal mengirim ulasan"
      );
    }
  }
);

// Ambil semua ulasan (admin)
export const getAllReviews = createAsyncThunk(
  "review/getAllReviews",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/review");
      return response.data.reviews;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Gagal mengambil daftar ulasan"
      );
    }
  }
);

// Ambil ulasan berdasarkan ID Pasien
export const getReviewsByPatientId = createAsyncThunk(
  "review/getReviewsByPatientId",
  async ({ id_pasien }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/review/patient/${id_pasien}`);
      return response.data.reviews;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Gagal mengambil ulasan pasien"
      );
    }
  }
);

// Ambil rata-rata rating pasien
export const getAverageRatingByPatientId = createAsyncThunk(
  "review/getAverageRatingByPatientId",
  async ({ id_pasien }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `/review/patient/${id_pasien}/average-rating`
      );
      return response.data.averageRating;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Gagal mengambil rata-rata rating"
      );
    }
  }
);
