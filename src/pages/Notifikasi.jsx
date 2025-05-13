import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchNotifications,
  markAllNotificationsAsRead,
} from "../redux/actions/notificationAction";
import { Bell, CheckCircle } from "lucide-react";
import Navbar from "../components/Navbar";

function NotifikasiItem({ notifikasi }) {
  const dispatch = useDispatch();

  const handleMarkAsRead = () => {
    if (!notifikasi.is_read) {
      dispatch(markAllNotificationAsRead(notifikasi.id_notifikasi));
    }
  };

  const formatDate = (date) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(date).toLocaleDateString("id-ID", options);
  };

  return (
    <div className="p-6 border-b border-gray-200 hover:bg-gray-50 transition duration-150">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 mt-1">
          <Bell className="h-6 w-6 text-blue-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900">
            {notifikasi.judul}
          </h3>
          <p className="mt-1 text-sm text-gray-600">{notifikasi.pesan}</p>
          <div className="mt-2 flex items-center text-xs text-gray-500">
            <span>{formatDate(notifikasi.createdAt)}</span>
          </div>
        </div>
        {!notifikasi.is_read && (
          <button
            onClick={handleMarkAsRead}
            className="self-center px-3 py-1 text-blue-600 text-xs font-medium"
          >
            Tandai Dibaca
          </button>
        )}
      </div>
    </div>
  );
}

function Notifikasi() {
  const dispatch = useDispatch();
  const notificationState = useSelector((state) => state.notification || {});
  const { loading, notifications = [], error, meta = {} } = notificationState;

  const authState = useSelector((state) => state.auth || {});
  const id_pasien = authState?.user?.pasien?.id_pasien;

  // Default meta jika undefined
  const defaultMeta = {
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
    itemCount: 5,
    totalPages: 1,
    totalItems: 0,
  };

  const safeMeta = meta || defaultMeta;

  useEffect(() => {
    if (id_pasien) {
      dispatch(fetchNotifications({ id_pasien, page: 1, limit: 5 }));
    } else {
      console.warn("ID Pasien tidak tersedia");
    }
  }, [dispatch, id_pasien]);

  const handleNextPage = () => {
    if (safeMeta.hasNextPage) {
      dispatch(
        fetchNotifications({
          id_pasien,
          page: safeMeta.currentPage + 1,
          limit: safeMeta.itemCount,
        })
      );
    }
  };

  const handlePrevPage = () => {
    if (safeMeta.hasPrevPage) {
      dispatch(
        fetchNotifications({
          id_pasien,
          page: safeMeta.currentPage - 1,
          limit: safeMeta.itemCount,
        })
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="max-w-3xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        {/* Card Notifikasi */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Header Section */}
          <div className="px-6 py-4 border-b border-gray-200 bg-blue-50 flex justify-between items-center">
            <div className="flex items-center">
              <Bell className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">
                Notifikasi
              </h2>
            </div>

            {/* Tombol Tandai Semua Dibaca */}
            <button
              onClick={() => dispatch(markAllNotificationsAsRead(id_pasien))}
              disabled={loading || notifications.length === 0}
              className="flex items-center text-xs px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Tandai Semua Dibaca
            </button>
          </div>

          {/* Body Section */}
          <div>
            {loading ? (
              <div className="p-6 text-center text-gray-500">
                Memuat notifikasi...
              </div>
            ) : error ? (
              <div className="p-6 text-center text-red-500">{error}</div>
            ) : notifications.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {notifications.map((item) => (
                  <NotifikasiItem key={item.id_notifikasi} notifikasi={item} />
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                Tidak ada notifikasi
              </div>
            )}
          </div>
        </div>

        {/* Pagination UI - Diluar card */}
        <div className="mt-6 flex justify-between items-center">
          <button
            disabled={!safeMeta.hasPrevPage}
            onClick={handlePrevPage}
            className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1 text-sm font-medium transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span>Sebelumnya</span>
          </button>

          <span className="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium self-center">
            Halaman {safeMeta.currentPage || 1}
          </span>

          <button
            disabled={!safeMeta.hasNextPage}
            onClick={handleNextPage}
            className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1 text-sm font-medium transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white"
          >
            <span>Selanjutnya</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 ml-auto"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Notifikasi;
