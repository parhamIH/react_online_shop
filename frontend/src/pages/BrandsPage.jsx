import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import BrandSlider from '../components/BrandSlider';
import CategoryBrand from '../components/CategoryBrand';
import { useAsyncData } from '../hooks/useAsyncData';
import { DataService } from '../services/dataService';

export default function BrandsPage() {
  const { data: brands = [], loading: brandsLoading } = useAsyncData(() => DataService.getBrands(), []);
  const { data: categories = [], loading: categoriesLoading } = useAsyncData(() => DataService.getCategories(), []);

  if (brandsLoading || categoriesLoading) {
    return <div className="text-center py-20 text-gray-500">Loading brands...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary-500 transition">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-800 font-medium">Brands</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold mb-8">Our Brands</h1>
      <BrandSlider brands={brands} title="All Brands" />
      <CategoryBrand categories={categories} brands={brands} />
    </div>
  );
}
