import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import { ChevronRight, ShieldCheck, Sparkles, Award, ArrowRight, Layers, CheckCircle2 } from 'lucide-react';
import { mockProducts, mockBrands } from '../data/mockData';

const brandMeta = {
  apple: {
    tagline: 'Think Different • Innovation & Premium Craft',
    description: 'Pioneering smartphones, M-series Silicon, and seamlessly connected Apple ecosystem.',
    warranty: '1 Year Official International Warranty',
    gradient: 'from-gray-900 via-slate-800 to-gray-900',
  },
  samsung: {
    tagline: 'Do What You Can’t • Galaxy AI Flagships',
    description: 'Groundbreaking foldables, pro-grade nightography camera systems, and Galaxy ecosystem.',
    warranty: '1 Year Official Samsung Warranty',
    gradient: 'from-blue-900 via-indigo-900 to-slate-900',
  },
  google: {
    tagline: 'Help by Google • Pure Android & AI Power',
    description: 'Industry-leading computational photography, Gemini AI integration, and 7 years of updates.',
    warranty: '1 Year Official Google Warranty',
    gradient: 'from-slate-900 via-emerald-950 to-slate-900',
  },
  oneplus: {
    tagline: 'Never Settle • Fast & Ultra-Smooth Performance',
    description: 'Flagship power, legendary Hasselblad camera color science, and blazing fast SuperVOOC charging.',
    warranty: '1 Year Official OnePlus Warranty',
    gradient: 'from-red-950 via-slate-900 to-red-950',
  },
  xiaomi: {
    tagline: 'Innovation for Everyone • Flagship Power',
    description: 'High-spec hardware, Leica co-engineered mobile cameras, and exceptional performance value.',
    warranty: '1 Year Official Brand Warranty',
    gradient: 'from-amber-950 via-orange-950 to-slate-900',
  },
  oppo: {
    tagline: 'Inspiration Ahead • Pro Portrait Photography',
    description: 'Ultra-slim aesthetics, studio-grade portrait telephoto systems, and rapid flash charging.',
    warranty: '1 Year Official Brand Warranty',
    gradient: 'from-teal-950 via-slate-900 to-slate-950',
  },
  sony: {
    tagline: 'Be Moved • World-Class Audio & PlayStation Gaming',
    description: 'Industry-standard studio acoustic engineering, precision imaging sensors, and next-gen gaming.',
    warranty: '1 Year Official Sony Warranty',
    gradient: 'from-slate-950 via-purple-950 to-slate-900',
  },
  microsoft: {
    tagline: 'Empowering Productivity • Surface Hardware',
    description: 'Versatile computing hardware, pixel-perfect displays, and pro productivity engineering.',
    warranty: '1 Year Official Microsoft Warranty',
    gradient: 'from-sky-950 via-slate-900 to-blue-950',
  },
};

