import { Link } from 'react-router-dom';
import { Clock, Play, User } from 'lucide-react';

export default function ArticleCard({ article, size = 'normal' }) {
  if (size === 'featured') {
    return (
      <Link to={`/articles/${article.id}`} className="card-hover group block bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-primary-200 transition-all">
        <div className="relative overflow-hidden">
          <img src={article.image} alt={article.title} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" />
          <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-semibold">{article.category}</span>
        </div>
        <div className="p-6">
          <h3 className="font-bold text-xl mb-2 group-hover:text-primary-600 transition">{article.title}</h3>
          <p className="text-gray-500 text-sm mb-4 line-clamp-2">{article.excerpt}</p>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {article.author}</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {article.readTime}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/articles/${article.id}`} className="card-hover group block bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-primary-200 transition-all">
      <div className="relative overflow-hidden">
        <img src={article.image} alt={article.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
        <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-semibold">{article.category}</span>
        {article.hasVideo && (
          <span className="absolute top-3 right-3 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center">
            <Play className="w-4 h-4 text-white" />
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-bold text-sm mb-2 group-hover:text-primary-600 transition line-clamp-2">{article.title}</h3>
        <p className="text-gray-400 text-xs mb-3 line-clamp-2">{article.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{article.author}</span>
          <span>{article.date}</span>
        </div>
      </div>
    </Link>
  );
}
