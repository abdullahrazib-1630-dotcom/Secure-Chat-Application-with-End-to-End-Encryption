import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '', rememberMe: true });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="mx-auto mt-20 max-w-md rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-lg">
      <h1 className="mb-4 text-2xl font-bold">Secure Login</h1>
      <form className="space-y-3" onSubmit={submit}>
        <input className="w-full rounded-lg bg-slate-900/40 p-2" placeholder="Email" type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="w-full rounded-lg bg-slate-900/40 p-2" placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.rememberMe} onChange={(e) => setForm({ ...form, rememberMe: e.target.checked })} />Remember Me</label>
        {error && <p className="text-sm text-rose-300">{error}</p>}
        <button className="w-full rounded-lg bg-emerald-600 p-2">Login</button>
      </form>
      <div className="mt-3 flex justify-between text-sm">
        <Link to="/register">Create account</Link>
        <Link to="/forgot-password">Forgot password</Link>
      </div>
    </div>
  );
};

export default Login;
