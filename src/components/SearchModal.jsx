import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await API.get(`/products/?search=${encodeURIComponent(query)}`);
        setResults(res.data.slice(0, 6));
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-6 py-4 border-b border-gray-100 gap-3">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search phones, laptops, watches, accessories..."
            className="w-full text-base outline-none text-gray-800 placeholder-gray-400 bg-transparent"
          />
          {loading && <Loader2 className="w-5 h-5 text-accent animate-spin shrink-0" />}
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-gray-400 text-sm">
              Type something to search our catalog...
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              {results.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <img
                    src={product.image || 'https://via.placeholder.com/80x80/f3f4f6/94a3b8?text=Product'}
                    alt={product.name}
                    className="w-14 h-14 object-cover rounded-lg bg-gray-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 group-hover:text-accent transition-colors truncate">
                      {product.name}
                    </h4>
                    <span className="text-xs text-gray-400">
                      {product.brand?.name || ''} · {product.category?.name || ''}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-gray-900">${parseFloat(product.price).toFixed(2)}</div>
                    {product.old_price && (
                      <div className="text-xs text-gray-400 line-through">${parseFloat(product.old_price).toFixed(2)}</div>
                    )}
                  </div>
                </Link>
              ))}
              <div className="pt-2 text-center border-t border-gray-100">
                <Link
                  to={`/shop?search=${encodeURIComponent(query)}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline py-2"
                >
                  View all results for "{query}" <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : !loading ? (
            <div className="py-8 text-center text-gray-400 text-sm">
              No products found matching "{query}"
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

