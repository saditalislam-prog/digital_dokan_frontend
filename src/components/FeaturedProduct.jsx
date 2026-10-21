import { Link } from 'react-router-dom';
import { ArrowRight, Apple, Check } from 'lucide-react';

export default function FeaturedProduct() {
  return (
    <section className="py-10 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-100 rounded-3xl border border-gray-200/80 shadow-md">
          <div className="grid lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 lg:p-16">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2">
                <Apple className="w-7 h-7 text-gray-900" />
                <span className="text-xs font-bold text-gray-700 uppercase tracking-widest">
                  Apple Flagship
                </span>
              </div>

              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
                  iPhone 16 Pro
                </h2>
                <p className="text-xl sm:text-2xl text-gray-500 font-semibold mt-2">
                  Bigger. Brighter. Bolder.
                </p>
              </div>

              <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-lg">
                Forged in Grade 5 Titanium with the breakthrough A18 Pro chip, 48MP Fusion camera system, and the thinnest borders ever on any Apple product.
              </p>

              <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-700 font-medium">
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-accent" /> A18 Pro Chip</span>
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-accent" /> Camera Control</span>
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-accent" /> 4K 120 fps Dolby</span>
              </div>

              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-3xl sm:text-4xl font-black text-gray-900">$999.00</span>
                <span className="text-base text-gray-400 line-through">$1,099.00</span>
              </div>

              <div className="pt-2">
                <Link
                  to="/product/iphone-16-pro"
                  className="inline-flex items-center gap-2.5 bg-accent hover:bg-accent-dark text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-accent/30 hover:scale-105 active:scale-95 text-sm"
                >
                  Shop Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Realistic Image */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-square flex items-center justify-center animate-float-slow">
                <div className="absolute inset-0 bg-blue-400/15 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
                <img
                  src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=700&auto=format&fit=crop&q=80"
                  alt="iPhone 16 Pro Natural Titanium"
                  className="relative z-10 w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500 rounded-2xl"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=700&auto=format&fit=crop&q=80';
                  }}
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
