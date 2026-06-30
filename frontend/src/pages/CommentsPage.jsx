import { useAsyncData } from '../hooks/useAsyncData';
import { shopApi } from '../api/shop';
import { Link } from 'react-router-dom';

export default function CommentsPage() {
  const { data: comments = [], loading } = useAsyncData(() => shopApi.getComments(), [], []);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">نظرات من</h1>
      {comments.length === 0 ? (
        <div className="text-center py-12 text-gray-500">نظری یافت نشد</div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Link to={`/products/${comment.product}`} className="text-lg font-semibold text-blue-600 hover:text-blue-700">
                    {comment.productName}
                  </Link>
                  <p className="text-gray-500 text-sm mt-1">{new Date(comment.created_at).toLocaleDateString('fa-IR')}</p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < comment.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                  ))}
                </div>
              </div>
              <p className="text-gray-700">{comment.text}</p>
              <p className={`text-sm mt-2 ${comment.is_approved ? 'text-green-600' : 'text-yellow-600'}`}>
                {comment.is_approved ? 'تایید شده' : 'در انتظار تایید'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
