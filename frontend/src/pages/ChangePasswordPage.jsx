import { useState } from 'react';
import InputField from '../components/InputField';
import { changePassword } from '../services/authService';
import { isStrongPassword } from '../utils/validators';

export default function ChangePasswordPage() {
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

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
      const response = await changePassword(formData);
      setMessage(response.data.message);
      setFormData({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setError(err?.response?.data?.message || 'Password update failed');
    }
  };

  return (
    <section className="glass-card mt-6">
      <h2 className="mb-4 text-lg font-semibold">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Current Password"
          type="password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          required
        />
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

        <button type="submit" className="rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500">
          Update Password
        </button>
      </form>
    </section>
  );
}
