import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { useSlider } from '../hooks/useSlider';

export default function OfferSlider({ products = [] }) {
  const { current, next, prev } = useSlider({
    total: products.length,
    autoplay: true,
    interval: 4000,
    infinite: true,
  });

  if (!products.length) {
    return null;
  }

  return (
    <section data-animate className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold section-title">Special Offers</h2>
          <p className="text-gray-500 mt-2">Don't miss these amazing deals</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={prev} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-primary-50 hover:border-primary-200 transition">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button type="button" onClick={next} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-primary-50 hover:border-primary-200 transition">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="slider-container overflow-hidden">
        <div className="slider-track" style={{ transform: `translateX(-${current * (100 / Math.min(products.length, 3))}%)` }}>
          {products.map((p, i) => (
            <div key={p?.id || Math.random()} className={`w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-2 stagger-${i + 1}`}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
