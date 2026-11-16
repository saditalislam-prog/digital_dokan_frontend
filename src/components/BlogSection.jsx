import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';
import API from '../api/axios';
import { mockBlogPosts } from '../data/mockData';

const fallbackPosts = mockBlogPosts.slice(0, 3);

export default function BlogSection() {
  const [posts, setPosts] = useState(fallbackPosts);

  useEffect(() => {
    API.get('/blog/')
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : (Array.isArray(res.data?.results) ? res.data.results : []);
        if (list.length > 0) {
          setPosts(list.slice(0, 3));
        }
      })
      .catch((err) => {
        console.warn('Using fallback blog posts:', err);
      });
  }, []);

  const displayPosts = Array.isArray(posts) && posts.length > 0 ? posts : fallbackPosts;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-accent text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Tech Insights & News
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Latest from the Digital Dokan Blog
            </h2>
          </div>
          <Link
            to="/blog"
            className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
          >
            All Articles <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {displayPosts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group bg-surface rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-video overflow-hidden bg-gray-100">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[10px] font-extrabold text-gray-900 px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {post.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-2">
                    <Calendar className="w-3.5 h-3.5 text-accent" />
                    <span>{post.published_at || 'Nov 12, 2026'}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between text-xs font-semibold text-accent">
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
