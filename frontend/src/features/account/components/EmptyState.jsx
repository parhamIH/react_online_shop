import { Link } from 'react-router-dom';

export default function EmptyState({ icon = '📭', title, message, ctaLabel, ctaTo, onCta }) {
  const Cta = onCta ? 'button' : Link;
  return (
    <div className="text-center py-20 bg-white rounded-3xl shadow-xl border border-gray-100">
      <div className="text-8xl mb-6">{icon}</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
      {message && <p className="text-gray-500 mb-8 text-lg">{message}</p>}
      {(ctaLabel && (ctaTo || onCta)) && (
        <Cta
          {...(onCta ? { onClick: onCta } : { to: ctaTo })}
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl"
        >
          {ctaLabel}
        </Cta>
      )}
    </div>
  );
}
