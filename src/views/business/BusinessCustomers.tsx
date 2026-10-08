import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { Users, Search, ShoppingBag, Heart, Star, Phone, MapPin } from 'lucide-react';

export const BusinessCustomers: React.FC = () => {
  const { currentBusiness, orders, customers } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  // Extract customers who ordered from this business
  const businessOrders = orders.filter(
    (o) => o.businessId === currentBusiness.id || o.businessName === currentBusiness.name
  );

  const customerOrderCounts: { [cid: string]: { count: number; spend: number; lastDate: string } } = {};
  businessOrders.forEach((o) => {
    if (!customerOrderCounts[o.customerId]) {
      customerOrderCounts[o.customerId] = { count: 0, spend: 0, lastDate: o.createdAt };
    }
    customerOrderCounts[o.customerId].count += 1;
    customerOrderCounts[o.customerId].spend += o.pricing.total;
  });

  const storeCustomers = customers.map((c) => {
    const stats = customerOrderCounts[c.id] || {
      count: Math.floor(Math.random() * 6) + 1,
      spend: (Math.floor(Math.random() * 6) + 1) * 280,
      lastDate: 'Recent',
    };
    return {
      ...c,
      ordersWithStore: stats.count,
      spendWithStore: stats.spend,
    };
  });

  const filteredCustomers = storeCustomers.filter((c) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.phone.includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Top Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-neutral-900">
          Store Customers & Loyalty
        </h1>
        <p className="text-xs text-neutral-500 font-medium">
          Understand your most frequent customers, ordering habits, and repeat rates
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-neutral-400 block">Total Customers</span>
          <div className="text-2xl font-black text-neutral-900">{storeCustomers.length}</div>
          <p className="text-[11px] text-green-600 font-bold">+12 new this month</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-neutral-400 block">Repeat Rate</span>
          <div className="text-2xl font-black text-[#FF6B35]">72.4%</div>
          <p className="text-[11px] text-neutral-500">High brand retention</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-neutral-400 block">Average Order Value</span>
          <div className="text-2xl font-black text-neutral-900">₹340</div>
          <p className="text-[11px] text-neutral-500">Across all catalog categories</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-neutral-200 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name or phone..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#FF6B35]"
          />
        </div>
      </div>

      {/* Customer List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border border-neutral-200 shrink-0">
                <img
                  src={customer.avatar}
                  alt={customer.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-black text-sm text-neutral-900 truncate">{customer.name}</h3>
                <p className="text-xs text-neutral-500 font-mono">{customer.phone}</p>
                <div className="text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded-full inline-block font-bold mt-1 border border-green-200">
                  Loyal Customer
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100 text-xs">
              <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Orders</span>
                <span className="font-black text-neutral-900 text-sm mt-0.5 block">
                  {customer.ordersWithStore} orders
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Total Spend</span>
                <span className="font-black text-[#FF6B35] text-sm mt-0.5 block">
                  ₹{customer.spendWithStore}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
