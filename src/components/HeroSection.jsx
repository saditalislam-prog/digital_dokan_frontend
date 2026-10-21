import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Truck, ShieldCheck, RotateCcw, Sparkles } from 'lucide-react';

const slides = [
  {
    id: 1,
    tag: 'Latest Smartphones & Accessories',
    title: 'Upgrade Your',
    titleAccent: 'Mobile Experience',
    description: 'Top brands. Best prices. Unmatched quality. Your next smartphone is just a click away.',
    buttonText: 'Shop Now',
    buttonLink: '/shop',
    badgeText: 'Latest Models',
    // Devices setup for pedestal showcase
    devices: {
      center: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80', // iPhone Pro display
      left: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&auto=format&fit=crop&q=80', // White/Silver triple camera back
      right: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80', // Dark sleek phone
    }
  },
  {
    id: 2,
    tag: 'Galaxy AI is Here',
    title: 'Discover the New',
    titleAccent: 'Galaxy S24 Ultra',
    description: 'Unleash unprecedented creativity and productivity with built-in S-Pen, 200MP camera and titanium durability.',
    buttonText: 'Explore Samsung',
    buttonLink: '/brand/samsung',
    badgeText: 'Hot Release',
    devices: {
      center: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
      left: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=500&auto=format&fit=crop&q=80',
      right: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&auto=format&fit=crop&q=80',
    }
  },
  {
    id: 3,
    tag: 'Special Mega Discounts',
    title: 'Save Big On',
    titleAccent: 'Flagship Deals',
    description: 'Get up to 50% discount on genuine smartphones, tablets, smartwatches and audio accessories with warranty.',
    buttonText: 'View Deals',
    buttonLink: '/deals',
    badgeText: '50% OFF',
    devices: {
      center: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
      left: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80',
      right: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80',
    }
  }
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative bg-gradient-to-br from-[#071129] via-[#0d1e47] to-[#081330] overflow-hidden text-white pt-6 pb-12 lg:pt-10 lg:pb-16 select-none">
      {/* Background ambient radial glow */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[460px]">
          
          {/* Left Hero Text Content */}
          <div key={slide.id} className="lg:col-span-6 space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/20 border border-accent/30 text-accent-light text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>{slide.tag}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
              {slide.title}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-accent-light to-blue-300 block sm:inline">
                {slide.titleAccent}
              </span>
            </h1>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-lg">
              {slide.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to={slide.buttonLink}
                className="inline-flex items-center gap-2.5 bg-accent hover:bg-accent-dark text-white font-bold px-8 py-3.5 rounded-xl transition-all duration-300 shadow-xl shadow-accent/30 hover:scale-105 active:scale-95 text-sm"
              >
                {slide.buttonText}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-200 border border-white/15 text-sm backdrop-blur-sm hover:scale-105 active:scale-95"
              >
                Explore All
              </Link>
            </div>
          </div>

          {/* Right Hero Showcase — Reference 3D Pedestal with Smartphones */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="relative w-full max-w-lg h-[380px] sm:h-[420px] flex items-center justify-center">
              
              {/* Circular Pedestal / 3D Platform glow */}
              <div className="absolute bottom-6 w-72 sm:w-84 h-24 sm:h-28 rounded-[100%] bg-gradient-to-r from-accent/40 via-blue-400/60 to-accent/40 blur-md border-t-2 border-accent/80 shadow-[0_0_50px_rgba(37,99,235,0.6)] animate-pulse-slow" />
              <div className="absolute bottom-4 w-60 sm:w-72 h-16 rounded-[100%] bg-primary-dark/90 border border-accent/60" />

              {/* Hand-drawn style badge: 'Latest Models' */}
              <div className="absolute -top-2 right-4 sm:right-8 z-30 bg-accent/30 backdrop-blur-md border border-accent text-accent-light text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-bounce-gentle">
                <span>⭐</span>
                <span>{slide.badgeText}</span>
              </div>

              {/* Left Phone (Behind center, angled) */}
              <div className="absolute left-6 sm:left-12 bottom-12 z-10 w-36 sm:w-44 h-56 sm:h-64 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 transform -rotate-12 hover:rotate-0 transition-transform duration-500 bg-black/60 animate-float-delayed">
                <img
                  src={slide.devices.left}
                  alt="Left phone"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&auto=format&fit=crop&q=80';
                  }}
                />
              </div>

              {/* Right Phone (Behind center, angled) */}
              <div className="absolute right-6 sm:right-12 bottom-12 z-10 w-36 sm:w-44 h-56 sm:h-64 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 transform rotate-12 hover:rotate-0 transition-transform duration-500 bg-black/60 animate-float-reverse">
                <img
                  src={slide.devices.right}
                  alt="Right phone"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80';
                  }}
                />
              </div>

              {/* Center Main Smartphone (Standing prominently on the pedestal) */}
              <div className="relative z-20 w-48 sm:w-56 h-72 sm:h-84 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-4 border-white/30 transform hover:-translate-y-2 transition-transform duration-300 bg-slate-900 animate-float-slow">
                <img
                  src={slide.devices.center}
                  alt="Main flagship phone"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80';
                  }}
                />
                {/* Dynamic island / Screen gloss reflection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Slider Controls (Prev, Next, Dots) */}
        <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-6">
          {/* Dot Indicators */}
          <div className="flex items-center gap-2.5">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-300 rounded-full ${
                  currentSlide === idx
                    ? 'w-8 h-2.5 bg-accent'
                    : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 mt-6 border-t border-white/10">
          <div className="flex items-center gap-3.5 text-gray-300">
            <div className="w-11 h-11 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center shrink-0 text-accent">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Free Shipping</p>
              <p className="text-gray-400 text-xs">On All Orders Across Country</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 text-gray-300">
            <div className="w-11 h-11 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center shrink-0 text-accent">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Secure Shopping</p>
              <p className="text-gray-400 text-xs">100% Genuine Guaranteed</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 text-gray-300">
            <div className="w-11 h-11 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center shrink-0 text-accent">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">7 Days Return</p>
              <p className="text-gray-400 text-xs">Hassle Free Replacements</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
