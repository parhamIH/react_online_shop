import { Link } from 'react-router-dom';
import DynamicIcon from './DynamicIcon';

export default function CategoryBrand({ categories, brands }) {
  return (
    <section data-animate className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold section-title">Brands by Category</h2>
        <p className="text-gray-500 mt-2">Explore brands organized by their specialty</p>
      </div>
      <div className="space-y-8">
        {categories.slice(0, 4).map((cat) => {
          const catBrands = brands.filter((b) => b.category === cat.name);
          if (catBrands.length === 0) return null;
          return (
            <div key={cat.id} className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 ${cat.color} rounded-lg flex items-center justify-center`}>
                  <DynamicIcon name={cat.icon} className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg">{cat.name}</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {catBrands.map((b) => (
                  <Link key={b.id} to={`/brands/${b.id}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition group">
                    <img src={b.logo} alt={b.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-medium text-sm group-hover:text-primary-600 transition">{b.name}</p>
                      <p className="text-xs text-gray-400">{b.productCount} products</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
