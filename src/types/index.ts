export type UserRole = 'customer' | 'business' | 'partner' | 'admin';

export type OrderStatus =
  | 'ORDER_PLACED'
  | 'ORDER_CONFIRMED'
  | 'BUSINESS_PREPARING'
  | 'READY_FOR_PICKUP'
  | 'CREATED'
  | 'SEARCHING_PARTNER'
  | 'PARTNER_ASSIGNED'
  | 'PARTNER_ACCEPTED'
  | 'PARTNER_ARRIVING'
  | 'ARRIVED_AT_PICKUP'
  | 'PICKED_UP'
  | 'OUT_FOR_DELIVERY'
  | 'IN_TRANSIT'
  | 'ARRIVED_AT_DESTINATION'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'FAILED'
  | 'EXPIRED';

export type ServiceId =
  | 'parcel'
  | 'food'
  | 'grocery'
  | 'tiffin'
  | 'documents'
  | 'pickup_drop'
  | string;

export interface LocationCoord {
  name: string;
  address: string;
  lat: number;
  lng: number;
  x: number; // 0-100 coordinate on local vector map
  y: number; // 0-100 coordinate on local vector map
}

export interface PartnerLocation {
  lat: number;
  lng: number;
  x: number;
  y: number;
  heading: number; // 0-360 deg
  speed: number; // km/h
  lastUpdated: string;
  isMoving: boolean;
}

export interface ServiceConfig {
  id: ServiceId;
  name: string;
  icon: string;
  tagline: string;
  description: string;
  baseFare: number;
  perKm: number;
  minFare: number;
  platformFee: number;
  taxRate: number; // e.g. 0.05
  enabled: boolean;
  estimatedTimePerKm: number; // minutes per km
}

export interface PricingBreakdown {
  distanceKm: number;
  baseFare: number;
  distanceFare: number;
  platformFee: number;
  tax: number;
  surgeMultiplier: number;
  surgeAmount: number;
  passDiscount?: number;
  couponDiscount?: number;
  total: number;
  estimatedMinutes: number;
}

export interface OrderPassInfo {
  passId: string;
  planName: string;
  discountAmount: number;
}

// -------------------------------------------------------------
// Quick-Commerce Product & Category Models
// -------------------------------------------------------------
export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  parentCategoryId: string;
  icon?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  tagline?: string;
  displayOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  banner?: string;
  subcategories: SubCategory[];
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  mrp: number;
  discountPercent: number;
  unit: string; // e.g., "500 ml", "1 kg", "Pack of 2"
  image: string;
  images?: string[];
  categoryId: string;
  categoryName: string;
  subcategoryId?: string;
  subcategoryName?: string;
  businessId: string;
  businessName: string;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  stock: number;
  estimatedDeliveryMinutes: number; // e.g., 10, 12, 15
  tags?: string[]; // e.g., ["Bestseller", "Organic", "Trending", "Deal of Day"]
  shelfLife?: string;
  countryOfOrigin?: string;
  specifications?: Record<string, string>;
  isVeg?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  businessId: string;
  businessName: string;
}

export interface Coupon {
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minCartValue: number;
  maxDiscount?: number;
  isPassExclusive?: boolean;
}

export interface CustomerAddress {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  tag?: string;
  address: string;
  flatNo?: string;
  landmark?: string;
  location: LocationCoord;
  isDefault: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unit?: string;
  image?: string;
}

export interface Order {
  id: string; // e.g. QG10291
  customerId: string;
  customerName: string;
  customerPhone: string;
  businessId?: string; // If ordered from / dispatched by a registered business
  businessName?: string;
  serviceId: ServiceId;
  serviceName: string;
  status: OrderStatus;
  pickup: LocationCoord;
  destination: LocationCoord;
  packageType: string;
  packageWeight?: string;
  deliveryInstructions?: string;
  deliveryType: 'instant' | 'scheduled';
  scheduledTime?: string;
  pricing: PricingBreakdown;
  passInfo?: OrderPassInfo;
  items?: OrderItem[];
  orderType?: 'quick_commerce' | 'courier_service';
  couponCode?: string;
  couponDiscount?: number;
  deliveryAddress?: CustomerAddress;
  partnerId?: string;
  partnerName?: string;
  partnerPhone?: string;
  partnerRating?: number;
  partnerVehicle?: string;
  partnerLocation?: PartnerLocation;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED' | 'FAILED';
  paymentMethod: 'UPI' | 'Card' | 'Wallet' | 'Cash on Delivery';
  timeline: {
    status: OrderStatus;
    time: string;
    description: string;
  }[];
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  status: 'ACTIVE' | 'SUSPENDED';
  joinedDate: string;
  activePassId?: string;
  savedAddresses?: CustomerAddress[];
}

