import React, { useState, useEffect } from 'react';
import { useApp } from '../../store/AppContext';
import { Order, Product, ServiceConfig } from '../../types';
import { ProductCard } from '../../components/commerce/ProductCard';
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge';
import { NOIDA_LOCATIONS } from '../../data/mockData';
import {
  Search,
  Zap,
  MapPin,
  ChevronRight,
  ChevronDown,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Package,
  Store,
  Clock,
  Bike,
  Navigation,
  RotateCcw,
  Tag,
  CheckCircle2,
  Mic,
  Headphones,
  Gift,
  Percent,
  Flame,
  ShoppingBag,
  Menu,
} from 'lucide-react';

interface CustomerHomeProps {
  onSelectService: (service: ServiceConfig) => void;
  onTrackOrder: (orderId: string) => void;
  onViewOrders?: () => void;
  onViewAllOrders?: () => void;
  onViewPasses?: () => void;
  onOpenSearch?: () => void;
  onSelectCategory?: (categoryId: string) => void;
  onOpenProductDetail?: (product: Product) => void;
  onOpenCart?: () => void;
}

export const CustomerHome: React.FC<CustomerHomeProps> = ({
  onSelectService,
  onTrackOrder,
  onViewOrders,
  onViewAllOrders,
  onViewPasses,
  onOpenSearch,
  onSelectCategory,
  onOpenProductDetail,
  onOpenCart,
}) => {
  const {
    currentCustomer,
    selectedLocation,
    setSelectedLocation,
    categories,
    products,
    businesses,
    services,
    orders,
    getActivePassForCustomer,
    reorderItems,
    openPartnerMenu,
  } = useApp();

  const activePass = getActivePassForCustomer(currentCustomer.id);

  // Active Live Order
  const activeOrder = orders.find(
    (o) =>
      o.status !== 'DELIVERED' &&
      o.status !== 'COMPLETED' &&
      o.status !== 'CANCELLED' &&
      o.status !== 'FAILED'
  );

  // Past completed orders for "Buy Again"
  const recentCompletedOrders = orders.filter(
    (o) => o.status === 'DELIVERED' || o.status === 'COMPLETED'
  );

  // Dynamic rotating search placeholder terms
  const searchTerms = ['milk', 'chips', 'ice cream', 'atta', 'cold drinks', 'bread', 'chocolates'];
  const [currentPlaceholderIdx, setCurrentPlaceholderIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholderIdx((prev) => (prev + 1) % searchTerms.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [searchTerms.length]);

  // Selected quick icon tab in the golden rail
  const [activeQuickTab, setActiveQuickTab] = useState('all');

  // Categorized products for shelves
  const trendingProducts = products
    .filter((p) => p.tags?.includes('Trending') || p.tags?.includes('Bestseller'))
    .slice(0, 6);
  const dairyProducts = products.filter((p) => p.categoryId === 'dairy-breakfast').slice(0, 6);
  const snackProducts = products.filter((p) => p.categoryId === 'snacks-munchies').slice(0, 6);

  // 9 Bestseller categories with 4-quadrant preview images (matching the screenshot)
  const bestsellerCards = [
    {
      id: 'chips-namkeen',
      categoryId: 'snacks-munchies',
      title: 'Chips &\nNamkeen',
      countLabel: '+323 more',
      bgColor: 'bg-red-50/60',
      images: [
        'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1621996346565-e3d5d6281228?w=200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=200&auto=format&fit=crop&q=80',
      ],
    },
    {
      id: 'drinks-juices',
      categoryId: 'drinks-juices',
      title: 'Drinks &\nJuices',
      countLabel: '+171 more',
      bgColor: 'bg-emerald-50/60',
      images: [
        'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=200&auto=format&fit=crop&q=80',
      ],
    },
    {
      id: 'vegetables-fruits',
      categoryId: 'fruits-vegetables',
      title: 'Vegetables &\nFruits',
      countLabel: '+86 more',
      bgColor: 'bg-green-50/70',
      images: [
        'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&auto=format&fit=crop&q=80',
      ],
    },
    {
      id: 'ice-creams',
      categoryId: 'instant-frozen',
      title: 'Ice Creams &\nMore',
      countLabel: '+78 more',
      bgColor: 'bg-red-50/50',
      images: [
        'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=200&auto=format&fit=crop&q=80',
      ],
    },
    {
      id: 'dairy-milk',
      categoryId: 'dairy-breakfast',
      title: 'Dairy &\nMilk',
      countLabel: '+142 more',
      bgColor: 'bg-emerald-50/50',
      images: [
        'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=200&auto=format&fit=crop&q=80',
      ],
    },
    {
      id: 'sweets-chocolates',
      categoryId: 'snacks-munchies',
      title: 'Sweets &\nChocolates',
      countLabel: '+227 more',
      bgColor: 'bg-red-50/60',
      images: [
        'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1511381939415-e44015466834?w=200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=200&auto=format&fit=crop&q=80',
      ],
    },
    {
      id: 'bakery-biscuits',
      categoryId: 'bakery-biscuits',
      title: 'Bakery &\nBiscuits',
      countLabel: '+94 more',
      bgColor: 'bg-neutral-50',
      images: [
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=200&auto=format&fit=crop&q=80',
      ],
    },
    {
      id: 'atta-rice-dal',
      categoryId: 'atta-rice-dal',
      title: 'Atta, Rice\n& Dal',
      countLabel: '+165 more',
      bgColor: 'bg-emerald-50/70',
      images: [
        'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1585994192701-f1a505c817bc?w=200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&auto=format&fit=crop&q=80',
      ],
    },
    {
      id: 'instant-frozen',
      categoryId: 'instant-frozen',
      title: 'Instant &\nFrozen Food',
      countLabel: '+118 more',
      bgColor: 'bg-red-50/70',
      images: [
        'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&auto=format&fit=crop&q=80',
      ],
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 text-left pb-12">
      {/* 1. VIBRANT RED BANNER & CATEGORY QUICK-RAIL */}
      <div className="relative bg-gradient-to-b from-[#DC2626] via-[#E11D48] to-[#B91C1C] text-white p-3.5 sm:p-5 sm:rounded-3xl shadow-sm space-y-3">
        {/* Top Delivery & Wallet Status Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white/95">⚡ Delivering in</span>
            <span className="text-xs sm:text-sm font-black text-white bg-white/20 px-2 py-0.5 rounded-full border border-white/25">
              10 minutes • 24/7
            </span>
          </div>

          {/* QuickPass Wallet button */}
          <button
            onClick={onViewPasses}
            className="flex bg-black/30 hover:bg-black/40 text-white text-xs font-black px-2.5 py-1 rounded-xl items-center gap-1 border border-white/20 shadow-sm transition-transform active:scale-95 cursor-pointer backdrop-blur-xs"
            title="QuickPass Wallet"
          >
            <span>💵</span>
            <span>₹{activePass ? '450' : '0'} QuickPass</span>
          </button>
        </div>

        {/* Category Horizontal Icon Rail (All, Navratri, Electronics, Beauty, Pharmacy, Gifting) */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar pt-0.5">
          {[
            { id: 'all', label: 'All', icon: '🍶', isAll: true },
            { id: 'navratri', label: 'Navratri', icon: '🪔', isNew: true },
            { id: 'electronics', label: 'Electronics', icon: '🎧' },
            { id: 'beauty', label: 'Beauty', icon: '💄' },
            { id: 'pharmacy', label: 'Pharmacy', icon: '💊' },
            { id: 'gifting', label: 'Gifting', icon: '🎁' },
            { id: 'courier', label: 'Courier', icon: '🛵' },
          ].map((tab) => {
            const isActive = activeQuickTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveQuickTab(tab.id);
                  if (tab.id === 'courier') {
                    const srv = services.find((s) => s.id === 'parcel') || services[0];
                    onSelectService(srv);
                  } else if (tab.id !== 'all' && onSelectCategory) {
                    onSelectCategory(tab.id === 'beauty' ? 'snacks-munchies' : 'dairy-breakfast');
                  }
                }}
                className="flex flex-col items-center justify-center shrink-0 min-w-[50px] sm:min-w-[54px] py-1 cursor-pointer group"
              >
                {/* Icon Container with optional "New" badge */}
                <div className="relative mb-1">
                  {tab.isNew && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#FF2A6D] text-white text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-tighter shadow-xs">
                      New
                    </span>
                  )}
                  <div
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center text-lg sm:text-xl transition-all shadow-sm ${
                      isActive
                        ? 'bg-white text-red-600 scale-105 shadow-md ring-2 ring-white/50'
                        : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-xs'
                    }`}
                  >
                    {tab.icon}
                  </div>
                </div>
                <span
                  className={`text-[10px] sm:text-[11px] font-bold tracking-tight ${
                    isActive ? 'text-white font-black underline decoration-2' : 'text-white/90'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. WELCOME OFFER HERO BANNER WITH 3D GROCERY BAGS (RED THEMED) */}
      <div className="px-3 sm:px-0">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#DC2626] via-[#E11D48] to-[#991B1B] p-5 sm:p-7 text-center shadow-sm border border-red-400">
          {/* Left & Right 3D Grocery Bags */}
          <div className="absolute -left-3 top-2 text-4xl sm:text-6xl drop-shadow-lg select-none opacity-90 sm:opacity-100 transform -rotate-12">
            🛍️
          </div>
          <div className="absolute -right-3 top-2 text-4xl sm:text-6xl drop-shadow-lg select-none opacity-90 sm:opacity-100 transform rotate-12">
            🥖
          </div>

          {/* Banner Content */}
          <div className="relative z-10 max-w-md mx-auto space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-wider uppercase drop-shadow-md">
              WELCOME
            </h2>
            <p className="text-xs sm:text-sm font-bold text-white/95">
              Order now and enjoy great offers
            </p>

            <div className="pt-1 flex items-center justify-center gap-1.5 text-xs font-black text-neutral-900 uppercase tracking-widest">
              <span>✦</span>
              <span>OFFERS FOR YOU</span>
              <span>✦</span>
            </div>

            {/* Offer Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 text-left">
              {/* Offer 1 */}
              <div
                onClick={() => {
                  if (onSelectCategory) onSelectCategory('snacks-munchies');
                }}
                className="bg-white rounded-2xl p-3 shadow-xs flex items-center gap-3 cursor-pointer hover:border-red-500 border border-transparent transition-all active:scale-95"
              >
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black text-lg shrink-0">
                  %
                </div>
                <div>
                  <div className="text-xs font-black text-neutral-900 leading-tight">
                    Enjoy FLAT ₹50 OFF
                  </div>
                  <div className="text-[10px] text-neutral-500 font-medium">
                    On your first order above ₹249
                  </div>
                </div>
              </div>

              {/* Offer 2 */}
              <div
                onClick={onViewPasses}
                className="bg-white rounded-2xl p-3 shadow-xs flex items-center gap-3 cursor-pointer hover:border-green-500 border border-transparent transition-all active:scale-95"
              >
                <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center text-lg shrink-0">
                  🛵
                </div>
                <div>
                  <div className="text-xs font-black text-neutral-900 leading-tight">
                    Enjoy FREE delivery
                  </div>
                  <div className="text-[10px] text-neutral-500 font-medium">
                    On your first 10 orders with QuickPass
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BESTSELLERS SECTION (3-COLUMN 4-QUADRANT CATEGORY PREVIEWS FROM SCREENSHOT) */}
      <div className="px-3 sm:px-0 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-black text-neutral-900">
            Bestsellers
          </h2>
          <button
            onClick={() => {
              if (onSelectCategory) onSelectCategory('snacks-munchies');
            }}
            className="text-xs font-black text-red-600 hover:underline flex items-center gap-1"
          >
            <span>See All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3-Column Grid on Mobile */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3.5">
          {bestsellerCards.map((card) => (
            <div
              key={card.id}
              onClick={() => {
                if (onSelectCategory) onSelectCategory(card.categoryId);
              }}
              className="group bg-white rounded-2xl p-2 sm:p-2.5 border border-neutral-200/90 hover:border-red-400 hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-between active:scale-95"
            >
              {/* 2x2 Grid of 4 Product Image Quadrants */}
              <div className={`w-full aspect-square rounded-xl ${card.bgColor} p-1 relative overflow-hidden grid grid-cols-2 grid-rows-2 gap-1`}>
                {card.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="w-full h-full rounded-lg overflow-hidden bg-white/80 shadow-2xs flex items-center justify-center"
                  >
                    <img
                      src={img}
                      alt={`${card.title} thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  </div>
                ))}

                {/* Overlaid Center Pill (+X more) */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xs text-neutral-800 text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-md border border-neutral-200 whitespace-nowrap">
                  {card.countLabel}
                </div>
              </div>

              {/* Category Title */}
              <div className="mt-1.5 text-center min-h-[30px] flex items-center justify-center">
                <span className="text-[11px] sm:text-xs font-bold text-neutral-800 group-hover:text-red-600 leading-tight whitespace-pre-line">
                  {card.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. ACTIVE LIVE ORDER BANNER (IF ANY) */}
      {activeOrder && (
        <div className="px-3 sm:px-0">
          <div
            onClick={() => onTrackOrder(activeOrder.id)}
            className="bg-neutral-900 text-white rounded-3xl p-4 sm:p-5 shadow-lg border border-neutral-700/80 cursor-pointer hover:border-red-500 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-md">
                <Navigation className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-red-400 tracking-wider">
                    LIVE ORDER IN TRANSIT
                  </span>
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
                </div>
                <h3 className="text-sm sm:text-base font-black text-white mt-0.5">
                  Order #{activeOrder.id} • {activeOrder.serviceName}
                </h3>
                <p className="text-xs text-neutral-300">
                  Status: <strong className="text-white">{activeOrder.status.replace(/_/g, ' ')}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <OrderStatusBadge status={activeOrder.status} size="sm" />
              <span className="text-xs font-black text-red-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                <span>Track Live</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 5. TRENDING PRODUCTS SHELF (INDIVIDUAL CARDS WITH FAST [ADD]) */}
      <div className="px-3 sm:px-0 space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold text-sm">
              🔥
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-neutral-900 leading-tight">
                Trending in Your Area
              </h2>
              <p className="text-[11px] text-neutral-500 font-medium">
                Most ordered grocery & snack items right now
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (onSelectCategory) onSelectCategory('snacks-munchies');
            }}
            className="text-xs font-black text-red-600 hover:underline"
          >
            Explore More →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-3.5">
          {trendingProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onOpenDetail={onOpenProductDetail}
            />
          ))}
        </div>
      </div>

      {/* 6. INSTANT COURIER DISPATCH CARD */}
      <div className="px-3 sm:px-0">
        <div className="bg-white rounded-3xl p-5 border border-neutral-200/90 shadow-2xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-2xl font-black">
              📦
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase text-red-600 tracking-wider">
                  EXPRESS INSTANT COURIER
                </span>
                <span className="text-xs text-neutral-400">•</span>
                <span className="text-xs font-bold text-green-700">From ₹40</span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-neutral-900">
                Send Anything Across Town in 20 Minutes
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            {services.slice(0, 3).map((srv) => (
              <div
                key={srv.id}
                onClick={() => onSelectService(srv)}
                className="p-3 rounded-2xl bg-neutral-50 hover:bg-red-50/60 border border-neutral-200/80 hover:border-red-300 transition-all cursor-pointer flex items-center justify-between group active:scale-95"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{srv.icon}</span>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 group-hover:text-red-600">
                      {srv.name}
                    </h4>
                    <p className="text-[10px] text-neutral-500 line-clamp-1">{srv.tagline}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. DAIRY, BREAD & BREAKFAST SHELF */}
      <div className="px-3 sm:px-0 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
              🥛
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-neutral-900 leading-tight">
                Dairy, Bread & Eggs
              </h2>
              <p className="text-[11px] text-neutral-500 font-medium">
                Fresh morning milk, curd, paneer & whole wheat bread
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (onSelectCategory) onSelectCategory('dairy-breakfast');
            }}
            className="text-xs font-black text-red-600 hover:underline"
          >
            See All →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-3.5">
          {dairyProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onOpenDetail={onOpenProductDetail}
            />
          ))}
        </div>
      </div>

      {/* 8. SNACKS & MUNCHIES SHELF */}
      <div className="px-3 sm:px-0 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold text-sm">
              🍿
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-neutral-900 leading-tight">
                Snacks & Munchies
              </h2>
              <p className="text-[11px] text-neutral-500 font-medium">
                Crunchy chips, namkeen, nachos & party favorites
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (onSelectCategory) onSelectCategory('snacks-munchies');
            }}
            className="text-xs font-black text-red-600 hover:underline"
          >
            See All →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-3.5">
          {snackProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onOpenDetail={onOpenProductDetail}
            />
          ))}
        </div>
      </div>

      {/* 9. FEATURED DIRECT MERCHANT STORES */}
      <div className="px-3 sm:px-0 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm">
              🏪
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-neutral-900 leading-tight">
                Featured Stores & Kitchens Nearby
              </h2>
              <p className="text-[11px] text-neutral-500 font-medium">
                Direct merchant outlets connected to the express fleet
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {businesses.map((biz) => (
            <div
              key={biz.id}
              className="bg-white rounded-2xl p-4 border border-neutral-200/90 shadow-2xs space-y-3 flex flex-col justify-between"
            >
              <div className="flex items-center gap-3">
                <img
                  src={biz.avatar}
                  alt={biz.name}
                  className="w-12 h-12 rounded-xl object-cover bg-neutral-100 border border-neutral-100"
                />
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-black text-neutral-900 truncate">
                    {biz.name}
                  </h4>
                  <span className="text-[10px] text-neutral-500 font-medium block truncate">
                    {biz.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] text-neutral-700 font-bold mt-0.5">
                    <span>⭐ {biz.rating}</span>
                    <span className="text-neutral-300">•</span>
                    <span className="text-green-600">{biz.deliveryTimeEstimate || '12-18 min'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                <span className="truncate">{biz.address.split(',')[0]}</span>
                <span className="text-red-600 font-bold shrink-0">Direct Hub</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 10. BUY AGAIN / PAST ORDERS */}
      {recentCompletedOrders.length > 0 && (
        <div className="px-3 sm:px-0 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-red-600" />
              <h2 className="text-base sm:text-lg font-black text-neutral-900 leading-tight">
                Buy Again / Past Orders
              </h2>
            </div>
            {onViewOrders && (
              <button
                onClick={onViewOrders}
                className="text-xs font-black text-red-600 hover:underline"
              >
                View History →
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {recentCompletedOrders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-2xs space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-neutral-500 font-bold">#{order.id}</span>
                  <OrderStatusBadge status={order.status} size="sm" />
                </div>
                <div>
                  <div className="font-bold text-neutral-900 line-clamp-1">{order.packageType}</div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">
                    Total: <strong className="text-neutral-900">₹{order.pricing.total}</strong> • {order.createdAt}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                  <button
                    onClick={() => onTrackOrder(order.id)}
                    className="text-neutral-600 font-bold hover:text-neutral-900 text-xs"
                  >
                    View Receipt
                  </button>
                  {order.items && order.items.length > 0 && (
                    <button
                      onClick={() => reorderItems(order)}
                      className="bg-green-50 hover:bg-green-100 text-green-700 font-black px-3 py-1.5 rounded-xl transition-colors active:scale-95 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reorder</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
