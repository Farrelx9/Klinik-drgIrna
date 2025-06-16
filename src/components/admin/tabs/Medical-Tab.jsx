import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as rekamMedisActions from "../../../redux-admin/action/rekamMedisAction";
import * as pasienActions from "../../../redux-admin/action/pasienAction";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FieldPasien from "./FieldPasien";
import { deleteRekamMedis } from "../../../redux-admin/action/rekamMedisAction";

export default function MedicalTab() {
  const dispatch = useDispatch();

  // Ambil state dari Redux
  const rekamMedisState = useSelector((state) => state.rekamMedis || {});
  const pasienState = useSelector((state) => state.pasien || {});
  const [editingId, setEditingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [recordToDeleteId, setRecordToDeleteId] = useState(null);

  const {
    data: rekamMedisList = [],
    loading: rekamMedisLoading = false,
    error: reduxError,
    meta: rekamMedisMeta = {},
  } = rekamMedisState;

  const { data: pasienList = [] } = pasienState;

  const currentPage = rekamMedisMeta.page || 1;
  const totalItems = rekamMedisMeta.totalItems || 0;
  const totalPages = rekamMedisMeta.totalPages || 1;

  // State lokal form
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id_pasien: "",
    keluhan: "",
    diagnosa: "",
    tindakan: "",
    resep_obat: "",
    dokter: "drg. Irna",
    tanggal: new Date().toISOString().split("T")[0],
  });

  const [searchPasienInModal, setSearchPasienInModal] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Load data saat mount
  useEffect(() => {
    dispatch(rekamMedisActions.fetchRekamMedis(currentPage, 5, ""));
    dispatch(pasienActions.fetchUser());
  }, [dispatch, currentPage]);

  // Reset form saat modal ditutup
  const resetForm = () => {
    setFormData({
      id_pasien: "",
      keluhan: "",
      diagnosa: "",
      tindakan: "",
      resep_obat: "",
      dokter: "drg. Irna",
      tanggal: "",
    });
    setSearchPasienInModal("");
    setShowModal(false);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.id_pasien || !formData.diagnosa || !formData.tindakan) {
      toast.error("ID Pasien, Diagnosa, dan Tindakan harus diisi");
      return;
    }

    try {
      if (editingId) {
        await dispatch(rekamMedisActions.updateRekamMedis(editingId, formData));
        toast.success("Rekam medis berhasil diperbarui");
      } else {
        await dispatch(rekamMedisActions.createRekamMedis(formData));
        toast.success("Rekam medis baru berhasil ditambahkan");
      }

      resetForm();
      dispatch(rekamMedisActions.fetchRekamMedis(currentPage, 5, ""));
    } catch (err) {
      console.error("Gagal menyimpan rekam medis:", err);
      toast.error("Gagal menyimpan rekam medis");
    }
  };

  // Handler untuk input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePatientClick = (record) => {
    // Fetch or enrich patient details here if needed
    const enrichedPatient = {
      ...record,
      pasien: { nama: record.nama_pasien || "-", email: "-" }, // Example enrichment
    };
    setSelectedPatient(enrichedPatient);
  };
  const handleBack = () => {
    setSelectedPatient(null); // Reset selectedPatient untuk menutup detail pasien
  };

  const handleEdit = (record) => {
    const rawDate = record.tanggal;
    const isValidDate = rawDate && !isNaN(new Date(rawDate).getTime());

    setFormData({
      id_pasien: record.id_pasien,
      nama_pasien: record.nama_pasien || "-", // 🔹 Ambil nama pasien
      keluhan: record.keluhan || "",
      diagnosa: record.diagnosa || "",
      tindakan: record.tindakan || "",
      resep_obat: record.resep_obat || "",
      dokter: record.dokter || "drg. Irna",
      tanggal: isValidDate ? new Date(rawDate).toISOString().split("T")[0] : "",
    });

    setEditingId(record.id_rekam_medis);
    setShowModal(true);
  };

  // Handle Delete - show confirmation modal instead of window.confirm
  const handleDeleteClick = (id_rekam_medis) => {
    setRecordToDeleteId(id_rekam_medis);
    setShowDeleteConfirm(true);
  };

  // Confirm Delete from modal
  const confirmDelete = async () => {
    if (recordToDeleteId) {
      try {
        await dispatch(deleteRekamMedis(recordToDeleteId));
        toast.success("Rekam medis berhasil dihapus");
        // Refresh list setelah hapus
        dispatch(rekamMedisActions.fetchRekamMedis(currentPage, 5, ""));
      } catch (error) {
        console.error("Gagal menghapus rekam medis:", error);
        toast.error("Gagal menghapus rekam medis");
      }
    }
    // Close modal and reset state
    setShowDeleteConfirm(false);
    setRecordToDeleteId(null);
  };

  // Cancel Delete from modal
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setRecordToDeleteId(null);
  };

  // Filter pasien berdasarkan nama/email
  const filteredPasienList = useMemo(() => {
    if (!searchPasienInModal.trim()) return pasienList;

    const query = searchPasienInModal.toLowerCase();
    return pasienList.filter(
      (p) =>
        p.nama?.toLowerCase().includes(query) ||
        p.email?.toLowerCase().includes(query)
    );
  }, [pasienList, searchPasienInModal]);

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden font-poppins">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Rekam Medis Pasien</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
          >
            + Tambah Rekam Medis
          </button>
        </div>

        {/* Loader */}
        {rekamMedisLoading && rekamMedisList.length === 0 && (
          <div className="p-4 text-center">Memuat data...</div>
        )}

        {/* Error Message */}
        {reduxError && (
          <div className="bg-red-100 text-red-700 p-3 text-center">
            {reduxError}
          </div>
        )}

        {/* Tabel Rekam Medis */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Nama Pasien
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
                  Jenis kelamin
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Alamat
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Dokter
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tanggal Lahir
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
                  <td colSpan={7} className="text-center p-4">
                    Tidak ada rekam medis ditemukan
                  </td>
                </tr>
              ) : (
                rekamMedisList.map((record) => {
                  const isValidDate =
                    record.tanggal &&
                    !isNaN(new Date(record.tanggal).getTime());

                  return (
                    <tr
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={() => handlePatientClick(record)}
                      key={record.id_rekam_medis}
                    >
                      {/* ✅ Nama Pasien */}
                      <td className="px-6 py-4 max-w-xs overflow-hidden break-words font-semibold">
                        {record.nama_pasien || "-"}
                      </td>

                      {/* Keluhan */}
                      <td className="px-6 py-4 max-w-xs overflow-hidden break-words">
                        {record.keluhan || "-"}
                      </td>

                      {/* Diagnosa */}
                      <td className="px-6 py-4 max-w-xs overflow-hidden break-words">
                        {record.jenis_kelamin_pasien || "-"}
                      </td>

                      {/* Tindakan */}
                      <td className="px-6 py-4 max-w-xs overflow-hidden break-words">
                        {record.alamat_pasien || "-"}
                      </td>

                      {/* Dokter */}
                      <td className="px-6 py-4 max-w-xs overflow-hidden break-words">
                        {record.dokter || "-"}
                      </td>

                      {/* Tanggal */}
                      <td className="px-6 py-4 max-w-xs overflow-hidden break-words">
                        {isValidDate
                          ? new Date(
                              record.tanggal_lahir_pasien
                            ).toLocaleDateString("id-ID")
                          : "-"}
                      </td>

                      {/* Aksi */}
                      <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click event
                            handleEdit(record);
                          }}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click event
                            handleDeleteClick(record.id_rekam_medis);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t flex justify-between items-center">
          <span>{totalItems} rekam medis ditemukan</span>
          <div className="flex space-x-2">
            <button
              onClick={() =>
                dispatch(rekamMedisActions.setPageRekamMedis(currentPage - 1))
              }
              disabled={currentPage <= 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Sebelumnya
            </button>
            <span className="px-3 py-1 bg-blue-500 text-white rounded">
              {currentPage}
            </span>
            <button
              onClick={() =>
                dispatch(rekamMedisActions.setPageRekamMedis(currentPage + 1))
              }
              disabled={currentPage >= totalPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Display FieldPasien if a patient is selected */}
      {selectedPatient && (
        <div className="mt-4 bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Detail Pasien</h2>
          <FieldPasien patient={selectedPatient} onBack={handleBack} />
        </div>
      )}

      {/* Modal Konfirmasi Hapus Rekam Medis */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">
                Konfirmasi Hapus Rekam Medis
              </h3>
              <p className="text-gray-600 mb-6">
                Apakah Anda yakin ingin menghapus rekam medis ini?
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Rekam Medis */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto">
            {/* Header */}
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Tambah Rekam Medis</h3>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4 overflow-y-auto max-h-[80vh]"
            >
              {/* Cari Pasien */}
              <div>
                <label className="block text-sm font-bold mb-2">
                  Cari Pasien
                </label>
                <input
                  type="text"
                  placeholder="Ketik nama atau email..."
                  value={searchPasienInModal}
                  onChange={(e) => setSearchPasienInModal(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Dropdown Hasil Pencarian */}
              <div>
                <label className="block text-sm font-bold mb-2">
                  Pilih Pasien
                </label>
                <select
                  name="id_pasien"
                  value={formData.id_pasien}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">-- Pilih Pasien --</option>
                  {filteredPasienList.length > 0 ? (
                    filteredPasienList.map((p) => (
                      <option key={p.id_pasien} value={p.id_pasien}>
                        {p.nama} ({p.email})
                      </option>
                    ))
                  ) : (
                    <option disabled>Tidak ada pasien ditemukan</option>
                  )}
                </select>
              </div>

              {/* Keluhan */}
              <div>
                <label className="block text-sm font-bold mb-2">Keluhan</label>
                <textarea
                  name="keluhan"
                  value={formData.keluhan}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              {/* Diagnosa */}
              <div>
                <label className="block text-sm font-bold mb-2">
                  Diagnosis
                </label>
                <textarea
                  name="diagnosa"
                  value={formData.diagnosa}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>

              {/* Tindakan */}
              <div>
                <label className="block text-sm font-bold mb-2">Tindakan</label>
                <input
                  name="tindakan"
                  value={formData.tindakan}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Dokter (default drg. Irna) */}
              <div>
                <label className="block text-sm font-bold mb-2">Dokter</label>
                <input
                  name="dokter"
                  value={formData.dokter}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded bg-gray-100"
                  readOnly
                />
              </div>

              {/* Tanggal */}
              <div>
                <label className="block text-sm font-bold mb-2">Tanggal</label>
                <input
                  name="tanggal"
                  type="date"
                  value={formData.tanggal}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  max={new Date().toISOString().split("T")[0]}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              {/* Aksi Form */}
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
