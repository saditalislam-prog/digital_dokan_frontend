import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';
import API from '../api/axios';
import { mockBlogPosts } from '../data/mockData';

const fallbackPosts = mockBlogPosts;

export default function Blog() {
  const [posts, setPosts] = useState(fallbackPosts);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get('/blog/')
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : (Array.isArray(res.data?.results) ? res.data.results : []);
        if (list.length > 0) {
          setPosts(list);
        }
      })
      .catch((err) => console.warn('Using fallback blog data:', err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', 'Tips', 'Tech News', 'Guide', 'Review'];
  const postList = Array.isArray(posts) && posts.length > 0 ? posts : fallbackPosts;
  const filteredPosts = selectedCategory === 'All'
    ? postList
    : postList.filter((p) => (p.category || '').toLowerCase() === selectedCategory.toLowerCase());

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
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-accent text-white shadow-md shadow-accent/25'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Post (Hero) */}
        {filteredPosts.length > 0 && (
          <Link
            to={`/blog/${filteredPosts[0].slug}`}
            className="group block bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-300"
          >
            <div className="grid md:grid-cols-12 gap-0">
              <div className="md:col-span-7 aspect-[16/10] md:aspect-auto overflow-hidden bg-gray-100">
                <img
                  src={filteredPosts[0].image}
                  alt={filteredPosts[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="md:col-span-5 p-8 sm:p-10 flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-black uppercase tracking-wider rounded-full">
                    {filteredPosts[0].category}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 group-hover:text-accent transition-colors leading-tight">
                    {filteredPosts[0].title}
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                    {filteredPosts[0].excerpt}
                  </p>
                </div>
                <div className="pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{filteredPosts[0].published_at || 'Nov 12, 2026'}</span>
                  </div>
                  <span className="text-accent font-bold group-hover:underline flex items-center gap-1">
                    Read Story <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Post Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {filteredPosts.slice(1).map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="aspect-video overflow-hidden bg-gray-100 relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[10px] font-black text-gray-900 px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {post.category}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{post.published_at || 'Nov 12, 2026'}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-accent">
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
