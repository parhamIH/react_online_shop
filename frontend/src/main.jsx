import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <ToastProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </ToastProvider>
    </HashRouter>
  </StrictMode>,
);
