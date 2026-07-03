import { useAsyncData } from '../hooks/useAsyncData';
import { shopApi } from '../api/shop';
import { Link } from 'react-router-dom';

export default function OrdersPage() {
  const { data: orders = [], loading, error } = useAsyncData(() => shopApi.getOrders(), [], []);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-gray-500 text-lg">در حال بارگذاری سفارش‌ها...</p>
    </div>
  );

  if (error) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="text-red-500 text-5xl mb-4">❌</div>
      <p className="text-red-600 text-lg mb-4">خطا در بارگذاری سفارش‌ها</p>
    </div>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'تکمیل شده':
      case 'تحویل داده شده':
        return 'bg-green-100 text-green-800';
      case 'در حال پردازش':
        return 'bg-blue-100 text-blue-800';
      case 'ارسال شده':
        return 'bg-purple-100 text-purple-800';
      case 'لغو شده':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800">سفارش‌های من</h1>
        <Link 
          to="/profile" 
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center gap-2 font-semibold"
        >
          <span>←</span>
          <span>بازگشت</span>
        </Link>
      </div>
      
      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-xl border border-gray-100">
          <div className="text-8xl mb-6">📦</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">هنوز سفارشی ثبت نکردی!</h2>
          <p className="text-gray-500 mb-8 text-lg">اولین سفارشت رو ثبت کن و از تخفیف‌های ما استفاده کن</p>
          <Link 
            to="/products" 
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl"
          >
            خرید شروع کن
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
            {(Array.isArray(orders) ? orders : []).map((order, index) => (
              <div key={order?.id || Math.random()} className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
                <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">🎁</span>
                      <h3 className="text-xl font-bold text-gray-800">سفارش #{order?.order_number || index + 1}</h3>
                    </div>
                    <p className="text-gray-500 flex items-center gap-2">
                      <span>📅</span>
                      {order?.order_date ? new Date(order.order_date).toLocaleDateString('fa-IR') : 'نامشخص'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-6 py-2 rounded-full text-sm font-bold ${getStatusColor(order?.status)}`}>
                      {order?.status || 'در انتظار'}
                    </span>
                    <p className="text-sm text-gray-500 mt-2 flex items-center gap-2 justify-end">
                      <span>💳</span>
                      {order?.payment_status || 'پرداخت نشده'}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6 border-t border-gray-100">
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <span className="text-gray-500 text-sm font-semibold flex items-center gap-2">
                      <span>🚚</span>
                      روش ارسال
                    </span>
                    <p className="text-gray-800 font-bold mt-2">{order?.shipping_method || 'پست پیشتاز'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <span className="text-gray-500 text-sm font-semibold flex items-center gap-2">
                      <span>💰</span>
                      هزینه ارسال
                    </span>
                    <p className="text-gray-800 font-bold mt-2">{(order?.shipping_cost || 0).toLocaleString()} تومان</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <span className="text-gray-500 text-sm font-semibold flex items-center gap-2">
                      <span>💵</span>
                      مبلغ کل
                    </span>
                    <p className="text-blue-600 font-extrabold mt-2 text-xl">{(order?.total_price || 0).toLocaleString()} تومان</p>
                  </div>
                  {order?.address && (
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <span className="text-gray-500 text-sm font-semibold flex items-center gap-2">
                        <span>📍</span>
                        آدرس تحویل
                      </span>
                      <p className="text-gray-800 font-medium mt-2">{order.address.city}, {order.address.province}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
      )}
    </div>
  );
}
