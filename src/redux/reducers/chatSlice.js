import { createSlice } from "@reduxjs/toolkit";
import { getRiwayatChat, kirimPesan } from "../actions/chatActions";

const initialState = {
  data: [], // Riwayat chat
  isLoading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    resetChat: (state) => {
      state.data = [];
    },
  },
  extraReducers(builder) {
    builder.addCase(getRiwayatChat.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getRiwayatChat.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = Array.isArray(action.payload) ? action.payload : [];
    });
    builder.addCase(getRiwayatChat.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    builder.addCase(kirimPesan.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(kirimPesan.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data.push(action.payload);
    });
    builder.addCase(kirimPesan.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export default chatSlice.reducer;
