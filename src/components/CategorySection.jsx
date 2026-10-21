import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    name: 'Smartphones',
    slug: 'smartphones',
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Tablets',
    slug: 'tablets',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Laptops',
    slug: 'laptops',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Smartwatches',
    slug: 'smartwatches',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Gaming',
    slug: 'gaming',
    image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=300&auto=format&fit=crop&q=80',
  },
];

export default function CategorySection() {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-accent text-xs font-bold uppercase tracking-wider block mb-1">
              Shop by Category
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Explore Our Top Categories
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs sm:text-sm font-bold text-accent hover:text-accent-dark flex items-center gap-1 transition-colors"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Cards with Authentic Product Photos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map(({ name, slug, image }) => (
            <Link
              key={slug}
              to={`/category/${slug}`}
              className="group flex flex-col items-center p-4 rounded-2xl bg-[#f8fafc] hover:bg-white border border-gray-100 hover:border-accent/40 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5"
            >
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-white mb-3 p-2.5 flex items-center justify-center border border-gray-100/80 group-hover:border-accent/20 transition-colors">
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300&auto=format&fit=crop&q=80';
                  }}
                />
              </div>
              <span className="text-xs sm:text-sm font-bold text-gray-800 group-hover:text-accent transition-colors text-center">
                {name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
