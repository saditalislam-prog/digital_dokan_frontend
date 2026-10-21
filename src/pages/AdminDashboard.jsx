import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, Package, Layers, Award, FileText, Star,
  Plus, Edit2, Trash2, Search, ArrowLeft, LogOut, CheckCircle,
  X, AlertTriangle, RefreshCw
} from 'lucide-react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [reviews, setReviews] = useState([]);
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

  // Load data
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, prodRes, catRes, brandRes, blogRes, revRes] = await Promise.all([
        API.get('/admin/stats/').catch(() => ({ data: {} })),
        API.get('/products/'),
        API.get('/categories/'),
        API.get('/brands/'),
        API.get('/blog/'),
        API.get('/reviews/').catch(() => ({ data: [] }))
      ]);

      setStats(statsRes.data);
      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
      setBrands(brandRes.data || []);
      setBlogs(blogRes.data || []);
      setReviews(revRes.data || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && (user.is_staff || user.is_superuser)) {
      loadAllData();
    }
  }, [user]);

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
        category: parseInt(productForm.category),
        brand: parseInt(productForm.brand),
        price: parseFloat(productForm.price),
        old_price: productForm.old_price ? parseFloat(productForm.old_price) : null,
      };

      if (editingItem) {
        await API.patch(`/products/${editingItem.id}/update/`, payload);
        showToast('Product updated successfully!');
      } else {
        await API.post('/products/create/', payload);
        showToast('New product added successfully!');
      }
      setProductModalOpen(false);
      loadAllData();
    } catch (err) {
      console.error('Save product error:', err);
      alert('Error saving product. Please check required fields.');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await API.delete(`/products/${id}/delete/`);
      showToast('Product deleted!');
      loadAllData();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete product.');
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
        await API.patch(`/categories/${editingItem.id}/update/`, payload);
        showToast('Category updated!');
      } else {
        await API.post('/categories/create/', payload);
        showToast('New category created!');
      }
      setCategoryModalOpen(false);
      loadAllData();
    } catch (err) {
      console.error(err);
      alert('Failed to save category');
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"? This may affect associated products.`)) return;
    try {
      await API.delete(`/categories/${id}/delete/`);
      showToast('Category deleted');
      loadAllData();
    } catch (err) {
      alert('Failed to delete category');
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
        await API.patch(`/brands/${editingItem.id}/update/`, payload);
        showToast('Brand updated!');
      } else {
        await API.post('/brands/create/', payload);
        showToast('New brand created!');
      }
      setBrandModalOpen(false);
      loadAllData();
    } catch (err) {
      alert('Failed to save brand');
    }
  };

  const handleDeleteBrand = async (id, name) => {
    if (!window.confirm(`Delete brand "${name}"?`)) return;
    try {
      await API.delete(`/brands/${id}/delete/`);
      showToast('Brand deleted');
      loadAllData();
    } catch (err) {
      alert('Failed to delete brand');
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
        await API.patch(`/blog/${editingItem.id}/update/`, payload);
        showToast('Blog article updated!');
      } else {
        await API.post('/blog/create/', payload);
        showToast('Article published!');
      }
      setBlogModalOpen(false);
      loadAllData();
    } catch (err) {
      alert('Failed to save article');
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Delete this article?')) return;
    try {
      await API.delete(`/blog/${id}/delete/`);
      showToast('Article deleted');
      loadAllData();
    } catch (err) {
      alert('Failed to delete blog');
    }
  };

  // ── Review Delete ────────────────────────────────
  const handleDeleteReview = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await API.delete(`/reviews/${id}/delete/`);
      showToast('Review deleted');
      loadAllData();
    } catch (err) {
      alert('Failed to delete review');
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.category?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.brand?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-5 h-5" />
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="bg-primary-dark text-white border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
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

        <div className="flex items-center gap-4">
          <button
            onClick={loadAllData}
            className="p-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            to="/"
            className="text-xs font-semibold text-gray-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/20 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
          </Link>

          <button
            onClick={() => {
              logout();
              navigate('/admin-login');
            }}
            className="text-xs font-semibold text-red-300 hover:text-red-100 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Tabs */}
        <aside className="w-full md:w-64 bg-white border-r border-gray-200 p-4 space-y-1.5 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === 'overview' ? 'bg-accent text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === 'products' ? 'bg-accent text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4" />
              <span>Products</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'products' ? 'bg-white/20' : 'bg-gray-100'}`}>
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === 'categories' ? 'bg-accent text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <Layers className="w-4 h-4" />
              <span>Categories</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'categories' ? 'bg-white/20' : 'bg-gray-100'}`}>
              {categories.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('brands')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === 'brands' ? 'bg-accent text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <Award className="w-4 h-4" />
              <span>Brands</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'brands' ? 'bg-white/20' : 'bg-gray-100'}`}>
              {brands.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('blogs')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === 'blogs' ? 'bg-accent text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4" />
              <span>Blog & Articles</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'blogs' ? 'bg-white/20' : 'bg-gray-100'}`}>
              {blogs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === 'reviews' ? 'bg-accent text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <Star className="w-4 h-4" />
              <span>Customer Reviews</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'reviews' ? 'bg-white/20' : 'bg-gray-100'}`}>
              {reviews.length}
            </span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {/* ── TAB 1: OVERVIEW ── */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">System Overview</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Live inventory metrics, active catalogue and store statistics.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-accent flex items-center justify-center font-bold">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-semibold block">Total Products</span>
                    <span className="text-2xl font-black text-gray-900">{stats?.total_products || products.length}</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-semibold block">Categories</span>
                    <span className="text-2xl font-black text-gray-900">{stats?.total_categories || categories.length}</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-semibold block">Active Brands</span>
                    <span className="text-2xl font-black text-gray-900">{stats?.total_brands || brands.length}</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <Star className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-semibold block">Total Reviews</span>
                    <span className="text-2xl font-black text-gray-900">{stats?.total_reviews || reviews.length}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="font-bold text-gray-900 text-sm">Quick Add Shortcuts</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={openAddProduct}
                    className="flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-dark text-white rounded-xl text-xs font-bold transition-colors shadow-md"
                  >
                    <Plus className="w-4 h-4" /> Add Product
                  </button>
                  <button
                    onClick={openAddCategory}
                    className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors shadow-md"
                  >
                    <Plus className="w-4 h-4" /> Add Category
                  </button>
                  <button
                    onClick={openAddBrand}
                    className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors shadow-md"
                  >
                    <Plus className="w-4 h-4" /> Add Brand
                  </button>
                  <button
                    onClick={openAddBlog}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-colors shadow-md"
                  >
                    <Plus className="w-4 h-4" /> Publish Blog Post
                  </button>
                </div>
              </div>

              {/* Recent Products Snapshot */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 text-base">Recent Inventory Items</h3>
                  <button onClick={() => setActiveTab('products')} className="text-xs font-semibold text-accent hover:underline">
                    View All Products →
                  </button>
                </div>
                <div className="divide-y divide-gray-100">
                  {products.slice(0, 5).map((p) => (
                    <div key={p.id} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt="" className="w-10 h-10 object-cover rounded-lg bg-gray-50 border" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                          <span className="text-[11px] text-gray-400">{p.brand?.name || ''} · {p.category?.name || ''}</span>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900 text-sm">${p.price}</span>
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
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Products Management</h2>
                  <p className="text-xs text-gray-500 mt-1">Add, update prices, manage stock, and delete items.</p>
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
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by product name, category, or brand..."
                  className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs outline-none focus:border-accent"
                />
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-600 uppercase tracking-wider font-semibold border-b border-gray-200">
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
                    <tbody className="divide-y divide-gray-100">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image}
                                alt=""
                                className="w-12 h-12 object-cover rounded-xl bg-gray-50 border shrink-0"
                              />
                              <div className="max-w-[200px]">
                                <span className="font-bold text-gray-900 block truncate">{p.name}</span>
                                <span className="text-[10px] text-gray-400">{p.slug}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-gray-700 font-medium">{p.category?.name || '—'}</td>
                          <td className="p-4 text-gray-700 font-medium">{p.brand?.name || '—'}</td>
                          <td className="p-4">
                            <span className="font-extrabold text-gray-900">${p.price}</span>
                            {p.old_price && (
                              <span className="text-gray-400 line-through block text-[10px]">${p.old_price}</span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className={`font-semibold ${p.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                              {p.stock} in stock
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {p.is_new && <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-bold">New</span>}
                              {p.is_bestseller && <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-bold">Bestseller</span>}
                              {p.is_featured && <span className="bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded text-[10px] font-bold">Featured</span>}
                              {p.is_deal && <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[10px] font-bold">Deal</span>}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openEditProduct(p)}
                                className="p-1.5 text-gray-500 hover:text-accent hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Categories</h2>
                  <p className="text-xs text-gray-500 mt-1">Manage shop product categories.</p>
                </div>
                <button
                  onClick={openAddCategory}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Category
                </button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {categories.map((c) => (
                  <div key={c.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-start gap-4">
                    <img src={c.image} alt="" className="w-16 h-16 object-cover rounded-xl bg-gray-50 border shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-sm">{c.name}</h4>
                      <span className="text-[10px] text-gray-400 block mb-2">{c.slug}</span>
                      <p className="text-xs text-gray-500 line-clamp-2">{c.description || 'No description'}</p>
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => openEditCategory(c)}
                          className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(c.id, c.name)}
                          className="text-xs font-semibold text-red-500 hover:underline flex items-center gap-1 ml-auto"
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
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Brands</h2>
                  <p className="text-xs text-gray-500 mt-1">Manage device manufacturers and brands.</p>
                </div>
                <button
                  onClick={openAddBrand}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Brand
                </button>
              </div>

              <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {brands.map((b) => (
                  <div key={b.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-center h-14 mb-3">
                      {b.logo ? (
                        <img src={b.logo} alt={b.name} className="max-h-8 max-w-[100px] object-contain" />
                      ) : (
                        <span className="font-bold text-gray-700 text-base">{b.name}</span>
                      )}
                    </div>
                    <div className="text-center pt-2 border-t border-gray-100 flex items-center justify-between">
                      <span className="font-semibold text-xs text-gray-900">{b.name}</span>
                      <div className="flex gap-1.5">
                        <button onClick={() => openEditBrand(b)} className="p-1 text-gray-400 hover:text-accent">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteBrand(b.id, b.name)} className="p-1 text-gray-400 hover:text-red-500">
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
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Blog Articles</h2>
                  <p className="text-xs text-gray-500 mt-1">Publish news, buying guides and gadget tips.</p>
                </div>
                <button
                  onClick={openAddBlog}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
                >
                  <Plus className="w-4 h-4" /> New Article
                </button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((article) => (
                  <div key={article.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col">
                    <img src={article.image} alt="" className="w-full h-40 object-cover bg-gray-50" />
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-[10px] font-bold text-accent uppercase tracking-wider">{article.category}</span>
                        <h4 className="font-bold text-gray-900 text-sm mt-1 line-clamp-2">{article.title}</h4>
                        <p className="text-xs text-gray-500 mt-2 line-clamp-2">{article.excerpt || article.content}</p>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
                        <button onClick={() => openEditBlog(article)} className="text-accent font-semibold hover:underline flex items-center gap-1">
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button onClick={() => handleDeleteBlog(article.id)} className="text-red-500 font-semibold hover:underline flex items-center gap-1">
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
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Customer Reviews Moderation</h2>
                <p className="text-xs text-gray-500 mt-1">View submitted feedback and remove invalid entries.</p>
              </div>

              <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-600 uppercase tracking-wider font-semibold border-b">
                    <tr>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Product</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4">Feedback</th>
                      <th className="p-4 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {reviews.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/80">
                        <td className="p-4 font-bold text-gray-900">{r.user || 'Verified Customer'}</td>
                        <td className="p-4 text-gray-600 font-medium">{r.product}</td>
                        <td className="p-4 text-amber-500 font-bold">★ {r.rating}/5</td>
                        <td className="p-4 text-gray-600 max-w-xs truncate">{r.comment}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteReview(r.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded"
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
        </main>
      </div>

      {/* ── MODAL: PRODUCT ADD / EDIT ── */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {editingItem ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setProductModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. iPhone 16 Pro Max 256GB"
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-accent text-sm"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-accent"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Brand</label>
                  <select
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-accent"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="999.00"
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Old Price ($ - optional)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.old_price}
                    onChange={(e) => setProductForm({ ...productForm, old_price: e.target.value })}
                    placeholder="1099.00"
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Image URL (High-Res CDN or Unsplash)</label>
                <input
                  type="url"
                  required
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Device specifications, warranty, and overview..."
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-accent"
                />
              </div>

              {/* Badges / Flags */}
              <div className="pt-2 border-t border-gray-100">
                <span className="font-bold text-gray-700 block mb-2">Display Badges / Sections:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.is_new}
                      onChange={(e) => setProductForm({ ...productForm, is_new: e.target.checked })}
                      className="rounded text-accent focus:ring-accent"
                    />
                    <span>Latest Arrival</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.is_bestseller}
                      onChange={(e) => setProductForm({ ...productForm, is_bestseller: e.target.checked })}
                      className="rounded text-accent focus:ring-accent"
                    />
                    <span>Best Seller</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.is_featured}
                      onChange={(e) => setProductForm({ ...productForm, is_featured: e.target.checked })}
                      className="rounded text-accent focus:ring-accent"
                    />
                    <span>Featured</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
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
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-dark text-white font-bold shadow-lg"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingItem ? 'Edit Category' : 'Create Category'}
            </h3>
            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g. Smartwatches"
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-accent text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={categoryForm.image}
                  onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-accent"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 text-white font-bold rounded-xl"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingItem ? 'Edit Brand' : 'Create Brand'}
            </h3>
            <form onSubmit={handleSaveBrand} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Brand Name</label>
                <input
                  type="text"
                  required
                  value={brandForm.name}
                  onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                  placeholder="e.g. Sony"
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-accent text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Logo URL (SVG/PNG)</label>
                <input
                  type="url"
                  value={brandForm.logo}
                  onChange={(e) => setBrandForm({ ...brandForm, logo: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-accent"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setBrandModalOpen(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 text-white font-bold rounded-xl"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingItem ? 'Edit Blog Article' : 'Publish New Article'}
            </h3>
            <form onSubmit={handleSaveBlog} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Article Title</label>
                <input
                  type="text"
                  required
                  value={blogForm.title}
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                  placeholder="e.g. 5 Game-changing features of iOS 18"
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-accent text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Category</label>
                  <select
                    value={blogForm.category}
                    onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 outline-none focus:border-accent"
                  >
                    <option value="Tips">Tips</option>
                    <option value="Tech News">Tech News</option>
                    <option value="Guide">Guide</option>
                    <option value="Review">Review</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Thumbnail URL</label>
                  <input
                    type="url"
                    required
                    value={blogForm.image}
                    onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Excerpt</label>
                <textarea
                  rows={2}
                  value={blogForm.excerpt}
                  onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                  placeholder="Short summary preview..."
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Full Content</label>
                <textarea
                  rows={4}
                  required
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  placeholder="Write the full post here..."
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-accent"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setBlogModalOpen(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gray-900 text-white font-bold rounded-xl"
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

