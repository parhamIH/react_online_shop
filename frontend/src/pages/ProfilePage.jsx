import { useAsyncData } from '../hooks/useAsyncData';
import { shopApi } from '../api/shop';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const { data: profile, loading, error, refetch } = useAsyncData(
    () => shopApi.getProfile(),
    [],
    {
      username: '',
      email: '',
      phone_number: '',
      national_id: '',
      job: '',
      first_name: '',
      last_name: '',
      date_joined: '',
      stats: {},
    },
  );

  const displayName = profile?.first_name || profile?.last_name
    ? `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim()
    : profile?.username || authUser?.username || 'کاربر';

  const profileStats = {
    total_orders: profile?.stats?.total_orders ?? 0,
    active_orders: profile?.stats?.active_orders ?? 0,
    saved_addresses: profile?.stats?.saved_addresses ?? 0,
    favorite_products: profile?.stats?.favorite_products ?? 0,
    support_tickets: profile?.stats?.support_tickets ?? 0,
  };

  const completionFields = [
    { label: 'نام و نام خانوادگی', done: Boolean(profile?.first_name && profile?.last_name) },
    { label: 'شماره تلفن', done: Boolean(profile?.phone_number) },
    { label: 'کد ملی', done: Boolean(profile?.national_id) },
    { label: 'شغل', done: Boolean(profile?.job) },
    { label: 'آواتار', done: Boolean(profile?.avatar) },
  ];

  const completionPercent = Math.round(
    (completionFields.filter((item) => item.done).length / completionFields.length) * 100,
  );

  const suggestedActions = completionFields
    .filter((item) => !item.done)
    .slice(0, 3)
    .map((item) => item.label);

  const renderStatCard = (icon, label, value, color, link) => {
    const Card = link ? Link : 'div';
    return (
      <Card
        to={link || '#'}
        className={`rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${link ? 'cursor-pointer' : ''}`}
      >
        <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-2xl ${color}`}>
          {icon}
        </div>
        <div className="mb-1 text-3xl font-bold text-gray-800">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <p className="text-gray-500">در حال بارگذاری پنل کاربری...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="mb-4 text-5xl text-red-500">❌</div>
        <p className="mb-4 text-lg text-red-600">خطا در بارگذاری پروفایل</p>
        <button
          onClick={() => refetch()}
          className="rounded-lg bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-500">User Panel</p>
          <h1 className="text-3xl font-extrabold text-gray-800">خوش آمدی، {displayName}</h1>
        </div>
        <Link
          to="/profile/edit"
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl"
        >
          <span>✏️</span>
          <span>ویرایش پروفایل</span>
        </Link>
      </div>

      <div className="mb-8 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8 shadow-2xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
          <div className="flex flex-col items-center gap-4 lg:items-start">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-blue-400 to-purple-500 shadow-2xl">
              {profile?.avatar ? (
                <img src={profile.avatar} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <span className="text-5xl text-white">👤</span>
              )}
            </div>
            <div className="rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
              {profile?.is_phone_verified ? '📱 شماره تأیید شده' : '🟡 در انتظار تکمیل اطلاعات'}
            </div>
          </div>

          <div className="flex-1">
            <h2 className="mb-3 text-3xl font-extrabold text-gray-800">سلام، {displayName}</h2>
            <p className="mb-4 text-lg text-gray-600">
              اینجا مرکز مدیریت حساب کاربری شماست؛ سفارش‌ها، آدرس‌ها، پشتیبانی و اطلاعات شخصی را از یکجا مدیریت کنید.
            </p>
            <div className="mb-5 flex flex-wrap gap-3">
              <span className="rounded-full bg-gradient-to-r from-green-400 to-green-500 px-5 py-2 text-sm font-bold text-white shadow-lg">
                ✅ عضو فعال
              </span>
              {profile?.date_joined && (
                <span className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-gray-600 shadow-sm">
                  📅 عضویت از {new Date(profile.date_joined).toLocaleDateString('fa-IR')}
                </span>
              )}
            </div>
          </div>

          <div className="w-full rounded-2xl bg-white/90 p-5 shadow-lg lg:w-80">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-600">پیشرفت تکمیل پروفایل</span>
              <span className="text-sm font-bold text-blue-600">{completionPercent}%</span>
            </div>
            <div className="mb-3 h-3 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: `${completionPercent}%` }} />
            </div>
            <p className="mb-3 text-sm text-gray-600">مواردی که هنوز تکمیل نشده‌اند:</p>
            <ul className="space-y-2 text-sm text-gray-600">
              {suggestedActions.length > 0 ? (
                suggestedActions.map((item) => <li key={item} className="flex items-center gap-2">• {item}</li>)
              ) : (
                <li className="flex items-center gap-2">• پروفایل شما عالی است و همه بخش‌ها کامل شده‌اند.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
        {renderStatCard('🛒', 'کل سفارشات', profileStats.total_orders, 'bg-blue-100 text-blue-600', '/profile/orders')}
        {renderStatCard('📦', 'سفارشات فعال', profileStats.active_orders, 'bg-yellow-100 text-yellow-600', '/profile/orders')}
        {renderStatCard('📍', 'آدرس‌های من', profileStats.saved_addresses, 'bg-green-100 text-green-600', '/profile/addresses')}
        {renderStatCard('❤️', 'علاقه‌مندی‌ها', profileStats.favorite_products, 'bg-red-100 text-red-600', '/profile/favorites')}
        {renderStatCard('🎫', 'تیکت‌ها', profileStats.support_tickets, 'bg-purple-100 text-purple-600', '/profile/support-tickets')}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-gray-800">دسترسی سریع</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Link to="/profile/orders" className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-blue-500 text-3xl text-white shadow-lg">📋</div>
              <div>
                <h4 className="text-lg font-bold text-gray-800">سفارش‌های من</h4>
                <p className="text-sm text-gray-500">مشاهده و پیگیری وضعیت سفارش‌ها</p>
              </div>
            </Link>

            <Link to="/profile/addresses" className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-400 to-green-500 text-3xl text-white shadow-lg">🏠</div>
              <div>
                <h4 className="text-lg font-bold text-gray-800">آدرس‌های من</h4>
                <p className="text-sm text-gray-500">مدیریت آدرس‌های تحویل و ارسال</p>
              </div>
            </Link>

            <Link to="/profile/favorites" className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-400 to-red-500 text-3xl text-white shadow-lg">❤️</div>
              <div>
                <h4 className="text-lg font-bold text-gray-800">محصولات مورد علاقه</h4>
                <p className="text-sm text-gray-500">دسترسی سریع به آیتم‌های ذخیره‌شده</p>
              </div>
            </Link>

            <Link to="/profile/support-tickets" className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-400 to-purple-500 text-3xl text-white shadow-lg">🎫</div>
              <div>
                <h4 className="text-lg font-bold text-gray-800">پشتیبانی</h4>
                <p className="text-sm text-gray-500">ثبت و پیگیری درخواست‌های شما</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-xl font-bold text-gray-800">نکات پیشنهادی</h3>
          <div className="space-y-3">
            <div className="rounded-2xl bg-blue-50 p-4">
              <p className="font-semibold text-blue-700">⚡ خرید سریع‌تر</p>
              <p className="mt-1 text-sm text-blue-600">آدرس و شماره تماس خود را تکمیل کنید تا خرید‌ها سریع‌تر انجام شوند.</p>
            </div>
            <div className="rounded-2xl bg-green-50 p-4">
              <p className="font-semibold text-green-700">🎁 تخفیف‌های ویژه</p>
              <p className="mt-1 text-sm text-green-600">کدهای تخفیف خود را در بخش مربوطه مشاهده و استفاده کنید.</p>
            </div>
            <div className="rounded-2xl bg-purple-50 p-4">
              <p className="font-semibold text-purple-700">💬 پاسخ سریع</p>
              <p className="mt-1 text-sm text-purple-600">در صورت نیاز، از بخش پشتیبانی با ما در ارتباط باشید.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-lg">
        <h3 className="mb-6 text-2xl font-bold text-gray-800">اطلاعات شخصی</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-gray-50 p-5">
            <label className="mb-2 block text-sm text-gray-500">نام</label>
            <div className="text-lg font-semibold text-gray-800">{profile?.first_name || 'تعیین نشده'}</div>
          </div>
          <div className="rounded-xl bg-gray-50 p-5">
            <label className="mb-2 block text-sm text-gray-500">نام خانوادگی</label>
            <div className="text-lg font-semibold text-gray-800">{profile?.last_name || 'تعیین نشده'}</div>
          </div>
          <div className="rounded-xl bg-gray-50 p-5">
            <label className="mb-2 block text-sm text-gray-500">نام کاربری</label>
            <div className="text-lg font-semibold text-gray-800">{profile?.username}</div>
          </div>
          <div className="rounded-xl bg-gray-50 p-5">
            <label className="mb-2 block text-sm text-gray-500">ایمیل</label>
            <div className="text-lg font-semibold text-gray-800">{profile?.email}</div>
          </div>
          <div className="rounded-xl bg-gray-50 p-5">
            <label className="mb-2 block text-sm text-gray-500">شماره تلفن</label>
            <div className="text-lg font-semibold text-gray-800">{profile?.phone_number || 'تعیین نشده'}</div>
          </div>
          <div className="rounded-xl bg-gray-50 p-5">
            <label className="mb-2 block text-sm text-gray-500">کد ملی</label>
            <div className="text-lg font-semibold text-gray-800">{profile?.national_id || 'تعیین نشده'}</div>
          </div>
          <div className="rounded-xl bg-gray-50 p-5 md:col-span-2">
            <label className="mb-2 block text-sm text-gray-500">شغل</label>
            <div className="text-lg font-semibold text-gray-800">{profile?.job || 'تعیین نشده'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
