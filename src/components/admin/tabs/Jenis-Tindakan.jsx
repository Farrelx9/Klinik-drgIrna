import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function JenisTindakan() {
  const [searchTerm, setSearchTerm] = useState("");

  // Dummy data untuk jenis tindakan
  const dummyTindakan = [
    {
      id_tindakan: "TNDK001",
      nama_tindakan: "Pemeriksaan Gigi",
      deskripsi: "Pemeriksaan rutin kesehatan gigi dan mulut",
      harga: 150000,
    },
    {
      id_tindakan: "TNDK002",
      nama_tindakan: "Tambal Gigi",
      deskripsi: "Perbaikan gigi berlubang",
      harga: 300000,
    },
    {
      id_tindakan: "TNDK003",
      nama_tindakan: "Cabut Gigi",
      deskripsi: "Pencabutan gigi yang sakit atau bermasalah",
      harga: 400000,
    },
    {
      id_tindakan: "TNDK004",
      nama_tindakan: "Bersih Karang Gigi",
      deskripsi: "Pembersihan plak dan karang gigi",
      harga: 200000,
    },
  ];

  // Filter data berdasarkan pencarian
  const filteredTindakan = dummyTindakan.filter((tindakan) =>
    tindakan.nama_tindakan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h2 className="text-lg font-semibold">Jenis Tindakan</h2>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-2">
          <input
            type="text"
            placeholder="Cari tindakan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-md px-3 py-1 text-sm w-full sm:w-auto"
          />
          <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm whitespace-nowrap">
            + Tambah Tindakan
          </button>
        </div>
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Tindakan
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deskripsi
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Harga
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTindakan.map((tindakan) => (
              <tr key={tindakan.id_tindakan}>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {tindakan.nama_tindakan}
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tindakan.deskripsi}
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Rp{tindakan.harga.toLocaleString("id-ID")}
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button className="text-blue-500 hover:text-blue-700">
                      Lihat
                    </button>
                    <button className="text-blue-500 hover:text-blue-700">
                      Edit
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="text-sm text-gray-500 order-2 sm:order-1">
          Menampilkan {filteredTindakan.length} dari {dummyTindakan.length}{" "}
          tindakan
        </div>
        <div className="flex space-x-2 order-1 sm:order-2">
          <button className="border rounded-md px-3 py-1 text-sm">
            <ChevronLeft className="h-4 w-4 sm:hidden" />
            <span className="hidden sm:inline">Sebelumnya</span>
          </button>
          <button className="border rounded-md px-3 py-1 text-sm bg-blue-500 text-white">
            1
          </button>
          <button className="border rounded-md px-3 py-1 text-sm">
            <ChevronRight className="h-4 w-4 sm:hidden" />
            <span className="hidden sm:inline">Selanjutnya</span>
          </button>
        </div>
      </div>
    </div>
  );
}
