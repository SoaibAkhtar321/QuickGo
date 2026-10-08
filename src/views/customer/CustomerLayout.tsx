import React, { useState, useEffect, useRef } from 'react';
import { Logo } from '../../components/ui/Logo';
import { useApp } from '../../store/AppContext';
import { NOIDA_LOCATIONS } from '../../data/mockData';
import { MobileCartBar } from '../../components/commerce/MobileCartBar';
import {
  Home,
  Package,
  Navigation,
  User,
  MapPin,
  ChevronDown,
  Bike,
  Sparkles,
  Search,
  ShoppingBag,
  Layers,
  LayoutGrid,
  Printer,
  RotateCcw,
  Menu,
  Mic,
} from 'lucide-react';

import {
  useScrollNavigation,
  UseScrollNavigationOptions,
} from '../../hooks/useScrollNavigation';

export type CustomerTab =
  | 'home'
  | 'categories'
  | 'search'
  | 'create'
  | 'orders'
  | 'track'
  | 'passes'
  | 'profile'
  | 'support';

// Export hook and backward-compatibility aliases
export { useScrollNavigation };
export type UseBottomNavScrollOptions = UseScrollNavigationOptions;
export const useBottomNavScrollVisibility = useScrollNavigation;
export const useScrollNavVisibility = useScrollNavigation;

interface CustomerLayoutProps {
  activeTab?: CustomerTab;
  currentTab?: CustomerTab;
  setActiveTab?: (tab: CustomerTab) => void;
  setCurrentTab?: (tab: CustomerTab) => void;
  onOpenCart?: () => void;
  onOpenSearch?: () => void;
  onOpenPartnerMenu?: () => void;
  children: React.ReactNode;
}

