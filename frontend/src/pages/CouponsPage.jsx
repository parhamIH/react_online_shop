import { useAsyncData } from '../hooks/useAsyncData';
import { shopApi } from '../api/shop';
import { Link } from 'react-router-dom';

export default function CouponsPage() {
  const { data: coupons = [], loading, error } = useAsyncData(() => shopApi.getCoupons(), [], []);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-gray-500 text-lg">در حال بارگذاری کدهای تخفیف...</p>
    </div>
  );

  if (error) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="text-red-500 text-5xl mb-4">❌</div>
      <p className="text-red-600 text-lg mb-4">خطا در بارگذاری کدهای تخفیف</p>
    </div>
  );

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      alert('کد تخفیف کپی شد!');
    }).catch(err => {
      console.error('کپی ناموفق بود:', err);
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
          <span>🎁</span>
          کدهای تخفیف من
        </h1>
        <Link 
          to="/profile" 
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center gap-2 font-semibold"
        >
          <span>←</span>
          <span>بازگشت</span>
        </Link>
      </div>

      {coupons.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-xl border border-gray-100">
          <div className="text-8xl mb-6">🎁</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">هنوز کد تخفیفی نداری!</h2>
          <p className="text-gray-500 text-lg">کدهای تخفیف را از پیام‌ها دریافت کن</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(Array.isArray(coupons) ? coupons : []).map((coupon) => (
                <div key={coupon?.id || Math.random()} className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                        <span>🎁</span>
                        {coupon?.code || 'کد'}
                      </h3>
                      <p className="text-gray-500 text-sm mt-2 flex items-center gap-2">
                        <span>⏰</span>
                        تاریخ ایجاد: {coupon?.created_at ? new Date(coupon.created_at).toLocaleDateString('fa-IR') : ''}
                      </p>
                    </div>
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${coupon?.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {coupon?.is_active ? 'فعال' : 'غیر فعال'}
                    </span>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-6">
                    <p className="text-3xl font-extrabold text-purple-600 text-center">
                      {coupon?.discount || 0}% تخفیف
                    </p>
                  </div>
                  {coupon?.expire_at && (
                    <p className="text-sm text-gray-500 flex items-center gap-2 mb-4">
                      <span>📅</span>
                      تاریخ انقضا: {new Date(coupon.expire_at).toLocaleDateString('fa-IR')}
                    </p>
                  )}
                  <button
                    onClick={() => copyToClipboard(coupon?.code)}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl"
                  >
                    کپی کد
                  </button>
                </div>
              ))}
            </div>
      )}
    </div>
  );
}
