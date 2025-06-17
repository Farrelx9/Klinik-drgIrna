// src/features/review/reviewThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../config/apiConfigAdmin";

// Fetch all reviews
export const fetchReviews = createAsyncThunk(
  "review/fetchReviews",
  async ({ page = 1, limit = 10, search = "" }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/review", {
        params: { page, limit, q: search },
      });

      // Pastikan format data sesuai dengan Redux state
      return {
        data: response.data?.data || [],
        meta: response.data?.meta || {},
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Gagal mengambil data review"
      );
    }
  }
);

// Fetch by ID
export const fetchReviewById = createAsyncThunk(
  "review/fetchReviewById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/review/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Gagal mengambil detail review"
      );
    }
  }
);

// Create review
export const createReview = createAsyncThunk(
  "review/createReview",
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const response = await apiClient.post("/review", formData);
      dispatch(fetchReviews());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Gagal menambahkan review"
      );
    }
  }
);

// Update review
export const updateReview = createAsyncThunk(
  "review/updateReview",
  async ({ id, formData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await apiClient.put(`/review/${id}`, formData);
      dispatch(fetchReviews());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Gagal memperbarui review"
      );
    }
  }
);

// Delete review
export const deleteReview = createAsyncThunk(
  "review/deleteReview",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await apiClient.delete(`/review/${id}`);
      dispatch(fetchReviews());
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Gagal menghapus review"
      );
    }
  }
);

// src/features/review/reviewActions.js
export const SET_PAGE = "review/setPage";

export const setPage = (newPage) => ({
  type: SET_PAGE,
  payload: newPage,
});
