import { Link, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import BrandSlider from '../components/BrandSlider';
import ProductCard from '../components/ProductCard';
import { useAsyncData } from '../hooks/useAsyncData';
import { DataService } from '../services/dataService';

export default function BrandDetailPage() {
  const { id } = useParams();
  const { data: brand, loading: brandLoading } = useAsyncData(() => DataService.getBrand(id), [id]);
  const { data: products = [], loading: productsLoading } = useAsyncData(
    () => (brand ? DataService.getProductsByBrand(brand.id) : Promise.resolve([])),
    [brand?.id],
  );
  const { data: allBrands = [] } = useAsyncData(() => DataService.getBrands(), []);

  if (brandLoading) {
    return <div className="text-center py-20 text-gray-500">Loading brand...</div>;
  }

  if (!brand) {
    return <div className="text-center py-20"><h2 className="text-2xl font-bold">Brand not found</h2></div>;
  }

  const otherBrands = allBrands.filter((b) => b.id !== brand.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary-500 transition">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/brands" className="hover:text-primary-500 transition">Brands</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-800 font-medium">{brand.name}</span>
      </nav>

      <div className="relative rounded-2xl overflow-hidden mb-8 h-48 md:h-64">
        <img src={brand.image || brand.logo} alt={brand.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex items-center px-8 md:px-12">
          <div className="flex items-center gap-4">
            <img src={brand.logo} alt={brand.name} className="w-20 h-20 rounded-full border-4 border-white shadow-lg" />
            <div className="text-white">
              <h1 className="text-3xl md:text-4xl font-bold">{brand.name}</h1>
              <p className="text-white/80 mt-1">{brand.category} · {brand.productCount} Products</p>
            </div>
          </div>
        </div>
      </div>

      {brand.description && <p className="text-gray-600 text-lg mb-8 max-w-2xl">{brand.description}</p>}

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 section-title">{brand.name} Products</h2>
        {productsLoading ? (
          <div className="text-center py-12 text-gray-500">Loading products...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <div key={p.id} data-animate><ProductCard product={p} /></div>
            ))}
          </div>
        )}
        {!productsLoading && products.length === 0 && <p className="text-gray-400 text-center py-12">No products available yet.</p>}
      </section>

      <BrandSlider brands={otherBrands} title="Other Brands" />
    </div>
  );
}
