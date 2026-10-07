import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { PassPlan, CustomerPass } from '../../types';
import {
  Sparkles,
  Search,
  CheckCircle2,
  Users,
  DollarSign,
  TrendingUp,
  Tag,
  ShieldCheck,
  RotateCcw,
  Zap,
} from 'lucide-react';

export const AdminPasses: React.FC = () => {
  const { passPlans, customerPasses, customers, renewPass, cancelPass } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const activeSubscribers = customerPasses.filter((p) => p.status === 'ACTIVE');
  const totalSavedAll = customerPasses.reduce((acc, p) => acc + (p.totalSaved || 0), 0);
  const totalRevenue = customerPasses.reduce((acc, p) => {
    const plan = passPlans.find((pl) => pl.id === p.planId);
    return acc + (plan?.price || 199);
  }, 0);

  const filteredSubs = customerPasses.filter((p) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const customer = customers.find((c) => c.id === p.customerId);
      return (
        p.planName.toLowerCase().includes(q) ||
        customer?.name.toLowerCase().includes(q) ||
        customer?.phone.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-neutral-900">
            QuickPass Plans & Subscriptions
          </h1>
          <p className="text-xs text-neutral-500 font-medium">
            Monitor membership passes, subscription retention, customer savings, and plan quotas
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-xl">
            Pass System: Active & Automated
          </span>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-neutral-400 block">Active Subscribers</span>
          <div className="text-2xl font-black text-neutral-900 mt-0.5">{activeSubscribers.length}</div>
          <p className="text-[11px] text-green-600 font-bold mt-1">94% Retention Rate</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-neutral-400 block">Subscription Revenue</span>
          <div className="text-2xl font-black text-[#FF6B35] mt-0.5">₹{totalRevenue.toLocaleString()}</div>
          <p className="text-[11px] text-neutral-500 mt-1">Direct upfront accruals</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-neutral-400 block">Customer Savings Given</span>
          <div className="text-2xl font-black text-green-700 mt-0.5">₹{totalSavedAll.toLocaleString()}</div>
          <p className="text-[11px] text-neutral-500 mt-1">Delivery fee discounts applied</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-neutral-400 block">Total Active Plans</span>
          <div className="text-2xl font-black text-neutral-900 mt-0.5">{passPlans.length}</div>
          <p className="text-[11px] text-neutral-500 mt-1">Unlimited, Foodie, Courier, Eco</p>
        </div>
      </div>

      {/* Pass Plans Grid */}
      <div className="space-y-3">
        <h2 className="text-base font-black text-neutral-900">Configured Pass Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {passPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase text-[#FF6B35] bg-orange-50 px-2 py-0.5 rounded">
                  {plan.badge}
                </span>
                <span className="font-black text-base text-neutral-900">₹{plan.price}</span>
              </div>

              <div>
                <h3 className="font-black text-sm text-neutral-900">{plan.name}</h3>
                <p className="text-xs text-neutral-500 mt-0.5 leading-snug">{plan.tagline}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100 text-[11px] space-y-1 text-neutral-600">
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <strong className="text-neutral-900">{plan.durationDays} Days</strong>
                </div>
                <div className="flex justify-between">
                  <span>Max Deliveries:</span>
                  <strong className="text-neutral-900">
                    {plan.maxOrders === -1 ? 'Unlimited' : `${plan.maxOrders} orders`}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Priority Match:</span>
                  <strong className="text-green-600">Enabled</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscriber Roster */}
      <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-black text-neutral-900">Active Pass Subscribers</h2>
            <p className="text-xs text-neutral-500">Live roster of users with active pass subscriptions</p>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subscriber..."
              className="w-full pl-8 pr-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-neutral-100 text-neutral-400 uppercase text-[10px] font-bold">
                <th className="pb-3">Customer</th>
                <th className="pb-3">Plan Subscribed</th>
                <th className="pb-3">Deliveries Used</th>
                <th className="pb-3">Savings</th>
                <th className="pb-3">Expires On</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredSubs.map((sub) => {
                const customer = customers.find((c) => c.id === sub.customerId);
                return (
                  <tr key={sub.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-3 font-bold text-neutral-900">
                      {customer?.name || sub.customerId}
                      <span className="block font-mono text-[10px] text-neutral-400 font-normal">
                        {customer?.phone}
                      </span>
                    </td>
                    <td className="py-3 font-semibold text-neutral-700">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#FF6B35]" /> {sub.planName}
                      </span>
                    </td>
                    <td className="py-3 font-medium text-neutral-600">
                      {sub.usageCount} {sub.maxOrders === -1 ? 'orders' : `/ ${sub.maxOrders}`}
                    </td>
                    <td className="py-3 font-black text-green-700">₹{sub.totalSaved}</td>
                    <td className="py-3 text-neutral-600 font-mono text-[11px]">{sub.expiresAt}</td>
                    <td className="py-3 text-right space-x-2">
                      <button
                        onClick={() => renewPass(sub.id)}
                        className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-[10px]"
                      >
                        Extend
                      </button>
                      <button
                        onClick={() => cancelPass(sub.id)}
                        className="px-2 py-1 rounded-lg text-red-600 hover:bg-red-50 text-[10px] font-bold"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
