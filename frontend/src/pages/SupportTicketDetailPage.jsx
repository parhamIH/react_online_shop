import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAsyncData } from '../hooks/useAsyncData';
import { shopApi } from '../api/shop';
import { ArrowLeft } from 'lucide-react';

export default function SupportTicketDetailPage() {
  const { id } = useParams();
  const { data: ticket, loading, refetch } = useAsyncData(() => shopApi.getSupportTicket(id), [id], null);
  const [reply, setReply] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendReply = async () => {
    if (!reply.trim()) return;
    setIsSending(true);
    try {
      await shopApi.createTicketReply(id, { message: reply });
      await refetch();
      setReply('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">Loading...</div>;
  if (!ticket) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-red-500">تیکت یافت نشد</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/profile/support-tickets" className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6">
        <ArrowLeft className="w-4 h-4" />
        بازگشت
      </Link>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold">{ticket.subject}</h1>
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
        <p className="text-gray-700">{ticket.message}</p>
      </div>

      <div className="space-y-4 mb-6">
        {(Array.isArray(ticket?.replies) ? ticket.replies : []).map((r) => (
          <div key={r?.id || Math.random()} className={`rounded-lg shadow p-4 ${r?.is_staff_reply ? 'bg-blue-50' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-sm">{r?.is_staff_reply ? 'پشتیبان' : r?.username || 'کاربر'}</span>
              <span className="text-xs text-gray-400">{r?.created_at ? new Date(r.created_at).toLocaleDateString('fa-IR') : ''}</span>
            </div>
            <p className="text-gray-700">{r?.message || ''}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">پاسخ</h3>
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
          rows={4}
          placeholder="پیام خود را بنویسید..."
        />
        <button
          onClick={handleSendReply}
          disabled={isSending}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isSending ? 'در حال ارسال...' : 'ارسال پاسخ'}
        </button>
      </div>
    </div>
  );
}
