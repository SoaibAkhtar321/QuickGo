import React from 'react';
import { useApp } from '../../store/AppContext';
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge';
import { Order } from '../../types';
import {
  Package,
  TrendingUp,
  Bike,
  DollarSign,
  ArrowUpRight,
  ChevronRight,
  Clock,
  CheckCircle2,
  Users,
  MapPin,
} from 'lucide-react';

interface AdminDashboardProps {
  onSelectOrder: (order: Order) => void;
  onNavigateTab: (tab: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onSelectOrder,
  onNavigateTab,
}) => {
  const { orders, partners, customers, services } = useApp();

  const activeOrders = orders.filter(
    (o) =>
      o.status !== 'DELIVERED' &&
      o.status !== 'COMPLETED' &&
      o.status !== 'CANCELLED' &&
      o.status !== 'FAILED'
  );

  const onlinePartners = partners.filter((p) => p.isOnline);

  const hourlyTrends = [
    { hour: '8 AM', orders: 42, height: '35%' },
    { hour: '10 AM', orders: 98, height: '70%' },
    { hour: '12 PM', orders: 145, height: '100%' },
    { hour: '2 PM', orders: 88, height: '62%' },
    { hour: '4 PM', orders: 110, height: '78%' },
    { hour: '6 PM', orders: 132, height: '92%' },
    { hour: '8 PM', orders: 75, height: '52%' },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            Operations Overview
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Real-time live dispatch monitoring across Delhi NCR
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('live-map')}
            className="bg-[#FF6B35] hover:bg-[#E85A2A] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <MapPin className="w-4 h-4" />
            <span>Open Fleet Live Map</span>
          </button>
        </div>
      </div>

      {/* KPI Stats 4-Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-bold uppercase tracking-wider">Today's Orders</span>
            <div className="w-8 h-8 rounded-xl bg-[#FFF2EB] text-[#FF6B35] flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-neutral-900">1,248</div>
          <div className="flex items-center gap-1 text-xs font-bold text-[#16A34A]">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12.4% vs yesterday</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Deliveries</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-neutral-900">{activeOrders.length + 76}</div>
          <div className="text-xs text-neutral-500 font-medium">
            {activeOrders.length} live in test state
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-bold uppercase tracking-wider">Online Fleet</span>
            <div className="w-8 h-8 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <Bike className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-neutral-900">{onlinePartners.length + 128}</div>
          <div className="text-xs text-[#16A34A] font-bold">
            {onlinePartners.length} riders online now
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-bold uppercase tracking-wider">Today's Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-neutral-900">₹4,82,650</div>
          <div className="flex items-center gap-1 text-xs font-bold text-[#16A34A]">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.1% vs avg</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hourly Order Volume Chart */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-neutral-900">Hourly Order Volume</h3>
              <p className="text-xs text-neutral-500">Peak dispatch times in NCR region</p>
            </div>
            <span className="text-xs font-bold text-neutral-700 bg-neutral-100 px-2.5 py-1 rounded-xl">
              Today (Live)
            </span>
          </div>

          <div className="flex items-end justify-between h-44 pt-6 px-4 border-b border-neutral-100">
            {hourlyTrends.map((item) => (
              <div key={item.hour} className="flex flex-col items-center gap-2 flex-1 group">
                <span className="text-[10px] font-mono font-bold text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.orders}
                </span>
                <div className="w-8 sm:w-10 bg-neutral-100 rounded-t-xl h-28 flex items-end overflow-hidden">
                  <div
                    className="w-full bg-[#FF6B35] rounded-t-xl transition-all duration-300"
                    style={{ height: item.height }}
                  />
                </div>
                <span className="text-[10px] font-bold text-neutral-500">{item.hour}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Service Categories Share */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold text-neutral-900">Service Category Share</h3>

          <div className="space-y-3 pt-2 text-xs">
            {[
              { label: '📦 Parcel Delivery', pct: '38%', color: 'bg-[#FF6B35]' },
              { label: '🍔 Food Delivery', pct: '26%', color: 'bg-amber-500' },
              { label: '🛒 Grocery Delivery', pct: '18%', color: 'bg-emerald-500' },
              { label: '🍱 Tiffin Delivery', pct: '10%', color: 'bg-blue-500' },
              { label: '📄 Document Courier', pct: '8%', color: 'bg-purple-500' },
            ].map((cat) => (
              <div key={cat.label} className="space-y-1">
                <div className="flex justify-between font-bold text-neutral-800 text-[11px]">
                  <span>{cat.label}</span>
                  <span>{cat.pct}</span>
                </div>
                <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div className={`h-full ${cat.color} rounded-full`} style={{ width: cat.pct }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Dispatch Feed Table */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-neutral-900">Live Active Deliveries</h3>
            <p className="text-xs text-neutral-500 mt-0.5">Real-time status updates across fleet</p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-bold text-[#FF6B35] hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3 px-6">Order ID</th>
                <th className="py-3 px-6">Service</th>
                <th className="py-3 px-6">Customer</th>
                <th className="py-3 px-6">Partner</th>
                <th className="py-3 px-6">Route</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Amount</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {orders.slice(0, 6).map((order) => (
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
                    {order.partnerName ? `🛵 ${order.partnerName}` : '🔍 Searching...'}
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
                    <span className="text-xs font-bold text-[#FF6B35] hover:underline">
                      Manage →
                    </span>
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
