import React from "react";
import { CalendarIcon, ClockIcon } from "lucide-react";

// Helper format tanggal
const formatDate = (isoString) => {
  const date = new Date(isoString);

  if (isNaN(date.getTime())) {
    console.error("Invalid Date:", isoString);
    return { date: "Tanggal Tidak Valid", time: "NaN:NaN" };
  }

  const options = { day: "numeric", month: "long", year: "numeric" };
  const formattedDate = date.toLocaleDateString("id-ID", options);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return {
    date: formattedDate,
    time: `${hours}:${minutes}`,
  };
};

const JadwalChatCard = ({ appointment, onSelect, isSelected, loadingId }) => {
  // Validasi appointment
  if (!appointment || !appointment.id_chat) {
    return null;
  }

  const { id_chat, waktu_mulai, status } = appointment;
  const formatted = formatDate(waktu_mulai);

  const handleClick = () => {
    if (status === "dibayar") {
      return;
    }

    if (typeof onSelect === "function") {
      onSelect(id_chat);
    } else {
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:border-blue-400 hover:shadow-xl transition-all duration-300">
      {/* Informasi Jadwal */}
      <div className="flex flex-col gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <CalendarIcon className="w-5 h-5 text-blue-500" />
          <p className="text-gray-700 font-medium">{formatted.date}</p>
        </div>
        <div className="flex items-center gap-2.5">
          <ClockIcon className="w-5 h-5 text-blue-500" />
          <p className="text-gray-700 font-medium">{formatted.time} WIB</p>
        </div>
      </div>

      {/* Tombol Pilih Jadwal */}
      <button
        onClick={handleClick}
        disabled={status === "dibayar" || loadingId === id_chat}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${
          loadingId === id_chat
            ? "bg-gray-100 text-gray-500 cursor-wait"
            : isSelected
            ? "bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-md"
            : "bg-blue-50 text-blue-600 hover:bg-blue-100 shadow-sm hover:shadow-md"
        } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none`}
      >
        {loadingId === id_chat
          ? "Memproses..."
          : isSelected
          ? "✓ Terpilih"
          : "Pilih Jadwal"}
      </button>
    </div>
  );
};

export default JadwalChatCard;
