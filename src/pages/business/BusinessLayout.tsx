import React, { useState } from 'react';
import { Logo } from '../../components/ui/Logo';
import { useApp } from '../../store/AppContext';
import {
  LayoutDashboard,
  Package,
  UtensilsCrossed,
  Bike,
  Users,
  Wallet,
  Store,
  Bell,
  CheckCircle2,
  Menu,
  X,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export type BusinessTab =
  | 'dashboard'
  | 'orders'
  | 'catalog'
  | 'dispatch'
  | 'customers'
  | 'settlement'
  | 'profile';

interface BusinessLayoutProps {
  currentTab: BusinessTab;
  onTabChange: (tab: BusinessTab) => void;
  children: React.ReactNode;
}

export const BusinessLayout: React.FC<BusinessLayoutProps> = ({
  currentTab,
  onTabChange,
  children,
}) => {
  const { currentBusiness, businesses, setCurrentBusiness, orders } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Business orders count
  const businessOrders = orders.filter(
    (o) => o.businessId === currentBusiness.id || o.businessName === currentBusiness.name
  );
  const activeOrdersCount = businessOrders.filter(
    (o) => o.status !== 'DELIVERED' && o.status !== 'COMPLETED' && o.status !== 'CANCELLED'
  ).length;

  const navItems: { id: BusinessTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders & Dispatches', icon: Package, badge: activeOrdersCount > 0 ? activeOrdersCount : undefined },
    { id: 'catalog', label: 'Menu & Catalog', icon: UtensilsCrossed },
    { id: 'dispatch', label: 'Request Rider', icon: Bike },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'settlement', label: 'Settlement & Payouts', icon: Wallet },
    { id: 'profile', label: 'Store Settings', icon: Store },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#171717] flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:gap-6">
            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-neutral-600 hover:bg-neutral-100"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2">
              <Logo size="sm" />
              <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-wider bg-orange-100 text-[#FF6B35] px-2 py-0.5 rounded-full border border-orange-200">
                Merchant
              </span>
            </div>

            {/* Store Switcher (if multiple stores exist) */}
            <div className="relative group">
              <select
                aria-label="Select active merchant store"
                value={currentBusiness.id}
                onChange={(e) => {
                  const found = businesses.find((b) => b.id === e.target.value);
                  if (found) setCurrentBusiness(found);
                }}
                className="appearance-none bg-neutral-100 hover:bg-neutral-200/80 text-xs font-bold text-neutral-800 py-1.5 pl-3 pr-7 rounded-xl cursor-pointer focus:outline-none transition-colors border border-transparent shadow-2xs"
              >
                {businesses.map((biz) => (
                  <option key={biz.id} value={biz.id}>
                    🏪 {biz.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Quick Metrics & Store Status */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Today's Sales Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-100 text-xs font-semibold text-neutral-700">
              <span className="text-[10px] uppercase font-bold text-neutral-400">Today:</span>
              <span className="font-black text-neutral-900">₹{currentBusiness.revenueToday.toLocaleString()}</span>
            </div>

            {/* Active Status Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-black">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="hidden sm:inline">Store Open</span>
            </div>

            {/* Store Avatar */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-neutral-300 shrink-0">
                <img
                  src={currentBusiness.avatar}
                  alt={currentBusiness.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-neutral-900 leading-tight">
                  {currentBusiness.ownerName}
                </div>
                <div className="text-[10px] text-neutral-400 font-mono leading-tight">
                  {currentBusiness.category}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 bg-white px-4 py-3 space-y-1 animate-in slide-in-from-top-2 duration-200">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#FFF2EB] text-[#FF6B35]'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] bg-[#FF6B35] text-white px-1.5 py-0.2 rounded-full font-black">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Body with Desktop Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 flex-1 w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Desktop Sidebar Navigation (3 cols on md/lg) */}
        <aside className="hidden md:block md:col-span-3 lg:col-span-3 sticky top-20 space-y-2">
          <div className="bg-white rounded-3xl p-3 border border-neutral-200 shadow-xs space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#FF6B35] text-white shadow-sm shadow-[#FF6B35]/25 font-black'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                        isActive ? 'bg-white text-[#FF6B35]' : 'bg-[#FF6B35] text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Support Card in Sidebar */}
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-3xl p-4 text-white shadow-xs space-y-2 text-left">
            <span className="text-[10px] font-bold text-[#FF8255] uppercase tracking-wider block">
              QuickGo Merchant Desk
            </span>
            <p className="text-xs text-neutral-300">
              Need on-demand delivery fleet assistance or menu onboarding support?
            </p>
            <div className="text-[11px] font-mono text-neutral-400">
              📞 1800-QUICKGO • 24x7 Direct Merchant Line
            </div>
          </div>
        </aside>

        {/* Content Area (9 cols on md/lg) */}
        <main className="md:col-span-9 lg:col-span-9 w-full">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[96%] max-w-md bg-white/95 backdrop-blur-md border border-neutral-200 shadow-xl rounded-2xl p-1.5 flex items-center justify-around">
        <button
          onClick={() => onTabChange('dashboard')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all ${
            currentTab === 'dashboard' ? 'text-[#FF6B35] bg-[#FFF2EB]' : 'text-neutral-500'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 mb-0.5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => onTabChange('orders')}
          className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all ${
            currentTab === 'orders' ? 'text-[#FF6B35] bg-[#FFF2EB]' : 'text-neutral-500'
          }`}
        >
          <Package className="w-4 h-4 mb-0.5" />
          <span>Orders</span>
          {activeOrdersCount > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-[#FF6B35]" />
          )}
        </button>

        <button
          onClick={() => onTabChange('catalog')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all ${
            currentTab === 'catalog' ? 'text-[#FF6B35] bg-[#FFF2EB]' : 'text-neutral-500'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4 mb-0.5" />
          <span>Catalog</span>
        </button>

        <button
          onClick={() => onTabChange('dispatch')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all ${
            currentTab === 'dispatch' ? 'text-[#FF6B35] bg-[#FFF2EB]' : 'text-neutral-500'
          }`}
        >
          <Bike className="w-4 h-4 mb-0.5 text-[#FF6B35]" />
          <span>Dispatch</span>
        </button>

        <button
          onClick={() => onTabChange('settlement')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all ${
            currentTab === 'settlement' ? 'text-[#FF6B35] bg-[#FFF2EB]' : 'text-neutral-500'
          }`}
        >
          <Wallet className="w-4 h-4 mb-0.5" />
          <span>Payouts</span>
        </button>
      </nav>
    </div>
  );
};
