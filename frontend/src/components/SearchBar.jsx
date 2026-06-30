import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { DataService } from '../services/dataService';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return undefined;
    }

    let cancelled = false;
    const timer = setTimeout(() => {
      DataService.searchProducts(query)
        .then((items) => {
          if (!cancelled) {
            setResults(items.slice(0, 5));
          }
        })
        .catch(() => {
          if (!cancelled) {
            setResults([]);
          }
        });
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  return (
    <div className="relative">
      <div className="flex items-center bg-gray-100 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-primary-200 focus-within:bg-white transition-all border border-transparent focus-within:border-primary-200">
        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          className="bg-transparent border-none outline-none ml-2 text-sm w-full placeholder-gray-400"
        />
      </div>
      {showResults && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-80 overflow-y-auto z-50">
          {results.length === 0 ? (
            <div className="p-4 text-center text-gray-400 text-sm">No results found</div>
          ) : (
            (Array.isArray(results) ? results : []).map((p) => (
              <Link key={p?.id || Math.random()} to={`/products/${p?.id || ''}`} className="flex items-center gap-3 p-3 hover:bg-gray-50 transition">
                <img src={p?.image || 'https://via.placeholder.com/48x48?text=Product'} alt={p?.name || 'Product'} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{p?.name || 'Product'}</p>
                  <p className="text-xs text-gray-400">{p?.brand || ''} · ${p?.price || 0}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
