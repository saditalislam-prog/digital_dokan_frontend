import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function PremiumBanner() {
  return (
    <section className="py-8 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-dark via-primary to-primary-light p-8 md:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left Text */}
          <div className="space-y-4 max-w-xl">
            <span className="text-xs uppercase font-semibold text-accent tracking-wider">
              Essential Add-Ons
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Premium Accessories
            </h2>
            <p className="text-gray-300 text-base">
              Better protection. More convenience. Enhance your setup with top-tier wireless earbuds, fast chargers, watch bands, and durable cases.
            </p>
            <div className="pt-2">
              <Link
                to="/category/accessories"
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-accent/40"
              >
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Accessories items */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="w-28 h-28 bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 flex flex-col items-center justify-center shadow-lg hover:scale-105 transition-transform">
              <img
                src="https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=200&auto=format&fit=crop&q=80"
                alt="AirPods"
                className="w-16 h-16 object-cover rounded-lg"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/100x100/1e293b/ffffff?text=Buds'; }}
              />
              <span className="text-[11px] font-medium text-gray-200 mt-1">Earbuds</span>
            </div>
            <div className="w-28 h-28 bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 flex flex-col items-center justify-center shadow-lg hover:scale-105 transition-transform">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80"
                alt="Smartwatch"
                className="w-16 h-16 object-cover rounded-lg"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/100x100/1e293b/ffffff?text=Watch'; }}
              />
              <span className="text-[11px] font-medium text-gray-200 mt-1">Watches</span>
            </div>
            <div className="w-28 h-28 bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 flex flex-col items-center justify-center shadow-lg hover:scale-105 transition-transform">
              <img
                src="https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=200&auto=format&fit=crop&q=80"
                alt="Chargers"
                className="w-16 h-16 object-cover rounded-lg"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/100x100/1e293b/ffffff?text=Power'; }}
              />
              <span className="text-[11px] font-medium text-gray-200 mt-1">Fast Charge</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

