import { Route, Routes } from 'react-router-dom';
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
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
