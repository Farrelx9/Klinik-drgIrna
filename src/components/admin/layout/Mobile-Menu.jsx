"use client";

import {
  Calendar,
  ClipboardList,
  DollarSign,
  FileText,
  LayoutDashboard,
  LogIn,
  MessageSquare,
  Settings,
  UserPlus,
  Users,
} from "lucide-react";

export default function MobileMenu({ activeTab, handleTabChange }) {
  return (
    <div className="p-4">
      <div className="mb-6">
        <div className="text-xs font-semibold text-gray-400 mb-2">
          MENU UTAMA
        </div>
        <nav className="space-y-1">
          <a
            href="#"
            className={`flex items-center space-x-2 p-3 rounded-md ${
              activeTab === "dashboard"
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
            }`}
            onClick={(e) => {
              e.preventDefault();
              handleTabChange("dashboard");
            }}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </a>
          <a
            href="#"
            className={`flex items-center space-x-2 p-3 rounded-md ${
              activeTab === "appointments"
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
            }`}
            onClick={(e) => {
              e.preventDefault();
              handleTabChange("appointments");
            }}
          >
            <Calendar className="h-5 w-5" />
            <span>Janji Temu</span>
          </a>
          <a
            href="#"
            className={`flex items-center space-x-2 p-3 rounded-md ${
              activeTab === "users"
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
            }`}
            onClick={(e) => {
              e.preventDefault();
              handleTabChange("users");
            }}
          >
            <Users className="h-5 w-5" />
            <span>Data Pasien</span>
          </a>
          <a
            href="#"
            className={`flex items-center space-x-2 p-3 rounded-md ${
              activeTab === "chat"
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
            }`}
            onClick={(e) => {
              e.preventDefault();
              handleTabChange("chat");
            }}
          >
            <MessageSquare className="h-5 w-5" />
            <span>Konsultasi Chat</span>
          </a>
          <a
            href="#"
            className={`flex items-center space-x-2 p-3 rounded-md ${
              activeTab === "medical"
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
            }`}
            onClick={(e) => {
              e.preventDefault();
              handleTabChange("medical");
            }}
          >
            <ClipboardList className="h-5 w-5" />
            <span>Rekam Medis</span>
          </a>
        </nav>
      </div>
      <div className="mb-6">
        <div className="text-xs font-semibold text-gray-400 mb-2">
          ADMINISTRASI
        </div>
        <nav className="space-y-1">
          <a
            href="#"
            className="flex items-center space-x-2 p-3 rounded-md text-gray-600 hover:bg-blue-50 hover:text-blue-600"
            onClick={(e) => e.preventDefault()}
          >
            <DollarSign className="h-5 w-5" />
            <span>Pembayaran</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-2 p-3 rounded-md text-gray-600 hover:bg-blue-50 hover:text-blue-600"
            onClick={(e) => e.preventDefault()}
          >
            <FileText className="h-5 w-5" />
            <span>Laporan</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-2 p-3 rounded-md text-gray-600 hover:bg-blue-50 hover:text-blue-600"
            onClick={(e) => e.preventDefault()}
          >
            <Settings className="h-5 w-5" />
            <span>Pengaturan</span>
          </a>
        </nav>
      </div>
      <div className="mb-6">
        <div className="text-xs font-semibold text-gray-400 mb-2">AKUN</div>
        <nav className="space-y-1">
          <a
            href="#"
            className="flex items-center space-x-2 p-3 rounded-md text-gray-600 hover:bg-blue-50 hover:text-blue-600"
            onClick={(e) => e.preventDefault()}
          >
            <LogIn className="h-5 w-5" />
            <span>Login</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-2 p-3 rounded-md text-gray-600 hover:bg-blue-50 hover:text-blue-600"
            onClick={(e) => e.preventDefault()}
          >
            <UserPlus className="h-5 w-5" />
            <span>Register</span>
          </a>
        </nav>
      </div>
    </div>
  );
}
