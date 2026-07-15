import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function AuthLayout({ title, subtitle, children, footerText, footerLink, footerLabel }) {
  return (
    <main className="gradient-bg flex items-center justify-center px-4 py-10">
      <section className="glass-card w-full max-w-lg">
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>
          </div>
          <ThemeToggle />
        </header>
        {children}
        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
          {footerText}{' '}
          <Link className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400" to={footerLink}>
            {footerLabel}
          </Link>
        </p>
      </section>
    </main>
  );
}
