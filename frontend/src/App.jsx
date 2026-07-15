import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import { useAuth } from './context/AuthContext';
import useTheme from './hooks/useTheme';
import useAutoLogout from './hooks/useAutoLogout';

function App() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useAutoLogout(() => {
    if (user) logout();
  }, (Number(import.meta.env.VITE_AUTO_LOGOUT_MINUTES) || 15) * 60 * 1000);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-900 to-slate-800 text-slate-100">
        {user && <Navbar onToggleTheme={toggleTheme} theme={theme} onLogout={logout} />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
