"use client";

import { useState } from "react";
import {
  Bell,
  Calendar,
  ClipboardList,
  DollarSign,
  FileText,
  Home,
  LayoutDashboard,
  LogIn,
  Menu,
  MessageSquare,
  Settings,
  SmileIcon as Tooth,
  User,
  UserPlus,
  Users,
} from "lucide-react";

// Dummy data untuk contoh
const dummyUsers = [
  {
    id: 1,
    name: "Budi Santoso",
    email: "budi@example.com",
    phone: "081234567890",
    lastVisit: "15 Mei 2024",
  },
  {
    id: 2,
    name: "Siti Rahayu",
    email: "siti@example.com",
    phone: "081234567891",
    lastVisit: "10 Mei 2024",
  },
  {
    id: 3,
    name: "Ahmad Fauzi",
    email: "ahmad@example.com",
    phone: "081234567892",
    lastVisit: "5 Mei 2024",
  },
  {
    id: 4,
    name: "Dewi Lestari",
    email: "dewi@example.com",
    phone: "081234567893",
    lastVisit: "1 Mei 2024",
  },
];

const dummyAppointments = [
  {
    id: 1,
    patient: "Budi Santoso",
    service: "Pemeriksaan Gigi",
    date: "20 Mei 2024",
    time: "09:00",
    status: "Confirmed",
  },
  {
    id: 2,
    patient: "Siti Rahayu",
    service: "Pembersihan Karang Gigi",
    date: "21 Mei 2024",
    time: "10:30",
    status: "Pending",
  },
  {
    id: 3,
    patient: "Ahmad Fauzi",
    service: "Tambal Gigi",
    date: "22 Mei 2024",
    time: "13:00",
    status: "Confirmed",
  },
  {
    id: 4,
    patient: "Dewi Lestari",
    service: "Konsultasi Ortodonti",
    date: "23 Mei 2024",
    time: "15:30",
    status: "Cancelled",
  },
];

const dummyMedicalRecords = [
  {
    id: 1,
    patient: "Budi Santoso",
    diagnosis: "Karies gigi",
    treatment: "Tambal gigi",
    date: "15 Mei 2024",
    doctor: "drg. Irna",
  },
  {
    id: 2,
    patient: "Siti Rahayu",
    diagnosis: "Gingivitis",
    treatment: "Scaling",
    date: "10 Mei 2024",
    doctor: "drg. Andi",
  },
  {
    id: 3,
    patient: "Ahmad Fauzi",
    diagnosis: "Pulpitis",
    treatment: "Perawatan saluran akar",
    date: "5 Mei 2024",
    doctor: "drg. Irna",
  },
  {
    id: 4,
    patient: "Dewi Lestari",
    diagnosis: "Maloklusi",
    treatment: "Konsultasi ortodonti",
    date: "1 Mei 2024",
    doctor: "drg. Andi",
  },
];

const dummyChats = [
  {
    id: 1,
    patient: "Budi Santoso",
    lastMessage: "Dok, gigi saya masih terasa nyeri setelah perawatan",
    time: "10:15",
    unread: true,
  },
  {
    id: 2,
    patient: "Siti Rahayu",
    lastMessage: "Terima kasih dokter atas sarannya",
    time: "Kemarin",
    unread: false,
  },
  {
    id: 3,
    patient: "Ahmad Fauzi",
    lastMessage: "Apakah saya perlu kontrol minggu depan?",
    time: "Kemarin",
    unread: true,
  },
  {
    id: 4,
    patient: "Dewi Lestari",
    lastMessage: "Baik dok, saya akan datang sesuai jadwal",
    time: "3 hari lalu",
    unread: false,
  },
];

