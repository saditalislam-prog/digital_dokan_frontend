import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const badgeColors = {
  'New': 'bg-blue-500',
  'Hot': 'bg-red-500',
  'Best Seller': 'bg-green-500',
  'Sale': 'bg-orange-500',
};

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const {
    id,
    name = 'Product Name',
    slug = '',
    image = 'https://via.placeholder.com/300x300/f3f4f6/94a3b8?text=Product',
    price = 0,
    original_price,
    sale_price,
    old_price,
    rating = 0,
    review_count = 0,
    badge = null,
    is_new,
    is_bestseller,
    is_deal,
    category,
    category_name = category?.name || '',
  } = product || {};

  const effectiveBadge = badge || (is_bestseller ? 'Best Seller' : is_new ? 'New' : is_deal ? 'Hot' : null);
  const displayPrice = sale_price || price;
  const oldPrice = old_price || original_price || (sale_price ? price : null);
  const discount = oldPrice && Number(oldPrice) > Number(displayPrice)
    ? Math.round((1 - Number(displayPrice) / Number(oldPrice)) * 100)
    : 0;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.5;
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars && hasHalf) {
        stars.push(<Star key={i} className="w-3.5 h-3.5 fill-yellow-400/50 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="w-3.5 h-3.5 text-gray-200" />);
      }
    }
    return stars;
  };

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1.5 border border-transparent hover:border-accent/20 transition-all duration-300 flex flex-col">
      {/* Image Area */}
      <div className="relative overflow-hidden bg-gray-50">
        <Link to={`/product/${slug || id}`}>
          {!imageLoaded && (
            <div className="w-full aspect-square bg-gray-100 animate-pulse" />
          )}
          <img
            src={image}
            alt={name}
            className={`w-full aspect-square object-cover group-hover:scale-108 transition-transform duration-500 ${
              imageLoaded ? '' : 'absolute opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300&auto=format&fit=crop&q=80';
              setImageLoaded(true);
            }}
          />
        </Link>

        {/* Badge */}
        {effectiveBadge && (
          <span className={`absolute top-3 left-3 ${badgeColors[effectiveBadge] || 'bg-blue-500'} text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm`}>
            {effectiveBadge}
          </span>
        )}

        {/* Discount Badge */}
        {!effectiveBadge && discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm animate-pulse-slow">
            -{discount}%
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={() => setWishlisted(!wishlisted)}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 active:scale-125 ${
            wishlisted
              ? 'bg-red-50 text-red-500 shadow-sm'
              : 'bg-white/80 text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 shadow-sm'
          }`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 transition-transform duration-200 ${wishlisted ? 'fill-current scale-110' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {category_name && (
          <span className="text-xs text-gray-400 uppercase tracking-wide mb-1">{category_name}</span>
        )}
        <Link to={`/product/${slug || id}`}>
          <h3 className="font-medium text-gray-900 text-sm line-clamp-2 hover:text-accent transition-colors mb-2">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center gap-0.5">
            {renderStars(rating)}
          </div>
          <span className="text-xs text-gray-400">({review_count})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto mb-3">
          <span className="text-lg font-bold text-gray-900">${parseFloat(displayPrice).toFixed(2)}</span>
          {oldPrice && parseFloat(oldPrice) > parseFloat(displayPrice) && (
            <span className="text-sm text-gray-400 line-through">${parseFloat(oldPrice).toFixed(2)}</span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={() => addToCart(product)}
          className="group/btn w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white font-medium py-2.5 rounded-lg transition-all duration-200 text-sm hover:scale-[1.02] active:scale-95 shadow-sm hover:shadow-md hover:shadow-accent/30"
        >
          <ShoppingCart className="w-4 h-4 transition-transform duration-200 group-hover/btn:-translate-y-0.5 group-hover/btn:scale-110" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
