import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import { ChevronRight } from 'lucide-react';

export default function BrandPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [brandName, setBrandName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/brands/').then((res) => setBrands(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    if (slug === 'all') {
      API.get('/products/')
        .then((res) => {
          setProducts(res.data);
          setBrandName('All Brands');
        })
        .finally(() => setLoading(false));
    } else {
      API.get(`/products/?brand=${slug}`)
        .then((res) => {
          setProducts(res.data);
          if (res.data.length > 0 && res.data[0].brand) {
            setBrandName(res.data[0].brand.name);
          } else {
            setBrandName(slug.charAt(0).toUpperCase() + slug.slice(1));
          }
        })
        .finally(() => setLoading(false));
    }
  }, [slug]);

  return (
    <div className="bg-surface min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <Link to="/" className="hover:text-gray-700">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/brand/all" className="hover:text-gray-700">Brands</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-700 font-medium capitalize">{brandName}</span>
        </nav>

        {/* Brand Selector Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          <Link
            to="/brand/all"
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors ${
              slug === 'all' ? 'bg-accent text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Brands
          </Link>
          {brands.map((b) => (
            <Link
              key={b.id}
              to={`/brand/${b.slug}`}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                slug === b.slug ? 'bg-accent text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {b.name}
            </Link>
          ))}
        </div>

        <div className="pb-6 border-b border-gray-200 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight capitalize">
              {brandName}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Genuine guaranteed products from {brandName}
            </p>
          </div>
          {brands.find(b => b.slug === slug)?.logo && (
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm shrink-0 self-start sm:self-auto flex items-center justify-center">
              <img
                src={brands.find(b => b.slug === slug)?.logo}
                alt={brandName}
                className="max-h-12 max-w-[150px] w-auto object-contain"
              />
            </div>
          )}
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
            <p className="text-lg font-bold text-gray-800">No products found for {brandName}</p>
            <p className="text-sm text-gray-500 mt-1 mb-6">
              Check back soon as we add new stock daily.
            </p>
            <Link
              to="/shop"
              className="px-6 py-2.5 bg-accent hover:bg-accent-dark text-white rounded-xl font-semibold text-sm transition-colors"
            >
              Back to Catalog
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

