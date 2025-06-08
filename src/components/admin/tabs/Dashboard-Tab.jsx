import React, { useEffect, useState } from "react";
import { Calendar, Users, ClockIcon } from "lucide-react";
import apiClient from "../../../config/apiConfigAdmin";

export default function DashboardTab() {
  const [totalPasien, setTotalPasien] = useState(0);
  const [janjiTemuHariIni, setJanjiTemuHariIni] = useState(0);
  const [latestChats, setLatestChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [tindakanTarif, setTindakanTarif] = useState([]);
  const [loadingTarif, setLoadingTarif] = useState(true);
  const [metaChats, setMetaChats] = useState({
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Helper function: Format waktu (HH:mm)
  const formatTime = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Helper function: Format rentang waktu konsultasi (misal: 09:00 - 10:00 WIB)
  const formatTimeRange = (startIso, durationMinutes = 60) => {
    if (!startIso) return "-";
    const start = new Date(startIso);
    const end = new Date(start.getTime() + durationMinutes * 60000);
    const pad = (n) => n.toString().padStart(2, "0");
    return `${pad(start.getHours())}:${pad(start.getMinutes())} - ${pad(
      end.getHours()
    )}:${pad(end.getMinutes())} WIB`;
  };

  // Helper function: Format tanggal (DD/MM/YYYY)
  const formatDate = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Bulan mulai dari 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Helper function: Format mata uang (Rp 300.000)
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "-";
    return `Rp ${amount.toLocaleString("id-ID")}`;
  };

  // Tambahkan di atas komponen
  const formatTanggal = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatJam = (jamString) => {
    if (!jamString) return "-";
    return jamString.replace(".", ":") + " WIB";
  };

  // Tambahkan di atas komponen
  const formatJamFromISO = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes} WIB`;
  };

  const formatJamWIB = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    let hours = date.getUTCHours() + 7; // UTC + 7 for WIB
    if (hours >= 24) hours -= 24;
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    return `${hours.toString().padStart(2, "0")}:${minutes} WIB`;
  };

  const fetchChats = (page = 1) => {
    setLoadingChats(true);
    apiClient
      .get("/konsultasi/chat/admin/daftar", { params: { page, limit: 5 } })
      .then((response) => {
        if (response.data?.success) {
          setLatestChats(response.data.data);
          setMetaChats(response.data.meta);
          setCurrentPage(page);
        }
      })
      .catch((error) => {
        console.error("Error fetching latest chats:", error);
      })
      .finally(() => {
        setLoadingChats(false);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Fetch Total Pasien
    apiClient
      .get("/pasienAdmin/pasien", config)
      .then((response) => {
        if (response.data?.success) {
          const total = response.data.meta?.totalItems || 0;
          setTotalPasien(total);
        }
      })
      .catch((error) => {
        console.error("Error fetching pasien:", error);
      });

    // Fetch Janji Temu Hari Ini
    apiClient
      .get("/janjiTemu/booked", config)
      .then((response) => {
        if (response.data?.success) {
          const total = response.data.meta?.totalItems || 0;
          setJanjiTemuHariIni(total);
        }
      })
      .catch((error) => {
        console.error("Error fetching janji temu:", error);
      });

    // Fetch Konsultasi Terbaru
    fetchChats(1);

    // Fetch Tarif Tindakan + Sortir Berdasarkan createdAt
    setLoadingTarif(true);
    apiClient
      .get("/jenisTindakan/getAll?_=" + Date.now(), config)
      .then((response) => {
        if (response.data?.success) {
          setTindakanTarif(response.data.data.slice(0, 10));
        }
      })
      .catch((error) => {
        console.error("Error fetching tindakan tarif:", error);
      })
      .finally(() => {
        setLoadingTarif(false);
      });
  }, []);

  // Ganti Pagination UI dengan versi lebih modern dan user-friendly
  const renderPagination = () => {
    if (metaChats.totalPages <= 1) return null;
    const pages = [];
    const maxPage = metaChats.totalPages;
    const curr = currentPage;

    // Show first, last, current, and neighbors
    for (let i = 1; i <= maxPage; i++) {
      if (i === 1 || i === maxPage || (i >= curr - 1 && i <= curr + 1)) {
        pages.push(i);
      } else if (
        (i === curr - 2 && curr > 3) ||
        (i === curr + 2 && curr < maxPage - 2)
      ) {
        pages.push("...");
      }
    }

    let lastWasEllipsis = false;
    return (
      <div className="flex flex-wrap justify-center items-center gap-2 mt-4 py-4 px-4">
        <button
          onClick={() => fetchChats(currentPage - 1)}
          disabled={!metaChats.hasPrevPage}
          className="px-3 py-1 rounded border text-sm bg-gray-50 disabled:opacity-50"
        >
          Prev
        </button>
        {pages.map((page, idx) => {
          if (page === "...") {
            if (lastWasEllipsis) return null;
            lastWasEllipsis = true;
            return (
              <span key={idx} className="px-2 text-gray-400">
                ...
              </span>
            );
          }
          lastWasEllipsis = false;
          return (
            <button
              key={page}
              onClick={() => fetchChats(page)}
              className={`px-3 py-1 rounded border text-sm transition-colors duration-150 ${
                currentPage === page
                  ? "bg-blue-600 text-white border-blue-600 shadow"
                  : "bg-white text-gray-700 hover:bg-blue-50 border-gray-300"
              }`}
            >
              {page}
            </button>
          );
        })}
        <button
          onClick={() => fetchChats(currentPage + 1)}
          disabled={!metaChats.hasNextPage}
          className="px-3 py-1 rounded border text-sm bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
        <span className="ml-4 text-sm text-gray-500">
          Total: {metaChats.totalItems} chat
        </span>
      </div>
    );
  };

  return (
    <>
      {/* Statistik Dasar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 font-poppins">
        {/* Total Pasien */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
              <Users className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Pasien</p>
              <p className="text-xl md:text-2xl font-bold">{totalPasien}</p>
            </div>
          </div>
        </div>

        {/* Janji Temu Hari Ini */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
              <Calendar className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Janji Temu</p>
              <p className="text-xl md:text-2xl font-bold">
                {janjiTemuHariIni}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Daftar Konsultasi Terbaru & Tarif Tindakan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Konsultasi Terbaru */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Konsultasi Terbaru</h2>
          </div>
          <div className="divide-y overflow-x-auto">
            {loadingChats ? (
              <div className="p-4 text-center">
                <div className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p>Memuat konsultasi...</p>
              </div>
            ) : latestChats.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Tidak ada konsultasi terbaru.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                {latestChats.map((chat) => (
                  <div
                    key={chat.id_chat}
                    className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:border-blue-400 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex flex-col gap-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        <span className="text-gray-700 font-medium">
                          {formatTanggal(chat.waktu_mulai)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <ClockIcon className="w-5 h-5 text-blue-500" />
                        <span className="text-gray-700 font-medium">
                          {formatJamWIB(chat.waktu_mulai)}
                        </span>
                      </div>
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">
                        {chat.pasien?.nama || "Tanpa Nama"}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      Status:{" "}
                      <span className="capitalize">{chat.status || "N/A"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Pagination UI */}
            {renderPagination()}
          </div>
        </div>

        {/* Tarif Tindakan Terbaru */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Tindakan Terbaru</h2>
          </div>
          <div className="overflow-x-auto">
            {loadingTarif ? (
              <div className="p-4 text-center">
                <div className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p>Memuat tindakan...</p>
              </div>
            ) : tindakanTarif.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Tidak ada data tindakan.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tindakan
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarif
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tindakanTarif.map((item) => (
                    <tr key={item.id_tindakan}>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.nama_tindakan}
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(item.harga)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
