import { useState } from 'react';
import { useAsyncData } from '../hooks/useAsyncData';
import { shopApi } from '../api/shop';

export default function AddressesPage() {
  const { data: addresses = [], loading, refetch } = useAsyncData(() => shopApi.getAddresses(), [], []);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title_address: '',
    province: '',
    city: '',
    full_address: '',
    postcode: '',
  });

  const handleAdd = async () => {
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

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">آدرس‌های من</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          افزودن آدرس
        </button>
      </div>

      {isAdding && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">آدرس جدید</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">عنوان آدرس</label>
              <input
                type="text"
                value={formData.title_address}
                onChange={(e) => setFormData({ ...formData, title_address: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">استان</label>
              <input
                type="text"
                value={formData.province}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">شهر</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">کد پستی</label>
              <input
                type="text"
                value={formData.postcode}
                onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">آدرس کامل</label>
              <textarea
                value={formData.full_address}
                onChange={(e) => setFormData({ ...formData, full_address: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                rows={3}
              />
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleAdd}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              ذخیره
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition"
            >
              لغو
            </button>
          </div>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="text-center py-12 text-gray-500">آدرسی یافت نشد</div>
      ) : (
        <div className="space-y-4">
              {(Array.isArray(addresses) ? addresses : []).map((address) => (
                <div key={address?.id || Math.random()} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{address?.title_address || 'عنوان'}</h3>
                      <p className="text-gray-600 mt-1">
                        {address?.city || ''}, {address?.province || ''}
                      </p>
                      <p className="text-gray-700 mt-2">{address?.full_address || ''}</p>
                      <p className="text-gray-500 text-sm mt-2">کد پستی: {address?.postcode || ''}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(address?.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
      )}
    </div>
  );
}
