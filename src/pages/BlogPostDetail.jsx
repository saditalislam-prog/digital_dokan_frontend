import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, Tag, Share2, ArrowRight } from 'lucide-react';
import API from '../api/axios';
import { mockBlogPosts } from '../data/mockData';

export default function BlogPostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    API.get(`/blog/${slug}/`)
      .then((res) => {
        if (res.data && res.data.title && typeof res.data === 'object') {
          setPost(res.data);
        } else {
          loadFallback();
        }
      })
      .catch(() => {
        loadFallback();
      })
      .finally(() => setLoading(false));

    function loadFallback() {
      const found = mockBlogPosts.find((p) => p.slug === slug);
      if (found) setPost(found);
    }

    // Fetch related/recent articles
    API.get('/blog/')
      .then((res) => {
        const items = Array.isArray(res.data)
          ? res.data
          : (Array.isArray(res.data?.results) ? res.data.results : []);
        if (items.length > 0) {
          setRecentPosts(items.filter((p) => p.slug !== slug).slice(0, 3));
        } else {
          setRecentPosts(mockBlogPosts.filter((p) => p.slug !== slug).slice(0, 3));
        }
      })
      .catch(() => {
        setRecentPosts(mockBlogPosts.filter((p) => p.slug !== slug).slice(0, 3));
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-6 bg-gray-200 rounded w-1/4" />
        <div className="h-10 bg-gray-200 rounded w-3/4" />
        <div className="h-80 bg-gray-200 rounded-3xl" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/6" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h2>
        <p className="text-sm text-gray-500 mb-6">The post you are looking for does not exist or has been removed.</p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-xl font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="bg-surface min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation & Category */}
        <div className="flex items-center justify-between">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Articles
          </Link>
          <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-black uppercase tracking-wider rounded-full">
            {post.category}
          </span>
        </div>

        {/* Title & Metadata */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 pt-2 border-b border-gray-100 pb-6">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-accent" />
              <span>{post.published_at || 'Nov 12, 2026'}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-accent" />
              <span>4 min read</span>
            </div>
            <span>•</span>
            <span className="text-gray-500 font-semibold">Author: Digital Dokan Tech Desk</span>
          </div>
        </div>

        {/* Hero Image */}
        <div className="aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl bg-gray-100 border border-gray-100">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Excerpt Lead */}
        {post.excerpt && (
          <div className="bg-white rounded-2xl p-6 border-l-4 border-accent shadow-sm">
            <p className="text-base sm:text-lg font-medium text-gray-700 italic leading-relaxed">
              "{post.excerpt}"
            </p>
          </div>
        )}

        {/* Body Content */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100 space-y-6 text-gray-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
          {post.content}
        </div>

        {/* Share & Tags */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
            <Tag className="w-4 h-4 text-accent" />
            <span>Tags:</span>
            <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg">#Gadgets</span>
            <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg">#TechReview</span>
            <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg">#SmartLife</span>
          </div>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: post.title, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Article link copied to clipboard!');
              }
            }}
            className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 bg-slate-100 hover:bg-slate-200 text-gray-800 rounded-xl transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" /> Share Article
          </button>
        </div>

        {/* Recent / Related Articles */}
        {recentPosts.length > 0 && (
          <div className="pt-8 space-y-6">
            <h3 className="text-xl font-bold text-gray-900">More Tech Stories</h3>
            <div className="grid sm:grid-cols-3 gap-5">
              {recentPosts.map((p) => (
                <Link
                  key={p.id}
                  to={`/blog/${p.slug}`}
                  className="group bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <img
                    src={p.image}
                    alt=""
                    className="w-full h-32 object-cover rounded-xl bg-gray-50 mb-3"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-accent uppercase tracking-wider">{p.category}</span>
                    <h4 className="font-bold text-gray-900 text-xs mt-1 line-clamp-2 group-hover:text-accent transition-colors">
                      {p.title}
                    </h4>
                  </div>
                  <span className="text-[11px] font-semibold text-accent mt-3 flex items-center gap-1">
                    Read <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
