import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { Order, OrderStatus } from '../../types';
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge';
import {
  Package,
  Search,
  ChevronRight,
  Filter,
  Calendar,
  ArrowRight,
  Navigation,
} from 'lucide-react';

interface CustomerOrdersProps {
  onSelectOrder: (orderId: string) => void;
  onTrackOrder: (orderId: string) => void;
  onNewDelivery?: () => void;
  onCreateNew?: () => void;
}

export const CustomerOrders: React.FC<CustomerOrdersProps> = ({
  onSelectOrder,
  onTrackOrder,
  onNewDelivery,
  onCreateNew,
}) => {
  const { orders, reorderItems } = useApp();
  const handleNew = onNewDelivery || onCreateNew || (() => {});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.pickup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.destination.name.toLowerCase().includes(searchTerm.toLowerCase());

    const isLive =
      order.status !== 'DELIVERED' &&
      order.status !== 'COMPLETED' &&
      order.status !== 'CANCELLED' &&
      order.status !== 'FAILED';

    if (filterTab === 'active') return matchesSearch && isLive;
    if (filterTab === 'completed')
      return matchesSearch && (order.status === 'DELIVERED' || order.status === 'COMPLETED');
    if (filterTab === 'cancelled')
      return matchesSearch && (order.status === 'CANCELLED' || order.status === 'FAILED');

    return matchesSearch;
  });

  const activeCount = orders.filter(
    (o) =>
      o.status !== 'DELIVERED' &&
      o.status !== 'COMPLETED' &&
      o.status !== 'CANCELLED' &&
      o.status !== 'FAILED'
  ).length;

  const deliveredCount = orders.filter(
    (o) => o.status === 'DELIVERED' || o.status === 'COMPLETED'
  ).length;

  const totalSpent = orders.reduce((sum, o) => sum + (o.pricing?.total || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Your Deliveries</h2>
          <p className="text-xs text-neutral-500">Track and manage past and current orders across Noida</p>
        </div>
        <button
          onClick={onNewDelivery}
          className="bg-[#FF6B35] hover:bg-[#E85A2A] text-white text-xs font-extrabold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-[#FF6B35]/20 self-start sm:self-auto transition-all active:scale-95"
        >
          <span>+ Book New Delivery</span>
        </button>
      </div>

      {/* Summary KPI Cards on Desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
            Total Orders
          </span>
          <div className="text-2xl font-black text-neutral-900 mt-1">{orders.length}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
            Active Now
          </span>
          <div className="text-2xl font-black text-[#FF6B35] mt-1 flex items-center gap-2">
            <span>{activeCount}</span>
            {activeCount > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B35] animate-ping" />
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
            Delivered
          </span>
          <div className="text-2xl font-black text-green-600 mt-1">{deliveredCount}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
            Total Spent
          </span>
          <div className="text-2xl font-black text-neutral-900 mt-1">₹{totalSpent}</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order ID, sector or service..."
            className="w-full bg-white border border-neutral-200 rounded-2xl py-2.5 pl-9 pr-4 text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#FF6B35] shadow-2xs"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: `All (${orders.length})` },
            { id: 'active', label: `Live (${activeCount})` },
            { id: 'completed', label: `Completed (${deliveredCount})` },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filterTab === tab.id
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid - Responsive across Desktop (3 cols on lg, 2 cols on md, 1 col on sm) */}
      <div>
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200 space-y-3">
            <Package className="w-12 h-12 text-neutral-300 mx-auto" />
            <h4 className="font-extrabold text-neutral-800 text-sm">No deliveries found</h4>
            <p className="text-xs text-neutral-500">There are no orders matching your current search or tab.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.map((order) => {
              const isActive =
                order.status !== 'DELIVERED' &&
                order.status !== 'COMPLETED' &&
                order.status !== 'CANCELLED' &&
                order.status !== 'FAILED';

              return (
                <div
                  key={order.id}
                  onClick={() => onSelectOrder(order.id)}
                  className="bg-white rounded-3xl p-5 border border-neutral-200 hover:border-[#FF6B35]/70 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs text-neutral-900">#{order.id}</span>
                      <span className="text-xs text-neutral-500 font-medium">• {order.serviceName}</span>
                    </div>
                    <OrderStatusBadge status={order.status} size="sm" />
                  </div>

                  {/* Route points */}
                  <div className="space-y-1.5 text-xs bg-neutral-50 p-3 rounded-2xl border border-neutral-100">
                    <div className="flex items-start gap-2">
                      <span className="text-[#FF6B35] font-bold">●</span>
                      <span className="text-neutral-700 font-semibold truncate">
                        {order.pickup.name}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#16A34A] font-bold">●</span>
                      <span className="text-neutral-700 font-semibold truncate">
                        {order.destination.name}
                      </span>
                    </div>
                  </div>

                  {/* Partner & Package details */}
                  <div className="text-[11px] text-neutral-500 flex items-center justify-between">
                    <span>{order.packageType}</span>
                    <span>{order.partnerName ? `🛵 ${order.partnerName}` : 'No partner'}</span>
                  </div>

                  <div className="pt-2.5 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-neutral-500 font-medium">
                      <span>{order.createdAt}</span>
                      <span>•</span>
                      <span className="font-black text-neutral-900 text-sm">
                        ₹{order.pricing.total}
                      </span>
                    </div>

                    {isActive ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onTrackOrder(order.id);
                        }}
                        className="bg-[#FFF2EB] text-[#E85A2A] hover:bg-[#FF6B35] hover:text-white font-extrabold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 transition-colors shadow-2xs"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Live Track</span>
                      </button>
                    ) : (
                      <div className="text-neutral-400 hover:text-neutral-900 flex items-center gap-0.5 text-xs font-bold transition-colors">
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
