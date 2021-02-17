import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const value = useCartState();
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartState() {
  const [isCartOpen, setCartOpen] = useState(false);

  return {
    isCartOpen,
    setCartOpen,
  };
}

export const useCart = () => useContext(CartContext);
