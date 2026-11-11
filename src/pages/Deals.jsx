import { useState, useEffect } from 'react';
import { Tag, Sparkles } from 'lucide-react';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import { mockProducts } from '../data/mockData';

export default function Deals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    API.get('/products/?deal=true')
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : (res.data?.results || []);
        if (list.length > 0) {
          setDeals(list);
        } else {
          API.get('/products/')
            .then((allRes) => {
              const allList = Array.isArray(allRes.data) ? allRes.data : (allRes.data?.results || []);
              const withDiscount = allList.filter((p) => p.old_price && parseFloat(p.old_price) > parseFloat(p.price));
              setDeals(withDiscount.length > 0 ? withDiscount : allList.slice(0, 8));
            })
            .catch(() => loadFallback());
        }
      })
      .catch(() => loadFallback())
      .finally(() => setLoading(false));

    function loadFallback() {
      const dealProducts = mockProducts.filter((p) => p.is_deal || (p.old_price && Number(p.old_price) > Number(p.price)));
      setDeals(dealProducts.length > 0 ? dealProducts : mockProducts.slice(0, 8));
    }
  }, []);

  return (
    <div className="bg-surface min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-primary-dark via-primary to-accent p-8 sm:p-12 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Special Promotions
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold">Exclusive Deals & Offers</h1>
            <p className="text-gray-200 text-sm max-w-lg">
              Grab premium electronics, smartphones, and accessories with instant discounts of up to 50% off. Limited stock available!
            </p>
          </div>
          <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center text-white shrink-0">
            <span className="text-[10px] uppercase font-bold">Save Up To</span>
            <span className="text-2xl font-black">50%</span>
            <span className="text-[10px] uppercase font-bold">OFF</span>
          </div>
        </div>

        {/* Products Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Tag className="w-5 h-5 text-accent" /> Discounted Items
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-sm animate-pulse space-y-4">
                  <div className="bg-gray-100 aspect-square rounded-xl" />
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : deals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {deals.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center text-gray-500">
              Check back soon for new special deals!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

