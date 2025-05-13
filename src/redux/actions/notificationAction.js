// src/store/notification/actions.js
import apiClient from "../config/apiConfig"; // Pastikan ini sesuai path kamu
import {
  FETCH_NOTIFICATIONS_REQUEST,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_FAILURE,
  MARK_AS_READ_REQUEST,
  MARK_AS_READ_SUCCESS,
  MARK_AS_READ_FAILURE,
} from "../types/notificationTypes";

// 🔹 ACTION CREATORS — Sync Actions
export const fetchNotificationsRequest = () => ({
  type: FETCH_NOTIFICATIONS_REQUEST,
});

export const fetchNotificationsSuccess = (data, meta) => ({
  type: FETCH_NOTIFICATIONS_SUCCESS,
  payload: { data, meta },
});

export const fetchNotificationsFailure = (error) => ({
  type: FETCH_NOTIFICATIONS_FAILURE,
  payload: error,
});

export const markAsReadRequest = () => ({
  type: MARK_AS_READ_REQUEST,
});

export const markAsReadSuccess = (id_notifikasi) => ({
  type: MARK_AS_READ_SUCCESS,
  payload: id_notifikasi,
});

export const markAsReadFailure = (error) => ({
  type: MARK_AS_READ_FAILURE,
  payload: error,
});

// 🔹 ASYNC ACTIONS

// 🔹 FETCH NOTIFICATIONS
export const fetchNotifications = ({ id_pasien, page = 1, limit = 5 }) => {
  return async (dispatch) => {
    dispatch(fetchNotificationsRequest());

    try {
      const token = localStorage.getItem("token");

      if (!token) throw new Error("Token tidak tersedia");

      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);

      const response = await apiClient.get(
        `/notifikasi/${id_pasien}?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await response.data;

      if (!result.success)
        throw new Error(result.message || "Gagal mengambil notifikasi");

      dispatch(fetchNotificationsSuccess(result.data, result.meta));
    } catch (error) {
      let errorMessage = error.message;

      if (error.response && error.response.data) {
        errorMessage = error.response.data.message;
      }

      dispatch(fetchNotificationsFailure(errorMessage));
    }
  };
};

// 🔹 MARK NOTIF AS READ
export const markAllNotificationsAsRead = (id_pasien) => {
  return async (dispatch) => {
    dispatch({ type: MARK_AS_READ_REQUEST });

    try {
      const token = localStorage.getItem("token");

      if (!token) throw new Error("Token tidak tersedia");

      const response = await apiClient.patch(
        `/notifikasi/${id_pasien}/mark-all-read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await response.data;

      if (!result.success) throw new Error(result.message);

      dispatch({ type: MARK_AS_READ_SUCCESS, payload: "all" }); // Payload opsional
      dispatch(fetchNotifications({ id_pasien, page: 1, limit: 5 }));
    } catch (error) {
      let errorMessage = error.message;
      if (error.response?.data) {
        errorMessage = error.response.data.message;
      }

      dispatch({ type: MARK_AS_READ_FAILURE, payload: errorMessage });
    }
  };
};
