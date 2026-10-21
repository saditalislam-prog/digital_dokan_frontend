import { useState, useEffect } from 'react';

export default function SplashPreloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Prevent scrolling while preloader is active
    document.body.style.overflow = 'hidden';

    // Start exit transition after 1.4s
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 1400);

    // Completely remove preloader after exit fade transition (0.5s)
    const finishTimer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = '';
    }, 1900);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
      document.body.style.overflow = '';
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-splash-grid transition-all duration-500 ease-out ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Center Branding Showcase */}
      <div className="flex flex-col items-center justify-center px-4 -mt-10">
        {/* Glow ambient background aura */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-40 h-40 rounded-full bg-accent/25 blur-3xl pointer-events-none animate-pulse-slow" />

          {/* Squircle Icon Card */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white border border-gray-100 shadow-[0_12px_40px_-5px_rgba(37,99,235,0.22)] flex items-center justify-center p-5 overflow-hidden animate-splash-card">
            <img
              src="/logo-icon.png"
              alt="Digital Dokan Icon"
              className="w-full h-full object-contain select-none"
              onError={(e) => {
                e.target.src = '/logo-transparent.png';
              }}
            />
            {/* Shimmer light sweep */}
            <div className="logo-shine-beam" />
          </div>
        </div>

        {/* Brand Name Typography */}
        <div className="mt-6 text-center animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900">
            Digital<span className="text-accent">Dokan</span>
          </h1>
          <p className="text-[10px] sm:text-xs font-extrabold tracking-[0.3em] text-gray-400 uppercase mt-2">
            Gadgets For A Smarter You
          </p>
        </div>
      </div>

      {/* Bottom Loading Progress Bar */}
      <div className="absolute bottom-12 sm:bottom-16 flex flex-col items-center gap-3">
        <div className="w-36 sm:w-44 h-1 bg-gray-100 rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-gradient-to-r from-accent via-blue-500 to-sky-400 rounded-full animate-splash-progress" />
        </div>
      </div>
    </div>
  );
}

