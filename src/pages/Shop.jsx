import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Filter, 
  SlidersHorizontal, 
  X, 
  Search, 
  RotateCcw,
  Smartphone,
  Tablet,
  Laptop,
  Watch,
  Headphones,
  Gamepad2,
  Layers,
  LayoutGrid,
  Sparkles
} from 'lucide-react';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import { mockProducts, mockCategories, mockBrands } from '../data/mockData';

const BRAND_LOGOS = {
  apple: '/brands/apple.svg',
  samsung: '/brands/samsung.svg',
  google: '/brands/google.svg',
  sony: '/brands/sony-dark.svg',
  asus: '/brands/asus-dark.svg',
  oneplus: '/brands/oneplus.png',
  xiaomi: '/brands/xiaomi.svg',
  oppo: '/brands/oppo.svg',
  microsoft: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
  dell: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg',
  lenovo: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Lenovo_logo_2015.svg',
  hp: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg',
  razer: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/40/Razer_snake_logo.svg/330px-Razer_snake_logo.svg.png'
};

const getCategoryIcon = (slug) => {
  const s = slug?.toLowerCase() || '';
  if (s.includes('phone') || s.includes('mobile')) return <Smartphone className="w-3.5 h-3.5" />;
  if (s.includes('tablet') || s.includes('ipad')) return <Tablet className="w-3.5 h-3.5" />;
  if (s.includes('laptop') || s.includes('computer') || s.includes('macbook')) return <Laptop className="w-3.5 h-3.5" />;
  if (s.includes('watch') || s.includes('wearable')) return <Watch className="w-3.5 h-3.5" />;
  if (s.includes('accessori') || s.includes('headphone') || s.includes('audio')) return <Headphones className="w-3.5 h-3.5" />;
  if (s.includes('game') || s.includes('gaming')) return <Gamepad2 className="w-3.5 h-3.5" />;
  return <Layers className="w-3.5 h-3.5" />;
};

