import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import CartSidebar from './CartSidebar';
import Footer from './Footer';
import Header, { MobileMenu } from './Header';

export default function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useScrollAnimation();

  return (
    <>
      <CartSidebar />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <Header onMenuToggle={() => setMobileMenuOpen((open) => !open)} />
      <main key={location.pathname} className="min-h-screen animate-fade-in">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
