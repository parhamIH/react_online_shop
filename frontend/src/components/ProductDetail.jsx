import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Minus, Play, Plus, RefreshCw, ShieldCheck, ShoppingCart, Star, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

function ProductDetailGallery({ product }) {
  const images = Array.isArray(product.images) && product.images.length > 0 ? product.images : [product.image || 'https://via.placeholder.com/600x400'];
  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <div className="animate-slide-left">
      <div className="relative rounded-2xl overflow-hidden bg-gray-100 mb-4">
        <img src={activeImage} alt={product.name} className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover transition-all duration-300" />
        {product.videoUrl && (
          <button type="button" className="play-btn absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
            <Play className="w-4 h-4 text-primary-600 ml-0.5" />
          </button>
        )}
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {(Array.isArray(images) ? images : []).map((img) => (
          <button
            key={img}
            type="button"
            onClick={() => setActiveImage(img)}
            className={`gallery-thumb flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden ${activeImage === img ? 'active' : ''}`}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductAttribute({ attributes, selected, onSelect }) {
  if (!attributes) return null;

  return (
    <div className="space-y-4">
      {Object.entries(attributes || {}).map(([key, values]) => (
        <div key={key}>
          <h4 className="font-semibold text-sm text-gray-700 mb-2">{key}</h4>
          <div className="flex flex-wrap gap-2">
            {(Array.isArray(values) ? values : []).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => onSelect(key, value)}
                className={`attr-option px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:border-primary-300 ${selected[key] === value ? 'selected' : ''}`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProductDetail({ product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [selectedAttrs, setSelectedAttrs] = useState(() => {
    if (!product.attributes) return {};
    return Object.fromEntries(
      Object.entries(product.attributes || {}).map(([key, values]) => [key, values[0]]),
    );
  });

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  const handleSelectAttr = (key, value) => {
    setSelectedAttrs((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <ProductDetailGallery product={product} />
      <div className="animate-slide-right">
        <div className="mb-4">
          <Link to={`/brands/${product.brandId}`} className="text-sm text-primary-500 font-medium hover:text-primary-700 transition">{product.brand}</Link>
          <h1 className="text-2xl md:text-3xl font-bold mt-2">{product.name}</h1>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="star-rating flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
            ))}
          </div>
          <span className="text-sm text-gray-500">{product.rating} ({product.reviews} reviews)</span>
        </div>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl font-bold text-primary-600">${product.price}</span>
          {product.originalPrice && (
            <>
              <span className="text-lg text-gray-400 line-through">${product.originalPrice}</span>
              <span className="px-2 py-1 bg-red-50 text-red-500 text-sm font-semibold rounded-lg">-{discount}%</span>
            </>
          )}
        </div>
        <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
        <ProductAttribute attributes={product.attributes} selected={selectedAttrs} onSelect={handleSelectAttr} />
        <div className="flex items-center gap-4 mt-8">
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="qty-btn px-4 py-3 text-gray-600 transition">
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 py-3 font-semibold text-center min-w-[3rem]">{qty}</span>
            <button type="button" onClick={() => setQty((q) => Math.min(99, q + 1))} className="qty-btn px-4 py-3 text-gray-600 transition">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => add(product, selectedAttrs, qty)}
            className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <ShoppingCart className="w-5 h-5" /> Add to Cart
          </button>
          <button type="button" className="w-12 h-12 border border-gray-200 rounded-xl flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition group">
            <Heart className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500"><Truck className="w-5 h-5 text-primary-500" /> Free Shipping</div>
          <div className="flex items-center gap-2 text-sm text-gray-500"><RefreshCw className="w-5 h-5 text-primary-500" /> 30-Day Returns</div>
          <div className="flex items-center gap-2 text-sm text-gray-500"><ShieldCheck className="w-5 h-5 text-primary-500" /> 2-Year Warranty</div>
        </div>
      </div>
    </div>
  );
}
