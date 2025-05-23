"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword } from "../../redux/actions/authActions";
import { useNavigate } from "react-router-dom";
import LOGO from "../images/LogoKlinik.png";
import { FaArrowLeft } from "react-icons/fa";

export default function ResetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    // Get email from localStorage
    const resetEmail = localStorage.getItem("resetEmail");
    if (resetEmail) {
      setEmail(resetEmail);
    } else {
      // If no email, redirect to forgot password
      navigate("/forgotPassword");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (password !== confirmPassword) {
      setPasswordError("Password tidak cocok");
      return;
    }

    if (password.length < 8) {
      setPasswordError("Password minimal 8 karakter");
      return;
    }

    setPasswordError("");

    const success = await dispatch(updatePassword(email, password));
    if (success) {
      // Clear localStorage
      localStorage.removeItem("resetEmail");
      // Show success message and redirect to login
      alert(
        "Password berhasil diubah. Silakan login dengan password baru Anda."
      );
      navigate("/login");
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen font-poppins bg-blue-50">
      <img
        src={LOGO || "/placeholder.svg"}
        className="w-80 h-auto mb-4 object-contain"
        style={{ maxWidth: "100%", maxHeight: "100px" }}
      />
      <h1 className="text-xl font-semibold mb-4 text-blue-500">
        Reset Password
      </h1>
      <p className="text-gray-600 mb-6 text-center">
        Masukkan password baru Anda
      </p>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {passwordError && <p className="text-red-500 mb-4">{passwordError}</p>}

      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mb-4 w-full rounded"
          placeholder="Password baru"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border p-2 mb-4 w-full rounded"
          placeholder="Konfirmasi password baru"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full mb-4"
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Simpan Password Baru"}
        </button>
      </form>

      <button
        onClick={handleBackToLogin}
        className="flex items-center text-blue-500 hover:text-blue-700 mt-4"
      >
        <FaArrowLeft className="mr-2" /> Kembali ke Login
      </button>
    </div>
  );
}
