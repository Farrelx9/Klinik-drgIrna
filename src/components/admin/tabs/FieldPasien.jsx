import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as rekamMedisActions from "../../../redux-admin/action/rekamMedisAction";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeft, Plus, Save } from "lucide-react";
import jsPDF from "jspdf";

export default function FieldPasien({ patient, onBack }) {
  const dispatch = useDispatch();
  const pasienState = useSelector((state) => state.rekamMedis || {});
  const { data: pasienList = [] } = pasienState;

  // State untuk menyimpan rekam medis pasien
  const [patientRecords, setPatientRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    id_pasien: patient.id_pasien || "",
    keluhan: "",
    diagnosa: "",
    tindakan: "",
    resep_obat: "",
    dokter: "drg. Irna",
    tanggal: new Date().toISOString().split("T")[0],
  });

  // Fetch rekam medis untuk pasien ini
  useEffect(() => {
    const fetchPatientRecords = async () => {
      try {
        setLoading(true);
        // Asumsikan ada API untuk mengambil rekam medis berdasarkan ID pasien
        const response = await dispatch(
          rekamMedisActions.fetchRekamMedisByPatient(patient.id_pasien)
        );

        // Jika tidak ada action khusus, bisa filter dari data yang ada
        // const allRecords = await dispatch(rekamMedisActions.fetchRekamMedis(1, 100));
        // const filteredRecords = allRecords.filter(record => record.id_pasien === patient.id_pasien);
        // setPatientRecords(filteredRecords);

        // Untuk sementara, kita gunakan data pasien yang dikirim sebagai array
        setPatientRecords([patient]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching patient records:", error);
        toast.error("Gagal mengambil data rekam medis pasien");
        setLoading(false);
      }
    };

    fetchPatientRecords();
  }, [dispatch, patient]);

  // Handle input form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.diagnosa || !formData.tindakan) {
      toast.error("Diagnosa dan Tindakan harus diisi");
      return;
    }

    try {
      if (editingRecord) {
        // Update rekam medis
        await dispatch(
          rekamMedisActions.updateRekamMedis(
            editingRecord.id_rekam_medis,
            formData
          )
        );
        toast.success("Rekam medis berhasil diperbarui");
      } else {
        // Tambah rekam medis baru
        await dispatch(rekamMedisActions.createRekamMedis(formData));
        toast.success("Rekam medis baru berhasil ditambahkan");
      }

      // Refresh data
      const updatedRecords = await dispatch(
        rekamMedisActions.fetchRekamMedisByPatient(patient.id_pasien)
      );
      setPatientRecords(updatedRecords || [patient]); // Fallback ke data yang ada jika API tidak tersedia

      resetForm();
    } catch (err) {
      console.error("Gagal menyimpan rekam medis:", err);
      toast.error("Gagal menyimpan rekam medis");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      id_pasien: patient.id_pasien || "",
      keluhan: "",
      diagnosa: "",
      tindakan: "",
      resep_obat: "",
      dokter: "drg. Irna",
      tanggal: new Date().toISOString().split("T")[0],
    });
    setEditingRecord(null);
    setShowForm(false);
  };

  // Edit rekam medis
  const handleEdit = (record) => {
    const rawDate = record.tanggal;
    const isValidDate = rawDate && !isNaN(new Date(rawDate).getTime());

    setFormData({
      id_pasien: record.id_pasien,
      keluhan: record.keluhan || "",
      diagnosa: record.diagnosa || "",
      tindakan: record.tindakan || "",
      resep_obat: record.resep_obat || "",
      dokter: record.dokter || "drg. Irna",
      tanggal: isValidDate
        ? new Date(rawDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
    });

    setEditingRecord(record);
    setShowForm(true);
  };

  // Hapus rekam medis
  const handleDelete = async (id_rekam_medis) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus rekam medis ini?")) {
      try {
        await dispatch(rekamMedisActions.deleteRekamMedis(id_rekam_medis));
        toast.success("Rekam medis berhasil dihapus");

        // Refresh data
        const updatedRecords = await dispatch(
          rekamMedisActions.fetchRekamMedisByPatient(patient.id_pasien)
        );
        setPatientRecords(
          updatedRecords ||
            patientRecords.filter((r) => r.id_rekam_medis !== id_rekam_medis)
        );
      } catch (error) {
        console.error("Gagal menghapus rekam medis:", error);
        toast.error("Gagal menghapus rekam medis");
      }
    }
  };

  // Export PDF
  const handleExportPDF = (record) => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(`Nama Pasien: ${record.pasien || patient.pasien || "-"}`, 10, 10);
    doc.text(`Keluhan: ${record.keluhan || "-"}`, 10, 20);
    doc.text(`Diagnosa: ${record.diagnosa || "-"}`, 10, 30);
    doc.text(`Tindakan: ${record.tindakan || "-"}`, 10, 40);
    doc.text(`Resep Obat: ${record.resep_obat || "-"}`, 10, 50);
    doc.text(`Dokter: ${record.dokter || "-"}`, 10, 60);
    doc.text(
      `Tanggal: ${
        record.tanggal
          ? new Date(record.tanggal).toLocaleDateString("id-ID")
          : "-"
      }`,
      10,
      70
    );
    doc.save(`rekam-medis-${record.id_rekam_medis || "pasien"}.pdf`);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-blue-50">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1 rounded-full hover:bg-blue-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-semibold">
              Rekam Medis: {patient.pasien || "Pasien"}
            </h2>
            <p className="text-sm text-gray-500">
              ID Pasien: {patient.id_pasien || "-"}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setShowForm(true);
              setEditingRecord(null);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Tambah Rekam Medis
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="p-8 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Memuat data rekam medis...</p>
        </div>
      )}

      {/* Form untuk tambah/edit rekam medis */}
      {showForm && (
        <div className="p-4 border-b bg-gray-50">
          <h3 className="text-md font-semibold mb-3">
            {editingRecord ? "Edit Rekam Medis" : "Tambah Rekam Medis Baru"}
          </h3>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Keluhan */}
            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-bold mb-1">
                Keluhan
              </label>
              <textarea
                name="keluhan"
                value={formData.keluhan}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border rounded"
              ></textarea>
            </div>

            {/* Diagnosis */}
            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-bold mb-1">
                Diagnosis
              </label>
              <textarea
                name="diagnosa"
                value={formData.diagnosa}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border rounded"
                required
              ></textarea>
            </div>

            {/* Tindakan */}
            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-bold mb-1">
                Tindakan
              </label>
              <input
                name="tindakan"
                value={formData.tindakan}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>

            {/* Resep Obat */}
            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-bold mb-1">
                Resep Obat
              </label>
              <textarea
                name="resep_obat"
                value={formData.resep_obat}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border rounded"
              ></textarea>
            </div>

            {/* Dokter */}
            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-bold mb-1">
                Dokter
              </label>
              <input
                name="dokter"
                value={formData.dokter}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>

            {/* Tanggal */}
            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-bold mb-1">
                Tanggal
              </label>
              <input
                name="tanggal"
                type="date"
                value={formData.tanggal}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>

            {/* Aksi */}
            <div className="col-span-1 md:col-span-2 flex justify-end space-x-2 mt-2">
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded flex items-center gap-1"
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded flex items-center gap-1"
              >
                <Save className="w-4 h-4" /> Simpan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Daftar rekam medis */}
      {!loading && patientRecords.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-500">
            Belum ada rekam medis untuk pasien ini.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Tambah Rekam Medis Pertama
          </button>
        </div>
      ) : (
        <div className="p-4">
          <h3 className="font-semibold mb-3">Riwayat Rekam Medis</h3>
          <div className="space-y-4">
            {patientRecords.map((record, index) => (
              <div
                key={record.id_rekam_medis || index}
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold">
                    Tanggal:{" "}
                    {record.tanggal
                      ? new Date(record.tanggal).toLocaleDateString("id-ID")
                      : "-"}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(record)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(record.id_rekam_medis)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Hapus
                    </button>
                    <button
                      onClick={() => handleExportPDF(record)}
                      className="text-green-500 hover:text-green-700"
                    >
                      Export PDF
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-600">
                      Keluhan:
                    </p>
                    <p className="text-sm">{record.keluhan || "-"}</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-600">
                      Diagnosa:
                    </p>
                    <p className="text-sm">{record.diagnosa || "-"}</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-600">
                      Tindakan:
                    </p>
                    <p className="text-sm">{record.tindakan || "-"}</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-600">
                      Resep Obat:
                    </p>
                    <p className="text-sm">{record.resep_obat || "-"}</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-600">
                      Dokter:
                    </p>
                    <p className="text-sm">{record.dokter || "-"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
