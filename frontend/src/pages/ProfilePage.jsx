import { useState } from 'react';
import { useAsyncData } from '../hooks/useAsyncData';
import { shopApi } from '../api/shop';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { data: profile, loading, error, refetch } = useAsyncData(
    () => shopApi.getProfile(),
    [],
    { username: '', email: '', phone_number: '', national_id: '', job: '', first_name: '', last_name: '', date_joined: '', stats: {} }
  );

  const renderStatCard = (icon, label, value, color, link) => {
    const Card = link ? Link : 'div';
    return (
      <Card 
        to={link || '#'}
        className={`bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 cursor-pointer ${link ? 'hover:-translate-y-1' : ''}`}
      >
        <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-2xl ${color}`}>
          {icon}
        </div>
        <div className="text-3xl font-bold text-gray-800 mb-1">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
      </Card>
    );
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-gray-500">در حال بارگذاری...</p>
    </div>
  );
  
  if (error) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="text-red-500 text-5xl mb-4">❌</div>
      <p className="text-red-600 text-lg mb-4">خطا در بارگذاری پروفایل</p>
      <button 
        onClick={() => refetch()}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        تلاش مجدد
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800">پروفایل من</h1>
        <Link 
          to="/profile/edit" 
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-2"
        >
          <span>✏️</span>
          <span>ویرایش پروفایل</span>
        </Link>
      </div>
      
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl shadow-2xl p-8 mb-8 border border-blue-100">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden shadow-2xl border-4 border-white">
              {profile?.avatar ? (
                <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl text-white">👤</span>
              )}
            </div>
          </div>
          <div className="text-center md:text-right flex-1">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-2">
              {profile?.first_name || profile?.last_name 
                ? `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() 
                : profile?.username}
            </h2>
            <p className="text-xl text-gray-600 mb-2">{profile?.email}</p>
            <p className="text-lg text-gray-500 mb-2">
              📞 {profile?.phone_number || 'شماره تلفن: تعیین نشده'}
            </p>
            {profile?.date_joined && (
              <p className="text-sm text-gray-500 mb-4">
                📅 تاریخ عضویت: {new Date(profile.date_joined).toLocaleDateString('fa-IR')}
              </p>
            )}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <span className="px-6 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-full text-sm font-bold shadow-lg">
                ✅ عضو فعال
              </span>
              {profile?.is_phone_verified && (
                <span className="px-6 py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-full text-sm font-bold shadow-lg">
                  📱 تلفن تایید شده
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        {renderStatCard('🛒', 'کل سفارشات', profile?.stats?.total_orders || 0, 'bg-blue-100 text-blue-600', '/profile/orders')}
        {renderStatCard('📦', 'سفارشات فعال', profile?.stats?.active_orders || 0, 'bg-yellow-100 text-yellow-600', '/profile/orders')}
        {renderStatCard('📍', 'آدرس‌های من', profile?.stats?.saved_addresses || 0, 'bg-green-100 text-green-600', '/profile/addresses')}
        {renderStatCard('❤️', 'علاقه‌مندی‌ها', profile?.stats?.favorite_products || 0, 'bg-red-100 text-red-600', '/profile/favorites')}
        {renderStatCard('🎫', 'تیکت‌ها', profile?.stats?.support_tickets || 0, 'bg-purple-100 text-purple-600', '/profile/support-tickets')}
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link 
          to="/profile/orders"
          className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 flex items-center gap-4"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg">
            📋
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-1">سفارش‌های من</h3>
            <p className="text-gray-500">مشاهده تمام سفارش‌های ثبت شده</p>
          </div>
          <div className="text-3xl text-gray-300">→</div>
        </Link>
        
        <Link 
          to="/profile/addresses"
          className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 flex items-center gap-4"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg">
            🏠
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-1">آدرس‌های من</h3>
            <p className="text-gray-500">مدیریت آدرس‌های تحویل</p>
          </div>
          <div className="text-3xl text-gray-300">→</div>
        </Link>
        
        <Link 
          to="/profile/favorites"
          className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 flex items-center gap-4"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-500 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg">
            ❤️
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-1">محصولات مورد علاقه</h3>
            <p className="text-gray-500">لیست محصولات ذخیره شده</p>
          </div>
          <div className="text-3xl text-gray-300">→</div>
        </Link>
        
        <Link 
          to="/profile/coupons"
          className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 flex items-center gap-4"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg">
            🎁
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-1">کدهای تخفیف</h3>
            <p className="text-gray-500">کدهای تخفیف فعال من</p>
          </div>
          <div className="text-3xl text-gray-300">→</div>
        </Link>
      </div>

      {/* Profile Details */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span>👤</span>
          اطلاعات شخصی
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-5 rounded-xl">
            <label className="block text-sm text-gray-500 mb-2">نام</label>
            <div className="text-lg font-semibold text-gray-800">{profile?.first_name || 'تعیین نشده'}</div>
          </div>
          <div className="bg-gray-50 p-5 rounded-xl">
            <label className="block text-sm text-gray-500 mb-2">نام خانوادگی</label>
            <div className="text-lg font-semibold text-gray-800">{profile?.last_name || 'تعیین نشده'}</div>
          </div>
          <div className="bg-gray-50 p-5 rounded-xl">
            <label className="block text-sm text-gray-500 mb-2">نام کاربری</label>
            <div className="text-lg font-semibold text-gray-800">{profile?.username}</div>
          </div>
          <div className="bg-gray-50 p-5 rounded-xl">
            <label className="block text-sm text-gray-500 mb-2">ایمیل</label>
            <div className="text-lg font-semibold text-gray-800">{profile?.email}</div>
          </div>
          <div className="bg-gray-50 p-5 rounded-xl">
            <label className="block text-sm text-gray-500 mb-2">شماره تلفن</label>
            <div className="text-lg font-semibold text-gray-800">{profile?.phone_number || 'تعیین نشده'}</div>
          </div>
          <div className="bg-gray-50 p-5 rounded-xl">
            <label className="block text-sm text-gray-500 mb-2">کد ملی</label>
            <div className="text-lg font-semibold text-gray-800">{profile?.national_id || 'تعیین نشده'}</div>
          </div>
          <div className="md:col-span-2 bg-gray-50 p-5 rounded-xl">
            <label className="block text-sm text-gray-500 mb-2">شغل</label>
            <div className="text-lg font-semibold text-gray-800">{profile?.job || 'تعیین نشده'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
