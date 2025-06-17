import { createSlice } from "@reduxjs/toolkit";
import {
  submitReview,
  getAllReviews,
  getReviewsByPatientId,
  getAverageRatingByPatientId,
} from "../actions/reviewAction";

const initialState = {
  reviews: [],
  averageRating: null,
  loading: false,
  error: null,
};

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Submit Review
    builder.addCase(submitReview.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(submitReview.fulfilled, (state, action) => {
      state.loading = false;
      state.reviews.push(action.payload);
    });
    builder.addCase(submitReview.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Get All Reviews
    builder.addCase(getAllReviews.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllReviews.fulfilled, (state, action) => {
      state.loading = false;
      state.reviews = action.payload;
    });
    builder.addCase(getAllReviews.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Get Reviews by Patient ID
    builder.addCase(getReviewsByPatientId.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getReviewsByPatientId.fulfilled, (state, action) => {
      state.loading = false;
      state.reviews = action.payload;
    });
    builder.addCase(getReviewsByPatientId.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Get Average Rating by Patient ID
    builder.addCase(getAverageRatingByPatientId.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAverageRatingByPatientId.fulfilled, (state, action) => {
      state.loading = false;
      state.averageRating = action.payload;
    });
    builder.addCase(getAverageRatingByPatientId.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default reviewSlice.reducer;

export const { clearError } = reviewSlice.actions;
