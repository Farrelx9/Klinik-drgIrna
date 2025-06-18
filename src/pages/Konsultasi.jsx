import React, { useState, useEffect } from "react";
import { ChevronLeft, User } from "lucide-react";
import {
  getChatListForUser,
  getChatDetailForUser,
  kirimPesanPasien,
  fetchUnreadCountUser,
  markAllMessagesAsReadUser,
} from "../redux/actions/chatActions";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { submitReview } from "../redux/actions/reviewAction";
import { io } from "socket.io-client";
import { socketDebug } from "../utils/socketDebug";

export default function Konsultasi() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    chatList,
    activeChat,
    meta,
    isLoading,
    error: chatError,
  } = useSelector((state) => state.chat);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [pesanInput, setPesanInput] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(meta?.totalPages || 1);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const { id_chat } = useParams();

  // Ambil data pengguna dari localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const id_pasien = user?.pasien?.id_pasien;
  const id_user = user?.id_user;

  // State untuk modal review
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState("");

  // Tambahkan state unreadCounts
  const [unreadCounts, setUnreadCounts] = useState({});

  // Socket state
  const [socket, setSocket] = useState(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    if (!id_user) return;

    const newSocket = io("https://bejs-klinik.vercel.app/", {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected");
      setIsSocketConnected(true);
      newSocket.emit("join-notifications", id_user);
      // Join room untuk chat notifications
      newSocket.emit("join-chat-room", id_user);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsSocketConnected(false);
    });

    // Event untuk notifikasi pesan baru dari dokter
    newSocket.on("new-message", (data) => {
      console.log("New message received:", data);

      // Jika ada chatId, update unread count
      if (data.chatId) {
        setUnreadCounts((prev) => ({
          ...prev,
          [data.chatId]: (prev[data.chatId] || 0) + 1,
        }));
      }

      // Tampilkan toast notification
      toast.info(
        `Pesan baru dari dokter: ${data.message || "Ada pesan baru"}`,
        {
          position: "top-right",
          autoClose: 3000,
        }
      );

      // Refresh chat list dan detail jika chat sedang aktif
      dispatch(getChatListForUser({ id_pasien, page, limit: 5 }));
      if (selectedChatId === data.chatId) {
        dispatch(getChatDetailForUser(data.chatId));
      }
    });

    newSocket.on("unread-message-notification", (data) => {
      console.log("New unread message notification:", data);
      toast.info(data.message, { position: "top-right", autoClose: 3000 });

      if (data.chatId) {
        setUnreadCounts((prev) => ({
          ...prev,
          [data.chatId]: (prev[data.chatId] || 0) + 1,
        }));
      }

      dispatch(getChatListForUser({ id_pasien, page, limit: 5 }));
    });

    newSocket.on("unread-count-update", (data) => {
      console.log("Unread count updated:", data);
      setUnreadCounts((prev) => ({
        ...prev,
        [data.chatId]: data.unreadCount,
      }));
    });

    // Event untuk update chat real-time
    newSocket.on("chat-updated", (data) => {
      console.log("Chat updated:", data);
      if (data.chatId === selectedChatId) {
        dispatch(getChatDetailForUser(data.chatId));
      }
      dispatch(getChatListForUser({ id_pasien, page, limit: 5 }));
    });

    setSocket(newSocket);

    // Expose socket to window for debugging
    if (typeof window !== "undefined") {
      window.patientSocket = newSocket;
    }

    return () => {
      if (newSocket) {
        newSocket.emit("leave-notifications", id_user);
        newSocket.emit("leave-chat-room", id_user);
        newSocket.disconnect();
      }
    };
  }, [id_user, dispatch, id_pasien, page, selectedChatId]);

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

  // Implement polling for new messages (keep existing polling for fallback)
  useEffect(() => {
    let intervalId;
    if (selectedChatId && isInputFocused) {
      intervalId = setInterval(() => {
        dispatch(getChatDetailForUser(selectedChatId));
      }, 2000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [dispatch, selectedChatId, isInputFocused]);

  // Load unread counts for all chats
  useEffect(() => {
    if (chatList.length > 0) {
      Promise.all(
        chatList.map((chat) => {
          return fetchUnreadCountUser(chat.id_chat)
            .then((count) => {
              return { id: chat.id_chat, count };
            })
            .catch((err) => {
              return { id: chat.id_chat, count: 0 };
            });
        })
      ).then((results) => {
        const counts = {};
        results.forEach(({ id, count }) => {
          counts[id] = count;
        });

        setUnreadCounts(counts);
      });
    }
  }, [chatList]);

  const handleChatSelect = async (chat) => {
    setSelectedChatId(chat.id_chat);
    await markAllMessagesAsReadUser(chat.id_chat);
    // Refresh unread count
    const count = await fetchUnreadCountUser(chat.id_chat);
    setUnreadCounts((prev) => ({ ...prev, [chat.id_chat]: count }));
    dispatch(getChatDetailForUser(chat.id_chat));
  };

  const handleKirimPesan = (e) => {
    e.preventDefault(); // Cegah refresh halaman
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
        // Socket notification will be automatically sent from backend
      })
      .catch((err) => {
        toast.error("Gagal mengirim pesan: " + (err || "Server error"));
      });
  };

  const handleSubmitReview = () => {
    if (rating === null || rating < 1 || rating > 5) {
      toast.warn("Pilih rating antara 1 hingga 5");
      return;
    }
    dispatch(
      submitReview({
        id_pasien,
        id_konsultasi: selectedChatId,
        rating,
        komentar: comment,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Ulasan berhasil dikirim!");
        setShowReviewModal(false);
        setRating(null);
        setComment("");
        dispatch(getChatDetailForUser(selectedChatId));
      })
      .catch((err) => {
        toast.error("Gagal mengirim ulasan.");
        console.error("Error submitting review:", err);
      });
  };

  const handleCloseModal = () => {
    setShowReviewModal(false);
    setRating(null);
    setComment("");
  };

  return (
    <div className="grid md:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      {/* Daftar Chat */}
      <div className="bg-white rounded-lg shadow overflow-hidden col-span-1">
        <div className="p-4 border-b">
          <div className="flex items-center">
            <button onClick={() => navigate("/")} className="mr-2">
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h2 className="text-lg font-semibold">Riwayat Chat</h2>
            {/* Socket connection indicator */}
            <div className="ml-auto">
              <div
                className={`w-2 h-2 rounded-full ${
                  isSocketConnected ? "bg-green-500" : "bg-red-500"
                }`}
                title={
                  isSocketConnected ? "Socket Connected" : "Socket Disconnected"
                }
              />
            </div>
          </div>
        </div>
        <div className="overflow-y-auto max-h-[70vh] p-4 space-y-3">
          {isLoading ? (
            <p className="text-center text-gray-500">Memuat...</p>
          ) : chatError ? (
            <p className="text-center text-red-500">{chatError}</p>
          ) : Array.isArray(chatList) && chatList.length > 0 ? (
            chatList.map((chat) => (
              <div
                key={chat.id_chat}
                onClick={() => handleChatSelect(chat)}
                className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg hover:bg-gray-50 ${
                  selectedChatId === chat.id_chat ? "bg-blue-50" : ""
                }`}
              >
                <div className="relative w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <User size={16} />
                  {unreadCounts[chat.id_chat] > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white">
                      {unreadCounts[chat.id_chat]}
                    </span>
                  )}
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
                      className={`rounded-lg p-3 ${
                        msg.pengirim === "pasien"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100"
                      } ${
                        msg.isi.startsWith("📋 RESEP MEDIS")
                          ? ""
                          : "max-w-xs md:max-w-md"
                      }`}
                    >
                      {msg.isi.startsWith("📋 RESEP MEDIS") ? (
                        <div style={{ display: "inline-block" }}>
                          <pre className="font-mono text-xs whitespace-pre">
                            {msg.isi}
                          </pre>
                        </div>
                      ) : (
                        <p className="text-sm">{msg.isi}</p>
                      )}
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
            {/* Tombol Review */}
            {activeChat.status === "selesai" &&
              (!Array.isArray(activeChat.review) ||
                activeChat.review.length === 0) && (
                <div className="p-4 border-t">
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors w-full"
                  >
                    Beri Ulasan
                  </button>
                </div>
              )}
            {Array.isArray(activeChat.review) &&
              activeChat.review.length > 0 && (
                <div className="p-4 border-t">
                  <h4 className="font-semibold mb-2">Ulasan Anda</h4>
                  <div className="mb-2">
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < activeChat.review[0].rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        >
                          ★
                        </span>
                      ))}
                      <span className="text-sm text-gray-600 ml-2">
                        {activeChat.review[0].rating}/5
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {activeChat.review[0].createdAt
                        ? new Date(
                            activeChat.review[0].createdAt
                          ).toLocaleDateString("id-ID")
                        : ""}
                    </div>
                    <div className="text-sm text-gray-700 mt-2">
                      {activeChat.review[0].komentar || (
                        <span className="italic text-gray-400">
                          Tidak ada komentar.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-center text-gray-400">
              Pilih percakapan dari daftar di samping
            </p>
          </div>
        )}
      </div>
      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold mb-4">Beri Ulasan</h3>
            <p className="mb-4 text-sm text-gray-600">
              Terima kasih telah menggunakan layanan kami. Silakan berikan
              ulasan Anda.
            </p>
            {/* Rating */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl focus:outline-none ${
                      rating !== null && star <= rating
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            {/* Komentar */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Komentar (opsional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="4"
                className="w-full border rounded px-3 py-2"
                placeholder="Bagikan pengalaman Anda..."
              />
            </div>
            {/* Tombol Aksi */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={rating === null || rating < 1 || rating > 5}
                className={`px-4 py-2 rounded ${
                  rating >= 1 && rating <= 5
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-blue-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Kirim Ulasan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
