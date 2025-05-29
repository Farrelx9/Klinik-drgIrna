import React, { useState, useEffect } from "react";
import { ChevronLeft, User, ArrowLeft } from "lucide-react";
import {
  getChatListForUser,
  getChatDetailForUser,
  kirimPesanPasien,
} from "../redux/actions/chatActions";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Konsultasi() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { chatList, activeChat, meta, isLoading, error } = useSelector(
    (state) => state.chat
  );
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [pesanInput, setPesanInput] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(meta.totalPages);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const { id_chat } = useParams();

  // Ambil id_pasien dari localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const id_pasien = user?.pasien?.id_pasien;

  // Load list chat saat komponen mount atau page berubah
  useEffect(() => {
    if (!id_pasien) {
      toast.error("Anda harus login dulu.");
      navigate("/login");
      return;
    }

    dispatch(getChatListForUser({ id_pasien, page, limit: 5 }));
  }, [dispatch, id_pasien, page]);

  // Update totalPages dari meta
  useEffect(() => {
    if (meta && meta.totalPages) {
      setTotalPages(meta.totalPages);
    }
  }, [meta]);

  // Load detail chat saat chat dipilih atau dari URL
  useEffect(() => {
    if (id_chat) {
      dispatch(getChatDetailForUser(id_chat));
    }
  }, [dispatch, id_chat]);

  // Implement polling for new messages
  useEffect(() => {
    let intervalId;
    // Poll only if a chat is selected AND input area is focused
    if (selectedChatId && isInputFocused) {
      intervalId = setInterval(() => {
        dispatch(getChatDetailForUser(selectedChatId));
        console.log("Polling for new messages..."); // Optional: for debugging
      }, 3000); // Poll every 3 seconds (adjust as needed)
    }

    return () => {
      // Clean up the interval
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [dispatch, selectedChatId, isInputFocused]);

  const handleChatSelect = (chat) => {
    setSelectedChatId(chat.id_chat);
    dispatch(getChatDetailForUser(chat.id_chat));
  };

  const handleKirimPesan = (e) => {
    e.preventDefault(); // ⚠️ Cegah refresh halaman

    if (!activeChat || activeChat.status !== "aktif") {
      toast.warn("Sesi belum aktif");
      return;
    }

    if (!pesanInput.trim()) {
      toast.warn("Isi pesan tidak boleh kosong");
      return;
    }

    dispatch(
      kirimPesanPasien({
        isi: pesanInput,
        id_chat: activeChat.id_chat,
      })
    )
      .unwrap()
      .then(() => {
        setPesanInput("");
        toast.success("Pesan berhasil dikirim");
      })
      .catch((err) => {
        console.error("Error saat mengirim pesan:", err);
        toast.error("Gagal mengirim pesan: " + (err || "Server error"));
      });
  };

  return (
    <div className="grid md:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      {/* Daftar Chat */}
      <div className="bg-white rounded-lg shadow overflow-hidden col-span-1">
        <div className="p-4 border-b">
          <div className="flex items-center">
            <button onClick={() => navigate("/")} className="mr-2">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h2 className="text-lg font-semibold">Riwayat Chat</h2>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[70vh] p-4 space-y-3">
          {isLoading ? (
            <p className="text-center text-gray-500">Memuat...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : Array.isArray(chatList) && chatList.length > 0 ? (
            chatList.map((chat) => (
              <div
                key={chat.id_chat}
                onClick={() => handleChatSelect(chat)}
                className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg hover:bg-gray-50 ${
                  selectedChatId === chat.id_chat ? "bg-blue-50" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <User size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                    {chat.pasien.nama || "Pasien"}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {chat.messages[0]?.isi || "Belum ada pesan"}
                  </div>
                </div>
                <div className="flex-shrink-0 text-xs text-gray-400">
                  {new Date(chat.waktu_mulai).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                  })}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400">Tidak ada percakapan</p>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-t">
          <div className="flex justify-between items-center">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className={`px-3 py-1 text-sm rounded ${
                page === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Halaman {page} dari {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className={`px-3 py-1 text-sm rounded ${
                page >= totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Detail Chat */}
      <div className="col-span-2 bg-white rounded-lg shadow overflow-hidden flex flex-col">
        {selectedChatId && activeChat ? (
          <>
            <div className="p-4 border-b flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                <User size={16} />
              </div>
              <div>
                <div className="font-medium">
                  {activeChat.pasien.nama || "Pasien"}
                </div>
                <div
                  className={`text-xs ${
                    activeChat.status === "aktif"
                      ? "text-green-500"
                      : activeChat.status === "pending"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {activeChat.status === "aktif"
                    ? "Sedang aktif"
                    : activeChat.status === "pending"
                    ? "Menunggu aktivasi"
                    : "Sesi selesai"}
                </div>
              </div>
            </div>

            {/* Riwayat Pesan */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
              {Array.isArray(activeChat.messages) &&
              activeChat.messages.length > 0 ? (
                activeChat.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.pengirim === "pasien"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`rounded-lg p-3 max-w-xs md:max-w-md ${
                        msg.pengirim === "pasien"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100"
                      }`}
                    >
                      <p className="text-sm">{msg.isi}</p>
                      <small className="text-xs block mt-1 opacity-80">
                        {new Date(msg.waktu_kirim).toLocaleTimeString("id-ID", {
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })}{" "}
                        • {msg.pengirim === "pasien" ? "Anda" : "Dokter"}
                      </small>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-6">
                  Belum ada pesan
                </div>
              )}
            </div>

            {/* Input Chat */}
            <div className="p-4 border-t">
              <form onSubmit={handleKirimPesan}>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder={
                      activeChat.status === "aktif"
                        ? "Ketik pesan..."
                        : "Sesi belum aktif"
                    }
                    value={pesanInput}
                    onChange={(e) => setPesanInput(e.target.value)}
                    disabled={activeChat.status !== "aktif"}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    className={`flex-1 border rounded-md px-3 py-2 text-sm ${
                      activeChat.status !== "aktif"
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={
                      !pesanInput.trim() || activeChat.status !== "aktif"
                    }
                    className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-blue-300"
                  >
                    Kirim
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <p className="text-gray-500">
              Pilih percakapan dari daftar di samping
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
