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
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    dispatch(register(formData));
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
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 mb-4 w-full"
            placeholder="Full name"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 mb-4 w-full"
            placeholder="Email address"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="border p-2 mb-4 w-full"
            placeholder="Password"
          />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="border p-2 mb-4 w-full"
            placeholder="Confirm password"
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
