import { useState } from 'react';
import { useAsyncData } from '../hooks/useAsyncData';
import { shopApi } from '../api/shop';
import { Link } from 'react-router-dom';

export default function SupportTicketsPage() {
  const { data: tickets = [], loading, error, refetch } = useAsyncData(() => shopApi.getSupportTickets(), [], []);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    department: 'general',
    priority: 'medium',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleAdd = async () => {
    setIsSaving(true);
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
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-gray-500 text-lg">در حال بارگذاری تیکت‌ها...</p>
    </div>
  );

  if (error) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="text-red-500 text-5xl mb-4">❌</div>
      <p className="text-red-600 text-lg mb-4">خطا در بارگذاری تیکت‌ها</p>
    </div>
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getPriorityText = (priority) => {
    switch(priority) {
      case 'urgent': return 'فوری';
      case 'high': return 'زیاد';
      case 'medium': return 'متوسط';
      default: return 'کم';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800">درخواست پشتیبانی</h1>
        <div className="flex gap-4">
          <Link 
            to="/profile" 
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center gap-2 font-semibold"
          >
            <span>←</span>
            <span>بازگشت</span>
          </Link>
          <button
            onClick={() => setIsAdding(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl"
          >
            <span>➕</span>
            تیکت جدید
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>🎫</span>
            تیکت جدید
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-bold mb-3">موضوع</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg"
                placeholder="موضوع تیکت را وارد کنید"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-bold mb-3">دپارتمان</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg"
                >
                  <option value="general">عمومی</option>
                  <option value="technical">فنی</option>
                  <option value="billing">مالی</option>
                  <option value="sales">فروش</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-3">اولویت</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg"
                >
                  <option value="low">کم</option>
                  <option value="medium">متوسط</option>
                  <option value="high">زیاد</option>
                  <option value="urgent">فوری</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-3">پیام</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg"
                rows={5}
                placeholder="پیام خود را وارد کنید"
              />
            </div>
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleAdd}
                disabled={isSaving}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'در حال ارسال...' : 'ارسال'}
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="px-8 py-4 rounded-xl bg-gray-100 text-gray-800 hover:bg-gray-200 transition-all duration-300 font-bold text-lg"
              >
                لغو
              </button>
            </div>
          </div>
        </div>
      )}

      {tickets.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-xl border border-gray-100">
          <div className="text-8xl mb-6">🎫</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">هنوز تیکتی ثبت نکردی!</h2>
          <p className="text-gray-500 text-lg">اگر سوالی دارید تیکت ثبت کن</p>
        </div>
      ) : (
        <div className="space-y-6">
            {(Array.isArray(tickets) ? tickets : []).map((ticket) => (
              <Link key={ticket?.id || Math.random()} to={`/support-tickets/${ticket?.id || ''}`} className="block">
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <span>🎫</span>
                        {ticket?.subject || 'موضوع'}
                      </h3>
                      <p className="text-gray-500 text-sm flex items-center gap-2">
                        <span>⏰</span>
                        تاریخ: {ticket?.created_at ? new Date(ticket.created_at).toLocaleDateString('fa-IR') : ''}
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                      <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(ticket?.status)}`}>
                        {ticket?.status === 'resolved' ? 'حل شده' : ticket?.status === 'closed' ? 'بسته شده' : ticket?.status === 'in_progress' ? 'در حال بررسی' : 'در انتظار'}
                      </span>
                      <p className={`inline-block px-4 py-2 rounded-full text-xs font-bold ${getPriorityColor(ticket?.priority)}`}>
                        {getPriorityText(ticket?.priority)}
                      </p>
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
