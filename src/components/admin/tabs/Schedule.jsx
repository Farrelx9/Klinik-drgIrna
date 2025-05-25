import React, { useState, useEffect } from "react";
import { Plus, X, Save, Calendar } from "lucide-react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { id } from "date-fns/locale";
import apiClient from "../../../config/apiConfig";
import { toast } from "react-toastify";

registerLocale("id", id);

export default function Schedule() {
  const [jadwalList, setJadwalList] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    waktu: "",
    deskripsi: "",
    pasien: "",
  });
  const [editId, setEditId] = useState(null);

  // Array hari dalam seminggu
  const daysOfWeek = [
    { id: 0, name: "Minggu" },
    { id: 1, name: "Senin" },
    { id: 2, name: "Selasa" },
    { id: 3, name: "Rabu" },
    { id: 4, name: "Kamis" },
    { id: 5, name: "Jumat" },
    { id: 6, name: "Sabtu" },
  ];

  // Ambil jadwal berdasarkan tanggal
  const fetchJadwal = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await apiClient.get("/jadwal", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          date: currentDate.toISOString().split("T")[0], // format YYYY-MM-DD
        },
      });
      setJadwalList(res.data);
    } catch (err) {
      console.error("Gagal mengambil jadwal:", err);
      toast.error("Gagal mengambil data jadwal.");
    } finally {
      setLoading(false);
    }
  };

  // Tambah jadwal baru
  const tambahJadwal = async () => {
    if (!formData.waktu || !formData.deskripsi || !formData.pasien) {
      toast.warn("Semua field harus diisi!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await apiClient.post("/jadwal/buat", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchJadwal();
      setIsModalOpen(false);
      setFormData({ waktu: "", deskripsi: "", pasien: "" });
      toast.success("Jadwal berhasil ditambahkan!");
    } catch (err) {
      console.error("Gagal menambahkan jadwal:", err);
      toast.error("Gagal menambahkan jadwal.");
    }
  };

  // Update jadwal
  const updateJadwal = async () => {
    if (!formData.waktu || !formData.deskripsi || !formData.pasien) {
      toast.warn("Semua field harus diisi!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await apiClient.put(`/jadwal/${editId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchJadwal();
      setIsModalOpen(false);
      setFormData({ waktu: "", deskripsi: "", pasien: "" });
      setEditId(null);
      toast.info("Jadwal berhasil diperbarui!");
    } catch (err) {
      console.error("Gagal memperbarui jadwal:", err);
      toast.error("Gagal memperbarui jadwal.");
    }
  };

  // Hapus jadwal
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await apiClient.delete(`/jadwal/delete/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchJadwal();
      setIsDeleteModalOpen(false);
      setDeleteId(null);
      toast.warning("Jadwal berhasil dihapus.");
    } catch (err) {
      console.error("Gagal menghapus jadwal:", err);
      toast.error("Gagal menghapus jadwal.");
    }
  };

  // Buka modal delete
  const openDeleteModal = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  // Buka modal edit
  const handleEdit = (jadwal) => {
    setFormData({
      waktu: jadwal.waktu,
      deskripsi: jadwal.deskripsi,
      pasien: jadwal.pasien,
    });
    setEditId(jadwal.id);
    setIsModalOpen(true);
  };

  // Handle input change
  const handleChangeInput = (e) => {
    const { name, value } = e.target;

    if (name === "waktu") {
      const isoValue = value ? new Date(value).toISOString() : "";
      setFormData((prev) => ({ ...prev, [name]: isoValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Buka modal tambah
  const handleOpenModal = () => {
    setFormData((prev) => ({
      ...prev,
      waktu: new Date().toISOString(),
    }));
    setIsModalOpen(true);
  };

  // Tutup modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ waktu: "", deskripsi: "", pasien: "" });
    setEditId(null);
  };

  // Fungsi untuk mendapatkan tanggal berdasarkan hari yang dipilih
  const getDateByDay = (dayId) => {
    const today = new Date();
    const currentDay = today.getDay();
    const diff = dayId - currentDay;
    const newDate = new Date(today);
    newDate.setDate(today.getDate() + diff);
    return newDate;
  };

  useEffect(() => {
    setLoading(true);
    fetchJadwal();
  }, [currentDate]);

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6 font-poppins">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-4">
          <h2 className="text-xl font-semibold mb-2 sm:mb-0">Jadwal Dokter</h2>
          <button
            onClick={handleOpenModal}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tambah Janji Temu
          </button>
        </div>

        {/* Quick Day Selection */}
        <div className="flex flex-wrap gap-2 mb-4">
          {daysOfWeek.map((day) => (
            <button
              key={day.id}
              onClick={() => setCurrentDate(getDateByDay(day.id))}
              className={`px-3 py-1 rounded-full text-sm ${
                currentDate.getDay() === day.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {day.name}
            </button>
          ))}
        </div>

        {/* Date Picker */}
        <div className="flex justify-center mb-4">
          <div className="relative w-full max-w-xs">
            <DatePicker
              selected={currentDate}
              onChange={(date) => setCurrentDate(date)}
              locale="id"
              dateFormat="EEEE, dd MMMM yyyy"
              className="border rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring focus:border-blue-500 w-full text-center pl-10"
            />
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Jadwal List */}
        {loading ? (
          <p className="text-center py-8">Memuat jadwal...</p>
        ) : jadwalList.length === 0 ? (
          <p className="text-center py-8 text-gray-500">Tidak ada jadwal.</p>
        ) : (
          <div className="space-y-4">
            {jadwalList.map((j) => (
              <div
                key={j.id}
                className="flex items-center border rounded-md p-4 shadow-sm hover:bg-gray-50"
              >
                <div className="text-sm font-semibold text-gray-700 w-20 flex-shrink-0">
                  {new Date(j.waktu).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <div className="flex-1 ml-4 text-gray-800 font-semibold">
                  {j.deskripsi} ({j.pasien})
                </div>

                {/* Tombol Aksi */}
                <div className="ml-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(j)}
                    className="text-yellow-500 hover:text-yellow-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(j.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Tambah/Edit Jadwal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {editId ? "Perbarui Jadwal" : "Tambah Jadwal Baru"}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Waktu
                  </label>
                  <DatePicker
                    selected={formData.waktu ? new Date(formData.waktu) : null}
                    onChange={(date) =>
                      handleChangeInput({
                        target: { name: "waktu", value: date },
                      })
                    }
                    showTimeSelect
                    dateFormat="Pp"
                    locale="id"
                    minTime={new Date().setHours(8, 0, 0, 0)}
                    maxTime={new Date().setHours(22, 0, 0, 0)}
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi
                  </label>
                  <input
                    type="text"
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleChangeInput}
                    placeholder="Pemeriksaan rutin"
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pasien
                  </label>
                  <input
                    type="text"
                    name="pasien"
                    value={formData.pasien}
                    onChange={handleChangeInput}
                    placeholder="Nama Pasien"
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  onClick={editId ? updateJadwal : tambahJadwal}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-1"
                >
                  <Save size={16} /> {editId ? "Perbarui" : "Simpan"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Konfirmasi Hapus */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h3>
                <p className="text-gray-600 mb-6">
                  Apakah Anda yakin ingin menghapus jadwal ini?
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
