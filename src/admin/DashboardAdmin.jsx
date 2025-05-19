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
import MedicalTab from "../components/admin/tabs/Medical-Tab";
import JenisTindakan from "../components/admin/tabs/Jenis-Tindakan";
import { useNavigate } from "react-router-dom";

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

          {/* Jenis Tindakan Content */}
          {activeTab === "jenisTindakan" && <JenisTindakan />}

          {/* Jenis Tindakan Content */}
          {activeTab === "medical" && <MedicalTab />}
        </main>
      </div>
    </div>
  );
}