const getBrandIcon = (brand) => {
  const slug = (brand?.slug || brand?.name || '').toLowerCase();
  const logoUrl = BRAND_LOGOS[slug] || brand?.logo;

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={brand?.name || 'Brand'}
        className="w-4 h-4 object-contain"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    );
  }

  return (
    <span className="text-[10px] font-black uppercase text-accent">
      {brand?.name?.charAt(0) || 'B'}
    </span>
  );
};

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState(mockProducts);
  const [categories, setCategories] = useState(mockCategories);
  const [brands, setBrands] = useState(mockBrands);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');

  // Helper to filter mock products when API is unreachable
  const filterMockProducts = () => {
    let list = [...mockProducts];
    if (selectedCategory) {
      list = list.filter((p) => p.category?.slug === selectedCategory);
    }
    if (selectedBrand) {
      list = list.filter((p) => p.brand?.slug === selectedBrand);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }
    if (minPrice) {
      list = list.filter((p) => Number(p.price) >= Number(minPrice));
    }
    if (maxPrice) {
      list = list.filter((p) => Number(p.price) <= Number(maxPrice));
    }

    if (sortBy === 'price_low') {
      list.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'price_high') {
      list.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === 'rating') {
      list.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    } else if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }
    return list;
  };

  // Fetch categories and brands for filter sidebar
  useEffect(() => {
    API.get('/categories/')
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : (res.data?.results || []);
        if (list.length > 0) setCategories(list);
      })
      .catch((err) => {
        console.warn('Backend categories unreachable, using fallback:', err);
      });

    API.get('/brands/')
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : (res.data?.results || []);
        if (list.length > 0) setBrands(list);
      })
      .catch((err) => {
        console.warn('Backend brands unreachable, using fallback:', err);
      });
  }, []);

  // Sync state when URL params change
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '');
    setSelectedBrand(searchParams.get('brand') || '');
    setSearchQuery(searchParams.get('search') || '');
    setSortBy(searchParams.get('sort') || '');
    setMinPrice(searchParams.get('min_price') || '');
    setMaxPrice(searchParams.get('max_price') || '');
  }, [searchParams]);

  // Fetch products according to active filters
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory) params.append('category', selectedCategory);
    if (selectedBrand) params.append('brand', selectedBrand);
    if (searchQuery) params.append('search', searchQuery);
    if (sortBy) params.append('sort', sortBy);
    if (minPrice) params.append('min_price', minPrice);
    if (maxPrice) params.append('max_price', maxPrice);

    API.get(`/products/?${params.toString()}`)
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : (res.data?.results || []);
        const hasFilters = selectedCategory || selectedBrand || searchQuery || minPrice || maxPrice;
        if (list.length > 0 || hasFilters) {
          setProducts(list);
        } else {
          setProducts(mockProducts);
        }
      })
      .catch((err) => {
        console.warn('Backend products unreachable, using filtered mock data:', err);
        setProducts(filterMockProducts());
      })
      .finally(() => setLoading(false));
  }, [selectedCategory, selectedBrand, searchQuery, sortBy, minPrice, maxPrice]);

  const handleCategoryChange = (slug) => {
    const next = selectedCategory === slug ? '' : slug;
    setSelectedCategory(next);
    updateParam('category', next);
  };

  const handleBrandChange = (slug) => {
    const next = selectedBrand === slug ? '' : slug;
    setSelectedBrand(next);
    updateParam('brand', next);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    updateParam('sort', value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', searchQuery);
  };

  const updateParam = (key, val) => {
    const newParams = new URLSearchParams(searchParams);
    if (val) {
      newParams.set(key, val);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setSearchQuery('');
    setSortBy('');
    setMinPrice('');
    setMaxPrice('');
    setSearchParams({});
  };

  return (
    <div className="bg-surface min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              All Products
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Explore our wide selection of tech gadgets & devices
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 shadow-sm"
            >
              <Filter className="w-4 h-4 text-accent" />
              Filters
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl px-4 py-2.5 outline-none focus:border-accent shadow-sm cursor-pointer"
              >
                <option value="">Featured / Default</option>
                <option value="newest">Newest First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <span className="font-bold text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-accent" />
                  Filter Options
                </span>
                {(selectedCategory || selectedBrand || searchQuery || minPrice || maxPrice) && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                )}
              </div>

              {/* Search Inside Shop */}
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-2">
                  Search Catalog
                </label>
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Keywords..."
                    className="w-full bg-surface text-sm border border-gray-200 rounded-xl pl-3 pr-9 py-2 outline-none focus:border-accent"
                  />
                  <button type="submit" className="absolute right-2.5 top-2.5 text-gray-400 hover:text-accent">
                    <Search className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Categories Filter */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                    Categories
                  </label>
                  {selectedCategory && (
                    <button
                      onClick={() => handleCategoryChange('')}
                      className="text-[11px] text-accent hover:underline font-semibold cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="space-y-1.5">
                  <button
                    onClick={() => handleCategoryChange('')}
                    className={`w-full text-left text-sm px-3 py-2 rounded-xl font-medium transition-all flex items-center justify-between group cursor-pointer ${
                      !selectedCategory
                        ? 'bg-accent text-white font-semibold shadow-xs'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                        !selectedCategory ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-accent/10 group-hover:text-accent'
                      }`}>
                        <LayoutGrid className="w-3.5 h-3.5" />
                      </span>
                      <span className="truncate">All Categories</span>
                    </div>
                    {!selectedCategory && <span className="w-1.5 h-1.5 rounded-full bg-white ml-2 shrink-0" />}
                  </button>
                  {categories.map((c) => {
                    const isSelected = selectedCategory === c.slug;
                    return (
                      <button
                        key={c.id}
                        onClick={() => handleCategoryChange(c.slug)}
                        className={`w-full text-left text-sm px-3 py-2 rounded-xl font-medium transition-all flex items-center justify-between group cursor-pointer ${
                          isSelected
                            ? 'bg-accent text-white font-semibold shadow-xs'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-accent/10 group-hover:text-accent'
                          }`}>
                            {getCategoryIcon(c.slug)}
                          </span>
                          <span className="truncate">{c.name}</span>
                        </div>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white ml-2 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Brands Filter */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                    Brands
                  </label>
                  {selectedBrand && (
                    <button
                      onClick={() => handleBrandChange('')}
                      className="text-[11px] text-accent hover:underline font-semibold cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
                  <button
                    onClick={() => handleBrandChange('')}
                    className={`w-full text-left text-sm px-3 py-2 rounded-xl font-medium transition-all flex items-center justify-between group cursor-pointer ${
                      !selectedBrand
                        ? 'bg-accent text-white font-semibold shadow-xs'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                        !selectedBrand ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-accent/10 group-hover:text-accent'
                      }`}>
                        <Sparkles className="w-3.5 h-3.5" />
                      </span>
                      <span className="truncate">All Brands</span>
                    </div>
                    {!selectedBrand && <span className="w-1.5 h-1.5 rounded-full bg-white ml-2 shrink-0" />}
                  </button>
                  {brands.map((b) => {
                    const isSelected = selectedBrand === b.slug;
                    return (
                      <button
                        key={b.id}
                        onClick={() => handleBrandChange(b.slug)}
                        className={`w-full text-left text-sm px-3 py-2 rounded-xl font-medium transition-all flex items-center justify-between group cursor-pointer ${
                          isSelected
                            ? 'bg-accent text-white font-semibold shadow-xs'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={`w-7 h-7 rounded-lg p-1 flex items-center justify-center transition-colors shrink-0 ${
                            isSelected ? 'bg-white shadow-xs' : 'bg-gray-100 group-hover:bg-gray-200'
                          }`}>
                            {getBrandIcon(b)}
                          </span>
                          <span className="truncate">{b.name}</span>
                        </div>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white ml-2 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-3">
                  Price Range ($)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => {
                      setMinPrice(e.target.value);
                      updateParam('min_price', e.target.value);
                    }}
                    className="w-1/2 bg-surface text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-accent"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(e.target.value);
                      updateParam('max_price', e.target.value);
                    }}
                    className="w-1/2 bg-surface text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 shadow-sm animate-pulse space-y-4">
                    <div className="bg-gray-100 aspect-square rounded-xl" />
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                    <div className="h-9 bg-gray-100 rounded-lg" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="mb-4 text-xs font-semibold text-gray-500">
                  Showing {products.length} products
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                <p className="text-lg font-bold text-gray-800">No products found</p>
                <p className="text-sm text-gray-500 mt-1 mb-6">
                  Try adjusting your filters or search keywords.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 bg-accent hover:bg-accent-dark text-white rounded-xl font-semibold text-sm transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <span className="font-bold text-gray-900">Filters</span>
              <button onClick={() => setMobileFilterOpen(false)} className="text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Categories</span>
                {selectedCategory && (
                  <button
                    onClick={() => {
                      handleCategoryChange('');
                      setMobileFilterOpen(false);
                    }}
                    className="text-[11px] text-accent hover:underline font-semibold"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                <button
                  onClick={() => {
                    handleCategoryChange('');
                    setMobileFilterOpen(false);
                  }}
                  className={`w-full text-left text-sm px-3 py-2 rounded-xl flex items-center justify-between ${
                    !selectedCategory ? 'bg-accent text-white font-semibold' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      !selectedCategory ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <LayoutGrid className="w-3.5 h-3.5" />
                    </span>
                    <span className="truncate">All Categories</span>
                  </div>
                  {!selectedCategory && <span className="w-1.5 h-1.5 rounded-full bg-white ml-2 shrink-0" />}
                </button>
                {categories.map((c) => {
                  const isSelected = selectedCategory === c.slug;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        handleCategoryChange(c.slug);
                        setMobileFilterOpen(false);
                      }}
                      className={`w-full text-left text-sm px-3 py-2 rounded-xl flex items-center justify-between ${
                        isSelected ? 'bg-accent text-white font-semibold' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {getCategoryIcon(c.slug)}
                        </span>
                        <span className="truncate">{c.name}</span>
                      </div>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white ml-2 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Brands */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Brands</span>
                {selectedBrand && (
                  <button
                    onClick={() => {
                      handleBrandChange('');
                      setMobileFilterOpen(false);
                    }}
                    className="text-[11px] text-accent hover:underline font-semibold"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                <button
                  onClick={() => {
                    handleBrandChange('');
                    setMobileFilterOpen(false);
                  }}
                  className={`w-full text-left text-sm px-3 py-2 rounded-xl flex items-center justify-between ${
                    !selectedBrand ? 'bg-accent text-white font-semibold' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      !selectedBrand ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Sparkles className="w-3.5 h-3.5" />
                    </span>
                    <span className="truncate">All Brands</span>
                  </div>
                  {!selectedBrand && <span className="w-1.5 h-1.5 rounded-full bg-white ml-2 shrink-0" />}
                </button>
                {brands.map((b) => {
                  const isSelected = selectedBrand === b.slug;
                  return (
                    <button
                      key={b.id}
                      onClick={() => {
                        handleBrandChange(b.slug);
                        setMobileFilterOpen(false);
                      }}
                      className={`w-full text-left text-sm px-3 py-2 rounded-xl flex items-center justify-between ${
                        isSelected ? 'bg-accent text-white font-semibold' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-7 h-7 rounded-lg p-1 flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-white shadow-xs' : 'bg-gray-100'
                        }`}>
                          {getBrandIcon(b)}
                        </span>
                        <span className="truncate">{b.name}</span>
                      </div>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white ml-2 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => {
                clearAllFilters();
                setMobileFilterOpen(false);
              }}
              className="w-full py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl text-sm"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

