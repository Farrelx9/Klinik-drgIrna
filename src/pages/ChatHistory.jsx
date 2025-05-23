import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getRiwayatChat } from "../redux/actions/chatActions"; // Pastikan fungsi ini ada di actions
import { toast } from "react-toastify";
import { ClockIcon, XCircle } from "lucide-react";

const ChatHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const chatState = useSelector((state) => state.chat);
  const { riwayatChat, isLoading, error } = chatState;

  const user = JSON.parse(localStorage.getItem("user"));
  const id_pasien = user?.pasien?.id_pasien;

  useEffect(() => {
    if (!id_pasien) {
      toast.warn("Anda harus login dulu.");
      navigate("/login");
      return;
    }

    dispatch(getRiwayatChat(id_pasien));
  }, [dispatch, id_pasien]);

  if (isLoading) {
    return (
      <div className="p-4 bg-gray-100 text-center rounded-md">
        Memuat riwayat chat...
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-600 text-center">{error}</div>;
  }

  return (
    <div className="w-72 bg-white shadow-md rounded-lg p-4 h-fit sticky top-4 self-start border-r border-gray-200">
      {/* Judul */}
      <h2 className="text-xl font-bold mb-4">Riwayat Chat</h2>

      {/* Input Pencarian */}
      <input
        type="text"
        placeholder="Cari percakapan..."
        className="mb-4 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Daftar Riwayat Chat */}
      <ul className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
        {Array.isArray(riwayatChat) && riwayatChat.length > 0 ? (
          riwayatChat.map((chat) => {
            const lastMessage = chat.messages[0]?.isi || "Belum ada pesan";
            const formattedDate = new Date(chat.waktu_mulai).toLocaleDateString(
              "id-ID",
              {
                day: "numeric",
                month: "short",
                year: "numeric",
              }
            );

            return (
              <li
                key={chat.id_chat}
                onClick={() =>
                  navigate(`/chat?id=${chat.id_chat}&status=${chat.status}`)
                }
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-blue-50 ${
                  chat.status === "aktif"
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : chat.status === "selesai"
                    ? "bg-gray-50 opacity-80"
                    : "bg-gray-50"
                }`}
              >
                {/* Avatar atau Icon */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                    {chat.pasien.nama.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Detail Chat */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-800 truncate">
                    {chat.pasien.nama || "Pasien"}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {lastMessage}
                  </div>
                  <div className="flex items-center justify-between mt-1 text-xs text-gray-400">
                    <span>{formattedDate}</span>
                    <span className="flex items-center">
                      {chat.status === "aktif" ? (
                        <>
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                          <span>Aktif</span>
                        </>
                      ) : chat.status === "selesai" ? (
                        <>
                          <XCircle className="w-3 h-3 mr-1" />
                          <span>Selesai</span>
                        </>
                      ) : (
                        <>
                          <ClockIcon className="w-3 h-3 mr-1" />
                          <span>Pending</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </li>
            );
          })
        ) : (
          <li className="text-center py-6 text-gray-400 text-sm">
            Belum ada riwayat chat
          </li>
        )}
      </ul>
    </div>
  );
};

export default ChatHistory;
