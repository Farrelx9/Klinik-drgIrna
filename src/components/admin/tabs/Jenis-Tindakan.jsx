import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../../redux-admin/action/jenisTindakanAction";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function JenisTindakan() {
  const dispatch = useDispatch();
  const jenisTindakanState = useSelector((state) => state.jenisTindakan || {});
  const {
    data = [],
    loading = false,
    error: reduxError,
    meta = {},
  } = jenisTindakanState;

  const currentPage = meta.page || 1;
  const totalItems = meta.totalItems || 0;
  const totalPages = meta.totalPages || 1;

  // State lokal form dan modal hapus
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // New state for delete modal
  const [itemToDeleteId, setItemToDeleteId] = useState(null); // New state for ID to delete
  const [formData, setFormData] = useState({
    nama_tindakan: "",
    deskripsi: "",
    harga: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  // State untuk debounced search query
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Handle input form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle search input change
  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    // If the search query changes and we are not on page 1, reset to page 1
    if (currentPage !== 1) {
      dispatch(actions.setPage(1));
    }
  };

  // Submit tambah atau edit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Pastikan harga adalah number
    const numericHarga = parseInt(formData.harga, 10);
    if (!formData.nama_tindakan || isNaN(numericHarga)) {
      toast.error("Nama tindakan dan harga harus diisi");
      return;
    }

    try {
      if (editingId) {
        await dispatch(
          actions.updateJenisTindakan(editingId, {
            ...formData,
            harga: numericHarga,
          })
        );
        toast.success("Jenis tindakan berhasil diperbarui");
      } else {
        await dispatch(
          actions.createJenisTindakan({
            ...formData,
            harga: numericHarga,
          })
        );
        toast.success("Jenis tindakan berhasil ditambahkan");
      }
      setShowModal(false);
      setFormData({ nama_tindakan: "", deskripsi: "", harga: "" });
      setEditingId(null);
    } catch (err) {
      console.error("Gagal menyimpan jenis tindakan:", err);
      toast.error("Gagal menyimpan jenis tindakan");
    }
  };

  // Effect untuk debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // Debounce delay

    return () => clearTimeout(timer);
  }, [searchQuery]); // Hanya bergantung pada searchQuery

  // Effect untuk fetching data berdasarkan currentPage dan debouncedSearchQuery
  useEffect(() => {
    // Fetch data whenever currentPage or debouncedSearchQuery changes
    dispatch(actions.fetchJenisTindakan(currentPage, 5, debouncedSearchQuery));
  }, [dispatch, currentPage, debouncedSearchQuery]); // Bergantung pada currentPage dan debouncedSearchQuery

  // Fungsi pagination
  const handleNext = () => {
    if (currentPage < totalPages) {
      dispatch(actions.setPage(currentPage + 1));
      // Fetch data is triggered by the useEffect when currentPage changes
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      dispatch(actions.setPage(currentPage - 1));
      // Fetch data is triggered by the useEffect when currentPage changes
    }
  };

  // Fungsi edit
  const handleEdit = (tindakan) => {
    setFormData({
      nama_tindakan: tindakan.nama_tindakan,
      deskripsi: tindakan.deskripsi,
      harga: tindakan.harga,
    });
    setEditingId(tindakan.id_tindakan);
    setShowModal(true);
  };

  // Fungsi delete - show confirmation modal instead of window.confirm
  const handleDeleteClick = (id_tindakan) => {
    setItemToDeleteId(id_tindakan);
    setShowDeleteConfirm(true);
  };

  // Confirm Delete from modal
  const confirmDelete = async () => {
    if (itemToDeleteId) {
      try {
        await dispatch(actions.deleteJenisTindakan(itemToDeleteId));
        toast.success("Jenis tindakan berhasil dihapus");
        // Refresh list setelah hapus
        dispatch(
          actions.fetchJenisTindakan(currentPage, 5, debouncedSearchQuery)
        );
      } catch (error) {
        console.error("Gagal menghapus jenis tindakan:", error);
        toast.error("Gagal menghapus jenis tindakan");
      }
    }
    // Close modal and reset state
    setShowDeleteConfirm(false);
    setItemToDeleteId(null);
  };

  // Cancel Delete from modal
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setItemToDeleteId(null);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden font-poppins">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Jenis Tindakan</h2>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Cari tindakan..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="border rounded-md px-3 py-1 text-sm w-full sm:w-auto"
            />
            <button
              onClick={() => {
                setEditingId(null);
                setFormData({ nama_tindakan: "", deskripsi: "", harga: "" });
                setShowModal(true);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm whitespace-nowrap"
            >
              + Tambah Tindakan
            </button>
          </div>
        </div>

        {/* Loader */}
        {loading && data.length === 0 && (
          <div className="p-4 text-center">
            <p>Memuat data...</p>
            <div className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mt-2"></div>
          </div>
        )}

        {/* Error Message */}
        {reduxError && (
          <div className="bg-red-100 text-red-700 p-3 border-b text-center">
            {reduxError}
          </div>
        )}

        {/* Modal Tambah/Edit */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">
                {editingId ? "Edit Jenis Tindakan" : "Tambah Jenis Tindakan"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="nama_tindakan"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Nama Tindakan
                  </label>
                  <input
                    id="nama_tindakan"
                    name="nama_tindakan"
                    value={formData.nama_tindakan}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="deskripsi"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Deskripsi
                  </label>
                  <textarea
                    id="deskripsi"
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleChange}
                    rows="3"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="harga"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Harga
                  </label>
                  <input
                    id="harga"
                    name="harga"
                    type="number"
                    value={formData.harga}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingId(null);
                      setFormData({
                        nama_tindakan: "",
                        deskripsi: "",
                        harga: "",
                      });
                    }}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    {editingId ? "Perbarui" : "Simpan"}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Tindakan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deskripsi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Harga
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center p-4">
                    Tidak ada jenis tindakan ditemukan
                  </td>
                </tr>
              ) : (
                data.map((tindakan) => (
                  <tr key={tindakan.id_tindakan}>
                    <td className="px-6 py-4 max-w-xs overflow-hidden break-words font-semibold">
                      {tindakan.nama_tindakan}
                    </td>
                    <td className="px-6 py-4 max-w-xs overflow-hidden break-words">
                      {tindakan.deskripsi}
                    </td>
                    <td className="px-6 py-4 max-w-xs overflow-hidden break-words">
                      Rp{tindakan.harga.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                      <button
                        onClick={() => handleEdit(tindakan)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(tindakan.id_tindakan)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Menampilkan {data.length} dari {totalItems} jenis tindakan
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handlePrev}
              disabled={currentPage <= 1 || loading}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Sebelumnya
            </button>
            <span className="px-3 py-1 bg-blue-500 text-white rounded">
              {currentPage}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage >= totalPages || loading}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>

      {/* Modal Konfirmasi Hapus Jenis Tindakan */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">
                Konfirmasi Hapus Jenis Tindakan
              </h3>
              <p className="text-gray-600 mb-6">
                Apakah Anda yakin ingin menghapus jenis tindakan ini?
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
    </>
  );
}
