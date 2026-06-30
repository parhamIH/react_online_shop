import { Link, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductDetail from '../components/ProductDetail';
import { useAsyncData } from '../hooks/useAsyncData';
import { DataService } from '../services/dataService';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { data: product, loading } = useAsyncData(() => DataService.getProduct(id), [id], null);
  const { data: related = [] } = useAsyncData(
    () => (product ? DataService.getRelatedProducts(product.id) : Promise.resolve([])),
    [product?.id],
    []
  );

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading product...</div>;
  }

  if (!product) {
    return <div className="text-center py-20"><h2 className="text-2xl font-bold">Product not found</h2></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary-500 transition">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/products" className="hover:text-primary-500 transition">Products</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-800 font-medium truncate">{product.name}</span>
      </nav>

      <ProductDetail product={product} />

      {related.length > 0 && (
        <section className="mt-16 pt-8 border-t border-gray-100">
          <h2 className="text-2xl font-bold mb-6 section-title">You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(Array.isArray(related) ? related : []).map((p) => (
              <div key={p?.id || Math.random()} data-animate><ProductCard product={p} /></div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
