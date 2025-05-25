// src/pages/admin/konsultasi/ChatTab.jsx

import React, { useState, useEffect } from "react";
import { ChevronLeft, User, Lock } from "lucide-react";
import {
  getChatListForAdmin,
  getChatDetail,
  kirimPesanAdmin,
  aktifkanSesi,
  akhiriSesiAdmin,
} from "../../../redux-admin/action/adminChatAction";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

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
    if (selectedChatId) {
      dispatch(getChatDetail(selectedChatId));
    }
  }, [selectedChatId, dispatch, userRole]);

  const handleChatSelect = (chat) => {
    setSelectedChatId(chat.id_chat);
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
        pengirim: "admin",
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

    if (window.confirm("Apakah Anda yakin ingin mengakhiri sesi ini?")) {
      dispatch(akhiriSesiAdmin(activeChat.id_chat))
        .unwrap()
        .then(() => {
          dispatch(getChatDetail(activeChat.id_chat));
          toast.success("Sesi berhasil diakhiri");
        })
        .catch((err) => {
          toast.error("Gagal mengakhiri sesi: " + err);
        });
    }
  };

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
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
                <User className="h-5 w-5" />
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
                      className={`rounded-lg p-3 max-w-xs md:max-w-md ${
                        msg.pengirim === "pasien"
                          ? "bg-gray-100"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      <p className="text-sm">{msg.isi}</p>
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

              {activeChat.status === "pending" && (
                <button
                  onClick={handleAktifkanSesi}
                  className="mt-2 bg-green-500 text-white px-4 py-1 rounded text-sm hover:bg-green-600 transition"
                >
                  Aktifkan Sesi
                </button>
              )}

              {activeChat.status === "aktif" && (
                <button
                  onClick={handleAkhiriSesi}
                  className="mt-2 bg-red-500 text-white px-4 py-1 rounded text-sm hover:bg-red-600 transition"
                >
                  Akhiri Sesi
                </button>
              )}
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
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
                      <User className="h-5 w-5" />
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
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
                    <User className="h-5 w-5" />
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
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
                <User className="h-5 w-5" />
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
                      className={`rounded-lg p-3 max-w-xs md:max-w-md ${
                        msg.pengirim === "pasien"
                          ? "bg-gray-100"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      <p className="text-sm">{msg.isi}</p>
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

              {activeChat.status === "pending" && (
                <button
                  onClick={handleAktifkanSesi}
                  className="mt-2 bg-green-500 text-white px-4 py-1 rounded text-sm hover:bg-green-600 transition"
                >
                  Aktifkan Sesi
                </button>
              )}

              {activeChat.status === "aktif" && (
                <button
                  onClick={handleAkhiriSesi}
                  className="mt-2 bg-red-500 text-white px-4 py-1 rounded text-sm hover:bg-red-600 transition"
                >
                  Akhiri Sesi
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-gray-100 rounded-lg shadow flex items-center justify-center md:col-span-2">
            <p className="text-gray-500">Pilih percakapan untuk memulai</p>
          </div>
        )}
      </div>
    </>
  );
}
