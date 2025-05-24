import React, { useState } from "react";
import { Plus } from "lucide-react"; // Keep Plus icon

// Import react-datepicker
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import the stylesheet

// Import Indonesian locale from date-fns
import { id } from "date-fns/locale";

// Register the Indonesian locale
registerLocale("id", id);

export default function Schedule() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Dummy data for schedule entries
  const dummySchedule = [
    { time: "08:00", description: "Pemeriksaan rutin Pasien A" },
    { time: "09:00", description: "Scaling Pasien B" },
    { time: "10:30", description: "Tambal Gigi Pasien C" },
    { time: "13:00", description: "Konsultasi Pasien D" },
    { time: "14:30", description: "Pencabutan Gigi Pasien E" },
  ];

  // Helper function to format date for display (DatePicker often handles this, but keep for flexibility)
  const formatDate = (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("id-ID", options);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header Jadwal */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-4">
        <h2 className="text-xl font-semibold mb-2 sm:mb-0">Jadwal Dokter</h2>
        {/* Tombol Tambah Janji Temu (Dummy) */}
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
          onClick={() => alert("Fitur tambah janji temu akan datang!")}
        >
          <Plus className="w-4 h-4" />
          Tambah Janji Temu
        </button>
      </div>

      {/* Kontrol Navigasi Tanggal - Diganti Date Picker */}
      <div className="flex justify-center mb-4">
        <DatePicker
          selected={currentDate}
          onChange={(date) => setCurrentDate(date)}
          dateFormat="EEEE, dd MMMM yyyy"
          locale="id" // Set locale to Indonesian
          className="border rounded-md px-3 py-2 text-gray-700 leading-tight focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Daftar Jadwal Harian */}
      <div className="space-y-4">
        {dummySchedule.length > 0 ? (
          dummySchedule.map((entry, index) => (
            <div
              key={index}
              className="flex items-center border rounded-md p-4 shadow-sm hover:bg-gray-50"
            >
              <div className="text-sm font-semibold text-gray-700 w-20 flex-shrink-0">
                {entry.time}
              </div>
              <div className="flex-1 ml-4 text-gray-800">
                {entry.description}
              </div>
              {/* Anda bisa tambahkan tombol aksi di sini (Edit/Hapus) */}
              <div className="ml-4 flex-shrink-0">
                {/* <button className="text-blue-500 hover:text-blue-700 text-sm mr-2">Edit</button>
                                <button className="text-red-500 hover:text-red-700 text-sm">Hapus</button> */}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 p-8">
            Tidak ada jadwal untuk tanggal ini.
          </div>
        )}
      </div>
    </div>
  );
}
