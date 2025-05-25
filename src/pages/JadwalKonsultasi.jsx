import React, { useEffect, useState } from "react";
import JadwalChatCard from "../components/JadwalChatCard";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchJadwalKonsultasi,
  pilihJadwal,
} from "../redux/actions/konsultasiApi";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import { Calendar1Icon } from "lucide-react";

const JadwalKonsultasiPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const konsultasi = useSelector((state) => state.konsultasi);
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [filterDate, setFilterDate] = useState("");

  // Ambil data awal
  useEffect(() => {
    const payload = { page: 1, limit: 5 };
    if (filterDate && isValidDate(filterDate)) {
      payload.tanggal = filterDate;
    }
    dispatch(fetchJadwalKonsultasi(payload));
  }, [dispatch, filterDate]);

  // Fungsi saat pasien klik "Pilih Jadwal"
  const handleSelect = (id_chat) => {
    setSelectedId(id_chat);
    setShowModal(true);
  };

  const confirmSelect = async () => {
    setShowModal(false);
    setLoadingId(selectedId);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const id_pasien = user?.pasien?.id_pasien;

      if (!id_pasien) {
        toast.warn("Anda harus login terlebih dahulu.");
        navigate("/login");
        return;
      }

      // Kirim request ke API
      const response = await dispatch(
        pilihJadwal({ id_jadwal: selectedId, id_pasien })
      );

      // Cek apakah server merespons dengan error
      if (!response.payload || response.payload.status === "rejected") {
        throw new Error(response.payload.message || "Gagal memilih jadwal");
      }

      // Redirect ke pembayaran
      setTimeout(() => {
        navigate(`/pembayaran?id=${selectedId}`);
      }, 1000);
    } catch (error) {
      toast.error("Gagal memilih jadwal. Silakan coba lagi.");
      console.error("Error booking jadwal:", error.message || error);
    } finally {
      setLoadingId(null);
    }
  };

  const isValidDate = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  // Helper format tanggal
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const {
    data: list = [],
    meta = {
      totalItems: 0,
      currentPage: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
      itemCount: 5,
    },
    isLoading = false,
    error: apiError = null,
  } = konsultasi || {};

  // Filter berdasarkan tanggal
  const filteredList =
    filterDate && isValidDate(filterDate)
      ? list.filter(
          (item) =>
            item.waktu_mulai &&
            formatDate(item.waktu_mulai) === formatDate(new Date(filterDate))
        )
      : list;

  // Tampilkan toast saat filter dipilih
  useEffect(() => {
    if (filterDate && isValidDate(filterDate)) {
      const selectedDate = new Date(filterDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const timer = setTimeout(() => {
        toast.info(
          `Menampilkan jadwal pada ${selectedDate}. Klik Reset untuk melihat semua.`
        );
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [filterDate]);

  if (isLoading) {
    return <div className="text-center py-20">Memuat jadwal konsultasi...</div>;
  }

  if (apiError) {
    return <div className="text-center text-red-500 py-20">{apiError}</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6 py-20">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Jadwal Konsultasi Tersedia</h2>

          {/* Input Filter Tanggal */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="dateFilter"
              className="text-sm font-medium whitespace-nowrap"
            >
              Cari Berdasarkan Tanggal:
            </label>
            <input
              type="date"
              id="dateFilter"
              value={filterDate}
              onChange={(e) => {
                const val = e.target.value;
                setFilterDate(val);
                dispatch(
                  fetchJadwalKonsultasi({ page: 1, limit: 5, tanggal: val })
                );
              }}
              min={new Date().toISOString().split("T")[0]}
              className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {filterDate && (
              <button
                onClick={() => {
                  setFilterDate("");
                  dispatch(fetchJadwalKonsultasi({ page: 1, limit: 5 }));
                  toast.dismiss();
                  toast.success("Menampilkan ulang semua jadwal.", {
                    autoClose: 3000,
                    closeButton: true,
                    closeOnClick: true,
                  });
                }}
                className="text-sm text-blue-600 hover:underline ml-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Daftar Jadwal */}
        <div className="space-y-5">
          {Array.isArray(filteredList) && filteredList.length > 0 ? (
            filteredList.map((chat) => (
              <JadwalChatCard
                key={chat.id_chat}
                appointment={chat}
                onSelect={handleSelect}
                isSelected={false} // Atur di level induk jika perlu
                loadingId={loadingId}
              />
            ))
          ) : (
            <p className="text-center py-4 text-gray-500">
              {filterDate
                ? "Tidak ada jadwal pada tanggal ini."
                : "Tidak ada jadwal tersedia dalam 1 bulan ke depan."}
            </p>
          )}
        </div>

        {/* Pagination UI */}
        <div className="mt-6 grid grid-cols-3 gap-2">
          <button
            disabled={!meta.hasPrevPage}
            onClick={() =>
              dispatch(
                fetchJadwalKonsultasi({
                  page: meta.currentPage - 1,
                  limit: meta.itemCount,
                  tanggal: filterDate,
                })
              )
            }
            className="flex items-center justify-start gap-2 rounded-md border border-gray-300 px-3 py-1 text-sm font-medium transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
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
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span>Sebelumnya</span>
          </button>

          <span className="col-span-1 rounded-md bg-gray-100 px-3 py-1 text-sm text-center font-medium self-center">
            Halaman {meta.currentPage} dari {meta.totalPages}
          </span>

          <button
            disabled={!meta.hasNextPage}
            onClick={() =>
              dispatch(
                fetchJadwalKonsultasi({
                  page: meta.currentPage + 1,
                  limit: meta.itemCount,
                  tanggal: filterDate,
                })
              )
            }
            className="flex items-center justify-end gap-2 rounded-md border border-gray-300 px-3 py-1 text-sm font-medium transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
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
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Modal Konfirmasi */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-[400px] transform transition-all duration-300 animate-scaleIn">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Calendar1Icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Konfirmasi Pemilihan Jadwal
                </h3>
              </div>

              <p className="mb-8 text-gray-600 leading-relaxed">
                Apakah Anda yakin ingin memilih jadwal ini? Pastikan jadwal yang
                dipilih sesuai dengan waktu yang Anda inginkan.
                dan konsultasi ini akan dikenakan biaya sebesar Rp. 150.000
              </p>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Batal
                </button>
                <button
                  onClick={confirmSelect}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm hover:shadow-md"
                >
                  Lanjutkan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JadwalKonsultasiPage;
