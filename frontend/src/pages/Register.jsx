import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-lg">
      <h1 className="mb-4 text-2xl font-bold">Create Secure Account</h1>
      <form className="space-y-3" onSubmit={submit}>
        <input className="w-full rounded-lg bg-slate-900/40 p-2" placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="w-full rounded-lg bg-slate-900/40 p-2" placeholder="Email" type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="w-full rounded-lg bg-slate-900/40 p-2" placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        {error && <p className="text-sm text-rose-300">{error}</p>}
        <button className="w-full rounded-lg bg-emerald-600 p-2">Register</button>
      </form>
      <p className="mt-3 text-sm">Already have account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default Register;
