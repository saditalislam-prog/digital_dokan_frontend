import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Apple,
  Check,
  Cpu,
  ShieldCheck,
  Camera,
  Sparkles,
  Wifi,
  BatteryCharging
} from 'lucide-react';

const titaniumFinishes = [
  {
    id: 'natural',
    name: 'Natural Titanium',
    hex: '#9A958D',
    glow: 'rgba(154, 149, 141, 0.35)',
    borderGradient: 'from-amber-200/40 via-stone-400 to-amber-900/40',
    wallpaperGradient: 'from-[#1c1a17] via-[#2a2620] to-[#12110e]',
  },
  {
    id: 'desert',
    name: 'Desert Titanium',
    hex: '#C5A880',
    glow: 'rgba(197, 168, 128, 0.35)',
    borderGradient: 'from-amber-300/50 via-yellow-600/40 to-amber-950',
    wallpaperGradient: 'from-[#241a12] via-[#332517] to-[#140d07]',
  },
  {
    id: 'white',
    name: 'White Titanium',
    hex: '#E3E4E6',
    glow: 'rgba(227, 228, 230, 0.35)',
    borderGradient: 'from-slate-200 via-zinc-400 to-slate-700',
    wallpaperGradient: 'from-[#1a1c22] via-[#252830] to-[#101217]',
  },
  {
    id: 'black',
    name: 'Black Titanium',
    hex: '#3C3B3E',
    glow: 'rgba(70, 70, 75, 0.45)',
    borderGradient: 'from-zinc-500 via-neutral-700 to-black',
    wallpaperGradient: 'from-[#0d0e12] via-[#171920] to-[#070709]',
  },
];

