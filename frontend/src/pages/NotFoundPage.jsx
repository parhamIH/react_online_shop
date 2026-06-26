import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="text-8xl font-bold text-primary-100 mb-4">404</div>
      <h1 className="text-3xl font-bold mb-3">Page Not Found</h1>
      <p className="text-gray-500 mb-6">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition flex items-center gap-2">
        <Home className="w-4 h-4" /> Back to Home
      </Link>
    </div>
  );
}
