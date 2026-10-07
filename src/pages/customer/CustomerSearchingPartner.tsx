import React, { useEffect, useState } from 'react';
import { useApp } from '../../store/AppContext';
import { Order } from '../../types';
import { Bike, CheckCircle2, Navigation, ArrowRight, ShieldCheck } from 'lucide-react';

interface CustomerSearchingPartnerProps {
  orderId: string;
  onTrack: (orderId: string) => void;
}

export const CustomerSearchingPartner: React.FC<CustomerSearchingPartnerProps> = ({
  orderId,
  onTrack,
}) => {
  const { orders, partners, acceptOrder, currentPartner } = useApp();
  const [isFound, setIsFound] = useState(false);

  const order = orders.find((o) => o.id === orderId);

  useEffect(() => {
    // If order already has partner assigned or accepted
    if (order && (order.status !== 'SEARCHING_PARTNER' && order.status !== 'CREATED')) {
      setIsFound(true);
      return;
    }

    // Auto-match after 3.2 seconds if not accepted manually
    const timer = setTimeout(() => {
      if (order && (order.status === 'SEARCHING_PARTNER' || order.status === 'CREATED')) {
        const availablePartner = partners.find((p) => p.isOnline) || currentPartner;
        acceptOrder(orderId, availablePartner.id);
        setIsFound(true);
      }
    }, 3200);

    return () => clearTimeout(timer);
  }, [orderId, order?.status, partners, currentPartner, acceptOrder]);

  if (!order) return null;

  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center text-center p-4">
      {!isFound ? (
        /* Searching Animated State */
        <div className="w-full max-w-sm bg-white rounded-3xl p-8 border border-neutral-200 shadow-xl space-y-6 animate-in zoom-in-95 duration-200">
          <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
            {/* Radar concentric pulsing circles */}
            <div className="absolute inset-0 rounded-full bg-[#FF6B35]/15 animate-ping" />
            <div className="absolute -inset-3 rounded-full bg-[#FF6B35]/10 animate-pulse" />
            <div className="relative w-20 h-20 rounded-full bg-[#FFF2EB] border-2 border-[#FF6B35] flex items-center justify-center text-[#FF6B35] shadow-md">
              <Bike className="w-9 h-9 animate-bounce" />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-[#E85A2A] uppercase tracking-wider bg-[#FFF2EB] px-3 py-1 rounded-full border border-[#FF6B35]/20">
              Order #{order.id}
            </span>
            <h3 className="text-xl font-extrabold text-neutral-900">
              Finding a delivery partner nearby...
            </h3>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto">
              Broadcasting your request to available verified riders in {order.pickup.name.split(',')[0]}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 py-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B35] animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B35] animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B35] animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>

          <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 text-[11px] text-neutral-600 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
            <span>You can also switch to <strong>Delivery Partner</strong> to accept manually!</span>
          </div>
        </div>
      ) : (
        /* Partner Found State */
        <div className="w-full max-w-sm bg-white rounded-3xl p-8 border border-neutral-200 shadow-xl space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-green-50 text-[#16A34A] border-2 border-green-200 mx-auto flex items-center justify-center shadow-md">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-green-700 uppercase tracking-wider">
              ✓ Delivery Partner Found
            </span>
            <h3 className="text-2xl font-extrabold text-neutral-900">
              {order.partnerName || 'Amit Kumar'}
            </h3>
            <div className="flex items-center justify-center gap-2 text-xs text-neutral-600 font-medium">
              <span className="text-amber-500 font-bold">⭐ {order.partnerRating || 4.85}</span>
              <span>•</span>
              <span>{order.partnerVehicle || 'Honda Activa 6G'}</span>
            </div>
          </div>

          <div className="p-4 bg-[#FFF9F5] rounded-2xl border border-[#FF6B35]/20 text-xs text-[#E85A2A] font-semibold">
            Arriving at pickup in approximately 8 minutes
          </div>

          <button
            id="btn-partner-found-track"
            onClick={() => onTrack(order.id)}
            className="w-full bg-[#FF6B35] hover:bg-[#E85A2A] text-white text-sm font-extrabold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#FF6B35]/25 transition-all active:scale-[0.98]"
          >
            <Navigation className="w-4 h-4" />
            <span>Track Delivery</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
