import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ArticleCard from '../components/ArticleCard';
import BrandSlider from '../components/BrandSlider';
import CategoryBrand from '../components/CategoryBrand';
import CategorySlider from '../components/CategorySlider';
import HomeBannerSlider from '../components/HomeBannerSlider';
import OfferSlider from '../components/OfferSlider';
import ProductCard from '../components/ProductCard';
import VideoCard from '../components/VideoCard';
import { useAsyncData } from '../hooks/useAsyncData';
import { DataService } from '../services/dataService';

export default function HomePage() {
  const { data: home, loading: homeLoading } = useAsyncData(() => DataService.getHome(), []);
  const { data: offers = [] } = useAsyncData(() => DataService.getOffers(), []);
  const { data: newArrivals = [] } = useAsyncData(() => DataService.getNewArrivals(), []);
  const { data: articles = [] } = useAsyncData(() => DataService.getArticles(), []);
  const { data: categories = [] } = useAsyncData(() => DataService.getCategories(), []);
  const { data: brands = [] } = useAsyncData(() => DataService.getBrands(), []);
  const { data: videos = [] } = useAsyncData(() => DataService.getVideos(), []);

  if (homeLoading || !home) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">Loading...</div>;
  }

  const displayBrands = home.brands?.length ? home.brands : brands;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
      <HomeBannerSlider banners={home.banners} />
      <CategorySlider categories={categories} />
      <OfferSlider products={offers} />

      <section data-animate>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold section-title">New Arrivals</h2>
            <p className="text-gray-500 mt-2">The latest additions to our collection</p>
          </div>
          <Link to="/products" className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1 transition">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <BrandSlider brands={displayBrands} />
      <CategoryBrand categories={categories} brands={displayBrands} />

      <section data-animate>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold section-title">Latest Articles</h2>
            <p className="text-gray-500 mt-2">Tips, guides, and inspiration</p>
          </div>
          <Link to="/articles" className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1 transition">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.slice(0, 4).map((a) => <ArticleCard key={a.id} article={a} />)}
        </div>
      </section>

      <section data-animate>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold section-title">Video Highlights</h2>
            <p className="text-gray-500 mt-2">Watch our latest content</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {videos.slice(0, 4).map((v) => <VideoCard key={v.id} video={v} />)}
        </div>
      </section>
    </div>
  );
}
