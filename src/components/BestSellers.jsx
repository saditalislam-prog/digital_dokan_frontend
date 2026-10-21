import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import API from '../api/axios';
import ProductCard from './ProductCard';

const fallbackProducts = [
  { id: 1, name: 'iPhone 16 Pro Max', slug: 'iphone-16-pro-max', price: 1199.00, old_price: 1299.00, rating: 4.9, review_count: 245, is_bestseller: true, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80' },
  { id: 2, name: 'Samsung Galaxy S24 Ultra', slug: 'samsung-galaxy-s24-ultra', price: 949.00, old_price: 1099.00, rating: 4.7, review_count: 189, is_bestseller: true, image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80' },
  { id: 3, name: 'Google Pixel 9 Pro', slug: 'google-pixel-9-pro', price: 899.00, old_price: 999.00, rating: 4.6, review_count: 156, is_bestseller: true, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80' },
  { id: 4, name: 'OnePlus 12', slug: 'oneplus-12', price: 799.00, old_price: 899.00, rating: 4.5, review_count: 120, is_bestseller: true, image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80' },
];

export default function BestSellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    API.get('/products/', { params: { bestseller: true, limit: 4 } })
      .then(res => {
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
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-accent text-sm font-semibold uppercase tracking-wide">Featured Products</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-1">Best Selling Products</h2>
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
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="w-full aspect-square skeleton" />
                <div className="p-4 space-y-3">
                  <div className="h-4 skeleton rounded w-3/4" />
                  <div className="h-3 skeleton rounded w-1/2" />
                  <div className="h-5 skeleton rounded w-1/3" />
                  <div className="h-10 skeleton rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="sm:hidden mt-6 text-center">
          <Link to="/shop" className="inline-flex items-center gap-1 text-accent font-medium">
            View All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
