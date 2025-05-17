import apiClient from "../../config/apiConfig";

export const FETCH_APPOINTMENTS_REQUEST = "FETCH_APPOINTMENTS_REQUEST";
export const FETCH_APPOINTMENTS_SUCCESS = "FETCH_APPOINTMENTS_SUCCESS";
export const FETCH_APPOINTMENTS_FAILURE = "FETCH_APPOINTMENTS_FAILURE";

export const CONFIRM_APPOINTMENT_REQUEST = "CONFIRM_APPOINTMENT_REQUEST";
export const CONFIRM_APPOINTMENT_SUCCESS = "CONFIRM_APPOINTMENT_SUCCESS";
export const CONFIRM_APPOINTMENT_FAILURE = "CONFIRM_APPOINTMENT_FAILURE";

export const UPDATE_PAYMENT_REQUEST = "UPDATE_PAYMENT_REQUEST";
export const UPDATE_PAYMENT_SUCCESS = "UPDATE_PAYMENT_SUCCESS";
export const UPDATE_PAYMENT_FAILURE = "UPDATE_PAYMENT_FAILURE";

// 📥 Fetch Appointments
export const fetchAppointmentsRequest = () => ({
  type: FETCH_APPOINTMENTS_REQUEST,
});

export const fetchAppointmentsSuccess = (appointments) => ({
  type: FETCH_APPOINTMENTS_SUCCESS,
  payload: appointments,
});

export const fetchAppointmentsFailure = (error) => ({
  type: FETCH_APPOINTMENTS_FAILURE,
  payload: error,
});

export const fetchAppointments =
  (page = 1, search = "", statusFilter = "all") =>
  async (dispatch) => {
    dispatch(fetchAppointmentsRequest());

    try {
      const response = await apiClient.get("/janjiTemu/booked", {
        params: {
          page,
          limit: 5,
          search,
          statusFilter,
        },
      });

      dispatch(
        fetchAppointmentsSuccess({
          data: response.data.data,
          meta: response.data.meta,
        })
      );
    } catch (error) {
      dispatch(
        fetchAppointmentsFailure(error.response?.data?.message || error.message)
      );
    }
  };

// ✅ Confirm Appointment
export const confirmAppointmentRequest = () => ({
  type: CONFIRM_APPOINTMENT_REQUEST,
});

export const confirmAppointmentSuccess = (updatedAppointment) => ({
  type: CONFIRM_APPOINTMENT_SUCCESS,
  payload: updatedAppointment,
});

export const confirmAppointmentFailure = (error) => ({
  type: CONFIRM_APPOINTMENT_FAILURE,
  payload: error,
});

export const confirmAppointment =
  (id, status, pembayaran) => async (dispatch) => {
    dispatch(confirmAppointmentRequest());

    try {
      const response = await apiClient.put(`/janjiTemu/confirm/${id}`, {
        status,
        pembayaran,
      });

      dispatch(confirmAppointmentSuccess(response.data.data));
    } catch (error) {
      dispatch(
        confirmAppointmentFailure(
          error.response?.data?.message || error.message
        )
      );
    }
  };

export const updatePaymentMethod = (id, paymentMethod) => async (dispatch) => {
  dispatch({ type: UPDATE_PAYMENT_REQUEST });

  try {
    const response = await apiClient.put(`/janjiTemu/updatePayment/${id}`, {
      pembayaran: paymentMethod,
    });

    // Pastikan respons berisi data janji temu terbaru
    dispatch({
      type: UPDATE_PAYMENT_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_PAYMENT_FAILURE,
      payload: error.message,
    });
  }
};
