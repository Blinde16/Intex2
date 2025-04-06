import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { CartItem } from "../types/CartItem";
import CartSummary from "../components/CartSummary";
import AuthorizeView, { AuthorizedUser } from "../components/AuthorizeView";
import Logout from "../components/Logout";

function CartPage() {
  const navigate = useNavigate();

  const { cart, removeFromCart } = useCart();

  // Calculate the subtotal
  const subtotal = cart.reduce((total, item: CartItem) => {
    return total + item.quantity * item.price;
  }, 0);

  return (
    <AuthorizeView>
      <span>
        <Logout>
          Logout <AuthorizedUser value="email" />
        </Logout>
      </span>
      <div>
        <CartSummary />
        <h2>These brews are almost yours</h2>
        <div>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul className="list-group list-group-flush">
              {cart.map((item: CartItem) => (
                <li key={item.rootbeerId} className="list-group-item">
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      navigate(
                        `/product/${item.rootbeerName}/${item.rootbeerId}/${item.price}`
                      )
                    }
                  >
                    {item.rootbeerName}
                  </span>{" "}
                  : {item.quantity} x ${item.price.toFixed(2)}
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => removeFromCart(item.rootbeerId)}
                  >
                    &nbsp;🗑️
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <h3>Subtotal: ${subtotal.toFixed(2)}</h3>
        <button>Proceed to Checkout</button>
        <button onClick={() => navigate("/competition")}>
          Continue Browsing
        </button>
      </div>
    </AuthorizeView>
  );
}
export default CartPage;
