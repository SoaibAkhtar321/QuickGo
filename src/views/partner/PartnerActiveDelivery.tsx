import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { Order, OrderStatus } from '../../types';
import { MapView } from '../../components/maps/MapView';
import { TimelineStepper } from '../../components/orders/TimelineStepper';
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge';
import confetti from 'canvas-confetti';
import {
  Phone,
  MessageSquare,
  Navigation,
  CheckCircle2,
  Clock,
  ArrowLeft,
  ShieldCheck,
  Package,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

interface PartnerActiveDeliveryProps {
  orderId?: string;
  onBack: () => void;
  onDone: () => void;
}

export const PartnerActiveDelivery: React.FC<PartnerActiveDeliveryProps> = ({
  orderId,
  onBack,
  onDone,
}) => {
  const {
    orders,
    currentPartner,
    customers,
    advanceOrderStatus,
    openChat,
    startCall,
  } = useApp();

  const [otpInput, setOtpInput] = useState('4892');
  const [showOtpModal, setShowOtpModal] = useState(false);

  // Find targeted active order
  const order =
    (orderId ? orders.find((o) => o.id === orderId) : null) ||
    orders.find(
      (o) =>
        o.partnerId === currentPartner.id &&
        o.status !== 'DELIVERED' &&
        o.status !== 'COMPLETED' &&
        o.status !== 'CANCELLED' &&
        o.status !== 'FAILED'
    ) ||
    orders[0];

  if (!order) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-neutral-200 space-y-3">
        <Package className="w-12 h-12 text-neutral-300 mx-auto" />
        <h3 className="font-bold text-neutral-800">No active job in progress</h3>
        <p className="text-xs text-neutral-500">Wait for incoming requests on the Duty tab.</p>
        <button
          onClick={onBack}
          className="mt-2 text-xs font-bold text-[#FF6B35] hover:underline"
        >
          ← Return to Duty Screen
        </button>
      </div>
    );
  }

  const customer = customers.find((c) => c.id === order.customerId) || {
    id: order.customerId,
    name: order.customerName || 'Rahul Sharma',
    phone: '+91 98765 43210',
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  };

  const isDelivered = order.status === 'DELIVERED' || order.status === 'COMPLETED';

  // Advance to next progressive status in delivery lifecycle
  const handleAdvance = () => {
    switch (order.status) {
      case 'PARTNER_ASSIGNED':
      case 'PARTNER_ACCEPTED':
        advanceOrderStatus(order.id, 'PARTNER_ARRIVING', 'Partner is arriving at pickup point');
        break;
      case 'PARTNER_ARRIVING':
        advanceOrderStatus(order.id, 'ARRIVED_AT_PICKUP', 'Partner arrived at pickup location');
        break;
      case 'ARRIVED_AT_PICKUP':
        advanceOrderStatus(order.id, 'PICKED_UP', 'Package verified and picked up safely');
        break;
      case 'PICKED_UP':
        advanceOrderStatus(order.id, 'IN_TRANSIT', 'On the way to drop location');
        break;
      case 'IN_TRANSIT':
        advanceOrderStatus(order.id, 'ARRIVED_AT_DESTINATION', 'Arrived at delivery location');
        break;
      case 'ARRIVED_AT_DESTINATION':
        // Trigger celebratory confetti & delivery completion
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        advanceOrderStatus(order.id, 'DELIVERED', 'Delivered successfully with OTP 4892');
        break;
      default:
        break;
    }
  };

  // Get action button text & style according to current status
  const getActionConfig = () => {
    switch (order.status) {
      case 'PARTNER_ASSIGNED':
      case 'PARTNER_ACCEPTED':
        return {
          label: 'I am on the way to Pickup',
          nextStatus: 'PARTNER_ARRIVING',
          color: 'bg-[#FF6B35] hover:bg-[#E85A2A]',
        };
      case 'PARTNER_ARRIVING':
        return {
          label: 'I Have Arrived at Pickup Point',
          nextStatus: 'ARRIVED_AT_PICKUP',
          color: 'bg-[#FF6B35] hover:bg-[#E85A2A]',
        };
      case 'ARRIVED_AT_PICKUP':
        return {
          label: 'Confirm Package Pickup',
          nextStatus: 'PICKED_UP',
          color: 'bg-neutral-900 hover:bg-neutral-800',
        };
      case 'PICKED_UP':
        return {
          label: 'Start Trip to Destination',
          nextStatus: 'IN_TRANSIT',
          color: 'bg-[#FF6B35] hover:bg-[#E85A2A]',
        };
      case 'IN_TRANSIT':
        return {
          label: 'I Have Arrived at Drop Location',
          nextStatus: 'ARRIVED_AT_DESTINATION',
          color: 'bg-neutral-900 hover:bg-neutral-800',
        };
      case 'ARRIVED_AT_DESTINATION':
        return {
          label: 'Verify OTP & Mark Delivered',
          nextStatus: 'DELIVERED',
          color: 'bg-[#16A34A] hover:bg-green-700',
        };
      case 'DELIVERED':
      case 'COMPLETED':
        return {
          label: '✓ Job Completed Successfully',
          nextStatus: 'COMPLETED',
          color: 'bg-green-600',
          disabled: true,
        };
      default:
        return {
          label: 'Update Status',
          nextStatus: 'IN_TRANSIT',
          color: 'bg-[#FF6B35]',
        };
    }
  };

  const action = getActionConfig();

  return (
    <div className="space-y-6 text-left">
      {/* Top Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-neutral-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-neutral-100 border border-neutral-200 hover:bg-neutral-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-neutral-700" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-neutral-900">Active Delivery Mission</h3>
              <span className="text-xs font-mono text-neutral-400">Order #{order.id}</span>
            </div>
            <span className="text-xs text-neutral-500 font-medium">Service: {order.serviceName}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <OrderStatusBadge status={order.status} size="md" />
        </div>
      </div>

      {/* Responsive Grid on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Map, Telemetry, and Target Addresses */}
        <div className="lg:col-span-7 space-y-4">
          {/* Map View */}
          <div className="rounded-3xl overflow-hidden border border-neutral-200 shadow-md">
            <MapView
              pickup={order.pickup}
              destination={order.destination}
              partnerLocation={order.partnerLocation}
              partnerName={currentPartner.name}
              partnerVehicle={currentPartner.vehicle}
              heightClass="h-72 sm:h-96"
              distanceKm={order.pricing.distanceKm}
              etaMin={order.pricing.estimatedMinutes}
              showDetailsOverlay={true}
            />
          </div>

          {/* Live GPS Telemetry Status */}
          <div className="bg-[#FFF9F5] border border-[#FF6B35]/25 rounded-2xl px-4 py-3 flex items-center justify-between text-xs text-[#E85A2A]">
            <div className="flex items-center gap-2 font-black">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B35] animate-ping" />
              <span>LIVE RIDER GPS TELEMETRY BROADCAST</span>
            </div>
            <span className="text-xs font-mono text-neutral-600">
              Synced {order.partnerLocation?.lastUpdated || '2 sec ago'}
            </span>
          </div>

          {/* Target Address Card */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-neutral-500 uppercase tracking-wider">
                {order.status === 'ARRIVED_AT_PICKUP' ||
                order.status === 'PICKED_UP' ||
                order.status === 'IN_TRANSIT' ||
                order.status === 'ARRIVED_AT_DESTINATION'
                  ? 'Delivery Drop-off Destination'
                  : 'Current Target: Pickup Point'}
              </h4>
              <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                {order.pricing.distanceKm} km transit
              </span>
            </div>

            <div className="space-y-1.5 p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
              {order.businessName && (
                <div className="text-[10px] font-black uppercase text-[#FF6B35] bg-orange-100 px-2 py-0.5 rounded w-fit mb-1">
                  🏪 Store / Merchant: {order.businessName}
                </div>
              )}
              <div className="font-black text-base text-neutral-900">
                {order.status === 'ARRIVED_AT_PICKUP' ||
                order.status === 'PICKED_UP' ||
                order.status === 'IN_TRANSIT' ||
                order.status === 'ARRIVED_AT_DESTINATION'
                  ? order.destination.name
                  : order.pickup.name}
              </div>
              <p className="text-xs text-neutral-600">
                {order.status === 'ARRIVED_AT_PICKUP' ||
                order.status === 'PICKED_UP' ||
                order.status === 'IN_TRANSIT' ||
                order.status === 'ARRIVED_AT_DESTINATION'
                  ? order.destination.address
                  : order.pickup.address}
              </p>
            </div>

            {order.instructions && (
              <div className="pt-2 border-t border-neutral-100 text-neutral-700 bg-amber-50/70 p-3 rounded-xl border border-amber-200 text-xs">
                <strong className="text-amber-900 block font-bold text-[11px]">Customer Delivery Note:</strong>
                <span className="italic">{order.instructions}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Customer Contact, Payout & Action Stepper */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
          {/* Customer Contact Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-13 h-13 rounded-2xl overflow-hidden border border-neutral-200 shadow-2xs">
                <img
                  src={customer.avatar}
                  alt={customer.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Recipient / Customer
                </div>
                <h4 className="font-black text-neutral-900 text-base">{customer.name}</h4>
                <div className="text-xs text-neutral-500 font-mono">{customer.phone}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="partner-call-customer-btn"
                onClick={() =>
                  startCall({
                    id: customer.id,
                    name: customer.name,
                    phone: customer.phone,
                    vehicle: 'Customer',
                    rating: 5.0,
                    isOnline: true,
                    earningsToday: 0,
                    totalDeliveries: 0,
                    avatar: customer.avatar,
                  })
                }
                className="w-11 h-11 rounded-2xl bg-neutral-100 hover:bg-[#FFF2EB] hover:text-[#FF6B35] text-neutral-700 flex items-center justify-center border border-neutral-200 transition-all active:scale-95 shadow-2xs"
                title="Call Customer"
              >
                <Phone className="w-5 h-5" />
              </button>

              <button
                id="partner-chat-customer-btn"
                onClick={() => openChat(order.id)}
                className="w-11 h-11 rounded-2xl bg-[#FF6B35] hover:bg-[#E85A2A] text-white flex items-center justify-center transition-all active:scale-95 shadow-md shadow-[#FF6B35]/20"
                title="Chat with Customer"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Guaranteed Earnings Card for Rider */}
          <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                Job Payout
              </span>
              <div className="text-2xl font-black text-[#16A34A] mt-0.5">
                ₹{Math.round(order.pricing.total * 0.82)}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-neutral-400 block font-semibold">Payment Method</span>
              <span className="text-xs font-bold text-neutral-800">Direct Bank Settlement</span>
            </div>
          </div>

          {/* Primary Progressive Action Button */}
          <div className="space-y-3">
            <button
              id="partner-advance-order-btn"
              disabled={action.disabled}
              onClick={handleAdvance}
              className={`w-full text-white font-black text-base py-4.5 rounded-2xl flex items-center justify-center gap-2 shadow-xl transition-all active:scale-[0.98] ${action.color}`}
            >
              <span>{action.label}</span>
              {!isDelivered && <ArrowLeft className="w-4 h-4 rotate-180" />}
            </button>

            {isDelivered && (
              <button
                onClick={onDone}
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-black py-3.5 rounded-2xl transition-colors shadow-md"
              >
                ← Back to Duty Dashboard
              </button>
            )}
          </div>

          {/* Timeline Stepper */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
            <h4 className="text-xs font-black text-neutral-500 uppercase tracking-wider">
              Step-by-Step Delivery Progress
            </h4>
            <TimelineStepper currentStatus={order.status} timeline={order.timeline} />
          </div>
        </div>
      </div>
    </div>
  );
};
