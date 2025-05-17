import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../../redux-admin/action/jenisTindakanAction";

export default function JenisTindakan() {
  const dispatch = useDispatch();

  // Ambil state dari Redux
  const jenisTindakanState = useSelector((state) => state.jenisTindakan || {});

  const {
    data = [],
    loading = false,
    error = null,
    meta = {},
  } = jenisTindakanState;

  const currentPage = meta.page || 1;
  const totalItems = meta.totalItems || 0;
  const limit = meta.perPage || 5;
  const totalPages = meta.totalPages || 1;

  // Fetch data saat pertama kali component mount atau halaman berubah
  useEffect(() => {
    dispatch(actions.fetchJenisTindakan(currentPage));
  }, [dispatch, currentPage]);

  // Fungsi pagination
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
  const handleEdit = (tindakan) => {
    alert(`Edit tindakan: ${tindakan.nama_tindakan}`);
    // Implementasi edit di sini
  };

  // Fungsi tombol hapus
  const handleDelete = (id_tindakan) => {
    if (
      window.confirm("Apakah Anda yakin ingin menghapus jenis tindakan ini?")
    ) {
      alert(`Jenis tindakan dengan ID ${id_tindakan} berhasil dihapus.`);
      // Implementasi delete disini
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Jenis Tindakan</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Cari tindakan..."
            className="border rounded-md px-3 py-1 text-sm w-full sm:w-auto"
          />
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm whitespace-nowrap">
            + Tambah Tindakan
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
                Nama Tindakan
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Deskripsi
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Harga
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
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-4">
                  Tidak ada jenis tindakan ditemukan
                </td>
              </tr>
            ) : (
              data.map((tindakan) => (
                <tr key={tindakan.id_tindakan}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {tindakan.nama_tindakan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {tindakan.deskripsi}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
                      onClick={() => handleDelete(tindakan.id_tindakan)}
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
