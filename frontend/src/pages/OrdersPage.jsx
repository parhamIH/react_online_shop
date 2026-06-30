import { useAsyncData } from '../hooks/useAsyncData';
import { shopApi } from '../api/shop';

export default function OrdersPage() {
  const { data: orders = [], loading } = useAsyncData(() => shopApi.getOrders(), [], []);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">سفارش‌های من</h1>
      {orders.length === 0 ? (
        <div className="text-center py-12 text-gray-500">سفارشی یافت نشد</div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">شماره سفارش: {order.order_number}</h3>
                  <p className="text-gray-500 text-sm">تاریخ: {new Date(order.order_date).toLocaleDateString('fa-IR')}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {order.status}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">{order.payment_status}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">روش ارسال:</span>
                  <p>{order.shipping_method}</p>
                </div>
                <div>
                  <span className="text-gray-500">هزینه ارسال:</span>
                  <p>{order.shipping_cost.toLocaleString()} تومان</p>
                </div>
                <div>
                  <span className="text-gray-500">مبلغ کل:</span>
                  <p className="font-semibold">{order.total_price.toLocaleString()} تومان</p>
                </div>
                {order.address && (
                  <div>
                    <span className="text-gray-500">آدرس:</span>
                    <p className="truncate">{order.address.city}, {order.address.province}</p>
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
