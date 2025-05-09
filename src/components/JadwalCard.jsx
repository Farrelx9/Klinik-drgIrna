import React from "react";
import { CalendarIcon, ClockIcon, UserIcon } from "lucide-react";

const formatDate = (isoString) => {
  const date = new Date(isoString);
  const options = { day: "numeric", month: "long", year: "numeric" };
  const formattedDate = date.toLocaleDateString("id-ID", options);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return {
    date: formattedDate,
    time: `${hours}:${minutes}`,
  };
};

const JadwalCard = ({ appointment, onSelect, isSelected }) => {
  const { tanggal_waktu, dokter } = appointment;
  const { date, time } = formatDate(tanggal_waktu);

  return (
    <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200 hover:border-blue-400 transition-all">
      {/* Tanggal */}
      <div className="flex items-center gap-3 mb-3">
        <CalendarIcon className="w-6 h-6 text-gray-500" />
        <span className="font-semibold text-gray-800">{date}</span>
      </div>

      {/* Waktu */}
      <div className="flex items-center gap-3 mb-3">
        <ClockIcon className="w-6 h-6 text-gray-500" />
        <div>
          <p>{time} WIB</p>
          <p className="text-sm text-gray-500">Durasi 1 jam</p>
        </div>
      </div>

      {/* Dokter */}
      <div className="flex items-center gap-3 mb-3">
        <UserIcon className="w-6 h-6 text-gray-500" />
        <div>
          <p>{dokter}</p>
          <span className="text-xs text-green-500">Tersedia</span>
        </div>
      </div>

      {/* Tombol Pilih Jadwal */}
      <button
        onClick={() => onSelect(appointment.id_janji)}
        className={`w-full py-2 px-4 rounded ${
          isSelected
            ? "bg-green-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        {isSelected ? "✓ Terpilih" : "Pilih Jadwal"}
      </button>
    </div>
  );
};

export default JadwalCard;
