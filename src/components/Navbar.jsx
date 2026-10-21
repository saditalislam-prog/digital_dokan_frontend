import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, User, ShoppingCart, Menu, X, ChevronDown, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import SearchModal from './SearchModal';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Shop', path: '/shop' },
  { name: 'Brands', path: '/brand/all' },
  { name: 'Accessories', path: '/category/accessories' },
  { name: 'Deals', path: '/deals' },
  { name: 'About', path: '/about' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const { cartCount } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-primary/95 backdrop-blur-md shadow-lg' : 'bg-primary'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Main Brand Logo */}
            <Link to="/" className="flex items-center shrink-0 group py-1">
              <div className="logo-wrapper animate-logo-entrance p-0.5">
                <img
                  src="/logo-white-text.png"
                  alt="Digital Dokan"
                  className="h-7 sm:h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <div className="logo-shine-beam" />
              </div>
              <span className="relative flex h-2 w-2 ml-1.5 self-center -mt-1" title="Store Live">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-sm shadow-emerald-400/50"></span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-7">
              {navLinks.map(link => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative text-sm font-medium py-1 transition-colors duration-200 group/link ${
                      isActive ? 'text-accent' : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <span>{link.name}</span>
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 bg-accent rounded-full transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0 group-hover/link:w-full opacity-80'
                      }`}
                    />
                  </Link>
                );
              })}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-3">
              {user && (user.is_staff || user.is_superuser) && (
                <Link
                  to="/admin/dashboard"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/90 hover:bg-accent text-white text-xs font-bold transition-all shadow-md mr-1 hover:scale-105 active:scale-95"
                  title="Admin Dashboard"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Portal</span>
                </Link>
              )}

              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-gray-300 hover:text-white transition-all duration-200 hover:scale-110"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link
                to={user ? '/profile' : '/login'}
                className="p-2 text-gray-300 hover:text-white transition-all duration-200 hover:scale-110"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </Link>

              <Link
                to="/cart"
                className="p-2 text-gray-300 hover:text-white transition-all duration-200 hover:scale-110 relative"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-badge-pop shadow-md shadow-accent/50">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
          mobileOpen ? 'max-h-96 border-t border-white/10' : 'max-h-0'
        }`}>
          <div className="px-4 py-4 space-y-2 bg-primary-dark">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'bg-accent/20 text-accent'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
                >
                  My Profile
                </Link>
                {(user.is_staff || user.is_superuser) && (
                  <Link
                    to="/admin/dashboard"
                    className="block px-4 py-2.5 rounded-lg text-sm font-bold text-accent bg-accent/10"
                  >
                    🛡️ Admin Portal
                  </Link>
                )}
              </>
            ) : (
              <Link
                to="/login"
                className="block px-4 py-2.5 rounded-lg text-sm font-medium text-accent hover:bg-accent/10"
              >
                Login / Register
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16 lg:h-18" />

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
