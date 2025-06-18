// src/pages/admin/konsultasi/ChatTab.jsx

import React, { useState, useEffect } from "react";
import { ChevronLeft, User, Lock } from "lucide-react";
import {
  getChatListForAdmin,
  getChatDetail,
  kirimPesanAdmin,
  aktifkanSesi,
  akhiriSesiAdmin,
  markAllMessagesAsReadAdminThunk,
  fetchUnreadCountAdmin,
} from "../../../redux-admin/action/adminChatAction";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setUnreadCounts } from "../../../redux-admin/reducer/adminChatSlice";
import { io } from "socket.io-client";
import { socketDebug } from "../../../utils/socketDebug";

export default function ChatTab({ isMobile }) {
  const dispatch = useDispatch();
  const { chatList, activeChat, isLoading, error, meta } = useSelector(
    (state) => state.chatAdmin
  );
  const userRole = useSelector((state) => state.authAdmin.role);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [pesanInput, setPesanInput] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(meta.totalPages || 1);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showEndSessionConfirm, setShowEndSessionConfirm] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState({
    diagnosis: "",
    medications: [{ name: "", dosage: "", instruction: "" }],
    notes: "",
    berlakuSampai: "2025-12-31",
  });
  const unreadCounts = useSelector((state) => state.chatAdmin.unreadCounts);

  // Socket state
  const [socket, setSocket] = useState(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  // Get admin user info
  const adminUser = JSON.parse(localStorage.getItem("adminUser"));
  const id_user = adminUser?.id_user;

  // Initialize socket connection for admin
  useEffect(() => {
    if (!id_user || userRole !== "dokter") return;

    const newSocket = io("https://bejs-klinik.vercel.app/", {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("Admin socket connected");
      setIsSocketConnected(true);
      newSocket.emit("join-admin-notifications", id_user);
      newSocket.emit("join-admin-chat-room", id_user);
    });

    newSocket.on("disconnect", () => {
      console.log("Admin socket disconnected");
      setIsSocketConnected(false);
    });

    // Listen for new messages from patients
    newSocket.on("new-patient-message", (data) => {
      console.log("New patient message received:", data);

      if (data.chatId) {
        // Update unread count for this chat
        dispatch(
          setUnreadCounts({
            ...unreadCounts,
            [data.chatId]: (unreadCounts[data.chatId] || 0) + 1,
          })
        );
      }

      // Show toast notification
      toast.info(
        `Pesan baru dari pasien: ${data.message || "Ada pesan baru"}`,
        {
          position: "top-right",
          autoClose: 3000,
        }
      );

      // Refresh chat list and detail if this chat is active
      dispatch(getChatListForAdmin({ page, limit: 5 }));
      if (selectedChatId === data.chatId) {
        dispatch(getChatDetail(data.chatId));
      }
    });

    // Listen for chat updates
    newSocket.on("chat-updated-admin", (data) => {
      console.log("Chat updated for admin:", data);
      if (data.chatId === selectedChatId) {
        dispatch(getChatDetail(data.chatId));
      }
      dispatch(getChatListForAdmin({ page, limit: 5 }));
    });

    setSocket(newSocket);

    // Expose socket to window for debugging
    if (typeof window !== "undefined") {
      window.adminSocket = newSocket;
    }

    return () => {
      if (newSocket) {
        newSocket.emit("leave-admin-notifications", id_user);
        newSocket.emit("leave-admin-chat-room", id_user);
        newSocket.disconnect();
      }
    };
  }, [id_user, userRole, dispatch, page, selectedChatId]);

  useEffect(() => {
    if (userRole !== "dokter") return;

    dispatch(getChatListForAdmin({ page, limit: 5 }));
  }, [dispatch, page, userRole]);

  useEffect(() => {
    if (userRole !== "dokter") return;
    if (meta && meta.totalPages) {
      setTotalPages(meta.totalPages);
    }
  }, [meta, userRole]);

  useEffect(() => {
    if (userRole !== "dokter") return;
    let intervalId;
    if (selectedChatId && isInputFocused) {
      intervalId = setInterval(() => {
        dispatch(getChatDetail(selectedChatId));
        console.log("Polling for admin messages...");
      }, 2000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [selectedChatId, dispatch, userRole, isInputFocused]);

  useEffect(() => {
    if (userRole !== "dokter") return;
    if (selectedChatId) {
      dispatch(getChatDetail(selectedChatId));
    }
  }, [selectedChatId, dispatch, userRole]);

  useEffect(() => {
    if (chatList.length > 0) {
      Promise.all(
        chatList.map((chat) =>
          fetchUnreadCountAdmin(chat.id_chat).then((count) => ({
            id: chat.id_chat,
            count,
          }))
        )
      ).then((results) => {
        const counts = {};
        results.forEach(({ id, count }) => {
          counts[id] = count;
        });
        dispatch(setUnreadCounts(counts));
        console.log("Unread counts:", counts);
      });
    }
  }, [chatList, dispatch]);

  const handleChatSelect = async (chat) => {
    setSelectedChatId(chat.id_chat);

    // Mark all messages as read via thunk
    const result = await dispatch(
      markAllMessagesAsReadAdminThunk(chat.id_chat)
    );
    if (markAllMessagesAsReadAdminThunk.fulfilled.match(result)) {
      // Setelah mark as read, fetch unread count ulang agar bubble hilang
      const count = await fetchUnreadCountAdmin(chat.id_chat);
      dispatch(setUnreadCounts({ ...unreadCounts, [chat.id_chat]: count }));
    } else {
      toast.error(result.payload || "Gagal mark as read");
    }

    // Fetch detail chat seperti biasa
    dispatch(getChatDetail(chat.id_chat));
  };

  const handleKirimPesan = (e) => {
    e.preventDefault();

    if (!activeChat || activeChat.status !== "aktif") {
      toast.warn("Sesi belum aktif");
      return;
    }

    if (!pesanInput.trim()) {
      toast.warn("Isi pesan tidak boleh kosong");
      return;
    }

    dispatch(
      kirimPesanAdmin({
        isi: pesanInput,
        pengirim: "dokter",
        id_chat: activeChat.id_chat,
      })
    )
      .unwrap()
      .then(() => {
        setPesanInput("");
        toast.success("Pesan berhasil dikirim");
      })
      .catch((err) => {
        toast.error("Gagal mengirim pesan: " + err);
      });
  };

  const handleAktifkanSesi = () => {
    if (!activeChat || activeChat.status !== "pending") {
      toast.warn("Hanya sesi pending yang bisa diaktifkan");
      return;
    }

    dispatch(aktifkanSesi(activeChat.id_chat))
      .unwrap()
      .then(() => {
        dispatch(getChatDetail(activeChat.id_chat));
        toast.success("Sesi berhasil diaktifkan");
      })
      .catch((err) => {
        toast.error("Gagal mengaktifkan sesi: " + err);
      });
  };

  const handleAkhiriSesi = () => {
    if (!activeChat || activeChat.status !== "aktif") {
      toast.warn("Hanya sesi aktif yang bisa diakhiri");
      return;
    }
    setShowEndSessionConfirm(true);
  };

  const confirmEndSession = async () => {
    if (activeChat) {
      try {
        await dispatch(akhiriSesiAdmin(activeChat.id_chat)).unwrap();
        toast.success("Sesi berhasil diakhiri");
      } catch (err) {
        console.error("Gagal mengakhiri sesi:", err);
        toast.error(
          "Gagal mengakhiri sesi: " + (err.message || "Server error")
        );
      }
    }
    setShowEndSessionConfirm(false);
  };

  const cancelEndSession = () => {
    setShowEndSessionConfirm(false);
  };

  // Prescription functions
  const handleOpenPrescriptionModal = () => {
    setShowPrescriptionModal(true);
  };

  const handleClosePrescriptionModal = () => {
    setShowPrescriptionModal(false);
    setPrescriptionData({
      diagnosis: "",
      medications: [{ name: "", dosage: "", instruction: "" }],
      notes: "",
      berlakuSampai: "2025-12-31",
    });
  };

  const addMedication = () => {
    setPrescriptionData((prev) => ({
      ...prev,
      medications: [
        ...prev.medications,
        { name: "", dosage: "", instruction: "" },
      ],
    }));
  };

  const removeMedication = (index) => {
    if (prescriptionData.medications.length > 1) {
      setPrescriptionData((prev) => ({
        ...prev,
        medications: prev.medications.filter((_, i) => i !== index),
      }));
    }
  };

  const updateMedication = (index, field, value) => {
    setPrescriptionData((prev) => ({
      ...prev,
      medications: prev.medications.map((med, i) =>
        i === index ? { ...med, [field]: value } : med
      ),
    }));
  };

  const handleSendPrescription = () => {
    if (!prescriptionData.diagnosis.trim()) {
      toast.warn("Diagnosis harus diisi");
      return;
    }

    if (
      prescriptionData.medications.some(
        (med) => !med.name.trim() || !med.dosage.trim()
      )
    ) {
      toast.warn("Semua obat harus diisi nama dan dosis");
      return;
    }

    // Format prescription as a message
    const prescriptionMessage = formatPrescriptionMessage(prescriptionData);

    // Send as regular message
    dispatch(
      kirimPesanAdmin({
        isi: prescriptionMessage,
        pengirim: "dokter",
        id_chat: activeChat.id_chat,
      })
    )
      .unwrap()
      .then(() => {
        setPesanInput("");
        handleClosePrescriptionModal();
        toast.success("Resep berhasil dikirim");
      })
      .catch((err) => {
        toast.error("Gagal mengirim resep: " + err);
      });
  };

  const formatPrescriptionMessage = (data) => {
    const date = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // Table column widths
    const col1 = 12,
      col2 = 10,
      col3 = 14;
    const pad = (str, len) => (str || "").padEnd(len, " ");
    const gap = "  "; // 2 spaces gap between columns

    let message = `📋 RESEP MEDIS\n`;
    message += `Tanggal: ${date}\n`;
    message += `Pasien: ${activeChat.pasien?.nama || "Pasien"}\n`;
    message += `Diagnosis: ${data.diagnosis}\n\n`;

    message += `💊 OBAT-OBATAN:\n`;
    message += `┌${"─".repeat(col1 + 2)}┬${"─".repeat(col2 + 2)}┬${"─".repeat(
      col3 + 2
    )}┐\n`;
    message += `│ ${pad("Nama Obat", col1)} │${gap}${pad(
      "Dosis",
      col2
    )} │${gap}${pad("Cara Pakai", col3)} │\n`;
    message += `├${"─".repeat(col1 + 2)}┼${"─".repeat(col2 + 2)}┼${"─".repeat(
      col3 + 2
    )}┤\n`;

    data.medications.forEach((med) => {
      message += `│ ${pad(med.name, col1)} │${gap}${pad(
        med.dosage,
        col2
      )} │${gap}${pad(med.instruction, col3)} │\n`;
    });

    message += `└${"─".repeat(col1 + 2)}┴${"─".repeat(col2 + 2)}┴${"─".repeat(
      col3 + 2
    )}┘\n`;

    if (data.notes.trim()) {
      message += `\n📝 Catatan: ${data.notes}\n`;
    }

    message += `\nDokter: ${defaultDoctor}\n`;
    message += `SIP: ${defaultSIP}\n`;
    message += `Berlaku sampai: ${
      data.berlakuSampai
        ? new Date(data.berlakuSampai).toLocaleDateString("id-ID")
        : "-"
    }`;

    return message;
  };

  const defaultDoctor = "drg. Irna";
  const defaultSIP = "500.16.7.2/2105/B/IP.DG/436 7.15/2024";

  if (userRole !== "dokter") {
    return (
      <div className="flex items-center justify-center h-full bg-white rounded-lg shadow p-6 font-poppins">
        <div className="text-center">
          <Lock className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Akses Dibatasi
          </h2>
          <p className="text-gray-600">
            Halaman ini hanya dapat diakses oleh pengguna dengan peran Dokter.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden">
        {selectedChatId && activeChat ? (
          <div className="flex flex-col bg-white rounded-lg shadow overflow-hidden h-[calc(100vh-12rem)]">
            <div className="p-4 border-b flex items-center">
              <button onClick={() => setSelectedChatId(null)} className="mr-2">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3 relative">
                <User className="h-5 w-5" />
                {unreadCounts[selectedChatId] > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white">
                    {unreadCounts[selectedChatId]}
                  </span>
                )}
              </div>
              <div>
                <div className="font-medium">
                  {activeChat.pasien?.nama || "Pasien"}
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
            <div className="p-4 overflow-y-auto flex-grow space-y-4">
              {isLoading ? (
                <div className="text-center">Memuat pesan...</div>
              ) : activeChat?.messages?.length > 0 ? (
                activeChat.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.pengirim === "pasien"
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    <div
                      className={`rounded-lg p-3 ${
                        msg.pengirim === "pasien"
                          ? "bg-gray-100"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      {msg.isi.startsWith("📋 RESEP MEDIS") ? (
                        <div style={{ display: "inline-block" }}>
                          <pre className="font-mono text-xs whitespace-pre">
                            {msg.isi}
                          </pre>
                        </div>
                      ) : (
                        <span>{msg.isi}</span>
                      )}
                      <small
                        className={`text-xs block mt-1 ${
                          msg.pengirim === "pasien"
                            ? "text-gray-500"
                            : "text-blue-200"
                        }`}
                      >
                        {new Date(msg.waktu_kirim).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </small>
                    </div>
                  </div>
                ))
              ) : activeChat?.status === "aktif" ? (
                <div className="text-center text-gray-400 py-6">
                  Belum ada pesan
                </div>
              ) : (
                <div className="text-center text-gray-500 py-6">
                  Sesi belum diaktifkan.
                </div>
              )}
            </div>

            {/* Input Chat */}
            <div className="p-4 border-t">
              <form onSubmit={handleKirimPesan}>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Ketik pesan..."
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

              <div className="flex flex-wrap gap-2 mt-2">
                {activeChat.status === "pending" && (
                  <button
                    onClick={handleAktifkanSesi}
                    className="bg-green-500 text-white px-4 py-1 rounded text-sm hover:bg-green-600 transition"
                  >
                    Aktifkan Sesi
                  </button>
                )}

                {activeChat.status === "aktif" && (
                  <>
                    <button
                      onClick={handleAkhiriSesi}
                      className="bg-red-500 text-white px-4 py-1 rounded text-sm hover:bg-red-600 transition"
                    >
                      Akhiri Sesi
                    </button>
                    <button
                      onClick={handleOpenPrescriptionModal}
                      className="bg-purple-500 text-white px-4 py-1 rounded text-sm hover:bg-purple-600 transition"
                    >
                      📋 Kirim Resep
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col bg-white rounded-lg shadow overflow-hidden h-[calc(100vh-12rem)]">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Daftar Percakapan</h2>
              <input
                type="text"
                placeholder="Cari percakapan..."
                className="w-full border rounded-md px-3 py-2 text-sm mt-2"
              />
            </div>

            <div className="overflow-y-auto flex-grow">
              {isLoading ? (
                <div className="p-4 text-center">Memuat...</div>
              ) : error ? (
                <div className="p-4 text-center text-red-500">{error}</div>
              ) : chatList.length > 0 ? (
                chatList.map((chat) => (
                  <div
                    key={chat.id_chat}
                    className="p-4 border-b hover:bg-gray-50 cursor-pointer flex items-center"
                    onClick={() => handleChatSelect(chat)}
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3 relative">
                      <User className="h-5 w-5" />
                      {unreadCounts[chat.id_chat] > 0 && (
                        <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white">
                          {unreadCounts[chat.id_chat]}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {chat.pasien?.nama || "Pasien"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(chat.waktu_mulai).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {chat.messages?.[0]?.isi ?? "Belum ada pesan"}
                      </div>
                    </div>
                    {/* Status Label */}
                    {chat.status === "pending" && (
                      <div className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">
                        Pending
                      </div>
                    )}
                    {chat.status === "aktif" && (
                      <div className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                        Aktif
                      </div>
                    )}
                    {chat.status === "selesai" && (
                      <div className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                        Selesai
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-4 text-center">Tidak ada percakapan</div>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="p-4 flex justify-between items-center">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className={`px-4 py-2 rounded ${
                  page === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
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
                className={`px-4 py-2 rounded ${
                  page >= totalPages
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden md:grid md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        <div className="flex flex-col bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Daftar Percakapan</h2>
              {/* Socket connection indicator */}
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isSocketConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                  title={
                    isSocketConnected
                      ? "Socket Connected"
                      : "Socket Disconnected"
                  }
                />
                <span className="text-xs text-gray-500">
                  {isSocketConnected ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-y-auto flex-grow">
            {isLoading ? (
              <div className="p-4 text-center">Memuat...</div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">{error}</div>
            ) : chatList.length > 0 ? (
              chatList.map((chat) => (
                <div
                  key={chat.id_chat}
                  className="p-4 border-b hover:bg-gray-50 cursor-pointer flex items-center"
                  onClick={() => handleChatSelect(chat)}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3 relative">
                    <User className="h-5 w-5" />
                    {unreadCounts[chat.id_chat] > 0 && (
                      <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white">
                        {unreadCounts[chat.id_chat]}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium">
                        {chat.pasien?.nama || "Pasien"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(chat.waktu_mulai).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {chat.messages?.[0]?.isi ?? "Belum ada pesan"}
                    </div>
                  </div>
                  {/* Status Label */}
                  {chat.status === "pending" && (
                    <div className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">
                      Pending
                    </div>
                  )}
                  {chat.status === "aktif" && (
                    <div className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                      Aktif
                    </div>
                  )}
                  {chat.status === "selesai" && (
                    <div className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                      Selesai
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-4 text-center">Tidak ada percakapan</div>
            )}
          </div>

          {/* Pagination Controls */}
          <div className="p-4 flex justify-between items-center">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className={`px-4 py-2 rounded ${
                page === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
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
              className={`px-4 py-2 rounded ${
                page >= totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Next
            </button>
          </div>
        </div>

        {activeChat ? (
          <div className="col-span-2 bg-white rounded-lg shadow overflow-hidden flex flex-col">
            <div className="p-4 border-b flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3 relative">
                <User className="h-5 w-5" />
                {unreadCounts[activeChat.id_chat] > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white">
                    {unreadCounts[activeChat.id_chat]}
                  </span>
                )}
              </div>
              <div>
                <div className="font-medium">
                  {activeChat.pasien?.nama || "Pasien"}
                </div>
                <div className="text-xs text-gray-500">Online</div>
              </div>
            </div>

            {/* Riwayat Chat */}
            <div className="p-4 overflow-y-auto flex-grow space-y-4">
              {activeChat?.messages?.length > 0 ? (
                activeChat.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.pengirim === "pasien"
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    <div
                      className={`rounded-lg p-3 ${
                        msg.pengirim === "pasien"
                          ? "bg-gray-100"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      {msg.isi.startsWith("📋 RESEP MEDIS") ? (
                        <div style={{ display: "inline-block" }}>
                          <pre className="font-mono text-xs whitespace-pre">
                            {msg.isi}
                          </pre>
                        </div>
                      ) : (
                        <span>{msg.isi}</span>
                      )}
                      <small
                        className={`text-xs block mt-1 ${
                          msg.pengirim === "pasien"
                            ? "text-gray-500"
                            : "text-blue-200"
                        }`}
                      >
                        {new Date(msg.waktu_kirim).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </small>
                    </div>
                  </div>
                ))
              ) : activeChat.status === "aktif" ? (
                <div className="text-center text-gray-400 py-6">
                  Belum ada pesan
                </div>
              ) : (
                <div className="text-center text-gray-500 py-6">
                  Sesi belum diaktifkan.
                </div>
              )}
            </div>

            {/* Input Chat */}
            <div className="p-4 border-t">
              <form onSubmit={handleKirimPesan}>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Ketik pesan..."
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

              <div className="flex flex-wrap gap-2 mt-2">
                {activeChat.status === "pending" && (
                  <button
                    onClick={handleAktifkanSesi}
                    className="bg-green-500 text-white px-4 py-1 rounded text-sm hover:bg-green-600 transition"
                  >
                    Aktifkan Sesi
                  </button>
                )}

                {activeChat.status === "aktif" && (
                  <>
                    <button
                      onClick={handleAkhiriSesi}
                      className="bg-red-500 text-white px-4 py-1 rounded text-sm hover:bg-red-600 transition"
                    >
                      Akhiri Sesi
                    </button>
                    <button
                      onClick={handleOpenPrescriptionModal}
                      className="bg-purple-500 text-white px-4 py-1 rounded text-sm hover:bg-purple-600 transition"
                    >
                      📋 Kirim Resep
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-100 rounded-lg shadow flex items-center justify-center md:col-span-2">
            <p className="text-gray-500">Pilih percakapan untuk memulai</p>
          </div>
        )}
      </div>

      {/* Modal Konfirmasi Akhiri Sesi */}
      {showEndSessionConfirm && activeChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">
                Konfirmasi Akhiri Sesi
              </h3>
              <p className="text-gray-600 mb-6">
                Apakah Anda yakin ingin mengakhiri sesi chat dengan pasien{" "}
                {activeChat.pasien?.nama || "ini"}?
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={cancelEndSession}
                  className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  onClick={confirmEndSession}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Akhiri Sesi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Resep */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">📋 Buat Resep Medis</h3>
              <button
                onClick={handleClosePrescriptionModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Diagnosis */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnosis *
                </label>
                <textarea
                  value={prescriptionData.diagnosis}
                  onChange={(e) =>
                    setPrescriptionData((prev) => ({
                      ...prev,
                      diagnosis: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Masukkan diagnosis pasien..."
                />
              </div>

              {/* Medications */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Obat-obatan *
                  </label>
                  <button
                    type="button"
                    onClick={addMedication}
                    className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    + Tambah Obat
                  </button>
                </div>

                <div className="space-y-3">
                  {prescriptionData.medications.map((med, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-700">
                          Obat #{index + 1}
                        </span>
                        {prescriptionData.medications.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMedication(index)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Hapus
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Nama Obat *
                          </label>
                          <input
                            type="text"
                            value={med.name}
                            onChange={(e) =>
                              updateMedication(index, "name", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Contoh: Paracetamol"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Dosis *
                          </label>
                          <input
                            type="text"
                            value={med.dosage}
                            onChange={(e) =>
                              updateMedication(index, "dosage", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Contoh: 500mg 3x sehari"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Cara Pakai
                          </label>
                          <input
                            type="text"
                            value={med.instruction}
                            onChange={(e) =>
                              updateMedication(
                                index,
                                "instruction",
                                e.target.value
                              )
                            }
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Contoh: Diminum setelah makan"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan Tambahan
                </label>
                <textarea
                  value={prescriptionData.notes}
                  onChange={(e) =>
                    setPrescriptionData((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Catatan tambahan untuk pasien..."
                />
              </div>

              {/* Berlaku Sampai */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Berlaku Sampai
                </label>
                <input
                  type="date"
                  value={prescriptionData.berlakuSampai}
                  onChange={(e) =>
                    setPrescriptionData((prev) => ({
                      ...prev,
                      berlakuSampai: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Preview */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Preview Resep:
              </h4>
              <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono">
                {formatPrescriptionMessage(prescriptionData)}
              </pre>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleClosePrescriptionModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleSendPrescription}
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
              >
                Kirim Resep
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
