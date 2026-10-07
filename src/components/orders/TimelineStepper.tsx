import React from 'react';
import { OrderStatus } from '../../types';
import { Check, Clock, CircleDot, AlertTriangle } from 'lucide-react';

interface TimelineStepperProps {
  currentStatus: OrderStatus;
  timeline: {
    status: OrderStatus;
    time: string;
    description: string;
  }[];
}

const ORDER_STEPS: { status: OrderStatus; label: string; sub: string }[] = [
  { status: 'CREATED', label: 'Order Confirmed', sub: 'Payment verified' },
  { status: 'PARTNER_ASSIGNED', label: 'Partner Assigned', sub: 'Matched with rider' },
  { status: 'PARTNER_ARRIVING', label: 'Partner Arriving', sub: 'Heading to pickup' },
  { status: 'PICKED_UP', label: 'Picked Up', sub: 'Package collected' },
  { status: 'IN_TRANSIT', label: 'In Transit', sub: 'En route to destination' },
  { status: 'DELIVERED', label: 'Delivered', sub: 'Handed over safely' },
];

export const TimelineStepper: React.FC<TimelineStepperProps> = ({ currentStatus, timeline }) => {
  if (currentStatus === 'CANCELLED') {
    return (
      <div className="p-4 bg-red-50 rounded-2xl border border-red-200 flex items-center gap-3 text-red-800">
        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
        <div>
          <h5 className="font-bold text-sm">Order Cancelled</h5>
          <p className="text-xs text-red-600">This order has been cancelled and refunded.</p>
        </div>
      </div>
    );
  }

  // Determine active step index
  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'CREATED':
      case 'SEARCHING_PARTNER':
        return 0;
      case 'PARTNER_ASSIGNED':
      case 'PARTNER_ACCEPTED':
        return 1;
      case 'PARTNER_ARRIVING':
      case 'ARRIVED_AT_PICKUP':
        return 2;
      case 'PICKED_UP':
        return 3;
      case 'IN_TRANSIT':
      case 'ARRIVED_AT_DESTINATION':
        return 4;
      case 'DELIVERED':
      case 'COMPLETED':
        return 5;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(currentStatus);

  return (
    <div className="py-2 space-y-4">
      {ORDER_STEPS.map((step, idx) => {
        const isDone = idx < currentIndex || currentStatus === 'DELIVERED' || currentStatus === 'COMPLETED';
        const isCurrent = idx === currentIndex && currentStatus !== 'DELIVERED' && currentStatus !== 'COMPLETED';
        const isUpcoming = idx > currentIndex;

        // Find match in actual order timeline history if available
        const matchedItem = timeline.find((t) => t.status === step.status);

        return (
          <div key={step.status} className="relative flex items-start gap-3.5">
            {/* Step Line */}
            {idx < ORDER_STEPS.length - 1 && (
              <div
                className={`absolute left-3.5 top-7 bottom-0 w-0.5 -translate-x-1/2 ${
                  isDone ? 'bg-green-600' : 'bg-neutral-200'
                }`}
              />
            )}

            {/* Step Icon */}
            <div
              className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                isDone
                  ? 'bg-green-600 text-white shadow-xs'
                  : isCurrent
                  ? 'bg-white border-2 border-red-600 text-red-600 shadow-xs'
                  : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
              }`}
            >
              {isDone ? (
                <Check className="w-4 h-4 stroke-[3]" />
              ) : isCurrent ? (
                <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse" />
              ) : (
                <span className="text-[10px]">{idx + 1}</span>
              )}
            </div>

            {/* Step Text & Time */}
            <div className="flex-1 pb-4 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <h5
                  className={`text-xs font-bold leading-tight ${
                    isDone || isCurrent ? 'text-neutral-900' : 'text-neutral-400'
                  }`}
                >
                  {step.label}
                </h5>
                {matchedItem && (
                  <span className="text-[10px] text-neutral-400 font-mono shrink-0">
                    {matchedItem.time}
                  </span>
                )}
              </div>
              <p
                className={`text-[11px] mt-0.5 leading-snug ${
                  isCurrent ? 'text-[#E85A2A] font-medium' : isDone ? 'text-neutral-600' : 'text-neutral-400'
                }`}
              >
                {matchedItem?.description || step.sub}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
