import { useAsyncData } from '../hooks/useAsyncData';
import { shopApi } from '../api/shop';

export default function CouponsPage() {
  const { data: coupons = [], loading } = useAsyncData(() => shopApi.getCoupons(), [], []);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">کدهای تخفیف من</h1>
      {coupons.length === 0 ? (
        <div className="text-center py-12 text-gray-500">کد تخفیفی یافت نشد</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(Array.isArray(coupons) ? coupons : []).map((coupon) => (
                <div key={coupon?.id || Math.random()} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-blue-600">{coupon?.code || 'کد'}</h3>
                      <p className="text-gray-500 text-sm mt-1">تاریخ ایجاد: {coupon?.created_at ? new Date(coupon.created_at).toLocaleDateString('fa-IR') : ''}</p>
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${coupon?.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {coupon?.is_active ? 'فعال' : 'غیر فعال'}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800 mb-2">
                    {coupon?.discount || 0}% تخفیف
                  </p>
                  {coupon?.expire_at && (
                    <p className="text-sm text-gray-500">
                      تاریخ انقضا: {new Date(coupon.expire_at).toLocaleDateString('fa-IR')}
                    </p>
                  )}
                </div>
              ))}
            </div>
      )}
    </div>
  );
}
