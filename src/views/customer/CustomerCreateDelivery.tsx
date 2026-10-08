import React, { useState, useEffect } from 'react';
import { useApp } from '../../store/AppContext';
import { LocationCoord, ServiceConfig, Order } from '../../types';
import { NOIDA_LOCATIONS } from '../../data/mockData';
import { pricingService } from '../../services/pricingService';
import { MapView } from '../../components/maps/MapView';
import {
  ArrowLeft,
  MapPin,
  Package,
  Clock,
  Shield,
  Zap,
  CheckCircle2,
  ChevronRight,
  Info,
  CreditCard,
  Sparkles,
} from 'lucide-react';

interface CustomerCreateDeliveryProps {
  selectedService: ServiceConfig | null;
  onBack: () => void;
  onOrderPlaced: (order: Order) => void;
}

export const CustomerCreateDelivery: React.FC<CustomerCreateDeliveryProps> = ({
  selectedService,
  onBack,
  onOrderPlaced,
}) => {
  const {
    services,
    createOrder,
    currentCustomer,
    getActivePassForCustomer,
    getPassPlan,
    businesses,
  } = useApp();

  const activeService = selectedService || services[0];
  const activePass = getActivePassForCustomer(currentCustomer.id);
  const activePassPlan = activePass ? getPassPlan(activePass.planId) : null;

  const [pickup, setPickup] = useState<LocationCoord>(NOIDA_LOCATIONS[0]); // Sector 62
  const [destination, setDestination] = useState<LocationCoord>(NOIDA_LOCATIONS[1]); // Sector 18
  const [packageType, setPackageType] = useState('Electronics / Medium Box');
  const [packageWeight, setPackageWeight] = useState('2.5 kg');
  const [deliveryInstructions, setDeliveryInstructions] = useState('Please call upon arrival at gate');
  const [deliveryType, setDeliveryType] = useState<'instant' | 'scheduled'>('instant');
  const [step, setStep] = useState<'form' | 'confirm' | 'paying'>('form');
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>('');

  // Dynamic price quote calculation with Pass Benefit
  const quote = pricingService.calculateQuote(activeService, pickup, destination, 1.0, activePassPlan);

  const packageTypeOptions = [
    'Electronics / Medium Box',
    'Clothes / Apparel',
    'Documents / Envelopes',
    'Medicines / Health Essentials',
    'Home Cooked Food / Bakery',
    'Keys / Small Items',
    'Groceries / Fresh Items',
  ];

  const weightOptions = ['Under 1 kg', '1 - 3 kg', '3 - 5 kg', '5 - 10 kg'];

  const handlePlaceOrder = () => {
    setStep('paying');
    const matchedMerchant = businesses.find((b) => b.id === selectedMerchantId);
    setTimeout(() => {
      const newOrder = createOrder(
        activeService,
        pickup,
        destination,
        quote,
        packageType,
        packageWeight,
        deliveryInstructions,
        deliveryType,
        undefined,
        matchedMerchant?.id,
        matchedMerchant?.name
      );
      onOrderPlaced(newOrder);
    }, 1200);
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-lg font-extrabold text-neutral-900 flex items-center gap-1.5">
            <span>{activeService.icon}</span>
            <span>{activeService.name}</span>
          </h2>
          <p className="text-xs text-neutral-500">{activeService.tagline}</p>
        </div>
      </div>

      {step === 'form' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Route, Package, & Schedule Details (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Pickup & Destination Selector Card */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-neutral-500 uppercase tracking-wider">
                  Pickup & Drop-off Route
                </h3>
                <span className="text-xs font-semibold text-[#FF6B35]">Noida Express Corridors</span>
              </div>

              {/* Pickup Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B35]" />
                  Pickup Point
                </label>
                <div className="relative">
                  <select
                    id="pickup-location-select"
                    value={pickup.name}
                    onChange={(e) => {
                      const found = NOIDA_LOCATIONS.find((l) => l.name === e.target.value);
                      if (found) setPickup(found);
                    }}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs font-semibold text-neutral-900 focus:bg-white focus:border-[#FF6B35] focus:outline-none appearance-none"
                  >
                    {NOIDA_LOCATIONS.map((loc) => (
                      <option key={loc.name} value={loc.name}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                  <ChevronRight className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                </div>
                <p className="text-[11px] text-neutral-500 pl-4">{pickup.address}</p>
              </div>

              {/* Swap Button */}
              <div className="flex items-center justify-center -my-2 relative z-10">
                <button
                  type="button"
                  onClick={() => {
                    const temp = pickup;
                    setPickup(destination);
                    setDestination(temp);
                  }}
                  className="px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-xs font-bold text-neutral-700 rounded-full border border-neutral-200 shadow-2xs transition-transform active:scale-95 flex items-center gap-1"
                >
                  <span>⇅</span>
                  <span>Swap Locations</span>
                </button>
              </div>

              {/* Destination Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
                  Delivery Destination
                </label>
                <div className="relative">
                  <select
                    id="destination-location-select"
                    value={destination.name}
                    onChange={(e) => {
                      const found = NOIDA_LOCATIONS.find((l) => l.name === e.target.value);
                      if (found) setDestination(found);
                    }}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs font-semibold text-neutral-900 focus:bg-white focus:border-[#FF6B35] focus:outline-none appearance-none"
                  >
                    {NOIDA_LOCATIONS.map((loc) => (
                      <option key={loc.name} value={loc.name}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                  <ChevronRight className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                </div>
                <p className="text-[11px] text-neutral-500 pl-4">{destination.address}</p>
              </div>
            </div>

            {/* Package Details Form */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-xs space-y-4">
              <h3 className="text-xs font-black text-neutral-500 uppercase tracking-wider">
                Package Details & Schedule
              </h3>

              {/* Package Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">Item / Category</label>
                <select
                  id="package-type-select"
                  value={packageType}
                  onChange={(e) => setPackageType(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs font-semibold text-neutral-900 focus:bg-white focus:border-[#FF6B35] focus:outline-none"
                >
                  {packageTypeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Weight Chips */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">Estimated Weight</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {weightOptions.map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setPackageWeight(w)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        packageWeight === w
                          ? 'bg-[#FFF2EB] border-[#FF6B35] text-[#E85A2A] shadow-2xs'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery Schedule (Instant vs Scheduled) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">Delivery Schedule</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('instant')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                      deliveryType === 'instant'
                        ? 'bg-[#171717] text-white border-[#171717] shadow-xs'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 text-[#FF6B35]" />
                    <span>Instant (20-30 min)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType('scheduled')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                      deliveryType === 'scheduled'
                        ? 'bg-[#171717] text-white border-[#171717] shadow-xs'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 text-[#FF6B35]" />
                    <span>Scheduled Later</span>
                  </button>
                </div>
              </div>

              {/* Delivery Instructions */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">
                  Instructions for Rider (Optional)
                </label>
                <input
                  id="delivery-instructions-input"
                  type="text"
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  placeholder="e.g. Ring bell, leave with security guard, call before delivery..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs font-medium text-neutral-900 focus:bg-white focus:border-[#FF6B35] focus:outline-none"
                >
                </input>
              </div>
            </div>
          </div>

          {/* Right Column: Route Map & Live Pricing Engine (5 cols on lg, sticky) */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
            {/* Live Route Map */}
            <div className="rounded-3xl overflow-hidden border border-neutral-200 shadow-xs">
              <MapView
                pickup={pickup}
                destination={destination}
                heightClass="h-52 sm:h-60"
                distanceKm={quote.distanceKm}
                etaMin={quote.estimatedMinutes}
                showDetailsOverlay={true}
              />
            </div>

            {/* Live Price Calculation Breakdown Card */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-neutral-500 uppercase tracking-wider">
                  Transparent Fare Breakdown
                </h3>
                <span className="text-[11px] font-semibold text-[#16A34A] bg-green-50 px-2 py-0.5 rounded-md border border-green-200">
                  Guaranteed Rate
                </span>
              </div>

              <div className="space-y-2 text-xs divide-y divide-neutral-100">
                <div className="flex justify-between py-1 text-neutral-600">
                  <span>Transit Distance</span>
                  <span className="font-bold text-neutral-900">{quote.distanceKm} km</span>
                </div>
                <div className="flex justify-between py-1 text-neutral-600">
                  <span>Base Rate</span>
                  <span className="font-semibold text-neutral-900">₹{quote.baseFare}</span>
                </div>
                <div className="flex justify-between py-1 text-neutral-600">
                  <span>Distance Rate (₹{activeService.perKm}/km)</span>
                  <span className="font-semibold text-neutral-900">₹{quote.distanceFare}</span>
                </div>
                <div className="flex justify-between py-1 text-neutral-600">
                  <span>Platform & Safety Fee</span>
                  <span className="font-semibold text-neutral-900">₹{quote.platformFee}</span>
                </div>
                <div className="flex justify-between py-1 text-neutral-600">
                  <span>Taxes & GST (5%)</span>
                  <span className="font-semibold text-neutral-900">₹{quote.tax}</span>
                </div>

                {quote.passDiscount && quote.passDiscount > 0 ? (
                  <div className="flex items-center justify-between py-2 text-green-700 bg-green-50 px-2.5 rounded-xl border border-green-200">
                    <span className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> QuickPass Benefit
                    </span>
                    <span className="font-black text-sm">-₹{quote.passDiscount}</span>
                  </div>
                ) : (
                  <div className="py-2 px-3 rounded-xl bg-orange-50 border border-orange-200 text-neutral-800 text-[11px] flex items-center justify-between">
                    <span>💡 Save delivery fees with QuickPass</span>
                    <span className="text-[#FF6B35] font-black">From ₹79</span>
                  </div>
                )}

                <div className="flex justify-between pt-2.5 text-base font-black text-neutral-900">
                  <span>Total Payable</span>
                  <span className="text-[#FF6B35] text-xl font-black">₹{quote.total}</span>
                </div>
              </div>

              <button
                id="btn-continue-confirm-order"
                onClick={() => setStep('confirm')}
                className="mt-4 w-full bg-[#FF6B35] hover:bg-[#E85A2A] text-white text-sm font-extrabold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-[#FF6B35]/20 transition-all active:scale-[0.98]"
              >
                <span>Continue to Checkout</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-center text-neutral-400 pt-1">
                🔒 Free cancellation until rider arrives at pickup point
              </p>
            </div>
          </div>
        </div>
      )}

      {step === 'confirm' && (
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-5 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <h3 className="text-lg font-black text-neutral-900">Confirm Booking & Payment</h3>
                <p className="text-xs text-neutral-500">Review your trip details before dispatching</p>
              </div>
              <span className="text-xs font-bold text-[#FF6B35] bg-[#FFF2EB] px-3 py-1 rounded-full border border-[#FF6B35]/20">
                {activeService.name}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200">
                <span className="text-neutral-400 block font-bold text-[10px] uppercase">Pickup Point</span>
                <div className="font-extrabold text-neutral-900 mt-1">{pickup.name}</div>
                <div className="text-neutral-500 text-[11px] mt-0.5">{pickup.address}</div>
              </div>

              <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200">
                <span className="text-neutral-400 block font-bold text-[10px] uppercase">Drop-off Destination</span>
                <div className="font-extrabold text-neutral-900 mt-1">{destination.name}</div>
                <div className="text-neutral-500 text-[11px] mt-0.5">{destination.address}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-neutral-100 text-xs">
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase">Package</span>
                <strong className="text-neutral-900 block truncate">{packageType}</strong>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase">Weight</span>
                <strong className="text-neutral-900">{packageWeight}</strong>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase">Transit Distance</span>
                <strong className="text-neutral-900">{quote.distanceKm} km</strong>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase">ETA</span>
                <strong className="text-[#16A34A]">{quote.estimatedMinutes} minutes</strong>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-xs text-neutral-500 block">Final Bill (incl. GST)</span>
                <span className="text-2xl font-black text-neutral-900">₹{quote.total}</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-green-100 text-green-700 flex items-center justify-center font-black text-xs">
                  UPI
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-neutral-900">Instant UPI Direct</div>
                  <div className="text-[10px] text-green-600 font-bold">Zero convenience fees</div>
                </div>
              </div>
            </div>

            <button
              id="btn-pay-and-place-order"
              onClick={handlePlaceOrder}
              className="w-full bg-[#FF6B35] hover:bg-[#E85A2A] text-white text-base font-extrabold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#FF6B35]/25 transition-all active:scale-[0.98]"
            >
              <span>Authorize ₹{quote.total} & Find Nearest Courier</span>
              <Sparkles className="w-4 h-4" />
            </button>

            <button
              onClick={() => setStep('form')}
              className="w-full text-xs font-bold text-neutral-500 hover:text-neutral-900 py-1"
            >
              ← Back to Edit Delivery Details
            </button>
          </div>
        </div>
      )}

      {step === 'paying' && (
        <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm flex flex-col items-center justify-center text-center space-y-4 py-16">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-[#FFF2EB] border-2 border-[#FF6B35] flex items-center justify-center text-[#FF6B35] animate-spin">
              <CreditCard className="w-8 h-8" />
            </div>
          </div>
          <h3 className="text-lg font-extrabold text-neutral-900">Processing Mock Payment...</h3>
          <p className="text-xs text-neutral-500 max-w-xs">
            Securing ₹{quote.total} via instant UPI gateway and creating your delivery request.
          </p>
        </div>
      )}
    </div>
  );
};
