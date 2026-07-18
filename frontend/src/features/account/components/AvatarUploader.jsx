import { useState } from 'react';

/**
 * Reusable avatar with upload preview.
 * - `value`: current avatar URL (string) or null
 * - `file`: a File object currently selected (controlled by parent)
 * - `onFileChange`: (File | null) => void
 */
export default function AvatarUploader({ value, file, onFileChange }) {
  const [objectUrl, setObjectUrl] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      setObjectUrl(URL.createObjectURL(selected));
      onFileChange(selected);
    }
  };

  const preview = objectUrl || (file ? URL.createObjectURL(file) : value);

  return (
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
  );
}
