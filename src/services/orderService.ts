import { LocationCoord, Order, OrderPassInfo, OrderStatus, PricingBreakdown, ServiceConfig } from '../types';

export const orderService = {
  generateId(existingOrders: Order[]): string {
    const numbers = existingOrders
      .map((o) => parseInt(o.id.replace('QG', ''), 10))
      .filter((n) => !isNaN(n));
    const max = numbers.length > 0 ? Math.max(...numbers) : 10295;
    return `QG${max + 1}`;
  },

  createOrder(
    id: string,
    customerId: string,
    customerName: string,
    customerPhone: string,
    service: ServiceConfig,
    pickup: LocationCoord,
    destination: LocationCoord,
    pricing: PricingBreakdown,
    packageType: string,
    packageWeight?: string,
    deliveryInstructions?: string,
    deliveryType: 'instant' | 'scheduled' = 'instant',
    scheduledTime?: string,
    businessId?: string,
    businessName?: string,
    passInfo?: OrderPassInfo
  ): Order {
    const now = new Date();
    const timeStr = `Today, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    return {
      id,
      customerId,
      customerName,
      customerPhone,
      businessId,
      businessName,
      serviceId: service.id,
      serviceName: service.name,
      status: 'SEARCHING_PARTNER',
      pickup,
      destination,
      packageType: packageType || `${service.name} Package`,
      packageWeight: packageWeight || '1.0 kg',
      deliveryInstructions: deliveryInstructions || 'None',
      deliveryType,
      scheduledTime,
      pricing,
      passInfo,
      createdAt: timeStr,
      updatedAt: 'Just now',
      paymentStatus: 'PAID',
      paymentMethod: 'UPI',
      timeline: [
        { status: 'CREATED', time: timeStr, description: 'Order confirmed and payment verified' },
        { status: 'SEARCHING_PARTNER', time: timeStr, description: 'Searching for nearby delivery partner' },
      ],
    };
  },

  getNextAllowedStatus(current: OrderStatus): OrderStatus | null {
    switch (current) {
      case 'ORDER_PLACED':
        return 'ORDER_CONFIRMED';
      case 'ORDER_CONFIRMED':
        return 'BUSINESS_PREPARING';
      case 'BUSINESS_PREPARING':
        return 'READY_FOR_PICKUP';
      case 'READY_FOR_PICKUP':
        return 'PARTNER_ASSIGNED';
      case 'CREATED':
        return 'SEARCHING_PARTNER';
      case 'SEARCHING_PARTNER':
        return 'PARTNER_ASSIGNED';
      case 'PARTNER_ASSIGNED':
        return 'PARTNER_ACCEPTED';
      case 'PARTNER_ACCEPTED':
        return 'PARTNER_ARRIVING';
      case 'PARTNER_ARRIVING':
        return 'ARRIVED_AT_PICKUP';
      case 'ARRIVED_AT_PICKUP':
        return 'PICKED_UP';
      case 'PICKED_UP':
        return 'OUT_FOR_DELIVERY';
      case 'OUT_FOR_DELIVERY':
      case 'IN_TRANSIT':
        return 'ARRIVED_AT_DESTINATION';
      case 'ARRIVED_AT_DESTINATION':
        return 'DELIVERED';
      case 'DELIVERED':
        return 'COMPLETED';
      default:
        return null;
    }
  },

  getStatusLabel(status: OrderStatus): string {
    switch (status) {
      case 'ORDER_PLACED':
        return 'Order Placed';
      case 'ORDER_CONFIRMED':
        return 'Store Confirmed';
      case 'BUSINESS_PREPARING':
        return 'Store Preparing';
      case 'READY_FOR_PICKUP':
        return 'Ready for Pickup';
      case 'OUT_FOR_DELIVERY':
        return 'Out for Delivery';
      case 'CREATED':
        return 'Created';
      case 'SEARCHING_PARTNER':
        return 'Searching Partner';
      case 'PARTNER_ASSIGNED':
        return 'Partner Assigned';
      case 'PARTNER_ACCEPTED':
        return 'Partner Accepted';
      case 'PARTNER_ARRIVING':
        return 'Partner Arriving';
      case 'ARRIVED_AT_PICKUP':
        return 'At Pickup';
      case 'PICKED_UP':
        return 'Picked Up';
      case 'IN_TRANSIT':
        return 'In Transit';
      case 'ARRIVED_AT_DESTINATION':
        return 'At Destination';
      case 'DELIVERED':
        return 'Delivered';
      case 'COMPLETED':
        return 'Completed';
      case 'CANCELLED':
        return 'Cancelled';
      case 'FAILED':
        return 'Failed';
      case 'EXPIRED':
        return 'Expired';
      default:
        return status;
    }
  },
};
