import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge';
import { Package, Clock, Calendar, CheckCircle2, Search, Filter, ArrowUpRight } from 'lucide-react';

interface PartnerHistoryProps {
  onSelectOrder?: (orderId: string) => void;
}

export const PartnerHistory: React.FC<PartnerHistoryProps> = ({ onSelectOrder }) => {
  const { orders, currentPartner } = useApp();
  const [filter, setFilter] = useState<'ALL' | 'DELIVERED' | 'ACTIVE' | 'CANCELLED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const partnerOrders = orders.filter(
    (o) => o.partnerId === currentPartner.id || o.partnerName?.includes(currentPartner.name)
  );

  const filteredOrders = partnerOrders.filter((order) => {
    // Status filter
    if (filter === 'DELIVERED' && order.status !== 'DELIVERED' && order.status !== 'COMPLETED') return false;
    if (filter === 'CANCELLED' && order.status !== 'CANCELLED') return false;
    if (
      filter === 'ACTIVE' &&
      (order.status === 'DELIVERED' || order.status === 'COMPLETED' || order.status === 'CANCELLED')
    )
      return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = order.id.toLowerCase().includes(q);
      const matchPickup = order.pickup.name.toLowerCase().includes(q);
      const matchDest = order.destination.name.toLowerCase().includes(q);
      const matchCustomer = order.customerName?.toLowerCase().includes(q);
      return matchId || matchPickup || matchDest || matchCustomer;
    }

    return true;
  });

  const totalDelivered = partnerOrders.filter((o) => o.status === 'DELIVERED' || o.status === 'COMPLETED').length;
  const totalEarned = partnerOrders
    .filter((o) => o.status === 'DELIVERED' || o.status === 'COMPLETED')
    .reduce((acc, o) => acc + Math.round(o.pricing.total * 0.82), 0);

  return (
    <div className="space-y-6 text-left">
      {/* Top Header & Overview Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-neutral-900">Trip & Delivery History</h2>
          <p className="text-xs text-neutral-500 font-medium mt-0.5">
            Audit log of all assigned runs, pickups, drop-offs and earned commissions
          </p>
        </div>

        {/* Quick Summary Chips */}
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-2xl border border-neutral-200 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Total Runs</span>
            <span className="text-base font-black text-neutral-900">{partnerOrders.length}</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-2xl border border-neutral-200 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Delivered</span>
            <span className="text-base font-black text-green-600">{totalDelivered}</span>
          </div>
          <div className="bg-[#FFF9F5] px-4 py-2 rounded-2xl border border-[#FF6B35]/25 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-[#FF6B35] block">Total Commission</span>
            <span className="text-base font-black text-[#E85A2A]">₹{totalEarned}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-neutral-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order ID, sector, or recipient..."
            className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#FF6B35] transition-colors"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['ALL', 'ACTIVE', 'DELIVERED', 'CANCELLED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === tab
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {tab === 'ALL' && 'All Orders'}
              {tab === 'ACTIVE' && 'Active Duty'}
              {tab === 'DELIVERED' && 'Delivered'}
              {tab === 'CANCELLED' && 'Cancelled'}
            </button>
          ))}
        </div>
      </div>

      {/* Responsive Grid: 1 col on mobile, 2 col on tablet, 3 col on desktop */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200 space-y-3">
          <Package className="w-12 h-12 text-neutral-300 mx-auto" />
          <h4 className="font-bold text-neutral-800 text-base">No matching trips found</h4>
          <p className="text-xs text-neutral-500">
            {searchQuery
              ? `No deliveries match "${searchQuery}". Try a different sector or search term.`
              : 'Switch to the Duty tab to accept new incoming delivery requests.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => onSelectOrder && onSelectOrder(order.id)}
              className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs space-y-3.5 hover:border-[#FF6B35] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-2.5 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-neutral-900">#{order.id}</span>
                    <span className="text-[11px] font-medium text-neutral-500">• {order.serviceName}</span>
                  </div>
                  <OrderStatusBadge status={order.status} size="sm" />
                </div>

                {/* Route */}
                <div className="text-xs space-y-2 text-neutral-700 mt-3">
                  <div className="flex items-start gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B35] mt-1 shrink-0" />
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase font-bold block">Pickup</span>
                      <span className="font-bold text-neutral-900 block truncate">{order.pickup.name}</span>
                      <span className="text-[11px] text-neutral-500 block truncate">{order.pickup.address}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 pt-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] mt-1 shrink-0" />
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase font-bold block">Drop-off</span>
                      <span className="font-bold text-neutral-900 block truncate">{order.destination.name}</span>
                      <span className="text-[11px] text-neutral-500 block truncate">{order.destination.address}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer with Distance & Payout */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                <div className="text-neutral-500 font-mono text-[11px]">
                  {order.createdAt} • {order.pricing.distanceKm} km
                </div>
                <div className="text-right">
                  <span className="font-black text-base text-[#16A34A]">
                    ₹{Math.round(order.pricing.total * 0.82)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
