import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

function normalizePrice(price) {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') {
    // strip ₦, commas, spaces, then parse
    const cleaned = price.replace(/[₦,\s]/g, '');
    const num = Number(cleaned);
    return Number.isFinite(num) ? num : 0;
  }
  return 0;
}

function normalizeCart(rawCart) {
  const cart = {};
  Object.entries(rawCart || {}).forEach(([id, item]) => {
    if (!item) return;
    const price = normalizePrice(item.price);
    const qty = Number.isFinite(item.qty) && item.qty > 0 ? Math.floor(item.qty) : 1;
    if (price > 0) {
      cart[id] = { ...item, price, qty };
    }
  });
  return cart;
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem('cart'));
      return normalizeCart(raw);
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addItem = (product) => {
    const price = normalizePrice(product?.price);
    if (!price || price <= 0) return;
    setCart((prev) => {
      const existing = prev[product.id];
      return {
        ...prev,
        [product.id]: {
          ...product,
          price,
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

  const values = Object.values(cart);
  const totalQty = values.reduce((sum, i) => sum + (i.qty || 0), 0);
  const totalPrice = values.reduce(
    (sum, i) => sum + (i.price || 0) * (i.qty || 0),
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
