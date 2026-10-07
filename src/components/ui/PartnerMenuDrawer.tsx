import React from 'react';
import { useApp } from '../../store/AppContext';
import { UserRole } from '../../types';
import {
  Store,
  Bike,
  ShieldAlert,
  X,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  UserCheck,
  Zap,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface PartnerMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegisterStore: () => void;
}

export const PartnerMenuDrawer: React.FC<PartnerMenuDrawerProps> = ({
  isOpen,
  onClose,
  onOpenRegisterStore,
}) => {
  const {
    currentRole,
    setRole,
    resetDemoData,
    businesses,
    currentBusiness,
    setCurrentBusiness,
    orders,
  } = useApp();

  if (!isOpen) return null;

  const activeOrder = orders.find(
    (o) =>
      o.status !== 'DELIVERED' &&
      o.status !== 'COMPLETED' &&
      o.status !== 'CANCELLED' &&
      o.status !== 'FAILED'
  );

  const handleLoginAsStore = (businessId?: string) => {
    if (businessId) {
      const biz = businesses.find((b) => b.id === businessId);
      if (biz) setCurrentBusiness(biz);
    }
    setRole('business');
    onClose();
  };

  const handleLoginAsPartner = () => {
    setRole('partner');
    onClose();
  };

  const handleLoginAsAdmin = () => {
    setRole('admin');
    onClose();
  };

  const handleReturnToCustomer = () => {
    setRole('customer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-neutral-200 overflow-hidden animate-in slide-in-from-right duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white flex items-center justify-between shrink-0 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/20 font-black text-white text-base">
                ☰
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white leading-tight">
                  Partner & Seller Portals
                </h3>
                <p className="text-[11px] text-red-100 font-medium">
                  Join or access merchant, fleet & admin systems
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-left">
            {/* If currently in merchant/partner/admin mode, allow easy return to Customer store */}
            {currentRole !== 'customer' && (
              <div className="bg-emerald-50 border-2 border-emerald-500/30 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-xs">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    Current Mode: {currentRole.toUpperCase()}
                  </span>
                  <p className="text-xs font-black text-neutral-900 mt-1">
                    Customer Shopping Experience
                  </p>
                  <p className="text-[11px] text-neutral-600">
                    Switch back to default customer store & cart
                  </p>
                </div>
                <button
                  onClick={handleReturnToCustomer}
                  id="btn-switch-to-customer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-3.5 py-2 rounded-xl transition-transform active:scale-95 shrink-0 flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Customer View</span>
                </button>
              </div>
            )}

            {/* SECTION 1: STORE / SELLER NETWORK (THE CORE FEATURE REQUESTED) */}
            <div className="bg-neutral-50 rounded-2xl border border-neutral-200/80 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900">
                      Merchant / Store Partner
                    </h4>
                    <p className="text-[11px] text-neutral-500 font-medium">
                      Receive local 10-minute delivery orders
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold text-red-600 bg-red-100/70 px-2 py-0.5 rounded-full">
                  Instant Dispatch
                </span>
              </div>

              {/* Two Direct Action Buttons: Log in as a Store & Register as a Store */}
              <div className="grid grid-cols-1 gap-2 pt-1">
                {/* 1. Log in as a Store */}
                <button
                  id="btn-login-as-store"
                  onClick={() => handleLoginAsStore()}
                  className="w-full bg-white hover:bg-neutral-100/80 border border-neutral-200 rounded-xl p-3 flex items-center justify-between text-left transition-all hover:border-red-300 shadow-2xs group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                      <Store className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-black text-neutral-900">
                        Log in as a Store
                      </div>
                      <div className="text-[11px] text-neutral-500 truncate">
                        Active: {currentBusiness.name}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </button>

                {/* 2. Register as a Store */}
                <button
                  id="btn-register-as-store"
                  onClick={() => {
                    onClose();
                    onOpenRegisterStore();
                  }}
                  className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl p-3 flex items-center justify-between text-left transition-all shadow-md shadow-red-600/20 active:scale-98 group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/20 text-white flex items-center justify-center backdrop-blur-xs">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-white flex items-center gap-1.5">
                        <span>Register as a Store</span>
                        <span className="bg-yellow-400 text-neutral-900 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
                          New
                        </span>
                      </div>
                      <div className="text-[11px] text-red-100">
                        Join our delivery network in 2 minutes
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
                </button>
              </div>

              {/* Outlet switcher dropdown */}
              {businesses.length > 1 && (
                <div className="pt-1 border-t border-neutral-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-neutral-500 font-semibold">Switch Outlet:</span>
                  <select
                    value={currentBusiness.id}
                    onChange={(e) => handleLoginAsStore(e.target.value)}
                    className="bg-white border border-neutral-200 rounded-lg py-1 px-2 text-[11px] font-bold text-neutral-800 max-w-[190px] truncate cursor-pointer"
                  >
                    {businesses.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.category})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* SECTION 2: DELIVERY PARTNER */}
            <div className="bg-neutral-50 rounded-2xl border border-neutral-200/80 p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Bike className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900">
                      Delivery Fleet Partner
                    </h4>
                    <p className="text-[11px] text-neutral-500 font-medium">
                      Earn with flexible 10-min delivery runs
                    </p>
                  </div>
                </div>
                {activeOrder && (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </div>

              <button
                id="btn-login-as-partner"
                onClick={handleLoginAsPartner}
                className="w-full bg-white hover:bg-neutral-100/80 border border-neutral-200 rounded-xl p-3 flex items-center justify-between text-left transition-all hover:border-emerald-300 shadow-2xs group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
                    <Bike className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-neutral-900">
                      Log in as Delivery Partner
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      Open rider delivery cockpit & live orders
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            </div>

            {/* SECTION 3: SUPER ADMIN */}
            <div className="bg-neutral-50 rounded-2xl border border-neutral-200/80 p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900">
                      Platform Operations
                    </h4>
                    <p className="text-[11px] text-neutral-500 font-medium">
                      System control center & analytics
                    </p>
                  </div>
                </div>
              </div>

              <button
                id="btn-login-as-admin"
                onClick={handleLoginAsAdmin}
                className="w-full bg-white hover:bg-neutral-100/80 border border-neutral-200 rounded-xl p-3 flex items-center justify-between text-left transition-all hover:border-purple-300 shadow-2xs group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center group-hover:bg-purple-50 group-hover:text-purple-700 transition-colors">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-neutral-900">
                      Super Admin Portal
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      Live dispatch radar, GMV & configurations
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            </div>
          </div>

          {/* Footer Controls: Reset Simulation Data */}
          <div className="p-4 bg-neutral-100/80 border-t border-neutral-200 flex items-center justify-between gap-3 shrink-0">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                Demo Simulation
              </p>
              <p className="text-[11px] font-semibold text-neutral-800">
                QuickFresh 10-Min Engine
              </p>
            </div>

            <button
              onClick={() => {
                resetDemoData();
                onClose();
              }}
              title="Reset Simulation Demo Data"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-200/80 text-neutral-700 text-xs font-bold border border-neutral-200 transition-colors shadow-2xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
