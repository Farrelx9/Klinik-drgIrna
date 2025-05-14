"use client";

import { Bell, Menu, SmileIcon as Tooth, User, X } from "lucide-react";

export default function MobileHeader({
  showMobileMenu,
  toggleMobileMenu,
  showProfileMenu,
  setShowProfileMenu,
  activeTab,
}) {
  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Tooth className="h-6 w-6 text-blue-500" />
          <span className="text-lg font-bold">Klinik Drg Irna</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative profile-menu-container">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white"
            >
              <User className="h-5 w-5" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
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
        <div className="flex items-center">
          <button className="p-2 rounded-full hover:bg-gray-100 relative">
            <Bell className="h-5 w-5 text-gray-500" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
        </div>
      </div>
    </>
  );
}
