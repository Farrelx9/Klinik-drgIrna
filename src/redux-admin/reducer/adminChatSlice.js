import { createSlice } from "@reduxjs/toolkit";
import {
  getChatListForAdmin,
  getChatDetail,
  kirimPesanAdmin,
  aktifkanSesi,
  akhiriSesiAdmin,
} from "../action/adminChatAction";

const initialState = {
  chatList: [],
  unreadCounts: {}, // ← Tambah ini
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

const chatAdminSlice = createSlice({
  name: "chatAdmin",
  initialState,
  reducers: {
    resetChat: () => initialState,
    clearError: (state) => {
      state.error = null;
    },
    setUnreadCounts: (state, action) => {
      state.unreadCounts = action.payload; // { id_chat: count }
    },
  },
  extraReducers(builder) {
    builder.addCase(getChatListForAdmin.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getChatListForAdmin.fulfilled, (state, action) => {
      state.isLoading = false;
      state.chatList = Array.isArray(action.payload.data)
        ? action.payload.data
        : [];
      state.meta = {
        currentPage: action.payload.meta.currentPage,
        totalPages: action.payload.meta.totalPages,
        totalItems: action.payload.meta.totalItems,
        hasNextPage: action.payload.meta.hasNextPage,
        hasPrevPage: action.payload.meta.hasPrevPage,
      };
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
    builder.addCase(aktifkanSesi.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(aktifkanSesi.fulfilled, (state, action) => {
      state.isLoading = false;
      const index = state.chatList.findIndex(
        (chat) => chat.id_chat === action.payload.id_chat
      );
      if (index > -1) {
        state.chatList[index] = action.payload;
      }
      if (
        state.activeChat &&
        state.activeChat.id_chat === action.payload.id_chat
      ) {
        state.activeChat = action.payload;
      }
    });
    builder.addCase(aktifkanSesi.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
    builder.addCase(akhiriSesiAdmin.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(akhiriSesiAdmin.fulfilled, (state, action) => {
      state.isLoading = false;

      // Update daftar chat
      const index = state.chatList.findIndex(
        (chat) => chat.id_chat === action.payload.id_chat
      );
      if (index > -1) {
        state.chatList[index].status = "selesai";
      }

      // Update activeChat jika cocok
      if (
        state.activeChat &&
        state.activeChat.id_chat === action.payload.id_chat
      ) {
        state.activeChat.status = "selesai";
      }
    });

    builder.addCase(akhiriSesiAdmin.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export const { resetChat, clearError, setUnreadCounts } =
  chatAdminSlice.actions;

export default chatAdminSlice.reducer;
