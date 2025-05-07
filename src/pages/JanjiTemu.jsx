import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createJanjiTemu,
  getPatientJanjiTemu,
} from "../redux/actions/janjiTemuActions";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function JanjiTemu() {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    service: "",
    message: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { loading, janjiTemuList, error } = useSelector(
    (state) => state.janjiTemu
  );

  useEffect(() => {
    if (userInfo?.id) {
      dispatch(getPatientJanjiTemu(userInfo.id));
    }
  }, [dispatch, userInfo]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const janjiTemuData = {
        id_pasien: userInfo.id,
        tanggal_waktu: `${formData.date}T${formData.time}:00Z`,
        keluhan: `${formData.service}: ${formData.message}`,
        dokter: "drg. Irna",
      };

      await dispatch(createJanjiTemu(janjiTemuData));
      toast.success("Janji temu berhasil dibuat!");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Gagal membuat janji temu");
    }
  };

  const services = [
    "Pemeriksaan Gigi",
    "Pembersihan Karang Gigi",
    "Tambal Gigi",
    "Cabut Gigi",
    "Kawat Gigi",
    "Veneer",
    "Bleaching",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-poppins font-bold text-center mb-2 text-gray-800">
            Buat Janji Temu
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Tanggal
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Waktu
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Layanan
                </label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Layanan</option>
                  {services.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Keluhan/Pesan
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Jelaskan keluhan atau pesan Anda..."
                ></textarea>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-blue-600 text-white px-8 py-3 rounded-lg font-poppins font-medium hover:bg-blue-700 transition duration-300 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Memproses..." : "Buat Janji Temu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
