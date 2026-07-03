import { createContext, useCallback, useContext, useMemo, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { shopApi } from '../api/shop';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  // بارگذاری سبد خرید از سرور در mount
  const loadCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await shopApi.getCart();
      if (data?.items) {
        setItems(data.items.map(item => ({
          id: item.id,
          key: `${item.product.id}-${item.id}`,
          product: item.product,
          qty: item.count,
          price: item.price,
          total: item.total
        })));
      }
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const add = useCallback(async (product, attrs = {}, qty = 1, selectedPackage = null) => {
    try {
      const packageId = selectedPackage?.id;
      if (!packageId) {
        showToast('لطفاً یک تنوع محصول انتخاب کنید', 'error');
        return;
      }

      await shopApi.addToCart(packageId, qty);
      await loadCart(); // بارگذاری مجدد سبد خرید
      showToast(`${product.name} با موفقیت به سبد خرید اضافه شد!`, 'success');
      toggle(); // باز کردن سبد خرید پس از افزودن
    } catch (err) {
      console.error('Failed to add to cart:', err);
      showToast(err.message || 'خطا در افزودن به سبد خرید', 'error');
    }
  }, [showToast, loadCart]);

  const remove = useCallback(async (key, itemId) => {
    try {
      await shopApi.removeFromCart(itemId);
      await loadCart();
      showToast('محصول با موفقیت از سبد خرید حذف شد', 'success');
    } catch (err) {
      console.error('Failed to remove from cart:', err);
      showToast(err.message || 'خطا در حذف از سبد خرید', 'error');
    }
  }, [showToast, loadCart]);

  const updateQty = useCallback(async (key, qty, itemId) => {
    try {
      if (qty <= 0) {
        await remove(key, itemId);
        return;
      }
      await shopApi.updateCartItem(itemId, qty);
      await loadCart();
    } catch (err) {
      console.error('Failed to update cart:', err);
      showToast(err.message || 'خطا در به‌روزرسانی سبد خرید', 'error');
    }
  }, [showToast, loadCart, remove]);

  const clear = useCallback(() => setItems([]), []);

  const toggle = useCallback(() => setIsOpen((open) => !open), []);
  const close = useCallback(() => setIsOpen(false), []);

  const getTotal = useCallback(() => items.reduce((sum, item) => {
    return sum + (item.total || 0);
  }, 0), [items]);
  
  const getCount = useCallback(() => items.reduce((sum, item) => sum + (item.qty || 0), 0), [items]);

  const value = useMemo(() => ({
    items,
    isOpen,
    isLoading,
    add,
    remove,
    updateQty,
    clear,
    toggle,
    close,
    getTotal,
    getCount,
    loadCart,
  }), [items, isOpen, isLoading, add, remove, updateQty, clear, toggle, close, getTotal, getCount, loadCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
