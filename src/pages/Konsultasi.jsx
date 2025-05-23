import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getRiwayatChat,
  kirimPesan,
  cekSesiAktifByPasien,
} from "../redux/actions/chatActions";
import { toast } from "react-toastify";

const Konsultasi = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const id_chat = id;

  // Ambil state dari Redux
  const chatState = useSelector((state) => state.chat);

  const [inputMessage, setInputMessage] = useState("");

  // Gunakan state lokal untuk status chat jika tidak diambil dari Redux
  const [sessionStatus, setSessionStatus] = useState(null);

  const messagesEndRef = useRef(null);

  // Scroll otomatis ke bawah
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch riwayat chat saat komponen mount atau id_chat berubah
  useEffect(() => {
    if (!id_chat) {
      toast.warn("ID Chat tidak ditemukan.");
      navigate("/jadwal-konsultasi");
      return;
    }

    dispatch(getRiwayatChat(id_chat));
  }, [dispatch, id_chat]);

  // Cek apakah ini sesi aktif pasien
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const id_pasien = user?.pasien?.id_pasien;

    if (id_pasien && id_chat) {
      dispatch(cekSesiAktifByPasien(id_pasien)).then((result) => {
        if (result?.payload?.id_chat === id_chat) {
          setSessionStatus(result.payload.status); // Set status sesi jika cocok
        } else {
          setSessionStatus("selesai"); // Jika bukan sesi aktif untuk ID ini
        }
      });
    }
  }, [dispatch, id_chat]);

  // Scroll otomatis saat pesan baru masuk
  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages]); // Pastikan ini adalah array pesan

  // Handler Kirim Pesan
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim() || !id_chat) {
      toast.warn("Isi pesan atau ID Chat tidak valid.");
      return;
    }

    if (sessionStatus !== "aktif") {
      toast.warn("Sesi belum aktif. Anda tidak bisa mengirim pesan.");
      return;
    }

    try {
      await dispatch(
        kirimPesan({ isi: inputMessage, pengirim: "pasien", id_chat })
      ).unwrap();

      setInputMessage(""); // Kosongkan input setelah berhasil kirim
    } catch (error) {
      toast.error("Gagal mengirim pesan.");
      console.error("Error:", error.message);
    }
  };

  // Tentukan apakah input pesan aktif
  const isInputEnabled = sessionStatus === "aktif";

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Chat Header */}
            <div className="bg-blue-600 text-white p-4">
              <h2 className="text-xl">Dr. Irna - Dokter Gigi</h2>
            </div>

            {/* Status Sesi */}
            <div className="px-4 py-2 bg-gray-50 border-b">
              <p className="text-sm">
                {sessionStatus === "aktif"
                  ? "💬 Sedang aktif"
                  : sessionStatus === "selesai"
                  ? "✔️ Sesi telah selesai"
                  : "🕒 Menunggu dokter mengkonfirmasi sesi"}
              </p>
            </div>

            {/* Area Chat */}
            <div className="h-[500px] overflow-y-auto p-4 space-y-4">
              {chatState.messages.length > 0 ? (
                chatState.messages.map((pesan, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      pesan.pengirim === "pasien"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        pesan.pengirim === "pasien"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      <p className="text-sm">{pesan.isi}</p>
                      <small className="text-xs block mt-1">
                        {new Date(pesan.waktu_kirim).toLocaleTimeString()} •{" "}
                        {pesan.pengirim === "pasien" ? "Anda" : "Dokter"}
                      </small>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">Belum ada pesan</p>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Chat */}
            <div className="border-t p-4">
              <form onSubmit={handleSendMessage}>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={
                      isInputEnabled ? "Ketik pesan..." : "Sesi belum aktif"
                    }
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className={`flex-1 border rounded-l-lg px-4 py-2 focus:outline-none ${
                      !isInputEnabled && "bg-gray-100 cursor-not-allowed"
                    }`}
                    disabled={!isInputEnabled}
                  />
                  <button
                    type="submit"
                    disabled={!isInputEnabled}
                    className={`bg-blue-600 text-white px-4 py-2 rounded-r-lg transition-colors ${
                      !isInputEnabled && "opacity-50 cursor-not-allowed"
                    }`}
                  >
                    Kirim
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Konsultasi;
