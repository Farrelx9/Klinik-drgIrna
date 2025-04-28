import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Appointment() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    service: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
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
          <p className="text-center text-gray-600 mb-10 font-poppins">
            Silakan isi formulir di bawah ini untuk membuat janji temu dengan
            dokter gigi kami
          </p>

          <div className="bg-white rounded-lg shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-poppins mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-poppins mb-2">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-poppins mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-poppins mb-2">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-poppins mb-2">
                    Waktu
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-poppins mb-2">
                    Layanan
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins"
                    required
                  >
                    <option value="">Pilih Layanan</option>
                    {services.map((service, index) => (
                      <option key={index} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-poppins mb-2">
                  Pesan Tambahan
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins"
                  placeholder="Tuliskan keluhan atau informasi tambahan yang perlu diketahui dokter..."
                ></textarea>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-poppins font-medium hover:bg-blue-700 transition duration-300"
                >
                  Buat Janji Temu
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
