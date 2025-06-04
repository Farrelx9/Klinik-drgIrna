"use client";

import { Menu, SmileIcon as Tooth, User, X } from "lucide-react";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import LogoKlinik from "../../../assets/images/LogoKlinik.png";
export default function MobileHeader({
  showMobileMenu,
  toggleMobileMenu,
  showProfileMenu,
  setShowProfileMenu,
  activeTab,
  handleLogout,
}) {
  const userRole = useSelector((state) => state.authAdmin.role);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const displayName =
    userRole === "admin"
      ? `Admin`
      : userRole === "dokter"
      ? `drg.Irna`
      : "Pengguna";

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
    <>
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-sm p-4 flex justify-between items-center font-poppins">
        <div className="flex items-center space-x-2">
          <img src={LogoKlinik} alt="Logo Klinik" className="h-6 w-auto" />
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative profile-menu-container flex items-center space-x-2">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white"
            >
              <User className="h-5 w-5" />
            </button>
            <span className="text-sm font-medium">{displayName}</span>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border top-full">
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
          <button
            onClick={toggleMobileMenu}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            {showMobileMenu ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Tab Title */}
      <div className="md:hidden bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">
          {activeTab === "dashboard" && "Dashboard Admin"}
          {activeTab === "appointments" && "Manajemen Janji Temu"}
          {activeTab === "users" && "Data Pasien"}
          {activeTab === "chat" && "Konsultasi Chat"}
          {activeTab === "medical" && "Rekam Medis"}
        </h1>
        <div className="flex items-center"></div>
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
    </>
  );
}
