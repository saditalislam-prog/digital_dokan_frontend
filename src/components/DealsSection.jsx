import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function DealsSection() {
  return (
    <section className="py-8 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-dark via-primary to-primary-light p-8 md:p-12 text-white shadow-xl">
          {/* Radial light effect */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-accent/20 blur-3xl pointer-events-none rounded-full" />
          
          <div className="grid md:grid-cols-12 gap-8 items-center relative z-10">
            <div className="md:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/30 text-accent-light text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                Limited Time Offers
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Save More with Our Deals
              </h2>
              <p className="text-gray-300 text-sm md:text-base max-w-lg">
                Get the best offers on your favorite smartphones, tablets, and premium accessories.
                Upgrade today with exceptional discounts!
              </p>
              <div className="pt-2">
                <Link
                  to="/deals"
                  className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-accent/40"
                >
                  View Deals
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="md:col-span-5 flex items-center justify-center md:justify-end">
              <div className="relative animate-float-slow">
                {/* 50% OFF Badge */}
                <div className="absolute -top-3 -right-3 z-20 w-20 h-20 rounded-full bg-accent flex flex-col items-center justify-center text-white shadow-xl border-2 border-white/20 animate-bounce-gentle shadow-accent/50">
                  <span className="text-[10px] font-bold uppercase leading-none">Up To</span>
                  <span className="text-xl font-extrabold leading-tight">50%</span>
                  <span className="text-[10px] font-bold uppercase leading-none">OFF</span>
                </div>
                {/* Phones imagery */}
                <div className="relative z-10 w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center rounded-2xl overflow-hidden bg-primary/40 border border-white/10 shadow-2xl p-4">
                  <img
                    src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=600&auto=format&fit=crop&q=80"
                    alt="Smartphone Deals"
                    className="w-full h-full object-cover rounded-xl hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x400/0f1b3d/ffffff?text=Deal+Phones';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

