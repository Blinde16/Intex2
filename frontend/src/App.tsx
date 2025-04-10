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
import ProductDetail from "./pages/ProductDetail";
import NewMoviePage from "./pages/NewMoviePage";
import EditMoviePage from "./pages/EditMoviePage";
import UserManagementPage from "./pages/userManagementPage";
import AddUserPage from "./pages/AddUserPage";
import EditUserPage from "./pages/EditUserPage";

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
          <Route path="/admin/new" element={<NewMoviePage />} />
          <Route path="/admin/edit/:movieId" element={<EditMoviePage />} />
          <Route path="/PrivacyPage" element={<PrivacyPage />} />
          <Route path="/movie/:show_id" element={<ProductDetail />} />
          <Route path="/admin/users" element={<UserManagementPage />} />
          <Route path="/admin/users/add" element={<AddUserPage />} />
          <Route path="/admin/users/edit/:id" element={<EditUserPage />} />
        </Routes>
      </Router>
      <CookieBanner />
    </>
  );
}

export default App;
