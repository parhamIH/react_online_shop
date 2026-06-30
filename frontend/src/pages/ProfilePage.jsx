import { useState } from 'react';
import { useAsyncData } from '../hooks/useAsyncData';
import { shopApi } from '../api/shop';

export default function ProfilePage() {
  const { data: profile, loading, error, refetch } = useAsyncData(
    () => shopApi.getProfile(),
    [],
    { username: '', email: '', phone_number: '', national_id: '', job: '' }
  );
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const handleEdit = () => {
    setFormData({
      phone_number: profile?.phone_number || '',
      national_id: profile?.national_id || '',
      job: profile?.job || '',
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await shopApi.updateProfile(formData);
      await refetch();
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">Loading...</div>;
  if (error) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-red-500">Error loading profile</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">پروفایل کاربری</h1>
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">نام کاربری</label>
          <div className="text-gray-900">{profile?.username}</div>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">ایمیل</label>
          <div className="text-gray-900">{profile?.email}</div>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">شماره تلفن</label>
          {isEditing ? (
            <input
              type="text"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          ) : (
            <div className="text-gray-900">{profile?.phone_number || 'تعیین نشده'}</div>
          )}
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">کد ملی</label>
          {isEditing ? (
            <input
              type="text"
              value={formData.national_id}
              onChange={(e) => setFormData({ ...formData, national_id: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          ) : (
            <div className="text-gray-900">{profile?.national_id || 'تعیین نشده'}</div>
          )}
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">شغل</label>
          {isEditing ? (
            <input
              type="text"
              value={formData.job}
              onChange={(e) => setFormData({ ...formData, job: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          ) : (
            <div className="text-gray-900">{profile?.job || 'تعیین نشده'}</div>
          )}
        </div>
        <div className="flex gap-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                ذخیره
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition"
              >
                لغو
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              ویرایش
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
