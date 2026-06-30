import { Link, useParams } from 'react-router-dom';
import { Calendar, ChevronRight, Clock, User } from 'lucide-react';
import ArticleCard from '../components/ArticleCard';
import VideoCard from '../components/VideoCard';
import { useAsyncData } from '../hooks/useAsyncData';
import { DataService } from '../services/dataService';

export default function ArticleDetailPage() {
  const { id } = useParams();
  const { data: article, loading } = useAsyncData(() => DataService.getArticle(id), [id], null);
  const { data: allArticles = [] } = useAsyncData(() => DataService.getArticles(), [], []);
  const { data: videos = [] } = useAsyncData(() => DataService.getVideos(), [], []);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading article...</div>;
  }

  if (!article) {
    return <div className="text-center py-20"><h2 className="text-2xl font-bold">Article not found</h2></div>;
  }

  const related = allArticles.filter((a) => a.id !== article.id).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary-500 transition">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/articles" className="hover:text-primary-500 transition">Articles</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-800 font-medium truncate">{article.title}</span>
      </nav>

      <article className="max-w-3xl mx-auto">
        <img src={article.image} alt={article.title} className="w-full h-64 md:h-96 object-cover rounded-2xl mb-8" />
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500 flex-wrap">
          <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full font-medium">{article.category}</span>
          <span className="flex items-center gap-1"><User className="w-4 h-4" /> {article.author}</span>
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {article.date}</span>
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {article.readTime}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-6">{article.title}</h1>
        <p className="text-gray-500 text-lg mb-8">{article.excerpt}</p>
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4" dangerouslySetInnerHTML={{ __html: article.content }} />

        {article.hasVideo && videos[0] && (
          <div className="mt-10">
            <h3 className="font-bold text-lg mb-4">Video</h3>
            <VideoCard video={videos[0]} />
          </div>
        )}
      </article>

      <section className="mt-16 pt-8 border-t border-gray-100 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 section-title">Related Articles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {(Array.isArray(related) ? related : []).map((a) => <ArticleCard key={a?.id || Math.random()} article={a} />)}
        </div>
      </section>
    </div>
  );
}
