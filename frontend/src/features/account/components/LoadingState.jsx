const SIZE_CLASS = {
  sm: 'w-6 h-6 border-2',
  md: 'w-10 h-10 border-4',
  lg: 'w-12 h-12 border-4',
};

export default function LoadingState({ label = 'در حال بارگذاری...', size = 'lg' }) {
  const sizeClass = SIZE_CLASS[size] || SIZE_CLASS.lg;
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className={`animate-spin ${sizeClass} border-blue-500 border-t-transparent rounded-full mx-auto mb-4`}></div>
      <p className="text-gray-500 text-lg">{label}</p>
    </div>
  );
}
