import "./App.css";
import CompetitionPage from "./pages/CompetitionPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./context/CartContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<CompetitionPage />} />
            <Route path="/competition" element={<CompetitionPage />} />
            <Route
              path="/product/:rootbeerName/:rootbeerId/:currentRetailPrice"
              element={<ProductPage />}
            />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </Router>
      </CartProvider>
    </>
  );
}

export default App;
