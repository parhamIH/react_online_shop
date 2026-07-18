import { Link } from 'react-router-dom';

export default function StatCard({ icon, label, value, color, link }) {
  const Card = link ? Link : 'div';
  return (
    <Card
      to={link || '#'}
      className={`bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 ${link ? 'cursor-pointer hover:-translate-y-1' : ''}`}
    >
      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-2xl ${color}`}>
        {icon}
      </div>
      <div className="text-3xl font-bold text-gray-800 mb-1">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </Card>
  );
}
