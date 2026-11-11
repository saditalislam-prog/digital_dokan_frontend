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
        if (res.data && res.data.title) {
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
        const items = res.data.results || res.data || [];
        setRecentPosts(items.filter((p) => p.slug !== slug).slice(0, 3));
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
        <div className="h-64 bg-gray-200 rounded-3xl" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Article Not Found</h2>
        <p className="text-gray-500 text-sm">The article you are looking for does not exist or was moved.</p>
        <Link to="/blog" className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-white rounded-xl font-bold text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  // Helper to render content with markdown headings & paragraphs
  const renderFormattedContent = (content) => {
    if (!content) return null;
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-xl font-bold text-gray-900 mt-6 mb-2">
            {trimmed.replace('### ', '')}
          </h3>
        );
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-2xl font-extrabold text-gray-900 mt-8 mb-3">
            {trimmed.replace('## ', '')}
          </h2>
        );
      }
      if (trimmed.startsWith('1. ') || trimmed.startsWith('2. ') || trimmed.startsWith('3. ') || trimmed.startsWith('4. ') || trimmed.startsWith('5. ')) {
        return (
          <li key={idx} className="text-gray-700 text-sm sm:text-base leading-relaxed ml-4 my-2 list-decimal">
            {trimmed.replace(/^[0-9]+\.\s*/, '')}
          </li>
        );
      }
      if (trimmed === '') {
        return <div key={idx} className="h-3" />;
      }
      return (
        <p key={idx} className="text-gray-700 text-sm sm:text-base leading-relaxed my-2">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="bg-surface min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation / Back link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs font-bold text-accent hover:text-accent-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog & Insights
        </Link>

        {/* Article Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-accent text-white text-xs font-bold shadow-sm">
              {post.category || 'Tech Article'}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(post.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3.5 h-3.5" />
              <span>4 min read</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-medium">
              {post.excerpt}
            </p>
          )}
        </div>

        {/* Big Featured Image */}
        <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-xl border border-gray-100 bg-gray-50">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80';
            }}
          />
        </div>

        {/* Article Body */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm">
          <div className="prose prose-blue max-w-none">
            {renderFormattedContent(post.content || post.excerpt)}
          </div>
        </div>

        {/* Related Articles */}
        {recentPosts.length > 0 && (
          <div className="pt-8 space-y-6 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900">More Tech Articles</h3>
            <div className="grid sm:grid-cols-3 gap-6">
              {recentPosts.map((r) => (
                <Link
                  key={r.id}
                  to={`/blog/${r.slug}`}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all flex flex-col group"
                >
                  <div className="aspect-video overflow-hidden bg-gray-50">
                    <img
                      src={r.image}
                      alt={r.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <span className="text-[10px] font-bold text-accent uppercase tracking-wider">{r.category}</span>
                    <h4 className="font-bold text-gray-900 text-xs line-clamp-2 group-hover:text-accent transition-colors">
                      {r.title}
                    </h4>
                    <span className="text-[11px] font-semibold text-accent inline-flex items-center gap-1 pt-1">
                      Read <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

