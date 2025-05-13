import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../redux/actions/authActions";
import BG1 from "../images/dental2.jpg";
import LOGO from "../images/Logoklinik.png";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await dispatch(register(formData));
      if (success) {
        navigate("/verify-otp");
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="flex h-screen font-poppins">
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8">
        <button
          onClick={() => navigate("/login")}
          className="absolute top-8 left-8 flex items-center text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft className="mr-2" />
          <span>Kembali</span>
        </button>
        <img
          src={LOGO}
          className="w-60 h-auto mb-4 object-contain"
          style={{ maxWidth: "100%", maxHeight: "100px" }}
        />
        <h1 className="text-2xl font-bold mb-4">Buat Akun</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="w-full">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 mb-4 w-full"
            placeholder="Email address"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="border p-2 mb-4 w-full"
            placeholder="Password"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded w-full mb-4"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
        <div className="mt-4">
          <span>Sudah Punya Akun? </span>
          <a href="/login" className="text-blue-500">
            Sign in
          </a>
        </div>
      </div>
      <div className="hidden lg:block w-1/2 h-full items-center justify-center">
        <img
          src={BG1}
          alt="background"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
}
