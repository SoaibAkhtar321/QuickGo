import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { Order, Partner } from '../../types';
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge';
import { TimelineStepper } from '../../components/orders/TimelineStepper';
import { MapView } from '../../components/maps/MapView';
import {
  ArrowLeft,
  UserCheck,
  Bike,
  Phone,
  Shield,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';

interface AdminOrderDetailProps {
  order: Order;
  onBack: () => void;
}

export const AdminOrderDetail: React.FC<AdminOrderDetailProps> = ({ order, onBack }) => {
  const { partners, assignPartner, cancelOrder, startCall } = useApp();
  const [selectedPartnerId, setSelectedPartnerId] = useState(order.partnerId || partners[0].id);
  const [showReassignModal, setShowReassignModal] = useState(false);

  const assignedPartner = partners.find((p) => p.id === order.partnerId);

  const handleReassign = () => {
    assignPartner(order.id, selectedPartnerId);
    setShowReassignModal(false);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-neutral-900">Order #{order.id}</h2>
              <OrderStatusBadge status={order.status} size="md" />
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              {order.serviceName} • Created at {order.createdAt}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowReassignModal(true)}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors"
          >
            {order.partnerId ? 'Reassign Rider' : 'Assign Partner'}
          </button>

          {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
            <button
              onClick={() => {
                if (confirm('Are you sure you want to cancel this order as Admin?')) {
                  cancelOrder(order.id, 'Cancelled by Admin Operations');
                }
              }}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-colors"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Map + Timeline + Parties */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Map & Timeline */}
        <div className="lg:col-span-8 space-y-6">
          {/* Map */}
          <div className="rounded-3xl overflow-hidden border border-neutral-200 shadow-md">
            <MapView
              pickup={order.pickup}
              destination={order.destination}
              partnerLocation={order.partnerLocation}
              partnerName={order.partnerName}
              partnerVehicle={order.partnerVehicle}
              heightClass="h-72 sm:h-80"
              distanceKm={order.pricing.distanceKm}
              etaMin={order.pricing.estimatedMinutes}
              showDetailsOverlay={true}
            />
          </div>

          {/* Route & Package Details */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4 text-xs">
            <h3 className="text-sm font-extrabold text-neutral-900">Route & Package Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-1">
                <span className="text-[10px] font-bold text-[#FF6B35] uppercase tracking-wider">
                  Pickup Location
                </span>
                <div className="font-bold text-neutral-900 text-sm">{order.pickup.name}</div>
                <div className="text-neutral-500">{order.pickup.address}</div>
              </div>

              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-1">
                <span className="text-[10px] font-bold text-[#16A34A] uppercase tracking-wider">
                  Destination / Drop
                </span>
                <div className="font-bold text-neutral-900 text-sm">{order.destination.name}</div>
                <div className="text-neutral-500">{order.destination.address}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 bg-neutral-50 rounded-xl">
                <span className="text-neutral-400 block text-[10px]">Package</span>
                <strong className="text-neutral-800">{order.packageType}</strong>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl">
                <span className="text-neutral-400 block text-[10px]">Weight</span>
                <strong className="text-neutral-800">{order.packageWeight}</strong>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl">
                <span className="text-neutral-400 block text-[10px]">Distance</span>
                <strong className="text-neutral-800">{order.pricing.distanceKm} km</strong>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl">
                <span className="text-neutral-400 block text-[10px]">Estimated ETA</span>
                <strong className="text-neutral-800">{order.pricing.estimatedMinutes} min</strong>
              </div>
            </div>

            {(order.deliveryInstructions || order.instructions) && (
              <div className="p-3 bg-[#FFF9F5] border border-[#FF6B35]/20 rounded-xl text-neutral-700">
                <strong>Customer Instructions:</strong> {order.deliveryInstructions || order.instructions}
              </div>
            )}
          </div>

          {/* Timeline History */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-neutral-900">Dispatch Audit Timeline</h3>
            <TimelineStepper currentStatus={order.status} timeline={order.timeline} />
          </div>
        </div>

        {/* Right Column: Customer, Partner & Billing */}
        <div className="lg:col-span-4 space-y-6">
          {/* Customer Card */}
          <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Customer Details
              </span>
              <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded">
                Verified
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-neutral-100 text-neutral-700 flex items-center justify-center font-bold">
                {order.customerName?.charAt(0) || 'R'}
              </div>
              <div>
                <h4 className="font-extrabold text-neutral-900 text-sm">
                  {order.customerName || 'Rahul Sharma'}
                </h4>
                <p className="text-xs text-neutral-500 font-mono">+91 98765 43210</p>
              </div>
            </div>
          </div>

          {/* Partner Card */}
          <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Assigned Partner
              </span>
              {order.partnerName ? (
                <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded">
                  Assigned
                </span>
              ) : (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  Unassigned
                </span>
              )}
            </div>

            {order.partnerName ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-[#FF6B35]">
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
                  <div>
                    <h4 className="font-extrabold text-neutral-900 text-sm">
                      {order.partnerName}
                    </h4>
                    <p className="text-xs text-neutral-500 font-medium">
                      ⭐ {order.partnerRating || 4.85} • {order.partnerVehicle || 'Honda Activa'}
                    </p>
                  </div>
                </div>

                {assignedPartner && (
                  <button
                    onClick={() => startCall(assignedPartner)}
                    className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Delivery Partner</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-2 text-neutral-500 text-xs">
                No partner assigned yet.
              </div>
            )}
          </div>

          {/* Pricing & Revenue Breakdown */}
          <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Financial Breakdown
              </span>
              <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded">
                PAID (UPI)
              </span>
            </div>

            <div className="space-y-2 divide-y divide-neutral-100 text-neutral-600">
              <div className="flex justify-between pt-1">
                <span>Base Fare</span>
                <span className="font-semibold text-neutral-900">₹{order.pricing.baseFare}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span>Distance Fare ({order.pricing.distanceKm} km)</span>
                <span className="font-semibold text-neutral-900">₹{order.pricing.distanceFare}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span>Platform Commission</span>
                <span className="font-semibold text-neutral-900">₹{order.pricing.platformFee}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span>Taxes (5% GST)</span>
                <span className="font-semibold text-neutral-900">₹{order.pricing.tax}</span>
              </div>
              <div className="flex justify-between pt-2 text-sm font-extrabold text-neutral-900">
                <span>Gross Order Value</span>
                <span className="text-[#FF6B35]">₹{order.pricing.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reassign Partner Modal */}
      {showReassignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-neutral-200 shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-neutral-900">
              Assign / Reassign Delivery Partner
            </h3>
            <p className="text-xs text-neutral-500">
              Select an available verified rider to dispatch Order #{order.id}
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  onClick={() => setSelectedPartnerId(partner.id)}
                  className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedPartnerId === partner.id
                      ? 'border-[#FF6B35] bg-[#FFF2EB]'
                      : 'border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-neutral-200 overflow-hidden">
                      <img
                        src={partner.avatar}
                        alt={partner.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-neutral-900">{partner.name}</div>
                      <div className="text-[10px] text-neutral-500">
                        {partner.vehicle} • ⭐ {partner.rating}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      partner.isOnline
                        ? 'bg-green-100 text-green-800'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {partner.isOnline ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowReassignModal(false)}
                className="py-2.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-600 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                onClick={handleReassign}
                className="py-2.5 rounded-xl bg-[#FF6B35] hover:bg-[#E85A2A] text-white text-xs font-bold shadow-xs"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
