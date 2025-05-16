import axios from "axios";

export const FETCH_USERS_REQUEST = "FETCH_USERS_REQUEST";
export const FETCH_USERS_SUCCESS = "FETCH_USERS_SUCCESS";
export const FETCH_USERS_FAILURE = "FETCH_USERS_FAILURE";
export const SET_PAGE = "SET_PAGE";

// Action Creators
export const fetchUsersRequest = () => ({
  type: FETCH_USERS_REQUEST,
});

export const fetchUsersSuccess = (users, meta) => ({
  type: FETCH_USERS_SUCCESS,
  payload: { users, meta },
});

export const fetchUsersFailure = (error) => ({
  type: FETCH_USERS_FAILURE,
  payload: error,
});

export const setPage = (page) => ({
  type: SET_PAGE,
  payload: page,
});

// Async Action Creator menggunakan redux-thunk
export const fetchUsers = (page = 1) => {
  return async (dispatch) => {
    dispatch(fetchUsersRequest());

    try {
      const token = localStorage.getItem("token");  
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }
      const response = await axios.get(
        `http://localhost:3000/api/pasienAdmin/pasien?page=${page}&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { data, meta } = response.data;
      dispatch(fetchUsersSuccess(data, meta));
    } catch (error) {
      dispatch(fetchUsersFailure(error.message));
    }
  };
};
