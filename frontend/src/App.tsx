import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductPage from "./pages/ProductPage";
import { CartProvider } from "./context/CartContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import "bootstrap/dist/css/bootstrap.min.css";
import Homepage from "./pages/Homepage";
import MoviePage from "./pages/MoviePage";

function App() {
  return (
    <>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/movie" element={<MoviePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/homepage" element={<Homepage />} />
          </Routes>
        </Router>
      </CartProvider>
    </>
  );
}

export default App;
