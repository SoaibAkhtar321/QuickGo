import React from 'react';
import { Logo } from '../../components/ui/Logo';
import { useApp } from '../../store/AppContext';
import {
  Bike,
  Home,
  Navigation,
  DollarSign,
  History,
  User,
  Power,
  ShieldCheck,
} from 'lucide-react';

export type PartnerTab = 'duty' | 'active-delivery' | 'earnings' | 'history' | 'profile' | 'home' | 'active';

interface PartnerLayoutProps {
  activeTab?: PartnerTab;
  currentTab?: PartnerTab;
  setActiveTab?: (tab: any) => void;
  setCurrentTab?: (tab: any) => void;
  children: React.ReactNode;
}

export const PartnerLayout: React.FC<PartnerLayoutProps> = ({
  activeTab,
  currentTab,
  setActiveTab,
  setCurrentTab,
  children,
}) => {
  const selectedTab = activeTab || currentTab || 'duty';
  const handleTabChange = (tab: PartnerTab) => {
    if (setActiveTab) setActiveTab(tab);
    if (setCurrentTab) setCurrentTab(tab);
  };

  const { currentPartner, togglePartnerOnline, orders } = useApp();

  const activeJob = orders.find(
    (o) =>
      o.partnerId === currentPartner.id &&
      o.status !== 'DELIVERED' &&
      o.status !== 'COMPLETED' &&
      o.status !== 'CANCELLED' &&
      o.status !== 'FAILED'
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#171717] flex flex-col">
      {/* Top Header - Responsive Across Desktop & Mobile */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Logo size="sm" showTagline={false} />
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-extrabold text-[#FF6B35] bg-[#FFF2EB] px-2.5 py-1 rounded-full border border-[#FF6B35]/20 uppercase tracking-wider">
                Partner Cockpit
              </span>
              <span className="hidden sm:inline-block text-xs text-neutral-400 font-medium">
                • Noida Sector 62 Hub
              </span>
            </div>
          </div>

          {/* Right Header Status & Controls */}
          <div className="flex items-center gap-3">
            {/* Quick Earnings Chip on Desktop */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 border border-neutral-200 text-xs font-semibold">
              <span className="text-neutral-500">Today:</span>
              <span className="font-extrabold text-[#16A34A]">₹{currentPartner.earningsToday}</span>
            </div>

            {/* Vehicle Chip */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-medium text-neutral-700">
              <Bike className="w-3.5 h-3.5 text-[#FF6B35]" />
              <span>{currentPartner.vehicle}</span>
            </div>

            {/* Online / Offline Toggle Button */}
            <button
              onClick={togglePartnerOnline}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all shadow-xs ${
                currentPartner.isOnline
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-600/20'
                  : 'bg-neutral-800 hover:bg-neutral-900 text-neutral-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  currentPartner.isOnline ? 'bg-white animate-pulse' : 'bg-neutral-500'
                }`}
              />
              <Power className="w-3.5 h-3.5" />
              <span>{currentPartner.isOnline ? 'ON DUTY' : 'OFF DUTY'}</span>
            </button>

            {/* Rider Avatar */}
            <button
              onClick={() => handleTabChange('profile')}
              className="flex items-center gap-2 p-1 pr-2.5 rounded-full border border-neutral-200 hover:border-[#FF6B35] transition-colors"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border border-neutral-300">
                <img
                  src={currentPartner.avatar}
                  alt={currentPartner.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-xs font-bold text-neutral-900 leading-tight">
                  {currentPartner.name.split(' ')[0]}
                </div>
                <div className="text-[10px] text-amber-600 font-bold leading-tight">
                  ⭐ {currentPartner.rating}
                </div>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container with Desktop Sidebar */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full pb-20 md:pb-8">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-neutral-200 shrink-0 sticky top-16 h-[calc(100vh-4rem)] p-4 space-y-5 overflow-y-auto">
          {/* Partner Profile Badge */}
          <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-[#FF6B35]">
                <img
                  src={currentPartner.avatar}
                  alt={currentPartner.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span
                className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                  currentPartner.isOnline ? 'bg-green-500' : 'bg-neutral-400'
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-extrabold text-neutral-900 truncate">
                {currentPartner.name}
              </h4>
              <p className="text-[11px] text-neutral-500 font-medium truncate">
                {currentPartner.vehicle}
              </p>
              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 mt-0.5">
                <span>⭐ {currentPartner.rating}</span>
                <span className="text-neutral-400">•</span>
                <span className="text-green-600">KYC Verified</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              id="partner-tab-duty"
              onClick={() => handleTabChange('duty')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                selectedTab === 'duty' || selectedTab === 'home'
                  ? 'text-[#FF6B35] bg-[#FFF2EB] shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Home className="w-4 h-4" />
                <span>Duty Console</span>
              </div>
              {currentPartner.isOnline && (
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              )}
            </button>

            <button
              id="partner-tab-active"
              onClick={() => handleTabChange('active-delivery')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                selectedTab === 'active-delivery' || selectedTab === 'active'
                  ? 'text-[#FF6B35] bg-[#FFF2EB] shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Navigation className="w-4 h-4" />
                <span>Active Trip</span>
              </div>
              {activeJob && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-green-500 text-white animate-pulse">
                  IN PROGRESS
                </span>
              )}
            </button>

            <button
              id="partner-tab-earnings"
              onClick={() => handleTabChange('earnings')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                selectedTab === 'earnings'
                  ? 'text-[#FF6B35] bg-[#FFF2EB] shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <DollarSign className="w-4 h-4" />
                <span>Earnings & Payouts</span>
              </div>
              <span className="text-[11px] font-extrabold text-[#16A34A]">
                ₹{currentPartner.earningsToday}
              </span>
            </button>

            <button
              id="partner-tab-history"
              onClick={() => handleTabChange('history')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                selectedTab === 'history'
                  ? 'text-[#FF6B35] bg-[#FFF2EB] shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <History className="w-4 h-4" />
                <span>Trip History</span>
              </div>
              <span className="text-[10px] bg-neutral-200 text-neutral-700 font-bold px-1.5 py-0.5 rounded-full">
                {currentPartner.totalDeliveries % 20 || 14}
              </span>
            </button>

            <button
              id="partner-tab-profile"
              onClick={() => handleTabChange('profile')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                selectedTab === 'profile'
                  ? 'text-[#FF6B35] bg-[#FFF2EB] shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4" />
                <span>Profile & KYC</span>
              </div>
            </button>
          </nav>

          {/* Shift Performance Summary Card in Sidebar */}
          <div className="p-4 bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl text-white space-y-2.5 mt-auto">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Shift Status
              </span>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  currentPartner.isOnline
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-neutral-700 text-neutral-400'
                }`}
              >
                {currentPartner.isOnline ? 'ACTIVE' : 'IDLE'}
              </span>
            </div>
            <div className="text-sm font-extrabold text-white">
              {currentPartner.isOnline ? 'Online • 4h 15m' : 'Logged off'}
            </div>
            <div className="text-[11px] text-neutral-400">
              Zone: Sector 62 & Metro Stations
            </div>
            <div className="pt-2 border-t border-neutral-700/80 flex items-center justify-between text-[11px]">
              <span className="text-neutral-400">Acceptance Rate</span>
              <span className="font-bold text-[#FF8C5A]">98.4%</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area - Full-width desktop responsive container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar - Only shown on screens smaller than md */}
      <nav className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-md bg-white/95 backdrop-blur-md border border-neutral-200 shadow-xl rounded-2xl p-1.5 flex items-center justify-around">
        <button
          id="partner-tab-duty"
          onClick={() => handleTabChange('duty')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-bold transition-all ${
            selectedTab === 'duty' || selectedTab === 'home'
              ? 'text-[#FF6B35] bg-[#FFF2EB]'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Home className="w-4 h-4 mb-0.5" />
          <span>Duty</span>
        </button>

        <button
          id="partner-tab-active"
          onClick={() => handleTabChange('active-delivery')}
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-bold transition-all ${
            selectedTab === 'active-delivery' || selectedTab === 'active'
              ? 'text-[#FF6B35] bg-[#FFF2EB]'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Navigation className="w-4 h-4 mb-0.5" />
          <span>Trip</span>
          {activeJob && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-[#16A34A] animate-ping" />
          )}
        </button>

        <button
          id="partner-tab-earnings"
          onClick={() => handleTabChange('earnings')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-bold transition-all ${
            selectedTab === 'earnings'
              ? 'text-[#FF6B35] bg-[#FFF2EB]'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <DollarSign className="w-4 h-4 mb-0.5" />
          <span>Earnings</span>
        </button>

        <button
          id="partner-tab-history"
          onClick={() => handleTabChange('history')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-bold transition-all ${
            selectedTab === 'history'
              ? 'text-[#FF6B35] bg-[#FFF2EB]'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <History className="w-4 h-4 mb-0.5" />
          <span>History</span>
        </button>

        <button
          id="partner-tab-profile"
          onClick={() => handleTabChange('profile')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-bold transition-all ${
            selectedTab === 'profile'
              ? 'text-[#FF6B35] bg-[#FFF2EB]'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <User className="w-4 h-4 mb-0.5" />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
};
