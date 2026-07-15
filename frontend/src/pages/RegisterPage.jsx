import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import useAuth from '../hooks/useAuth';
import { isStrongPassword } from '../utils/validators';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!isStrongPassword(formData.password)) {
      setError('Password must be 8+ characters with uppercase, lowercase, and number.');
      return;
    }

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <AuthLayout
      title="Create Secure Account"
      subtitle="Start private end-to-end encrypted communication"
      footerText="Already have an account?"
      footerLink="/login"
      footerLabel="Sign in"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
        <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
        <InputField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {error ? <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
    </AuthLayout>
  );
}
