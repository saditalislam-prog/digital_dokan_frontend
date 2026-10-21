import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setSubmitting(true);
    const success = await login(username, password);
    setSubmitting(false);
    if (success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-[80vh] bg-surface flex items-center justify-center py-16 px-4">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-3">
            <img
              src="/logo-transparent.png"
              alt="Digital Dokan"
              className="h-12 w-auto mx-auto object-contain animate-logo-entrance hover:scale-105 transition-transform duration-300"
            />
          </Link>
          <h2 className="text-2xl font-extrabold text-gray-900">Welcome Back</h2>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to access your cart, orders, and account
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1.5">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full bg-surface text-sm border border-gray-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                Password
              </label>
              <span className="text-xs text-gray-400">Demo: admin / admin123</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface text-sm border border-gray-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-accent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-accent hover:bg-accent-dark text-white font-bold rounded-xl shadow-lg hover:shadow-accent/40 transition-all flex items-center justify-center gap-2 text-sm mt-2"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-accent hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

