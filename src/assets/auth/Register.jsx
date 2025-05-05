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
    username: "",
    nama: "",
    email: "",
    password: "",
    noTelp: "",
    alamat: "",
    role: "user",
    is_verified: "false",
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
          onClick={() => navigate("/")}
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
        <h1 className="text-2xl font-bold mb-4">Create an account</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="w-full">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="border p-2 mb-4 w-full"
            placeholder="Username"
            required
          />
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            className="border p-2 mb-4 w-full"
            placeholder="Full name"
            required
          />
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
          <input
            type="tel"
            name="noTelp"
            value={formData.noTelp}
            onChange={handleChange}
            className="border p-2 mb-4 w-full"
            placeholder="Phone number"
            required
          />
          <textarea
            name="alamat"
            value={formData.alamat}
            onChange={handleChange}
            className="border p-2 mb-4 w-full"
            placeholder="Address"
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
        <button className="bg-white border border-blue-500 text-blue-500 p-2 rounded w-full mb-4">
          Sign up with Google
        </button>
        <div className="mt-4">
          <span>Already have an account? </span>
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
