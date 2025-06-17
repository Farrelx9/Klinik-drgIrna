// src/features/review/reviewReducer.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchReviews,
  fetchReviewById,
  createReview,
  updateReview,
  deleteReview,
} from "../action/reviewAction";
import { SET_PAGE } from "../action/reviewAction";

const initialState = {
  data: [],
  meta: {},
  selectedReview: null,
  loading: false,
  error: null,
  currentPage: 1,
};

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // === FETCH ALL ===
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === FETCH BY ID ===
      .addCase(fetchReviewById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedReview = action.payload;
      })
      .addCase(fetchReviewById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === CREATE ===
      .addCase(createReview.rejected, (state, action) => {
        state.error = action.payload;
      })

      // === UPDATE ===
      .addCase(updateReview.rejected, (state, action) => {
        state.error = action.payload;
      })

      // === DELETE ===
      .addCase(deleteReview.rejected, (state, action) => {
        state.error = action.payload;
      })

      // === CUSTOM ACTION: SET PAGE ===
      .addCase(SET_PAGE, (state, action) => {
        state.currentPage = action.payload;
      });
  },
});

export default reviewSlice.reducer;
