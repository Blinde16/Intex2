import { useState, ReactNode, useContext, createContext } from "react";
import { CartItem } from "../types/CartItem";

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (rootBeerID: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (prevItem) => prevItem.rootbeerId === item.rootbeerId
      );
      const updatedCart = prevCart.map((c) =>
        c.rootbeerId === item.rootbeerId
          ? {
              ...c,
              price: item.price,
              quantity: c.quantity + item.quantity,
            }
          : c
      );
      return existingItem ? updatedCart : [...prevCart, item];
    });
  };

  const removeFromCart = (rootBeerID: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.rootbeerId !== rootBeerID)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
