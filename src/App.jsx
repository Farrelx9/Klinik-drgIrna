import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./assets/auth/Login";
import Register from "./assets/auth/Register";
import VerifyOTP from "./assets/auth/VerifyOTP";
import { Provider } from "react-redux";
import store from "./redux/store";
import Konsultasi from "./pages/Konsultasi";
import Profile from "./pages/Profile";
import JanjiTemu from "./pages/JanjiTemu";
import ForgotPassword from "./assets/auth/forgotPassword";
import ResetPassword from "./assets/auth/ResetPassword";
import VerifyResetOTP from "./assets/auth/VerifyReset";

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
          <Route path="/konsultasi" element={<Konsultasi />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/verifyReset" element={<VerifyResetOTP />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
