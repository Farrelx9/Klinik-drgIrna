import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as rekamMedisActions from "../../../redux-admin/action/rekamMedisAction";
import * as tindakanActions from "../../../redux-admin/action/jenisTindakanAction";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeft, Plus, Save } from "lucide-react";
import { deleteRekamMedis } from "../../../redux-admin/action/rekamMedisAction";

export default function FieldPasien({ patient, onBack }) {
  const dispatch = useDispatch();

  // Ambil state dari Redux
  const rekamMedisState = useSelector((state) => state.rekamMedis || {});
  const jenisTindakanState = useSelector((state) => state.jenisTindakan || {});

  const { patientRecords: reduxPatientRecords = [] } = rekamMedisState;

  // State lokal form dan modal hapus
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [recordToDeleteId, setRecordToDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    id_pasien: patient.id_pasien || "",
    keluhan: "",
    diagnosa: "",
    tindakan: "",
    resep_obat: "",
    dokter: "drg. Irna",
    tanggal: new Date().toISOString().split("T")[0],
  });

  const [searchTindakan, setSearchTindakan] = useState("");
  const [selectedTindakan, setSelectedTindakan] = useState(null);

  // Gunakan data pasien dari Redux atau fallback ke props
  const [patientRecords, setPatientRecords] = useState(
    reduxPatientRecords.length > 0 ? reduxPatientRecords : [patient]
  );

  // Fetch riwayat rekam medis pasien saat mount
  useEffect(() => {
    const fetchPatientRecords = async () => {
      try {
        setLoading(true);
        const records = await dispatch(
          rekamMedisActions.fetchRekamMedisByPatient(patient.id_pasien)
        );
        if (records && records.length > 0) {
          setPatientRecords(records);
        } else {
          setPatientRecords([patient]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Gagal mengambil riwayat rekam medis:", error);
        toast.warn("Menggunakan data lokal karena gagal ambil dari server");
        setPatientRecords([patient]);
        setLoading(false);
      }
    };

    fetchPatientRecords();
  }, [dispatch, patient]);

  // Fetch jenis tindakan dari Redux action
  useEffect(() => {
    dispatch(tindakanActions.fetchAllJenisTindakan());
  }, [dispatch]);

  // Simpan daftar tindakan dari Redux ke state lokal
  const [tindakanOptions, setTindakanOptions] = useState([]);

  useEffect(() => {
    if (jenisTindakanState.data && Array.isArray(jenisTindakanState.data)) {
      setTindakanOptions(jenisTindakanState.data);
    }
  }, [jenisTindakanState.data]);

  // Filter tindakan berdasarkan pencarian
  const filteredTindakan = useMemo(() => {
    if (!searchTindakan.trim()) return [];

    const query = searchTindakan.toLowerCase();
    return tindakanOptions.filter((t) =>
      t.nama_tindakan?.toLowerCase().includes(query)
    );
  }, [searchTindakan, tindakanOptions]);

  // Handler saat pilih tindakan
  const handlePilihTindakan = (tindakan) => {
    setSelectedTindakan(tindakan);
    setFormData({
      ...formData,
      tindakan: tindakan.nama_tindakan,
    });
    setSearchTindakan(""); // Reset input pencarian
  };

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
        await dispatch(
          rekamMedisActions.updateRekamMedis(
            editingRecord.id_rekam_medis,
            formData
          )
        );
        toast.success("Rekam medis berhasil diperbarui");
      } else {
        await dispatch(rekamMedisActions.createRekamMedis(formData));
        toast.success("Rekam medis baru berhasil ditambahkan");
      }

      const updatedRecords = await dispatch(
        rekamMedisActions.fetchRekamMedisByPatient(patient.id_pasien)
      );
      setPatientRecords(updatedRecords || [patient]);
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
    setSelectedTindakan(null);
    setEditingRecord(null);
    setShowForm(false);
  };

  // Edit record
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

  // Handle Delete - show confirmation modal instead of window.confirm
  const handleDeleteClick = (id) => {
    setRecordToDeleteId(id);
    setShowDeleteConfirm(true);
  };

  // Confirm Delete from modal
  const confirmDelete = async () => {
    if (recordToDeleteId) {
      try {
        await dispatch(deleteRekamMedis(recordToDeleteId));
        toast.success("Rekam medis berhasil dihapus");
        // Refresh list setelah hapus
        const updatedRecords = await dispatch(
          rekamMedisActions.fetchRekamMedisByPatient(patient.id_pasien)
        );
        setPatientRecords(updatedRecords || [patient]);
      } catch (error) {
        console.error("Gagal menghapus rekam medis:", error);
        toast.error("Gagal menghapus rekam medis");
      }
    }
    // Close modal and reset state
    setShowDeleteConfirm(false);
    setRecordToDeleteId(null);
  };

  // Cancel Delete from modal
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setRecordToDeleteId(null);
  };

  // Export PDF
  const handleExportPDF = (record) => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Rekam Medis Pasien", 14, 20);
    doc.setLineWidth(0.5);
    doc.line(10, 25, 200, 25);

    const tableColumn = ["Field", "Informasi"];
    const tableRows = [
      ["Nama Pasien", record.nama_pasien || "-"],
      ["Keluhan", record.keluhan || "-"],
      ["Diagnosa", record.diagnosa || "-"],
      ["Tindakan", record.tindakan || "-"],
      ["Resep Obat", record.resep_obat || "-"],
      ["Dokter", record.dokter || "-"],
      [
        "Tanggal",
        record.tanggal
          ? new Date(record.tanggal).toLocaleDateString("id-ID")
          : "-",
      ],
    ];

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: "striped",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [30, 144, 255] },
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.text("Dicetak pada: " + new Date().toLocaleString(), 14, finalY);
    doc.text("Sistem Rekam Medis Klinik Gigi drg. Irna", 14, finalY + 5);

    doc.save(`rekam-medis-${record.id_rekam_medis || "pasien"}.pdf`);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden font-poppins">
      {/* Header */}
      <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-blue-50">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1 rounded-full hover:bg-blue-100"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-semibold">
              Rekam Medis: {patient.nama_pasien || "Pasien"}
            </h2>
            <p className="text-sm text-gray-500">
              ID Pasien: {patient.id_pasien || "-"}
            </p>
          </div>
        </div>
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

      {/* Loading */}
      {loading && (
        <div className="p-8 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Memuat riwayat rekam medis...</p>
        </div>
      )}

      {/* Form tambah/edit */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="p-4 border-b bg-gray-50 space-y-4"
        >
          <h3 className="text-md font-semibold mb-3">
            {editingRecord ? "Edit Rekam Medis" : "Tambah Rekam Medis Baru"}
          </h3>

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
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {/* Diagnosa */}
          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Diagnosis
            </label>
            <textarea
              name="diagnosa"
              value={formData.diagnosa}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          {/* Tindakan - Autocomplete */}
          <div className="mb-3 relative">
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Tindakan
            </label>
            <input
              name="tindakan"
              value={searchTindakan || selectedTindakan?.nama_tindakan || ""}
              onChange={(e) => setSearchTindakan(e.target.value)}
              placeholder="Cari tindakan..."
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            {/* Dropdown hasil pencarian */}
            {filteredTindakan.length > 0 && (
              <ul className="absolute left-0 right-0 mt-1 bg-white border rounded shadow-lg max-h-48 overflow-y-auto z-50">
                {filteredTindakan.map((tindakan) => (
                  <li
                    key={tindakan.id_tindakan}
                    onClick={() => handlePilihTindakan(tindakan)}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                  >
                    {tindakan.nama_tindakan} - Rp{" "}
                    {tindakan.harga.toLocaleString()}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Tampilkan Harga Jika Ada Tindakan Terpilih */}
          {selectedTindakan && (
            <p className="text-sm text-gray-600">
              Harga: Rp {selectedTindakan.harga.toLocaleString()}
            </p>
          )}

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
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-3 py-2 border rounded bg-gray-100"
              readOnly
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
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Simpan Rekam Medis
            </button>
          </div>
        </form>
      )}

      {/* Riwayat Rekam Medis */}
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
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click event
                        handleEdit(record);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click event
                        handleDeleteClick(record.id_rekam_medis);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      Hapus
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click event
                        handleExportPDF(record);
                      }}
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

      {/* Modal Konfirmasi Hapus Rekam Medis */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">
                Konfirmasi Hapus Rekam Medis
              </h3>
              <p className="text-gray-600 mb-6">
                Apakah Anda yakin ingin menghapus rekam medis ini?
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
