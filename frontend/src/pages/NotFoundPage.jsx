import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="gradient-bg flex min-h-screen items-center justify-center px-4">
      <section className="glass-card text-center">
        <h1 className="text-3xl font-bold">404</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">The page you requested does not exist.</p>
        <Link to="/login" className="mt-4 inline-block rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500">
          Back to Login
        </Link>
      </section>
    </main>
  );
}
