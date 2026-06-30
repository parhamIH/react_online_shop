import { Route, Routes, Link, useLocation } from 'react-router-dom';
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

function ProfileLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const menuItems = [
    { path: '/profile', label: 'پروفایل' },
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
          <div className="w-64 shrink-0">
            <nav className="bg-white rounded-lg shadow p-4 sticky top-4">
              <h2 className="text-lg font-bold mb-4">حساب کاربری</h2>
              <p className="text-sm text-gray-600 mb-4">سلام, {user?.username}!</p>
              <ul className="space-y-2">
                {(Array.isArray(menuItems) ? menuItems : []).map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`block px-3 py-2 rounded-md transition ${
                      location.pathname === item.path
                        ? 'bg-blue-50 text-blue-600'
                        : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              </ul>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={logout}
                  className="w-full text-right px-3 py-2 rounded-md text-red-600 hover:bg-red-50 transition"
                >
                  خروج از حساب کاربری
                </button>
              </div>
            </nav>
          </div>
          <div className="flex-1">
            <Routes>
              <Route index element={<ProfilePage />} />
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
