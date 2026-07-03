import { Route, Routes, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import MainLayout from './components/layout/MainLayout';
import AboutPage from './pages/AboutPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import ArticlesPage from './pages/ArticlesPage';
import BrandDetailPage from './pages/BrandDetailPage';
import BrandsPage from './pages/BrandsPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductListPage from './pages/ProductListPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import AddressesPage from './pages/AddressesPage';
import NotificationsPage from './pages/NotificationsPage';
import CommentsPage from './pages/CommentsPage';
import SupportTicketsPage from './pages/SupportTicketsPage';
import SupportTicketDetailPage from './pages/SupportTicketDetailPage';
import FavoritesPage from './pages/FavoritesPage';
import CouponsPage from './pages/CouponsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import EditProfilePage from './pages/EditProfilePage';

function ProfileLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const menuItems = [
    { path: '/profile', label: 'پروفایل' },
    { path: '/profile/edit', label: 'ویرایش پروفایل' },
    { path: '/profile/orders', label: 'سفارش‌های من' },
    { path: '/profile/addresses', label: 'آدرس‌های من' },
    { path: '/profile/notifications', label: 'پیام‌ها و اطلاعیه‌ها' },
    { path: '/profile/comments', label: 'نظرات من' },
    { path: '/profile/support-tickets', label: 'درخواست پشتیبانی' },
    { path: '/profile/favorites', label: 'محصولات مورد علاقه' },
    { path: '/profile/coupons', label: 'کدهای تخفیف من' },
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          <div className="w-72 shrink-0">
            <nav className="bg-white rounded-2xl shadow-xl p-6 sticky top-4 border border-gray-100">
              <div className="mb-6 pb-4 border-b border-gray-100">
                <h2 className="text-xl font-extrabold text-gray-800 mb-2">حساب کاربری</h2>
                <p className="text-sm text-gray-500">سلام, {user?.username}! 👋</p>
              </div>
              <ul className="space-y-3">
                {(Array.isArray(menuItems) ? menuItems : []).map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      location.pathname === item.path
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                        : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900 hover:shadow-md'
                    }`}
                  >
                    {item.label.includes('پروفایل') && '👤'}
                    {item.label.includes('ویرایش') && '✏️'}
                    {item.label.includes('سفارش') && '📦'}
                    {item.label.includes('آدرس') && '📍'}
                    {item.label.includes('پیام') && '🔔'}
                    {item.label.includes('نظر') && '💬'}
                    {item.label.includes('پشتیبانی') && '🎫'}
                    {item.label.includes('علاقه') && '❤️'}
                    {item.label.includes('تخفیف') && '🎁'}
                    <span className="font-semibold">{item.label}</span>
                  </Link>
                </li>
              ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-300 font-semibold"
                >
                  <span>🚪</span>
                  <span>خروج از حساب کاربری</span>
                </button>
              </div>
            </nav>
          </div>
          <div className="flex-1">
            <Routes>
              <Route index element={<ProfilePage />} />
              <Route path="edit" element={<EditProfilePage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="addresses" element={<AddressesPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="comments" element={<CommentsPage />} />
              <Route path="support-tickets" element={<SupportTicketsPage />} />
              <Route path="support-tickets/:id" element={<SupportTicketDetailPage />} />
              <Route path="favorites" element={<FavoritesPage />} />
              <Route path="coupons" element={<CouponsPage />} />
            </Routes>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🚪</span>
              </div>
              <h3 className="text-2xl font-extrabold text-gray-800 mb-2">خروج از حساب کاربری</h3>
              <p className="text-gray-600">آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟</p>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-6 py-3 rounded-xl bg-gray-100 text-gray-800 hover:bg-gray-200 transition-all duration-300 font-semibold"
              >
                لغو
              </button>
              <button
                onClick={() => {
                  logout();
                  setShowLogoutModal(false);
                }}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
              >
                خروج
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductListPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="articles" element={<ArticlesPage />} />
        <Route path="articles/:id" element={<ArticleDetailPage />} />
        <Route path="brands" element={<BrandsPage />} />
        <Route path="brands/:id" element={<BrandDetailPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="/profile/*" element={<ProtectedRoute><ProfileLayout /></ProtectedRoute>} />
    </Routes>
  );
}
