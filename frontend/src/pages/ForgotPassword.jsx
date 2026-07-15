import { useState } from 'react';
import api from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const generateToken = async (e) => {
    e.preventDefault();
    const res = await api.post('/auth/forgot-password', { email });
    setToken(res.data.resetToken || '');
    setMessage(res.data.message);
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    const res = await api.post('/auth/reset-password', { token, newPassword });
    setMessage(res.data.message);
  };

  return (
    <div className="mx-auto mt-16 max-w-lg rounded-2xl border border-white/20 bg-white/10 p-6">
      <h1 className="mb-4 text-2xl font-bold">Forgot Password (Local)</h1>
      <form onSubmit={generateToken} className="space-y-2">
        <input className="w-full rounded bg-slate-900/40 p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="rounded bg-indigo-600 px-4 py-2">Generate Reset Token</button>
      </form>

      <form onSubmit={resetPassword} className="mt-4 space-y-2">
        <input className="w-full rounded bg-slate-900/40 p-2" placeholder="Reset Token" value={token} onChange={(e) => setToken(e.target.value)} />
        <input className="w-full rounded bg-slate-900/40 p-2" placeholder="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <button className="rounded bg-emerald-600 px-4 py-2">Reset Password</button>
      </form>
      {message && <p className="mt-3 text-sm text-emerald-300">{message}</p>}
    </div>
  );
};

export default ForgotPassword;
