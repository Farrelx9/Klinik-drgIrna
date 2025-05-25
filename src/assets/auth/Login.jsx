import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../redux/actions/authActions";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Assets
import BG1 from "../images/dental2.jpg";
import LOGO from "../images/LogoKlinik.png";
import { FaArrowLeft } from "react-icons/fa";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tangkap unauthorized event
  useEffect(() => {
    const handleUnauthorized = () => {
      const authError = localStorage.getItem("authError");
      if (authError) {
        toast.error(authError, {
          autoClose: 3000,
          onClose: () => {
            setTimeout(() => {
              navigate("/login", { replace: true });
            }, 500);
          },
        });

        localStorage.removeItem("authError");
      }
    };

    window.addEventListener("unauthorized", handleUnauthorized);
    return () => window.removeEventListener("unauthorized", handleUnauthorized);
  }, [navigate]);

  // Tampilkan toast dari localStorage
  useEffect(() => {
    const authError = localStorage.getItem("authError");
    if (authError) {
      toast.error(authError, { autoClose: 3000 });
      localStorage.removeItem("authError");
    }
  }, []);

  // Tampilkan error dari Redux
  useEffect(() => {
    if (error) {
      toast.error(error, { autoClose: 3000 });
    }
  }, [error]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    toast.dismiss();
    setIsSubmitting(true);

    try {
      const success = await dispatch(login(formData.email, formData.password));
      if (success) {
        toast.success(
          "Login berhasil!, Jangan lupa lengkapi profil kamu yaa!",
          {
            autoClose: 3000,
          }
        );
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (err) {
      toast.error("Email atau password salah.", { autoClose: 3000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen font-poppins">
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-8 shadow-2xl gap-1 relative">
        {/* Tombol Kembali */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-8 left-8 flex items-center text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft className="mr-2" />
          <span>Kembali</span>
        </button>

        {/* Logo */}
        <img
          src={LOGO}
          className="w-60 h-auto mb-4 object-contain"
          style={{ maxWidth: "100%", maxHeight: "100px" }}
          alt="Logo"
        />

        {/* Judul */}
        <h1 className="text-2xl font-semibold mb-4 text-blue-500">
          Selamat Datang!
        </h1>

        {/* Form Login */}
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
            disabled={loading || isSubmitting}
          >
            {loading || isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Link Forgot Password */}
        <div>
          <a
            onClick={() => navigate("/forgotPassword")}
            className="text-blue-500 cursor-pointer"
          >
            Forgot password?
          </a>
        </div>

        {/* Daftar Akun */}
        <div className="mt-4">
          <span>Belum Punya Akun? </span>
          <a
            onClick={() => navigate("/register")}
            className="text-blue-500 cursor-pointer"
          >
            Sign up
          </a>
        </div>
      </div>

      {/* Background Image */}
      <div className="hidden lg:block w-1/2 h-full opacity-80">
        <img
          src={BG1}
          alt="background"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
}
