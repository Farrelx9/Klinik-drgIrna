import React from "react";
import Footer from "../components/Footer";

export default function Beranda() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center text-gray-900">
      {/* Hero Section */}
      <div className="w-full bg-blue-500 text-white text-center py-20">
        <h1 className="text-4xl font-bold">
          Selamat Datang di Klinik drg. Irna
        </h1>
        <p className="mt-2 text-lg">
          Perawatan terbaik untuk kesehatan gigi dan mulut Anda
        </p>
        <button className="mt-4 bg-white text-blue-500 px-6 py-2 rounded-full font-semibold shadow-md hover:bg-gray-200 transition">
          Buat Janji Sekarang
        </button>
      </div>

      {/* Informasi Layanan */}
      <div className="w-4/5 my-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl shadow-lg text-center">
          <div className="text-blue-500 text-3xl mb-2">🦷</div>
          <h2 className="font-semibold text-xl">Pemeriksaan Gigi</h2>
          <p className="text-gray-600 mt-2">
            Pemeriksaan rutin untuk menjaga kesehatan gigi Anda.
          </p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-lg text-center">
          <div className="text-blue-500 text-3xl mb-2">✨</div>
          <h2 className="font-semibold text-xl">Pembersihan Karang Gigi</h2>
          <p className="text-gray-600 mt-2">
            Hindari plak dan karang gigi dengan pembersihan profesional.
          </p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-lg text-center">
          <div className="text-blue-500 text-3xl mb-2">💉</div>
          <h2 className="font-semibold text-xl">Penambalan & Pencabutan</h2>
          <p className="text-gray-600 mt-2">
            Perawatan gigi yang aman dan nyaman untuk Anda.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="w-full bg-blue-500 text-white text-center py-10">
        <h2 className="text-2xl font-semibold">
          Kesehatan gigi Anda adalah prioritas kami
        </h2>
        <p className="mt-2">
          Hubungi kami untuk konsultasi dan perawatan gigi terbaik
        </p>
        <button className="mt-4 bg-white text-blue-500 px-6 py-2 rounded-full font-semibold shadow-md hover:bg-gray-200 transition">
          Hubungi Kami
        </button>
      </div>
      <Footer />
    </div>
  );
}
