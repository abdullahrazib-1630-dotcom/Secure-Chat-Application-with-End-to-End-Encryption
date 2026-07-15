import { useEffect, useState } from 'react';
import api from '../services/api';
import SecurityBadge from '../components/SecurityBadge';

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/users/dashboard').then((res) => setData(res.data.dashboard)).catch(() => setData(null));
  }, []);

  if (!data) return <p className="p-6">Loading dashboard...</p>;

  return (
    <div className="mx-auto grid max-w-6xl gap-4 p-6 md:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-2xl border border-white/20 bg-white/10 p-4">Online Users: <strong>{data.onlineUsers}</strong></div>
      <div className="rounded-2xl border border-white/20 bg-white/10 p-4">Unread Messages: <strong>{data.unreadMessages}</strong></div>
      <div className="rounded-2xl border border-white/20 bg-white/10 p-4">Last Login: <strong>{data.lastLogin ? new Date(data.lastLogin).toLocaleString() : 'N/A'}</strong></div>
      <SecurityBadge text={data.securityStatus} />

      <div className="col-span-full rounded-2xl border border-white/20 bg-white/10 p-4">
        <h2 className="mb-2 text-lg font-semibold">Recent Chats</h2>
        <div className="space-y-2">
          {data.recentChats.map((chat) => (
            <div key={chat._id} className="rounded border border-white/10 p-2 text-sm">
              <p>From: {chat.sender?.name} → To: {chat.receiver?.name}</p>
              <p className="text-xs text-slate-300">{new Date(chat.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
