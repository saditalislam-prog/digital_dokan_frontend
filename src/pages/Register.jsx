import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Lock, User, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [validationErr, setValidationErr] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setValidationErr('');

    if (password !== password2) {
      setValidationErr('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setValidationErr('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);
    const success = await register(username, email, password, password2);
    setSubmitting(false);
    if (success) {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="min-h-[85vh] bg-surface flex items-center justify-center py-16 px-4">
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
          <h2 className="text-2xl font-extrabold text-gray-900">Create Account</h2>
          <p className="text-sm text-gray-500 mt-1">
            Join Digital Dokan for special tech deals and easy tracking
          </p>
        </div>

        {/* Error Alert */}
        {(error || validationErr) && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationErr || error}</span>
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
                placeholder="Choose a username"
                className="w-full bg-surface text-sm border border-gray-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full bg-surface text-sm border border-gray-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-surface text-sm border border-gray-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                placeholder="Re-enter password"
                className="w-full bg-surface text-sm border border-gray-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-accent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-accent hover:bg-accent-dark text-white font-bold rounded-xl shadow-lg hover:shadow-accent/40 transition-all flex items-center justify-center gap-2 text-sm mt-2"
          >
            {submitting ? 'Creating account...' : 'Create Account'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-accent hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

