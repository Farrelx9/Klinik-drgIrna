import React, { useState } from "react";
import { CalendarIcon, ClockIcon, UserIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { bookJanjiTemu } from "../redux/actions/janjiTemuActions";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

// 💡 Tambahkan ToastContainer
import { ToastContainer, toast } from "react-toastify";

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
  const { id_janji, tanggal_waktu, dokter } = appointment;
  const { date, time } = formatDate(tanggal_waktu);

  const [modalOpen, setModalOpen] = useState(false);
  const [keluhan, setKeluhan] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Ambil data pasien dari localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const id_pasien = user?.pasien?.id_pasien;

  // Validasi ID Pasien
  if (!id_pasien) {
    toast.error(
      "Anda harus melengkapi profil terlebih dahulu, baru bisas melakukan booking janji temu :)."
    );
    // navigate("/profile");
    return null;
  }

  const handleBook = async () => {
    // Validasi Keluhan
    if (!keluhan.trim()) {
      toast.error("Keluhan harus diisi yaa!");
      return;
    }

    // Validasi ID Janji Temu
    if (!id_janji) {
      toast.error("Jadwal janji temu tidak valid!.");
      return;
    }

    setLoading(true);

    try {
      // Dispatch action booking janji temu
      await dispatch(bookJanjiTemu({ id_janji, id_pasien, keluhan }));
      setTimeout(() => {
        toast.success("Berhasil memesan janji temu!");
      }, 1000);
      setModalOpen(false);
    } catch (err) {
      toast.error(
        err.message || "Gagal memesan janji temu. Silakan coba lagi."
      );
      console.error("Booking error:", err);
    } finally {
      setLoading(false);
    }
  };
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
        onClick={() => setModalOpen(true)}
        className={`w-full py-2 px-4 rounded ${
          isSelected
            ? "bg-green-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        {isSelected ? "✓ Terpilih" : "Pilih Jadwal"}
      </button>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">Isi Keluhan Anda</h2>
            <textarea
              value={keluhan}
              onChange={(e) => setKeluhan(e.target.value)}
              placeholder="Tuliskan keluhan atau gejala yang dialami..."
              className="w-full border border-gray-300 rounded-md p-3 mb-4"
              rows={4}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setModalOpen(false)}
                disabled={loading}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleBook}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Memproses..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        closeButton
      />
    </div>
  );
};

export default JadwalCard;
