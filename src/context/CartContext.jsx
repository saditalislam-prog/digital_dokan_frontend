import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import API from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'digital_dokan_cart';

function getLocalCart() {
  try {
    const data = localStorage.getItem(CART_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setLocalCart(items) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState(getLocalCart);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // Sync to localStorage whenever cartItems changes
  useEffect(() => {
    setLocalCart(cartItems);
  }, [cartItems]);

  // Fetch cart from API or fallback to localStorage
  const fetchCart = useCallback(async () => {
    const local = getLocalCart();
    if (local && local.length > 0) {
      setCartItems(local);
    }

    if (user) {
      try {
        setLoading(true);
        const res = await API.get('/cart/');
        const items = res.data.items || res.data || [];
        if (Array.isArray(items) && items.length > 0) {
          setCartItems(items);
          setLocalCart(items);
        }
      } catch (err) {
        console.warn('Backend cart unreachable, using local storage:', err);
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(async (product, quantity = 1) => {
    if (!product) return;

    // 1. Instantly update local state and localStorage for reliable, zero-latency cart
    setCartItems(prev => {
      const pId = product.id;
      const existing = prev.find(item => item.product?.id === pId || item.id === pId);
      let updated;
      if (existing) {
        updated = prev.map(item =>
          (item.product?.id === pId || item.id === pId)
            ? { ...item, quantity: (item.quantity || 1) + quantity }
            : item
        );
      } else {
        updated = [
          ...prev,
          {
            id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            product: product,
            quantity: quantity,
            price: parseFloat(product.sale_price || product.price || 0),
          }
        ];
      }
      setLocalCart(updated);
      return updated;
    });

    showNotification(`🛒 "${product.name}" added to cart!`);

    // 2. If user is authenticated, attempt background sync with server
    if (user) {
      try {
        await API.post('/cart/add/', { product: product.id, product_id: product.id, quantity });
      } catch (err) {
        console.warn('Backend cart add failed, retained in local cart:', err);
      }
    }
  }, [user, showNotification]);

  const removeFromCart = useCallback(async (itemId) => {
    setCartItems(prev => {
      const updated = prev.filter(item => item.id !== itemId && item.product?.id !== itemId);
      setLocalCart(updated);
      return updated;
    });
    showNotification('Item removed from cart');

    if (user) {
      try {
        await API.delete(`/cart/remove/${itemId}/`).catch(() => API.delete(`/cart/${itemId}/delete/`));
      } catch (err) {
        console.warn('Backend cart remove failed:', err);
      }
    }
  }, [user, showNotification]);

  const updateQuantity = useCallback(async (itemId, quantity) => {
    if (quantity < 1) return;

    setCartItems(prev => {
      const updated = prev.map(item =>
        (item.id === itemId || item.product?.id === itemId) ? { ...item, quantity } : item
      );
      setLocalCart(updated);
      return updated;
    });

    if (user) {
      try {
        await API.patch(`/cart/update/${itemId}/`, { quantity }).catch(() => API.patch(`/cart/${itemId}/update/`, { quantity }));
      } catch (err) {
        console.warn('Backend cart update failed:', err);
      }
    }
  }, [user]);

  const clearCart = useCallback(async () => {
    setCartItems([]);
    setLocalCart([]);
    showNotification('Cart cleared');

    if (user) {
      try {
        await API.delete('/cart/clear/');
      } catch (err) {
        console.warn('Backend cart clear failed:', err);
      }
    }
  }, [user, showNotification]);

  const cartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }, [cartItems]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const price = item.price || item.product?.price || item.product?.sale_price || 0;
      return sum + (parseFloat(price) * (item.quantity || 1));
    }, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      cartTotal,
      loading,
      notification,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }}>
      {children}
      {notification && (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/95 text-white shadow-2xl border border-slate-700/60 backdrop-blur-md pointer-events-none transition-all">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-bold">{notification.message}</span>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
