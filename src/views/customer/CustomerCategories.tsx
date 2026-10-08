import React, { useState, useMemo } from 'react';
import { useApp } from '../../store/AppContext';
import { ProductCard } from '../../components/commerce/ProductCard';
import { Category, Product } from '../../types';
import {
  SlidersHorizontal,
  ChevronRight,
  Filter,
  Zap,
  Sparkles,
  Check,
  Search,
} from 'lucide-react';

interface CustomerCategoriesProps {
  initialCategoryId?: string;
  onOpenProductDetail: (product: Product) => void;
  onSelectCategory?: (categoryId: string) => void;
}

export const CustomerCategories: React.FC<CustomerCategoriesProps> = ({
  initialCategoryId,
  onOpenProductDetail,
}) => {
  const { categories, products } = useApp();

  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    initialCategoryId || categories[0]?.id || 'dairy-breakfast'
  );
  const [activeSubcategoryId, setActiveSubcategoryId] = useState<string>('all');
  const [vegOnly, setVegOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');
  const [searchInCat, setSearchInCat] = useState<string>('');

  const currentCategory = useMemo(() => {
    return categories.find((c) => c.id === activeCategoryId) || categories[0];
  }, [categories, activeCategoryId]);

  // Filtered Products
  const categoryProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = p.categoryId === activeCategoryId;
        const matchesSubcategory =
          activeSubcategoryId === 'all' || p.subcategoryId === activeSubcategoryId;
        const matchesVeg = vegOnly ? p.isVeg === true : true;
        const matchesSearch =
          !searchInCat.trim() ||
          p.name.toLowerCase().includes(searchInCat.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchInCat.toLowerCase());

        return matchesCategory && matchesSubcategory && matchesVeg && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return b.reviewCount - a.reviewCount; // popular
      });
  }, [products, activeCategoryId, activeSubcategoryId, vegOnly, sortBy, searchInCat]);

  return (
    <div className="space-y-4 text-left max-w-7xl mx-auto">
      {/* Mobile Horizontal Category Rail */}
      <div className="md:hidden overflow-x-auto no-scrollbar -mx-4 px-4 py-1 flex items-center gap-2 border-b border-neutral-200/80 bg-white sticky top-16 z-20">
        {categories.map((cat) => {
          const isActive = cat.id === activeCategoryId;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategoryId(cat.id);
                setActiveSubcategoryId('all');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                isActive
                  ? 'bg-red-600 text-white shadow-2xs'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span className="whitespace-nowrap">{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Desktop Left Sidebar + Right Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        {/* Desktop Left Sidebar (3 cols on md/lg) */}
        <aside className="hidden md:flex md:col-span-3 lg:col-span-3 flex-col bg-white rounded-3xl border border-neutral-200 shadow-xs p-3.5 space-y-2 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
          <div className="px-3 py-2 border-b border-neutral-100 flex items-center justify-between">
            <span className="text-xs font-black uppercase text-neutral-400 tracking-wider">
              All Categories
            </span>
            <span className="text-xs text-neutral-400 font-bold">{categories.length}</span>
          </div>

          <nav className="space-y-1">
            {categories.map((cat) => {
              const isActive = cat.id === activeCategoryId;
              const prodCount = products.filter((p) => p.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategoryId(cat.id);
                    setActiveSubcategoryId('all');
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-xs font-bold transition-all text-left ${
                    isActive
                      ? 'bg-red-50 text-red-600 shadow-2xs font-extrabold'
                      : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-lg shrink-0">{cat.icon}</span>
                    <span className="truncate">{cat.name}</span>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                      isActive ? 'bg-red-600 text-white' : 'bg-neutral-100 text-neutral-500'
                    }`}
                  >
                    {prodCount}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Right Column: Category Header Banner + Filters + 2/4-Col Product Grid */}
        <main className="md:col-span-9 lg:col-span-9 space-y-4">
          {/* Category Banner Card */}
          <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 rounded-3xl p-5 sm:p-6 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
            <div className="relative z-10 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentCategory.icon}</span>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {currentCategory.name}
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-lg">
                {currentCategory.tagline || 'Guaranteed fresh and delivered to your doorstep in 10-15 minutes.'}
              </p>
              <div className="flex items-center gap-2 text-xs text-green-400 font-bold pt-1">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Express 12-min dispatch available in Sector 62</span>
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-300 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs border border-white/15">
                {categoryProducts.length} Items Available
              </span>
            </div>

            {/* Ambient glow */}
            <div className="absolute right-0 top-0 -mr-16 -mt-16 w-60 h-60 rounded-full bg-red-600/20 blur-3xl pointer-events-none" />
          </div>

          {/* Subcategories Pills & Filters Bar */}
          <div className="bg-white rounded-2xl p-3 border border-neutral-200/90 shadow-2xs space-y-3">
            {/* Subcategories Horizontal Selector */}
            {currentCategory.subcategories && currentCategory.subcategories.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                <button
                  onClick={() => setActiveSubcategoryId('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    activeSubcategoryId === 'all'
                      ? 'bg-neutral-900 text-white shadow-2xs'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  All ({products.filter((p) => p.categoryId === activeCategoryId).length})
                </button>
                {currentCategory.subcategories.map((sub) => {
                  const isSubActive = activeSubcategoryId === sub.id;
                  const count = products.filter(
                    (p) => p.categoryId === activeCategoryId && p.subcategoryId === sub.id
                  ).length;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setActiveSubcategoryId(sub.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                        isSubActive
                          ? 'bg-red-600 text-white shadow-2xs'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      <span>{sub.name}</span>
                      <span className={`text-[10px] ${isSubActive ? 'text-white/80' : 'text-neutral-400'}`}>
                        ({count})
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Filter Tools & Sort Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-neutral-100">
              {/* Left: Quick search & Veg Only toggle */}
              <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                <div className="relative flex-1 max-w-xs">
                  <input
                    type="text"
                    value={searchInCat}
                    onChange={(e) => setSearchInCat(e.target.value)}
                    placeholder={`Search in ${currentCategory.name}...`}
                    className="w-full bg-neutral-100 border border-neutral-200 rounded-xl py-1.5 pl-8 pr-3 text-xs font-semibold placeholder:text-neutral-400 focus:bg-white focus:border-red-500 focus:outline-none"
                  />
                  <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>

                {/* Veg Toggle */}
                <button
                  type="button"
                  onClick={() => setVegOnly(!vegOnly)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    vegOnly
                      ? 'bg-green-50 text-green-700 border-green-300'
                      : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      vegOnly ? 'bg-green-600' : 'border border-green-600'
                    }`}
                  />
                  <span>Veg Only</span>
                </button>
              </div>

              {/* Right: Sort selector */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-xs text-neutral-500 font-semibold hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-neutral-100 border border-neutral-200 rounded-xl px-2.5 py-1 text-xs font-bold text-neutral-800 focus:outline-none"
                >
                  <option value="popular">Popularity</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid: 2 columns on mobile, 3 on tablet, 4 on desktop */}
          {categoryProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-neutral-200 text-center space-y-3">
              <span className="text-4xl block">🥦</span>
              <h3 className="text-base font-black text-neutral-900">
                No items match your selected filters
              </h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Try switching off the vegetarian filter or searching for another term.
              </p>
              <button
                onClick={() => {
                  setVegOnly(false);
                  setActiveSubcategoryId('all');
                  setSearchInCat('');
                }}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {categoryProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onOpenDetail={onOpenProductDetail}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
