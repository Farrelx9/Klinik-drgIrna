"use client";

import {
  Calendar,
  ClipboardList,
  LayoutDashboard,
  MessageSquare,
  ScrollText,
  Users,
} from "lucide-react";

export default function MobileMenu({ activeTab, handleTabChange }) {
  return (
    <div className="p-4 font-poppins">
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
            className={`flex items-center space-x-2 p-3 rounded-md ${
              activeTab === "jadwaldokter"
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
            }`}
            onClick={(e) => {
              e.preventDefault();
              handleTabChange("jadwaldokter");
            }}
          >
            <ScrollText className="h-5 w-5" />
            <span>Jadwal Dokter</span>
          </a>
          <a
            href="#"
            className={`flex items-center space-x-2 p-3 rounded-md ${
              activeTab === "jenisTindakan"
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
            }`}
            onClick={(e) => {
              e.preventDefault();
              handleTabChange("jenisTindakan");
            }}
          >
            <ScrollText className="h-5 w-5" />
            <span>Jenis Tindakan</span>
          </a>
          <a
            href="#"
            className={`flex items-center space-x-2 p-3 rounded-md ${
              activeTab === "rekapPembayaran"
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
            }`}
            onClick={(e) => {
              e.preventDefault();
              handleTabChange("rekapPembayaran");
            }}
          >
            <ScrollText className="h-5 w-5" />
            <span>Rekap Pembayaran</span>
          </a>
        </nav>
      </div>
      <div className="mb-6"></div>
    </div>
  );
}
