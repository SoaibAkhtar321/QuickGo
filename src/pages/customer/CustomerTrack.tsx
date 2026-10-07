import React from 'react';
import { useApp } from '../../store/AppContext';
import { MapView } from '../../components/maps/MapView';
import { TimelineStepper } from '../../components/orders/TimelineStepper';
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge';
import {
  Phone,
  MessageSquare,
  ShieldCheck,
  Navigation,
  Clock,
  ArrowLeft,
  Share2,
  AlertOctagon,
  CheckCircle2,
  Package,
} from 'lucide-react';

interface CustomerTrackProps {
  orderId?: string;
  onBack: () => void;
}

export const CustomerTrack: React.FC<CustomerTrackProps> = ({ orderId, onBack }) => {
  const { orders, partners, startCall, openChat, cancelOrder } = useApp();

  // Pick target order or latest active
  const order =
    (orderId ? orders.find((o) => o.id === orderId) : null) ||
    orders.find((o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED') ||
    orders[0];

  if (!order) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-neutral-200 space-y-3">
        <Package className="w-12 h-12 text-neutral-300 mx-auto" />
        <h3 className="font-bold text-neutral-800">No active delivery to track</h3>
        <p className="text-xs text-neutral-500">Create a new delivery to see real-time tracking.</p>
        <button
          onClick={onBack}
          className="mt-2 text-xs font-bold text-[#FF6B35] hover:underline"
        >
          ← Return to Home
        </button>
      </div>
    );
  }

  const assignedPartner = partners.find((p) => p.id === order.partnerId);

  const isCompleted = order.status === 'DELIVERED' || order.status === 'COMPLETED';
  const isCancelled = order.status === 'CANCELLED';

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-neutral-200/90 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-neutral-900">Live Delivery Tracking</span>
              <span className="text-xs font-mono text-neutral-400">#{order.id}</span>
              <OrderStatusBadge status={order.status} size="sm" />
            </div>
            <span className="text-xs text-neutral-500 font-medium">{order.serviceName} • Noida Express Route</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-black text-[#16A34A] bg-green-50 px-3 py-1.5 rounded-full border border-green-200 shadow-2xs">
          <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse" />
          <span>LIVE GPS SATELLITE</span>
        </div>
      </div>

      {/* Two-Column Responsive Grid on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Map & Telemetry Details */}
        <div className="lg:col-span-7 space-y-4">
          {/* Vector Live Map Component */}
          <div className="rounded-3xl overflow-hidden border border-neutral-200 shadow-md">
            <MapView
              pickup={order.pickup}
              destination={order.destination}
              partnerLocation={order.partnerLocation}
              partnerName={order.partnerName || 'Amit Kumar'}
              partnerVehicle={order.partnerVehicle || 'Honda Activa'}
              heightClass="h-72 sm:h-96"
              distanceKm={order.pricing.distanceKm}
              etaMin={order.pricing.estimatedMinutes}
              showDetailsOverlay={true}
            />
          </div>

          {/* Live GPS Telemetry Pill */}
          <div className="bg-[#FFF9F5] border border-[#FF6B35]/25 rounded-2xl px-4 py-3 flex items-center justify-between text-xs text-[#E85A2A]">
            <div className="flex items-center gap-2 font-black">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B35] animate-ping" />
              <span>REAL-TIME GPS TELEMETRY ACTIVE</span>
            </div>
            <span className="font-mono text-xs text-neutral-600">
              Synced {order.partnerLocation?.lastUpdated || '2 sec ago'}
            </span>
          </div>

          {/* Package & Delivery Route Details Card */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4 text-left text-xs">
            <h4 className="text-xs font-black text-neutral-500 uppercase tracking-wider">
              Consignment & Route Details
            </h4>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-3 h-3 rounded-full bg-[#FF6B35] mt-1 shrink-0" />
                <div>
                  <span className="text-neutral-400 block font-bold uppercase text-[10px]">Pickup Point</span>
                  <div className="font-extrabold text-neutral-900 text-sm mt-0.5">{order.pickup.name}</div>
                  <div className="text-neutral-500 mt-0.5">{order.pickup.address}</div>
                </div>
              </div>

              <div className="border-t border-neutral-100 pt-3 flex items-start gap-3">
                <span className="w-3 h-3 rounded-full bg-[#16A34A] mt-1 shrink-0" />
                <div>
                  <span className="text-neutral-400 block font-bold uppercase text-[10px]">Drop-off Destination</span>
                  <div className="font-extrabold text-neutral-900 text-sm mt-0.5">{order.destination.name}</div>
                  <div className="text-neutral-500 mt-0.5">{order.destination.address}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                <span className="text-neutral-600">
                  Item: <strong className="text-neutral-900">{order.packageType}</strong> ({order.packageWeight})
                </span>
                <span className="text-neutral-900 font-black text-sm">
                  ₹{order.pricing.total}{' '}
                  <span className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
                    {order.paymentStatus}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Courier Profile & Timeline (sticky on desktop) */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
          {/* Partner Profile & Direct Contact Card */}
          {order.partnerName && (
            <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#FF6B35] shadow-xs">
                      <img
                        src={
                          assignedPartner?.avatar ||
                          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
                        }
                        alt={order.partnerName}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                  </div>

                  <div>
                    <h4 className="font-black text-neutral-900 text-base">{order.partnerName}</h4>
                    <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5 font-medium">
                      <span className="text-amber-500 font-black">⭐ {order.partnerRating || 4.85}</span>
                      <span>•</span>
                      <span>{order.partnerVehicle || 'Honda Activa 6G'}</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded mt-1 inline-block">
                      Verified QuickGo Rider
                    </span>
                  </div>
                </div>

                {/* Call and Chat Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    id="btn-customer-call-partner"
                    onClick={() => {
                      if (assignedPartner) startCall(assignedPartner);
                    }}
                    className="w-11 h-11 rounded-2xl bg-neutral-100 hover:bg-[#FFF2EB] hover:text-[#FF6B35] text-neutral-700 flex items-center justify-center border border-neutral-200 transition-all active:scale-95 shadow-2xs"
                    title="Call Partner"
                  >
                    <Phone className="w-5 h-5" />
                  </button>
                  <button
                    id="btn-customer-chat-partner"
                    onClick={() => openChat(order.id)}
                    className="w-11 h-11 rounded-2xl bg-[#FF6B35] hover:bg-[#E85A2A] text-white flex items-center justify-center transition-all active:scale-95 shadow-md shadow-[#FF6B35]/20"
                    title="Chat with Partner"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-center justify-between text-xs text-neutral-600">
                <div className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-4 h-4 text-[#FF6B35]" />
                  <span>Estimated Arrival: <strong className="text-neutral-900 font-bold">{order.pricing.estimatedMinutes} min</strong></span>
                </div>
                <span className="text-neutral-500"><strong className="text-neutral-900">{order.pricing.distanceKm} km</strong> distance</span>
              </div>
            </div>
          )}

          {/* Detailed Order Timeline Stepper */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <h4 className="text-xs font-black text-neutral-500 uppercase tracking-wider">
                Live Status Milestones
              </h4>
              <span className="text-[11px] font-mono text-neutral-400">{order.updatedAt}</span>
            </div>

            <TimelineStepper currentStatus={order.status} timeline={order.timeline} />

            {!isCompleted && !isCancelled && (
              <div className="pt-3 border-t border-neutral-100 text-center">
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to cancel this order?')) {
                      cancelOrder(order.id, 'Cancelled by customer via tracking screen');
                    }
                  }}
                  className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline"
                >
                  Cancel Order & Request Refund
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
