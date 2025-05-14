"use client";

import { ChevronLeft, User } from "lucide-react";
import { useState } from "react";
import { dummyChats } from "../dummydata";

export default function ChatTab({ isMobile }) {
  const [selectedChat, setSelectedChat] = useState(null);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  return (
    <>
      {/* Mobile Chat View */}
      <div className="md:hidden">
        {selectedChat ? (
          <div className="bg-white rounded-lg shadow overflow-hidden h-[calc(100vh-12rem)]">
            <div className="p-4 border-b flex items-center">
              <button onClick={() => setSelectedChat(null)} className="mr-2">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
                <User className="h-5 w-5" />
              </div>
              <div>
                <div className="font-medium">{selectedChat.patient}</div>
                <div className="text-xs text-gray-500">Online</div>
              </div>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100vh-20rem)] space-y-4">
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                  <p className="text-sm">
                    Selamat pagi dok, gigi saya masih terasa nyeri setelah
                    perawatan kemarin.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">09:30</p>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-blue-500 text-white rounded-lg p-3 max-w-xs">
                  <p className="text-sm">
                    Selamat pagi Pak Budi. Apakah nyerinya terasa terus-menerus
                    atau hanya saat mengunyah?
                  </p>
                  <p className="text-xs text-blue-200 mt-1">09:35</p>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                  <p className="text-sm">
                    Nyerinya terasa saat minum air dingin dok.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">09:40</p>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-blue-500 text-white rounded-lg p-3 max-w-xs">
                  <p className="text-sm">
                    Baik, sepertinya gigi Anda sensitif terhadap suhu dingin.
                    Ini normal setelah perawatan. Cobalah untuk menghindari
                    minuman dingin untuk 2-3 hari. Jika nyeri tidak berkurang,
                    silakan datang ke klinik untuk pemeriksaan lebih lanjut.
                  </p>
                  <p className="text-xs text-blue-200 mt-1">09:45</p>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                  <p className="text-sm">
                    Baik dok, terima kasih atas sarannya. Saya akan coba hindari
                    minuman dingin dulu.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">09:50</p>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-blue-500 text-white rounded-lg p-3 max-w-xs">
                  <p className="text-sm">
                    Sama-sama Pak Budi. Jangan ragu untuk menghubungi saya jika
                    ada keluhan lain.
                  </p>
                  <p className="text-xs text-blue-200 mt-1">09:55</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Ketik pesan..."
                  className="flex-1 border rounded-md px-3 py-2 text-sm"
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                  Kirim
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Daftar Percakapan</h2>
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Cari percakapan..."
                  className="w-full border rounded-md px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="overflow-y-auto max-h-[calc(100vh-16rem)]">
              {dummyChats.map((chat) => (
                <div
                  key={chat.id}
                  className="p-4 border-b hover:bg-gray-50 cursor-pointer flex items-center"
                  onClick={() => handleChatSelect(chat)}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium">{chat.patient}</span>
                      <span className="text-xs text-gray-500">{chat.time}</span>
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {chat.lastMessage}
                    </div>
                  </div>
                  {chat.unread && (
                    <div className="w-2 h-2 rounded-full bg-blue-500 ml-2"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Chat View */}
      <div className="hidden md:grid md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Daftar Percakapan</h2>
            <div className="mt-2">
              <input
                type="text"
                placeholder="Cari percakapan..."
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="overflow-y-auto h-[calc(100vh-16rem)]">
            {dummyChats.map((chat) => (
              <div
                key={chat.id}
                className="p-4 border-b hover:bg-gray-50 cursor-pointer flex items-center"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
                  <User className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{chat.patient}</span>
                    <span className="text-xs text-gray-500">{chat.time}</span>
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {chat.lastMessage}
                  </div>
                </div>
                {chat.unread && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 ml-2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden md:col-span-2">
          <div className="p-4 border-b flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
              <User className="h-5 w-5" />
            </div>
            <div>
              <div className="font-medium">Budi Santoso</div>
              <div className="text-xs text-gray-500">Online</div>
            </div>
          </div>
          <div className="p-4 overflow-y-auto h-[calc(100vh-20rem)] space-y-4">
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3 max-w-xs md:max-w-md">
                <p className="text-sm">
                  Selamat pagi dok, gigi saya masih terasa nyeri setelah
                  perawatan kemarin.
                </p>
                <p className="text-xs text-gray-500 mt-1">09:30</p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-blue-500 text-white rounded-lg p-3 max-w-xs md:max-w-md">
                <p className="text-sm">
                  Selamat pagi Pak Budi. Apakah nyerinya terasa terus-menerus
                  atau hanya saat mengunyah?
                </p>
                <p className="text-xs text-blue-200 mt-1">09:35</p>
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3 max-w-xs md:max-w-md">
                <p className="text-sm">
                  Nyerinya terasa saat minum air dingin dok.
                </p>
                <p className="text-xs text-gray-500 mt-1">09:40</p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-blue-500 text-white rounded-lg p-3 max-w-xs md:max-w-md">
                <p className="text-sm">
                  Baik, sepertinya gigi Anda sensitif terhadap suhu dingin. Ini
                  normal setelah perawatan. Cobalah untuk menghindari minuman
                  dingin untuk 2-3 hari. Jika nyeri tidak berkurang, silakan
                  datang ke klinik untuk pemeriksaan lebih lanjut.
                </p>
                <p className="text-xs text-blue-200 mt-1">09:45</p>
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3 max-w-xs md:max-w-md">
                <p className="text-sm">
                  Baik dok, terima kasih atas sarannya. Saya akan coba hindari
                  minuman dingin dulu.
                </p>
                <p className="text-xs text-gray-500 mt-1">09:50</p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-blue-500 text-white rounded-lg p-3 max-w-xs md:max-w-md">
                <p className="text-sm">
                  Sama-sama Pak Budi. Jangan ragu untuk menghubungi saya jika
                  ada keluhan lain.
                </p>
                <p className="text-xs text-blue-200 mt-1">09:55</p>
              </div>
            </div>
          </div>
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Ketik pesan..."
                className="flex-1 border rounded-md px-3 py-2 text-sm"
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                Kirim
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
