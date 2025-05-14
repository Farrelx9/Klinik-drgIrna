import { ChevronLeft, ChevronRight } from "lucide-react";
import { dummyMedicalRecords } from "../dummydata";

export default function MedicalTab() {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h2 className="text-lg font-semibold">Rekam Medis Pasien</h2>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-2">
          <input
            type="text"
            placeholder="Cari rekam medis..."
            className="border rounded-md px-3 py-1 text-sm w-full sm:w-auto"
          />
          <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm whitespace-nowrap">
            + Tambah Rekam Medis
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pasien
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Diagnosis
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Perawatan
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dokter
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dummyMedicalRecords.map((record) => (
              <tr key={record.id}>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {record.patient}
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.diagnosis}
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.treatment}
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.date}
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.doctor}
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
      <div className="p-4 border-t flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="text-sm text-gray-500 order-2 sm:order-1">
          Menampilkan 1-4 dari 4 rekam medis
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
