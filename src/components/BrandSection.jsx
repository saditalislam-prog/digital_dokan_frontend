import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import API from '../api/axios';

const fallbackBrands = [
  { id: 1, name: 'Apple', slug: 'apple', logo: '/brands/apple.png' },
  { id: 2, name: 'Samsung', slug: 'samsung', logo: '/brands/samsung.png' },
  { id: 3, name: 'Google', slug: 'google', logo: '/brands/google.png' },
  { id: 4, name: 'OnePlus', slug: 'oneplus', logo: '/brands/oneplus.png' },
  { id: 5, name: 'Xiaomi', slug: 'xiaomi', logo: '/brands/xiaomi.png' },
  { id: 6, name: 'Oppo', slug: 'oppo', logo: '/brands/oppo.png' },
];

export default function BrandSection({ variant = 'logos' }) {
  const [brands, setBrands] = useState(fallbackBrands);

  useEffect(() => {
    API.get('/brands/')
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setBrands(res.data);
        }
      })
      .catch((err) => {
        console.warn('Using fallback brands:', err);
      });
  }, []);

  if (variant === 'cards') {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Shop by Brand</h2>
              <p className="text-sm text-gray-500 mt-1">Choose from the top brands you love</p>
            </div>
            <Link to="/brand/all" className="text-xs sm:text-sm font-bold text-accent hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {brands.slice(0, 6).map((brand) => (
              <Link
                key={brand.id}
                to={`/brand/${brand.slug}`}
                className="flex flex-col items-center justify-center p-6 bg-surface rounded-2xl border border-gray-100 hover:border-accent/40 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="w-full h-14 flex items-center justify-center mb-2 px-2">
                  {brand.logo ? (
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="max-h-11 max-w-[125px] w-auto object-contain opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                    />
                  ) : (
                    <span className="font-bold text-base text-gray-700 group-hover:text-accent">
                      {brand.name}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500 font-bold group-hover:text-accent transition-colors">{brand.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 border-t border-b border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="shrink-0">
            <h3 className="text-lg font-extrabold text-gray-900">Top Brands</h3>
            <p className="text-xs text-gray-500">Shop from the world's most trusted brands</p>
          </div>
          <div className="flex flex-wrap items-center gap-8 lg:gap-12 justify-around md:justify-end flex-1">
            {brands.slice(0, 6).map((brand) => (
              <Link
                key={brand.id}
                to={`/brand/${brand.slug}`}
                className="opacity-75 hover:opacity-100 hover:scale-110 transition-all duration-200 flex items-center justify-center py-2"
              >
                {brand.logo ? (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-h-9 sm:max-h-10 max-w-[130px] w-auto object-contain"
                  />
                ) : (
                  <span className="text-gray-500 font-bold text-base hover:text-black">
                    {brand.name}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