export type Partner = DeliveryPartner;

export interface PartnerActivityItem {
  id: string;
  time: string;
  action: string;
  type: 'online' | 'order_accept' | 'pickup' | 'delivered' | 'offline';
  orderId?: string;
  note?: string;
}

export interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  vehicle: string;
  vehicleNumber: string;
  isOnline: boolean;
  rating: number;
  totalDeliveries: number;
  todayEarnings: number;
  weekEarnings: number;
  monthEarnings: number;
  earningsToday?: number;
  kycStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
  status: 'ACTIVE' | 'SUSPENDED';
  joinedDate: string;
  currentOrderId?: string;
  currentLocation: PartnerLocation;
  completionRate?: number;
  cancellationRate?: number;
  avgDeliveryMinutes?: number;
  onlineHoursToday?: number;
  totalCompletedDeliveries?: number;
  totalCancelledDeliveries?: number;
  activityTimeline?: PartnerActivityItem[];
}

// -------------------------------------------------------------
// Direct Business (Merchant) Integration
// -------------------------------------------------------------
export interface BusinessItem {
  id: string;
  businessId: string;
  name: string;
  description: string;
  price: number;
  mrp?: number;
  category: string;
  isAvailable: boolean;
  stock?: number;
  prepTimeMinutes: number;
  image?: string;
  unit?: string;
}

export interface Business {
  id: string; // e.g. "BIZ101"
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  category: string; // "Restaurant & Cafe" | "Pharmacy & Health" | "Grocery & Fresh" | "Bakery & Desserts" | "Courier & Retail"
  avatar: string;
  coverImage?: string;
  address: string;
  location: LocationCoord;
  rating: number;
  totalOrders: number;
  revenueTotal: number;
  revenueToday: number;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  joinedDate: string;
  gstNumber?: string;
  bankAccount?: string;
  ifscCode?: string;
  commissionRate: number; // e.g. 0.05 (5%)
  catalog: BusinessItem[];
  autoDispatch: boolean;
  deliveryTimeEstimate?: string; // e.g. "12-18 min"
}

// -------------------------------------------------------------
// Passes System
// -------------------------------------------------------------
export interface PassPlan {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  price: number;
  originalPrice: number;
  periodLabel: string;
  durationDays: number;
  maxOrders: number; // -1 for unlimited
  allowedServices: ServiceId[] | 'ALL';
  deliveryFeeWaiver: boolean; // 100% free delivery
  platformFeeWaiver: boolean; // 100% free platform fee
  discountPercent?: number; // e.g. 15%
  priorityRiderDispatch: boolean;
  colorScheme: 'orange' | 'green' | 'purple' | 'blue';
  popular?: boolean;
  features: string[];
}

export interface CustomerPass {
  id: string;
  customerId: string;
  planId: string;
  planName: string;
  status: 'ACTIVE' | 'EXPIRED' | 'EXHAUSTED';
  purchasedAt: string;
  expiresAt: string;
  usageCount: number;
  maxOrders: number; // -1 for unlimited
  totalSaved: number;
  autoRenew: boolean;
}

export interface ChatMessage {
  id: string;
  orderId: string;
  senderRole: 'customer' | 'partner' | 'business' | 'admin' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  targetRole: UserRole | 'all';
  targetUserId?: string;
  orderId?: string;
  title: string;
  message: string;
  type: 'order' | 'earnings' | 'alert' | 'system' | 'pass';
  timestamp: string;
  read: boolean;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  orderId?: string;
  issue: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  messages: {
    sender: string;
    text: string;
    time: string;
  }[];
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  amount: number;
  method: string;
  status: 'PAID' | 'FAILED' | 'PENDING' | 'REFUNDED';
  date: string;
}
