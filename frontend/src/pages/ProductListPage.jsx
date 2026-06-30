import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronRight, Filter } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useAsyncData } from '../hooks/useAsyncData';
import { DataService } from '../services/dataService';

export default function ProductListPage() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: categories = [] } = useAsyncData(() => DataService.getCategories(), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const loader = category
      ? () => DataService.getProductsByCategory(category)
      : search
        ? () => DataService.searchProducts(search)
        : () => DataService.getProducts();

    loader()
      .then((items) => {
        if (!cancelled) {
          setProducts(items);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [category, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary-500 transition">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-800 font-medium">{category || 'All Products'}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 p-4 sticky top-24">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><Filter className="w-4 h-4" /> Categories</h3>
            <div className="space-y-2">
              <Link to="/products" className={`block px-3 py-2 rounded-lg text-sm transition ${!category ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>All Products</Link>
              {(Array.isArray(categories) ? categories : []).map((c) => (
                <Link
                  key={c?.id || Math.random()}
                  to={`/products?category=${encodeURIComponent(c?.name || '')}`}
                  className={`block px-3 py-2 rounded-lg text-sm transition ${!category ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {c?.name || 'Category'} <span className="text-gray-400">({c?.productCount || 0})</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">{products.length} products found</p>
            <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-200 outline-none">
              <option>Sort by: Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Most Popular</option>
            </select>
          </div>
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading products...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(Array.isArray(products) ? products : []).map((p) => (
                <div key={p?.id || Math.random()} data-animate><ProductCard product={p} /></div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
