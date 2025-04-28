import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/actions/authActions";
import BG1 from "../images/dental2.jpg";
import LOGO from "../images/Logoklinik.png";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData.email, formData.password));
  };

  return (
    <div className="flex h-screen">
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-8 shadow-2xl font-poppins gap-1 relative">
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
        <h1 className="text-2xl font-semibold mb-4 text-blue-500">
          Welcome back!
        </h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="w-full">
          <input
            type="text"
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
          <div className="flex items-center mb-4">
            <input type="checkbox" className="mr-2" />
            <span>Remember for 30 days</span>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded w-full mb-4"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <button className="bg-white border border-blue-500 text-blue-500 p-2 rounded w-full mb-4">
          Sign in with Google
        </button>
        <div>
          <a href="#" className="text-blue-500">
            Forgot password?
          </a>
        </div>
        <div className="mt-4">
          <span>Don't have an account? </span>
          <a href="#" className="text-blue-500">
            Sign up
          </a>
        </div>
      </div>
      <div className="hidden lg:block w-1/2 h-full items-center justify-center opacity-80">
        <img
          src={BG1}
          alt="background"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
}
