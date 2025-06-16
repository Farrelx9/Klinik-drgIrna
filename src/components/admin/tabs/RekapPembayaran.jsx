import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../../redux-admin/action/rekapPembayaranAction";
import * as pasienActions from "../../../redux-admin/action/pasienAction";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RekapPembayaranPage() {
  const dispatch = useDispatch();
  const rekapState = useSelector((state) => state.rekapPembayaran || {});
  const pasienState = useSelector((state) => state.pasien || {});

  const {
    data: rekapList = [],
    loading: rekapLoading = false,
    error: rekapError = null,
    meta = {},
  } = rekapState;

  const { data: pasienList = [], loading: pasienLoading = false } = pasienState;

  const currentPage = meta.page || 1;
  const totalItems = meta.totalItems || 0;
  const totalPages = meta.totalPages || 1;

  // State Form
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    id_pasien: "",
    tanggal: "",
    total_pembayaran: "",
    jumlah_transaksi: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // State Delete
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);

  // New state for search pasien
  const [searchPasien, setSearchPasien] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedPasien, setSelectedPasien] = useState(null);

  // Filter pasien berdasarkan pencarian
  const filteredPasien = pasienList.filter(
    (pasien) =>
      pasien.nama.toLowerCase().includes(searchPasien.toLowerCase()) ||
      pasien.id_pasien.toString().includes(searchPasien)
  );

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle input change untuk search pasien
  const handlePasienSearch = (e) => {
    setSearchPasien(e.target.value);
    setShowSuggestions(true);
    if (!e.target.value) {
      setSelectedPasien(null);
      setFormData((prev) => ({ ...prev, id_pasien: "" }));
    }
  };

  // Handle pilih pasien dari suggestions
  const handleSelectPasien = (pasien) => {
    setSelectedPasien(pasien);
    setSearchPasien(pasien.nama);
    setFormData((prev) => ({ ...prev, id_pasien: pasien.id_pasien }));
    setShowSuggestions(false);
  };

  // Submit form tambah atau edit
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      total_pembayaran: parseInt(formData.total_pembayaran),
      jumlah_transaksi: parseInt(formData.jumlah_transaksi),
    };

    if (
      !payload.id_pasien ||
      !payload.tanggal ||
      isNaN(payload.total_pembayaran) ||
      isNaN(payload.jumlah_transaksi)
    ) {
      toast.error("Semua field harus diisi dengan benar");
      return;
    }

    if (editingId) {
      // Update rekap
      dispatch(actions.updateRekapPembayaran(editingId, payload))
        .then(() => {
          toast.success("Rekap pembayaran berhasil diperbarui");
        })
        .catch((error) => {
          toast.error(error.message || "Gagal memperbarui rekap pembayaran");
        });
    } else {
      // Tambah rekap
      dispatch(actions.createRekapPembayaran(payload))
        .then(() => {
          toast.success("Rekap pembayaran berhasil ditambahkan");
        })
        .catch((error) => {
          toast.error(error.message || "Gagal menambahkan rekap pembayaran");
        });
    }

    // Tutup modal dan reset form
    setShowModal(false);
    setEditingId(null);
    setFormData({
      id_pasien: "",
      tanggal: "",
      total_pembayaran: "",
      jumlah_transaksi: "",
    });
  };

  // Fetch rekap saat mount atau perubahan page/search
  useEffect(() => {
    dispatch(
      actions.fetchRekapPembayaran(currentPage, 5, debouncedSearchQuery)
    );
    dispatch(pasienActions.fetchUser());
  }, [dispatch, currentPage, debouncedSearchQuery]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Pagination handler
  const handleNext = () => {
    if (currentPage < totalPages) {
      dispatch(actions.setPage(currentPage + 1));
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      dispatch(actions.setPage(currentPage - 1));
    }
  };

  // Tombol Edit
  const handleEdit = (rekap) => {
    setEditingId(rekap.id_rekap);
    setFormData({
      id_pasien: rekap.id_pasien,
      tanggal: new Date(rekap.tanggal).toISOString().split("T")[0],
      total_pembayaran: rekap.total_pembayaran,
      jumlah_transaksi: rekap.jumlah_transaksi,
    });
    setShowModal(true);
  };

  // Tombol Hapus
  const handleDeleteClick = (id_rekap) => {
    setItemToDeleteId(id_rekap);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (itemToDeleteId) {
      dispatch(actions.deleteRekapPembayaran(itemToDeleteId))
        .then(() => {
          toast.success("Rekap pembayaran berhasil dihapus");
        })
        .catch((error) => {
          toast.error(error.message || "Gagal menghapus rekap pembayaran");
        });
    }
    setShowDeleteConfirm(false);
    setItemToDeleteId(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setItemToDeleteId(null);
  };

  return (
    <div className="admin-dashboard font-poppins">
      <div className="content">
        <h1 className="text-2xl font-bold mb-4">Rekap Pembayaran</h1>

        {/* Search & Add Button */}
        <div className="p-4 border-b flex justify-between items-center">
          <input
            type="text"
            placeholder="Cari pasien..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded-md px-3 py-1 text-sm w-full sm:w-64"
          />
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({
                id_pasien: "",
                tanggal: "",
                total_pembayaran: "",
                jumlah_transaksi: "",
              });
              setShowModal(true);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm whitespace-nowrap"
          >
            + Tambah Rekap
          </button>
        </div>

        {/* Loader */}
        {rekapLoading && rekapList.length === 0 && (
          <div className="p-4 text-center">
            <p>Memuat data...</p>
            <div className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mt-2"></div>
          </div>
        )}

        {/* Error Message */}
        {rekapError && (
          <div className="bg-red-100 text-red-700 p-3 border-b text-center">
            {rekapError}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Rekap
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pasien
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Pembayaran
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah Transaksi
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rekapList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-4">
                    Tidak ada rekap pembayaran ditemukan
                  </td>
                </tr>
              ) : (
                rekapList.map((rekap) => (
                  <tr key={rekap.id_rekap}>
                    <td className="px-6 py-4">{rekap.id_rekap}</td>
                    <td className="px-6 py-4">{rekap.pasien?.nama || "-"}</td>
                    <td className="px-6 py-4">
                      {new Date(rekap.tanggal).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4">
                      Rp{" "}
                      {parseInt(rekap.total_pembayaran).toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {rekap.jumlah_transaksi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                      <button
                        onClick={() => handleEdit(rekap)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(rekap.id_rekap)}
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
            Menampilkan {rekapList.length} dari {totalItems} rekap
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handlePrev}
              disabled={currentPage <= 1 || rekapLoading}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Sebelumnya
            </button>
            <span className="px-3 py-1 bg-blue-500 text-white rounded">
              {currentPage}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage >= totalPages || rekapLoading}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Selanjutnya
            </button>
          </div>
        </div>

        {/* Modal Tambah/Edit Rekap */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">
                {editingId ? "Edit Rekap" : "Tambah Rekap Pembayaran"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4 relative">
                  <label
                    htmlFor="search_pasien"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Cari Pasien
                  </label>
                  {pasienLoading ? (
                    <div className="py-2 text-center text-gray-500">
                      Memuat pasien...
                    </div>
                  ) : (
                    <>
                      <input
                        id="search_pasien"
                        type="text"
                        value={searchPasien}
                        onChange={handlePasienSearch}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder="Cari nama atau ID pasien..."
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      {showSuggestions && searchPasien && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                          {filteredPasien.length === 0 ? (
                            <div className="px-4 py-2 text-gray-500">
                              Tidak ada pasien ditemukan
                            </div>
                          ) : (
                            filteredPasien.map((pasien) => (
                              <div
                                key={pasien.id_pasien}
                                onClick={() => handleSelectPasien(pasien)}
                                className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                              >
                                <div className="font-medium">{pasien.nama}</div>
                                <div className="text-sm text-gray-500">
                                  ID: {pasien.id_pasien}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="tanggal"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Tanggal
                  </label>
                  <input
                    id="tanggal"
                    name="tanggal"
                    type="date"
                    value={formData.tanggal}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="total_pembayaran"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Total Pembayaran
                  </label>
                  <input
                    id="total_pembayaran"
                    name="total_pembayaran"
                    type="number"
                    value={formData.total_pembayaran}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="jumlah_transaksi"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Jumlah Transaksi
                  </label>
                  <input
                    id="jumlah_transaksi"
                    name="jumlah_transaksi"
                    type="number"
                    value={formData.jumlah_transaksi}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingId(null);
                      setFormData({
                        id_pasien: "",
                        tanggal: "",
                        total_pembayaran: "",
                        jumlah_transaksi: "",
                      });
                    }}
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

        {/* Modal Konfirmasi Hapus */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h3>
              <p className="mb-6 text-gray-600">
                Apakah Anda yakin ingin menghapus rekap ini?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelDelete}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
