import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { Order, Partner } from '../../types';
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge';
import { MapView } from '../../components/maps/MapView';
import {
  Bike,
  Navigation,
  Search,
  Filter,
  Phone,
  Clock,
  MapPin,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface AdminLiveMapProps {
  onSelectOrder: (order: Order) => void;
}

export const AdminLiveMap: React.FC<AdminLiveMapProps> = ({ onSelectOrder }) => {
  const { orders, partners, startCall } = useApp();

  const activeOrders = orders.filter(
    (o) =>
      o.status !== 'DELIVERED' &&
      o.status !== 'COMPLETED' &&
      o.status !== 'CANCELLED' &&
      o.status !== 'FAILED'
  );

  const [selectedOrder, setSelectedOrder] = useState<Order>(activeOrders[0] || orders[0]);
  const [partnerFilter, setPartnerFilter] = useState<'all' | 'online' | 'busy'>('all');

  return (
    <div className="space-y-4 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-neutral-900">Fleet Live Map</h2>
          <p className="text-xs text-neutral-500">
            Real-time GPS tracking of active riders and live delivery routes
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#16A34A] bg-green-50 px-3 py-1.5 rounded-xl border border-green-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            <span>{partners.filter((p) => p.isOnline).length} Fleet Online</span>
          </span>
          <span className="text-xs font-bold text-[#E85A2A] bg-[#FFF2EB] px-3 py-1.5 rounded-xl border border-[#FF6B35]/20 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-ping" />
            <span>{activeOrders.length} In Transit</span>
          </span>
        </div>
      </div>

      {/* Main Grid: Live Map + Active Fleet Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Vector Interactive Map */}
        <div className="lg:col-span-8 space-y-3">
          <div className="rounded-3xl overflow-hidden border border-neutral-200 shadow-md">
            <MapView
              pickup={selectedOrder?.pickup}
              destination={selectedOrder?.destination}
              partnerLocation={selectedOrder?.partnerLocation}
              partnerName={selectedOrder?.partnerName || 'Fleet Rider'}
              partnerVehicle={selectedOrder?.partnerVehicle || 'Honda Activa'}
              heightClass="h-[460px] sm:h-[520px]"
              distanceKm={selectedOrder?.pricing.distanceKm}
              etaMin={selectedOrder?.pricing.estimatedMinutes}
              showDetailsOverlay={true}
            />
          </div>

          {/* Selected Order Quick Bar */}
          {selectedOrder && (
            <div className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFF2EB] text-[#FF6B35] flex items-center justify-center font-bold text-sm">
                  🛵
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs text-neutral-900">
                      #{selectedOrder.id} • {selectedOrder.serviceName}
                    </h4>
                    <OrderStatusBadge status={selectedOrder.status} size="sm" />
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    {selectedOrder.partnerName || 'Assigning partner'} • ETA:{' '}
                    {selectedOrder.pricing.estimatedMinutes} min
                  </p>
                </div>
              </div>

              <button
                onClick={() => onSelectOrder(selectedOrder)}
                className="bg-[#171717] hover:bg-neutral-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors"
              >
                Inspect Order Details →
              </button>
            </div>
          )}
        </div>

        {/* Right Sidebar: Active Deliveries & Fleet List */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <h3 className="text-sm font-extrabold text-neutral-900">Active Live Deliveries</h3>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              {activeOrders.length} Trips
            </span>
          </div>

          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            {activeOrders.map((order) => {
              const isSelected = selectedOrder?.id === order.id;
              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'border-[#FF6B35] bg-[#FFF9F5] shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-neutral-900">#{order.id}</span>
                    <OrderStatusBadge status={order.status} size="sm" />
                  </div>

                  <div className="text-[11px] space-y-0.5 text-neutral-700">
                    <div className="truncate">
                      <span className="text-[#FF6B35] font-bold mr-1">●</span>
                      {order.pickup.name.split(',')[0]}
                    </div>
                    <div className="truncate">
                      <span className="text-[#16A34A] font-bold mr-1">●</span>
                      {order.destination.name.split(',')[0]}
                    </div>
                  </div>

                  <div className="pt-1.5 border-t border-neutral-100/80 flex items-center justify-between text-[11px] text-neutral-500">
                    <span>{order.partnerName || 'Searching...'}</span>
                    <span className="font-bold text-neutral-900">₹{order.pricing.total}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
