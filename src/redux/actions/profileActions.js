import apiClient from "../../config/apiConfig";
import {
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
} from "../types/authTypes";

//update profile dengan PUT
export const updateProfile = (profileData) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_PROFILE_REQUEST });
    try {
      const token = localStorage.getItem("token");
      const response = await apiClient.put("/auth/profile", profileData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const data = response.data;
        console.log("Profile update response data:", data);
        // Update user data in localStorage
        const currentUser = JSON.parse(localStorage.getItem("user"));
        // Preserve the existing user structure and update with new data
        const updatedUser = {
          ...currentUser,
          pasien: {
            ...currentUser.pasien,
            ...data.user.pasien,
          },
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: data.user });
        return true;
      } else {
        dispatch({
          type: UPDATE_PROFILE_FAILURE,
          payload: "Gagal mengupdate profile",
        });
        return false;
      }
    } catch (error) {
      let errorMessage = "Terjadi kesalahan saat mengupdate profile";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      dispatch({ type: UPDATE_PROFILE_FAILURE, payload: errorMessage });
      return false;
    }
  };
};
