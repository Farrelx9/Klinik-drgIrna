import React, { useState, useEffect } from "react";
import Logo from "../assets/images/LogoKlinik.png";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loginSuccess, logout } from "../redux/actions/authActions";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { notifications = [] } = useSelector(
    (state) => state.notification || {}
  );

  // Count unread notifications
  const unreadCount = notifications.filter((notif) => !notif.is_read).length;

  // Auth initialization effect
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        dispatch(loginSuccess({ user: parsedUser, token }));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
    setIsInitializing(false);
  }, [dispatch]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isScrollingUp = prevScrollPos > currentScrollPos;
      setScrolled(!isScrollingUp);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  // 4. Handler functions
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleProfile = () => {
    if (isAuthenticated) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };
  const handleNotification = () => {
    navigate("/notifikasi");
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(logout());
    setShowLogoutModal(false);
    navigate("/login");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  if (isInitializing) {
    return null; // or loading skeleton
  }

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 transform ${
          scrolled ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="bg-white bg-opacity-95 shadow-md rounded-b-xl">
          <div className="container mx-auto max-w-[85rem] px-6">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center">
                <img
                  src={Logo}
                  alt="logo"
                  className="h-8 w-auto hover:opacity-80 transition-opacity"
                  onClick={() => navigate("/")}
                />
              </div>

              {/* Navigation Links */}
              <div className="hidden md:flex items-center space-x-8 font-poppins">
                {/* <a
                  href="#"
                  className="text-gray-700 hover:text-[#1B56FD] transition-colors font-medium"
                >
                  Tentang Kami
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-[#1B56FD] transition-colors font-medium"
                >
                  Pelayanan
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-[#1B56FD] transition-colors font-medium"
                >
                  Testimoni
                </a> */}
                {isAuthenticated ? (
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleNotification}
                      className="text-gray-700 hover:text-[#1B56FD] transition-colors relative"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={handleProfile}
                      className="text-gray-700 hover:text-[#1B56FD] transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="bg-[#1B56FD] text-white px-6 py-2 rounded-full hover:bg-[#0A2472] transition-colors font-medium"
                  >
                    Login
                  </button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={toggleMobileMenu}
                  className="text-gray-700 hover:text-[#1B56FD] transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        isMobileMenuOpen
                          ? "M6 18L18 6M6 6l12 12"
                          : "M4 6h16M4 12h16M4 18h16"
                      }
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            <div
              className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
                isMobileMenuOpen ? "max-h-96" : "max-h-0"
              }`}
            >
              <div className="py-4 space-y-4 font-poppins">
                {/* <a
                  href="#"
                  className="block text-gray-700 hover:text-[#1B56FD] transition-colors font-medium"
                >
                  Tentang Kami
                </a>
                <a
                  href="#"
                  className="block text-gray-700 hover:text-[#1B56FD] transition-colors font-medium"
                >
                  Pelayanan
                </a>
                <a
                  href="#"
                  className="block text-gray-700 hover:text-[#1B56FD] transition-colors font-medium"
                >
                  Testimoni
                </a> */}
                {isAuthenticated ? (
                  <div className="space-y-4">
                    <button
                      onClick={handleNotification}
                      className="flex items-center space-x-2 text-gray-700 hover:text-[#1B56FD] transition-colors relative"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                      <span>Notifikasi</span>
                      {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={handleProfile}
                      className="flex items-center space-x-2 text-gray-700 hover:text-[#1B56FD] transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span>Profil</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors font-medium"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="w-full bg-[#1B56FD] text-white px-6 py-2 rounded-full hover:bg-[#0A2472] transition-colors font-medium"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Konfirmasi Logout
            </h3>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin keluar dari akun ini?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
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
