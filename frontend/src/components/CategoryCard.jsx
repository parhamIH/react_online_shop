import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import DynamicIcon from './DynamicIcon';

export default function CategoryCard({ category }) {
  return (
    <Link to={`/products?category=${encodeURIComponent(category.name)}`} className="card-hover group flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary-200 transition-all">
      <div className={`w-16 h-16 ${category.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
        <DynamicIcon name={category.icon} className="w-8 h-8" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-sm group-hover:text-primary-600 transition">{category.name}</h3>
        <p className="text-xs text-gray-400 mt-1">{category.productCount} Products</p>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary-400 transition" />
    </Link>
  );
}
