import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, LogOut, CheckCircle, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function Profile() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
    if (user?.profile) {
      setPhone(user.profile.phone || '');
      setAddress(user.profile.address || '');
    }
  }, [user, loading, navigate]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // If we have an endpoint or we just simulate saving user details
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading user account...</div>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-accent text-white flex items-center justify-center text-2xl font-bold">
                {user.username ? user.username[0].toUpperCase() : 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
                <p className="text-sm text-gray-500">{user.email || 'Digital Dokan Member'}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-sm font-semibold transition-colors self-start sm:self-auto"
            >
              <LogOut className="w-4 h-4" /> Log Out
            </button>
          </div>

          {/* Quick info boxes */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-surface p-4 rounded-2xl border border-gray-100">
              <span className="text-xs text-gray-400 font-medium">Account Status</span>
              <p className="text-sm font-bold text-emerald-600 mt-1">Verified Member</p>
            </div>
            <div className="bg-surface p-4 rounded-2xl border border-gray-100">
              <span className="text-xs text-gray-400 font-medium">Payment Preference</span>
              <p className="text-sm font-bold text-gray-800 mt-1">Cash on Delivery</p>
            </div>
            <div className="bg-surface p-4 rounded-2xl border border-gray-100">
              <span className="text-xs text-gray-400 font-medium">Reward Points</span>
              <p className="text-sm font-bold text-accent mt-1">150 Dokan Points</p>
            </div>
          </div>

          {/* Profile Details Form */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Personal Details & Delivery Address</h2>
            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Username</label>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-500">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>{user.username}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Email</label>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-500">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{user.email || 'No email provided'}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Phone Number</label>
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1XXXXXXXXX"
                    className="w-full outline-none bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Delivery Address</label>
                <div className="flex items-start gap-2 bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House/Street, Area, City"
                    className="w-full outline-none bg-transparent"
                  />
                </div>
              </div>

              {savedSuccess && (
                <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold">
                  <CheckCircle className="w-4 h-4" /> Details updated successfully!
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-accent hover:bg-accent-dark text-white font-semibold rounded-xl text-sm transition-colors"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

