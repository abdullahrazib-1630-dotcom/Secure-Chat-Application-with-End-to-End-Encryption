import { useState } from 'react';
import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import { forgotPassword } from '../services/authService';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setResult('');
    setToken('');

    try {
      const response = await forgotPassword({ email });
      setResult(response.data.message);
      if (response.data.resetToken) {
        setToken(response.data.resetToken);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to process request');
    }
  };

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Generate a local reset token for account recovery"
      footerText="Remember your password?"
      footerLink="/login"
      footerLabel="Back to login"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          required
        />

        {error ? <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600">{error}</p> : null}
        {result ? <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600">{result}</p> : null}
        {token ? (
          <p className="break-all rounded-lg bg-sky-500/10 px-3 py-2 text-sm text-sky-700 dark:text-sky-300">
            Local reset token: <strong>{token}</strong>
          </p>
        ) : null}

        <button type="submit" className="w-full rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-500">
          Generate Reset Token
        </button>
      </form>
    </AuthLayout>
  );
}
