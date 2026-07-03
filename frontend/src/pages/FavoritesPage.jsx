import { useAsyncData } from '../hooks/useAsyncData';
import { shopApi } from '../api/shop';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

export default function FavoritesPage() {
  const { data: favorites, loading, error } = useAsyncData(() => shopApi.getFavorites(), [], { products: [] });
  
  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-gray-500 text-lg">در حال بارگذاری علاقه‌مندی‌ها...</p>
    </div>
  );

  if (error) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="text-red-500 text-5xl mb-4">❌</div>
      <p className="text-red-600 text-lg mb-4">خطا در بارگذاری علاقه‌مندی‌ها</p>
    </div>
  );

  const products = favorites?.products || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
          <span>❤️</span>
          محصولات مورد علاقه
        </h1>
        <Link 
          to="/profile" 
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center gap-2 font-semibold"
        >
          <span>←</span>
          <span>بازگشت</span>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-xl border border-gray-100">
          <div className="text-8xl mb-6">❤️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">هنوز محصولی علاقه‌مند نشدی!</h2>
          <p className="text-gray-500 text-lg mb-8">محصولات را بررسی کن و علاقه‌مندی‌هایت را اضافه کن</p>
          <Link 
            to="/products" 
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl"
          >
            خرید شروع کن
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {(Array.isArray(products) ? products : []).map((p) => <ProductCard key={p?.id || Math.random()} product={p} />)}
            </div>
      )}
    </div>
  );
}
