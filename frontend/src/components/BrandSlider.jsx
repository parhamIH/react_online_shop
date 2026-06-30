import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function BrandSlider({ brands = [], title = 'Top Brands' }) {
  return (
    <section data-animate className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold section-title">{title}</h2>
          <p className="text-gray-500 mt-2">Trusted by millions worldwide</p>
        </div>
        <Link to="/brands" className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1 transition">
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {(Array.isArray(brands) ? brands : []).map((b) => (
          <Link key={b?.id || Math.random()} to={`/brands/${b?.id || ''}`} className="card-hover flex flex-col items-center gap-3 p-6 bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all group">
            <img src={b?.logo || 'https://via.placeholder.com/64?text=Brand'} alt={b?.name || 'Brand'} className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 group-hover:border-primary-200 transition" />
            <span className="font-semibold text-sm">{b?.name || 'Brand'}</span>
            <span className="text-xs text-gray-400">{b?.productCount || 0} Products</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
