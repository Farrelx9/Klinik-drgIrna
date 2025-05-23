"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyResetOtp, resendOtp } from "../../redux/actions/authActions";
import { useNavigate } from "react-router-dom";
import LOGO from "../images/LogoKlinik.png";
import { FaArrowLeft } from "react-icons/fa";

export default function VerifyResetOTP() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

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
    const success = await dispatch(verifyResetOtp(email, otp));
    if (success) {
      navigate("/reset");
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setResendSuccess(false);
    try {
      const success = await dispatch(resendOtp(email));
      if (success) {
        setResendSuccess(true);
        // Reset success message after 3 seconds
        setTimeout(() => setResendSuccess(false), 3000);
      }
    } finally {
      setResendLoading(false);
    }
  };

  const handleBackToForgotPassword = () => {
    navigate("/forgotPassword");
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen font-poppins bg-blue-50">
      <img
        src={LOGO || "/placeholder.svg"}
        className="w-80 h-auto mb-4 object-contain"
        style={{ maxWidth: "100%", maxHeight: "100px" }}
      />
      <h1 className="text-xl font-semibold mb-4 text-blue-500">
        Verifikasi OTP
      </h1>
      <p className="text-gray-600 mb-6 text-center">
        Masukkan kode OTP yang telah dikirim ke email Anda
      </p>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {resendSuccess && (
        <p className="text-green-500 mb-4">
          Kode OTP baru telah dikirim ke email Anda
        </p>
      )}
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="border p-2 mb-4 w-full text-center text-2xl tracking-widest"
          placeholder="Masukkan kode OTP"
          maxLength="6"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full mb-4"
          disabled={loading}
        >
          {loading ? "Memverifikasi..." : "Verifikasi"}
        </button>
      </form>
      <div className="mt-4 text-center">
        <p className="text-gray-600">Tidak menerima kode?</p>
        <button
          onClick={handleResendOtp}
          disabled={resendLoading}
          className="text-blue-500 hover:text-blue-700 disabled:text-gray-400"
        >
          {resendLoading ? "Mengirim..." : "Kirim ulang kode"}
        </button>
      </div>
      <button
        onClick={handleBackToForgotPassword}
        className="flex items-center text-blue-500 hover:text-blue-700 mt-4"
      >
        <FaArrowLeft className="mr-2" /> Kembali
      </button>
    </div>
  );
}
