import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { id } from "date-fns/locale";
registerLocale("id", id);
import apiClient from "../../../config/apiConfig";

export default function Schedule() {
  const [jadwalList, setJadwalList] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  const fetchJadwal = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await apiClient.get("/jadwal", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }); // Sesuaikan endpoint
      setJadwalList(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Gagal mengambil jadwal:", err);
      setLoading(false);
    }
  };

  const tambahJadwal = async () => {
    const payload = {
      waktu: new Date().toISOString(), // contoh waktu sekarang
      deskripsi: "Janji temu baru",
      pasien: "Pasien Baru",
    };

    try {
      const token = localStorage.getItem("token");
      await apiClient.post("/jadwal/buat", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }); // endpoint POST
      fetchJadwal(); // refresh data
    } catch (err) {
      alert("Gagal menambahkan jadwal.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJadwal();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-4">
        <h2 className="text-xl font-semibold mb-2 sm:mb-0">Jadwal Dokter</h2>
        <button
          onClick={tambahJadwal}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Janji Temu
        </button>
      </div>

      {/* Date Picker */}
      <div className="flex justify-center mb-4">
        <DatePicker
          selected={currentDate}
          onChange={(date) => setCurrentDate(date)}
          locale="id"
          dateFormat="EEEE, dd MMMM yyyy"
          className="border rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>

      {/* Jadwal List */}
      {loading ? (
        <p className="text-center py-8">Memuat jadwal...</p>
      ) : jadwalList.length === 0 ? (
        <p className="text-center py-8 text-gray-500">Tidak ada jadwal.</p>
      ) : (
        <div className="space-y-4">
          {jadwalList.map((j, index) => (
            <div
              key={j.id || index}
              className="flex items-center border rounded-md p-4 shadow-sm hover:bg-gray-50"
            >
              <div className="text-sm font-semibold text-gray-700 w-20 flex-shrink-0">
                {new Date(j.waktu).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="flex-1 ml-4 text-gray-800">
                {j.deskripsi} ({j.pasien})
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
