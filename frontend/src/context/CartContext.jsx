import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cart')) || {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addItem = (product) => {
    setCart((prev) => {
      const existing = prev[product.id];
      return {
        ...prev,
        [product.id]: {
          ...product,
          qty: existing ? existing.qty + 1 : 1,
        },
      };
    });
  };

  const removeItem = (id) => {
    setCart((prev) => {
      const item = prev[id];
      if (!item) return prev;
      if (item.qty <= 1) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: { ...item, qty: item.qty - 1 } };
    });
  };

  const deleteItem = (id) => {
    setCart((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const clearCart = () => setCart({});

  const totalQty = Object.values(cart).reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = Object.values(cart).reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{ cart, addItem, removeItem, deleteItem, clearCart, totalQty, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}
