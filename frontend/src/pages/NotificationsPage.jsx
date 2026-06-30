import { useAsyncData } from '../hooks/useAsyncData';
import { shopApi } from '../api/shop';

export default function NotificationsPage() {
  const { data: notifications = [], loading } = useAsyncData(() => shopApi.getNotifications(), [], []);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">پیام‌ها و اطلاعیه‌ها</h1>
      {notifications.length === 0 ? (
        <div className="text-center py-12 text-gray-500">پیامی یافت نشد</div>
      ) : (
        <div className="space-y-4">
            {(Array.isArray(notifications) ? notifications : []).map((notification) => (
              <div key={notification?.id || Math.random()} className={`rounded-lg shadow p-6 ${notification?.is_read ? 'bg-gray-50' : 'bg-white'}`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{notification?.title || 'عنوان'}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    notification?.notification_type === 'success' ? 'bg-green-100 text-green-800' :
                    notification?.notification_type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    notification?.notification_type === 'danger' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {notification?.notification_type || ''}
                  </span>
                </div>
                <p className="text-gray-700">{notification?.message || ''}</p>
                <p className="text-gray-400 text-sm mt-2">{notification?.created_at ? new Date(notification.created_at).toLocaleDateString('fa-IR') : ''}</p>
              </div>
            ))}
          </div>
      )}
    </div>
  );
}
