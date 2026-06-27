import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product = {} }) {
  const { add } = useCart();
  const discount = product?.originalPrice ? Math.round((1 - product?.price / product?.originalPrice) * 100) : 0;

  return (
    <div className="card-hover bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-primary-200 transition-all group">
      <Link to={`/products/${product?.id || ''}`} className="block">
        <div className="product-img-wrapper relative">
          <img src={product?.image || 'https://via.placeholder.com/400x300?text=Product'} alt={product?.name || 'Product'} className="w-full h-48 object-cover" />
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product?.isNew && <span className="px-2 py-0.5 bg-primary-500 text-white text-xs font-semibold rounded-md">New</span>}
            {discount > 0 && <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-semibold rounded-md">-{discount}%</span>}
          </div>
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/products/${product?.id || ''}`} className="block">
          <p className="text-xs text-gray-400 mb-1">{product?.brand || ''}</p>
          <h3 className="font-semibold text-sm mb-2 group-hover:text-primary-600 transition line-clamp-2">{product?.name || 'Product'}</h3>
        </Link>
        <div className="flex items-center gap-1 mb-2">
          <div className="star-rating flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product?.rating || 0) ? 'fill-current' : ''}`} />
            ))}
          </div>
          <span className="text-xs text-gray-400">({product?.reviews || 0})</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary-600">${product?.price || 0}</span>
            {product?.originalPrice && <span className="text-xs text-gray-400 line-through">${product?.originalPrice}</span>}
          </div>
          <button
            type="button"
            onClick={() => add(product)}
            className="w-9 h-9 rounded-lg bg-primary-50 hover:bg-primary-500 text-primary-500 hover:text-white flex items-center justify-center transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
