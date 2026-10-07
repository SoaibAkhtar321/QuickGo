import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { PassPlan } from '../../types';
import {
  Sparkles,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Clock,
  ArrowRight,
  TrendingDown,
  Gift,
  AlertCircle,
  RotateCcw,
  Bike,
  Check,
} from 'lucide-react';

interface CustomerPassesProps {
  onPassPurchased?: () => void;
}

export const CustomerPasses: React.FC<CustomerPassesProps> = ({ onPassPurchased }) => {
  const {
    currentCustomer,
    passPlans,
    customerPasses,
    purchasePass,
    renewPass,
    cancelPass,
    getActivePassForCustomer,
  } = useApp();

  const [selectedPlanId, setSelectedPlanId] = useState<string>('pass-unlimited');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const activePass = getActivePassForCustomer(currentCustomer.id);

  const handleBuy = (planId: string) => {
    purchasePass(planId, currentCustomer.id);
    const plan = passPlans.find((p) => p.id === planId);
    setSuccessMessage(`${plan?.name || 'QuickPass'} activated successfully! Free deliveries applied.`);
    if (onPassPurchased) onPassPurchased();
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FF6B35]/20 border border-[#FF6B35]/40 px-3 py-1 text-xs font-black text-[#FF8255]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>QUICKPASS SUBSCRIPTION</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Unlimited Free Deliveries. <br className="hidden sm:inline" />
            Zero Platform Fees. Priority Matching.
          </h1>

          <p className="text-xs md:text-sm text-neutral-300 font-medium">
            Join thousands of smart QuickGo customers who save an average of ₹1,200+ every month with a service pass.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-neutral-300 font-semibold">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-400" /> ₹0 Delivery charges
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-400" /> ₹0 Surge during rain & rush
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-400" /> Under 3-min rider dispatch
            </span>
          </div>
        </div>

        {/* Ambient glow decoration */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-[#FF6B35]/15 blur-3xl pointer-events-none" />
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-2xl text-green-800 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in duration-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-green-700 hover:text-green-900 text-xs font-black"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Active Pass Status Card (if user has active pass) */}
      {activePass && (
        <div className="bg-white rounded-3xl p-6 border-2 border-[#FF6B35]/30 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF9F5] border border-[#FF6B35]/30 text-[#FF6B35] flex items-center justify-center font-black text-xl">
                🎫
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-neutral-900">{activePass.planName}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-green-100 text-green-800 border border-green-200">
                    ACTIVE
                  </span>
                </div>
                <p className="text-xs text-neutral-500 font-medium">
                  Valid until <span className="font-bold text-neutral-800">{activePass.expiresAt}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => renewPass(activePass.id)}
                className="px-3.5 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Renew Pass
              </button>
              <button
                onClick={() => cancelPass(activePass.id)}
                className="px-3 py-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-500 text-xs font-medium transition-colors"
              >
                Cancel Auto-Renew
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Deliveries Used</span>
              <div className="text-lg font-black text-neutral-900 mt-0.5">
                {activePass.usageCount}{' '}
                <span className="text-xs text-neutral-400 font-normal">
                  {activePass.maxOrders === -1 ? '(Unlimited quota)' : `/ ${activePass.maxOrders} orders`}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-green-50 border border-green-100">
              <span className="text-[10px] uppercase font-bold text-green-700 block">Total Money Saved</span>
              <div className="text-lg font-black text-green-800 mt-0.5">
                ₹{activePass.totalSaved}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FFF9F5] border border-[#FF6B35]/20">
              <span className="text-[10px] uppercase font-bold text-[#FF6B35] block">Next Auto-Renewal</span>
              <div className="text-lg font-black text-neutral-900 mt-0.5">
                {activePass.autoRenew ? activePass.expiresAt : 'Off'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Available Pass Plans Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-black text-neutral-900">Choose Your Pass Plan</h2>
          <p className="text-xs text-neutral-500 font-medium">
            Select a plan that fits your everyday delivery habits. Switch or cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {passPlans.map((plan) => {
            const isCurrent = activePass?.planId === plan.id;
            const isSelected = selectedPlanId === plan.id;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`relative rounded-3xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                  isCurrent
                    ? 'border-green-500 bg-green-50/20 shadow-md ring-2 ring-green-500/20'
                    : isSelected
                    ? 'border-[#FF6B35] bg-white shadow-lg ring-2 ring-[#FF6B35]/20'
                    : 'border-neutral-200 bg-white hover:border-neutral-300 shadow-xs'
                }`}
              >
                {/* Popular or Category Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      plan.popular
                        ? 'bg-[#FF6B35] text-white'
                        : 'bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    {plan.badge}
                  </span>

                  {isCurrent && (
                    <span className="text-[10px] font-black text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                      Current Pass
                    </span>
                  )}
                </div>

                {/* Plan Title & Tagline */}
                <div className="space-y-1 mb-4">
                  <h3 className="text-base font-black text-neutral-900">{plan.name}</h3>
                  <p className="text-xs text-neutral-500 leading-snug">{plan.tagline}</p>
                </div>

                {/* Pricing Block */}
                <div className="mb-4 pb-4 border-b border-neutral-100">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-neutral-900">₹{plan.price}</span>
                    <span className="text-xs text-neutral-400 font-bold line-through">₹{plan.originalPrice}</span>
                    <span className="text-xs text-neutral-500 font-medium">/{plan.periodLabel}</span>
                  </div>
                  <span className="text-[10px] text-green-600 font-bold">
                    Save {Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)}% off standard rates
                  </span>
                </div>

                {/* Benefits List */}
                <div className="space-y-2 mb-5 flex-1">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-neutral-700">
                      <Check className="w-3.5 h-3.5 text-green-600 mt-0.5 shrink-0" />
                      <span className="leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBuy(plan.id);
                  }}
                  className={`w-full py-2.5 rounded-xl text-xs font-black transition-all ${
                    isCurrent
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : plan.popular
                      ? 'bg-[#FF6B35] text-white hover:bg-[#E85A2A] shadow-md shadow-[#FF6B35]/20'
                      : 'bg-neutral-900 text-white hover:bg-neutral-800'
                  }`}
                >
                  {isCurrent ? 'Renew Current Pass' : `Get ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* How it Works / FAQ Cards */}
      <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
        <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wider">
          How QuickPass Works
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF6B35] flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h4 className="font-black text-neutral-900 text-sm">Instant Activation</h4>
            <p className="text-neutral-500">
              Your pass activates the millisecond you complete payment. Zero waiting periods.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h4 className="font-black text-neutral-900 text-sm">Automatic Discount at Checkout</h4>
            <p className="text-neutral-500">
              When booking parcel, food, or grocery runs, your delivery fee and platform fee are automatically zeroed out.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h4 className="font-black text-neutral-900 text-sm">Priority Rider Dispatch</h4>
            <p className="text-neutral-500">
              Passholders are matched ahead of the standard queue with our top-rated 4.8+ delivery riders.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