export default function BrandPage() {
  const { slug } = useParams();
  const currentSlug = slug || 'all';
  const isDirectoryView = currentSlug === 'all';

  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState(mockProducts);
  const [brands, setBrands] = useState(mockBrands);
  const [brandName, setBrandName] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch brands
  useEffect(() => {
    API.get('/brands/')
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : (res.data?.results || []);
        if (list.length > 0) setBrands(list);
      })
      .catch(() => setBrands(mockBrands));
  }, []);

  // Fetch all products for directory counting & showcase
  useEffect(() => {
    API.get('/products/')
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : (res.data?.results || []);
        if (list.length > 0) setAllProducts(list);
      })
      .catch(() => setAllProducts(mockProducts));
  }, []);

  // Fetch products for current view
  useEffect(() => {
    setLoading(true);
    if (isDirectoryView) {
      setBrandName('All Official Brands');
      setProducts(allProducts);
      setLoading(false);
    } else {
      API.get(`/products/?brand=${currentSlug}`)
        .then((res) => {
          const list = Array.isArray(res.data) ? res.data : (res.data?.results || []);
          if (list.length > 0) {
            setProducts(list);
            setBrandName(list[0].brand?.name || currentSlug.charAt(0).toUpperCase() + currentSlug.slice(1));
          } else {
            const fallback = mockProducts.filter((p) => p.brand?.slug === currentSlug);
            setProducts(fallback);
            const foundBrand = mockBrands.find((b) => b.slug === currentSlug);
            setBrandName(foundBrand ? foundBrand.name : currentSlug.charAt(0).toUpperCase() + currentSlug.slice(1));
          }
        })
        .catch((err) => {
          console.warn('Brand products fetch error, using fallback:', err);
          const fallback = mockProducts.filter((p) => p.brand?.slug === currentSlug);
          setProducts(fallback);
          const foundBrand = mockBrands.find((b) => b.slug === currentSlug);
          setBrandName(foundBrand ? foundBrand.name : currentSlug.charAt(0).toUpperCase() + currentSlug.slice(1));
        })
        .finally(() => setLoading(false));
    }
  }, [currentSlug, isDirectoryView, allProducts]);

  const activeMeta = brandMeta[currentSlug] || {
    tagline: 'Official Brand Partner • 100% Genuine Devices',
    description: `Browse authentic devices and accessories from ${brandName} with verified official warranty.`,
    warranty: '1 Year Manufacturer Warranty',
    gradient: 'from-primary-dark via-primary to-accent',
  };

  const getBrandProducts = (brandSlug) => {
    return (allProducts.length > 0 ? allProducts : mockProducts).filter(
      (p) => p.brand?.slug === brandSlug
    );
  };

  return (
    <div className="bg-surface min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-400">
          <Link to="/" className="hover:text-gray-700">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/brands" className="hover:text-gray-700">Brands</Link>
          {!isDirectoryView && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-gray-800 font-semibold capitalize">{brandName}</span>
            </>
          )}
        </nav>

        {/* ─── DIRECTORY VIEW: BRAND SHOWCASE HUB ─── */}
        {isDirectoryView ? (
          <div className="space-y-10">
            {/* Hero Directory Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-primary-dark to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
              <div className="relative z-10 max-w-2xl space-y-3">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent text-xs font-bold uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5" /> Official Authorized Brand Hub
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                  World-Class Brands, <span className="text-accent">100% Genuine.</span>
                </h1>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  Discover certified flagship smartphones, tablets, wearables, and computing devices directly from the world's leading technology manufacturers.
                </p>

                {/* Trust Badges */}
                <div className="pt-4 flex flex-wrap gap-4 text-xs font-semibold text-gray-300">
                  <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Official Warranty
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                    <CheckCircle2 className="w-4 h-4 text-accent" /> 100% Authentic Guarantee
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                    <Layers className="w-4 h-4 text-amber-400" /> Direct Brand Sourcing
                  </span>
                </div>
              </div>

              {/* Decorative Background Elements */}
              <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
              <div className="absolute right-12 bottom-6 opacity-10 hidden md:block">
                <Award className="w-64 h-64 text-white" />
              </div>
            </div>

            {/* Quick Brand Switcher Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide shrink-0 mr-2">
                Quick Jump:
              </span>
              {brands.map((b) => (
                <Link
                  key={b.id}
                  to={`/brand/${b.slug}`}
                  className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl shrink-0 transition-all hover:border-accent hover:text-accent shadow-sm"
                >
                  {b.name}
                </Link>
              ))}
            </div>

            {/* Brand Directory Grid */}
            <div>
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                    Explore Brand Stores
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Select your favorite brand to view their exclusive product lineup
                  </p>
                </div>
                <span className="text-xs font-bold text-gray-400">
                  {brands.length} Official Brands
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {brands.map((brand) => {
                  const bProducts = getBrandProducts(brand.slug);
                  const meta = brandMeta[brand.slug] || {
                    tagline: 'Official Tech Partner',
                    description: 'Explore authentic devices with guaranteed quality.',
                  };

                  return (
                    <div
                      key={brand.id}
                      className="group bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
                    >
                      <div>
                        {/* Top Brand Emblem & Count */}
                        <div className="flex items-start justify-between mb-5">
                          <div className="w-16 h-16 bg-surface rounded-2xl p-2.5 flex items-center justify-center border border-gray-100 shadow-inner group-hover:scale-105 transition-transform">
                            {brand.logo ? (
                              <img
                                src={brand.logo}
                                alt={brand.name}
                                className="max-h-10 max-w-full object-contain"
                              />
                            ) : (
                              <span className="text-lg font-black text-gray-800">{brand.name[0]}</span>
                            )}
                          </div>
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-accent/10 text-accent">
                            {bProducts.length} Devices
                          </span>
                        </div>

                        {/* Brand Title & Tagline */}
                        <h3 className="text-xl font-extrabold text-gray-900 group-hover:text-accent transition-colors">
                          {brand.name}
                        </h3>
                        <p className="text-xs font-semibold text-accent mt-0.5 mb-2">
                          {meta.tagline}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                          {meta.description}
                        </p>

                        {/* Device Thumbnail Previews */}
                        {bProducts.length > 0 && (
                          <div className="mt-5 pt-4 border-t border-gray-100">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                              Popular Devices:
                            </span>
                            <div className="flex gap-2">
                              {bProducts.slice(0, 3).map((item) => (
                                <Link
                                  key={item.id}
                                  to={`/product/${item.slug}`}
                                  className="w-12 h-12 bg-surface rounded-xl p-1 border border-gray-100 overflow-hidden hover:border-accent transition-colors shrink-0 flex items-center justify-center"
                                  title={item.name}
                                >
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <Link
                        to={`/brand/${brand.slug}`}
                        className="mt-6 w-full py-2.5 px-4 bg-surface hover:bg-accent text-gray-700 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 group-hover:bg-accent group-hover:text-white"
                      >
                        Visit {brand.name} Store
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Featured Brand Spotlight */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-accent text-xs font-bold uppercase tracking-wider block mb-1">
                    Spotlight Picks
                  </span>
                  <h3 className="text-2xl font-extrabold text-gray-900">
                    Flagship Devices Across Brands
                  </h3>
                </div>
                <Link
                  to="/shop"
                  className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
                >
                  View Full Catalog <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {(allProducts.length > 0 ? allProducts : mockProducts).slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ─── SPECIFIC BRAND STOREFRONT VIEW ─── */
          <div className="space-y-8">
            {/* Brand Storefront Banner */}
            <div className={`relative overflow-hidden bg-gradient-to-r ${activeMeta.gradient} rounded-3xl p-8 sm:p-12 text-white shadow-xl`}>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 border border-white/10 text-xs font-bold uppercase tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Authorized Flagship Store
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-gray-200">
                      {products.length} Products
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white capitalize">
                    {brandName}
                  </h1>
                  <p className="text-accent font-semibold text-sm sm:text-base">
                    {activeMeta.tagline}
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed max-w-xl">
                    {activeMeta.description}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-gray-300 font-medium">
                    <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-lg border border-white/5">
                      <Award className="w-4 h-4 text-amber-400" /> {activeMeta.warranty}
                    </span>
                    <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-lg border border-white/5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Original Sealed Box
                    </span>
                  </div>
                </div>

                {/* Brand Logo in Banner */}
                {brands.find((b) => b.slug === currentSlug)?.logo && (
                  <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl shadow-xl shrink-0 self-start md:self-center flex items-center justify-center border border-white/20">
                    <img
                      src={brands.find((b) => b.slug === currentSlug)?.logo}
                      alt={brandName}
                      className="max-h-16 max-w-[180px] w-auto object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Decorative Glow */}
              <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* Brand Switcher Bar */}
            <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm flex items-center gap-2 overflow-x-auto scrollbar-none">
              <Link
                to="/brands"
                className="px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors bg-surface hover:bg-gray-100 text-gray-700 flex items-center gap-1.5"
              >
                <ArrowRight className="w-3.5 h-3.5 rotate-180" /> All Brands
              </Link>
              <div className="h-5 w-px bg-gray-200 shrink-0 mx-1" />
              {brands.map((b) => (
                <Link
                  key={b.id}
                  to={`/brand/${b.slug}`}
                  className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                    currentSlug === b.slug
                      ? 'bg-accent text-white shadow-sm'
                      : 'bg-surface hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {b.name}
                </Link>
              ))}
            </div>

            {/* Products Grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                    {brandName} Devices & Accessories
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Showing official stock available for immediate purchase
                  </p>
                </div>
                <span className="text-xs font-bold text-gray-400">
                  {products.length} Items Found
                </span>
              </div>

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
              ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                  <p className="text-lg font-bold text-gray-800">
                    No products currently in stock for {brandName}
                  </p>
                  <p className="text-sm text-gray-500 mt-1 mb-6">
                    Our team is adding new flagship models weekly.
                  </p>
                  <Link
                    to="/brands"
                    className="px-6 py-2.5 bg-accent hover:bg-accent-dark text-white rounded-xl font-semibold text-sm transition-colors inline-flex items-center gap-1.5"
                  >
                    Explore Other Brands
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
