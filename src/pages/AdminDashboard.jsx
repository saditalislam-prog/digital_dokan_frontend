import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, Package, Layers, Award, FileText, Star,
  Plus, Edit2, Trash2, Search, ArrowLeft, LogOut, CheckCircle,
  X, AlertTriangle, RefreshCw, Sun, Moon, MessageCircle, Check, ExternalLink,
  ShoppingBag, Eye, Phone, MapPin, Truck, Calendar, DollarSign, CheckCircle2, Clock, XCircle
} from 'lucide-react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { mockCategories, mockBrands, mockProducts, mockBlogPosts, sampleOrders } from '../data/mockData';

export default function AdminDashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Modals state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [brandModalOpen, setBrandModalOpen] = useState(false);
  const [blogModalOpen, setBlogModalOpen] = useState(false);

  // Edit target state (null means adding new)
  const [editingItem, setEditingItem] = useState(null);

  // Search in tables
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [productForm, setProductForm] = useState({
    name: '', category: '', brand: '', price: '', old_price: '',
    image: '', stock: 20, rating: 4.5, description: '',
    is_featured: false, is_new: false, is_bestseller: false, is_deal: false
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '', slug: '', image: '', description: ''
  });

  const [brandForm, setBrandForm] = useState({
    name: '', slug: '', logo: ''
  });

  const [blogForm, setBlogForm] = useState({
    title: '', slug: '', category: 'Tech News', image: '', excerpt: '', content: ''
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Auth Protection: Verify staff / superuser
  useEffect(() => {
    if (!authLoading && (!user || (!user.is_staff && !user.is_superuser))) {
      navigate('/admin-login');
    }
  }, [user, authLoading, navigate]);

  // Load data with fallback to mock data
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, prodRes, catRes, brandRes, blogRes, revRes] = await Promise.all([
        API.get('/admin/stats/').catch(() => ({ data: {} })),
        API.get('/products/').catch(() => ({ data: mockProducts })),
        API.get('/categories/').catch(() => ({ data: mockCategories })),
        API.get('/brands/').catch(() => ({ data: mockBrands })),
        API.get('/blog/').catch(() => ({ data: mockBlogPosts })),
        API.get('/reviews/').catch(() => ({ data: [] }))
      ]);

      const prodData = prodRes?.data && prodRes.data.length > 0 ? prodRes.data : mockProducts;
      const catData = catRes?.data && catRes.data.length > 0 ? catRes.data : mockCategories;
      const brandData = brandRes?.data && brandRes.data.length > 0 ? brandRes.data : mockBrands;
      const blogData = blogRes?.data && blogRes.data.length > 0 ? blogRes.data : mockBlogPosts;
      const revData = revRes?.data || [];

      setStats(statsRes?.data && Object.keys(statsRes.data).length > 0 ? statsRes.data : {
        total_products: prodData.length,
        total_categories: catData.length,
        total_brands: brandData.length,
        total_reviews: revData.length || 18,
      });

      setProducts(prodData);
      setCategories(catData);
      setBrands(brandData);
      setBlogs(blogData);
      setReviews(revData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      setProducts(mockProducts);
      setCategories(mockCategories);
      setBrands(mockBrands);
      setBlogs(mockBlogPosts);
    } finally {
      setLoading(false);
      loadInquiries();
    }
  };

  useEffect(() => {
    if (user && (user.is_staff || user.is_superuser)) {
      loadAllData();
      loadInquiries();
      loadOrders();
    }
  }, [user]);

  // Real-time synchronization for customer live chat inquiries & orders
  useEffect(() => {
    loadInquiries();
    loadOrders();

    const handleNewInquiry = (e) => {
      loadInquiries();
      if (e?.detail?.message) {
        showToast(`💬 New Chat Inquiry: "${e.detail.message.substring(0, 35)}..."`);
      }
    };

    const handleNewOrder = (e) => {
      loadOrders();
      if (e?.detail) {
        showToast(`🛍️ New Order Placed: #${e.detail.id} by ${e.detail.customerName} ($${Number(e.detail.total || 0).toFixed(2)})`);
      }
    };

    const handleStorageChange = (e) => {
      if (!e.key || e.key === 'digital_dokan_customer_inquiries') {
        loadInquiries();
      }
      if (!e.key || e.key === 'digital_dokan_orders') {
        loadOrders();
      }
    };

    window.addEventListener('digital_dokan_new_inquiry', handleNewInquiry);
    window.addEventListener('digital_dokan_new_order', handleNewOrder);
    window.addEventListener('storage', handleStorageChange);

    // Auto-poll every 2 seconds while admin dashboard is open
    const pollInterval = setInterval(() => {
      loadInquiries();
      loadOrders();
    }, 2000);

    return () => {
      window.removeEventListener('digital_dokan_new_inquiry', handleNewInquiry);
      window.removeEventListener('digital_dokan_new_order', handleNewOrder);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(pollInterval);
    };
  }, []);

  // ── Product CRUD Handlers ────────────────────────
  const openAddProduct = () => {
    setEditingItem(null);
    setProductForm({
      name: '',
      category: categories[0]?.id || '',
      brand: brands[0]?.id || '',
      price: '',
      old_price: '',
      image: '',
      stock: 25,
      rating: 4.5,
      description: '',
      is_featured: false,
      is_new: true,
      is_bestseller: false,
      is_deal: false
    });
    setProductModalOpen(true);
  };

  const openEditProduct = (p) => {
    setEditingItem(p);
    setProductForm({
      name: p.name,
      category: p.category?.id || p.category || '',
      brand: p.brand?.id || p.brand || '',
      price: p.price,
      old_price: p.old_price || '',
      image: p.image || '',
      stock: p.stock || 0,
      rating: p.rating || 0,
      description: p.description || '',
      is_featured: !!p.is_featured,
      is_new: !!p.is_new,
      is_bestseller: !!p.is_bestseller,
      is_deal: !!p.is_deal
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        category: parseInt(productForm.category) || productForm.category,
        brand: parseInt(productForm.brand) || productForm.brand,
        price: parseFloat(productForm.price),
        old_price: productForm.old_price ? parseFloat(productForm.old_price) : null,
      };

      if (editingItem) {
        await API.patch(`/products/${editingItem.id}/update/`, payload).catch(() => {
          // Local fallback update
          setProducts(prev => prev.map(p => p.id === editingItem.id ? { ...p, ...payload } : p));
        });
        showToast('Product updated successfully!');
      } else {
        await API.post('/products/create/', payload).catch(() => {
          // Local fallback add
          const newProd = { id: Date.now(), ...payload, slug: payload.name.toLowerCase().replace(/[^a-z0-9]/g, '-') };
          setProducts(prev => [newProd, ...prev]);
        });
        showToast('New product added successfully!');
      }
      setProductModalOpen(false);
      loadAllData();
    } catch (err) {
      console.error('Save product error:', err);
      showToast('Product saved locally!');
      setProductModalOpen(false);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await API.delete(`/products/${id}/delete/`).catch(() => {
        setProducts(prev => prev.filter(p => p.id !== id));
      });
      showToast('Product deleted!');
      loadAllData();
    } catch (err) {
      console.error('Delete error:', err);
      setProducts(prev => prev.filter(p => p.id !== id));
      showToast('Product deleted!');
    }
  };

  // ── Category CRUD Handlers ────────────────────────
  const openAddCategory = () => {
    setEditingItem(null);
    setCategoryForm({ name: '', slug: '', image: '', description: '' });
    setCategoryModalOpen(true);
  };

  const openEditCategory = (c) => {
    setEditingItem(c);
    setCategoryForm({ name: c.name, slug: c.slug, image: c.image || '', description: c.description || '' });
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      const slugVal = categoryForm.slug || categoryForm.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const payload = { ...categoryForm, slug: slugVal };
      if (editingItem) {
        await API.patch(`/categories/${editingItem.id}/update/`, payload).catch(() => {
          setCategories(prev => prev.map(c => c.id === editingItem.id ? { ...c, ...payload } : c));
        });
        showToast('Category updated!');
      } else {
        await API.post('/categories/create/', payload).catch(() => {
          setCategories(prev => [...prev, { id: Date.now(), ...payload }]);
        });
        showToast('New category created!');
      }
      setCategoryModalOpen(false);
      loadAllData();
    } catch (err) {
      console.error(err);
      showToast('Category saved!');
      setCategoryModalOpen(false);
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"? This may affect associated products.`)) return;
    try {
      await API.delete(`/categories/${id}/delete/`).catch(() => {
        setCategories(prev => prev.filter(c => c.id !== id));
      });
      showToast('Category deleted');
      loadAllData();
    } catch (err) {
      setCategories(prev => prev.filter(c => c.id !== id));
      showToast('Category deleted');
    }
  };

  // ── Brand CRUD Handlers ───────────────────────────
  const openAddBrand = () => {
    setEditingItem(null);
    setBrandForm({ name: '', slug: '', logo: '' });
    setBrandModalOpen(true);
  };

  const openEditBrand = (b) => {
    setEditingItem(b);
    setBrandForm({ name: b.name, slug: b.slug, logo: b.logo || '' });
    setBrandModalOpen(true);
  };

  const handleSaveBrand = async (e) => {
    e.preventDefault();
    try {
      const slugVal = brandForm.slug || brandForm.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const payload = { ...brandForm, slug: slugVal };
      if (editingItem) {
        await API.patch(`/brands/${editingItem.id}/update/`, payload).catch(() => {
          setBrands(prev => prev.map(b => b.id === editingItem.id ? { ...b, ...payload } : b));
        });
        showToast('Brand updated!');
      } else {
        await API.post('/brands/create/', payload).catch(() => {
          setBrands(prev => [...prev, { id: Date.now(), ...payload }]);
        });
        showToast('New brand created!');
      }
      setBrandModalOpen(false);
      loadAllData();
    } catch (err) {
      showToast('Brand saved!');
      setBrandModalOpen(false);
    }
  };

  const handleDeleteBrand = async (id, name) => {
    if (!window.confirm(`Delete brand "${name}"?`)) return;
    try {
      await API.delete(`/brands/${id}/delete/`).catch(() => {
        setBrands(prev => prev.filter(b => b.id !== id));
      });
      showToast('Brand deleted');
      loadAllData();
    } catch (err) {
      setBrands(prev => prev.filter(b => b.id !== id));
      showToast('Brand deleted');
    }
  };

  // ── Blog CRUD Handlers ────────────────────────────
  const openAddBlog = () => {
    setEditingItem(null);
    setBlogForm({ title: '', slug: '', category: 'Tech News', image: '', excerpt: '', content: '' });
    setBlogModalOpen(true);
  };

  const openEditBlog = (article) => {
    setEditingItem(article);
    setBlogForm({
      title: article.title,
      slug: article.slug,
      category: article.category || 'Tech News',
      image: article.image || '',
      excerpt: article.excerpt || '',
      content: article.content || ''
    });
    setBlogModalOpen(true);
  };

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    try {
      const slugVal = blogForm.slug || blogForm.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const payload = { ...blogForm, slug: slugVal };
      if (editingItem) {
        await API.patch(`/blog/${editingItem.id}/update/`, payload).catch(() => {
          setBlogs(prev => prev.map(b => b.id === editingItem.id ? { ...b, ...payload } : b));
        });
        showToast('Blog article updated!');
      } else {
        await API.post('/blog/create/', payload).catch(() => {
          setBlogs(prev => [{ id: Date.now(), ...payload }, ...prev]);
        });
        showToast('Article published!');
      }
      setBlogModalOpen(false);
      loadAllData();
    } catch (err) {
      showToast('Article saved!');
      setBlogModalOpen(false);
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Delete this article?')) return;
    try {
      await API.delete(`/blog/${id}/delete/`).catch(() => {
        setBlogs(prev => prev.filter(b => b.id !== id));
      });
      showToast('Article deleted');
      loadAllData();
    } catch (err) {
      setBlogs(prev => prev.filter(b => b.id !== id));
      showToast('Article deleted');
    }
  };

  // ── Live Chat Inquiries Handlers ──────────────────
  const loadInquiries = () => {
    try {
      const stored = localStorage.getItem('digital_dokan_customer_inquiries');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setInquiries(parsed);
          return;
        }
      }
      // If never initialized, populate realistic default inquiries
      const defaultInqs = [
        {
          id: 'inq_1',
          user: 'Rahim Ahmed (Visitor #4821)',
          message: 'Is the ASUS ROG Zephyrus G16 with RTX 4080 available for immediate delivery in Dhanmondi?',
          time: '09:15 PM',
          date: 'Today',
          status: 'New',
          phone: '+880 1712-345678'
        },
        {
          id: 'inq_2',
          user: 'Tariqul Islam',
          message: 'Can I pay via bKash on delivery for the MacBook Pro 16" M3 Max?',
          time: '08:40 PM',
          date: 'Today',
          status: 'Resolved',
          phone: '+880 1819-876543'
        },
        {
          id: 'inq_3',
          user: 'Sadia Rahman',
          message: 'What is the warranty policy for Dell XPS 16? Does it include official international warranty?',
          time: '07:22 PM',
          date: 'Yesterday',
          status: 'New',
          phone: '+880 1911-223344'
        }
      ];
      setInquiries(defaultInqs);
      localStorage.setItem('digital_dokan_customer_inquiries', JSON.stringify(defaultInqs));
    } catch {
      setInquiries([]);
    }
  };

  const handleToggleInquiryStatus = (id) => {
    const updated = inquiries.map((inq) =>
      inq.id === id ? { ...inq, status: inq.status === 'Resolved' ? 'New' : 'Resolved' } : inq
    );
    setInquiries(updated);
    localStorage.setItem('digital_dokan_customer_inquiries', JSON.stringify(updated));
    showToast('Inquiry status updated!');
  };

  const handleDeleteInquiry = (id) => {
    const updated = inquiries.filter((inq) => inq.id !== id);
    setInquiries(updated);
    localStorage.setItem('digital_dokan_customer_inquiries', JSON.stringify(updated));
    showToast('Inquiry removed');
  };

  const handleClearAllInquiries = () => {
    if (!window.confirm('Clear all customer inquiries?')) return;
    setInquiries([]);
    localStorage.setItem('digital_dokan_customer_inquiries', JSON.stringify([]));
    showToast('All inquiries cleared');
  };

  // ── Customer Orders Handlers ──────────────────────
  const loadOrders = () => {
    try {
      const stored = localStorage.getItem('digital_dokan_orders');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setOrders(parsed);
          return;
        }
      }
      setOrders(sampleOrders || []);
      localStorage.setItem('digital_dokan_orders', JSON.stringify(sampleOrders || []));
    } catch {
      setOrders(sampleOrders || []);
    }
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const stepMap = {
      confirmed: 1,
      processing: 2,
      shipped: 3,
      out_for_delivery: 4,
      delivered: 5,
      cancelled: 0,
    };
    const titleMap = {
      confirmed: 'Order Confirmed',
      processing: 'Processing & Quality Check',
      shipped: 'Handed Over to Courier',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered Successfully',
      cancelled: 'Order Cancelled',
    };

    const updated = orders.map((o) => {
      if (o.id === orderId) {
        const newTimeline = [
          ...(o.timeline || []),
          {
            title: titleMap[newStatus] || newStatus,
            date: 'Just now',
            description: `Order status updated to ${newStatus} by Store Admin.`,
            completed: true,
            current: true,
          },
        ];
        return {
          ...o,
          status: newStatus,
          statusStep: stepMap[newStatus] ?? o.statusStep,
          timeline: newTimeline,
        };
      }
      return o;
    });

    setOrders(updated);
    localStorage.setItem('digital_dokan_orders', JSON.stringify(updated));
    showToast(`Order #${orderId} updated to ${newStatus.replace(/_/g, ' ')}!`);

    if (selectedOrderDetails && selectedOrderDetails.id === orderId) {
      setSelectedOrderDetails(updated.find((o) => o.id === orderId));
    }
  };

  const handleDeleteOrder = (orderId) => {
    if (!window.confirm(`Delete order #${orderId}?`)) return;
    const updated = orders.filter((o) => o.id !== orderId);
    setOrders(updated);
    localStorage.setItem('digital_dokan_orders', JSON.stringify(updated));
    showToast(`Order #${orderId} deleted`);

    if (selectedOrderDetails && selectedOrderDetails.id === orderId) {
      setSelectedOrderDetails(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const q = orderSearchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      o.id?.toLowerCase().includes(q) ||
      o.customerName?.toLowerCase().includes(q) ||
      o.customerPhone?.toLowerCase().includes(q) ||
      o.customerCity?.toLowerCase().includes(q) ||
      o.customerAddress?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const filteredProducts = products.filter((p) =>
    (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.category?.name || p.category || '').toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.brand?.name || p.brand || '').toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090e1a] text-gray-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-5 h-5" />
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="bg-primary-dark dark:bg-[#070b14] text-white border-b border-white/10 dark:border-slate-800/80 px-6 py-4 flex items-center justify-between sticky top-0 z-40 transition-colors">
        <div className="flex items-center gap-3">
          <Link to="/" title="Go to Storefront">
            <img
              src="/logo-white-text.png"
              alt="Digital Dokan"
              className="h-8 sm:h-9 w-auto object-contain hover:opacity-95"
            />
          </Link>
          <span className="hidden sm:inline-block text-[10px] text-accent-light font-extrabold tracking-wider uppercase bg-accent/20 border border-accent/40 px-2.5 py-0.5 rounded-full">
            Admin Portal
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-300 hover:text-white rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
          </button>

          <button
            onClick={loadAllData}
            className="p-2 text-gray-300 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            to="/"
            className="text-xs font-semibold text-gray-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/20 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Back to Store</span>
          </Link>

          <button
            onClick={() => {
              logout();
              navigate('/admin-login');
            }}
            className="text-xs font-semibold text-red-300 hover:text-red-100 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Tabs */}
        <aside className="w-full md:w-64 bg-white dark:bg-[#0c1322] border-r border-gray-200 dark:border-slate-800/80 p-4 space-y-1.5 shrink-0 transition-colors">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-accent text-white shadow-md'
                : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/80 dark:hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('orders');
              loadOrders();
            }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-accent text-white shadow-md'
                : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/80 dark:hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-4 h-4" />
              <span>Orders</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              activeTab === 'orders' ? 'bg-white/20' : 'bg-emerald-500/15 text-emerald-500 font-bold'
            }`}>
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'products'
                ? 'bg-accent text-white shadow-md'
                : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/80 dark:hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4" />
              <span>Products</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'products' ? 'bg-white/20' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400'}`}>
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-accent text-white shadow-md'
                : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/80 dark:hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <Layers className="w-4 h-4" />
              <span>Categories</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'categories' ? 'bg-white/20' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400'}`}>
              {categories.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('brands')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'brands'
                ? 'bg-accent text-white shadow-md'
                : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/80 dark:hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <Award className="w-4 h-4" />
              <span>Brands</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'brands' ? 'bg-white/20' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400'}`}>
              {brands.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('blogs')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'blogs'
                ? 'bg-accent text-white shadow-md'
                : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/80 dark:hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4" />
              <span>Blog & Articles</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'blogs' ? 'bg-white/20' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400'}`}>
              {blogs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'reviews'
                ? 'bg-accent text-white shadow-md'
                : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/80 dark:hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <Star className="w-4 h-4" />
              <span>Customer Reviews</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'reviews' ? 'bg-white/20' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400'}`}>
              {reviews.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('inquiries');
              loadInquiries();
            }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'inquiries'
                ? 'bg-accent text-white shadow-md'
                : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/80 dark:hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <MessageCircle className="w-4 h-4" />
              <span>Live Inquiries</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'inquiries' ? 'bg-white/20' : 'bg-emerald-500/15 text-emerald-500 font-bold'}`}>
              {inquiries.length}
            </span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {/* ── TAB 1: OVERVIEW ── */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">System Overview</h2>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  Live inventory metrics, active catalogue and store statistics.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <div 
                  onClick={() => setActiveTab('orders')}
                  className="bg-white dark:bg-[#10192d] p-5 rounded-2xl border border-gray-100 dark:border-slate-800/80 shadow-sm flex items-center gap-4 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 dark:text-slate-400 font-semibold block">Total Orders</span>
                    <span className="text-2xl font-black text-gray-900 dark:text-white">{orders.length}</span>
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab('products')}
                  className="bg-white dark:bg-[#10192d] p-5 rounded-2xl border border-gray-100 dark:border-slate-800/80 shadow-sm flex items-center gap-4 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-accent dark:text-blue-400 flex items-center justify-center font-bold">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 dark:text-slate-400 font-semibold block">Products</span>
                    <span className="text-2xl font-black text-gray-900 dark:text-white">{stats?.total_products || products.length}</span>
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab('categories')}
                  className="bg-white dark:bg-[#10192d] p-5 rounded-2xl border border-gray-100 dark:border-slate-800/80 shadow-sm flex items-center gap-4 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 dark:text-slate-400 font-semibold block">Categories</span>
                    <span className="text-2xl font-black text-gray-900 dark:text-white">{stats?.total_categories || categories.length}</span>
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab('brands')}
                  className="bg-white dark:bg-[#10192d] p-5 rounded-2xl border border-gray-100 dark:border-slate-800/80 shadow-sm flex items-center gap-4 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 dark:text-slate-400 font-semibold block">Brands</span>
                    <span className="text-2xl font-black text-gray-900 dark:text-white">{stats?.total_brands || brands.length}</span>
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab('reviews')}
                  className="bg-white dark:bg-[#10192d] p-5 rounded-2xl border border-gray-100 dark:border-slate-800/80 shadow-sm flex items-center gap-4 transition-all hover:scale-[1.02] cursor-pointer col-span-2 sm:col-span-1"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-500 flex items-center justify-center font-bold">
                    <Star className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 dark:text-slate-400 font-semibold block">Reviews</span>
                    <span className="text-2xl font-black text-gray-900 dark:text-white">{stats?.total_reviews || reviews.length}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-[#10192d] p-6 rounded-3xl border border-gray-100 dark:border-slate-800/80 shadow-sm space-y-4 transition-colors">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">Quick Add Shortcuts</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={openAddProduct}
                    className="flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-dark text-white rounded-xl text-xs font-bold transition-colors shadow-md cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Product
                  </button>
                  <button
                    onClick={openAddCategory}
                    className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors shadow-md cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Category
                  </button>
                  <button
                    onClick={openAddBrand}
                    className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors shadow-md cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Brand
                  </button>
                  <button
                    onClick={openAddBlog}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 dark:bg-slate-800 hover:bg-gray-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors shadow-md cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Publish Blog Post
                  </button>
                </div>
              </div>

              {/* Recent Products Snapshot */}
              <div className="bg-white dark:bg-[#10192d] rounded-3xl border border-gray-100 dark:border-slate-800/80 shadow-sm p-6 space-y-4 transition-colors">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 dark:text-white text-base">Recent Inventory Items</h3>
                  <button onClick={() => setActiveTab('products')} className="text-xs font-semibold text-accent dark:text-accent-light hover:underline cursor-pointer">
                    View All Products →
                  </button>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-slate-800/80">
                  {products.slice(0, 5).map((p) => (
                    <div key={p.id} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt="" className="w-10 h-10 object-cover rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{p.name}</p>
                          <span className="text-[11px] text-gray-400 dark:text-slate-400">
                            {(typeof p.brand === 'object' ? p.brand?.name : p.brand) || ''} · {(typeof p.category === 'object' ? p.category?.name : p.category) || ''}
                          </span>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white text-sm">${p.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 2: PRODUCTS MANAGER ── */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Products Management</h2>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Add, update prices, manage stock, and delete items.</p>
                </div>
                <button
                  onClick={openAddProduct}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-dark text-white rounded-xl text-xs font-bold shadow-md transition-colors self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add New Product
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-md">
                <Search className="w-4 h-4 text-gray-400 dark:text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by product name, category, or brand..."
                  className="w-full bg-white dark:bg-[#10192d] border border-gray-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 outline-none focus:border-accent"
                />
              </div>

              {/* Products Table */}
              <div className="bg-white dark:bg-[#10192d] rounded-3xl border border-gray-200 dark:border-slate-800/80 shadow-sm overflow-hidden transition-colors">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 dark:bg-[#0c1322] text-gray-600 dark:text-slate-300 uppercase tracking-wider font-semibold border-b border-gray-200 dark:border-slate-800">
                      <tr>
                        <th className="p-4">Product</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Brand</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4">Badges</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800/80">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image}
                                alt=""
                                className="w-12 h-12 object-cover rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shrink-0"
                              />
                              <div className="max-w-[200px]">
                                <span className="font-bold text-gray-900 dark:text-white block truncate">{p.name}</span>
                                <span className="text-[10px] text-gray-400 dark:text-slate-500">{p.slug}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-gray-700 dark:text-slate-300 font-medium">
                            {(typeof p.category === 'object' ? p.category?.name : p.category) || '—'}
                          </td>
                          <td className="p-4 text-gray-700 dark:text-slate-300 font-medium">
                            {(typeof p.brand === 'object' ? p.brand?.name : p.brand) || '—'}
                          </td>
                          <td className="p-4">
                            <span className="font-extrabold text-gray-900 dark:text-white">${p.price}</span>
                            {p.old_price && (
                              <span className="text-gray-400 dark:text-slate-500 line-through block text-[10px]">${p.old_price}</span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className={`font-semibold ${p.stock > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                              {p.stock} in stock
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {p.is_new && <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded text-[10px] font-bold">New</span>}
                              {p.is_bestseller && <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded text-[10px] font-bold">Bestseller</span>}
                              {p.is_featured && <span className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded text-[10px] font-bold">Featured</span>}
                              {p.is_deal && <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded text-[10px] font-bold">Deal</span>}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openEditProduct(p)}
                                className="p-1.5 text-gray-500 dark:text-slate-400 hover:text-accent dark:hover:text-accent-light hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                className="p-1.5 text-gray-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 3: CATEGORIES MANAGER ── */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Categories</h2>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Manage shop product categories.</p>
                </div>
                <button
                  onClick={openAddCategory}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Category
                </button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {categories.map((c) => (
                  <div key={c.id} className="bg-white dark:bg-[#10192d] rounded-2xl border border-gray-100 dark:border-slate-800/80 p-5 shadow-sm flex items-start gap-4 transition-colors">
                    <img src={c.image} alt="" className="w-16 h-16 object-cover rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">{c.name}</h4>
                      <span className="text-[10px] text-gray-400 dark:text-slate-500 block mb-2">{c.slug}</span>
                      <p className="text-xs text-gray-500 dark:text-slate-400 line-clamp-2">{c.description || 'No description'}</p>
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-slate-800/80">
                        <button
                          onClick={() => openEditCategory(c)}
                          className="text-xs font-semibold text-accent dark:text-accent-light hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(c.id, c.name)}
                          className="text-xs font-semibold text-red-500 dark:text-red-400 hover:underline flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB 4: BRANDS MANAGER ── */}
          {activeTab === 'brands' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Brands</h2>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Manage device manufacturers and brands.</p>
                </div>
                <button
                  onClick={openAddBrand}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Brand
                </button>
              </div>

              <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {brands.map((b) => (
                  <div key={b.id} className="bg-white dark:bg-[#10192d] rounded-2xl border border-gray-100 dark:border-slate-800/80 p-5 shadow-sm flex flex-col justify-between transition-colors">
                    <div className="flex items-center justify-center h-14 mb-3 bg-gray-50/50 dark:bg-slate-800/40 rounded-xl p-2">
                      {b.logo ? (
                        <img src={b.logo} alt={b.name} className="max-h-8 max-w-[100px] object-contain dark:brightness-110" />
                      ) : (
                        <span className="font-bold text-gray-700 dark:text-slate-200 text-base">{b.name}</span>
                      )}
                    </div>
                    <div className="text-center pt-2 border-t border-gray-100 dark:border-slate-800/80 flex items-center justify-between">
                      <span className="font-semibold text-xs text-gray-900 dark:text-white">{b.name}</span>
                      <div className="flex gap-1.5">
                        <button onClick={() => openEditBrand(b)} className="p-1 text-gray-400 dark:text-slate-400 hover:text-accent dark:hover:text-accent-light cursor-pointer">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteBrand(b.id, b.name)} className="p-1 text-gray-400 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB 5: BLOG MANAGER ── */}
          {activeTab === 'blogs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Blog Articles</h2>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Publish news, buying guides and gadget tips.</p>
                </div>
                <button
                  onClick={openAddBlog}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-accent hover:bg-gray-800 dark:hover:bg-accent-dark text-white rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> New Article
                </button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((article) => (
                  <div key={article.id} className="bg-white dark:bg-[#10192d] rounded-2xl border border-gray-100 dark:border-slate-800/80 overflow-hidden shadow-sm flex flex-col transition-colors">
                    <img src={article.image} alt="" className="w-full h-40 object-cover bg-gray-50 dark:bg-slate-800" />
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-[10px] font-bold text-accent dark:text-accent-light uppercase tracking-wider">{article.category}</span>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm mt-1 line-clamp-2">{article.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 line-clamp-2">{article.excerpt || article.content}</p>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-800/80 text-xs">
                        <button onClick={() => openEditBlog(article)} className="text-accent dark:text-accent-light font-semibold hover:underline flex items-center gap-1 cursor-pointer">
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button onClick={() => handleDeleteBlog(article.id)} className="text-red-500 dark:text-red-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB 6: REVIEWS MANAGER ── */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Customer Reviews Moderation</h2>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">View submitted feedback and remove invalid entries.</p>
              </div>

              <div className="bg-white dark:bg-[#10192d] rounded-3xl border border-gray-200 dark:border-slate-800/80 overflow-hidden shadow-sm transition-colors">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 dark:bg-[#0c1322] text-gray-600 dark:text-slate-300 uppercase tracking-wider font-semibold border-b border-gray-200 dark:border-slate-800">
                    <tr>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Product</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4">Feedback</th>
                      <th className="p-4 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-800/80">
                    {reviews.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-4 font-bold text-gray-900 dark:text-white">{r.user || 'Verified Customer'}</td>
                        <td className="p-4 text-gray-600 dark:text-slate-400 font-medium">{r.product}</td>
                        <td className="p-4 text-amber-500 font-bold">★ {r.rating}/5</td>
                        <td className="p-4 text-gray-600 dark:text-slate-300 max-w-xs truncate">{r.comment}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteReview(r.id)}
                            className="p-1.5 text-gray-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 rounded cursor-pointer"
                            title="Delete review"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── TAB 7: LIVE INQUIRIES & CHATS ── */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                    Live Chat Customer Inquiries
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20">
                      Live
                    </span>
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                    Incoming customer inquiries and messages submitted through the website Live Chat widget.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={loadInquiries}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-[#10192d] hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-200 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    title="Refresh inquiries"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh
                  </button>
                  {inquiries.length > 0 && (
                    <button
                      onClick={handleClearAllInquiries}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Clear All
                    </button>
                  )}
                </div>
              </div>

              {/* Inquiries Cards */}
              {inquiries.length === 0 ? (
                <div className="bg-white dark:bg-[#10192d] rounded-3xl border border-gray-200 dark:border-slate-800/80 p-12 text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base">No Customer Inquiries Yet</h3>
                    <p className="text-xs text-gray-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                      When visitors type questions in the Live Chat widget on the storefront, their questions will immediately appear here in real-time.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const samples = [
                        {
                          id: 'inq_sample_1',
                          user: 'Rahim Ahmed (Visitor #4821)',
                          message: 'Is the ASUS ROG Zephyrus G16 with RTX 4080 available for immediate delivery in Dhanmondi?',
                          time: '09:15 PM',
                          date: 'Today',
                          status: 'New',
                          phone: '+880 1712-345678'
                        },
                        {
                          id: 'inq_sample_2',
                          user: 'Tariqul Islam',
                          message: 'Can I pay via bKash on delivery for the MacBook Pro 16" M3 Max?',
                          time: '08:40 PM',
                          date: 'Today',
                          status: 'Resolved',
                          phone: '+880 1819-876543'
                        }
                      ];
                      setInquiries(samples);
                      localStorage.setItem('digital_dokan_customer_inquiries', JSON.stringify(samples));
                      showToast('Sample inquiries loaded!');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer mx-auto"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Load Sample Inquiries
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="bg-white dark:bg-[#10192d] rounded-2xl border border-gray-100 dark:border-slate-800/80 p-5 shadow-sm space-y-3 transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 dark:border-slate-800/60 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-accent/10 text-accent font-bold flex items-center justify-center text-xs">
                            {inq.user?.[0] || 'C'}
                          </div>
                          <div>
                            <span className="font-bold text-sm text-gray-900 dark:text-white block">{inq.user}</span>
                            <span className="text-[11px] text-gray-400 dark:text-slate-500 flex items-center gap-2">
                              <span>{inq.date} • {inq.time}</span>
                              {inq.phone && <span>• 📞 {inq.phone}</span>}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                              inq.status === 'Resolved'
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            }`}
                          >
                            {inq.status}
                          </span>
                        </div>
                      </div>

                      {/* Customer Message */}
                      <div className="bg-slate-50/70 dark:bg-[#0c1322] p-3.5 rounded-xl border border-gray-100 dark:border-slate-800/60 text-xs text-gray-800 dark:text-slate-200 leading-relaxed">
                        <p className="font-medium">"{inq.message}"</p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://wa.me/8801700000000?text=${encodeURIComponent(`Hello ${inq.user}, regarding your inquiry on Digital Dokan: "${inq.message}"`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Reply on WhatsApp
                          </a>
                          <button
                            onClick={() => handleToggleInquiryStatus(inq.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5 text-accent" />
                            {inq.status === 'Resolved' ? 'Mark as New' : 'Mark as Resolved'}
                          </button>
                        </div>

                        <button
                          onClick={() => handleDeleteInquiry(inq.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                          title="Delete inquiry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TAB 8: ORDERS MANAGEMENT ── */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                    Customer Orders & Fulfillment
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20">
                      Live
                    </span>
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                    Manage incoming Cash on Delivery orders, courier dispatching, and delivery status updates.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={loadOrders}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-[#10192d] hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-200 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    title="Refresh orders"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh
                  </button>
                </div>
              </div>

              {/* Order Stats Quick Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#10192d] p-4 rounded-2xl border border-gray-100 dark:border-slate-800/80 shadow-xs">
                  <span className="text-[11px] font-bold text-gray-400 dark:text-slate-400 block">Total Orders</span>
                  <span className="text-xl font-black text-gray-900 dark:text-white mt-1 block">{orders.length}</span>
                </div>
                <div className="bg-white dark:bg-[#10192d] p-4 rounded-2xl border border-gray-100 dark:border-slate-800/80 shadow-xs">
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block">Total Sales</span>
                  <span className="text-xl font-black text-gray-900 dark:text-white mt-1 block">
                    ${orders.reduce((sum, o) => sum + Number(o.total || 0), 0).toFixed(2)}
                  </span>
                </div>
                <div className="bg-white dark:bg-[#10192d] p-4 rounded-2xl border border-gray-100 dark:border-slate-800/80 shadow-xs">
                  <span className="text-[11px] font-bold text-amber-500 block">Pending / Out</span>
                  <span className="text-xl font-black text-gray-900 dark:text-white mt-1 block">
                    {orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length}
                  </span>
                </div>
                <div className="bg-white dark:bg-[#10192d] p-4 rounded-2xl border border-gray-100 dark:border-slate-800/80 shadow-xs">
                  <span className="text-[11px] font-bold text-blue-500 block">Delivered</span>
                  <span className="text-xl font-black text-gray-900 dark:text-white mt-1 block">
                    {orders.filter(o => o.status === 'delivered').length}
                  </span>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="bg-white dark:bg-[#10192d] p-4 rounded-2xl border border-gray-100 dark:border-slate-800/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
                  {['all', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                        orderStatusFilter === st
                          ? 'bg-accent text-white shadow-xs'
                          : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {st === 'all' ? 'All Orders' : st.replace(/_/g, ' ').toUpperCase()}
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:w-64">
                  <input
                    type="text"
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    placeholder="Search by ID, name, city..."
                    className="w-full bg-slate-50 dark:bg-[#0c1322] border border-gray-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 outline-none focus:border-accent"
                  />
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* Orders Table */}
              {filteredOrders.length === 0 ? (
                <div className="bg-white dark:bg-[#10192d] rounded-3xl border border-gray-200 dark:border-slate-800/80 p-12 text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base">No Orders Found</h3>
                    <p className="text-xs text-gray-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                      When customers place orders at checkout, their orders will appear here immediately in real-time.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setOrders(sampleOrders);
                      localStorage.setItem('digital_dokan_orders', JSON.stringify(sampleOrders));
                      showToast('Sample orders loaded!');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer mx-auto"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Load Sample Orders
                  </button>
                </div>
              ) : (
                <div className="bg-white dark:bg-[#10192d] rounded-3xl border border-gray-200 dark:border-slate-800/80 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 dark:bg-[#0c1322] text-gray-600 dark:text-slate-300 uppercase tracking-wider font-semibold border-b border-gray-200 dark:border-slate-800">
                        <tr>
                          <th className="p-4">Order ID & Date</th>
                          <th className="p-4">Customer & Contact</th>
                          <th className="p-4">Region & City</th>
                          <th className="p-4">Items</th>
                          <th className="p-4">Total & Payment</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-slate-800/80">
                        {filteredOrders.map((ord) => {
                          const statusColors = {
                            confirmed: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
                            processing: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
                            shipped: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20',
                            out_for_delivery: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
                            delivered: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
                            cancelled: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20',
                          };

                          return (
                            <tr key={ord.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                              {/* Order ID & Date */}
                              <td className="p-4 font-medium">
                                <span className="font-mono font-bold text-accent dark:text-accent-light block text-sm">
                                  #{ord.id}
                                </span>
                                <span className="text-[11px] text-gray-400 dark:text-slate-500 block mt-0.5">
                                  {ord.orderDate}
                                </span>
                              </td>

                              {/* Customer & Contact */}
                              <td className="p-4">
                                <span className="font-bold text-gray-900 dark:text-white block">
                                  {ord.customerName}
                                </span>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[11px] text-gray-500 dark:text-slate-400 font-mono">
                                    {ord.customerPhone}
                                  </span>
                                  {ord.customerPhone && (
                                    <a
                                      href={`https://wa.me/${ord.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${ord.customerName}, regarding your Digital Dokan Order #${ord.id}:`)}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="p-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                                      title="Chat on WhatsApp"
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  )}
                                </div>
                              </td>

                              {/* Destination */}
                              <td className="p-4">
                                <span className="font-semibold text-gray-800 dark:text-slate-200 block">
                                  {ord.customerCity || 'N/A'}{ord.customerRegion ? `, ${ord.customerRegion}` : ''}
                                </span>
                                <span className="text-[11px] text-gray-400 dark:text-slate-500 block max-w-xs truncate mt-0.5">
                                  {ord.streetAddress || ord.customerAddress || 'Address on file'}
                                </span>
                              </td>

                              {/* Items */}
                              <td className="p-4">
                                <div className="flex items-center gap-1.5">
                                  {ord.items?.slice(0, 3).map((it, idx) => (
                                    <img
                                      key={idx}
                                      src={it.image || 'https://via.placeholder.com/60'}
                                      alt=""
                                      className="w-8 h-8 rounded-lg object-contain bg-gray-100 dark:bg-slate-800 p-0.5 border border-gray-200 dark:border-slate-700"
                                      title={`${it.name} (x${it.quantity})`}
                                    />
                                  ))}
                                  {ord.items?.length > 3 && (
                                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-slate-800 px-1.5 py-1 rounded-md">
                                      +{ord.items.length - 3}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] text-gray-400 dark:text-slate-500 block mt-1">
                                  {ord.items?.reduce((s, it) => s + (it.quantity || 1), 0) || 1} item(s)
                                </span>
                              </td>

                              {/* Total & Payment */}
                              <td className="p-4">
                                <span className="font-bold text-sm text-gray-900 dark:text-white block">
                                  ${Number(ord.total || 0).toFixed(2)}
                                </span>
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                                  {ord.paymentMethod || 'Cash on Delivery'}
                                </span>
                              </td>

                              {/* Status Dropdown */}
                              <td className="p-4">
                                <select
                                  value={ord.status || 'confirmed'}
                                  onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full outline-none cursor-pointer transition-colors ${
                                    statusColors[ord.status] || 'bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  <option value="confirmed" className="bg-white dark:bg-[#10192d] text-gray-900 dark:text-white">Confirmed</option>
                                  <option value="processing" className="bg-white dark:bg-[#10192d] text-gray-900 dark:text-white">Processing</option>
                                  <option value="shipped" className="bg-white dark:bg-[#10192d] text-gray-900 dark:text-white">In Transit</option>
                                  <option value="out_for_delivery" className="bg-white dark:bg-[#10192d] text-gray-900 dark:text-white">Out for Delivery</option>
                                  <option value="delivered" className="bg-white dark:bg-[#10192d] text-gray-900 dark:text-white">Delivered</option>
                                  <option value="cancelled" className="bg-white dark:bg-[#10192d] text-gray-900 dark:text-white">Cancelled</option>
                                </select>
                              </td>

                              {/* Actions */}
                              <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setSelectedOrderDetails(ord)}
                                    className="p-1.5 text-gray-500 hover:text-accent dark:hover:text-accent-light rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                    title="View full order details"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteOrder(ord.id)}
                                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                                    title="Delete order"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ── MODAL: ORDER DETAILS ── */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0e172a] rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-gray-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto text-gray-900 dark:text-slate-100 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800">
              <div>
                <span className="text-[11px] font-bold text-accent uppercase tracking-wider block">Customer Order Details</span>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">
                  Order #{selectedOrderDetails.id}
                </h3>
              </div>
              <button onClick={() => setSelectedOrderDetails(null)} className="text-gray-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Delivery Summary */}
            <div className="grid sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-[#10192d] p-4 rounded-2xl border border-gray-100 dark:border-slate-800">
              <div className="space-y-1 text-xs">
                <span className="font-bold text-gray-400 dark:text-slate-500 uppercase text-[10px] block">Customer Contact</span>
                <p className="font-bold text-sm text-gray-900 dark:text-white">{selectedOrderDetails.customerName}</p>
                <p className="text-gray-600 dark:text-slate-300 font-mono">📞 {selectedOrderDetails.customerPhone}</p>
                {selectedOrderDetails.customerPhone && (
                  <a
                    href={`https://wa.me/${selectedOrderDetails.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${selectedOrderDetails.customerName}, regarding your Order #${selectedOrderDetails.id} on Digital Dokan:`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline pt-1"
                  >
                    <ExternalLink className="w-3 h-3" /> Chat on WhatsApp
                  </a>
                )}
              </div>

              <div className="space-y-1 text-xs">
                <span className="font-bold text-gray-400 dark:text-slate-500 uppercase text-[10px] block">Delivery Location</span>
                <p className="font-bold text-gray-900 dark:text-white">
                  {selectedOrderDetails.customerCity || 'N/A'}{selectedOrderDetails.customerRegion ? `, ${selectedOrderDetails.customerRegion}` : ''}
                </p>
                <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                  {selectedOrderDetails.streetAddress || selectedOrderDetails.customerAddress || 'Address on record'}
                </p>
                <p className="text-[11px] text-gray-400 pt-1">
                  📅 Ordered: {selectedOrderDetails.orderDate}
                </p>
              </div>
            </div>

            {/* Items Ordered List */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">
                Purchased Items ({selectedOrderDetails.items?.length || 0})
              </h4>
              <div className="divide-y divide-gray-100 dark:divide-slate-800 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden">
                {selectedOrderDetails.items?.map((it, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between gap-4 bg-white dark:bg-[#10192d]">
                    <div className="flex items-center gap-3">
                      <img
                        src={it.image || 'https://via.placeholder.com/60'}
                        alt=""
                        className="w-12 h-12 rounded-xl object-contain bg-gray-50 dark:bg-slate-800 p-1 border border-gray-100 dark:border-slate-700"
                      />
                      <div>
                        <p className="font-bold text-xs text-gray-900 dark:text-white line-clamp-1">{it.name}</p>
                        <p className="text-[11px] text-gray-400 dark:text-slate-400">Qty: {it.quantity} × ${Number(it.price || 0).toFixed(2)}</p>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-gray-900 dark:text-white">
                      ${(Number(it.price || 0) * (it.quantity || 1)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-slate-50 dark:bg-[#10192d] p-4 rounded-2xl border border-gray-100 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600 dark:text-slate-400">
                <span>Subtotal:</span>
                <span className="font-bold">${Number(selectedOrderDetails.subtotal || selectedOrderDetails.total || 0).toFixed(2)}</span>
              </div>
              {selectedOrderDetails.discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Discount:</span>
                  <span className="font-bold">-${Number(selectedOrderDetails.discount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600 dark:text-slate-400">
                <span>Shipping & Delivery:</span>
                <span className="font-bold text-emerald-600">Free</span>
              </div>
              <div className="flex justify-between text-base font-black text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-slate-700">
                <span>Total Amount:</span>
                <span>${Number(selectedOrderDetails.total || 0).toFixed(2)}</span>
              </div>
            </div>

            {/* Quick Status Updater */}
            <div className="pt-2 space-y-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase block">Update Delivery Status</span>
              <div className="flex flex-wrap gap-2">
                {['confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateOrderStatus(selectedOrderDetails.id, st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedOrderDetails.status === st
                        ? 'bg-accent text-white shadow-sm ring-2 ring-accent/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {st.replace(/_/g, ' ').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: PRODUCT ADD / EDIT ── */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0e172a] rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-gray-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto text-gray-900 dark:text-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800 mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {editingItem ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setProductModalOpen(false)} className="text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 dark:text-slate-200 block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. iPhone 16 Pro Max 256GB"
                  className="w-full bg-slate-50 dark:bg-[#152238] border border-gray-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:border-accent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 dark:text-slate-200 block mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#152238] border border-gray-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:border-accent text-gray-900 dark:text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id} className="dark:bg-[#152238]">{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 dark:text-slate-200 block mb-1">Brand</label>
                  <select
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#152238] border border-gray-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:border-accent text-gray-900 dark:text-white"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id} className="dark:bg-[#152238]">{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-gray-700 dark:text-slate-200 block mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="999.00"
                    className="w-full bg-slate-50 dark:bg-[#152238] border border-gray-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:border-accent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 dark:text-slate-200 block mb-1">Old Price ($ - optional)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.old_price}
                    onChange={(e) => setProductForm({ ...productForm, old_price: e.target.value })}
                    placeholder="1099.00"
                    className="w-full bg-slate-50 dark:bg-[#152238] border border-gray-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:border-accent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 dark:text-slate-200 block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 dark:bg-[#152238] border border-gray-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:border-accent text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-slate-200 block mb-1">Image URL (High-Res CDN or Unsplash)</label>
                <input
                  type="url"
                  required
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 dark:bg-[#152238] border border-gray-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:border-accent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-slate-200 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Device specifications, warranty, and overview..."
                  className="w-full bg-slate-50 dark:bg-[#152238] border border-gray-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:border-accent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500"
                />
              </div>

              {/* Badges / Flags */}
              <div className="pt-2 border-t border-gray-100 dark:border-slate-800">
                <span className="font-bold text-gray-700 dark:text-slate-200 block mb-2">Display Badges / Sections:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={productForm.is_new}
                      onChange={(e) => setProductForm({ ...productForm, is_new: e.target.checked })}
                      className="rounded text-accent focus:ring-accent"
                    />
                    <span>Latest Arrival</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={productForm.is_bestseller}
                      onChange={(e) => setProductForm({ ...productForm, is_bestseller: e.target.checked })}
                      className="rounded text-accent focus:ring-accent"
                    />
                    <span>Best Seller</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={productForm.is_featured}
                      onChange={(e) => setProductForm({ ...productForm, is_featured: e.target.checked })}
                      className="rounded text-accent focus:ring-accent"
                    />
                    <span>Featured</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={productForm.is_deal}
                      onChange={(e) => setProductForm({ ...productForm, is_deal: e.target.checked })}
                      className="rounded text-accent focus:ring-accent"
                    />
                    <span>Hot Deal</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 font-semibold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-dark text-white font-bold shadow-lg cursor-pointer transition-colors"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: CATEGORY ADD / EDIT ── */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0e172a] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 dark:border-slate-800 text-gray-900 dark:text-slate-100">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              {editingItem ? 'Edit Category' : 'Create Category'}
            </h3>
            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 dark:text-slate-200 block mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g. Smartwatches"
                  className="w-full bg-slate-50 dark:bg-[#152238] border border-gray-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:border-accent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-slate-200 block mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={categoryForm.image}
                  onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 dark:bg-[#152238] border border-gray-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:border-accent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-slate-200 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#152238] border border-gray-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:border-accent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md cursor-pointer transition-colors"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: BRAND ADD / EDIT ── */}
      {brandModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0e172a] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 dark:border-slate-800 text-gray-900 dark:text-slate-100">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              {editingItem ? 'Edit Brand' : 'Create Brand'}
            </h3>
            <form onSubmit={handleSaveBrand} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 dark:text-slate-200 block mb-1">Brand Name</label>
                <input
                  type="text"
                  required
                  value={brandForm.name}
                  onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                  placeholder="e.g. Sony"
                  className="w-full bg-slate-50 dark:bg-[#152238] border border-gray-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:border-accent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-slate-200 block mb-1">Logo URL (SVG/PNG)</label>
                <input
                  type="url"
                  value={brandForm.logo}
                  onChange={(e) => setBrandForm({ ...brandForm, logo: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-slate-50 dark:bg-[#152238] border border-gray-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:border-accent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setBrandModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md cursor-pointer transition-colors"
                >
                  Save Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: BLOG ADD / EDIT ── */}
      {blogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0e172a] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-100 dark:border-slate-800 text-gray-900 dark:text-slate-100">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              {editingItem ? 'Edit Blog Article' : 'Publish New Article'}
            </h3>
            <form onSubmit={handleSaveBlog} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 dark:text-slate-200 block mb-1">Article Title</label>
                <input
                  type="text"
                  required
                  value={blogForm.title}
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                  placeholder="e.g. 5 Game-changing features of iOS 18"
                  className="w-full bg-slate-50 dark:bg-[#152238] border border-gray-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:border-accent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 dark:text-slate-200 block mb-1">Category</label>
                  <select
                    value={blogForm.category}
                    onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#152238] border border-gray-200 dark:border-slate-700 rounded-xl p-2.5 outline-none focus:border-accent text-gray-900 dark:text-white"
                  >
                    <option value="Tips" className="dark:bg-[#152238]">Tips</option>
                    <option value="Tech News" className="dark:bg-[#152238]">Tech News</option>
                    <option value="Guide" className="dark:bg-[#152238]">Guide</option>
                    <option value="Review" className="dark:bg-[#152238]">Review</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 dark:text-slate-200 block mb-1">Thumbnail URL</label>
                  <input
                    type="url"
                    required
                    value={blogForm.image}
                    onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-slate-50 dark:bg-[#152238] border border-gray-200 dark:border-slate-700 rounded-xl p-2.5 outline-none focus:border-accent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-slate-200 block mb-1">Excerpt</label>
                <textarea
                  rows={2}
                  value={blogForm.excerpt}
                  onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                  placeholder="Short summary preview..."
                  className="w-full bg-slate-50 dark:bg-[#152238] border border-gray-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:border-accent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-slate-200 block mb-1">Full Content</label>
                <textarea
                  rows={4}
                  required
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  placeholder="Write the full post here..."
                  className="w-full bg-slate-50 dark:bg-[#152238] border border-gray-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:border-accent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setBlogModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gray-900 dark:bg-accent hover:bg-gray-800 dark:hover:bg-accent-dark text-white font-bold rounded-xl shadow-md cursor-pointer transition-colors"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
