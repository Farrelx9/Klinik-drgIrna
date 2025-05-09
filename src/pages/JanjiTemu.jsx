import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import JadwalCard from "../components/JadwalCard";
import { fetchJanjiTemu } from "../redux/actions/janjiTemuActions";
import Navbar from "../components/Navbar";

const JanjiTemu = () => {
  const dispatch = useDispatch();

  const janjiTemu = useSelector((state) => state.janjiTemu);

  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    dispatch(fetchJanjiTemu({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleSelect = (id) => {
    setSelectedAppointment(id === selectedAppointment ? null : id);
  };

  // Fallback data jika janjiTemu belum ada
  const {
    list = [],
    meta = {
      totalItems: 0,
      itemCount: 10,
      totalPages: 1,
      currentPage: 1,
      hasNextPage: false,
      hasPrevPage: false,
    },
    loading = false,
    error = null,
  } = janjiTemu || {};

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6 py-20">
        <h2 className="text-2xl font-bold mb-6">Jadwal Tersedia</h2>

        <div className="space-y-5">
          {list.length > 0 ? (
            list.map((appointment) => (
              <JadwalCard
                key={appointment.id_janji}
                appointment={appointment}
                onSelect={handleSelect}
                isSelected={selectedAppointment === appointment.id_janji}
              />
            ))
          ) : (
            <p>Tidak ada jadwal tersedia.</p>
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

          {/* Halaman saat ini */}
          <span className="col-span-1 rounded-md bg-gray-100 px-3 py-1 text-sm text-center font-medium self-center">
            Halaman {meta.currentPage}
          </span>

          {/* Tombol Selanjutnya */}
          <button
            disabled={!meta.hasNextPage}
            onClick={() =>
              dispatch(
                fetchJanjiTemu({
                  page: meta.currentPage + 1,
                  limit: meta.itemCount,
                })
              )
            }
            className="flex items-center justify-between gap-2 rounded-md border border-gray-300 px-3 py-1 text-sm text font-medium transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
          >
            <span className="text-end">Selanjutnya</span>
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
