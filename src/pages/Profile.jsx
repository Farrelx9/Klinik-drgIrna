import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import {
  FaUser,
  FaCalendarAlt,
  FaHistory,
  FaCog,
  FaEdit,
} from "react-icons/fa";
import { fetchProfile } from "../redux/actions/authActions";

export default function Profile() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("personal");
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Sample appointment history
  const appointmentHistory = [
    {
      id: 1,
      date: "15 Maret 2024",
      time: "10:00 WIB",
      service: "Pemeriksaan Gigi",
      status: "Selesai",
    },
    {
      id: 2,
      date: "20 Maret 2024",
      time: "14:00 WIB",
      service: "Pembersihan Karang Gigi",
      status: "Dijadwalkan",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-blue-500 text-xl">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-red-500 text-xl">{error}</span>
      </div>
    );
  }

  // Pastikan user ada sebelum render
  if (!user || !user.user) {
    return null;
  }

  const profile = user.user; // karena backend Anda return { user: { ... } }

  return (
    <div className="min-h-screen bg-gray-100 ">
      <Navbar />
      <div className="container mx-auto px-4 pt-16">
        <div className="max-w-4xl mx-auto py-5">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                <FaUser className="text-4xl text-blue-600" />
              </div>
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-gray-800">
                  {profile.nama}
                </h1>
                <p className="text-gray-600">{profile.email}</p>
                <button className="mt-2 flex items-center text-blue-600 hover:text-blue-700">
                  <FaEdit className="mr-1" />
                  Edit Profil
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="flex border-b">
              <button
                className={`px-6 py-3 font-medium ${
                  activeTab === "personal"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                onClick={() => setActiveTab("personal")}
              >
                <FaUser className="inline mr-2" />
                Informasi Pribadi
              </button>
              <button
                className={`px-6 py-3 font-medium ${
                  activeTab === "appointments"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                onClick={() => setActiveTab("appointments")}
              >
                <FaCalendarAlt className="inline mr-2" />
                Janji Temu
              </button>
              <button
                className={`px-6 py-3 font-medium ${
                  activeTab === "history"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                onClick={() => setActiveTab("history")}
              >
                <FaHistory className="inline mr-2" />
                Riwayat
              </button>
              <button
                className={`px-6 py-3 font-medium ${
                  activeTab === "settings"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                onClick={() => setActiveTab("settings")}
              >
                <FaCog className="inline mr-2" />
                Pengaturan
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "personal" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nama Lengkap
                    </label>
                    <p className="mt-1 text-gray-900">{profile.nama}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <p className="mt-1 text-gray-900">{profile.username}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <p className="mt-1 text-gray-900">{profile.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nomor Telepon
                    </label>
                    <p className="mt-1 text-gray-900">{profile.noTelp}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Alamat
                    </label>
                    <p className="mt-1 text-gray-900">{profile.alamat}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <p className="mt-1 text-gray-900">{profile.role}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status Verifikasi
                    </label>
                    <p className="mt-1 text-gray-900">
                      {profile.is_verified
                        ? "Terverifikasi"
                        : "Belum Verifikasi"}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "appointments" && (
                <div className="space-y-4">
                  {appointmentHistory.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition duration-200"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {appointment.service}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {appointment.date} - {appointment.time}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            appointment.status === "Selesai"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "history" && (
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    Riwayat konsultasi dan perawatan akan ditampilkan di sini
                  </p>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Notifikasi Email
                      </h3>
                      <p className="text-sm text-gray-600">
                        Terima notifikasi melalui email
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="border rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Ubah Password
                      </h3>
                      {!showPasswordForm && (
                        <button
                          onClick={() => setShowPasswordForm(true)}
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Ubah Password
                        </button>
                      )}
                    </div>
                    {showPasswordForm && (
                      <form className="space-y-4">
                        <div>
                          <label
                            htmlFor="currentPassword"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Password Saat Ini
                          </label>
                          <input
                            type="password"
                            id="currentPassword"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Masukkan password saat ini"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="newPassword"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Password Baru
                          </label>
                          <input
                            type="password"
                            id="newPassword"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Masukkan password baru"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Konfirmasi Password Baru
                          </label>
                          <input
                            type="password"
                            id="confirmPassword"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Konfirmasi password baru"
                          />
                        </div>
                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => setShowPasswordForm(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Simpan Perubahan
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
