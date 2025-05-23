import { createSlice } from "@reduxjs/toolkit";
import {
  getChatListForAdmin,
  getChatDetail,
  kirimPesanAdmin,
} from "../actions/chatAdminActions";

const initialState = {
  chatList: [],
  activeChat: null,
  isLoading: false,
  error: null,
};

const chatAdminSlice = createSlice({
  name: "chatAdmin",
  initialState,
  reducers: {
    resetChat: () => initialState,
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder.addCase(getChatListForAdmin.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getChatListForAdmin.fulfilled, (state, action) => {
      state.isLoading = false;
      state.chatList = Array.isArray(action.payload) ? action.payload : [];
    });
    builder.addCase(getChatListForAdmin.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    builder.addCase(getChatDetail.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getChatDetail.fulfilled, (state, action) => {
      state.isLoading = false;
      state.activeChat = action.payload;
    });
    builder.addCase(getChatDetail.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    builder.addCase(kirimPesanAdmin.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(kirimPesanAdmin.fulfilled, (state, action) => {
      state.isLoading = false;
      if (state.activeChat && Array.isArray(state.activeChat.messages)) {
        state.activeChat.messages.push(action.payload);
      }
    });
    builder.addCase(kirimPesanAdmin.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export const { resetChat, clearError } = chatAdminSlice.actions;

export default chatAdminSlice.reducer;
