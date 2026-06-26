import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const COLORS = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  info: 'bg-primary-500',
  warning: 'bg-amber-500',
};

function ToastItem({ toast, onRemove }) {
  const Icon = ICONS[toast.type] || Info;

  return (
    <div className={`toast-enter flex items-center gap-3 px-5 py-3 ${COLORS[toast.type]} text-white rounded-xl shadow-lg`}>
      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium">{toast.message}</span>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
