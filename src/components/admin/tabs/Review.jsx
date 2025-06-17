import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchReviews,
  setPage,
} from "../../../redux-admin/action/reviewAction";
import { formatDateTimeWithWIB } from "../../../utils/timeUtils";

function ReviewList() {
  const dispatch = useDispatch();

  // Akses Redux state
  const data = useSelector((state) => state.reviewAdmin.data || []);
  const meta = useSelector((state) => state.reviewAdmin.meta || {});
  const loading = useSelector((state) => state.reviewAdmin.loading);
  const error = useSelector((state) => state.reviewAdmin.error);
  const currentPage = useSelector((state) => state.reviewAdmin.currentPage);

  useEffect(() => {
    dispatch(fetchReviews({ page: currentPage }));
  }, [dispatch, currentPage]);

  // Debug: Log the data when it changes
  useEffect(() => {
    if (data && data.length > 0) {
      console.log("Review data:", data);
      data.forEach((review) => {
        console.log("Janji Temu date:", review.janjiTemu?.tanggal_waktu);
        console.log(
          "Konsultasi Chat date:",
          review.konsultasiChat?.waktu_mulai
        );
      });
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <p>No data available.</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden font-poppins">
      <h2 className="text-lg font-semibold p-4 border-b">Daftar Review</h2>

      {/* Table */}
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
                Rating
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Komentar
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Layanan
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tanggal/Waktu
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((review) => (
              <tr key={review.id}>
                {/* Nama Pasien */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {review.pasien.nama}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Rating */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{review.rating}</div>
                </td>

                {/* Komentar */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {review.komentar || "-"}
                  </div>
                </td>

                {/* Jenis Asal */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-sm font-medium ${
                      review.janjiTemu
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {review.janjiTemu ? "Janji Temu" : "Konsultasi Chat"}
                  </span>
                </td>

                {/* Tanggal/Waktu */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {review.janjiTemu?.tanggal_waktu
                      ? formatDateTimeWithWIB(review.janjiTemu.tanggal_waktu)
                      : review.konsultasiChat?.waktu_mulai
                      ? formatDateTimeWithWIB(review.konsultasiChat.waktu_mulai)
                      : "-"}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Menampilkan {data.length} dari {meta.totalItems || 0} review
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => dispatch(setPage(currentPage - 1))}
            disabled={currentPage <= 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Sebelumnya
          </button>
          <span className="px-3 py-1 bg-blue-500 text-white rounded">
            {currentPage}
          </span>
          <button
            onClick={() => dispatch(setPage(currentPage + 1))}
            disabled={currentPage >= meta.totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewList;
