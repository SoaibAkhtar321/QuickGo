import React, { useState, useEffect } from 'react';
import { useApp } from '../../store/AppContext';
import { Order } from '../../types';
import {
  Bike,
  TrendingUp,
  Award,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Zap,
  ArrowRight,
  Power,
  Package,
} from 'lucide-react';

interface PartnerHomeProps {
  onOpenActiveJob?: (orderId: string) => void;
  onOpenDelivery?: (orderId: string) => void;
}

export const PartnerHome: React.FC<PartnerHomeProps> = ({ onOpenActiveJob, onOpenDelivery }) => {
  const handleOpenJob = (orderId: string) => {
    if (onOpenDelivery) onOpenDelivery(orderId);
    else if (onOpenActiveJob) onOpenActiveJob(orderId);
  };
  const {
    currentPartner,
    togglePartnerOnline,
    orders,
    acceptOrder,
    rejectOrder,
  } = useApp();

  const [countdown, setCountdown] = useState(15);

  // Check if partner is currently executing an active order
  const activeJob = orders.find(
    (o) =>
      o.partnerId === currentPartner.id &&
      o.status !== 'DELIVERED' &&
      o.status !== 'COMPLETED' &&
      o.status !== 'CANCELLED' &&
      o.status !== 'FAILED'
  );

  // Check if there is an incoming broadcast order waiting for acceptance
  const incomingRequest = orders.find(
    (o) =>
      (o.status === 'SEARCHING_PARTNER' || o.status === 'CREATED') &&
      o.partnerId === undefined
  );

  // 15s Countdown timer for request broadcast
  useEffect(() => {
    if (!incomingRequest || !currentPartner.isOnline) {
      setCountdown(15);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Auto reject on timeout
          rejectOrder(incomingRequest.id, currentPartner.id);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [incomingRequest, currentPartner.isOnline, rejectOrder, currentPartner.id]);

  const handleAccept = (orderId: string) => {
    acceptOrder(orderId, currentPartner.id);
    handleOpenJob(orderId);
  };

  const handleReject = (orderId: string) => {
    rejectOrder(orderId, currentPartner.id);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header Profile & Online Status Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#FF6B35] shadow-xs">
              <img
                src={currentPartner.avatar}
                alt={currentPartner.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                currentPartner.isOnline ? 'bg-green-500' : 'bg-neutral-400'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900">
                Welcome back, {currentPartner.name.split(' ')[0]}!
              </h2>
              <span
                className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${
                  currentPartner.isOnline
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                }`}
              >
                {currentPartner.isOnline ? 'ONLINE • ON DUTY' : 'OFFLINE'}
              </span>
            </div>
            <p className="text-xs text-neutral-500 font-medium mt-0.5">
              {currentPartner.vehicle} • {currentPartner.phone} • QuickGo Direct Fleet
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="partner-toggle-online-btn"
            onClick={() => togglePartnerOnline()}
            className={`px-5 py-3 rounded-2xl border font-black text-xs flex items-center gap-2.5 transition-all shadow-xs active:scale-95 ${
              currentPartner.isOnline
                ? 'bg-green-500 hover:bg-green-600 text-white border-green-600 shadow-green-500/20'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-neutral-300'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{currentPartner.isOnline ? 'Go Offline' : 'Go Online Now'}</span>
          </button>
        </div>
      </div>

      {/* Offline Alert if Offline */}
      {!currentPartner.isOnline && (
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-amber-900 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>You are currently <strong>OFFLINE</strong>. Toggle online to receive live delivery alerts in Noida.</span>
          </div>
          <button
            onClick={() => togglePartnerOnline()}
            className="px-3.5 py-1.5 bg-amber-600 text-white rounded-xl font-black text-xs hover:bg-amber-700 shadow-2xs"
          >
            Go Online
          </button>
        </div>
      )}

      {/* Today's KPI Performance Stats (4 Columns on Desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-xs">
          <div className="text-[11px] font-black text-neutral-400 uppercase tracking-wider">
            Today's Earnings
          </div>
          <div className="text-2xl font-black text-neutral-900 mt-1">
            ₹{currentPartner.earningsToday}
          </div>
          <div className="text-xs font-bold text-green-600 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18% vs yesterday
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-xs">
          <div className="text-[11px] font-black text-neutral-400 uppercase tracking-wider">
            Trips Completed
          </div>
          <div className="text-2xl font-black text-neutral-900 mt-1">
            {currentPartner.totalDeliveries % 20 || 14} <span className="text-sm text-neutral-400 font-semibold">/ 18</span>
          </div>
          <div className="text-xs text-neutral-500 font-medium mt-1">4 more for ₹450 incentive</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-xs">
          <div className="text-[11px] font-black text-neutral-400 uppercase tracking-wider">
            Rider Rating
          </div>
          <div className="text-2xl font-black text-neutral-900 mt-1">
            ⭐ {currentPartner.rating}
          </div>
          <div className="text-xs text-[#16A34A] font-bold mt-1">Top 5% Elite Tier</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-xs">
          <div className="text-[11px] font-black text-neutral-400 uppercase tracking-wider">
            Acceptance Rate
          </div>
          <div className="text-2xl font-black text-neutral-900 mt-1">
            96.8%
          </div>
          <div className="text-xs text-neutral-500 font-medium mt-1">Superfast response time</div>
        </div>
      </div>

      {/* Two-Column Responsive Workspace on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Active Order & Incoming Broadcasts & Demand Zones */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Delivery Notification Banner (If on a job) */}
          {activeJob && (
            <div className="bg-gradient-to-tr from-neutral-900 to-neutral-800 rounded-3xl p-6 text-white shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-[#FF6B35] animate-ping" />
                  <span className="text-xs font-black text-[#FF8C5A] uppercase tracking-wider">
                    Active Job in Progress
                  </span>
                </div>
                <span className="font-mono text-xs text-neutral-300">#{activeJob.id}</span>
              </div>

              <div className="text-xs space-y-1.5">
                <div className="text-neutral-400 uppercase text-[10px] font-bold">Current Milestone:</div>
                <div className="text-base font-black text-white uppercase tracking-wide">
                  {activeJob.status.replace(/_/g, ' ')}
                </div>
                <p className="text-neutral-300 text-xs">
                  {activeJob.pickup.name} → {activeJob.destination.name}
                </p>
              </div>

              <button
                id="partner-btn-open-active-delivery"
                onClick={() => handleOpenJob(activeJob.id)}
                className="w-full bg-[#FF6B35] hover:bg-[#E85A2A] text-white text-xs font-black py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#FF6B35]/25"
              >
                <span>Open Active Mission Cockpit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Incoming Delivery Request Card (With 15-second countdown timer) */}
          {incomingRequest && currentPartner.isOnline && !activeJob && (
            <div
              id="incoming-delivery-request-card"
              className="bg-white rounded-3xl p-6 border-2 border-[#FF6B35] shadow-xl space-y-5 animate-in zoom-in-95 duration-200"
            >
              {/* Header & 15s Timer Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-[#E85A2A] bg-[#FFF2EB] px-3 py-1 rounded-full border border-[#FF6B35]/20">
                    ⚡ NEW DELIVERY REQUEST
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono font-black text-red-600">
                    <Clock className="w-4 h-4" />
                    <span>{countdown}s auto-reassign</span>
                  </div>
                </div>

                {/* Visual timer bar */}
                <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FF6B35] transition-all duration-1000 ease-linear rounded-full"
                    style={{ width: `${(countdown / 15) * 100}%` }}
                  />
                </div>
              </div>

              {/* Service & Fare Overview */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF2EB] text-[#FF6B35] flex items-center justify-center text-xl">
                    📦
                  </div>
                  <div>
                    <h4 className="text-base font-black text-neutral-900">
                      {incomingRequest.serviceName}
                    </h4>
                    <p className="text-xs text-neutral-500 font-medium">Order #{incomingRequest.id}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-[#16A34A]">
                    ₹{Math.round(incomingRequest.pricing.total * 0.82)}
                  </div>
                  <span className="text-xs text-neutral-400 font-bold">Your Take-Home Fare</span>
                </div>
              </div>

              {/* Locations */}
              <div className="space-y-3 text-xs bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                <div className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B35] mt-1 shrink-0" />
                  <div>
                    <div className="font-black text-neutral-900 text-sm">
                      Pickup: {incomingRequest.pickup.name}
                    </div>
                    <div className="text-neutral-500 text-xs">
                      {incomingRequest.pickup.address} (1.4 km from your spot)
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-neutral-200/60 pt-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] mt-1 shrink-0" />
                  <div>
                    <div className="font-black text-neutral-900 text-sm">
                      Drop-off: {incomingRequest.destination.name}
                    </div>
                    <div className="text-neutral-500 text-xs">
                      {incomingRequest.destination.address} ({incomingRequest.pricing.distanceKm} km route)
                    </div>
                  </div>
                </div>
              </div>

              {/* Accept / Reject Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  id="partner-btn-reject-request"
                  onClick={() => handleReject(incomingRequest.id)}
                  className="py-3.5 px-4 rounded-2xl border border-neutral-300 hover:bg-neutral-100 text-neutral-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <XCircle className="w-4 h-4 text-neutral-500" />
                  <span>Pass Request</span>
                </button>

                <button
                  id="partner-btn-accept-request"
                  onClick={() => handleAccept(incomingRequest.id)}
                  className="py-3.5 px-4 rounded-2xl bg-[#FF6B35] hover:bg-[#E85A2A] text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#FF6B35]/25 transition-all active:scale-[0.98]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Accept Delivery</span>
                </button>
              </div>
            </div>
          )}

          {/* Regional Hotspot Demand Radar Card */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-black text-neutral-900">Regional Demand Hotspots</h4>
                <p className="text-xs text-neutral-500">Live order density across Noida sectors</p>
              </div>
              <span className="text-xs font-black text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                ⚡ Surge Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#FFF9F5] border border-[#FF6B35]/30">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-900">Sector 18 Market</span>
                  <span className="text-[10px] font-black text-[#FF6B35] bg-white px-1.5 py-0.5 rounded shadow-2xs">1.5x Fare</span>
                </div>
                <div className="text-[11px] text-neutral-500 mt-1">High Order Volume • 28 Active</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-900">Sector 62 IT Park</span>
                  <span className="text-[10px] font-black text-blue-600 bg-white px-1.5 py-0.5 rounded shadow-2xs">1.2x Fare</span>
                </div>
                <div className="text-[11px] text-neutral-500 mt-1">Moderate Volume • 14 Active</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-900">Sector 137 Metro</span>
                  <span className="text-[10px] font-black text-green-600 bg-white px-1.5 py-0.5 rounded shadow-2xs">Standard</span>
                </div>
                <div className="text-[11px] text-neutral-500 mt-1">Steady Deliveries • 9 Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Daily Milestone Ladder & Recent Deliveries */}
        <div className="lg:col-span-5 space-y-6">
          {/* Daily Incentive Ladder */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-neutral-500 uppercase tracking-wider">
                Shift Incentive Target
              </h4>
              <span className="text-xs font-black text-[#16A34A] bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
                +₹450 Bonus
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-neutral-800 mb-1.5">
                <span>14 of 18 deliveries completed</span>
                <span>77%</span>
              </div>
              <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#FF6B35] to-[#16A34A] w-[77%] rounded-full transition-all duration-500" />
              </div>
            </div>

            <p className="text-xs text-neutral-500 leading-relaxed">
              Complete 4 more orders before 11:00 PM tonight to trigger the ₹450 Daily Shift Bonus into your wallet.
            </p>
          </div>

          {/* Recent Deliveries List */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
            <h4 className="text-xs font-black text-neutral-500 uppercase tracking-wider">
              Recent Completed Shifts
            </h4>

            <div className="space-y-3 text-xs">
              {[
                {
                  id: 'QG10288',
                  route: 'Sector 62 → Sector 18',
                  payout: '₹140',
                  time: '11:45 AM',
                  rating: '⭐ 5.0',
                },
                {
                  id: 'QG10287',
                  route: 'Indirapuram → Sector 63',
                  payout: '₹95',
                  time: '10:20 AM',
                  rating: '⭐ 5.0',
                },
                {
                  id: 'QG10286',
                  route: 'Sector 15 → Sector 128',
                  payout: '₹220',
                  time: '09:15 AM',
                  rating: '⭐ 4.8',
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-neutral-900">{item.route}</div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">
                      #{item.id} • {item.time}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-neutral-900 text-sm">{item.payout}</div>
                    <span className="text-[10px] text-amber-600 font-bold">{item.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
