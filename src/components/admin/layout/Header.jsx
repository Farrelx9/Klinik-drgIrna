"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Bell, User, UserCircle } from "lucide-react";

export default function Header({
  activeTab,
  showProfileMenu,
  setShowProfileMenu,
  handleLogout,
}) {
  // Ambil role dari Redux state
  // Sesuaikan path state sesuai struktur Redux Anda, contoh: state.authAdmin.role
  const userRole = useSelector((state) => state.authAdmin.role); // <-- Sesuaikan path selector di sini
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Tentukan teks yang akan ditampilkan hanya berdasarkan role
  const displayName =
    userRole === "admin"
      ? `Admin`
      : userRole === "dokter"
      ? `drg.Irna`
      : "Pengguna"; // Default jika role tidak dikenali

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest(".profile-menu-container")) {
        setShowProfileMenu(false);
      }
      if (showLogoutConfirm && !event.target.closest(".logout-confirm-modal")) {
        setShowLogoutConfirm(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileMenu, setShowProfileMenu, showLogoutConfirm]);

  const confirmLogout = () => {
    setShowProfileMenu(false);
    setShowLogoutConfirm(true);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const proceedLogout = () => {
    setShowLogoutConfirm(false);
    handleLogout();
  };

  return (
    <header className="hidden md:flex bg-white shadow-sm p-4 justify-between items-center font-poppins">
      <h1 className="text-xl font-semibold">
        {activeTab === "dashboard" && "Dashboard Admin"}
        {activeTab === "appointments" && "Manajemen Janji Temu"}
        {activeTab === "users" && "Data Pasien"}
        {activeTab === "chat" && "Konsultasi Chat"}
        {activeTab === "medical" && "Rekam Medis"}
      </h1>
      <div className="flex items-center space-x-4">
        <div className="flex items-center relative profile-menu-container gap-4">
          {/* Notification Bell */}
          <button className="p-1 rounded-full text-gray-600 hover:bg-gray-200 focus:outline-none">
            <Bell className="h-5 w-5" />
          </button>

          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <User className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">{displayName}</span>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border">
              <a
                href="#"
                className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                onClick={(e) => {
                  e.preventDefault();
                  confirmLogout();
                }}
              >
                Logout
              </a>
            </div>
          )}
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-80 logout-confirm-modal">
            <h3 className="text-lg font-semibold mb-4">Konfirmasi Logout</h3>
            <p className="text-sm text-gray-600 mb-6">
              Apakah Anda yakin ingin keluar dari akun ini?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                onClick={proceedLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
