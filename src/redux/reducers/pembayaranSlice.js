import { createSlice } from "@reduxjs/toolkit";
import { createPembayaranChat } from "../actions/pembayaranAction";

const pembayaranSlice = createSlice({
  name: "pembayaran",
  initialState: {
    isLoading: false,
    error: null,
    data: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPembayaranChat.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPembayaranChat.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data; // Mengambil objek `data` dari respons API
      })
      .addCase(createPembayaranChat.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default pembayaranSlice.reducer;
