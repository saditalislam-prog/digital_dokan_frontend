import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import API from '../api/axios';
import { mockBrands } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

const fallbackBrands = mockBrands;

export default function BrandSection({ variant = 'logos' }) {
  const { isDark } = useTheme();
  const [brands, setBrands] = useState(fallbackBrands);

  useEffect(() => {
    API.get('/brands/')
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : (Array.isArray(res.data?.results) ? res.data.results : []);
        if (list.length > 0) {
          setBrands(list);
        }
      })
      .catch((err) => {
        console.warn('Using fallback brands:', err);
      });
  }, []);

  const displayBrands = Array.isArray(brands) && brands.length > 0 ? brands : fallbackBrands;

  const renderBrandLogo = (brand, isCards = false) => {
    const isApple = brand.slug === 'apple' || brand.name?.toLowerCase() === 'apple';
    const isSamsung = brand.slug === 'samsung' || brand.name?.toLowerCase() === 'samsung';
    const isSony = brand.slug === 'sony' || brand.name?.toLowerCase() === 'sony';
    const isAsus = brand.slug === 'asus' || brand.name?.toLowerCase() === 'asus';

    if (isApple) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <img
            src={isDark ? "/brands/apple-white.png" : "/brands/apple.png"}
            alt="Apple"
            className={`object-contain transition-all duration-300 ${
              isCards ? 'max-h-7 max-w-[70px]' : 'max-h-7 max-w-[80px]'
            }`}
          />
        </div>
      );
    }

    if (isSamsung) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <img
            src={isDark ? "/brands/samsung-white.png" : "/brands/samsung.png"}
            alt="Samsung"
            className={`object-contain transition-all duration-300 ${
              isCards ? 'max-h-6 max-w-[90px]' : 'max-h-6 max-w-[100px]'
            }`}
          />
        </div>
      );
    }

    if (isSony) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <img
            src={isDark ? "/brands/sony-white.svg" : "/brands/sony-dark.svg"}
            alt="Sony"
            className={`object-contain transition-all duration-300 ${
              isCards ? 'max-h-5 max-w-[75px]' : 'max-h-5 max-w-[85px]'
            }`}
          />
        </div>
      );
    }

    if (isAsus) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <img
            src={isDark ? "/brands/asus-white.svg" : "/brands/asus-dark.svg"}
            alt="ASUS"
            className={`object-contain transition-all duration-300 ${
              isCards ? 'max-h-5 max-w-[75px]' : 'max-h-5 max-w-[85px]'
            }`}
          />
        </div>
      );
    }

    // Default logo for Google, Xiaomi, OnePlus, etc.
    return (
      <img
        src={brand.logo}
        alt={brand.name}
        className={`object-contain filter grayscale group-hover:grayscale-0 dark:brightness-125 transition-all duration-300 ${
          isCards ? 'max-h-7 max-w-[80px]' : 'max-h-8 max-w-[100px]'
        }`}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'block';
        }}
      />
    );
  };

  if (variant === 'cards') {
    return (
      <section className="py-14 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-accent text-xs font-bold uppercase tracking-wider block mb-1">
                Official Partners
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Authorized Brand Lineup
              </h2>
            </div>
            <Link
              to="/brands"
              className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
            >
              All Brands <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {displayBrands.map((brand) => (
              <Link
                key={brand.id}
                to={`/brand/${brand.slug}`}
                className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center justify-between min-h-[140px]"
              >
                <div className="w-16 h-16 rounded-xl bg-gray-50 flex items-center justify-center p-2 mb-3 group-hover:scale-105 transition-transform">
                  {renderBrandLogo(brand, true)}
                  <span className="hidden text-xs font-bold text-gray-700">{brand.name}</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm group-hover:text-accent transition-colors">
                    {brand.name}
                  </h4>
                  <span className="text-[11px] text-gray-400 font-medium">Explore Devices →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Default minimalist bar variant
  return (
    <section className="py-10 bg-surface border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Trusted by the world's leading tech innovators
          </span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 items-center justify-items-center">
          {displayBrands.map((brand) => (
            <Link
              key={brand.id}
              to={`/brand/${brand.slug}`}
              className="group flex items-center justify-center h-12 w-28 opacity-70 hover:opacity-100 transition-opacity"
              title={brand.name}
            >
              {renderBrandLogo(brand, false)}
              <span className="hidden text-sm font-bold text-gray-700">{brand.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
