import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import API from '../api/axios';
import ProductCard from './ProductCard';

const fallbackProducts = [
  { id: 1, name: 'iPhone 16 Pro Max', slug: 'iphone-16-pro-max', price: 1199.00, old_price: 1299.00, rating: 4.9, review_count: 234, is_new: true, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80' },
  { id: 5, name: 'iPhone 16 Pro', slug: 'iphone-16-pro', price: 999.00, rating: 4.8, review_count: 178, is_new: true, image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80' },
  { id: 6, name: 'Samsung Galaxy Z Fold 5', slug: 'samsung-galaxy-z-fold-5', price: 1799.00, old_price: 1899.00, rating: 4.7, review_count: 95, is_new: true, image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&auto=format&fit=crop&q=80' },
  { id: 7, name: 'Google Pixel 9', slug: 'google-pixel-9', price: 699.00, rating: 4.6, review_count: 88, is_new: true, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80' },
  { id: 21, name: 'iPhone 16', slug: 'iphone-16', price: 799.00, rating: 4.6, review_count: 167, is_new: true, image: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=600&auto=format&fit=crop&q=80' },
  { id: 8, name: 'OnePlus Nord 4', slug: 'oneplus-nord-4', price: 399.00, old_price: 449.00, rating: 4.5, review_count: 112, is_new: true, image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&auto=format&fit=crop&q=80' },
  { id: 9, name: 'iPad Pro M4', slug: 'ipad-pro-m4', price: 1099.00, rating: 4.9, review_count: 210, is_new: true, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80' },
  { id: 13, name: 'Apple Watch Ultra 2', slug: 'apple-watch-ultra-2', price: 799.00, rating: 4.8, review_count: 145, is_new: true, image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80' },
];

export default function LatestArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    API.get('/products/', { params: { new: true } })
      .then((res) => {
        if (!cancelled) {
          const data = res.data.results || res.data;
          setProducts(data.length > 0 ? data : fallbackProducts);
        }
      })
      .catch(() => {
        if (!cancelled) setProducts(fallbackProducts);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const displayList = (products && products.length > 0 ? products : fallbackProducts).slice(0, 8);

  return (
    <section className="py-16 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-accent text-sm font-semibold uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Just Arrived
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-1">Latest Arrivals</h2>
            <p className="text-gray-500 mt-2">Be the first to get the newest devices</p>
          </div>
          <Link
            to="/shop"
            className="hidden sm:inline-flex items-center gap-1 text-accent font-medium hover:text-accent-dark transition-colors"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                <div className="w-full aspect-square bg-gray-100" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-5 bg-gray-100 rounded w-1/3" />
                  <div className="h-10 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayList.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="sm:hidden mt-6 text-center">
          <Link to="/shop" className="inline-flex items-center gap-1 text-accent font-medium">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
