import React from 'react';
import { OrderStatus } from '../../types';

interface BadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const OrderStatusBadge: React.FC<BadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5',
  };

  const getStyle = (s: OrderStatus) => {
    switch (s) {
      case 'ORDER_PLACED':
      case 'ORDER_CONFIRMED':
      case 'CREATED':
      case 'SEARCHING_PARTNER':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'BUSINESS_PREPARING':
      case 'READY_FOR_PICKUP':
        return 'bg-purple-50 text-purple-700 border-purple-200 font-semibold';
      case 'PARTNER_ASSIGNED':
      case 'PARTNER_ACCEPTED':
      case 'PARTNER_ARRIVING':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'ARRIVED_AT_PICKUP':
      case 'PICKED_UP':
      case 'OUT_FOR_DELIVERY':
      case 'IN_TRANSIT':
      case 'ARRIVED_AT_DESTINATION':
        return 'bg-red-50 text-red-700 border-red-200 font-semibold';
      case 'DELIVERED':
      case 'COMPLETED':
        return 'bg-green-50 text-green-700 border-green-200 font-semibold';
      case 'CANCELLED':
      case 'FAILED':
      case 'EXPIRED':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  const formatText = (s: OrderStatus) => {
    return s.replace(/_/g, ' ');
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${getStyle(
        status
      )} ${sizeClasses[size]}`}
    >
      {(status === 'SEARCHING_PARTNER' || status === 'IN_TRANSIT' || status === 'PARTNER_ARRIVING') && (
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
      )}
      {formatText(status)}
    </span>
  );
};
