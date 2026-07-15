import { Link } from 'react-router-dom';

const Navbar = ({ onToggleTheme, theme, onLogout }) => (
  <nav className="sticky top-0 z-10 border-b border-white/20 bg-white/10 px-4 py-3 backdrop-blur-lg dark:bg-slate-900/70">
    <div className="mx-auto flex max-w-6xl items-center justify-between">
      <Link to="/" className="text-lg font-semibold text-slate-100">SecureChat E2EE</Link>
      <div className="flex items-center gap-3 text-sm">
        <Link to="/dashboard" className="text-slate-200 hover:text-white">Dashboard</Link>
        <Link to="/chat" className="text-slate-200 hover:text-white">Chat</Link>
        <Link to="/profile" className="text-slate-200 hover:text-white">Profile</Link>
        <button onClick={onToggleTheme} className="rounded-md bg-slate-700 px-3 py-1 text-white">{theme === 'dark' ? 'Light' : 'Dark'}</button>
        <button onClick={onLogout} className="rounded-md bg-rose-600 px-3 py-1 text-white">Logout</button>
      </div>
    </div>
  </nav>
);

export default Navbar;
