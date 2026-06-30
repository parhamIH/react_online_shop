import { useState } from 'react';
import { useAsyncData } from '../hooks/useAsyncData';
import { shopApi } from '../api/shop';
import { Link } from 'react-router-dom';

export default function SupportTicketsPage() {
  const { data: tickets = [], loading, refetch } = useAsyncData(() => shopApi.getSupportTickets(), [], []);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    department: 'general',
    priority: 'medium',
  });

  const handleAdd = async () => {
    try {
      await shopApi.createSupportTicket(formData);
      await refetch();
      setIsAdding(false);
      setFormData({
        subject: '',
        message: '',
        department: 'general',
        priority: 'medium',
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">درخواست پشتیبانی</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          تیکت جدید
        </button>
      </div>

      {isAdding && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">تیکت جدید</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">موضوع</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">دپارتمان</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="general">عمومی</option>
                  <option value="technical">فنی</option>
                  <option value="billing">مالی</option>
                  <option value="sales">فروش</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">اولویت</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="low">کم</option>
                  <option value="medium">متوسط</option>
                  <option value="high">زیاد</option>
                  <option value="urgent">فوری</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">پیام</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                rows={5}
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleAdd}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                ارسال
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition"
              >
                لغو
              </button>
            </div>
          </div>
        </div>
      )}

      {tickets.length === 0 ? (
        <div className="text-center py-12 text-gray-500">تیکتی یافت نشد</div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <Link key={ticket.id} to={`/support-tickets/${ticket.id}`} className="block">
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{ticket.subject}</h3>
                    <p className="text-gray-500 text-sm mt-1">تاریخ: {new Date(ticket.created_at).toLocaleDateString('fa-IR')}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      ticket.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                      ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {ticket.status}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">{ticket.priority}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
