import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { Order, OrderStatus } from '../../types';
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge';
import {
  Package,
  Search,
  Filter,
  Bike,
  Phone,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  X,
  ExternalLink,
} from 'lucide-react';

export const BusinessOrders: React.FC = () => {
  const { currentBusiness, orders, advanceOrderStatus, reassignPartner, partners } = useApp();
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'DELIVERED' | 'CANCELLED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Business orders
  const businessOrders = orders.filter(
    (o) => o.businessId === currentBusiness.id || o.businessName === currentBusiness.name
  );

  const filteredOrders = businessOrders.filter((order) => {
    if (filter === 'ACTIVE') {
      if (
        order.status === 'DELIVERED' ||
        order.status === 'COMPLETED' ||
        order.status === 'CANCELLED'
      )
        return false;
    }
    if (filter === 'DELIVERED') {
      if (order.status !== 'DELIVERED' && order.status !== 'COMPLETED') return false;
    }
    if (filter === 'CANCELLED') {
      if (order.status !== 'CANCELLED') return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = order.id.toLowerCase().includes(q);
      const matchCustomer = order.customerName.toLowerCase().includes(q);
      const matchDest = order.destination.name.toLowerCase().includes(q);
      return matchId || matchCustomer || matchDest;
    }
    return true;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-neutral-900">
            Orders & Dispatches
          </h1>
          <p className="text-xs text-neutral-500 font-medium">
            Manage incoming customer orders and track rider dispatch fulfillment
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-neutral-100 text-neutral-700 px-3 py-1.5 rounded-xl border border-neutral-200">
            Total Orders: {businessOrders.length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-neutral-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order ID, customer, or destination..."
            className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#FF6B35] transition-colors"
          />
        </div>

        {/* Status Filters */}
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
              {tab === 'ACTIVE' && 'In Progress'}
              {tab === 'DELIVERED' && 'Delivered'}
              {tab === 'CANCELLED' && 'Cancelled'}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List / Table */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200 space-y-3">
          <Package className="w-12 h-12 text-neutral-300 mx-auto" />
          <h3 className="font-bold text-neutral-800 text-base">No orders found</h3>
          <p className="text-xs text-neutral-500 max-w-md mx-auto">
            {searchQuery
              ? `No orders matched your search "${searchQuery}".`
              : 'There are no orders matching this filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs space-y-4 hover:border-[#FF6B35] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-neutral-900">#{order.id}</span>
                    <span className="text-[11px] text-neutral-500 font-medium">• {order.serviceName}</span>
                  </div>
                  <OrderStatusBadge status={order.status} size="sm" />
                </div>

                {/* Customer & Route info */}
                <div className="space-y-2 text-xs text-neutral-700 mt-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Customer</span>
                    <div className="font-bold text-neutral-900">{order.customerName}</div>
                    <div className="text-neutral-500 font-mono text-[11px]">{order.customerPhone}</div>
                  </div>

                  <div className="pt-1">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Drop Address</span>
                    <div className="font-medium text-neutral-800 truncate">{order.destination.name}</div>
                    <div className="text-[11px] text-neutral-500 truncate">{order.destination.address}</div>
                  </div>
                </div>

                {/* Assigned Rider Info */}
                <div className="mt-3 p-3 rounded-2xl bg-neutral-50 border border-neutral-100 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🛵</span>
                    <div>
                      <span className="font-bold text-neutral-900 block truncate max-w-[130px]">
                        {order.partnerName || 'Assigning rider...'}
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        {order.partnerVehicle || 'Waiting in pool'}
                      </span>
                    </div>
                  </div>
                  <span className="font-black text-sm text-neutral-900">₹{order.pricing.total}</span>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-neutral-400 font-mono">{order.createdAt}</span>
                <span className="text-xs font-bold text-[#FF6B35] flex items-center gap-1">
                  View Timeline <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-neutral-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h3 className="text-base font-black text-neutral-900">Order #{selectedOrder.id}</h3>
                <p className="text-xs text-neutral-500 font-medium">{selectedOrder.serviceName}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status & Rider */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Current Status</span>
                <OrderStatusBadge status={selectedOrder.status} size="md" />
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Assigned Rider</span>
                <span className="font-black text-xs text-neutral-900 block">
                  {selectedOrder.partnerName || 'Unassigned'}
                </span>
                {selectedOrder.partnerPhone && (
                  <span className="font-mono text-[11px] text-neutral-500">
                    {selectedOrder.partnerPhone}
                  </span>
                )}
              </div>
            </div>

            {/* Lifecycle stepper */}
            <div className="space-y-2 text-xs">
              <h4 className="font-black text-neutral-900 uppercase text-[10px] tracking-wider">
                Delivery Timeline
              </h4>
              <div className="space-y-2.5 pl-2 border-l-2 border-[#FF6B35]/30">
                {selectedOrder.timeline.map((step, idx) => (
                  <div key={idx} className="relative pl-3">
                    <span className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-[#FF6B35]" />
                    <div className="font-bold text-neutral-900">{step.description}</div>
                    <div className="text-[10px] text-neutral-400 font-mono">{step.time}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Advance Button */}
            <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100"
              >
                Close
              </button>
              {selectedOrder.status === 'ARRIVED_AT_PICKUP' && (
                <button
                  onClick={() => {
                    advanceOrderStatus(selectedOrder.id, 'PICKED_UP', 'Store handed parcel to rider');
                    setSelectedOrder(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#FF6B35] text-white hover:bg-[#E85A2A]"
                >
                  Confirm Handover to Rider
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
