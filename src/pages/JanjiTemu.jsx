import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import JadwalCard from "../components/JadwalCard";
import { fetchJanjiTemu } from "../redux/actions/janjiTemuActions";
import Navbar from "../components/Navbar";

// Untuk toast notification
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JanjiTemu = () => {
  const dispatch = useDispatch();
  const janjiTemu = useSelector((state) => state.janjiTemu);

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [filterDate, setFilterDate] = useState("");

  // Ambil data janji temu default (sudah 1 bulan ke depan via backend)
  useEffect(() => {
    const payload = { page: 1, limit: 5 };
    if (filterDate && isValidDate(filterDate)) {
      payload.tanggal = filterDate;
    }
    dispatch(fetchJanjiTemu(payload));
  }, [dispatch, filterDate]);

  const handleSelect = (id) => {
    setSelectedAppointment(id === selectedAppointment ? null : id);
  };

  // Fallback data
  const {
    list = [],
    meta = {
      totalItems: 0,
      itemCount: 5,
      totalPages: 1,
      currentPage: 1,
      hasNextPage: false,
      hasPrevPage: false,
    },
    loading = false,
    error = null,
  } = janjiTemu || {};

  // Filter data berdasarkan tanggal
  const filteredList = filterDate
    ? list.filter(
        (item) =>
          new Date(item.tanggal_waktu).toISOString().split("T")[0] ===
          filterDate
      )
    : list;

  // Helper: format tanggal menjadi YYYY-MM-DD
  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  // Hari ini + 1 (karena kamu mau minDate mulai dari besok)
  const today = new Date();
  const tomorrow = new Date(today);
  // tomorrow.setDate(tomorrow.getDate() + 1); // Min tanggal = hari ini + 1

  const minDate = formatDate(tomorrow); // Mulai dari besok
  const maxDate = (() => {
    const d = new Date(today);
    d.setMonth(d.getMonth() + 1);
    return formatDate(d);
  })();

  // Validasi apakah filterDate valid
  const isValidDate = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return date.toString() !== "Invalid Date";
  };

  // Tampilkan toast saat filter dipilih
  useEffect(() => {
    if (filterDate && isValidDate(filterDate)) {
      const selectedDate = new Date(filterDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      // ⚠️ Gunakan setTimeout supaya ToastContainer siap dulu
      const timer = setTimeout(() => {
        toast.info(
          `Menampilkan jadwal pada ${selectedDate}. Klik "Reset" untuk melihat semua jadwal.`,
          {
            autoClose: 3000,
            position: "top-right",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            closeButton: true,
            theme: "colored",
          }
        );
      }, 100); // Delay 100ms agar DOM bisa mount dulu

      return () => clearTimeout(timer);
    }
  }, [filterDate]);

  // Jika sedang loading
  if (loading) {
    return (
      <div>
        <Navbar />
        <p className="text-center py-20">Memuat jadwal...</p>
      </div>
    );
  }

  // Jika ada error
  if (error) {
    return (
      <div>
        <Navbar />
        <p className="text-center text-red-500 py-20">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6 py-20">
        {/* Header dengan Judul dan Input Filter Tanggal */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Jadwal Tersedia</h2>

          {/* Input Tanggal untuk Filter */}
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
                setFilterDate(e.target.value);
                dispatch(
                  fetchJanjiTemu({
                    page: 1,
                    limit: 5,
                    tanggal: e.target.value || undefined,
                  })
                );

                // Tambahkan toast info secara langsung
                if (isValidDate(e.target.value)) {
                  const selectedDate = new Date(
                    e.target.value
                  ).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  });
                }
              }}
              min={minDate} // Mulai dari besok
              max={maxDate} // Sampai 1 bulan ke depan
              className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {filterDate && (
              <button
                onClick={() => {
                  setFilterDate("");
                  dispatch(fetchJanjiTemu({ page: 1, limit: 5 }));
                  toast.dismiss(); // Tutup semua toast
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

        {/* Daftar Jadwal Terfilter */}
        <div className="space-y-5">
          {filteredList.length > 0 ? (
            filteredList.map((appointment) => (
              <JadwalCard
                key={appointment.id_janji}
                appointment={appointment}
                onSelect={handleSelect}
                isSelected={selectedAppointment === appointment.id_janji}
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
          {/* Tombol Sebelumnya */}
          <button
            disabled={!meta.hasPrevPage}
            onClick={() =>
              dispatch(
                fetchJanjiTemu({
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
              className="h-4 w-4"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span>Sebelumnya</span>
          </button>

          {/* Halaman Saat Ini */}
          <span className="col-span-1 rounded-md bg-gray-100 px-3 py-1 text-sm text-center font-medium self-center">
            Halaman {meta.currentPage} dari {meta.totalPages}
          </span>

          {/* Tombol Selanjutnya */}
          <button
            disabled={!meta.hasNextPage}
            onClick={() =>
              dispatch(
                fetchJanjiTemu({
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
              className="h-4 w-4 ml-auto"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default JanjiTemu;
