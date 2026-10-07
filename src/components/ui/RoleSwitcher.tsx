import React from 'react';
import { useApp } from '../../store/AppContext';
import { PartnerMenuDrawer } from './PartnerMenuDrawer';
import { RegisterStoreModal } from './RegisterStoreModal';
import {
  RotateCcw,
  Store,
  Bike,
  ShieldAlert,
  ShoppingBag,
  Menu,
  ChevronLeft,
} from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const {
    currentRole,
    setRole,
    resetDemoData,
    orders,
    currentPartner,
    currentBusiness,
    isPartnerMenuOpen,
    openPartnerMenu,
    closePartnerMenu,
    isRegisterStoreOpen,
    openRegisterStore,
    closeRegisterStore,
  } = useApp();

  // Active order indicator for partner/admin
  const activeOrder = orders.find(
    (o) =>
      o.status !== 'DELIVERED' &&
      o.status !== 'COMPLETED' &&
      o.status !== 'CANCELLED' &&
      o.status !== 'FAILED'
  );

  // If role is default customer, do NOT show any top role switcher bar.
  // The customer views the customer app by default, and accesses partner/store through the three-lines button in the header!
  if (currentRole === 'customer') {
    return (
      <>
        <PartnerMenuDrawer
          isOpen={isPartnerMenuOpen}
          onClose={closePartnerMenu}
          onOpenRegisterStore={openRegisterStore}
        />
        <RegisterStoreModal
          isOpen={isRegisterStoreOpen}
          onClose={closeRegisterStore}
        />
      </>
    );
  }

  // When in Merchant, Delivery Partner, or Super Admin mode:
  // Render a clean, helpful top portal banner with direct "Back to Customer Store" and 3-lines menu button
  const getRoleBadge = () => {
    switch (currentRole) {
      case 'business':
        return {
          label: `Store: ${currentBusiness.name}`,
          icon: Store,
          color: 'bg-red-50 text-red-600 border-red-200',
        };
      case 'partner':
        return {
          label: `Rider: ${currentPartner.name}`,
          icon: Bike,
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      case 'admin':
        return {
          label: 'Super Admin Portal',
          icon: ShieldAlert,
          color: 'bg-purple-50 text-purple-700 border-purple-200',
        };
      default:
        return {
          label: 'Partner Mode',
          icon: Store,
          color: 'bg-neutral-100 text-neutral-700 border-neutral-200',
        };
    }
  };

  const badge = getRoleBadge();
  const Icon = badge.icon;

  return (
    <>
      <header className="h-14 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-3 sm:px-6 shrink-0 sticky top-0 z-50 shadow-xs">
        {/* Brand Logo & Current Portal Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#DC2626] rounded-lg flex items-center justify-center shadow-xs">
              <span className="text-white font-black text-sm">Q</span>
            </div>
            <span className="text-base sm:text-lg font-black tracking-tight text-[#DC2626] hidden xs:inline">
              Quick<span className="text-[#16A34A]">Fresh</span>
            </span>
          </div>

          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${badge.color} max-w-[200px] sm:max-w-xs truncate`}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{badge.label}</span>
          </div>
        </div>

        {/* Right Controls: Back to Customer Store + Three-Line Menu + Reset */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Back to Customer Store (Default View) */}
          <button
            id="btn-return-customer-store"
            onClick={() => setRole('customer')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold bg-neutral-900 hover:bg-neutral-800 text-white shadow-xs transition-transform active:scale-95 cursor-pointer"
            title="Return to Customer Shopping Experience"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Customer Store</span>
            <span className="sm:hidden">Store View</span>
          </button>

          {/* Three-Line Menu Button */}
          <button
            id="btn-role-three-line-menu"
            onClick={openPartnerMenu}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-neutral-800 text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Open Partner & Store Portals"
          >
            <Menu className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden md:inline">Portals</span>
          </button>

          {/* Reset Demo Simulation Data */}
          <button
            onClick={resetDemoData}
            title="Reset Simulation Demo Data"
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Global Drawers & Modals */}
      <PartnerMenuDrawer
        isOpen={isPartnerMenuOpen}
        onClose={closePartnerMenu}
        onOpenRegisterStore={openRegisterStore}
      />
      <RegisterStoreModal
        isOpen={isRegisterStoreOpen}
        onClose={closeRegisterStore}
      />
    </>
  );
};
