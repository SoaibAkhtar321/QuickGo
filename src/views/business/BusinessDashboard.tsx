import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { Order, OrderStatus } from '../../types';
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge';
import {
  TrendingUp,
  Package,
  Bike,
  Clock,
  Sparkles,
  ArrowUpRight,
  Phone,
  CheckCircle2,
  AlertCircle,
  Plus,
  Send,
  MapPin,
  ChevronRight,
} from 'lucide-react';

interface BusinessDashboardProps {
  onNavigateToDispatch: () => void;
  onNavigateToOrders: () => void;
  onNavigateToCatalog: () => void;
}

export const BusinessDashboard: React.FC<BusinessDashboardProps> = ({
  onNavigateToDispatch,
  onNavigateToOrders,
  onNavigateToCatalog,
}) => {
  const { currentBusiness, orders, advanceOrderStatus, reassignPartner, partners } = useApp();

  // Orders for this business
  const businessOrders = orders.filter(
    (o) => o.businessId === currentBusiness.id || o.businessName === currentBusiness.name
  );

  const activeOrders = businessOrders.filter(
    (o) =>
      o.status !== 'DELIVERED' &&
      o.status !== 'COMPLETED' &&
      o.status !== 'CANCELLED' &&
      o.status !== 'FAILED'
  );

  const completedToday = businessOrders.filter(
    (o) => o.status === 'DELIVERED' || o.status === 'COMPLETED'
  ).length;

  return (
    <div className="space-y-6 text-left">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🏪</span>
            <h1 className="text-xl md:text-2xl font-black text-neutral-900">
              {currentBusiness.name}
            </h1>
          </div>
          <p className="text-xs text-neutral-500 font-medium mt-1">
            Welcome back, {currentBusiness.ownerName}. Direct business delivery hub connected to QuickGo fleet.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onNavigateToDispatch}
            className="bg-[#FF6B35] hover:bg-[#E85A2A] text-white px-4 py-2.5 rounded-2xl text-xs font-black shadow-md shadow-[#FF6B35]/25 flex items-center gap-2 transition-all active:scale-95"
          >
            <Bike className="w-4 h-4" />
            <span>Request Rider Dispatch</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
            Today's Sales
          </span>
          <div className="text-2xl md:text-3xl font-black text-neutral-900">
            ₹{currentBusiness.revenueToday.toLocaleString()}
          </div>
          <p className="text-[11px] text-[#16A34A] font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18.4% vs yesterday
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
            Active Orders
          </span>
          <div className="text-2xl md:text-3xl font-black text-[#FF6B35]">
            {activeOrders.length}
          </div>
          <p className="text-[11px] text-neutral-500 font-medium">
            {completedToday} completed today
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
            Fleet Dispatch Status
          </span>
          <div className="text-2xl md:text-3xl font-black text-green-600">
            {activeOrders.filter((o) => o.partnerId).length} Assigned
          </div>
          <p className="text-[11px] text-neutral-500 font-medium">
            Avg. pickup in ~4.2 mins
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
            Store Rating
          </span>
          <div className="text-2xl md:text-3xl font-black text-neutral-900">
            ⭐ {currentBusiness.rating}
          </div>
          <p className="text-[11px] text-neutral-500 font-medium">
            Based on {currentBusiness.totalOrders} total orders
          </p>
        </div>
      </div>

      {/* Two-Column Responsive Section: Active Orders Queue vs Quick Dispatch & Menu */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Live Orders & Dispatch Lifecycle */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-neutral-900 flex items-center gap-2">
              <span>Live Order Queue</span>
              <span className="text-xs bg-[#FF6B35] text-white px-2 py-0.5 rounded-full font-bold">
                {activeOrders.length}
              </span>
            </h2>
            <button
              onClick={onNavigateToOrders}
              className="text-xs font-bold text-[#FF6B35] hover:underline"
            >
              View All History →
            </button>
          </div>

          {activeOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-neutral-200 space-y-3">
              <Package className="w-12 h-12 text-neutral-300 mx-auto" />
              <h3 className="text-sm font-black text-neutral-800">All orders dispatched!</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                No pending customer orders right now. You can dispatch a delivery rider manually anytime for phone or walk-in orders.
              </p>
              <button
                onClick={onNavigateToDispatch}
                className="mt-2 bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Bike className="w-3.5 h-3.5" /> Dispatch Custom Order
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {activeOrders.map((order) => {
                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs space-y-3.5 hover:border-neutral-300 transition-all"
                  >
                    <div className="flex items-center justify-between pb-2.5 border-b border-neutral-100">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-neutral-900">#{order.id}</span>
                        <span className="text-xs text-neutral-500 font-medium">• {order.serviceName}</span>
                      </div>
                      <OrderStatusBadge status={order.status} size="sm" />
                    </div>

                    {/* Customer & Item details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-neutral-400 block">Customer</span>
                        <div className="font-black text-neutral-900 mt-0.5">{order.customerName}</div>
                        <div className="text-neutral-500 font-mono text-[11px]">{order.customerPhone}</div>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-neutral-400 block">Destination</span>
                        <div className="font-bold text-neutral-900 mt-0.5 truncate">{order.destination.name}</div>
                        <div className="text-neutral-500 text-[11px] truncate">{order.destination.address}</div>
                      </div>
                    </div>

                    {/* Assigned Rider Banner */}
                    <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-between text-xs">
                      {order.partnerId ? (
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-orange-100 text-[#FF6B35] flex items-center justify-center font-black">
                            🛵
                          </div>
                          <div>
                            <div className="font-black text-neutral-900">
                              Rider: {order.partnerName}
                            </div>
                            <div className="text-[11px] text-neutral-500">
                              {order.partnerVehicle} • ⭐ {order.partnerRating || 4.8}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-neutral-500 font-medium">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                          <span>Searching nearest QuickGo delivery partner...</span>
                        </div>
                      )}

                      <span className="font-black text-neutral-900">₹{order.pricing.total}</span>
                    </div>

                    {/* Order Action Lifecycle Buttons */}
                    <div className="flex items-center gap-2 pt-1 overflow-x-auto">
                      {order.status === 'SEARCHING_PARTNER' && (
                        <button
                          onClick={() => {
                            const onlinePartner = partners.find((p) => p.isOnline) || partners[0];
                            reassignPartner(order.id, onlinePartner.id);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-[#FF6B35] hover:bg-[#E85A2A] text-white text-xs font-bold transition-colors"
                        >
                          Auto-Assign Nearest Rider
                        </button>
                      )}

                      {order.status === 'PARTNER_ACCEPTED' && (
                        <button
                          onClick={() => advanceOrderStatus(order.id, 'ARRIVED_AT_PICKUP', 'Rider arrived at store')}
                          className="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-colors"
                        >
                          Confirm Rider at Store
                        </button>
                      )}

                      {order.status === 'ARRIVED_AT_PICKUP' && (
                        <button
                          onClick={() => advanceOrderStatus(order.id, 'PICKED_UP', 'Store handed parcel to rider')}
                          className="px-3.5 py-1.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-bold transition-colors"
                        >
                          Handed to Rider (Out for Delivery)
                        </button>
                      )}

                      {order.status === 'PICKED_UP' && (
                        <button
                          onClick={() => advanceOrderStatus(order.id, 'IN_TRANSIT', 'Rider in transit to destination')}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
                        >
                          Track Delivery in Real-Time
                        </button>
                      )}

                      {order.status === 'IN_TRANSIT' && (
                        <button
                          onClick={() => advanceOrderStatus(order.id, 'DELIVERED', 'Delivered to customer')}
                          className="px-3.5 py-1.5 rounded-xl bg-green-700 hover:bg-green-800 text-white text-xs font-bold transition-colors"
                        >
                          Mark Delivered
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column (5 cols): Store Catalog Overview & Direct Quick Dispatch */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
          {/* Direct Dispatch CTA Box */}
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-3xl p-6 text-white shadow-md space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#FF8255]">
                Direct Logistics Dispatch
              </span>
              <span className="text-xs text-green-400 font-bold">● Network Active</span>
            </div>

            <h3 className="text-base font-black">
              Dispatch a QuickGo Rider in seconds
            </h3>
            <p className="text-xs text-neutral-300">
              Got a direct phone order or Instagram sale? Dispatch a verified QuickGo rider to deliver anywhere in Noida & NCR with live tracking.
            </p>

            <button
              onClick={onNavigateToDispatch}
              className="w-full bg-[#FF6B35] hover:bg-[#E85A2A] text-white py-3 rounded-2xl text-xs font-black shadow-md shadow-[#FF6B35]/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Bike className="w-4 h-4" />
              <span>Book Direct Delivery Rider</span>
            </button>
          </div>

          {/* Quick Catalog Availability Status */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-neutral-500 uppercase tracking-wider">
                Menu & Items ({currentBusiness.catalog.length})
              </h3>
              <button
                onClick={onNavigateToCatalog}
                className="text-xs font-bold text-[#FF6B35] hover:underline"
              >
                Manage All →
              </button>
            </div>

            <div className="space-y-3">
              {currentBusiness.catalog.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-neutral-50 border border-neutral-100 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-9 h-9 rounded-xl object-cover shrink-0"
                      />
                    )}
                    <div>
                      <div className="font-bold text-neutral-900 truncate max-w-[140px]">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono">
                        ₹{item.price} • {item.category}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      item.isAvailable
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {item.isAvailable ? 'In Stock' : 'Sold Out'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
