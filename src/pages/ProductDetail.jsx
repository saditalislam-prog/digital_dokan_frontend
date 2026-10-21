import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw, Check, Plus, Minus, ChevronRight, User } from 'lucide-react';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [addedToast, setAddedToast] = useState(false);

  // Review submission state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    API.get(`/products/${slug}/`)
      .then((res) => {
        setProduct(res.data);
        setActiveImage(res.data.image);
        // Fetch related products in same category
        if (res.data.category?.slug) {
          API.get(`/products/?category=${res.data.category.slug}`)
            .then((r) => setRelatedProducts(r.data.filter((p) => p.id !== res.data.id).slice(0, 4)))
            .catch(console.error);
        }
      })
      .catch((err) => console.error('Failed to load product detail:', err))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setSubmittingReview(true);
    try {
      await API.post('/reviews/create/', {
        product: product.slug,
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviewSuccess(true);
      // Reload product to see review
      const res = await API.get(`/products/${slug}/`);
      setProduct(res.data);
      setReviewComment('');
    } catch (err) {
      console.error('Review submit error:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-gray-200 aspect-square rounded-3xl" />
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-10 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-24 bg-gray-200 rounded" />
            <div className="h-12 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
        <p className="text-gray-500 mt-2 mb-6">The requested product could not be found.</p>
        <Link to="/shop" className="px-6 py-2.5 bg-accent text-white rounded-xl font-semibold">
          Back to Shop
        </Link>
      </div>
    );
  }

  const displayPrice = parseFloat(product.price);
  const oldPrice = product.old_price ? parseFloat(product.old_price) : null;
  const discount = oldPrice && oldPrice > displayPrice
    ? Math.round((1 - displayPrice / oldPrice) * 100)
    : 0;

  return (
    <div className="bg-surface min-h-screen py-8">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <Check className="w-5 h-5" />
          <span className="font-semibold text-sm">Added {quantity} item(s) to Cart!</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <Link to="/" className="hover:text-gray-700">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/shop" className="hover:text-gray-700">Shop</Link>
          {product.category && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link to={`/category/${product.category.slug}`} className="hover:text-gray-700">
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-700 font-medium truncate">{product.name}</span>
        </nav>

        {/* Product Details Section */}
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-sm mb-12">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-14">
            {/* Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center p-4">
                <img
                  src={activeImage || product.image}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/500x500/f3f4f6/94a3b8?text=Product';
                  }}
                />
                {discount > 0 && (
                  <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                    -{discount}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 0 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  <button
                    onClick={() => setActiveImage(product.image)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 p-1 shrink-0 ${
                      activeImage === product.image ? 'border-accent' : 'border-transparent bg-gray-50'
                    }`}
                  >
                    <img src={product.image} alt="" className="w-full h-full object-cover rounded-lg" />
                  </button>
                  {product.images.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImage(img.image)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 p-1 shrink-0 ${
                        activeImage === img.image ? 'border-accent' : 'border-transparent bg-gray-50'
                      }`}
                    >
                      <img src={img.image} alt="" className="w-full h-full object-cover rounded-lg" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  {product.brand && (
                    <span className="text-xs uppercase font-bold text-accent bg-accent/10 px-3 py-1 rounded-full">
                      {product.brand.name}
                    </span>
                  )}
                  {product.category && (
                    <span className="text-xs text-gray-500 font-medium">
                      {product.category.name}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                  {product.name}
                </h1>

                {/* Stars */}
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {parseFloat(product.rating || 0).toFixed(1)}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({product.review_count || 0} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 mt-5">
                  <span className="text-3xl font-extrabold text-gray-900">
                    ${displayPrice.toFixed(2)}
                  </span>
                  {oldPrice && oldPrice > displayPrice && (
                    <span className="text-lg text-gray-400 line-through">
                      ${oldPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mt-4">
                  {product.description || 'Top of the line flagship electronic device with extraordinary performance, durable build, and long-lasting battery life.'}
                </p>

                {/* Specifications List */}
                {product.specifications && Object.keys(product.specifications).length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">
                      Key Specifications
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(product.specifications).map(([key, val]) => (
                        <div key={key} className="bg-surface p-2.5 rounded-lg flex flex-col">
                          <span className="text-gray-400 capitalize">{key}</span>
                          <span className="font-semibold text-gray-800">{String(val)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity + Add to Cart Action */}
              <div className="pt-6 border-t border-gray-100 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-gray-700 uppercase">Quantity:</span>
                  <div className="flex items-center border border-gray-200 rounded-xl bg-surface">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2 text-gray-600 hover:text-black transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 text-sm font-bold text-gray-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="p-2 text-gray-600 hover:text-black transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-emerald-600 font-semibold">
                    ✓ In Stock (Ready to dispatch)
                  </span>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg hover:shadow-accent/40"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-2 pt-2 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-accent" />
                    <span>Free Shipping</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-accent" />
                    <span>Official Warranty</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RotateCcw className="w-4 h-4 text-accent" />
                    <span>7 Days Return</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-sm mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
          
          <div className="grid md:grid-cols-12 gap-8">
            {/* Reviews list */}
            <div className="md:col-span-7 space-y-4">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-surface border border-gray-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xs">
                          {rev.user ? rev.user[0].toUpperCase() : 'U'}
                        </div>
                        <span className="font-semibold text-sm text-gray-900">{rev.user}</span>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-gray-400 block">
                      {new Date(rev.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm py-4">No reviews yet for this product. Be the first to review!</p>
              )}
            </div>

            {/* Leave a review form */}
            <div className="md:col-span-5 bg-surface p-6 rounded-2xl border border-gray-100">
              <h3 className="font-bold text-gray-900 text-base mb-3">Write a Review</h3>
              {user ? (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Rating</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          type="button"
                          key={num}
                          onClick={() => setReviewRating(num)}
                          className={`p-1 rounded ${num <= reviewRating ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          <Star className="w-5 h-5 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Your Feedback</label>
                    <textarea
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience with this device..."
                      required
                      className="w-full text-sm bg-white border border-gray-200 rounded-xl p-3 outline-none focus:border-accent"
                    />
                  </div>

                  {reviewSuccess && (
                    <p className="text-xs text-emerald-600 font-semibold">Thank you! Your review was posted.</p>
                  )}

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full py-2.5 bg-accent hover:bg-accent-dark text-white font-semibold text-sm rounded-xl transition-colors"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <p className="text-xs text-gray-500 mb-4">Please log in to leave your verified review.</p>
                  <Link
                    to="/login"
                    className="inline-block px-5 py-2 bg-accent text-white rounded-xl text-xs font-semibold"
                  >
                    Log In to Review
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

