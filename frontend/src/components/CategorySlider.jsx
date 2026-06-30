import { Link } from 'react-router-dom';
import DynamicIcon from './DynamicIcon';

export default function CategorySlider({ categories = [] }) {
  return (
    <section data-animate className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold section-title">Shop by Category</h2>
          <p className="text-gray-500 mt-2">Find exactly what you need</p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {(Array.isArray(categories) ? categories : []).map((c, i) => (
          <Link
            key={c?.id || Math.random()}
            to={`/products?category=${encodeURIComponent(c?.name || '')}`}
            className={`card-hover flex flex-col items-center gap-3 p-5 bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all stagger-${i + 1} group`}
          >
            <div className={`w-14 h-14 ${c?.color || 'bg-blue-50 text-blue-600'} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <DynamicIcon name={c?.icon || 'tag'} className="w-7 h-7" />
            </div>
            <span className="font-semibold text-sm text-center">{c?.name || 'Category'}</span>
            <span className="text-xs text-gray-400">{c?.productCount || 0} items</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
