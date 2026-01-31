import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart");
      if (raw) setCart(JSON.parse(raw));
    } catch (e) {
      setCart([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addItem = (product, qty = 1) => {
    setCart((cur) => {
      const found = cur.find((c) => c.productId === product.id);
      if (found) {
        return cur.map((c) =>
          c.productId === product.id ? { ...c, quantity: c.quantity + qty } : c,
        );
      }
      return [
        ...cur,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: qty,
        },
      ];
    });
  };

  const updateItem = (productId, quantity) => {
    setCart((cur) =>
      cur
        .map((c) => (c.productId === productId ? { ...c, quantity } : c))
        .filter((c) => c.quantity > 0),
    );
  };

  const removeItem = (productId) =>
    setCart((cur) => cur.filter((c) => c.productId !== productId));

  const clear = () => setCart([]);

  const total = cart.reduce((s, it) => s + it.price * it.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addItem, updateItem, removeItem, clear, total }}
    >
      {children}
    </CartContext.Provider>
  );
}
