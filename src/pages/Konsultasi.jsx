import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import { FaPaperPlane, FaUserMd, FaUser } from "react-icons/fa";

export default function Konsultasi() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Selamat datang di konsultasi online dengan dokter gigi. Ada yang bisa saya bantu?",
      sender: "doctor",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const message = {
      id: messages.length + 1,
      text: newMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages([...messages, message]);
    setNewMessage("");

    // Simulate doctor's response after 1 second
    setTimeout(() => {
      const doctorResponse = {
        id: messages.length + 2,
        text: "Terima kasih atas pertanyaan Anda. Saya akan membantu Anda dengan masalah tersebut.",
        sender: "doctor",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prevMessages) => [...prevMessages, doctorResponse]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Chat Header */}
            <div className="bg-blue-600 text-white p-4">
              <div className="flex items-center">
                <FaUserMd className="text-2xl mr-3" />
                <div>
                  <h2 className="text-xl font-semibold">
                    Konsultasi dengan Dokter Gigi
                  </h2>
                  <p className="text-sm text-blue-100">Dokter sedang online</p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-[500px] overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      {message.sender === "doctor" ? (
                        <FaUserMd className="mr-2" />
                      ) : (
                        <FaUser className="mr-2" />
                      )}
                      <span className="text-xs">
                        {message.sender === "doctor" ? "Dokter" : "Anda"} -{" "}
                        {message.timestamp}
                      </span>
                    </div>
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t p-4">
              <form onSubmit={handleSendMessage} className="flex items-center">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ketik pesan Anda..."
                  className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition duration-300"
                >
                  <FaPaperPlane />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
