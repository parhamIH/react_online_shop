import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { DataService } from '../../data/data';
import DynamicIcon from '../DynamicIcon';

const socials = ['facebook', 'twitter', 'instagram', 'youtube'];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🛍️</span>
              <span className="text-xl font-bold">ShopHub</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">Your one-stop destination for premium products from trusted brands worldwide.</p>
            <div className="flex gap-3 mt-4">
              {socials.map((s) => (
                <a key={s} href="#" className="w-9 h-9 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition">
                  <DynamicIcon name={s} className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              {[['Home', '/'], ['Products', '/products'], ['Brands', '/brands'], ['Articles', '/articles'], ['About Us', '/about']].map(([label, href]) => (
                <li key={href}><Link to={href} className="hover:text-primary-400 transition">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Categories</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              {DataService.categories.map((c) => (
                <li key={c.id}>
                  <Link to={`/products?category=${encodeURIComponent(c.name)}`} className="hover:text-primary-400 transition">{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary-400" /> hello@shophub.com</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary-400" /> +1 (555) 123-4567</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary-400" /> 123 Main St, New York</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500">
          <p>© 2025 ShopHub. All rights reserved.</p>
          <div className="flex gap-4 mt-3 sm:mt-0">
            <a href="#" className="hover:text-primary-400 transition">Privacy</a>
            <a href="#" className="hover:text-primary-400 transition">Terms</a>
            <a href="#" className="hover:text-primary-400 transition">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
