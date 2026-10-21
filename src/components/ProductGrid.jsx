import ProductCard from './ProductCard';

export default function ProductGrid({ products = [], columns = 4, loading = false }) {
  if (loading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-6`}>
        {Array.from({ length: columns * 2 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="w-full aspect-square skeleton" />
            <div className="p-4 space-y-3">
              <div className="h-4 skeleton rounded w-3/4" />
              <div className="h-3 skeleton rounded w-1/2" />
              <div className="h-5 skeleton rounded w-1/3" />
              <div className="h-10 skeleton rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-500">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  const colClass = columns === 3
    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  return (
    <div className={`grid ${colClass} gap-6`}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
