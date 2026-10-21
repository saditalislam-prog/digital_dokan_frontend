import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function MobileStoreBanner() {
  return (
    <section className="py-8 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0a1532] via-[#0f2452] to-[#143270] p-8 md:p-12 text-white shadow-xl">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            {/* Text info */}
            <div className="md:col-span-7 space-y-4">
              <span className="text-xs uppercase font-semibold text-accent-light tracking-wider">
                Why Digital Dokan?
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                Your Trusted Mobile Store
              </h2>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                We bring you the latest smartphones, accessories and more — with 100% genuine products, official warranties, best prices, and friendly customer care across the country.
              </p>
              
              <div className="grid grid-cols-2 gap-3 pt-2 text-sm text-gray-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% Genuine Devices</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Official Brand Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Fast Nationwide Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>7 Days Return Guarantee</span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-accent/40"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Visual image */}
            <div className="md:col-span-5 flex items-center justify-center">
              <div className="relative w-full max-w-sm">
                <img
                  src="https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&auto=format&fit=crop&q=80"
                  alt="Modern mobile devices"
                  className="rounded-2xl shadow-2xl object-cover w-full h-64 md:h-72 border border-white/10"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/500x350/0a1532/ffffff?text=Digital+Dokan';
                  }}
                />
                <div className="absolute -bottom-3 -right-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-xs font-semibold text-white tracking-wide shadow-lg">
                  ⭐ 4.9/5 Rating from 10k+ Buyers
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

