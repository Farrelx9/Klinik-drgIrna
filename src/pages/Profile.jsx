import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import {
  FaUser,
  FaCalendarAlt,
  FaHistory,
  FaCog,
  FaEdit,
  FaCamera,
} from "react-icons/fa";
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

const appointmentHistory = [
  {
    id: 1,
    date: "15 Maret 2024",
    time: "10:00 WIB",
    service: "Pemeriksaan Gigi",
    status: "Selesai",
  },
  {
    id: 2,
    date: "20 Maret 2024",
    time: "14:00 WIB",
    service: "Pembersihan Karang Gigi",
    status: "Dijadwalkan",
  },
];

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);
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
  const [editFormData, setEditFormData] = useState({
    nama: "",
    noTelp: "",
    alamat: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
  });

  useEffect(() => {
    dispatch(fetchProfile(navigate));
  }, [dispatch, navigate]);

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
        <div className="max-w-4xl mx-auto py-5">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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
              <div className="flex-1">
                <h2 className="text-2xl font-bold">
                  {user.pasien?.nama || "Nama belum diisi"}
                </h2>
                <p className="text-gray-600">{user.email}</p>
                <div className="mt-2 space-y-1">
                  <p className="text-gray-600">
                    <span className="font-medium">No. Telepon:</span>{" "}
                    {user.pasien?.noTelp || "-"}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Alamat:</span>{" "}
                    {user.pasien?.alamat || "-"}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Tanggal Lahir:</span>{" "}
                    {user.pasien?.tanggal_lahir
                      ? new Date(user.pasien.tanggal_lahir).toLocaleDateString(
                          "id-ID"
                        )
                      : "-"}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Jenis Kelamin:</span>{" "}
                    {user.pasien?.jenis_kelamin || "-"}
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
                  activeTab === "history"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                onClick={() => setActiveTab("history")}
              >
                <FaHistory className="inline mr-2" />
                History
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
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    Daftar janji temu akan ditampilkan di sini
                  </p>
                </div>
              )}
              {activeTab === "history" && (
                <div className="space-y-4">
                  {appointmentHistory.map((appointment) => (
                    <div key={appointment.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {appointment.service}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {appointment.date} - {appointment.time}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            appointment.status === "Selesai"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  ))}
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
