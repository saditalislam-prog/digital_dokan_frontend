import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';
import API from '../api/axios';
import { mockBlogPosts } from '../data/mockData';

const fallbackPosts = mockBlogPosts;

export default function Blog() {
  const [posts, setPosts] = useState(fallbackPosts);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/blog/')
      .then((res) => {
        const data = res.data.results || res.data;
        if (data && data.length > 0) {
          setPosts(data);
        }
      })
      .catch((err) => console.warn('Using fallback blog data:', err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', 'Tips', 'Tech News', 'Guide', 'Review'];
  const filteredPosts = selectedCategory === 'All'
    ? posts
    : posts.filter((p) => (p.category || '').toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="bg-surface min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div>
          <span className="text-accent text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Sparkles className="w-4 h-4" /> Editorial & Tech Insights
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Digital Dokan Blog & Insights
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Tips, reviews, buying guides and the latest news in consumer tech
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-accent text-white shadow-md shadow-accent/25'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Posts Grid: Exactly 3 columns */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
                <div className="aspect-[16/10] bg-gray-100" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                  <div className="h-6 bg-gray-100 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group hover:-translate-y-1"
              >
                {/* Thumbnail Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80';
                    }}
                  />
                  {post.category && (
                    <span className="absolute top-4 left-4 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      {post.category}
                    </span>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(post.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <h2 className="font-extrabold text-gray-900 text-base sm:text-lg group-hover:text-accent transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed line-clamp-2">
                      {post.excerpt || post.content}
                    </p>
                  </div>

                  <div className="pt-2 text-xs font-bold text-accent flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read Full Story <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
