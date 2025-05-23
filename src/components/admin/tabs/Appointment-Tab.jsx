import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchAppointments,
  confirmAppointment,
  updatePaymentMethod,
  setPage,
} from "../../../redux-admin/action/appointmentAction";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AppointmentTab() {
  const dispatch = useDispatch();
  const { loading, appointments, meta, error, updatingId } = useSelector(
    (state) => state.appointment || {}
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Ambil currentPage & totalPages dengan fallback
  const currentPage = parseInt(meta.currentPage) || 1;
  const totalItems = parseInt(meta.totalItems) || 0;
  const limit = parseInt(meta.itemCount) || 5;
  const totalPages = parseInt(meta.totalPages) || 1;

  // Load data saat mount atau page berubah
  useEffect(() => {
    dispatch(fetchAppointments(currentPage, searchQuery, statusFilter));
  }, [dispatch, currentPage, searchQuery, statusFilter]);

  // Debounce pencarian
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchAppointments(1, searchQuery, statusFilter));
    }, 500);

    return () => clearTimeout(timer);
  }, [dispatch, searchQuery, statusFilter]);

  // Handler konfirmasi dan pembayaran
  const handleConfirm = (id) => {
    dispatch(confirmAppointment(id, "confirmed"));
  };

  const handleCancel = (id) => {
    dispatch(confirmAppointment(id, "cancelled"));
  };

  const handlePaymentMethodChange = async (id, paymentMethod) => {
    if (!paymentMethod) return;
    try {
      await dispatch(updatePaymentMethod(id, paymentMethod));
    } catch (err) {
      alert("Gagal mengupdate metode pembayaran");
    }
  };

  // Fungsi handler pagination
  const handleNext = () => {
    if (currentPage < totalPages) {
      dispatch(setPage(currentPage + 1));
      dispatch(fetchAppointments(currentPage + 1, searchQuery, statusFilter));
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      dispatch(setPage(currentPage - 1));
      dispatch(fetchAppointments(currentPage - 1, searchQuery, statusFilter));
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        Memuat data...
        <div className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent mx-auto mt-2"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h2 className="text-lg font-semibold">Daftar Janji Temu</h2>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-2">
          <input
            type="text"
            placeholder="Cari pasien atau keluhan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border px-3 py-1 rounded text-sm w-full sm:w-auto"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-3 py-1 rounded text-sm w-full sm:w-auto"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="terpesan">Terpesan</option>
          </select>
        </div>
      </div>

      {/* Tabel Janji Temu */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                PASIEN
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                KELUHAN
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                TANGGAL
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                WAKTU
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                STATUS
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                PEMBAYARAN
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                AKSI
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-4">
                  Tidak ada janji temu ditemukan
                </td>
              </tr>
            ) : (
              appointments.map((appointment) => (
                <tr key={appointment.id_janji}>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {appointment.nama_pasien || appointment.id_pasien || "-"}
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {appointment.keluhan || "-"}
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(appointment.tanggal_waktu).toLocaleDateString(
                      "id-ID"
                    )}
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(appointment.tanggal_waktu).toLocaleTimeString(
                      "id-ID",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        appointment.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : ["pending", "terpesan"].includes(appointment.status)
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {appointment.status === "terpesan"
                        ? "pending"
                        : appointment.status}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {appointment.status === "confirmed" ? (
                      <select
                        value={appointment.pembayaran || ""}
                        onChange={(e) =>
                          handlePaymentMethodChange(
                            appointment.id_janji,
                            e.target.value
                          )
                        }
                        disabled={updatingId === appointment.id_janji}
                        className="border rounded-md px-3 py-1 text-sm w-full sm:w-auto"
                      >
                        <option value="">Pilih Metode</option>
                        <option value="cash">Cash</option>
                        <option value="transfer">Transfer</option>
                      </select>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {["pending", "terpesan"].includes(appointment.status) ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleConfirm(appointment.id_janji)}
                          disabled={updatingId === appointment.id_janji}
                          className="text-green-500 hover:text-green-700 disabled:opacity-50"
                        >
                          Konfirmasi
                        </button>
                        <button
                          onClick={() => handleCancel(appointment.id_janji)}
                          disabled={updatingId === appointment.id_janji}
                          className="text-red-500 hover:text-red-700 disabled:opacity-50"
                        >
                          Tolak
                        </button>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination UI */}
      <div className="p-4 border-t flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="text-sm text-gray-500 order-2 sm:order-1">
          Menampilkan {(currentPage - 1) * limit + 1} -{" "}
          {Math.min(currentPage * limit, totalItems)} dari {totalItems} janji
          temu
        </div>
        <div className="flex space-x-2 order-1 sm:order-2">
          <button
            onClick={handlePrev}
            disabled={!meta.hasPrevPage}
            className={`border rounded-md px-3 py-1 text-sm ${
              !meta.hasPrevPage ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <ChevronLeft className="h-4 w-4 sm:hidden inline" />{" "}
            <span className="hidden sm:inline">Sebelumnya</span>
          </button>
          <span className="px-3 py-1 bg-blue-500 text-white rounded">
            {currentPage}
          </span>
          <button
            onClick={handleNext}
            disabled={!meta.hasNextPage}
            className={`border rounded-md px-3 py-1 text-sm ${
              !meta.hasNextPage ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <ChevronRight className="h-4 w-4 sm:hidden inline" />{" "}
            <span className="hidden sm:inline">Selanjutnya</span>
          </button>
        </div>
      </div>
    </div>
  );
}
