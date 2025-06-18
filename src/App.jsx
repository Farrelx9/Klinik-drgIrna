// App.jsx
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";
import { io } from "socket.io-client";
import store from "./store";

// Pages
import Home from "./pages/Home";
import Login from "./assets/auth/Login";
import Register from "./assets/auth/Register";
import VerifyOTP from "./assets/auth/VerifyOTP";
import Konsultasi from "./pages/Konsultasi";
import Profile from "./pages/Profile";
import JanjiTemu from "./pages/JanjiTemu";
import ForgotPassword from "./assets/auth/ForgotPassword";
import ResetPassword from "./assets/auth/ResetPassword";
import VerifyResetOTP from "./assets/auth/VerifyReset";
import Notifikasi from "./pages/Notifikasi";
import DashboardAdmin from "./admin/DashboardAdmin";
import LoginAdmin from "./admin/LoginAdmin";

import "react-toastify/dist/ReactToastify.css";
import JadwalKonsultasi from "./pages/JadwalKonsultasi";
import Pembayaran from "./pages/Pembayaran";
import PembayaranSuksesHandler from "./pages/PembayaranSuksesHandler";

function App() {
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const id_user = user?.id_user;
    if (!id_user) return;

    const socket = io("https://bejs-klinik.vercel.app/", {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("GLOBAL SOCKET CONNECTED");
      socket.emit("join-notifications", id_user);
      socket.emit("join-chat-room", id_user);
    });

    socket.on("new-message", (data) => {
      toast.info(
        `Pesan baru dari dokter: ${data.message || "Ada pesan baru"}`,
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    });

    socket.on("new-patient-message", (data) => {
      toast.info(
        `Pesan baru dari pasien: ${data.message || "Ada pesan baru"}`,
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    });

    window.globalSocket = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/janjiTemu" element={<JanjiTemu />} />
          <Route path="/konsultasi" element={<Konsultasi />} />
          <Route path="/konsultasi/:id" element={<Konsultasi />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/verifyReset" element={<VerifyResetOTP />} />
          <Route path="/list-jadwal" element={<JanjiTemu />} />
          <Route path="/notifikasi" element={<Notifikasi />} />
          <Route path="/jadwal-konsultasi" element={<JadwalKonsultasi />} />
          <Route path="/pembayaran" element={<Pembayaran />} />
          <Route
            path="/pembayaran-sukses"
            element={<PembayaranSuksesHandler />}
          />
          {/* ADMIN PAGE*/}
          <Route path="/dashboardadmin" element={<DashboardAdmin />} />
          <Route path="/login-admin" element={<LoginAdmin />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          limit={2}
        />
      </Router>
    </Provider>
  );
}

export default App;
