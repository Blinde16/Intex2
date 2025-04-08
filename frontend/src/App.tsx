import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import "bootstrap/dist/css/bootstrap.min.css";
import Homepage from "./pages/Homepage";
import MoviePage from "./pages/MoviePage";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import AdminPage from "./pages/AdminPage";
import PrivacyPage from "./pages/PrivacyPage";
import CookieBanner from "./components/Cookiebanner";
import Verify2FA from "./pages/Verify2FA";
import ProductDetail from "./pages/ProductDetail";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/movie" element={<MoviePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/AdminPage" element={<AdminPage />} />
          <Route path="/PrivacyPage" element={<PrivacyPage />} />
          <Route path="/verify-2fa" element={<Verify2FA />} />
          <Route path="/movie/:show_id" element={<ProductDetail />} />
        </Routes>
      </Router>
      <CookieBanner />
    </>
  );
}

export default App;
