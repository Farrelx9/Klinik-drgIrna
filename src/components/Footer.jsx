import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0A2472] text-white">
      <div className="container mx-auto max-w-[85rem] px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Informasi Klinik */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white/95">
              Klinik drg. Irna
            </h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#1B56FD]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
                <p className="text-white/80">
                  Jl. Tanjung Sadari No. 61, Krembangan, Perak
                </p>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#1B56FD]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                  />
                </svg>
                <p className="text-white/80">Telp: (+62) 81288856100</p>
              </div>
            </div>
          </div>

          {/* Jam Operasional */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white/95">
              Jam Operasional
            </h3>
            <div className="space-y-2 text-white/80">
              <p>Senin - Jumat: 16:00 - 20:00</p>
              <p>Sabtu - Minggu: Tutup</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white/95">Quick Links</h3>
            <div className="flex flex-col space-y-2">
              <a
                href="#"
                className="text-white/80 hover:text-[#1B56FD] transition-colors"
              >
                Beranda
              </a>
              <a
                href="#"
                className="text-white/80 hover:text-[#1B56FD] transition-colors"
              >
                Layanan
              </a>
              <a
                href="#"
                className="text-white/80 hover:text-[#1B56FD] transition-colors"
              >
                Tentang Kami
              </a>
              <a
                href="#"
                className="text-white/80 hover:text-[#1B56FD] transition-colors"
              >
                Kontak
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/70 text-sm">
              © 2025 Klinik drg. Irna. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a
                href="#"
                className="text-white/70 hover:text-[#1B56FD] transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-white/70 hover:text-[#1B56FD] transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
