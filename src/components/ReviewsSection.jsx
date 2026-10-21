import { Star } from 'lucide-react';

const mockReviews = [
  {
    id: 1,
    name: 'James Carter',
    location: 'New York, USA',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    text: 'Amazing service! Got my iPhone 16 Pro on time and at the best price in the market. Highly recommended!',
  },
  {
    id: 2,
    name: 'Sarah Khan',
    location: 'London, UK',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    text: 'The product quality is 100% genuine and the customer support is super helpful. Digital Dokan is my go-to shop!',
  },
  {
    id: 3,
    name: 'David Wilson',
    location: 'Toronto, Canada',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    text: 'Very smooth buying experience. Fast delivery and original sealed accessories. Love their prompt responses!',
  },
];

export default function ReviewsSection() {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs uppercase font-semibold text-accent tracking-wider block mb-1">
              Customer Reviews
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              What Our Customers Say
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Real people. Real experiences.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {mockReviews.map((review) => (
            <div
              key={review.id}
              className="bg-surface rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed italic mb-6">
                  "{review.text}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-11 h-11 rounded-full object-cover border border-accent/20"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{review.name}</h4>
                  <p className="text-xs text-gray-400">{review.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

