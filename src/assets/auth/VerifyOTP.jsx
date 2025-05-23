import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp, resendOtp } from "../../redux/actions/authActions";
import { useNavigate } from "react-router-dom";
import LOGO from "../images/LogoKlinik.png";

export default function VerifyOTP() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      const { id } = JSON.parse(userData);
      setUserId(id);
    } else {
      // If no user data, redirect to register
      navigate("/register");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await dispatch(verifyOtp(userId, otp));
    if (success) {
      navigate("/login");
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setResendSuccess(false);
    try {
      const success = await dispatch(resendOtp());
      if (success) {
        setResendSuccess(true);
        // Reset success message after 3 seconds
        setTimeout(() => setResendSuccess(false), 3000);
      }
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen font-poppins bg-blue-50">
      <img
        src={LOGO}
        className="w-80 h-auto mb-4 object-contain"
        style={{ maxWidth: "100%", maxHeight: "100px" }}
      />
      <h1 className="text-xl font-semibold mb-4 text-blue-500">
        Verifikasi Email
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
    </div>
  );
}
