import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginRole } from "../redux-admin/action/authAdminActions";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Assets
import BG1 from "../assets/images/dental2.jpg";
import LOGO from "../assets/images/Logoklinik.png";
import { FaArrowLeft } from "react-icons/fa";

export default function LoginAdmin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loadingAdmin, errorAdmin } = useSelector((state) => state.authAdmin); // Ambil dari Redux
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tangkap unauthorized event
  useEffect(() => {
    const handleUnauthorized = () => {
      const authError = localStorage.getItem("authAdminError");
      if (authError) {
        toast.error(authError, {
          autoClose: 3000,
          onClose: () => {
            setTimeout(() => {
              navigate("/login-admin", { replace: true });
            }, 500);
          },
        });

        localStorage.removeItem("authAdminError");
      }
    };

    window.addEventListener("unauthorizedAdmin", handleUnauthorized);
    return () =>
      window.removeEventListener("unauthorizedAdmin", handleUnauthorized);
  }, [navigate]);

  // Tampilkan toast dari localStorage
  useEffect(() => {
    const authError = localStorage.getItem("authAdminError");
    if (authError) {
      toast.error(authError, { autoClose: 3000 });
      localStorage.removeItem("authAdminError");
    }
  }, []);

  // Tampilkan error dari Redux
  useEffect(() => {
    if (errorAdmin) {
      toast.error(errorAdmin, { autoClose: 3000 });
    }
  }, [errorAdmin]);

  // Redirect setelah login sukses
  useEffect(() => {
    console.log("State Auth:", {
      loadingAdmin,
      errorAdmin,
      isSubmitting,
    });

    if (
      loadingAdmin === false &&
      !errorAdmin &&
      formData.email &&
      isSubmitting
    ) {
      toast.success("Login admin berhasil!", { autoClose: 3000 });
      setTimeout(() => {
        navigate("/dashboardadmin");
      }, 1500);
    }
  }, [loadingAdmin, errorAdmin, isSubmitting, navigate, formData.email]);

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
      await dispatch(loginRole(formData.email, formData.password));
    } catch (err) {
      toast.error(err || "Email atau password admin salah.", {
        autoClose: 3000,
      });
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
          alt="Logo Admin"
        />

        {/* Judul */}
        <h1 className="text-2xl font-semibold mb-4 text-blue-500">
          Admin Login
        </h1>

        {/* Form Login Admin */}
        <form onSubmit={handleSubmit} className="w-full">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 mb-4 w-full"
            placeholder="Email admin"
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
            disabled={loadingAdmin || isSubmitting}
          >
            {loadingAdmin || isSubmitting
              ? "Signing in..."
              : "Sign in as Admin"}
          </button>
        </form>
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