export const CustomerLayout: React.FC<CustomerLayoutProps> = ({
  activeTab,
  currentTab,
  setActiveTab,
  setCurrentTab,
  onOpenCart,
  onOpenSearch,
  onOpenPartnerMenu,
  children,
}) => {
  const selectedTab = activeTab || currentTab || 'home';
  const handleTabChange = (tab: CustomerTab) => {
    if (setActiveTab) setActiveTab(tab);
    if (setCurrentTab) setCurrentTab(tab);
  };

  const {
    currentCustomer,
    selectedLocation,
    setSelectedLocation,
    orders,
    getActivePassForCustomer,
    cartItemCount,
    cartTotal,
    openPartnerMenu: globalOpenPartnerMenu,
  } = useApp();

  const handleOpenPartner = () => {
    if (onOpenPartnerMenu) onOpenPartnerMenu();
    else if (globalOpenPartnerMenu) globalOpenPartnerMenu();
  };

  // --------------------------------------------------------------------------
  // Mobile Search Dynamic Placeholder Cycling (Blinkit Experience)
  // --------------------------------------------------------------------------
  const [currentPlaceholderIdx, setCurrentPlaceholderIdx] = useState(0);
  const searchTerms = ['milk', 'fresh curd', 'bread', 'amul butter', 'chips', 'atta', 'maggi', 'onion', 'soft drinks'];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPlaceholderIdx((prev) => (prev + 1) % searchTerms.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [searchTerms.length]);

  // --------------------------------------------------------------------------
  // Blinkit Scroll Navigation Hook:
  // - Tracks scroll direction and window position
  // - Keeps top header and search bar pinned with dynamic elevation
  // - Hides bottom navigation on downward scroll
  // - Reveals bottom navigation immediately on upward scroll or at top/bottom
  // --------------------------------------------------------------------------
  const {
    isBottomNavVisible,
    isFooterVisible,
    headerClasses,
    bottomNavClasses,
  } = useScrollNavigation({
    downThreshold: 4,
    upThreshold: 2,
    topThreshold: 20,
    resetTrigger: selectedTab,
  });

  const activeOrder = orders.find(
    (o) =>
      o.status !== 'DELIVERED' &&
      o.status !== 'COMPLETED' &&
      o.status !== 'CANCELLED' &&
      o.status !== 'FAILED'
  );

  const activePass = getActivePassForCustomer(currentCustomer.id);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-32 md:pb-12 text-[#171717]">
      {/* 
        Pinned Header with Header Search Bar (Blinkit Standard):
        Pinned and visible at all times across all customer tabs, both on mobile and desktop.
      */}
      <header
        id="customer-layout-header"
        className={headerClasses}
      >
        {/* Top Row: Brand & Location + Desktop Search / Desktop Navigation + Cart / Profile / 3-Line Menu */}
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-2 sm:py-3 flex items-center justify-between gap-1.5 sm:gap-4">
          {/* Brand & Location */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <button
              onClick={() => handleTabChange('home')}
              className="text-left focus:outline-none flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Logo size="sm" />
            </button>

            {/* Location selector dropdown - constrained to prevent horizontal clipping on mobile */}
            <div className="relative group shrink-0">
              <select
                id="customer-location-select"
                aria-label="Select delivery location"
                value={selectedLocation.name}
                onChange={(e) => {
                  const found = NOIDA_LOCATIONS.find((loc) => loc.name === e.target.value);
                  if (found) setSelectedLocation(found);
                }}
                className="appearance-none bg-neutral-100 hover:bg-neutral-200/80 text-xs font-bold text-neutral-800 py-1.5 pl-6 pr-5 rounded-full cursor-pointer focus:outline-none transition-colors border border-transparent shadow-2xs max-w-[95px] xs:max-w-[130px] sm:max-w-[200px] truncate"
              >
                {NOIDA_LOCATIONS.map((loc) => (
                  <option key={loc.name} value={loc.name}>
                    {loc.name}
                  </option>
                ))}
              </select>
              <MapPin className="w-3.5 h-3.5 text-red-600 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              <ChevronDown className="w-3 h-3 text-neutral-500 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Desktop Search Bar (Row 1 on md+ viewports) */}
          <div className="hidden md:flex flex-1 max-w-md mx-3">
            <button
              type="button"
              onClick={() => {
                if (onOpenSearch) onOpenSearch();
                else handleTabChange('search');
              }}
              className="w-full bg-neutral-100 hover:bg-neutral-150 border border-neutral-200 rounded-2xl py-2 pl-9 pr-4 text-xs font-semibold text-neutral-400 text-left flex items-center justify-between cursor-pointer transition-colors relative"
            >
              <Search className="w-4 h-4 text-red-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <span className="truncate">Search 'milk', 'chips', 'courier', 'atta'...</span>
              <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-neutral-200 text-neutral-500">
                /
              </span>
            </button>
          </div>

          {/* Navigation Links on Desktop */}
          <nav className="hidden lg:flex items-center gap-1.5">
            <button
              onClick={() => handleTabChange('categories')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedTab === 'categories'
                  ? 'text-red-600 bg-red-50'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Categories</span>
            </button>

            <button
              onClick={() => handleTabChange('passes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all relative ${
                selectedTab === 'passes'
                  ? 'text-red-600 bg-red-50'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-red-600" />
              <span>QuickPass</span>
              {activePass && (
                <span className="text-[9px] bg-green-100 text-green-700 font-extrabold px-1.5 py-0.2 rounded-full border border-green-200">
                  VIP
                </span>
              )}
            </button>

            <button
              onClick={() => handleTabChange('orders')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedTab === 'orders'
                  ? 'text-red-600 bg-red-50'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Orders</span>
            </button>

            <button
              onClick={() => handleTabChange('create')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedTab === 'create'
                  ? 'text-red-600 bg-red-50'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Bike className="w-4 h-4" />
              <span>Send Courier</span>
            </button>
          </nav>

          {/* User, Cart, and Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Cart Button */}
            <button
              type="button"
              onClick={onOpenCart}
              id="header-cart-btn"
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs active:scale-95 ${
                cartItemCount > 0
                  ? 'bg-green-700 hover:bg-green-800 text-white shadow-green-900/20'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
              }`}
            >
              <ShoppingBag className={`w-4 h-4 ${cartItemCount > 0 ? 'text-white' : 'text-neutral-600'}`} />
              <div className="flex items-center gap-1">
                <span className="hidden xs:inline">{cartItemCount > 0 ? `${cartItemCount}` : 'Cart'}</span>
                {cartTotal > 0 && (
                  <>
                    <span className="text-green-200 hidden xs:inline">•</span>
                    <span className="text-white font-black">₹{cartTotal}</span>
                  </>
                )}
              </div>
            </button>

            {/* Profile Avatar */}
            <button
              onClick={() => handleTabChange('profile')}
              className="p-0.5 rounded-full border border-neutral-200 hover:border-red-500 hover:bg-neutral-50 transition-all text-left shrink-0"
              title="My Account"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-neutral-300 shrink-0">
                <img
                  src={currentCustomer.avatar}
                  alt={currentCustomer.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </button>

            {/* Three-Line Menu Button (Seller & Partner Portals) */}
            <button
              id="btn-partner-menu-layout"
              onClick={handleOpenPartner}
              className="p-2 rounded-xl bg-neutral-100 hover:bg-red-50 text-neutral-800 hover:text-red-600 border border-neutral-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0 active:scale-95"
              title="Store Partner & Seller Portals (Three Lines)"
              aria-label="Partner and Store Menu (Three Lines)"
            >
              <div className="flex flex-col justify-center items-center gap-[3px] w-4 h-4">
                <span className="w-3.5 h-[2.5px] bg-neutral-900 rounded-full"></span>
                <span className="w-3.5 h-[2.5px] bg-neutral-900 rounded-full"></span>
                <span className="w-3.5 h-[2.5px] bg-neutral-900 rounded-full"></span>
              </div>
              <span className="hidden sm:inline-block text-xs font-black">
                Partner / Store
              </span>
            </button>
          </div>
        </div>

        {/* 
          Mobile Search Bar Row (PINNED & VISIBLE AT ALL TIMES):
          Always pinned directly below Row 1 inside the sticky header on mobile screens.
        */}
        <div className="md:hidden px-2.5 sm:px-6 pb-2.5 pt-0.5">
          <div
            role="button"
            tabIndex={0}
            onClick={() => {
              if (onOpenSearch) onOpenSearch();
              else handleTabChange('search');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                if (onOpenSearch) onOpenSearch();
                else handleTabChange('search');
              }
            }}
            className="w-full bg-neutral-100/90 hover:bg-neutral-200/80 border border-neutral-200 rounded-2xl py-2 px-3 flex items-center justify-between shadow-2xs cursor-pointer transition-all active:scale-[0.99]"
            aria-label="Search items"
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <Search className="w-4 h-4 text-red-600 shrink-0" />
              <div className="min-w-0 flex items-center text-xs font-semibold text-neutral-600">
                <span className="text-neutral-400">Search "</span>
                <span className="text-neutral-900 font-bold transition-all duration-300 truncate">
                  {searchTerms[currentPlaceholderIdx]}
                </span>
                <span className="text-neutral-400">"</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Mic className="w-4 h-4 text-neutral-500 hover:text-red-600 transition-colors" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Screen Content */}
      <main
        className={`max-w-7xl mx-auto w-full ${
          selectedTab === 'home'
            ? 'px-0 sm:px-6 lg:px-8 pt-0 sm:pt-6'
            : 'px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6'
        }`}
      >
        {children}
      </main>

      {/* Sticky Mobile Fast-Cart Bottom Bar with synchronized visibility */}
      <MobileCartBar
        onOpenCart={onOpenCart || (() => {})}
        isFooterVisible={isBottomNavVisible}
      />

      {/* Mobile Bottom Navigation Bar (Blinkit-Style 5-Tab Footer with Red Accent) */}
      <nav
        id="mobile-bottom-nav"
        className={bottomNavClasses}
      >
        <div className="flex items-center justify-between max-w-md mx-auto">
          {/* 1. Home */}
          <button
            id="nav-tab-home"
            onClick={() => handleTabChange('home')}
            className={`flex-1 flex flex-col items-center justify-center py-0.5 cursor-pointer transition-all ${
              selectedTab === 'home'
                ? 'text-red-600'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <div className="w-6 h-6 flex items-center justify-center">
              {/* Home house with rich red fill and crisp outline */}
              <svg
                viewBox="0 0 24 24"
                className={`w-6 h-6 transition-transform ${
                  selectedTab === 'home' ? 'scale-105' : 'text-neutral-600'
                }`}
                fill="none"
              >
                <path
                  d="M3 10.5L12 3L21 10.5V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V10.5Z"
                  className={selectedTab === 'home' ? 'fill-[#E11D48] stroke-[#9F1239] stroke-[1.8]' : 'stroke-neutral-600 stroke-[1.8] fill-none'}
                />
                <path
                  d="M9 21V12H15V21"
                  className={selectedTab === 'home' ? 'stroke-[#9F1239] stroke-[1.8] fill-[#BE123C]' : 'stroke-neutral-600 stroke-[1.8] fill-none'}
                />
              </svg>
            </div>
            <span
              className={`text-[11px] mt-0.5 leading-none ${
                selectedTab === 'home' ? 'font-black text-red-600' : 'font-semibold text-neutral-600'
              }`}
            >
              Home
            </span>
            {selectedTab === 'home' ? (
              <span className="w-5 h-0.5 bg-red-600 rounded-full mt-1" />
            ) : (
              <span className="w-5 h-0.5 bg-transparent rounded-full mt-1" />
            )}
          </button>

          {/* 2. Order Again */}
          <button
            id="nav-tab-order-again"
            onClick={() => handleTabChange('orders')}
            className={`flex-1 flex flex-col items-center justify-center py-0.5 cursor-pointer transition-all ${
              selectedTab === 'orders'
                ? 'text-red-600'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <div className="w-6 h-6 flex items-center justify-center text-neutral-700 relative">
              <ShoppingBag
                className={`w-5 h-5 ${selectedTab === 'orders' ? 'stroke-[2.5] text-red-600' : 'stroke-[1.8] text-neutral-600'}`}
              />
              {activeOrder && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-ping" />
              )}
            </div>
            <span
              className={`text-[11px] mt-0.5 leading-none whitespace-nowrap ${
                selectedTab === 'orders' ? 'font-black text-red-600' : 'font-semibold text-neutral-600'
              }`}
            >
              Order Again
            </span>
            {selectedTab === 'orders' ? (
              <span className="w-5 h-0.5 bg-red-600 rounded-full mt-1" />
            ) : (
              <span className="w-5 h-0.5 bg-transparent rounded-full mt-1" />
            )}
          </button>

          {/* 3. Categories */}
          <button
            id="nav-tab-categories"
            onClick={() => handleTabChange('categories')}
            className={`flex-1 flex flex-col items-center justify-center py-0.5 cursor-pointer transition-all ${
              selectedTab === 'categories'
                ? 'text-red-600'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <div className="w-6 h-6 flex items-center justify-center text-neutral-700">
              <LayoutGrid
                className={`w-5 h-5 ${selectedTab === 'categories' ? 'stroke-[2.5] text-red-600' : 'stroke-[1.8] text-neutral-600'}`}
              />
            </div>
            <span
              className={`text-[11px] mt-0.5 leading-none ${
                selectedTab === 'categories' ? 'font-black text-red-600' : 'font-semibold text-neutral-600'
              }`}
            >
              Categories
            </span>
            {selectedTab === 'categories' ? (
              <span className="w-5 h-0.5 bg-red-600 rounded-full mt-1" />
            ) : (
              <span className="w-5 h-0.5 bg-transparent rounded-full mt-1" />
            )}
          </button>

          {/* 4. QuickPass VIP Club */}
          <button
            id="nav-tab-passes"
            onClick={() => handleTabChange('passes')}
            className={`flex-1 flex flex-col items-center justify-center py-0.5 cursor-pointer transition-all relative ${
              selectedTab === 'passes'
                ? 'text-red-600'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <div className="w-6 h-6 flex items-center justify-center text-neutral-700 relative">
              <Sparkles
                className={`w-5 h-5 ${
                  selectedTab === 'passes'
                    ? 'stroke-[2.5] text-red-600'
                    : 'stroke-[1.8] text-neutral-600'
                }`}
              />
              {activePass && (
                <span className="absolute -top-1 -right-1.5 bg-red-600 text-white text-[8px] font-black px-1 rounded-full">
                  VIP
                </span>
              )}
            </div>
            <span
              className={`text-[11px] mt-0.5 leading-none whitespace-nowrap ${
                selectedTab === 'passes'
                  ? 'font-black text-red-600'
                  : 'font-semibold text-neutral-600'
              }`}
            >
              QuickPass
            </span>
            {selectedTab === 'passes' ? (
              <span className="w-5 h-0.5 bg-red-600 rounded-full mt-1" />
            ) : (
              <span className="w-5 h-0.5 bg-transparent rounded-full mt-1" />
            )}
          </button>

          {/* 5. Account Profile */}
          <button
            id="nav-tab-profile"
            onClick={() => handleTabChange('profile')}
            className={`flex-1 flex flex-col items-center justify-center py-0.5 cursor-pointer transition-all ${
              selectedTab === 'profile'
                ? 'text-red-600'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <div className="w-6 h-6 flex items-center justify-center text-neutral-700">
              <div
                className={`w-5 h-5 rounded-full overflow-hidden border ${
                  selectedTab === 'profile' ? 'border-red-600 border-2' : 'border-neutral-300'
                }`}
              >
                <img
                  src={currentCustomer.avatar}
                  alt={currentCustomer.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <span
              className={`text-[11px] mt-0.5 leading-none ${
                selectedTab === 'profile'
                  ? 'font-black text-red-600'
                  : 'font-semibold text-neutral-600'
              }`}
            >
              Profile
            </span>
            {selectedTab === 'profile' ? (
              <span className="w-5 h-0.5 bg-red-600 rounded-full mt-1" />
            ) : (
              <span className="w-5 h-0.5 bg-transparent rounded-full mt-1" />
            )}
          </button>
        </div>

        {/* iOS Home Indicator Bar */}
        <div className="w-32 h-1 bg-neutral-300 rounded-full mx-auto mt-2 mb-0.5" />
      </nav>
    </div>
  );
};

export const MobileLayout = CustomerLayout;
export default CustomerLayout;
