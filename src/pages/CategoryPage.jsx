import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import { ChevronRight } from 'lucide-react';

export default function CategoryPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    API.get(`/products/?category=${slug}`)
      .then((res) => {
        setProducts(res.data);
        if (res.data.length > 0 && res.data[0].category) {
          setCategoryName(res.data[0].category.name);
        } else {
          // Format slug as fallback
          setCategoryName(slug.charAt(0).toUpperCase() + slug.slice(1));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="bg-surface min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <Link to="/" className="hover:text-gray-700">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/shop" className="hover:text-gray-700">Categories</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-700 font-medium capitalize">{categoryName}</span>
        </nav>

        <div className="pb-6 border-b border-gray-200 mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight capitalize">
            {categoryName}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse our top rated collection of {categoryName.toLowerCase()}
          </p>
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
            <p className="text-lg font-bold text-gray-800">No products found</p>
            <p className="text-sm text-gray-500 mt-1 mb-6">
              There are currently no items listed under this category.
            </p>
            <Link
              to="/shop"
              className="px-6 py-2.5 bg-accent hover:bg-accent-dark text-white rounded-xl font-semibold text-sm transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

