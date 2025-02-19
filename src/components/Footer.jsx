import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white py-6 text-center mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6">
        {/* Informasi Klinik */}
        <div className="mb-4 md:mb-0">
          <h2 className="text-xl font-bold">Klinik drg. Irna</h2>
          <p className="text-gray-400 text-sm">
            Jl. Tanjung Sadari No. 61, Krembangan, Perak
          </p>
          <p className="text-gray-400 text-sm">Telp: (031) 123-4567</p>
        </div>

        {/* Hak Cipta */}
        <p className="text-gray-500 text-sm mt-4 md:mt-0">
          © 2025 Klinik drg. Irna. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
