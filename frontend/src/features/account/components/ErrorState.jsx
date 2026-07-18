export default function ErrorState({ message = 'خطا در بارگذاری اطلاعات', onRetry, retryLabel = 'تلاش مجدد' }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="text-red-500 text-5xl mb-4">❌</div>
      <p className="text-red-600 text-lg mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}
