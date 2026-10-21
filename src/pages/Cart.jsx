import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cartItems, cartCount, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState(user?.username || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'DIGITAL10') {
      setDiscountApplied(0.1);
      setPromoError('');
    } else {
      setPromoError('Invalid coupon code. Try DIGITAL10 for 10% off!');
    }
  };

  const discountAmount = cartTotal * discountApplied;
  const finalTotal = Math.max(0, cartTotal - discountAmount);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!customerAddress || !customerPhone) {
      alert('Please fill out delivery address and phone number!');
      return;
    }
    setOrderPlaced(true);
    setTimeout(() => {
      clearCart();
    }, 1500);
  };

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-[70vh] bg-surface flex items-center justify-center py-16 px-4">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm max-w-md w-full text-center space-y-5">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto text-accent">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Your Cart is Empty</h2>
          <p className="text-gray-500 text-sm">
            Looks like you haven't added anything to your cart yet. Explore our latest electronics and gadgets!
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-accent hover:bg-accent-dark text-white rounded-xl font-semibold text-sm transition-colors shadow-lg hover:shadow-accent/30"
          >
            Start Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-6 border-b border-gray-200 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Shopping Cart
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              You have {cartCount} item{cartCount > 1 ? 's' : ''} in your cart
            </p>
          </div>
          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-semibold text-red-500 hover:text-red-700 flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Clear All
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item) => {
              const product = item.product || item;
              const price = parseFloat(product.price || item.price || 0);
              const qty = item.quantity || 1;
              const itemTotal = price * qty;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-5 transition-all hover:shadow-md"
                >
                  {/* Image */}
                  <Link
                    to={`/product/${product.slug || product.id}`}
                    className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50 p-2 shrink-0 border border-gray-100"
                  >
                    <img
                      src={product.image || 'https://via.placeholder.com/150x150/f3f4f6/94a3b8?text=Product'}
                      alt={product.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150x150/f3f4f6/94a3b8?text=Product';
                      }}
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 text-center sm:text-left">
                    {product.brand && (
                      <span className="text-[11px] font-bold uppercase text-accent tracking-wider">
                        {product.brand.name || product.brand}
                      </span>
                    )}
                    <Link to={`/product/${product.slug || product.id}`}>
                      <h3 className="font-bold text-gray-900 hover:text-accent transition-colors text-base line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <span className="text-sm font-semibold text-gray-500 mt-1 block">
                      ${price.toFixed(2)} each
                    </span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center border border-gray-200 rounded-xl bg-surface px-2 py-1">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, qty - 1))}
                      className="p-1 text-gray-500 hover:text-black"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-sm font-bold text-gray-900">{qty}</span>
                    <button
                      onClick={() => updateQuantity(item.id, qty + 1)}
                      className="p-1 text-gray-500 hover:text-black"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right min-w-[80px]">
                    <span className="text-base font-extrabold text-gray-900">
                      ${itemTotal.toFixed(2)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-emerald-600">Free</span>
                </div>
                {discountApplied > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount (10%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-gray-100 flex justify-between text-base font-extrabold text-gray-900">
                  <span>Total Amount</span>
                  <span className="text-xl text-accent">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Coupon code (DIGITAL10)"
                    className="flex-1 bg-surface border border-gray-200 rounded-xl px-3 py-2 text-xs uppercase outline-none focus:border-accent"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-xs rounded-xl transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-xs text-red-500">{promoError}</p>}
                {discountApplied > 0 && (
                  <p className="text-xs text-emerald-600 font-medium">✓ Coupon applied successfully!</p>
                )}
              </form>

              {/* Checkout Action Button */}
              <button
                onClick={() => setOrderModalOpen(true)}
                className="w-full py-4 bg-accent hover:bg-accent-dark text-white font-bold rounded-2xl shadow-xl hover:shadow-accent/40 transition-all flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Cash on Delivery / Direct Confirmation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {orderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-100">
            {orderPlaced ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Order Confirmed!</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Thank you for shopping with <strong>Digital Dokan</strong>! Your order of{' '}
                  <span className="font-bold text-accent">${finalTotal.toFixed(2)}</span> has been placed.
                  Our representative will contact you at <strong>{customerPhone}</strong> for delivery verification.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setOrderModalOpen(false);
                      setOrderPlaced(false);
                    }}
                    className="w-full py-3 bg-accent text-white font-bold rounded-xl"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900">Checkout (Cash on Delivery)</h3>
                  <button
                    type="button"
                    onClick={() => setOrderModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 text-sm font-semibold"
                  >
                    ✕
                  </button>
                </div>

                <div className="bg-surface p-3 rounded-xl text-xs space-y-1 text-gray-600">
                  <div className="flex justify-between">
                    <span>Order Total:</span>
                    <span className="font-bold text-gray-900">${finalTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="font-semibold text-emerald-600">Cash on Delivery (No Card Needed)</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full text-sm bg-surface border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+880 1XXXXXXXXX"
                    className="w-full text-sm bg-surface border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Delivery Address</label>
                  <textarea
                    rows={3}
                    required
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="House / Street, Area, City, Postcode"
                    className="w-full text-sm bg-surface border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-accent"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-accent hover:bg-accent-dark text-white font-bold rounded-xl shadow-lg transition-colors"
                  >
                    Confirm Order (${finalTotal.toFixed(2)})
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

