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
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // Fetch cart from API or localStorage
  const fetchCart = useCallback(async () => {
    if (user) {
      try {
        setLoading(true);
        const res = await API.get('/cart/');
        const items = res.data.items || res.data || [];
        setCartItems(items);
      } catch {
        // Fallback to localStorage if API fails
        setCartItems(getLocalCart());
      } finally {
        setLoading(false);
      }
    } else {
      setCartItems(getLocalCart());
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Sync to localStorage when not logged in
  useEffect(() => {
    if (!user) {
      setLocalCart(cartItems);
    }
  }, [cartItems, user]);

  const addToCart = useCallback(async (product, quantity = 1) => {
    if (user) {
      try {
        await API.post('/cart/add/', { product: product.id, product_id: product.id, quantity });
        await fetchCart();
        showNotification(`${product.name} added to cart!`);
      } catch {
        showNotification('Failed to add item to cart', 'error');
      }
    } else {
      setCartItems(prev => {
        const existing = prev.find(item => item.product?.id === product.id || item.id === product.id);
        if (existing) {
          return prev.map(item =>
            (item.product?.id === product.id || item.id === product.id)
              ? { ...item, quantity: (item.quantity || 1) + quantity }
              : item
          );
        }
        return [...prev, {
          id: `local_${Date.now()}`,
          product: product,
          quantity,
          price: product.price || product.sale_price
        }];
      });
      showNotification(`${product.name} added to cart!`);
    }
  }, [user, fetchCart, showNotification]);

  const removeFromCart = useCallback(async (itemId) => {
    if (user) {
      try {
        await API.delete(`/cart/remove/${itemId}/`);
        await fetchCart();
        showNotification('Item removed from cart');
      } catch {
        showNotification('Failed to remove item', 'error');
      }
    } else {
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      showNotification('Item removed from cart');
    }
  }, [user, fetchCart, showNotification]);

  const updateQuantity = useCallback(async (itemId, quantity) => {
    if (quantity < 1) return;
    if (user) {
      try {
        await API.patch(`/cart/update/${itemId}/`, { quantity });
        await fetchCart();
      } catch {
        showNotification('Failed to update quantity', 'error');
      }
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    }
  }, [user, fetchCart, showNotification]);

  const clearCart = useCallback(async () => {
    if (user) {
      try {
        await API.delete('/cart/clear/');
        setCartItems([]);
        showNotification('Cart cleared');
      } catch {
        showNotification('Failed to clear cart', 'error');
      }
    } else {
      setCartItems([]);
      localStorage.removeItem(CART_STORAGE_KEY);
      showNotification('Cart cleared');
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
