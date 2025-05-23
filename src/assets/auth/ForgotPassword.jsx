"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../redux/actions/authActions";
import { useNavigate } from "react-router-dom";
import LOGO from "../images/LogoKlinik.png";
import { FaArrowLeft } from "react-icons/fa";

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [requestSuccess, setRequestSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await dispatch(forgotPassword(email));
    if (success) {
      setRequestSuccess(true);
      // Store email in localStorage for the verify OTP page
      localStorage.setItem("resetEmail", email);
      // Redirect to OTP verification after 3 seconds
      setTimeout(() => {
        navigate("/verifyReset");
      }, 3000);
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
        Lupa Password
      </h1>
      <p className="text-gray-600 mb-6 text-center">
        Masukkan email Anda untuk menerima kode reset password
      </p>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {requestSuccess && (
        <p className="text-green-500 mb-4">
          Kode OTP telah dikirim ke email Anda
        </p>
      )}

      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 mb-4 w-full rounded"
          placeholder="Masukkan email Anda"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full mb-4"
          disabled={loading}
        >
          {loading ? "Mengirim..." : "Kirim Kode Reset"}
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
