import { useAsyncData } from '../hooks/useAsyncData';
import { shopApi } from '../api/shop';
import { Link } from 'react-router-dom';

export default function CommentsPage() {
  const { data: comments = [], loading, error } = useAsyncData(() => shopApi.getComments(), [], []);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-gray-500 text-lg">در حال بارگذاری نظرات...</p>
    </div>
  );

  if (error) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="text-red-500 text-5xl mb-4">❌</div>
      <p className="text-red-600 text-lg mb-4">خطا در بارگذاری نظرات</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800">نظرات من</h1>
        <Link 
          to="/profile" 
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center gap-2 font-semibold"
        >
          <span>←</span>
          <span>بازگشت</span>
        </Link>
      </div>

      {comments.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-xl border border-gray-100">
          <div className="text-8xl mb-6">💬</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">هنوز نظری ثبت نکردی!</h2>
          <p className="text-gray-500 text-lg mb-8">از خریدهایت نظر بده</p>
          <Link 
            to="/products" 
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl"
          >
            خرید کن
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
            {(Array.isArray(comments) ? comments : []).map((comment) => (
              <div key={comment?.id || Math.random()} className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <Link to={`/products/${comment?.product || ''}`} className="text-xl font-bold text-blue-600 hover:text-blue-700 flex items-center gap-2">
                          <span>📦</span>
                          {comment?.productName || 'محصول'}
                        </Link>
                        <p className="text-gray-500 text-sm mt-2 flex items-center gap-2">
                          <span>⏰</span>
                          {comment?.created_at ? new Date(comment.created_at).toLocaleDateString('fa-IR') : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">⭐</span>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={i < (comment?.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed mb-4">{comment?.text || ''}</p>
                    <p className={`text-sm font-bold px-4 py-2 rounded-full inline-block ${
                      comment?.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {comment?.is_approved ? '✅ تایید شده' : '⏳ در انتظار تایید'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
      )}
    </div>
  );
}
