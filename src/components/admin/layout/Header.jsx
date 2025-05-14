"use client";

import { Bell, User } from "lucide-react";
import { useEffect } from "react";

export default function Header({
  activeTab,
  showProfileMenu,
  setShowProfileMenu,
  handleLogout, // Terima prop handleLogout
}) {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest(".profile-menu-container")) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileMenu, setShowProfileMenu]);

  return (
    <header className="hidden md:flex bg-white shadow-sm p-4 justify-between items-center">
      <h1 className="text-xl font-semibold">
        {activeTab === "dashboard" && "Dashboard Admin"}
        {activeTab === "appointments" && "Manajemen Janji Temu"}
        {activeTab === "users" && "Data Pasien"}
        {activeTab === "chat" && "Konsultasi Chat"}
        {activeTab === "medical" && "Rekam Medis"}
      </h1>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100 relative">
          <Bell className="h-5 w-5 text-gray-500" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        </button>
        <div className="relative profile-menu-container">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <User className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">Admin</span>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border">
              <a
                href="#"
                className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                onClick={handleLogout}
              >
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
