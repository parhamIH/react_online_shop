import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import DynamicIcon from '../components/DynamicIcon';
import VideoCard from '../components/VideoCard';
import { useAsyncData } from '../hooks/useAsyncData';
import { DataService } from '../services/dataService';

const stats = [
  { num: '10K+', label: 'Happy Customers', icon: 'users' },
  { num: '500+', label: 'Products', icon: 'package' },
  { num: '50+', label: 'Trusted Brands', icon: 'award' },
  { num: '99%', label: 'Satisfaction Rate', icon: 'heart' },
];

const values = [
  { icon: 'shield-check', title: 'Quality First', desc: 'Every product is carefully vetted before it reaches our platform.' },
  { icon: 'leaf', title: 'Sustainability', desc: 'We prioritize eco-friendly products and sustainable practices.' },
  { icon: 'heart', title: 'Customer Love', desc: 'Your satisfaction is our top priority, always.' },
];

const team = [
  { name: 'Sarah Chen', role: 'CEO & Founder', img: 'http://static.photos/people/200x200/80' },
  { name: 'Alex Rivera', role: 'Head of Design', img: 'http://static.photos/people/200x200/81' },
  { name: 'Emma Wilson', role: 'Marketing Lead', img: 'http://static.photos/people/200x200/82' },
  { name: 'James Park', role: 'Tech Lead', img: 'http://static.photos/people/200x200/83' },
];

export default function AboutPage() {
  const { data: videos = [] } = useAsyncData(() => DataService.getVideos(), [], []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary-500 transition">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-800 font-medium">About Us</span>
      </nav>

      <section data-animate className="text-center py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About <span className="gradient-text">ShopHub</span></h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">We're on a mission to bring the best products from trusted brands directly to your doorstep, with a seamless shopping experience.</p>
      </section>

      <section data-animate className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-6 text-center card-hover">
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-3">
              <DynamicIcon name={s.icon} className="w-6 h-6 text-primary-500" />
            </div>
            <div className="text-2xl font-bold text-primary-600">{s.num}</div>
            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </section>

      <section data-animate className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-3xl font-bold mb-4 section-title">Our Story</h2>
          <p className="text-gray-600 leading-relaxed mb-4">Founded in 2020, ShopHub started with a simple idea: make quality products accessible to everyone. We partner directly with brands to ensure authenticity and fair pricing.</p>
          <p className="text-gray-600 leading-relaxed">Today, we serve over 10,000 happy customers across the globe, offering a curated selection of products from more than 50 trusted brands.</p>
        </div>
        <div className="rounded-2xl overflow-hidden">
          <img src="http://static.photos/workspace/640x360/70" alt="Our team" className="w-full h-full object-cover" />
        </div>
      </section>

      <section data-animate className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center section-title section-title-center">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((v) => (
            <div key={v.title} className="bg-white rounded-xl border border-gray-100 p-8 text-center card-hover">
              <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <DynamicIcon name={v.icon} className="w-7 h-7 text-primary-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">{v.title}</h3>
              <p className="text-gray-500 text-sm">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section data-animate className="mb-12">
        <h2 className="text-3xl font-bold mb-6 section-title section-title-center">See Us in Action</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {videos.map((v) => <VideoCard key={v.id} video={v} />)}
        </div>
      </section>

      <section data-animate className="mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center section-title section-title-center">Meet the Team</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {team.map((t) => (
            <div key={t.name} className="text-center card-hover">
              <img src={t.img} alt={t.name} className="w-24 h-24 rounded-full object-cover mx-auto mb-3 border-4 border-white shadow-lg" />
              <h4 className="font-bold text-sm">{t.name}</h4>
              <p className="text-xs text-gray-400">{t.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
