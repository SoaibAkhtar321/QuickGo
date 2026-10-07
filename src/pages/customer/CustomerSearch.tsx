import React, { useState, useMemo } from 'react';
import { useApp } from '../../store/AppContext';
import { ProductCard } from '../../components/commerce/ProductCard';
import { Product, Business } from '../../types';
import {
  Search,
  X,
  History,
  TrendingUp,
  Store,
  Package,
  ArrowRight,
  Filter,
  SlidersHorizontal,
  Zap,
} from 'lucide-react';

interface CustomerSearchProps {
  onBack: () => void;
  onOpenProductDetail: (product: Product) => void;
  onSelectService?: (serviceId: string) => void;
  onSelectCategory?: (categoryId: string) => void;
}

export const CustomerSearch: React.FC<CustomerSearchProps> = ({
  onBack,
  onOpenProductDetail,
  onSelectService,
  onSelectCategory,
}) => {
  const {
    products,
    categories,
    businesses,
    services,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc' | 'fastest' | 'rating'>('relevance');

  const popularSearches = [
    'Milk',
    'Maggi',
    'Bananas',
    'Chips',
    'Bread',
    'Coca Cola',
    'Atta',
    'Croissant',
    'Courier',
    'Medicine',
  ];

  const handleSearchSubmit = (searchVal: string) => {
    setQuery(searchVal);
    addRecentSearch(searchVal);
  };

  // Filtered Products
  const matchingProducts = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase().trim();
    return products
      .filter((p) => {
        const matchesQuery =
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)));

        const matchesCat =
          selectedCategoryFilter === 'all' || p.categoryId === selectedCategoryFilter;

        return matchesQuery && matchesCat;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'fastest') return (a.estimatedDeliveryMinutes || 12) - (b.estimatedDeliveryMinutes || 12);
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // relevance
      });
  }, [query, products, selectedCategoryFilter, sortBy]);

  // Filtered Stores / Businesses
  const matchingBusinesses = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return businesses.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.ownerName.toLowerCase().includes(q)
    );
  }, [query, businesses]);

  // Filtered Courier Services
  const matchingServices = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return services.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q)
    );
  }, [query, services]);

  return (
    <div className="space-y-5 text-left max-w-7xl mx-auto">
      {/* Top Search Bar */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-3xl border border-neutral-200/90 shadow-sm flex items-center gap-3">
        <div className="relative flex-1">
          <input
            id="instant-search-input"
            type="text"
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearchSubmit(query);
            }}
            placeholder="Search for 'milk', 'chips', 'courier', 'atta', 'bread'..."
            className="w-full bg-neutral-100 hover:bg-neutral-150 focus:bg-white border border-neutral-200 focus:border-red-500 rounded-2xl py-3 pl-11 pr-10 text-xs sm:text-sm font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none transition-all"
          />
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />

          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={onBack}
          className="text-xs sm:text-sm font-bold text-neutral-600 hover:text-neutral-900 px-3 py-2 rounded-xl hover:bg-neutral-100 transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* When NO query typed: Show Recent Searches & Popular Suggestions */}
      {!query.trim() && (
        <div className="space-y-6 animate-in fade-in">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-neutral-500 tracking-wider flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-red-600" />
                  <span>Recent Searches</span>
                </span>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs font-bold text-neutral-400 hover:text-neutral-700"
                >
                  Clear All
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSearchSubmit(term)}
                    className="px-3.5 py-1.5 rounded-xl bg-neutral-100 hover:bg-red-50 text-xs font-semibold text-neutral-800 hover:text-red-600 transition-all flex items-center gap-1.5 active:scale-95 border border-neutral-200/60"
                  >
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Trending Searches */}
          <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs space-y-3">
            <span className="text-xs font-black uppercase text-neutral-500 tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-red-600" />
              <span>Trending in Noida</span>
            </span>

            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => handleSearchSubmit(term)}
                  className="px-3.5 py-1.5 rounded-xl bg-neutral-50 hover:bg-red-50 text-xs font-bold text-neutral-800 hover:text-red-600 transition-all border border-neutral-200 hover:border-red-300 active:scale-95"
                >
                  🔍 {term}
                </button>
              ))}
            </div>
          </div>

          {/* Top Categories Explorer */}
          <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs space-y-3">
            <span className="text-xs font-black uppercase text-neutral-500 tracking-wider">
              Browse Top Categories
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {categories.slice(0, 12).map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => {
                    if (onSelectCategory) onSelectCategory(cat.id);
                  }}
                  className="p-3 rounded-2xl bg-neutral-50 hover:bg-red-50 border border-neutral-100 hover:border-red-200 transition-all cursor-pointer text-center group"
                >
                  <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </div>
                  <span className="text-xs font-bold text-neutral-800 group-hover:text-red-600 line-clamp-1">
                    {cat.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* When QUERY IS TYPED: Show Live Results */}
      {query.trim() && (
        <div className="space-y-6">
          {/* Filters & Sorting Bar */}
          <div className="bg-white rounded-2xl p-3 border border-neutral-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            {/* Category filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <button
                onClick={() => setSelectedCategoryFilter('all')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedCategoryFilter === 'all'
                    ? 'bg-red-600 text-white shadow-2xs'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                All Results ({matchingProducts.length})
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategoryFilter(c.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    selectedCategoryFilter === c.id
                      ? 'bg-red-600 text-white shadow-2xs'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {c.icon} {c.name}
                </button>
              ))}
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2 shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-neutral-100 border border-neutral-200 rounded-xl px-2.5 py-1 text-xs font-bold text-neutral-800 focus:outline-none"
              >
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="fastest">Fastest Delivery (10 min)</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Results: Courier Services (if matching) */}
          {matchingServices.length > 0 && (
            <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm">📦</span>
                <h3 className="text-sm font-black text-neutral-900">
                  Express On-Demand Courier Services
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {matchingServices.map((srv) => (
                  <div
                    key={srv.id}
                    onClick={() => {
                      if (onSelectService) onSelectService(srv.id);
                    }}
                    className="p-3 rounded-2xl bg-neutral-50 hover:bg-red-50/60 border border-neutral-200/80 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{srv.icon}</span>
                      <div>
                        <h4 className="text-xs font-bold text-neutral-900 group-hover:text-red-600">
                          {srv.name}
                        </h4>
                        <p className="text-[11px] text-neutral-500 line-clamp-1">{srv.tagline}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results: Stores / Merchants (if matching) */}
          {matchingBusinesses.length > 0 && (
            <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-red-600" />
                <h3 className="text-sm font-black text-neutral-900">
                  Nearby Stores & Outlets
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {matchingBusinesses.map((biz) => (
                  <div
                    key={biz.id}
                    className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-center gap-3"
                  >
                    <img
                      src={biz.avatar}
                      alt={biz.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900">{biz.name}</h4>
                      <p className="text-[10px] text-neutral-500">{biz.category} • ⭐ {biz.rating}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results: Products Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-neutral-900">
                Products ({matchingProducts.length})
              </h3>
              <span className="text-xs text-neutral-500 font-medium">
                Showing items available in 10-15 mins
              </span>
            </div>

            {matchingProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 border border-neutral-200 text-center space-y-3">
                <span className="text-4xl block">🔍</span>
                <h4 className="text-base font-black text-neutral-800">
                  No products found for "{query}"
                </h4>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Try checking your spelling, searching for a broader keyword (e.g. "milk", "biscuit"), or explore our top categories.
                </p>
                <button
                  onClick={() => setQuery('')}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {matchingProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onOpenDetail={onOpenProductDetail}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
