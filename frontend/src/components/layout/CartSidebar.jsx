import { ShoppingBag, Trash2, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartSidebar() {
  const { items, isOpen, toggle, close, remove, updateQty, clear, getTotal } = useCart();

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={close}
      />
      <aside className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">Shopping Cart</h2>
          <button type="button" onClick={toggle} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ShoppingBag className="w-16 h-16 mb-4" />
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="text-sm mt-1">Add some products to get started</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.key} className="flex gap-4 p-4 bg-gray-50 rounded-xl mb-3 animate-fade-in">
                <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded-lg" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {Object.entries(item.attrs).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => updateQty(item.key, item.qty - 1)} className="qty-btn w-7 h-7 rounded-lg border flex items-center justify-center text-sm">−</button>
                      <span className="text-sm font-medium w-6 text-center">{item.qty}</span>
                      <button type="button" onClick={() => updateQty(item.key, item.qty + 1)} className="qty-btn w-7 h-7 rounded-lg border flex items-center justify-center text-sm">+</button>
                    </div>
                    <span className="font-semibold text-primary-600">${(item.product.price * item.qty).toFixed(2)}</span>
                  </div>
                </div>
                <button type="button" onClick={() => remove(item.key)} className="text-gray-400 hover:text-red-500 transition p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Total</span>
              <span className="text-2xl font-bold text-primary-600">${getTotal().toFixed(2)}</span>
            </div>
            <button type="button" className="w-full py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition">Checkout</button>
            <button type="button" onClick={clear} className="w-full py-2 mt-2 text-gray-500 text-sm hover:text-red-500 transition">Clear Cart</button>
          </div>
        )}
      </aside>
    </>
  );
}
