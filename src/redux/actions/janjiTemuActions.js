import axios from "axios";
import {
  CREATE_JANJI_TEMU_REQUEST,
  CREATE_JANJI_TEMU_SUCCESS,
  CREATE_JANJI_TEMU_FAIL,
  GET_JANJI_TEMU_REQUEST,
  GET_JANJI_TEMU_SUCCESS,
  GET_JANJI_TEMU_FAIL,
} from "../types/janjiTemuTypes";

const API_URL = "http://localhost:3000/api";

export const createJanjiTemu = (janjiTemuData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_JANJI_TEMU_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      `${API_URL}/janji-temu`,
      janjiTemuData,
      config
    );

    dispatch({
      type: CREATE_JANJI_TEMU_SUCCESS,
      payload: data,
    });

    return data;
  } catch (error) {
    dispatch({
      type: CREATE_JANJI_TEMU_FAIL,
      payload: error.response?.data?.message || "Gagal membuat janji temu",
    });
    throw error;
  }
};

export const getPatientJanjiTemu = (patientId) => async (dispatch) => {
  try {
    dispatch({ type: GET_JANJI_TEMU_REQUEST });

    const { data } = await axios.get(
      `${API_URL}/janji-temu/pasien/${patientId}`
    );

    dispatch({
      type: GET_JANJI_TEMU_SUCCESS,
      payload: data,
    });

    return data;
  } catch (error) {
    dispatch({
      type: GET_JANJI_TEMU_FAIL,
      payload:
        error.response?.data?.message || "Gagal mengambil data janji temu",
    });
    throw error;
  }
};
