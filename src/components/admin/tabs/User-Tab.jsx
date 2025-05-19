import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../../redux-admin/action/userAdminAction";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function UserTab() {
  const dispatch = useDispatch();

  // Ambil state dari Redux
  const userAdminState = useSelector((state) => state.userAdmin || {});
  const {
    users = [],
    loading = false,
    error: reduxError,
    meta = {},
  } = userAdminState;

  const currentPage = meta.page || 1;
  const totalItems = meta.totalItems || 0;
  const totalPages = meta.totalPages || 1;

  // State lokal form
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    id_pasien: "",
    nama: "",
    noTelp: "",
    alamat: "",
    jenis_kelamin: "",
    tanggal_lahir: "",
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

    const { nama } = formData;

    if (!nama) {
      toast.error("Nama harus diisi");
      return;
    }

    try {
      if (editingId) {
        await dispatch(actions.updateUser(editingId, formData));
        toast.success("Data pasien berhasil diperbarui");
      } else {
        await dispatch(actions.createUser(formData));
        toast.success("Pasien baru berhasil ditambahkan");
      }

      setShowModal(false);
      resetForm();
      dispatch(actions.fetchUser(currentPage, 5, searchQuery)); // Refresh list
    } catch (err) {
      console.error("Gagal menyimpan pasien:", err);
      toast.error("Gagal menyimpan data pasien");
    }
  };

  const resetForm = () => {
    setFormData({
      id_pasien: "",
      nama: "",
      noTelp: "",
      alamat: "",
      jenis_kelamin: "",
      tanggal_lahir: "",
    });
    setEditingId(null);
  };

  // Load data saat mount
  useEffect(() => {
    dispatch(actions.fetchUser(currentPage, 5, searchQuery));
  }, [dispatch, currentPage]);

  // Debounce pencarian
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(actions.fetchUser(1, 5, searchQuery));
    }, 500);

    return () => clearTimeout(timer);
  }, [dispatch, searchQuery]);

  // Pagination handler
  const handleNext = () => {
    if (currentPage < totalPages) {
      dispatch(actions.setPage(currentPage + 1));
      dispatch(actions.fetchUser(currentPage + 1, 5, searchQuery));
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      dispatch(actions.setPage(currentPage - 1));
      dispatch(actions.fetchUser(currentPage - 1, 5, searchQuery));
    }
  };

  // Tombol edit & hapus
  const handleEdit = (pasien) => {
    setFormData({
      id_pasien: pasien.id_pasien,
      nama: pasien.nama,
      noTelp: pasien.noTelp,
      alamat: pasien.alamat,
      jenis_kelamin: pasien.jenis_kelamin,
      tanggal_lahir: pasien.tanggal_lahir
        ? new Date(pasien.tanggal_lahir).toISOString().split("T")[0]
        : "",
    });
    setEditingId(pasien.id_pasien);
    setShowModal(true);
  };

  const handleDelete = (id_pasien) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pasien ini?")) {
      dispatch(actions.deleteUser(id_pasien));
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h2 className="text-lg font-semibold">Data Pasien</h2>
          <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-2">
            <input
              type="text"
              placeholder="Cari pasien..."
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
              + Tambah Pasien
            </button>
          </div>
        </div>

        {/* Loader */}
        {loading && users.length === 0 && (
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

        {/* Modal Tambah/Edit Pasien */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">
                {editingId ? "Edit" : "Tambah"} Pasien
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nama Pasien */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Nama
                  </label>
                  <input
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>

                {/* No Telepon */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    No. Telepon
                  </label>
                  <input
                    name="noTelp"
                    value={formData.noTelp}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                {/* Alamat */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Alamat
                  </label>
                  <input
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                {/* Jenis Kelamin */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Jenis Kelamin
                  </label>
                  <select
                    name="jenis_kelamin"
                    value={formData.jenis_kelamin}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  >
                    <option value="">-- Pilih --</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                {/* Tanggal Lahir */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Tanggal Lahir
                  </label>
                  <input
                    name="tanggal_lahir"
                    type="date"
                    value={formData.tanggal_lahir}
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
                  Nama
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  No. Telepon
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Jenis Kelamin
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
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-4">
                    Tidak ada pasien ditemukan
                  </td>
                </tr>
              ) : (
                users.map((pasien) => (
                  <tr key={pasien.id_pasien}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {pasien.nama}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {pasien.noTelp || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {pasien.jenis_kelamin || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                      <button
                        onClick={() => handleEdit(pasien)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(pasien.id_pasien)}
                        className="text-red-500 hover:text-red-700"
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
        <div className="p-4 border-t flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="text-sm text-gray-500">
            Menampilkan {users.length} dari {totalItems} pasien
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handlePrev}
              disabled={currentPage <= 1}
              className="border rounded px-3 py-1 text-sm disabled:opacity-50"
            >
              Sebelumnya
            </button>
            <span className="px-3 py-1 bg-blue-500 text-white rounded">
              {currentPage}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage >= totalPages}
              className="border rounded px-3 py-1 text-sm disabled:opacity-50"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
