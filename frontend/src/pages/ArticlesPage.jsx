import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ArticleCard from '../components/ArticleCard';
import { useAsyncData } from '../hooks/useAsyncData';
import { DataService } from '../services/dataService';

export default function ArticlesPage() {
  const { data: articles = [], loading } = useAsyncData(() => DataService.getArticles(), [], []);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading articles...</div>;
  }

  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary-500 transition">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-800 font-medium">Articles</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold mb-8">Articles & Guides</h1>

      {featured && (
        <div className="mb-8" data-animate>
          <ArticleCard article={featured} size="featured" />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(Array.isArray(rest) ? rest : []).map((a) => (
            <div key={a?.id || Math.random()} data-animate><ArticleCard article={a} /></div>
          ))}
        </div>
    </div>
  );
}
