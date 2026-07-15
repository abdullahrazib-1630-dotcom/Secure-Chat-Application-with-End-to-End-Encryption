import { useNavigate } from 'react-router-dom';
import ChangePasswordPage from './ChangePasswordPage';
import useAuth from '../hooks/useAuth';
import ThemeToggle from '../components/ThemeToggle';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <main className="gradient-bg min-h-screen px-4 py-8">
      <section className="mx-auto w-full max-w-3xl space-y-6">
        <div className="glass-card">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Security Dashboard</h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Welcome {user?.name || 'User'} | Last seen: {user?.lastSeen ? new Date(user.lastSeen).toLocaleString() : 'N/A'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="glass-card">
            <h2 className="text-lg font-semibold">Online Users</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Realtime user list will be enabled in Module 3.</p>
          </div>
          <div className="glass-card">
            <h2 className="text-lg font-semibold">Security Status</h2>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-600 dark:text-slate-300">
              <li>JWT Authentication Active</li>
              <li>Bcrypt Password Hashing Enabled</li>
              <li>Rate Limiting + Helmet Configured</li>
            </ul>
          </div>
        </div>

        <ChangePasswordPage />
      </section>
    </main>
  );
}
