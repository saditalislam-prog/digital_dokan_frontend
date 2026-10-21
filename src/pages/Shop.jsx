import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, X, Search, RotateCcw } from 'lucide-react';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');

  // Fetch categories and brands for filter sidebar
  useEffect(() => {
    API.get('/categories/').then((res) => setCategories(res.data)).catch(console.error);
    API.get('/brands/').then((res) => setBrands(res.data)).catch(console.error);
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
      .then((res) => setProducts(res.data))
      .catch((err) => console.error('Fetch products error:', err))
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
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-3">
                  Categories
                </label>
                <div className="space-y-1.5">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleCategoryChange(c.slug)}
                      className={`w-full text-left text-sm px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-between ${
                        selectedCategory === c.slug
                          ? 'bg-accent text-white font-semibold'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands Filter */}
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-3">
                  Brands
                </label>
                <div className="space-y-1.5">
                  {brands.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => handleBrandChange(b.slug)}
                      className={`w-full text-left text-sm px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-between ${
                        selectedBrand === b.slug
                          ? 'bg-accent text-white font-semibold'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{b.name}</span>
                    </button>
                  ))}
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
              <span className="text-xs font-bold text-gray-700 uppercase block mb-3">Categories</span>
              <div className="space-y-1">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      handleCategoryChange(c.slug);
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg ${
                      selectedCategory === c.slug ? 'bg-accent text-white font-semibold' : 'text-gray-600'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Brands */}
            <div>
              <span className="text-xs font-bold text-gray-700 uppercase block mb-3">Brands</span>
              <div className="space-y-1">
                {brands.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      handleBrandChange(b.slug);
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg ${
                      selectedBrand === b.slug ? 'bg-accent text-white font-semibold' : 'text-gray-600'
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
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

