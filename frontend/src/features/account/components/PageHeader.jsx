import { Link } from 'react-router-dom';

export default function PageHeader({ title, icon, backTo = '/profile', actions }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
        {icon && <span>{icon}</span>}
        {title}
      </h1>
      <div className="flex gap-4 items-center">
        {actions}
        <Link
          to={backTo}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center gap-2 font-semibold"
        >
          <span>←</span>
          <span>بازگشت</span>
        </Link>
      </div>
    </div>
  );
}
