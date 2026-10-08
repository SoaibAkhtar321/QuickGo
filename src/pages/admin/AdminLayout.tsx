import React, { useState } from 'react';
import { Logo } from '../../components/ui/Logo';
import { useApp } from '../../store/AppContext';
import {
  LayoutDashboard,
  Package,
  MapPin,
  Users,
  Bike,
  Store,
  Sparkles,
  Layers,
  DollarSign,
  CreditCard,
  BarChart3,
  HelpCircle,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  RotateCcw,
} from 'lucide-react';

export type AdminTab =
  | 'dashboard'
  | 'orders'
  | 'live-map'
  | 'customers'
  | 'partners'
  | 'businesses'
  | 'passes'
  | 'services'
  | 'pricing'
  | 'payments'
  | 'analytics'
  | 'support'
  | 'settings';

interface AdminLayoutProps {
  currentTab: AdminTab;
  setCurrentTab: (tab: AdminTab) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  setCurrentTab,
  children,
}) => {
  const { orders = [], partners = [], businesses = [], customerPasses = [], tickets = [], supportTickets } = useApp();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const activeOrdersCount = orders.filter(
    (o) =>
      o &&
      o.status !== 'DELIVERED' &&
      o.status !== 'COMPLETED' &&
      o.status !== 'CANCELLED' &&
      o.status !== 'FAILED'
  ).length;

  const onlinePartnersCount = partners.filter((p) => p && p.isOnline).length;
  const ticketList = supportTickets || tickets || [];
  const openTicketsCount = ticketList.filter(
    (t) => t && (t.status === 'OPEN' || t.status === 'IN_PROGRESS')
  ).length;

  const navItems: { id: AdminTab; label: string; icon: any; badge?: number | string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders Dispatch', icon: Package, badge: activeOrdersCount },
    { id: 'live-map', label: 'Fleet Live Map', icon: MapPin, badge: `${onlinePartnersCount} live` },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'partners', label: 'Delivery Fleet', icon: Bike, badge: onlinePartnersCount },
    { id: 'businesses', label: 'Merchants & Outlets', icon: Store, badge: businesses.length },
    { id: 'passes', label: 'QuickPass Plans', icon: Sparkles, badge: customerPasses.filter((p) => p.status === 'ACTIVE').length },
    { id: 'services', label: 'Services Catalog', icon: Layers },
    { id: 'pricing', label: 'Pricing & Surge', icon: DollarSign },
    { id: 'payments', label: 'Transactions', icon: CreditCard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'support', label: 'Helpdesk Tickets', icon: HelpCircle, badge: openTicketsCount },
    { id: 'settings', label: 'Platform Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#171717] flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-neutral-200 shrink-0 sticky top-0 h-screen overflow-y-auto">
        {/* Sidebar Header */}
        <div className="p-5 border-b border-neutral-200">
          <Logo size="md" showTagline={false} />
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-100">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
              Super Admin Control
            </span>
            <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
              Platform Root
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`admin-nav-${item.id}`}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                  isActive
                    ? 'bg-[#171717] text-white shadow-xs'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${isActive ? 'text-[#FF6B35]' : 'text-neutral-500'}`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-[#FF6B35] text-white'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-neutral-200 space-y-2">
          <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 text-xs">
            <div className="font-bold text-neutral-900">Delhi NCR Operations</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">
              Sector 62, 18, Indirapuram, Vaishali
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-30 bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
        <Logo size="sm" />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-2 rounded-xl bg-neutral-100 text-neutral-700"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto space-y-2">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <span className="font-bold text-sm text-neutral-900">Super Admin Operations Menu</span>
              <button
                onClick={() => setMobileNavOpen(false)}
                className="p-1 text-neutral-500 hover:text-neutral-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold text-left ${
                    isActive ? 'bg-[#171717] text-white' : 'text-neutral-700 bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-[#FF6B35]" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded-full font-mono">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20">
        {/* Top Operations Header Bar */}
        <header className="hidden md:flex bg-white border-b border-neutral-200 px-8 py-3.5 items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search orders, partners, customers..."
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-1.5 pl-9 pr-4 text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#FF6B35]"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-700 bg-neutral-100 px-3 py-1.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Fleet Online: {onlinePartnersCount} Riders</span>
            </div>
          </div>
        </header>

        {/* Main View Container */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};
