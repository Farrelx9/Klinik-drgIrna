import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { FaUser, FaCalendarAlt, FaCog, FaEdit, FaCamera } from "react-icons/fa";
import {
  fetchProfile,
  logout,
  requestChangePasswordOtp,
  changePassword,
} from "../redux/actions/authActions";
import { updateProfile as profileActionsUpdateProfile } from "../redux/actions/profileActions";
import LogoutConfirmationModal from "../components/LogoutConfirmationModal";
import defaultProfile from "../assets/images/drg irna.png";
import { useNavigate } from "react-router-dom";
import { fetchBookedAppointments } from "../redux/actions/profileActions";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    user,
    loading,
    error,
    bookedAppointments,
    loadingAppointments,
    errorAppointments,
  } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("personal");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [formData, setFormData] = useState({ currentPassword: "" });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { totalPages } = useSelector((state) => state.auth);
  const [editFormData, setEditFormData] = useState({
    nama: "",
    noTelp: "",
    alamat: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
  });

  // Load profile data
  useEffect(() => {
    dispatch(fetchProfile(navigate));
  }, [dispatch, navigate]);

  // Check token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Load form data & janji temu
  useEffect(() => {
    if (user) {
      setEditFormData({
        nama: user.pasien?.nama || "",
        noTelp: user.pasien?.noTelp || "",
        alamat: user.pasien?.alamat || "",
        tanggal_lahir: user.pasien?.tanggal_lahir
          ? new Date(user.pasien.tanggal_lahir).toISOString().split("T")[0]
          : "",
        jenis_kelamin: user.pasien?.jenis_kelamin || "",
      });
      setPreviewImage(user.pasien?.profilePicture || null);
    }
  }, [user]);

  // Load booked appointments
  useEffect(() => {
    if (user && user.pasien && user.pasien.id_pasien) {
      dispatch(fetchBookedAppointments(user.pasien.id_pasien, currentPage));
    }
  }, [user, dispatch, currentPage]);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(logout());
    setShowLogoutModal(false);
    window.location.href = "/login";
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewImage(URL.createObjectURL(file));
      setIsEditingProfile(true); // Enable edit mode when image changes
    }
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setProfilePicture(null);
    setPreviewImage(user.pasien?.profilePicture || null);
    setEditFormData({
      nama: user.pasien?.nama || "",
      noTelp: user.pasien?.noTelp || "",
      alamat: user.pasien?.alamat || "",
      tanggal_lahir: user.pasien?.tanggal_lahir
        ? new Date(user.pasien.tanggal_lahir).toISOString().split("T")[0]
        : "",
      jenis_kelamin: user.pasien?.jenis_kelamin || "",
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nama", editFormData.nama);
    formData.append("noTelp", editFormData.noTelp);
    formData.append("alamat", editFormData.alamat);
    formData.append("tanggal_lahir", editFormData.tanggal_lahir);
    formData.append("jenis_kelamin", editFormData.jenis_kelamin);
    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }
    try {
      const success = await dispatch(profileActionsUpdateProfile(formData));
      if (success) {
        setIsEditingProfile(false);
        setProfilePicture(null);
        dispatch(fetchProfile());
      } else {
        console.error("Update profile failed");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    const success = await dispatch(
      requestChangePasswordOtp(formData.currentPassword)
    );
    if (success) {
      setShowOtpForm(true);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    await dispatch(changePassword(otp, newPassword, formData.currentPassword));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-blue-500 text-xl">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-red-500 text-xl">{error}</span>
      </div>
    );
  }

  if (!user) return null;

  const profile = user;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 pt-16">
        <div className="max-w-4xl mx-auto py-5 font-poppins">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 font-medium">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="relative">
                  <img
                    src={previewImage || defaultProfile}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <label
                    htmlFor="profilePicture"
                    className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600"
                  >
                    <FaCamera />
                  </label>
                  <input
                    type="file"
                    id="profilePicture"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
              <div className="flex-1 ">
                <h2 className="text-2xl font-bold">
                  {user.pasien?.nama || "Nama belum diisi"}
                </h2>
                <p className="text-gray-600 text-sm">{user.email}</p>
                <div className="mt-2 space-y-1 text-sm">
                  <p className="text-gray-600 font-semibold">
                    <span className="font-medium">No. Telepon:</span>{" "}
                    {user.pasien?.noTelp || "-"}
                  </p>
                  <p className="text-gray-600 font-semibold">
                    <span className="font-medium">Alamat:</span>{" "}
                    {user.pasien?.alamat || "-"}
                  </p>
                  <p className="text-gray-600 font-semibold">
                    <span className="font-medium">Tanggal Lahir:</span>{" "}
                    {user.pasien?.tanggal_lahir
                      ? new Date(user.pasien.tanggal_lahir).toLocaleDateString(
                          "id-ID"
                        )
                      : "-"}
                  </p>
                  <p className="text-gray-600 font-semibold">
                    <span className="font-medium">Jenis Kelamin:</span>{" "}
                    {user.pasien?.jenis_kelamin || "-"}{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="flex border-b">
              <button
                className={`px-6 py-3 font-medium ${
                  activeTab === "personal"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                onClick={() => setActiveTab("personal")}
              >
                <FaUser className="inline mr-2" />
                Informasi Pribadi
              </button>
              <button
                className={`px-6 py-3 font-medium ${
                  activeTab === "appointments"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                onClick={() => setActiveTab("appointments")}
              >
                <FaCalendarAlt className="inline mr-2" />
                Janji Temu
              </button>
              <button
                className={`px-6 py-3 font-medium ${
                  activeTab === "settings"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                onClick={() => setActiveTab("settings")}
              >
                <FaCog className="inline mr-2" />
                Pengaturan
              </button>
            </div>
            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "personal" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Lengkap
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={editFormData.nama}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              nama: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded"
                        />
                      ) : (
                        <p className="p-2 bg-gray-50 rounded">
                          {user.pasien?.nama || "-"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <p className="p-2 bg-gray-50 rounded">{user.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nomor Telepon
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={editFormData.noTelp}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              noTelp: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded"
                        />
                      ) : (
                        <p className="p-2 bg-gray-50 rounded">
                          {user.pasien?.noTelp || "-"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tanggal Lahir
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="date"
                          value={editFormData.tanggal_lahir}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              tanggal_lahir: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded"
                        />
                      ) : (
                        <p className="p-2 bg-gray-50 rounded">
                          {user.pasien?.tanggal_lahir
                            ? new Date(
                                user.pasien.tanggal_lahir
                              ).toLocaleDateString("id-ID")
                            : "-"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Jenis Kelamin
                      </label>
                      {isEditingProfile ? (
                        <select
                          value={editFormData.jenis_kelamin}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              jenis_kelamin: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded"
                        >
                          <option value="">Pilih Jenis Kelamin</option>
                          <option value="Laki-laki">Laki-laki</option>
                          <option value="Perempuan">Perempuan</option>
                        </select>
                      ) : (
                        <p className="p-2 bg-gray-50 rounded">
                          {user.pasien?.jenis_kelamin || "-"}
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Alamat
                      </label>
                      {isEditingProfile ? (
                        <textarea
                          value={editFormData.alamat}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              alamat: e.target.value,
                            })
                          }
                          rows="3"
                          className="w-full p-2 border rounded"
                        />
                      ) : (
                        <p className="p-2 bg-gray-50 rounded">
                          {user.pasien?.alamat || "-"}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-4 mt-6">
                    {isEditingProfile ? (
                      <>
                        <button
                          onClick={handleEditSubmit}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          Simpan Perubahan
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                        >
                          Batal
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleEditProfile}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        <FaEdit className="inline mr-2" />
                        Edit Profil
                      </button>
                    )}
                  </div>
                </div>
              )}
              {activeTab === "appointments" && (
                <div className="space-y-6">
                  {loadingAppointments ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : errorAppointments ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                      <div className="flex flex-col items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 text-red-500 mb-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="text-red-700 font-medium mb-1">
                          Gagal memuat janji temu
                        </p>
                        <p className="text-red-600">{errorAppointments}</p>
                      </div>
                    </div>
                  ) : bookedAppointments.length > 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full table-auto">
                          <thead>
                            <tr className="bg-gray-50 text-left">
                              <th className="px-6 py-4 max-w-xs overflow-hidden break-words">
                                Tanggal
                              </th>
                              <th className="px-6 py-4 max-w-xs overflow-hidden break-words">
                                Waktu
                              </th>
                              <th className="px-6 py-4 max-w-xs overflow-hidden break-words">
                                Keluhan
                              </th>
                              <th className="px-6 py-4 max-w-xs overflow-hidden break-words">
                                Status
                              </th>
                              <th className="px-6 py-4 max-w-xs overflow-hidden break-words">
                                Dokter
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {bookedAppointments.map((appointment) => (
                              <tr
                                key={appointment.id_janji}
                                className="hover:bg-gray-50 transition-colors"
                              >
                                <td className="px-6 py-4 max-w-xs overflow-hidden break-words">
                                  {new Date(
                                    appointment.tanggal_waktu
                                  ).toLocaleDateString("id-ID", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </td>
                                <td className="px-6 py-4 max-w-xs overflow-hidden break-words">
                                  {new Date(
                                    appointment.tanggal_waktu
                                  ).toLocaleTimeString("id-ID", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </td>
                                <td className="px-6 py-4 max-w-xs overflow-hidden break-words">
                                  {appointment.keluhan || "-"}
                                </td>
                                <td className="px-4 py-3">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                      appointment.status === "pending"
                                        ? "bg-yellow-50 text-yellow-700"
                                        : appointment.status === "cancelled"
                                        ? "bg-red-50 text-red-700"
                                        : "bg-green-50 text-green-700"
                                    }`}
                                  >
                                    {appointment.status === "pending" && (
                                      <svg
                                        className="w-3.5 h-3.5 mr-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                      </svg>
                                    )}
                                    {appointment.status === "cancelled" && (
                                      <svg
                                        className="w-3.5 h-3.5 mr-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M6 18L18 6M6 6l12 12"
                                        />
                                      </svg>
                                    )}
                                    {appointment.status === "confirmed" && (
                                      <svg
                                        className="w-3.5 h-3.5 mr-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                    )}
                                    <span className="capitalize">
                                      {appointment.status === "pending"
                                        ? "Menunggu"
                                        : appointment.status === "confirmed"
                                        ? "Terkonfirmasi"
                                        : appointment.status === "cancelled"
                                        ? "Dibatalkan"
                                        : appointment.status}
                                    </span>
                                  </span>
                                </td>
                                <td className="px-6 py-4 max-w-xs overflow-hidden break-words">
                                  {appointment.dokter || "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 text-gray-400 mx-auto mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-700 mb-2">
                        Tidak ada janji temu
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Anda belum memiliki janji temu yang terjadwal.
                      </p>
                      <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                        Buat Janji Temu
                      </button>
                    </div>
                  )}
                  {bookedAppointments.length > 0 && (
                    <div className="flex justify-center mt-6">
                      <nav className="inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1}
                          className={`${
                            currentPage === 1
                              ? "cursor-not-allowed bg-gray-100 text-gray-400"
                              : "bg-white hover:bg-gray-50"
                          } relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium rounded-l-md`}
                        >
                          Sebelumnya
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`${
                              currentPage === i + 1
                                ? "z-10 bg-primary text-white"
                                : "bg-white hover:bg-gray-50"
                            } relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium`}
                          >
                            {i + 1}
                          </button>
                        ))}

                        <button
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                          disabled={currentPage === totalPages}
                          className={`${
                            currentPage === totalPages
                              ? "cursor-not-allowed bg-gray-100 text-gray-400"
                              : "bg-white hover:bg-gray-50"
                          } relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium rounded-r-md`}
                        >
                          Selanjutnya
                        </button>
                      </nav>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-6">
                  <div className="border rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Ubah Password
                      </h3>
                      {!showPasswordForm && (
                        <button
                          onClick={() => setShowPasswordForm(true)}
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                          Ubah Password
                        </button>
                      )}
                    </div>
                    {showPasswordForm && (
                      <form className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password Saat Ini
                          </label>
                          <input
                            type="password"
                            value={formData.currentPassword}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                currentPassword: e.target.value,
                              })
                            }
                            className="w-full p-2 border rounded"
                            placeholder="Masukkan password saat ini"
                          />
                        </div>
                        {!showOtpForm ? (
                          <div className="flex space-x-4">
                            <button
                              type="button"
                              onClick={handleRequestOtp}
                              disabled={!formData.currentPassword}
                              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                            >
                              Request OTP
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowPasswordForm(false)}
                              className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kode OTP
                              </label>
                              <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full p-2 border rounded"
                                placeholder="Masukkan kode OTP"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password Baru
                              </label>
                              <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full p-2 border rounded"
                                placeholder="Masukkan password baru"
                              />
                            </div>
                            <div className="flex space-x-4">
                              <button
                                type="button"
                                onClick={handleChangePassword}
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                              >
                                Simpan Password
                              </button>
                              <button
                                type="button"
                                onClick={() => setShowOtpForm(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
                              >
                                Batal
                              </button>
                            </div>
                          </>
                        )}
                      </form>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={handleLogout}
                      className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </div>
  );
}
