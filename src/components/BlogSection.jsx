import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import API from '../api/axios';

const fallbackPosts = [
  {
    id: 1,
    title: 'How to Choose the Right Smartphone for Your Needs',
    slug: 'how-to-choose-smartphone',
    category: 'Tips',
    created_at: '2024-10-15',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=80',
    excerpt: 'Comprehensive buyer guide on specs, battery life, cameras and value for money.'
  },
  {
    id: 2,
    title: 'Top 5 Upcoming Flagship Smartphones in 2025',
    slug: 'top-5-upcoming-smartphones',
    category: 'Tech News',
    created_at: '2024-10-12',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80',
    excerpt: 'Sneak peek into upcoming foldable devices, AI chipsets and revolutionary displays.'
  },
  {
    id: 3,
    title: 'Must-Have Accessories for Your New Phone',
    slug: 'must-have-accessories',
    category: 'Guide',
    created_at: '2024-10-08',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80',
    excerpt: 'The best GaN chargers, wireless earbuds, protective cases, and magsafe accessories.'
  },
];

export default function BlogSection() {
  const [posts, setPosts] = useState(fallbackPosts);

  useEffect(() => {
    API.get('/blog/')
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setPosts(res.data.slice(0, 3));
        }
      })
      .catch((err) => {
        console.warn('Using fallback blog posts:', err);
      });
  }, []);

  return (
    <section className="py-14 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Latest News & Tips
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Stay updated with tech releases, tips and industry insights
            </p>
          </div>
          <Link
            to="/blog"
            className="text-sm font-semibold text-accent hover:underline flex items-center gap-1"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col group hover:-translate-y-1"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                <img
                  src={post.image || 'https://via.placeholder.com/400x250/0f1b3d/ffffff?text=Tech+News'}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x250/0f1b3d/ffffff?text=News';
                  }}
                />
                {post.category && (
                  <span className="absolute top-3 left-3 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {post.category}
                  </span>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(post.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base group-hover:text-accent transition-colors line-clamp-2 mb-2">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                </div>

                <div className="pt-4 mt-2 flex items-center gap-1 text-xs font-semibold text-accent group-hover:translate-x-1 transition-transform">
                  Read Article <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

