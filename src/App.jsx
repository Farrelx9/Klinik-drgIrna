import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./assets/auth/Login";
import Register from "./assets/auth/Register";
import { Provider } from "react-redux";
import store from "./redux/store";
import Appointment from "./pages/Appointment";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/appointment" element={<Appointment />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
