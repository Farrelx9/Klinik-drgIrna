import { Calendar, Users } from "lucide-react";

export default function DashboardTab() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
              <Users className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Pasien</p>
              <p className="text-xl md:text-2xl font-bold">248</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
              <Calendar className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Janji Temu Hari Ini</p>
              <p className="text-xl md:text-2xl font-bold">12</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Transaksi Terbaru */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Transaksi Terbaru</h2>
          </div>
          <div className="divide-y overflow-x-auto">
            {[
              {
                time: "09:30",
                patient: "Budi Santoso",
                amount: "Rp 385.000",
              },
              {
                time: "10:45",
                patient: "Siti Rahayu",
                amount: "Rp 750.000",
              },
              {
                time: "13:15",
                patient: "Ahmad Fauzi",
                amount: "Rp 425.000",
              },
              {
                time: "15:00",
                patient: "Dewi Lestari",
                amount: "Rp 550.000",
              },
            ].map((transaction, index) => (
              <div key={index} className="p-4 flex items-center">
                <div className="w-16 text-sm text-gray-500">
                  {transaction.time}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    {transaction.patient}
                  </div>
                  <div className="text-xs text-gray-500">
                    Pembayaran diterima
                  </div>
                </div>
                <div className="text-sm font-medium">{transaction.amount}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Performa Layanan */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Tarif Tindakan</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tindakan
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dokter
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prioritas
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarif
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  {
                    service: "Pemeriksaan Gigi",
                    doctor: "drg. Irna",
                    priority: "Tinggi",
                    fee: "Rp 150.000",
                  },
                  {
                    service: "Pembersihan Karang Gigi",
                    doctor: "drg. Andi",
                    priority: "Sedang",
                    fee: "Rp 350.000",
                  },
                  {
                    service: "Tambal Gigi",
                    doctor: "drg. Irna",
                    priority: "Rendah",
                    fee: "Rp 200.000",
                  },
                ].map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.service}
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.doctor}
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.priority === "Tinggi"
                            ? "bg-red-100 text-red-800"
                            : item.priority === "Sedang"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {item.priority}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.fee}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
