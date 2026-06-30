import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSlider } from '../hooks/useSlider';

export default function HomeBannerSlider({ banners = [] }) {
  const { current, goTo, next, prev } = useSlider({
    total: banners.length,
    autoplay: true,
    interval: 5000,
  });

  if (!banners.length) {
    return null; // Or a placeholder
  }

  return (
    <section className="slider-container rounded-2xl overflow-hidden relative group">
      <div className="slider-track" style={{ transform: `translateX(-${current * 100}%)` }}>
        {(Array.isArray(banners) ? banners : []).map((b) => (
          <div key={b?.id || Math.random()} className="banner-slide relative h-[300px] sm:h-[400px] md:h-[500px]">
            <img 
              src={b?.image || 'https://via.placeholder.com/1920x800?text=Banner'} 
              alt={b?.title || 'Banner'} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex items-center px-8 md:px-16">
              <div className="max-w-lg text-white">
                <h1 className="hero-title text-3xl md:text-5xl font-bold mb-3 leading-tight">{b?.title || 'Welcome'}</h1>
                <p className="hero-subtitle text-lg md:text-xl text-white/80 mb-6">{b?.subtitle || 'Discover amazing products'}</p>
                <Link to={b?.link || '/products'} className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:gap-3">
                  {b?.btn || 'Shop Now'} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-white">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button type="button" onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-white">
        <ChevronRight className="w-5 h-5" />
      </button>
      <div className="banner-dots absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {(Array.isArray(banners) ? banners : []).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className={`slider-dot w-2.5 h-2.5 rounded-full transition-all ${i === current ? 'bg-primary-500 scale-125' : 'bg-white/70'}`}
            />
          ))}
      </div>
    </section>
  );
}
