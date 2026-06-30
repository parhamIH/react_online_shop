import { useAsyncData } from '../hooks/useAsyncData';
import { shopApi } from '../api/shop';
import ProductCard from '../components/ProductCard';

export default function FavoritesPage() {
  const { data: favorites, loading } = useAsyncData(() => shopApi.getFavorites(), [], { products: [] });

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">Loading...</div>;
  const products = favorites?.products || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">محصولات مورد علاقه</h1>
      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">محصولی یافت نشد</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {(Array.isArray(products) ? products : []).map((p) => <ProductCard key={p?.id || Math.random()} product={p} />)}
            </div>
      )}
    </div>
  );
}
