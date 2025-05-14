"use client";
import {
  Calendar,
  ClipboardList,
  DollarSign,
  FileText,
  LayoutDashboard,
  LogIn,
  Menu,
  MessageSquare,
  Settings,
  SmileIcon as Tooth,
  UserPlus,
  Users,
} from "lucide-react";

export default function Sidebar({
  activeTab,
  handleTabChange,
  isSidebarOpen,
  toggleSidebar,
}) {
  return (
    <div
      className={`hidden md:block bg-white shadow-lg ${
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
          onClick={toggleSidebar}
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
                handleTabChange("dashboard");
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
                handleTabChange("appointments");
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
                handleTabChange("users");
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
                handleTabChange("chat");
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
                handleTabChange("medical");
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
  );
}
