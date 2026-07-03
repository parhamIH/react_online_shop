import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAsyncData } from '../hooks/useAsyncData';
import { shopApi } from '../api/shop';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { data: profile, loading, error, refetch } = useAsyncData(
    () => shopApi.getProfile(),
    [],
    { first_name: '', last_name: '', phone_number: '', national_id: '', job: '', avatar: '' }
  );
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    national_id: '',
    job: '',
    avatar: null,
  });
  const [preview, setPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Initialize form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone_number: profile.phone_number || '',
        national_id: profile.national_id || '',
        job: profile.job || '',
        avatar: null,
      });
      if (profile.avatar) {
        setPreview(profile.avatar);
      }
    }
  }, [profile]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, avatar: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const data = new FormData();
      if (formData.first_name) data.append('first_name', formData.first_name);
      if (formData.last_name) data.append('last_name', formData.last_name);
      if (formData.phone_number) data.append('phone_number', formData.phone_number);
      if (formData.national_id) data.append('national_id', formData.national_id);
      if (formData.job) data.append('job', formData.job);
      if (formData.avatar) data.append('avatar', formData.avatar);

      await shopApi.updateProfile(data);
      await refetch();
      setMessage({ type: 'success', text: 'پروفایل با موفقیت به‌روزرسانی شد!' });
      setTimeout(() => navigate('/profile'), 1500);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'خطا در به‌روزرسانی پروفایل!' });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">Loading...</div>;
  if (error) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-red-500">Error loading profile</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800">ویرایش پروفایل</h1>
        <Link 
          to="/profile" 
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center gap-2 font-semibold"
        >
          <span>←</span>
          <span>بازگشت</span>
        </Link>
      </div>

      {message.text && (
        <div className={`mb-8 p-6 rounded-2xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
          <span className="text-3xl">{message.type === 'success' ? '✅' : '❌'}</span>
          <p className="font-semibold text-lg">{message.text}</p>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar Upload */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
            <label className="block text-gray-700 font-bold mb-4 text-lg">تصویر پروفایل</label>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden shadow-2xl border-4 border-white">
                {preview ? (
                  <img src={preview} alt="Avatar Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl text-white">👤</span>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-gradient-to-r file:from-blue-500 file:to-blue-600 file:text-white hover:file:from-blue-600 hover:file:to-blue-700 transition-all duration-300"
                />
                <p className="text-sm text-gray-400 mt-3">فرمت‌های مجاز: JPG, PNG, GIF (حداکثر 5MB)</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-3">نام</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className="w-full border-2 border-gray-200 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg"
                placeholder="نام خود را وارد کنید"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-3">نام خانوادگی</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className="w-full border-2 border-gray-200 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg"
                placeholder="نام خانوادگی خود را وارد کنید"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-3">شماره تلفن</label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                className="w-full border-2 border-gray-200 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg"
                placeholder="09123456789"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-3">کد ملی</label>
              <input
                type="text"
                name="national_id"
                value={formData.national_id}
                onChange={handleInputChange}
                className="w-full border-2 border-gray-200 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg"
                placeholder="0012345678"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-bold mb-3">شغل</label>
              <input
                type="text"
                name="job"
                value={formData.job}
                onChange={handleInputChange}
                className="w-full border-2 border-gray-200 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg"
                placeholder="شغل خود را وارد کنید"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>در حال ذخیره...</span>
                </div>
              ) : (
                'ذخیره تغییرات'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="px-8 py-4 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300 font-bold text-lg"
            >
              لغو
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
