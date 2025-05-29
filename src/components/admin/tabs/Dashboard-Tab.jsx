import React, { useEffect, useState } from "react";
import { Calendar, Users } from "lucide-react";
import apiClient from "../../../config/apiConfigAdmin";

export default function DashboardTab() {
  const [totalPasien, setTotalPasien] = useState(0);
  const [janjiTemuHariIni, setJanjiTemuHariIni] = useState(0);
  const [latestChats, setLatestChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [tindakanTarif, setTindakanTarif] = useState([]);
  const [loadingTarif, setLoadingTarif] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Ambil token dari Local Storage

    // Konfigurasi header dengan token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Tambahkan header Authorization
      },
    };

    // Fetch Total Pasien
    apiClient
      .get("/pasienAdmin/pasien", config)
      .then((response) => {
        if (response.data.success) {
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
        if (response.data.success) {
          const total = response.data.meta?.totalItems || 0;
          setJanjiTemuHariIni(total);
        }
      })
      .catch((error) => {
        console.error("Error fetching janji temu:", error);
      });

    // Fetch Konsultasi Terbaru
    setLoadingChats(true);
    apiClient
      .get("/konsultasi/chat/admin/daftar", config)
      .then((response) => {
        if (response.data.success) {
          setLatestChats(response.data.data.slice(0, 5)); // Ambil 5 chat terbaru
        }
      })
      .catch((error) => {
        console.error("Error fetching latest chats:", error);
      })
      .finally(() => {
        setLoadingChats(false);
      });

    // Fetch Tarif Tindakan
    setLoadingTarif(true);
    apiClient
      .get("/jenisTindakan/getAll", config)
      .then((response) => {
        if (response.data.success) {
          setTindakanTarif(response.data.data.slice(0, 5)); // Ambil 5 tarif pertama
        }
      })
      .catch((error) => {
        console.error("Error fetching tindakan tarif:", error);
      })
      .finally(() => {
        setLoadingTarif(false);
      });
  }, []);

  // Helper function to format time
  const formatTime = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Helper function to format date
  const formatDate = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Helper function to format currency
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "-";
    return `Rp ${amount.toLocaleString("id-ID")}`;
  };

  return (
    <>
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
              <p className="text-sm text-gray-500">Janji Temu Hari Ini</p>
              <p className="text-xl md:text-2xl font-bold">
                {janjiTemuHariIni}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Konsultasi Terbaru */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
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
              latestChats.map((chat) => (
                <div
                  key={chat.id_chat}
                  className="p-4 flex items-center hover:bg-gray-50 cursor-pointer"
                >
                  {/* Kiri: Waktu & Tanggal */}
                  <div className="flex flex-col items-start w-24 text-sm pr-4">
                    <div className="font-semibold text-gray-800">
                      {formatTime(chat.waktu_mulai)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(chat.waktu_mulai)}
                    </div>
                  </div>

                  {/* Kanan: Nama Pasien & Status */}
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {chat.pasien?.nama || "N/A"}
                    </div>
                    <div className="text-xs text-gray-600">
                      Status:{" "}
                      <span className="capitalize">{chat.status || "N/A"}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tarif Tindakan */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Tarif Tindakan Terbaru</h2>
          </div>
          <div className="overflow-x-auto">
            {loadingTarif ? (
              <div className="p-4 text-center">
                <div className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p>Memuat tarif tindakan...</p>
              </div>
            ) : tindakanTarif.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Tidak ada data tarif tindakan.
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
