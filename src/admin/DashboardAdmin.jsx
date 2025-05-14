"use client";

import { useState, useEffect } from "react";

// Components
import Sidebar from "../components/admin/layout/Sidebar";
import MobileMenu from "../components/admin/layout/Mobile-Menu";
import Header from "../components/admin/layout/Header";
import MobileHeader from "../components/admin/layout/Mobile-Header";

// Tabs
import DashboardTab from "../components/admin/tabs/Dashboard-Tab";
import AppointmentsTab from "../components/admin/tabs/Appointment-Tab";
import UsersTab from "../components/admin/tabs/User-Tab";
import ChatTab from "../components/admin/tabs/Chat-Tab";
import MedicalTab from "../components/admin/tabs/Dashboard-Tab";
import { useNavigate } from "react-router-dom";

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
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  // Check if screen is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Handle mobile menu toggle
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    if (isMobile) {
      setShowMobileMenu(false);
    }
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (isMobile) {
      setShowMobileMenu(false);
    }
  };

  // Fungsi Logout
  const handleLogout = () => {
    // Hapus token dari localStorage
    localStorage.removeItem("token");

    // Redirect ke halaman login
    navigate("/login-admin"); // Ganti dengan path login Anda
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Header */}
      <MobileHeader
        showMobileMenu={showMobileMenu}
        toggleMobileMenu={toggleMobileMenu}
        showProfileMenu={showProfileMenu}
        setShowProfileMenu={setShowProfileMenu}
        activeTab={activeTab}
      />

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 bg-white z-50 pt-16 overflow-y-auto">
          <MobileMenu activeTab={activeTab} handleTabChange={handleTabChange} />
        </div>
      )}

      {/* Sidebar - Hidden on mobile, visible on tablet/desktop */}
      <Sidebar
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - Hidden on mobile */}
        <Header
          activeTab={activeTab}
          showProfileMenu={showProfileMenu}
          setShowProfileMenu={setShowProfileMenu}
          handleLogout={handleLogout} // Tambahkan prop handleLogout
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {/* Dashboard Content */}
          {activeTab === "dashboard" && <DashboardTab />}

          {/* Janji Temu Content */}
          {activeTab === "appointments" && <AppointmentsTab />}

          {/* Data Pasien Content */}
          {activeTab === "users" && <UsersTab />}

          {/* Konsultasi Chat Content */}
          {activeTab === "chat" && <ChatTab isMobile={isMobile} />}

          {/* Rekam Medis Content */}
          {activeTab === "medical" && <MedicalTab />}
        </main>
      </div>
    </div>
  );
}
