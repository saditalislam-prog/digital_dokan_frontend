import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import API from '../api/axios';
import ProductCard from './ProductCard';

const fallbackProducts = [
  { id: 5, name: 'iPad Air M2', slug: 'ipad-air-m2', price: 599.00, old_price: 649.00, rating: 4.8, review_count: 98, is_new: true, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80' },
  { id: 6, name: 'MacBook Pro 14" M3', slug: 'macbook-pro-14-m3', price: 1599.00, old_price: 1799.00, rating: 4.9, review_count: 310, is_new: true, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80' },
  { id: 7, name: 'Sony WH-1000XM5', slug: 'sony-wh-1000xm5', price: 349.00, old_price: 399.00, rating: 4.8, review_count: 420, is_new: true, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80' },
  { id: 8, name: 'Apple Watch Ultra 2', slug: 'apple-watch-ultra-2', price: 799.00, old_price: 849.00, rating: 4.9, review_count: 175, is_new: true, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80' },
];

export default function LatestArrivals() {
  const [products, setProducts] = useState(fallbackProducts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    API.get('/products/', { params: { new: true } })
      .then((res) => {
        if (!cancelled) {
          const list = Array.isArray(res.data)
            ? res.data
            : (Array.isArray(res.data?.results) ? res.data.results : []);
          if (list.length > 0) {
            setProducts(list);
          }
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

  const displayList = Array.isArray(products) && products.length > 0 ? products : fallbackProducts;

  return (
    <section className="py-16 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-accent text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Just Unboxed
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Latest Arrivals
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
          >
            Explore All New <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="w-full aspect-square skeleton" />
                <div className="p-4 space-y-3">
                  <div className="h-4 skeleton rounded w-3/4" />
                  <div className="h-3 skeleton rounded w-1/2" />
                  <div className="h-5 skeleton rounded w-1/3" />
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
      </div>
    </section>
  );
}
