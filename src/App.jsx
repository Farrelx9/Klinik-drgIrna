// App.jsx
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
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
import ChatHistory from "./pages/ChatHistory";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/janjiTemu" element={<JanjiTemu />} />
          <Route path="/konsultasi/:id" element={<Konsultasi />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/verifyReset" element={<VerifyResetOTP />} />
          <Route path="/list-jadwal" element={<JanjiTemu />} />
          <Route path="/notifikasi" element={<Notifikasi />} />
          <Route path="/jadwal-konsultasi" element={<JadwalKonsultasi />} />
          <Route path="/pembayaran" element={<Pembayaran />} />
          <Route path="/chat-history" element={<ChatHistory />} />
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
