import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { Order, OrderStatus } from '../../types';
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge';
import {
  Package,
  Search,
  Filter,
  ChevronRight,
  Eye,
  UserCheck,
  Calendar,
  XCircle,
} from 'lucide-react';

interface AdminOrdersProps {
  onSelectOrder: (order: Order) => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({ onSelectOrder }) => {
  const { orders, cancelOrder } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.partnerName?.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'ALL') return matchesSearch;
    if (statusFilter === 'ACTIVE') {
      return (
        matchesSearch &&
        order.status !== 'DELIVERED' &&
        order.status !== 'COMPLETED' &&
        order.status !== 'CANCELLED'
      );
    }
    return matchesSearch && order.status === statusFilter;
  });

  return (
    <div className="space-y-5 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-neutral-900">Orders Dispatch Management</h2>
          <p className="text-xs text-neutral-500">
            Monitor, assign riders, and manage delivery status in real-time
          </p>
        </div>

        <div className="text-xs font-bold text-neutral-600 bg-white px-3.5 py-2 rounded-xl border border-neutral-200 shadow-2xs">
          Total Orders: <strong className="text-neutral-900">{orders.length}</strong>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-3xl p-4 border border-neutral-200 shadow-xs space-y-3">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order ID, customer name, partner, or service..."
            className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl py-2 pl-9 pr-4 text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:border-[#FF6B35]"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'ALL', label: 'All Orders' },
            { id: 'ACTIVE', label: 'Active In-Transit' },
            { id: 'SEARCHING_PARTNER', label: 'Searching Partner' },
            { id: 'PARTNER_ACCEPTED', label: 'Accepted' },
            { id: 'PICKED_UP', label: 'Picked Up' },
            { id: 'DELIVERED', label: 'Delivered' },
            { id: 'CANCELLED', label: 'Cancelled' },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setStatusFilter(pill.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === pill.id
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Order ID</th>
                <th className="py-3.5 px-6">Service</th>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Partner</th>
                <th className="py-3.5 px-6">Pickup → Drop</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Total</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => onSelectOrder(order)}
                  className="hover:bg-neutral-50 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-6 font-mono font-bold text-neutral-900">
                    #{order.id}
                  </td>
                  <td className="py-3.5 px-6 font-semibold text-neutral-800">
                    {order.serviceName}
                  </td>
                  <td className="py-3.5 px-6 text-neutral-700">
                    {order.customerName || 'Rahul Sharma'}
                  </td>
                  <td className="py-3.5 px-6 text-neutral-700 font-medium">
                    {order.partnerName ? (
                      <span className="flex items-center gap-1">
                        <span>🛵</span> {order.partnerName}
                      </span>
                    ) : (
                      <span className="text-amber-600 font-semibold">🔍 Searching</span>
                    )}
                  </td>
                  <td className="py-3.5 px-6 text-neutral-600 max-w-[200px] truncate">
                    {order.pickup.name.split(',')[0]} → {order.destination.name.split(',')[0]}
                  </td>
                  <td className="py-3.5 px-6">
                    <OrderStatusBadge status={order.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-6 font-extrabold text-neutral-900">
                    ₹{order.pricing.total}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectOrder(order);
                      }}
                      className="px-3 py-1 bg-neutral-100 hover:bg-[#FF6B35] hover:text-white rounded-lg text-xs font-bold text-neutral-700 transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
