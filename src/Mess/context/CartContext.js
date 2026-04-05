// src/Mess/context/CartContext.js
import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === itemId);
      if (!existing) return prev;
      if (existing.quantity === 1) return prev.filter((c) => c.id !== itemId);
      return prev.map((c) =>
        c.id === itemId ? { ...c, quantity: c.quantity - 1 } : c
      );
    });
  };

  const clearCart = () => setCart([]);

  const deleteFromCart = (itemId) => {
    setCart((prev) => prev.filter((c) => c.id !== itemId));
  };

  const getItemQuantityInCart = (itemId) => {
    const found = cart.find((c) => c.id === itemId);
    return found ? found.quantity : 0;
  };

  const getTotalCount = () => cart.reduce((sum, c) => sum + c.quantity, 0);

  const getTotalPrice = () =>
    cart.reduce((sum, c) => sum + c.quantity * parseFloat(c.price), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        deleteFromCart,
        clearCart,
        getItemQuantityInCart,
        getTotalCount,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};