import { useAsyncData } from '../hooks/useAsyncData';
import { shopApi } from '../api/shop';
import { Link } from 'react-router-dom';

export default function NotificationsPage() {
  const { data: notifications = [], loading, error } = useAsyncData(() => shopApi.getNotifications(), [], []);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-gray-500 text-lg">در حال بارگذاری اطلاعیه‌ها...</p>
    </div>
  );

  if (error) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="text-red-500 text-5xl mb-4">❌</div>
      <p className="text-red-600 text-lg mb-4">خطا در بارگذاری اطلاعیه‌ها</p>
    </div>
  );

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'danger': return '❗';
      default: return '📢';
    }
  };

  const getNotificationColor = (type) => {
    switch(type) {
      case 'success': return 'from-green-400 to-green-500';
      case 'warning': return 'from-yellow-400 to-yellow-500';
      case 'danger': return 'from-red-400 to-red-500';
      default: return 'from-blue-400 to-blue-500';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800">پیام‌ها و اطلاعیه‌ها</h1>
        <Link 
          to="/profile" 
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center gap-2 font-semibold"
        >
          <span>←</span>
          <span>بازگشت</span>
        </Link>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-xl border border-gray-100">
          <div className="text-8xl mb-6">🔔</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">هنوز اطلاعیه‌ای نداری!</h2>
          <p className="text-gray-500 text-lg">اطلاعیه‌های مهم را اینجا خواهی دید</p>
        </div>
      ) : (
        <div className="space-y-6">
            {(Array.isArray(notifications) ? notifications : []).map((notification) => (
              <div 
                key={notification?.id || Math.random()} 
                className={`bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 ${notification?.is_read ? 'opacity-75' : ''}`}
              >
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white text-2xl rounded-2xl flex-shrink-0">
                    {getNotificationIcon(notification?.notification_type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-800">{notification?.title || 'عنوان'}</h3>
                      <span className={`px-4 py-2 rounded-full text-xs font-bold ${
                        notification?.notification_type === 'success' ? 'bg-green-100 text-green-800' :
                        notification?.notification_type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        notification?.notification_type === 'danger' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {notification?.notification_type || 'اطلاعیه'}
                      </span>
                    </div>
                    <p className="text-gray-700 text-lg mb-3">{notification?.message || ''}</p>
                    <p className="text-gray-500 text-sm flex items-center gap-2">
                      <span>⏰</span>
                      {notification?.created_at ? new Date(notification.created_at).toLocaleDateString('fa-IR') : ''}
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
