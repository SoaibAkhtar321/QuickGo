import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { NOIDA_LOCATIONS } from '../../data/mockData';
import { LocationCoord, Order } from '../../types';
import {
  Bike,
  MapPin,
  Package,
  Phone,
  User,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface BusinessDispatchProps {
  onOrderDispatched?: (order: Order) => void;
}

export const BusinessDispatch: React.FC<BusinessDispatchProps> = ({ onOrderDispatched }) => {
  const { currentBusiness, services, dispatchBusinessDelivery } = useApp();

  const [customerName, setCustomerName] = useState('Anand Kumar');
  const [customerPhone, setCustomerPhone] = useState('+91 98199 88776');
  const [destination, setDestination] = useState<LocationCoord>(NOIDA_LOCATIONS[1]); // Sector 18
  const [serviceId, setServiceId] = useState(services[0]?.id || 'parcel');
  const [packageType, setPackageType] = useState('Prepared Food Pack');
  const [orderAmount, setOrderAmount] = useState('320');
  const [instructions, setInstructions] = useState('Call customer before arriving at gate.');
  const [dispatchedOrder, setDispatchedOrder] = useState<Order | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder = dispatchBusinessDelivery(currentBusiness.id, {
      destination,
      customerName,
      customerPhone,
      serviceId,
      packageType,
      amount: parseFloat(orderAmount) || 200,
      deliveryInstructions: instructions,
    });
    setDispatchedOrder(newOrder);
    if (onOrderDispatched) onOrderDispatched(newOrder);
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-neutral-900">
          Request On-Demand Delivery Rider
        </h1>
        <p className="text-xs text-neutral-500 font-medium">
          Instant rider dispatch from your business address ({currentBusiness.address}) to anywhere in town
        </p>
      </div>

      {dispatchedOrder ? (
        <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm text-center space-y-4 animate-in fade-in">
          <div className="w-16 h-16 rounded-3xl bg-green-100 text-green-700 flex items-center justify-center text-3xl mx-auto">
            🛵
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-black text-neutral-900">
              Rider Dispatch Request Created! (#{dispatchedOrder.id})
            </h3>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">
              Our automated dispatch engine is matching the nearest available QuickGo delivery partner to pick up from {currentBusiness.name}.
            </p>
          </div>

          <div className="max-w-md mx-auto p-4 rounded-2xl bg-neutral-50 border border-neutral-100 text-xs space-y-2 text-left">
            <div className="flex justify-between text-neutral-600">
              <span>Customer:</span>
              <strong className="text-neutral-900">{dispatchedOrder.customerName}</strong>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Destination:</span>
              <strong className="text-neutral-900">{dispatchedOrder.destination.name}</strong>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Order Amount:</span>
              <strong className="text-green-700 font-black">₹{dispatchedOrder.pricing.total}</strong>
            </div>
          </div>

          <button
            onClick={() => setDispatchedOrder(null)}
            className="px-6 py-2.5 rounded-2xl bg-[#FF6B35] hover:bg-[#E85A2A] text-white text-xs font-black shadow-md shadow-[#FF6B35]/25"
          >
            Dispatch Another Order
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Dispatch Form (7 cols on lg) */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-7 bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4 text-xs"
          >
            <h3 className="text-xs font-black text-neutral-500 uppercase tracking-wider">
              Customer & Drop-off Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-neutral-700">Customer Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Recipient full name"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:border-[#FF6B35]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-700">Phone Number</label>
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:border-[#FF6B35]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-neutral-700">Delivery Drop Location</label>
              <select
                value={destination.name}
                onChange={(e) => {
                  const found = NOIDA_LOCATIONS.find((l) => l.name === e.target.value);
                  if (found) setDestination(found);
                }}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:border-[#FF6B35]"
              >
                {NOIDA_LOCATIONS.map((loc) => (
                  <option key={loc.name} value={loc.name}>
                    {loc.name} — {loc.address}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-neutral-700">Service Category</label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:border-[#FF6B35]"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.icon} {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-700">Bill Value (₹)</label>
                <input
                  type="number"
                  value={orderAmount}
                  onChange={(e) => setOrderAmount(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:border-[#FF6B35]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-neutral-700">Item Description</label>
              <input
                type="text"
                value={packageType}
                onChange={(e) => setPackageType(e.target.value)}
                placeholder="e.g. 2 x Bento box lunch meals"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:border-[#FF6B35]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-neutral-700">Instructions for Delivery Partner</label>
              <textarea
                rows={2}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Gate code, landmark, or specific customer requests..."
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:border-[#FF6B35]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#FF6B35] hover:bg-[#E85A2A] text-white py-3.5 rounded-2xl text-xs font-black shadow-md shadow-[#FF6B35]/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Bike className="w-4 h-4" />
              <span>Dispatch QuickGo Rider Now</span>
            </button>
          </form>

          {/* Right Preview Card (5 cols on lg) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4 text-xs">
            <h3 className="text-xs font-black text-neutral-500 uppercase tracking-wider">
              Pickup Point
            </h3>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1.5">
              <div className="flex items-center gap-2 font-black text-neutral-900">
                <MapPin className="w-4 h-4 text-[#FF6B35]" />
                <span>{currentBusiness.name}</span>
              </div>
              <p className="text-neutral-500 text-[11px]">{currentBusiness.address}</p>
            </div>

            <div className="space-y-2 divide-y divide-neutral-100 text-neutral-600">
              <div className="flex justify-between py-1">
                <span>Rider Dispatch SLA</span>
                <strong className="text-neutral-900">Under 3 mins</strong>
              </div>
              <div className="flex justify-between py-1">
                <span>Standard Delivery Charge</span>
                <strong className="text-[#FF6B35]">₹48 - ₹85</strong>
              </div>
              <div className="flex justify-between py-1">
                <span>Live GPS Tracking</span>
                <strong className="text-green-600 font-bold">Enabled</strong>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FFF9F5] border border-[#FF6B35]/20 text-[11px] text-neutral-700 space-y-1">
              <div className="font-bold text-[#FF6B35] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> QuickGo Direct Business SLA
              </div>
              <p>
                All dispatched deliveries are covered by transit insurance up to ₹5,000 with real-time OTP customer handover.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
