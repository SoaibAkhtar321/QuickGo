import React from 'react';
import { useApp } from '../../store/AppContext';
import { Order } from '../../types';
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge';
import { MapView } from '../../components/maps/MapView';
import {
  ArrowLeft,
  Navigation,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Store,
  CheckCircle2,
} from 'lucide-react';

interface CustomerOrderDetailProps {
  order?: Order;
  orderId?: string;
  onBack: () => void;
  onTrack: (orderId: string) => void;
}

export const CustomerOrderDetail: React.FC<CustomerOrderDetailProps> = ({
  order: propOrder,
  orderId,
  onBack,
  onTrack,
}) => {
  const { orders, reorderItems } = useApp();

  const order = propOrder || orders.find((o) => o.id === orderId) || orders[0];

  if (!order) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-neutral-200 space-y-3">
        <h3 className="font-bold text-neutral-800">Order not found</h3>
        <button onClick={onBack} className="text-xs font-bold text-[#FF6B35]">
          ← Back to Orders
        </button>
      </div>
    );
  }

  const isLive =
    order.status !== 'DELIVERED' &&
    order.status !== 'COMPLETED' &&
    order.status !== 'CANCELLED' &&
    order.status !== 'FAILED';

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-white p-4 sm:p-5 rounded-3xl border border-neutral-200 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-neutral-700" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-neutral-900">Order #{order.id}</h3>
              <span className="text-xs font-semibold text-neutral-500">• {order.serviceName}</span>
            </div>
            <span className="text-[11px] text-neutral-400">Placed on {order.createdAt}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <OrderStatusBadge status={order.status} size="md" />
        </div>
      </div>

      {/* Responsive Grid on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Items, Map, Route, and Store */}
        <div className="lg:col-span-7 space-y-5">
          {/* Itemized Quick Commerce Products (if present) */}
          {order.items && order.items.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <span className="text-xs font-black text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-[#FF6B35]" />
                  <span>Ordered Items ({order.items.length})</span>
                </span>
                {order.businessName && (
                  <span className="text-xs font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-lg flex items-center gap-1">
                    <Store className="w-3.5 h-3.5 text-[#FF6B35]" />
                    <span>{order.businessName}</span>
                  </span>
                )}
              </div>

              <div className="divide-y divide-neutral-100 space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="pt-2.5 first:pt-0 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-11 h-11 rounded-xl object-cover bg-neutral-100 border border-neutral-100"
                        />
                      )}
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-neutral-900 truncate">
                          {item.name}
                        </h4>
                        <span className="text-[11px] text-neutral-500">
                          Qty: {item.quantity} • ₹{item.unitPrice} each
                        </span>
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm font-black text-neutral-900">
                      ₹{item.totalPrice}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => reorderItems(order)}
                  className="bg-[#FFF2EB] hover:bg-orange-100 text-[#FF6B35] font-black text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reorder These Items</span>
                </button>
              </div>
            </div>
          )}

          {/* Map Snapshot */}
          <div className="rounded-3xl overflow-hidden border border-neutral-200 shadow-xs">
            <MapView
              pickup={order.pickup}
              destination={order.destination}
              partnerLocation={order.partnerLocation}
              heightClass="h-64 sm:h-72"
              distanceKm={order.pricing.distanceKm}
              etaMin={order.pricing.estimatedMinutes}
              showDetailsOverlay={true}
            />
          </div>

          {/* Route Details Card */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4 text-xs">
            <h4 className="text-xs font-black text-neutral-500 uppercase tracking-wider">
              Transit Route Points
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-3 h-3 rounded-full bg-[#FF6B35] mt-1 shrink-0" />
                <div>
                  <span className="text-neutral-400 block font-bold uppercase text-[10px]">
                    Pickup / Store Location
                  </span>
                  <div className="font-extrabold text-neutral-900 text-sm mt-0.5">
                    {order.pickup.name}
                  </div>
                  <div className="text-neutral-500 mt-0.5">{order.pickup.address}</div>
                </div>
              </div>

              <div className="border-t border-neutral-100 pt-3 flex items-start gap-3">
                <span className="w-3 h-3 rounded-full bg-[#16A34A] mt-1 shrink-0" />
                <div>
                  <span className="text-neutral-400 block font-bold uppercase text-[10px]">
                    Delivery Destination
                  </span>
                  <div className="font-extrabold text-neutral-900 text-sm mt-0.5">
                    {order.destination.name}
                  </div>
                  <div className="text-neutral-500 mt-0.5">{order.destination.address}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Live Action, Invoice, and Progress Stepper */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
          {/* Live tracking CTA */}
          {isLive && (
            <div className="bg-neutral-900 text-white p-5 rounded-3xl space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-ping" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-green-400">
                    Order is Live
                  </span>
                </div>
                <span className="text-xs font-semibold text-neutral-400">
                  ETA ~{order.pricing.estimatedMinutes}m
                </span>
              </div>
              <p className="text-xs text-neutral-300">
                Courier is currently en route. Follow real-time movement on map.
              </p>
              <button
                onClick={() => onTrack(order.id)}
                className="w-full bg-[#FF6B35] hover:bg-[#E85A2A] text-white text-xs font-extrabold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-[#FF6B35]/30 transition-all active:scale-95"
              >
                <Navigation className="w-4 h-4" />
                <span>Open Live GPS Telemetry</span>
              </button>
            </div>
          )}

          {/* Payment & Invoice Breakdown */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-neutral-500 uppercase tracking-wider">
                Invoice Breakdown
              </h4>
              <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                {order.paymentStatus}
              </span>
            </div>

            <div className="space-y-2 divide-y divide-neutral-100 text-neutral-600">
              <div className="flex justify-between pt-1">
                <span>Delivery & Handling</span>
                <span className="font-semibold text-neutral-900">₹{order.pricing.baseFare}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span>Platform Fee</span>
                <span className="font-semibold text-neutral-900">₹{order.pricing.platformFee}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span>Taxes & GST (5%)</span>
                <span className="font-semibold text-neutral-900">₹{order.pricing.tax}</span>
              </div>

              {order.passInfo && (
                <div className="flex justify-between pt-1 text-green-700 font-bold bg-green-50 p-2 rounded-xl">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    QuickPass Discount ({order.passInfo.planName})
                  </span>
                  <span>-₹{order.passInfo.discountAmount}</span>
                </div>
              )}

              {order.couponDiscount && order.couponDiscount > 0 && (
                <div className="flex justify-between pt-1 text-green-700 font-bold bg-green-50 p-2 rounded-xl">
                  <span>Coupon Discount ({order.couponCode})</span>
                  <span>-₹{order.couponDiscount}</span>
                </div>
              )}

              <div className="flex justify-between pt-3 text-base font-black text-neutral-900">
                <span>Total Paid</span>
                <span className="text-[#FF6B35]">₹{order.pricing.total}</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-neutral-400">
              Payment Method: <strong>{order.paymentMethod}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
