import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { showToast } = useToast();

  const add = useCallback((product, attrs = {}, qty = 1) => {
    const key = `${product.id}-${JSON.stringify(attrs)}`;
    setItems((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) => (item.key === key ? { ...item, qty: item.qty + qty } : item));
      }
      return [...prev, { key, product, attrs, qty }];
    });
    showToast(`${product.name} added to cart!`, 'success');
  }, [showToast]);

  const remove = useCallback((key) => {
    setItems((prev) => prev.filter((item) => item.key !== key));
  }, []);

  const updateQty = useCallback((key, qty) => {
    setItems((prev) => prev.map((item) => (item.key === key ? { ...item, qty: Math.max(1, qty) } : item)));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const toggle = useCallback(() => setIsOpen((open) => !open), []);
  const close = useCallback(() => setIsOpen(false), []);

  const getTotal = useCallback(() => items.reduce((sum, item) => sum + item.product.price * item.qty, 0), [items]);
  const getCount = useCallback(() => items.reduce((sum, item) => sum + item.qty, 0), [items]);

  const value = useMemo(() => ({
    items,
    isOpen,
    add,
    remove,
    updateQty,
    clear,
    toggle,
    close,
    getTotal,
    getCount,
  }), [items, isOpen, add, remove, updateQty, clear, toggle, close, getTotal, getCount]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