export default function DashboardAdmin() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-white shadow-lg ${
          isSidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Tooth className="h-8 w-8 text-blue-500" />
            {isSidebarOpen && (
              <span className="text-xl font-bold">Klinik Drg Irna</span>
            )}
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-6">
            <div className="text-xs font-semibold text-gray-400 mb-2">
              {isSidebarOpen ? "MENU UTAMA" : ""}
            </div>
            <nav className="space-y-1">
              <a
                href="#"
                className={`flex items-center space-x-2 p-2 rounded-md ${
                  activeTab === "dashboard"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("dashboard");
                }}
              >
                <LayoutDashboard className="h-5 w-5" />
                {isSidebarOpen && <span>Dashboard</span>}
              </a>
              <a
                href="#"
                className={`flex items-center space-x-2 p-2 rounded-md ${
                  activeTab === "appointments"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("appointments");
                }}
              >
                <Calendar className="h-5 w-5" />
                {isSidebarOpen && <span>Janji Temu</span>}
              </a>
              <a
                href="#"
                className={`flex items-center space-x-2 p-2 rounded-md ${
                  activeTab === "users"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("users");
                }}
              >
                <Users className="h-5 w-5" />
                {isSidebarOpen && <span>Data Pasien</span>}
              </a>
              <a
                href="#"
                className={`flex items-center space-x-2 p-2 rounded-md ${
                  activeTab === "chat"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("chat");
                }}
              >
                <MessageSquare className="h-5 w-5" />
                {isSidebarOpen && <span>Konsultasi Chat</span>}
              </a>
              <a
                href="#"
                className={`flex items-center space-x-2 p-2 rounded-md ${
                  activeTab === "medical"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("medical");
                }}
              >
                <ClipboardList className="h-5 w-5" />
                {isSidebarOpen && <span>Rekam Medis</span>}
              </a>
            </nav>
          </div>

          <div className="mb-6">
            <div className="text-xs font-semibold text-gray-400 mb-2">
              {isSidebarOpen ? "ADMINISTRASI" : ""}
            </div>
            <nav className="space-y-1">
              <a
                href="#"
                className="flex items-center space-x-2 p-2 rounded-md text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                onClick={(e) => e.preventDefault()}
              >
                <DollarSign className="h-5 w-5" />
                {isSidebarOpen && <span>Pembayaran</span>}
              </a>
              <a
                href="#"
                className="flex items-center space-x-2 p-2 rounded-md text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                onClick={(e) => e.preventDefault()}
              >
                <FileText className="h-5 w-5" />
                {isSidebarOpen && <span>Laporan</span>}
              </a>
              <a
                href="#"
                className="flex items-center space-x-2 p-2 rounded-md text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                onClick={(e) => e.preventDefault()}
              >
                <Settings className="h-5 w-5" />
                {isSidebarOpen && <span>Pengaturan</span>}
              </a>
            </nav>
          </div>

          <div className="mb-6">
            <div className="text-xs font-semibold text-gray-400 mb-2">
              {isSidebarOpen ? "AKUN" : ""}
            </div>
            <nav className="space-y-1">
              <a
                href="#"
                className="flex items-center space-x-2 p-2 rounded-md text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                onClick={(e) => e.preventDefault()}
              >
                <LogIn className="h-5 w-5" />
                {isSidebarOpen && <span>Login</span>}
              </a>
              <a
                href="#"
                className="flex items-center space-x-2 p-2 rounded-md text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                onClick={(e) => e.preventDefault()}
              >
                <UserPlus className="h-5 w-5" />
                {isSidebarOpen && <span>Register</span>}
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
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
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <User className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium">Admin</span>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Dashboard Content */}
          {activeTab === "dashboard" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Pasien</p>
                      <p className="text-2xl font-bold">248</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Janji Temu Hari Ini
                      </p>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Pesan Belum Dibaca
                      </p>
                      <p className="text-2xl font-bold">8</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Ringkasan Pendapatan */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">
                      Ringkasan Pendapatan
                    </h2>
                    <select className="border rounded-md px-3 py-1 text-sm">
                      <option>Mei 2024</option>
                      <option>April 2024</option>
                      <option>Maret 2024</option>
                    </select>
                  </div>
                  <div className="h-64 flex items-end space-x-2">
                    {[65, 85, 55, 75, 90, 65, 75, 60, 80, 70, 90, 75].map(
                      (height, index) => (
                        <div
                          key={index}
                          className="flex-1 flex flex-col items-center"
                        >
                          <div
                            className="w-full bg-blue-500 rounded-t-sm"
                            style={{ height: `${height}%` }}
                          ></div>
                          <div className="text-xs mt-1">{index + 1}</div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Statistik Tahunan */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">
                    Statistik Tahunan
                  </h2>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-3xl font-bold">Rp 125,750,000</p>
                      <div className="flex items-center text-sm mt-1">
                        <span className="text-green-500 flex items-center">
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 10l7-7m0 0l7 7m-7-7v18"
                            />
                          </svg>
                          +12%
                        </span>
                        <span className="text-gray-500 ml-1">
                          dibanding tahun lalu
                        </span>
                      </div>
                    </div>
                    <div className="w-24 h-24 rounded-full border-8 border-blue-500 border-t-transparent"></div>
                  </div>
                  <div className="flex space-x-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-sm">2023</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                      <span className="text-sm">2024</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Transaksi Terbaru */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">Transaksi Terbaru</h2>
                  </div>
                  <div className="divide-y">
                    {[
                      {
                        time: "09:30",
                        patient: "Budi Santoso",
                        amount: "Rp 385.000",
                      },
                      {
                        time: "10:45",
                        patient: "Siti Rahayu",
                        amount: "Rp 750.000",
                      },
                      {
                        time: "13:15",
                        patient: "Ahmad Fauzi",
                        amount: "Rp 425.000",
                      },
                      {
                        time: "15:00",
                        patient: "Dewi Lestari",
                        amount: "Rp 550.000",
                      },
                    ].map((transaction, index) => (
                      <div key={index} className="p-4 flex items-center">
                        <div className="w-16 text-sm text-gray-500">
                          {transaction.time}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            {transaction.patient}
                          </div>
                          <div className="text-xs text-gray-500">
                            Pembayaran diterima
                          </div>
                        </div>
                        <div className="text-sm font-medium">
                          {transaction.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performa Layanan */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">Performa Layanan</h2>
                  </div>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Layanan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dokter
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Prioritas
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tarif
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[
                        {
                          service: "Pemeriksaan Gigi",
                          doctor: "drg. Irna",
                          priority: "Tinggi",
                          fee: "Rp 150.000",
                        },
                        {
                          service: "Pembersihan Karang Gigi",
                          doctor: "drg. Andi",
                          priority: "Sedang",
                          fee: "Rp 350.000",
                        },
                        {
                          service: "Tambal Gigi",
                          doctor: "drg. Irna",
                          priority: "Rendah",
                          fee: "Rp 200.000",
                        },
                      ].map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.service}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.doctor}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                item.priority === "Tinggi"
                                  ? "bg-red-100 text-red-800"
                                  : item.priority === "Sedang"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {item.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.fee}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Janji Temu Content */}
          {activeTab === "appointments" && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold">Daftar Janji Temu</h2>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Cari pasien..."
                    className="border rounded-md px-3 py-1 text-sm"
                  />
                  <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">
                    + Tambah Janji
                  </button>
                </div>
              </div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pasien
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Layanan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Waktu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dummyAppointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {appointment.patient}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {appointment.service}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {appointment.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {appointment.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            appointment.status === "Confirmed"
                              ? "bg-green-100 text-green-800"
                              : appointment.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button className="text-blue-500 hover:text-blue-700">
                            Edit
                          </button>
                          <button className="text-red-500 hover:text-red-700">
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 border-t flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Menampilkan 1-4 dari 4 janji temu
                </div>
                <div className="flex space-x-2">
                  <button className="border rounded-md px-3 py-1 text-sm">
                    Sebelumnya
                  </button>
                  <button className="border rounded-md px-3 py-1 text-sm bg-blue-500 text-white">
                    1
                  </button>
                  <button className="border rounded-md px-3 py-1 text-sm">
                    Selanjutnya
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Data Pasien Content */}
          {activeTab === "users" && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold">Data Pasien</h2>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Cari pasien..."
                    className="border rounded-md px-3 py-1 text-sm"
                  />
                  <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">
                    + Tambah Pasien
                  </button>
                </div>
              </div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No. Telepon
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kunjungan Terakhir
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dummyUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastVisit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button className="text-blue-500 hover:text-blue-700">
                            Lihat
                          </button>
                          <button className="text-blue-500 hover:text-blue-700">
                            Edit
                          </button>
                          <button className="text-red-500 hover:text-red-700">
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 border-t flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Menampilkan 1-4 dari 4 pasien
                </div>
                <div className="flex space-x-2">
                  <button className="border rounded-md px-3 py-1 text-sm">
                    Sebelumnya
                  </button>
                  <button className="border rounded-md px-3 py-1 text-sm bg-blue-500 text-white">
                    1
                  </button>
                  <button className="border rounded-md px-3 py-1 text-sm">
                    Selanjutnya
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Konsultasi Chat Content */}
          {activeTab === "chat" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold">Daftar Percakapan</h2>
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Cari percakapan..."
                      className="w-full border rounded-md px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div className="overflow-y-auto h-[calc(100vh-16rem)]">
                  {dummyChats.map((chat) => (
                    <div
                      key={chat.id}
                      className="p-4 border-b hover:bg-gray-50 cursor-pointer flex items-center"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium">{chat.patient}</span>
                          <span className="text-xs text-gray-500">
                            {chat.time}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {chat.lastMessage}
                        </div>
                      </div>
                      {chat.unread && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 ml-2"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow overflow-hidden md:col-span-2">
                <div className="p-4 border-b flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">Budi Santoso</div>
                    <div className="text-xs text-gray-500">Online</div>
                  </div>
                </div>
                <div className="p-4 overflow-y-auto h-[calc(100vh-20rem)] space-y-4">
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3 max-w-xs md:max-w-md">
                      <p className="text-sm">
                        Selamat pagi dok, gigi saya masih terasa nyeri setelah
                        perawatan kemarin.
                      </p>
                      <p className="text-xs text-gray-500 mt-1">09:30</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-blue-500 text-white rounded-lg p-3 max-w-xs md:max-w-md">
                      <p className="text-sm">
                        Selamat pagi Pak Budi. Apakah nyerinya terasa
                        terus-menerus atau hanya saat mengunyah?
                      </p>
                      <p className="text-xs text-blue-200 mt-1">09:35</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3 max-w-xs md:max-w-md">
                      <p className="text-sm">
                        Nyerinya terasa saat minum air dingin dok.
                      </p>
                      <p className="text-xs text-gray-500 mt-1">09:40</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-blue-500 text-white rounded-lg p-3 max-w-xs md:max-w-md">
                      <p className="text-sm">
                        Baik, sepertinya gigi Anda sensitif terhadap suhu
                        dingin. Ini normal setelah perawatan. Cobalah untuk
                        menghindari minuman dingin untuk 2-3 hari. Jika nyeri
                        tidak berkurang, silakan datang ke klinik untuk
                        pemeriksaan lebih lanjut.
                      </p>
                      <p className="text-xs text-blue-200 mt-1">09:45</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3 max-w-xs md:max-w-md">
                      <p className="text-sm">
                        Baik dok, terima kasih atas sarannya. Saya akan coba
                        hindari minuman dingin dulu.
                      </p>
                      <p className="text-xs text-gray-500 mt-1">09:50</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-blue-500 text-white rounded-lg p-3 max-w-xs md:max-w-md">
                      <p className="text-sm">
                        Sama-sama Pak Budi. Jangan ragu untuk menghubungi saya
                        jika ada keluhan lain.
                      </p>
                      <p className="text-xs text-blue-200 mt-1">09:55</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Ketik pesan..."
                      className="flex-1 border rounded-md px-3 py-2 text-sm"
                    />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                      Kirim
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rekam Medis Content */}
          {activeTab === "medical" && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold">Rekam Medis Pasien</h2>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Cari rekam medis..."
                    className="border rounded-md px-3 py-1 text-sm"
                  />
                  <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">
                    + Tambah Rekam Medis
                  </button>
                </div>
              </div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pasien
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Diagnosis
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Perawatan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dokter
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dummyMedicalRecords.map((record) => (
                    <tr key={record.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {record.patient}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.diagnosis}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.treatment}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.doctor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button className="text-blue-500 hover:text-blue-700">
                            Lihat
                          </button>
                          <button className="text-blue-500 hover:text-blue-700">
                            Edit
                          </button>
                          <button className="text-red-500 hover:text-red-700">
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 border-t flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Menampilkan 1-4 dari 4 rekam medis
                </div>
                <div className="flex space-x-2">
                  <button className="border rounded-md px-3 py-1 text-sm">
                    Sebelumnya
                  </button>
                  <button className="border rounded-md px-3 py-1 text-sm bg-blue-500 text-white">
                    1
                  </button>
                  <button className="border rounded-md px-3 py-1 text-sm">
                    Selanjutnya
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
