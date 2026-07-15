import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import { resetPassword } from '../services/authService';
import { isStrongPassword } from '../utils/validators';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ token: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!isStrongPassword(formData.newPassword)) {
      setError('New password must be 8+ characters with uppercase, lowercase, and number.');
      return;
    }

    try {
      const response = await resetPassword(formData);
      setMessage(response.data.message);
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err?.response?.data?.message || 'Reset password failed');
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Use your local reset token to set a new password"
      footerText="Need a token first?"
      footerLink="/forgot-password"
      footerLabel="Generate token"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField label="Reset Token" name="token" value={formData.token} onChange={handleChange} required />
        <InputField
          label="New Password"
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          required
        />

        {error ? <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600">{error}</p> : null}
        {message ? <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600">{message}</p> : null}

        <button type="submit" className="w-full rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-500">
          Reset Password
        </button>
      </form>
    </AuthLayout>
  );
}
