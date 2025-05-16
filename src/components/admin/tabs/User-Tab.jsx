import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../../redux-admin/action/userAdminAction";

export default function UserTab() {
  const dispatch = useDispatch();

  // Ambil state dari Redux
  const userAdminState = useSelector((state) => state.userAdmin || {});

  const {
    users = [],
    loading = false,
    error = null,
    meta = {},
  } = userAdminState;

  const currentPage = meta.currentPage || 1;
  const totalItems = meta.totalItems || 0;
  const totalPages = Math.ceil(totalItems / 5);

  // Fetch data pasien saat pertama kali component mount atau halaman berubah
  useEffect(() => {
    dispatch(actions.fetchUsers(currentPage));
  }, [dispatch, currentPage]);

  // Fungsi untuk pagination
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

  // Fungsi tombol edit
  const handleEdit = (user) => {
    alert(`Edit pasien: ${user.nama}`);
    // Implementasi edit di sini, seperti membuka modal atau redirect ke form edit
  };

  // Fungsi tombol hapus
  const handleDelete = (id_pasien) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pasien ini?")) {
      alert(`Pasien dengan ID ${id_pasien} berhasil dihapus.`);
      // Implementasi delete disini (misalnya Axios DELETE request)
    }
  };

  // Loading state
  if (loading && users.length === 0) {
    return <p className="p-4">Memuat data...</p>;
  }

  // Error state
  if (error) {
    return <p className="p-4 text-red-500">Error: {error}</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Data Pasien</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Cari pasien..."
            className="border rounded-md px-3 py-1 text-sm w-full sm:w-auto"
          />
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm whitespace-nowrap">
            + Tambah Pasien
          </button>
        </div>
      </div>

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
                Email
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
                Kelamin
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
              users.map((user) => (
                <tr key={user.id_pasien}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.nama}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.noTelp}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.jenis_kelamin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id_pasien)}
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
          Menampilkan {users.length} dari {totalItems} pasien
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handlePrev}
            disabled={currentPage <= 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Sebelumnya
          </button>
          <span className="px-3 py-1 bg-blue-500 text-white rounded">
            {currentPage}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage >= totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  );
}
