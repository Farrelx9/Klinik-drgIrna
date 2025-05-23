import { createSlice } from "@reduxjs/toolkit";
import {
  getRiwayatChat,
  kirimPesan,
  cekSesiAktifByPasien,
} from "../actions/chatActions";

const initialState = {
  messages: [],
  sessionStatus: null,
  activeChatId: null,
  isLoading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    resetChat: () => initialState,
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder.addCase(getRiwayatChat.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getRiwayatChat.fulfilled, (state, action) => {
      state.isLoading = false;
      state.messages = Array.isArray(action.payload) ? action.payload : [];
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
      state.messages.push(action.payload);
    });
    builder.addCase(kirimPesan.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    builder.addCase(cekSesiAktifByPasien.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(cekSesiAktifByPasien.fulfilled, (state, action) => {
      state.isLoading = false;
      state.sessionStatus = action.payload.status;
      state.activeChatId = action.payload.id_chat;
    });
    builder.addCase(cekSesiAktifByPasien.rejected, (state, action) => {
      state.isLoading = false;
      state.sessionStatus = "none";
      state.error = action.payload;
    });
  },
});

export default chatSlice.reducer;

// Export reducers
export const { resetChat, clearError } = chatSlice.actions;
