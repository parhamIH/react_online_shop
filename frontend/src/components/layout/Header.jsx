import { Link, NavLink } from 'react-router-dom';
import { Award, FileText, Home, Info, Menu, Package, ShoppingCart, User, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useAsyncData } from '../../hooks/useAsyncData';
import { DataService } from '../../services/dataService';
import SearchBar from '../SearchBar';
import DynamicIcon from '../DynamicIcon';

const navLinks = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Products', to: '/products', icon: Package },
  { label: 'Brands', to: '/brands', icon: Award },
  { label: 'Articles', to: '/articles', icon: FileText },
  { label: 'About', to: '/about', icon: Info },
];

export default function Header({ onMenuToggle }) {
  const { toggle, getCount } = useCart();
  const { user, logout } = useAuth();
  const count = getCount();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button type="button" onClick={onMenuToggle} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition">
              <Menu className="w-5 h-5" />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🛍️</span>
              <span className="text-xl font-bold text-primary-600 hidden sm:inline">ShopHub</span>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    isActive ? 'text-primary-600 bg-primary-50' : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:block w-64"><SearchBar /></div>
            <button type="button" onClick={toggle} className="relative p-2 hover:bg-gray-100 rounded-lg transition">
              <ShoppingCart className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
            {user ? (
              <Link to="/profile" className="hidden md:block p-2 hover:bg-gray-100 rounded-lg transition">
                <User className="w-5 h-5" />
              </Link>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="md:hidden pb-3"><SearchBar /></div>
      </div>
    </header>
  );
}

export function MobileMenu({ isOpen, onClose }) {
  const { user } = useAuth();
  const { data: categories = [] } = useAsyncData(() => DataService.getCategories(), [], []);
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <aside className={`fixed top-0 left-0 h-full w-80 bg-white z-40 shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b">
          <span className="text-xl font-bold text-primary-600">🛍️ ShopHub</span>
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4">
          <div className="space-y-1">
            {(Array.isArray(navLinks) ? navLinks : []).map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                    key={link.to}
                    to={link.to}
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition font-medium"
                  >
                    <Icon className="w-5 h-5" /> {link.label}
                  </Link>
                );
              })}
              {user ? (
                <Link
                  key="/profile"
                  to="/profile"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition font-medium"
                >
                  <User className="w-5 h-5" /> Profile
                </Link>
              ) : (
                <>
                  <Link
                    key="/login"
                    to="/login"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition font-medium"
                  >
                    <User className="w-5 h-5" /> Login
                  </Link>
                  <Link
                    key="/register"
                    to="/register"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition font-medium"
                  >
                    <User className="w-5 h-5" /> Register
                  </Link>
                </>
              )}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Categories</p>
            <div className="space-y-0.5">
              {(Array.isArray(categories) ? categories : []).map((c) => (
                <Link
                  key={c?.id || Math.random()}
                  to={`/products?category=${encodeURIComponent(c?.name || '')}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition text-sm"
                >
                  <DynamicIcon name={c?.icon || 'tag'} className="w-4 h-4" /> {c?.name || 'Category'}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}
