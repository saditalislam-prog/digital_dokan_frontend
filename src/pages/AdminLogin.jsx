import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, User, AlertCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && (user.is_staff || user.is_superuser)) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const success = await login(username, password);
    setLoading(false);

    if (success) {
      // User will be updated in AuthContext, navigate to admin dashboard
      navigate('/admin/dashboard', { replace: true });
    } else {
      setErrorMsg('Invalid admin credentials. Use admin / admin123');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#071129] via-[#0d1e47] to-[#081330] flex items-center justify-center p-4">
      {/* Glow effect */}
      <div className="absolute w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-10 shadow-2xl text-white">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-5">
            <img
              src="/logo-white-text.png"
              alt="Digital Dokan"
              className="h-10 w-auto mx-auto object-contain animate-logo-entrance hover:scale-105 transition-transform duration-300"
            />
          </Link>
          <div className="w-14 h-14 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center mx-auto mb-3 text-accent shadow-lg">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Admin Management Portal</h1>
          <p className="text-gray-300 text-xs mt-1">
            Sign in with staff credentials to manage Digital Dokan
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-300 block mb-1.5">
              Admin Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-400 outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Password
              </label>
              <span className="text-[11px] text-accent-light">Default: admin123</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-400 outline-none focus:border-accent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-accent hover:bg-accent-dark text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm mt-4 cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Access Dashboard'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-white/10">
          <Link
            to="/"
            className="text-xs text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1"
          >
            ← Return to Digital Dokan Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}

