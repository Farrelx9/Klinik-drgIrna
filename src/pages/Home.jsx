import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import drgIrna from "../assets/images/drg irna.png";
import klinik from "../assets/images/klinik.jpg";
import ServiceCard from "../components/ServiceCard";
import {
  MessageSquareText,
  CalendarClock,
  ClipboardPlus,
  MessageCircleCodeIcon,
} from "lucide-react";
export default function Beranda() {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100 font-poppins font-semibold text-gray-900">
        {/* Hero Section */}
        <div className="w-full bg-gradient-to-b from-[#1B56FD] to-[#1B56FD]/80 text-white py-10">
          <div className="container mx-auto px-4 py-16 flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
              <h1 className="text-2xl md:text-4xl mb-4">
                Selamat Datang di Klinik drg. Irna
              </h1>
              <p className="text-xl mb-6">
                Perawatan terbaik untuk kesehatan gigi dan mulut Anda
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img
                src={drgIrna}
                alt="Drg. Irna"
                className="rounded-full shadow-xl max-h-[400px] object-cover transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>

        {/* New Section: Solusi Kesehatan di Tanganmu */}
        <div className="w-full bg-[#F8F5E9] py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1B56FD] mb-12 text-center">
              Solusi Kesehatan di Tanganmu
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Chat dengan Dokter */}
              <ServiceCard
                title="Chat dengan Dokter"
                description="Konsultasi langsung dengan lebih dari 50 spesialis 24/7"
                icon={<MessageSquareText size={32} />}
                link="/jadwal-konsultasi"
              />

              {/* Janji Temu */}
              <ServiceCard
                title="Janji Temu"
                description="Atur jadwal konsultasi dokter secara mudah dan cepat"
                icon={<CalendarClock size={32} />}
                link="/list-jadwal"
              />
              <ServiceCard
                title="Daftar Chat"
                description="Akses chat dengan dokter setelah melakukan pembayaran disini!"
                icon={<MessageCircleCodeIcon size={32} />}
                link="/konsultasi"
              />
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="w-full py-16 bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)]">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1B56FD] mb-12 text-center">
              Mengapa Memilih Layanan Kami?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Feature Cards */}
              <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-center mb-4">
                  <div className="text-[#1B56FD] text-3xl">💰</div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-3">
                  Harga Terjangkau
                </h3>
                <p className="text-gray-600 text-center">
                  Biaya perawatan gigi sangat terjangkau dan sesuai dengan
                  anggaran Anda.
                </p>
              </div>
              <div className="bg-[#1B56FD] p-6 rounded-lg shadow-lg text-white hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-center mb-4">
                  <div className="text-white text-3xl">👨‍⚕️</div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-3">
                  Dokter Gigi Profesional
                </h3>
                <p className="text-white/90 text-center">
                  Tim kami terdiri dari dokter gigi, perawat gigi, asisten, dan
                  staf administrasi yang bekerja bersama.
                </p>
              </div>
              <div className="bg-[#1B56FD] p-6 rounded-lg shadow-lg text-white hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-center mb-4">
                  <div className="text-white text-3xl">⭐</div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-3">
                  Pelayanan Berkualitas
                </h3>
                <p className="text-white/90 text-center">
                  Pasien menerima perawatan gigi berkualitas yang memenuhi atau
                  melampaui harapan mereka.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-center mb-4">
                  <div className="text-[#1B56FD] text-3xl">📅</div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-3">
                  Kemudahan Reservasi
                </h3>
                <p className="text-gray-600 text-center">
                  Kami siap memberikan saran baik secara proyek maupun kerja
                  sama tetap.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="w-full bg-[#F8F5E9] py-16">
          <div className="container mx-auto px-4 p-16 rounded-xl max-w-5xl bg-transparent">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-[#1B56FD]">
                Layanan Yang Kami Tawarkan
              </h2>
              <p className="text-gray-600 mt-2">
                Tim kami yang berpengalaman berkomitmen memberikan layanan
                terbaik dan perawatan personal untuk setiap pasien.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Service Cards */}
              <div className="bg-white p-8 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="text-[#1B56FD] text-3xl mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Pemeriksaan Gigi</h3>
                <p className="text-gray-600">
                  Pemeriksaan rutin yang biasanya dilakukan oleh dokter gigi
                  atau perawat gigi.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="text-[#1B56FD] text-3xl mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Pemutihan Gigi</h3>
                <p className="text-gray-600">
                  Proses perbaikan gigi yang bertujuan mencerahkan warna gigi
                  dan menghilangkan noda.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="text-[#1B56FD] text-3xl mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Kawat Gigi</h3>
                <p className="text-gray-600">
                  Perawatan ortodontik untuk meluruskan gigi dan memperbaiki
                  gigitan.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="text-[#1B56FD] text-3xl mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Implantasi Gigi</h3>
                <p className="text-gray-600">
                  Restorasi gigi untuk menggantikan gigi yang hilang atau rusak.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="text-[#1B56FD] text-3xl mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Penambalan Gigi</h3>
                <p className="text-gray-600">
                  Proses perbaikan gigi yang rusak karena lubang atau kerusakan
                  lainnya.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="text-[#1B56FD] text-3xl mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Kedokteran Gigi Estetika
                </h3>
                <p className="text-gray-600">
                  Prosedur untuk meningkatkan tampilan gigi, gusi, dan senyuman
                  Anda.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* About Us Section */}
        <div className="w-full bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="md:w-1/2 flex justify-center">
                <img
                  src={klinik}
                  alt="Tentang Klinik drg. Irna"
                  className="rounded-full w-[400px] h-[400px] object-cover shadow-xl border-4 border-[#1B56FD]"
                />
              </div>
              <div className="md:w-1/2">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1B56FD] mb-6 text-center md:text-left">
                  Tentang Kami
                </h2>
                <p className="text-gray-700 leading-relaxed text-center md:text-left">
                  Klinik drg. Irna adalah klinik gigi profesional yang
                  berkomitmen untuk memberikan layanan terbaik dalam menjaga
                  kesehatan gigi dan mulut Anda. Dengan tim dokter gigi yang
                  berpengalaman, fasilitas lengkap, dan lingkungan yang nyaman,
                  kami hadir sebagai solusi terpercaya untuk semua kebutuhan
                  perawatan gigi Anda dan keluarga.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="w-full bg-[#1B56FD] text-white text-center py-10">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl">
              Kesehatan gigi Anda adalah prioritas kami
            </h2>
            <p className="mt-2">
              Hubungi kami untuk konsultasi dan perawatan gigi terbaik
            </p>
            <a
              href="https://wa.me/6281288856100?text=Halo%20Klinik%20drg.%20Irna,%2C%20saya%20ingin%20bertanya!"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="mt-4 bg-white text-[#1B56FD] px-6 py-2 rounded-full shadow-md hover:bg-gray-200 transition">
                Hubungi Kami
              </button>
            </a>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