export default function FeaturedProduct() {
  const [activeFinish, setActiveFinish] = useState(titaniumFinishes[0]);

  return (
    <section className="py-12 bg-surface select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-50/80 via-indigo-50/50 to-slate-100 dark:from-[#0d1629] dark:via-[#111c35] dark:to-[#090e1d] rounded-3xl border border-gray-200/80 dark:border-slate-800 shadow-md dark:shadow-2xl">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center p-8 sm:p-12 lg:p-16">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2">
                <Apple className="w-7 h-7 text-gray-900 dark:text-white" />
                <span className="text-xs font-bold text-gray-700 dark:text-accent-light uppercase tracking-widest">
                  Apple Flagship Showcase
                </span>
              </div>

              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
                  iPhone 16 Pro
                </h2>
                <p className="text-xl sm:text-2xl text-accent dark:text-accent-light font-bold mt-2">
                  Bigger. Brighter. Bolder.
                </p>
              </div>

              <p className="text-gray-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg">
                Forged in Grade 5 Titanium with the breakthrough A18 Pro chip, 48MP Fusion camera system, and the thinnest borders ever on any Apple product.
              </p>

              {/* Color Finish Selector */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-slate-300">
                  <span>Finish:</span>
                  <span className="text-accent dark:text-accent-light font-extrabold">{activeFinish.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  {titaniumFinishes.map((finish) => (
                    <button
                      key={finish.id}
                      onClick={() => setActiveFinish(finish)}
                      className={`relative w-8 h-8 rounded-full transition-all duration-300 p-0.5 flex items-center justify-center ${
                        activeFinish.id === finish.id
                          ? 'ring-2 ring-accent ring-offset-2 ring-offset-white dark:ring-offset-slate-900 scale-110'
                          : 'opacity-80 hover:opacity-100 hover:scale-105'
                      }`}
                      title={finish.name}
                      style={{ backgroundColor: finish.hex }}
                    >
                      {activeFinish.id === finish.id && (
                        <div className="w-2 h-2 rounded-full bg-white shadow-sm" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Spec Highlights */}
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-700 dark:text-slate-200 font-medium pt-1">
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-accent" /> A18 Pro Chip</span>
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-accent" /> Camera Control</span>
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-accent" /> 4K 120 fps Dolby</span>
              </div>

              {/* Pricing & CTA */}
              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">$999.00</span>
                <span className="text-base text-gray-400 dark:text-slate-500 line-through">$1,099.00</span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Save $100
                </span>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/product/iphone-16-pro"
                  className="inline-flex items-center gap-2.5 bg-accent hover:bg-accent-dark text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-accent/30 hover:scale-105 active:scale-95 text-sm"
                >
                  Shop Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/brand/apple"
                  className="inline-flex items-center gap-2 bg-white/70 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-slate-700 font-bold px-5 py-3.5 rounded-xl transition-all text-sm shadow-sm"
                >
                  Explore Apple Store
                </Link>
              </div>
            </div>

            {/* Right Keynote 3D Flagship Presentation Stage */}
            <div className="lg:col-span-5 relative flex items-center justify-center py-6 sm:py-8">
              
              {/* Dynamic Ambient Glow Field */}
              <div
                className="absolute w-72 sm:w-88 h-72 sm:h-88 rounded-full blur-3xl pointer-events-none transition-colors duration-700 animate-pulse-slow"
                style={{ backgroundColor: activeFinish.glow }}
              />

              {/* Concentric Halo Tech Rings (Animated Tech Radar & Dotted Orbit Lines) */}
              <div className="absolute w-96 sm:w-[460px] h-96 sm:h-[460px] rounded-full border border-accent/20 dark:border-accent/30 pointer-events-none animate-radar-pulse" />
              <div className="absolute w-80 sm:w-[410px] h-80 sm:h-[410px] rounded-full border-2 border-dashed border-accent/40 dark:border-accent/50 pointer-events-none animate-spin-reverse" />
              <div className="absolute w-64 sm:w-80 h-64 sm:h-80 rounded-full border border-white/30 dark:border-white/20 pointer-events-none animate-spin-slow" />
              <div
                className="absolute w-72 sm:w-[350px] h-72 sm:h-[350px] rounded-full border border-dotted border-purple-400/35 dark:border-purple-300/25 pointer-events-none animate-spin"
                style={{ animationDuration: '45s' }}
              >
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_10px_#3b82f6]" />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-pink-400 shadow-[0_0_8px_#f472b6]" />
              </div>

              {/* Main 3D Phone Mockup Container */}
              <div className="relative z-10 w-[240px] sm:w-[268px] transition-transform duration-500 hover:scale-105 hover:-translate-y-2">
                
                {/* Phone Outer Chassis (Titanium Edge) */}
                <div
                  className={`p-[3px] rounded-[52px] bg-gradient-to-b ${activeFinish.borderGradient} shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)]`}
                >
                  {/* Phone Inner Bezel */}
                  <div className="bg-black p-[2.5px] rounded-[50px]">
                    
                    {/* Screen Canvas (Super Retina XDR OLED) */}
                    <div
                      className={`relative w-full h-[490px] sm:h-[530px] rounded-[48px] bg-gradient-to-b ${activeFinish.wallpaperGradient} overflow-hidden flex flex-col justify-between p-5 text-white`}
                    >
                      {/* Dynamic Island Status Area */}
                      <div className="flex items-center justify-between text-[11px] font-semibold text-white/90 pt-1 px-2 z-20">
                        <span>9:41</span>
                        
                        {/* Dynamic Island Capsule */}
                        <div className="w-24 h-6 bg-black rounded-full flex items-center justify-between px-2.5 shadow-md border border-white/5 animate-pulse-slow">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          <div className="flex items-center gap-0.5">
                            <div className="w-0.5 h-2 bg-accent rounded-full animate-pulse" />
                            <div className="w-0.5 h-3.5 bg-accent-light rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                            <div className="w-0.5 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                          </div>
                          <div className="w-2.5 h-2.5 rounded-full bg-accent/40 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-white/80">
                          <Wifi className="w-3 h-3" />
                          <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                      </div>

                      {/* Screen Center Wallpaper & Lockscreen Typography */}
                      <div className="text-center space-y-1 my-auto z-10 pt-4">
                        <span className="text-[10px] tracking-widest uppercase font-extrabold text-amber-200/70 block">
                          Titanium Precision
                        </span>
                        <h4 className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-stone-200 to-stone-400 drop-shadow-md">
                          9:41
                        </h4>
                        <p className="text-[11px] font-semibold text-white/70">
                          Tuesday, September 10
                        </p>

                        {/* Interactive Lockscreen Widget: Now Playing */}
                        <div className="mt-8 mx-auto w-11/12 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 text-left flex items-center gap-3 shadow-lg">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent to-pink-500 flex items-center justify-center shadow-md text-white shrink-0">
                            <Apple className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-[9px] uppercase tracking-wider text-accent-light font-bold block">Apple Music</span>
                            <span className="text-xs font-bold text-white truncate block">Spatial Audio • Dolby</span>
                          </div>
                          <div className="flex items-center gap-0.5 pr-1">
                            <div className="w-1 h-3 bg-accent rounded-full animate-bounce" />
                            <div className="w-1 h-5 bg-accent-light rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                            <div className="w-1 h-2.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                          </div>
                        </div>
                      </div>

                      {/* Screen Bottom Controls */}
                      <div className="flex items-center justify-between px-3 pb-2 z-10">
                        <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 text-white/80 hover:scale-110 transition-transform">
                          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                        </div>
                        <div className="w-28 h-1 bg-white/50 rounded-full animate-home-bar" />
                        <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 text-white/80 hover:scale-110 transition-transform">
                          <Camera className="w-4 h-4 text-white" />
                        </div>
                      </div>

                      {/* Specular Front Glass Light Sweep */}
                      <div className="logo-shine-beam" />
                    </div>

                  </div>
                </div>

                {/* Ground Reflection Shadow */}
                <div className="w-4/5 h-4 mx-auto bg-black/40 blur-lg rounded-full -mt-2 pointer-events-none" />
              </div>

              {/* Floating Keynote Feature Badge 1: Titanium */}
              <div className="absolute top-2 -right-2 sm:-right-4 z-20 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border border-gray-200/80 dark:border-slate-700/80 rounded-2xl p-3 shadow-xl flex items-center gap-2.5 animate-float-slow">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-black text-gray-900 dark:text-white block leading-tight">Grade 5 Titanium</span>
                  <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400">Lightest Pro Ever</span>
                </div>
              </div>

              {/* Floating Keynote Feature Badge 2: A18 Pro Chip */}
              <div className="absolute bottom-20 -left-4 sm:-left-8 z-20 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border border-gray-200/80 dark:border-slate-700/80 rounded-2xl p-3 shadow-xl flex items-center gap-2.5 animate-float-reverse">
                <div className="w-8 h-8 rounded-xl bg-accent/10 text-accent dark:text-accent-light flex items-center justify-center shrink-0">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-black text-gray-900 dark:text-white block leading-tight">A18 Pro Silicon</span>
                  <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400">3nm • 6-Core GPU</span>
                </div>
              </div>

              {/* Floating Keynote Feature Badge 3: 48MP Camera */}
              <div className="absolute -bottom-2 right-2 sm:right-6 z-20 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border border-gray-200/80 dark:border-slate-700/80 rounded-2xl p-3 shadow-xl flex items-center gap-2.5 animate-float-delayed">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-black text-gray-900 dark:text-white block leading-tight">48MP Fusion</span>
                  <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400">4K 120fps Dolby</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
