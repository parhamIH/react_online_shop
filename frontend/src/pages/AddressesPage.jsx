import { useState } from 'react';
import { useAsyncData } from '../hooks/useAsyncData';
import { shopApi } from '../api/shop';
import { Link } from 'react-router-dom';

export default function AddressesPage() {
  const { data: addresses = [], loading, error, refetch } = useAsyncData(() => shopApi.getAddresses(), [], []);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title_address: '',
    province: '',
    city: '',
    full_address: '',
    postcode: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleAdd = async () => {
    setIsSaving(true);
    try {
      await shopApi.createAddress(formData);
      await refetch();
      setIsAdding(false);
      setFormData({
        title_address: '',
        province: '',
        city: '',
        full_address: '',
        postcode: '',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await shopApi.deleteAddress(id);
      await refetch();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-gray-500 text-lg">در حال بارگذاری آدرس‌ها...</p>
    </div>
  );

  if (error) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="text-red-500 text-5xl mb-4">❌</div>
      <p className="text-red-600 text-lg mb-4">خطا در بارگذاری آدرس‌ها</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800">آدرس‌های من</h1>
        <div className="flex gap-4">
          <Link 
            to="/profile" 
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center gap-2 font-semibold"
          >
            <span>←</span>
            <span>بازگشت</span>
          </Link>
          <button
            onClick={() => setIsAdding(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl"
          >
            <span>➕</span>
            افزودن آدرس جدید
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>🏠</span>
            افزودن آدرس جدید
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-3">عنوان آدرس (مثلاً: خانه یا محل کار)</label>
              <input
                type="text"
                value={formData.title_address}
                onChange={(e) => setFormData({ ...formData, title_address: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg"
                placeholder="خانه"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-3">استان</label>
              <input
                type="text"
                value={formData.province}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg"
                placeholder="تهران"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-3">شهر</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg"
                placeholder="تهران"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-3">کد پستی</label>
              <input
                type="text"
                value={formData.postcode}
                onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg"
                placeholder="1234567890"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-bold mb-3">آدرس کامل</label>
              <textarea
                value={formData.full_address}
                onChange={(e) => setFormData({ ...formData, full_address: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg"
                rows={4}
                placeholder="خیابان شهید، پلاک ۱۲۳"
              />
            </div>
          </div>
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={handleAdd}
              disabled={isSaving}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'در حال ذخیره...' : 'ذخیره آدرس'}
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="px-8 py-4 rounded-xl bg-gray-100 text-gray-800 hover:bg-gray-200 transition-all duration-300 font-bold text-lg"
            >
              لغو
            </button>
          </div>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-xl border border-gray-100">
          <div className="text-8xl mb-6">🏠</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">هنوز آدرسی ثبت نکردی!</h2>
          <p className="text-gray-500 mb-8 text-lg">برای خرید سریع‌تر، آدرس خود را ثبت کن</p>
          <button
            onClick={() => setIsAdding(true)}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl"
          >
            افزودن اولین آدرس
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(Array.isArray(addresses) ? addresses : []).map((address) => (
              <div key={address?.id || Math.random()} className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center text-white text-2xl">
                        📍
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">{address?.title_address || 'عنوان آدرس'}</h3>
                    </div>
                    <p className="text-gray-500 flex items-center gap-2 mb-3">
                      <span>🏙️</span>
                      {address?.city || ''}, {address?.province || ''}
                    </p>
                    <p className="text-gray-700 font-medium mb-3">{address?.full_address || ''}</p>
                    <p className="text-gray-500 text-sm flex items-center gap-2">
                      <span>📮</span>
                      کد پستی: {address?.postcode || ''}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(address?.id)}
                    className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-300"
                    title="حذف آدرس"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
      )}
    </div>
  );
}
