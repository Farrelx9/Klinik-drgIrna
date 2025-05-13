// src/store/notification/reducer.js
import {
  FETCH_NOTIFICATIONS_REQUEST,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_FAILURE,
  MARK_AS_READ_REQUEST,
  MARK_AS_READ_SUCCESS,
  MARK_AS_READ_FAILURE,
} from "../types/notificationTypes";

const initialState = {
  loading: false,
  notifications: [],
  meta: null,
  error: null,
};

const notificationReducer = (state = initialState, action) => {
  console.log("Redux State:", state); // Lihat seluruh isi store
  switch (action.type) {
    case FETCH_NOTIFICATIONS_REQUEST:
    case MARK_AS_READ_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        notifications: action.payload.data,
        meta: action.payload.meta,
      };
    case MARK_AS_READ_SUCCESS:
      return {
        ...state,
        loading: false,
        notifications:
          action.payload === "all"
            ? state.notifications.map((notif) => ({ ...notif, is_read: true }))
            : state.notifications.map((notif) =>
                notif.id_notifikasi === action.payload
                  ? { ...notif, is_read: true }
                  : notif
              ),
      };

    case FETCH_NOTIFICATIONS_FAILURE:
    case MARK_AS_READ_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default notificationReducer;
