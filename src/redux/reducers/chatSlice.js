import { createSlice } from "@reduxjs/toolkit";
import {
  getChatListForUser,
  getChatDetailForUser,
  kirimPesanPasien,
} from "../actions/chatActions";

const initialState = {
  chatList: [],
  activeChat: null,
  meta: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
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
    builder.addCase(getChatListForUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getChatListForUser.fulfilled, (state, action) => {
      state.isLoading = false;

      // Pastikan action.payload.data dan meta ada
      state.chatList = Array.isArray(action.payload.data)
        ? action.payload.data
        : [];

      state.meta = {
        currentPage: action.payload.meta.currentPage || 1,
        totalPages: action.payload.meta.totalPages || 1,
        totalItems: action.payload.meta.totalItems || 0,
        hasNextPage: action.payload.meta.hasNextPage || false,
        hasPrevPage: action.payload.meta.hasPrevPage || false,
      };
    });
    builder.addCase(getChatListForUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    builder.addCase(getChatDetailForUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getChatDetailForUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.activeChat = action.payload;
    });
    builder.addCase(getChatDetailForUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    builder.addCase(kirimPesanPasien.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(kirimPesanPasien.fulfilled, (state, action) => {
      state.isLoading = false;
      if (state.activeChat && Array.isArray(state.activeChat.messages)) {
        state.activeChat.messages.push(action.payload);
      }
    });
    builder.addCase(kirimPesanPasien.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export const { resetChat, clearError } = chatSlice.actions;
export default chatSlice.reducer;
