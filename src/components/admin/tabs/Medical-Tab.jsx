import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as rekamMedisActions from "../../../redux-admin/action/rekamMedisAction";
import * as pasienActions from "../../../redux-admin/action/pasienAction";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MedicalTab() {
  const dispatch = useDispatch();

  // Ambil state dari Redux
  const rekamMedisState = useSelector((state) => state.rekamMedis || {});
  const pasienState = useSelector((state) => state.pasien || {});

  const {
    data: rekamMedisList = [],
    loading: rekamMedisLoading = false,
    error: reduxError,
    meta: rekamMedisMeta = {},
  } = rekamMedisState;

  const { data: pasienList = [], loading: pasienLoading = false } = pasienState;

  const currentPage = rekamMedisMeta.page || 1;
  const totalItems = rekamMedisMeta.totalItems || 0;
  const totalPages = rekamMedisMeta.totalPages || 1;

  // State lokal
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    id_pasien: "",
    keluhan: "",
    diagnosa: "",
    tindakan: "",
    resep_obat: "",
    dokter: "",
    tanggal: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Handle input form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.id_pasien || !formData.diagnosa || !formData.tindakan) {
      toast.error("ID Pasien, Diagnosis, dan Perawatan harus diisi");
      return;
    }

    try {
      if (editingId) {
        await dispatch(rekamMedisActions.updateRekamMedis(editingId, formData));
        toast.success("Rekam medis berhasil diperbarui");
      } else {
        await dispatch(rekamMedisActions.createRekamMedis(formData));
        toast.success("Rekam medis berhasil ditambahkan");
      }

      setShowModal(false);
      resetForm();
      dispatch(rekamMedisActions.fetchRekamMedis(currentPage, 5, searchQuery));
    } catch (err) {
      console.error("Gagal menyimpan rekam medis:", err);
      toast.error("Gagal menyimpan rekam medis");
    }
  };

  const resetForm = () => {
    setFormData({
      id_pasien: "",
      keluhan: "",
      diagnosa: "",
      tindakan: "",
      resep_obat: "",
      dokter: "",
      tanggal: "",
    });
    setEditingId(null);
  };

  // Load data saat mount atau page berubah
  useEffect(() => {
    dispatch(rekamMedisActions.fetchRekamMedis(currentPage, 5, searchQuery));
    dispatch(pasienActions.fetchPasien());
  }, [dispatch, currentPage]);

  // Debounce pencarian
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(rekamMedisActions.fetchRekamMedis(1, 5, searchQuery));
    }, 500);

    return () => clearTimeout(timer);
  }, [dispatch, searchQuery]);

  // Pagination handler
  const handleNext = () => {
    if (currentPage < totalPages) {
      dispatch(rekamMedisActions.setPageRekamMedis(currentPage + 1));
      dispatch(
        rekamMedisActions.fetchRekamMedis(currentPage + 1, 5, searchQuery)
      );
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      dispatch(rekamMedisActions.setPageRekamMedis(currentPage - 1));
      dispatch(
        rekamMedisActions.fetchRekamMedis(currentPage - 1, 5, searchQuery)
      );
    }
  };

  // Edit handler
  const handleEdit = (record) => {
    setFormData({
      id_pasien: record.id_pasien,
      keluhan: record.keluhan,
      diagnosa: record.diagnosa,
      tindakan: record.tindakan,
      resep_obat: record.resep_obat,
      dokter: record.dokter,
      tanggal: new Date(record.tanggal).toISOString().split("T")[0],
    });
    setEditingId(record.id_rekam_medis);
    setShowModal(true);
  };

  // Delete handler
  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus rekam medis ini?")) {
      dispatch(rekamMedisActions.deleteRekamMedis(id));
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h2 className="text-lg font-semibold">Rekam Medis Pasien</h2>
          <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-2">
            <input
              type="text"
              placeholder="Cari rekam medis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border rounded-md px-3 py-1 text-sm w-full sm:w-auto"
            />
            <button
              onClick={() => {
                setShowModal(true);
                resetForm();
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm whitespace-nowrap"
            >
              + Tambah Rekam Medis
            </button>
          </div>
        </div>

        {/* Loader */}
        {rekamMedisLoading && rekamMedisList.length === 0 && (
          <div className="p-4 text-center">
            <p>Memuat data...</p>
            <div className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent mx-auto mt-2"></div>
          </div>
        )}

        {/* Error Message */}
        {reduxError && (
          <div className="bg-red-100 text-red-700 p-3 border-b text-center">
            {reduxError}
          </div>
        )}

        {/* Modal Tambah/Edit Rekam Medis */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">
                {editingId ? "Edit" : "Tambah"} Rekam Medis
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Pilih Pasien */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Pilih Pasien
                  </label>
                  <select
                    name="id_pasien"
                    value={formData.id_pasien}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  >
                    <option value="">-- Pilih Pasien --</option>
                    {Array.isArray(pasienList) &&
                      pasienList.map((pasien) => (
                        <option key={pasien.id_pasien} value={pasien.id_pasien}>
                          {pasien.nama} ({pasien.email})
                        </option>
                      ))}
                  </select>
                </div>

                {/* Keluhan */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Keluhan
                  </label>
                  <textarea
                    name="keluhan"
                    value={formData.keluhan}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-3 py-2 border rounded"
                  ></textarea>
                </div>

                {/* Diagnosa */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Diagnosa
                  </label>
                  <textarea
                    name="diagnosa"
                    value={formData.diagnosa}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-3 py-2 border rounded"
                    required
                  ></textarea>
                </div>

                {/* Perawatan / Tindakan */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Perawatan / Tindakan
                  </label>
                  <input
                    name="tindakan"
                    value={formData.tindakan}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>

                {/* Tanggal */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Tanggal
                  </label>
                  <input
                    name="tanggal"
                    type="date"
                    value={formData.tanggal}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>

                {/* Dokter */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Dokter
                  </label>
                  <input
                    name="dokter"
                    value={formData.dokter}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                {/* Aksi */}
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID Pasien
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Keluhan
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Diagnosa
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Perawatan
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tanggal
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rekamMedisList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-4">
                    Tidak ada rekam medis ditemukan
                  </td>
                </tr>
              ) : (
                rekamMedisList.map((record) => (
                  <tr key={record.id}>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.patient}
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.diagnosis}
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.treatment}
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(record.date).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.doctor}
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(record)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="text-sm text-gray-500">
            Menampilkan {rekamMedisList.length} dari {totalItems} rekam medis
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handlePrev}
              disabled={currentPage <= 1}
              className="border rounded px-3 py-1 text-sm disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4 inline sm:hidden" />{" "}
              <span className="hidden sm:inline">Sebelumnya</span>
            </button>
            <span className="px-3 py-1 bg-blue-500 text-white rounded">
              {currentPage}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage >= totalPages}
              className="border rounded px-3 py-1 text-sm disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4 inline sm:hidden" />{" "}
              <span className="hidden sm:inline">Selanjutnya</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
