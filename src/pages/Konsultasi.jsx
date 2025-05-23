import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { getRiwayatChat, kirimPesan } from "../redux/actions/chatActions";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getSesiAktifByPasien } from "../redux/actions/konsultasiApi";

const Konsultasi = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef(null);

  const queryParams = new URLSearchParams(location.search);
  const id_chat = queryParams.get("id");

  const chat = useSelector((state) => state.chat || {});
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [sessionStatus, setSessionStatus] = useState(null);

  // Scroll otomatis ke bawah
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch riwayat chat dan status sesi
  useEffect(() => {
    if (!id_chat) {
      toast.warn("ID chat tidak ditemukan.");
      navigate("/jadwal-konsultasi");
      return;
    }

    // Ambil riwayat chat
    dispatch(getRiwayatChat(id_chat))
      .unwrap()
      .then((data) => {
        setMessages(data || []);
      })
      .catch((err) => {
        console.error("Gagal ambil riwayat chat:", err);
        toast.error("Tidak ada riwayat chat tersedia.");
      });

    // Ambil status sesi chat
    // Catatan: getSesiAktifByPasien di backend saat ini mencari status 'aktif'.
    // Anda mungkin perlu endpoint backend baru yang mengambil status berdasarkan id_chat.
    // Untuk sementara, kita panggil ini, tapi mungkin tidak akan mengembalikan status jika belum 'aktif'.
    const user = JSON.parse(localStorage.getItem("user"));
    const id_pasien = user?.pasien?.id_pasien;

    if (id_pasien) {
      dispatch(getSesiAktifByPasien(id_pasien))
        .unwrap()
        .then((data) => {
          if (data && data.status) {
            setSessionStatus(data.status); // Set status sesi
          } else {
            setSessionStatus("unknown"); // Atau status default jika tidak ditemukan/aktif
            toast.info("Sesi chat belum aktif."); // Beri tahu pengguna jika sesi tidak aktif
          }
        })
        .catch((err) => {
          console.error("Gagal ambil status sesi aktif:", err);
          setSessionStatus("error"); // Tandai error status
          toast.error("Gagal mengambil status sesi.");
        });
    }
  }, [dispatch, id_chat, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handler saat form pesan disubmit
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !id_chat) {
      return; // Jangan kirim jika pesan kosong atau id_chat tidak ada
    }

    const pengirim = "pasien"; // Atau tentukan pengirim berdasarkan user login

    try {
      await dispatch(
        kirimPesan({ isi: inputMessage, pengirim, id_chat })
      ).unwrap();
      setInputMessage(""); // Kosongkan input setelah berhasil kirim
      // Pesan baru akan ditambahkan ke state oleh chatSlice saat kirimPesan.fulfilled
    } catch (error) {
      console.error("Gagal mengirim pesan:", error);
      toast.error("Gagal mengirim pesan.");
    }
  };

  // Tentukan apakah input pesan aktif
  const isInputEnabled = sessionStatus === "aktif";

  // Render UI
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Chat Header */}
            <div className="bg-blue-600 text-white p-4">
              <div className="flex items-center">
                <span className="ml-2 text-xl">Dr. Irna - Dokter Gigi</span>
              </div>
            </div>

            {/* Pesan Chat */}
            <div className="h-[500px] overflow-y-auto p-4 space-y-4">
              {messages.length > 0 ? (
                messages.map((pesan, index) => (
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
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder={
                      isInputEnabled ? "Ketik pesan..." : "Sesi belum aktif"
                    }
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className={`flex-1 border rounded-l-lg px-4 py-2 focus:outline-none ${
                      !isInputEnabled && "bg-gray-200 cursor-not-allowed"
                    }`}
                    disabled={!isInputEnabled}
                  />
                  <button
                    type="submit"
                    className={`bg-blue-600 text-white px-4 py-2 rounded-r-lg ${
                      !isInputEnabled && "opacity-50 cursor-not-allowed"
                    }`}
                    disabled={!isInputEnabled}
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
