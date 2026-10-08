'use client';

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import {
  Business,
  BusinessItem,
  CartItem,
  Category,
  ChatMessage,
  Coupon,
  Customer,
  CustomerAddress,
  CustomerPass,
  DeliveryPartner,
  LocationCoord,
  NotificationItem,
  Order,
  OrderItem,
  OrderPassInfo,
  OrderStatus,
  PassPlan,
  PaymentTransaction,
  PricingBreakdown,
  Product,
  ServiceConfig,
  SupportTicket,
  UserRole,
} from '../types';
import {
  INITIAL_BUSINESSES,
  INITIAL_CUSTOMERS,
  INITIAL_CUSTOMER_PASSES,
  INITIAL_ORDERS,
  INITIAL_PARTNERS,
  INITIAL_PASS_PLANS,
  INITIAL_PAYMENTS,
  INITIAL_SERVICES,
  INITIAL_TICKETS,
  NOIDA_LOCATIONS,
} from '../data/mockData';
import {
  INITIAL_ADDRESSES,
  INITIAL_CATEGORIES,
  INITIAL_COUPONS,
  INITIAL_PRODUCTS,
} from '../data/quickCommerceData';
import { orderService } from '../services/orderService';
import { locationService } from '../services/locationService';
import { notificationService } from '../services/notificationService';
import confetti from 'canvas-confetti';

interface AppContextType {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  currentCustomer: Customer;
  setCurrentCustomer: React.Dispatch<React.SetStateAction<Customer>>;
  currentPartner: DeliveryPartner;
  setCurrentPartner: React.Dispatch<React.SetStateAction<DeliveryPartner>>;

  // Direct Business (Merchant) state
  businesses: Business[];
  currentBusiness: Business;
  setCurrentBusiness: (b: Business) => void;

  // Passes System state
  passPlans: PassPlan[];
  customerPasses: CustomerPass[];
  purchasePass: (planId: string, customerId?: string) => CustomerPass;
  renewPass: (passId: string) => void;
  cancelPass: (passId: string) => void;
  getActivePassForCustomer: (customerId?: string) => CustomerPass | null;
  getPassPlan: (planId: string) => PassPlan | undefined;

  // Quick Commerce Products & Categories
  products: Product[];
  categories: Category[];
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => Category;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;

  // Cart Management
  cart: CartItem[];
  cartTotal: number;
  cartItemCount: number;
  cartSavings: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;

  // Coupons & Offers
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Saved Addresses
  savedAddresses: CustomerAddress[];
  selectedAddress: CustomerAddress;
  setSelectedAddress: (addr: CustomerAddress) => void;
  addAddress: (addr: Omit<CustomerAddress, 'id'>) => CustomerAddress;

  // Search History
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;

  // Orders & Deliveries
  orders: Order[];
  services: ServiceConfig[];
  customers: Customer[];
  partners: DeliveryPartner[];
  payments: PaymentTransaction[];
  tickets: SupportTicket[];
  supportTickets: SupportTicket[];
  notifications: NotificationItem[];
  messages: ChatMessage[];
  activeCallingPartner: DeliveryPartner | null;
  activeChatOrderId: string | null;
  selectedLocation: LocationCoord;
  setSelectedLocation: (loc: LocationCoord) => void;

  // Actions
  togglePartnerOnline: (partnerId?: string) => void;
  createOrder: (
    service: ServiceConfig,
    pickup: LocationCoord,
    destination: LocationCoord,
    pricing: PricingBreakdown,
    packageType: string,
    packageWeight?: string,
    deliveryInstructions?: string,
    deliveryType?: 'instant' | 'scheduled',
    scheduledTime?: string,
    businessId?: string,
    businessName?: string
  ) => Order;
  createQuickCommerceOrder: (params: {
    paymentMethod: 'UPI' | 'Card' | 'Wallet' | 'Cash on Delivery';
    instructions?: string;
    deliveryType?: 'instant' | 'scheduled';
  }) => Order;
  reorderItems: (order: Order) => void;
  acceptOrder: (orderId: string, partnerId: string) => void;
  rejectOrder: (orderId: string, partnerId: string) => void;
  advanceOrderStatus: (orderId: string, newStatus: OrderStatus, desc?: string) => void;
  reassignPartner: (orderId: string, newPartnerId: string) => void;
  assignPartner: (orderId: string, newPartnerId: string) => void;
  cancelOrder: (orderId: string, reason?: string) => void;
  updateServiceConfig: (updated: ServiceConfig) => void;
  updateService: (updated: ServiceConfig) => void;
  addService: (newService: any) => void;
  updateCustomerStatus: (customerId: string, status: 'ACTIVE' | 'SUSPENDED') => void;
  toggleCustomerStatus: (customerId: string) => void;
  updatePartnerStatus: (partnerId: string, status: 'ACTIVE' | 'SUSPENDED') => void;
  updateTicketStatus: (ticketId: string, status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED') => void;
  resolveSupportTicket: (ticketId: string) => void;
  createSupportTicket: (subject: string, description: string, priority?: string) => void;
  sendMessage: (
    orderId: string,
    text: string,
    senderRole: 'customer' | 'partner' | 'business' | 'admin'
  ) => void;
  startCall: (partner: DeliveryPartner | any) => void;
  endCall: () => void;
  openChat: (orderId: string) => void;
  closeChat: () => void;
  dismissNotification: (id: string) => void;
  resetDemoData: () => void;

  // Business Specific Actions
  updateBusinessCatalogItem: (businessId: string, item: BusinessItem) => void;
  addBusinessCatalogItem: (
    businessId: string,
    item: Omit<BusinessItem, 'id' | 'businessId'>
  ) => void;
  deleteBusinessCatalogItem: (businessId: string, itemId: string) => void;
  toggleBusinessAutoDispatch: (businessId: string) => void;
  dispatchBusinessDelivery: (
    businessId: string,
    request: {
      destination: LocationCoord;
      customerName: string;
      customerPhone: string;
      serviceId: string;
      packageType: string;
      amount: number;
      deliveryInstructions?: string;
    }
  ) => Order;
  registerBusiness: (data: Partial<Business>) => Business;
  updateBusinessStatus: (businessId: string, status: 'ACTIVE' | 'SUSPENDED') => void;

  // Three-Line Partner Menu & Store Registration State
  isPartnerMenuOpen: boolean;
  setIsPartnerMenuOpen: (open: boolean) => void;
  openPartnerMenu: () => void;
  closePartnerMenu: () => void;
  isRegisterStoreOpen: boolean;
  setIsRegisterStoreOpen: (open: boolean) => void;
  openRegisterStore: () => void;
  closeRegisterStore: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'quickgo_app_v3';

const getStorageItem = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const setStorageItem = (key: string, value: string): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore storage write error
  }
};

const removeStorageItem = (key: string): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore storage remove error
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => {
    const saved = getStorageItem('quickgo_role');
    if (saved === 'business_partner') return 'business';
    return (saved as UserRole) || 'customer';
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = getStorageItem(`${STORAGE_KEY}_orders`);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [services, setServices] = useState<ServiceConfig[]>(() => {
    try {
      const saved = getStorageItem(`${STORAGE_KEY}_services`);
      return saved ? JSON.parse(saved) : INITIAL_SERVICES;
    } catch {
      return INITIAL_SERVICES;
    }
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = getStorageItem(`${STORAGE_KEY}_customers`);
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  const [partners, setPartners] = useState<DeliveryPartner[]>(() => {
    try {
      const saved = getStorageItem(`${STORAGE_KEY}_partners`);
      return saved ? JSON.parse(saved) : INITIAL_PARTNERS;
    } catch {
      return INITIAL_PARTNERS;
    }
  });

  const [businesses, setBusinesses] = useState<Business[]>(() => {
    try {
      const saved = getStorageItem(`${STORAGE_KEY}_businesses`);
      return saved ? JSON.parse(saved) : INITIAL_BUSINESSES;
    } catch {
      return INITIAL_BUSINESSES;
    }
  });

  const [passPlans] = useState<PassPlan[]>(INITIAL_PASS_PLANS);
  const [customerPasses, setCustomerPasses] = useState<CustomerPass[]>(() => {
    try {
      const saved = getStorageItem(`${STORAGE_KEY}_customer_passes`);
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMER_PASSES;
    } catch {
      return INITIAL_CUSTOMER_PASSES;
    }
  });

  const [payments, setPayments] = useState<PaymentTransaction[]>(() => {
    try {
      const saved = getStorageItem(`${STORAGE_KEY}_payments`);
      return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
    } catch {
      return INITIAL_PAYMENTS;
    }
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    try {
      const saved = getStorageItem(`${STORAGE_KEY}_tickets`);
      return saved ? JSON.parse(saved) : INITIAL_TICKETS;
    } catch {
      return INITIAL_TICKETS;
    }
  });

  // Quick Commerce Products & Categories
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = getStorageItem(`${STORAGE_KEY}_products`);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = getStorageItem(`${STORAGE_KEY}_categories`);
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = getStorageItem(`${STORAGE_KEY}_cart`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Coupons
  const [coupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Saved Addresses
  const [savedAddresses, setSavedAddresses] = useState<CustomerAddress[]>(() => {
    try {
      const saved = getStorageItem(`${STORAGE_KEY}_addresses`);
      return saved ? JSON.parse(saved) : INITIAL_ADDRESSES;
    } catch {
      return INITIAL_ADDRESSES;
    }
  });
  const [selectedAddress, setSelectedAddress] = useState<CustomerAddress>(
    () => savedAddresses.find((a) => a.isDefault) || savedAddresses[0] || INITIAL_ADDRESSES[0]
  );

  // Recent Searches
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = getStorageItem(`${STORAGE_KEY}_recent_searches`);
      return saved ? JSON.parse(saved) : ['Amul Milk', 'Maggi', 'Bananas', 'Coca Cola', 'Courier'];
    } catch {
      return ['Amul Milk', 'Maggi', 'Bananas', 'Coca Cola', 'Courier'];
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      orderId: 'QG10291',
      senderRole: 'customer',
      senderName: 'Rahul Sharma',
      text: 'Bhaiya, please call me when you reach the gate.',
      timestamp: '01:22 PM',
    },
    {
      id: 'msg-2',
      orderId: 'QG10291',
      senderRole: 'partner',
      senderName: 'Amit Kumar',
      text: 'Sure Rahul ji, on my way with your order. Will call at gate.',
      timestamp: '01:23 PM',
    },
  ]);

  const [currentCustomer, setCurrentCustomer] = useState<Customer>(() => {
    return customers.find((c) => c.id === 'cust-1') || customers[0] || INITIAL_CUSTOMERS[0];
  });

  const [currentPartner, setCurrentPartner] = useState<DeliveryPartner>(() => {
    return partners.find((p) => p.id === 'partner-1') || partners[0] || INITIAL_PARTNERS[0];
  });

  const [currentBusiness, setCurrentBusinessState] = useState<Business>(() => {
    return businesses.find((b) => b.id === 'BIZ-01') || businesses[0] || INITIAL_BUSINESSES[0];
  });

  const setCurrentBusiness = (b: Business) => {
    setCurrentBusinessState(b);
  };

  const [selectedLocation, setSelectedLocation] = useState<LocationCoord>(NOIDA_LOCATIONS[0]);
  const [activeCallingPartner, setActiveCallingPartner] = useState<DeliveryPartner | null>(null);
  const [activeChatOrderId, setActiveChatOrderId] = useState<string | null>(null);

  // Three-Line Partner Menu & Store Registration State
  const [isPartnerMenuOpen, setIsPartnerMenuOpen] = useState(false);
  const [isRegisterStoreOpen, setIsRegisterStoreOpen] = useState(false);
  const openPartnerMenu = useCallback(() => setIsPartnerMenuOpen(true), []);
  const closePartnerMenu = useCallback(() => setIsPartnerMenuOpen(false), []);
  const openRegisterStore = useCallback(() => setIsRegisterStoreOpen(true), []);
  const closeRegisterStore = useCallback(() => setIsRegisterStoreOpen(false), []);

  // Sync state to LocalStorage
  useEffect(() => {
    setStorageItem(`${STORAGE_KEY}_orders`, JSON.stringify(orders));
    setStorageItem(`${STORAGE_KEY}_services`, JSON.stringify(services));
    setStorageItem(`${STORAGE_KEY}_customers`, JSON.stringify(customers));
    setStorageItem(`${STORAGE_KEY}_partners`, JSON.stringify(partners));
    setStorageItem(`${STORAGE_KEY}_businesses`, JSON.stringify(businesses));
    setStorageItem(`${STORAGE_KEY}_customer_passes`, JSON.stringify(customerPasses));
    setStorageItem(`${STORAGE_KEY}_payments`, JSON.stringify(payments));
    setStorageItem(`${STORAGE_KEY}_tickets`, JSON.stringify(tickets));
    setStorageItem(`${STORAGE_KEY}_products`, JSON.stringify(products));
    setStorageItem(`${STORAGE_KEY}_categories`, JSON.stringify(categories));
    setStorageItem(`${STORAGE_KEY}_cart`, JSON.stringify(cart));
    setStorageItem(`${STORAGE_KEY}_addresses`, JSON.stringify(savedAddresses));
    setStorageItem(`${STORAGE_KEY}_recent_searches`, JSON.stringify(recentSearches));
  }, [
    orders,
    services,
    customers,
    partners,
    businesses,
    customerPasses,
    payments,
    tickets,
    products,
    categories,
    cart,
    savedAddresses,
    recentSearches,
  ]);

  const setRole = (role: UserRole) => {
    setCurrentRoleState(role);
    setStorageItem('quickgo_role', role);
  };

  const addNotification = useCallback((notif: NotificationItem) => {
    setNotifications((prev) => [notif, ...prev.slice(0, 25)]);
  }, []);

  // Location Simulation for Active Deliveries
  const simulationStepRef = useRef<{ [orderId: string]: number }>({});
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prevOrders) => {
        let hasChanges = false;
        const updated = prevOrders.map((order) => {
          if (
            order.status === 'IN_TRANSIT' ||
            order.status === 'OUT_FOR_DELIVERY' ||
            order.status === 'PARTNER_ARRIVING'
          ) {
            hasChanges = true;
            const currentStep = simulationStepRef.current[order.id] || 0;
            const nextStep = (currentStep + 1) % 30;
            simulationStepRef.current[order.id] = nextStep;

            const t = nextStep / 30;
            const startX =
              order.status === 'PARTNER_ARRIVING'
                ? order.partnerLocation?.x || 50
                : order.pickup.x;
            const startY =
              order.status === 'PARTNER_ARRIVING'
                ? order.partnerLocation?.y || 50
                : order.pickup.y;
            const endX =
              order.status === 'PARTNER_ARRIVING' ? order.pickup.x : order.destination.x;
            const endY =
              order.status === 'PARTNER_ARRIVING' ? order.pickup.y : order.destination.y;

            const x = Math.round(startX + (endX - startX) * t);
            const y = Math.round(startY + (endY - startY) * t);
            const heading = locationService.calculateHeading(
              { lat: 0, lng: 0, x: startX, y: startY },
              { lat: 0, lng: 0, x: endX, y: endY }
            );

            return {
              ...order,
              partnerLocation: {
                lat: 28.58 + (y / 100) * 0.08,
                lng: 77.32 + (x / 100) * 0.08,
                x,
                y,
                heading,
                speed: 25 + Math.floor(Math.random() * 8),
                lastUpdated: 'Just now',
                isMoving: true,
              },
            };
          }
          return order;
        });
        return hasChanges ? updated : prevOrders;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Pass Helpers
  const getActivePassForCustomer = useCallback(
    (customerId?: string): CustomerPass | null => {
      const cid = customerId || currentCustomer.id;
      const found = customerPasses.find((p) => p.customerId === cid && p.status === 'ACTIVE');
      return found || null;
    },
    [customerPasses, currentCustomer.id]
  );

  const getPassPlan = (planId: string): PassPlan | undefined => {
    return passPlans.find((p) => p.id === planId);
  };

  const purchasePass = (planId: string, customerId?: string): CustomerPass => {
    const cid = customerId || currentCustomer.id;
    const plan = passPlans.find((p) => p.id === planId) || passPlans[0];
    const newId = `CP-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const expiry = new Date(now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);
    const dateFormatted = (d: Date) =>
      d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const newPass: CustomerPass = {
      id: newId,
      customerId: cid,
      planId: plan.id,
      planName: plan.name,
      status: 'ACTIVE',
      purchasedAt: dateFormatted(now),
      expiresAt: dateFormatted(expiry),
      usageCount: 0,
      maxOrders: plan.maxOrders,
      totalSaved: 0,
      autoRenew: true,
    };

    setCustomerPasses((prev) => [
      newPass,
      ...prev.map((p) => (p.customerId === cid ? { ...p, status: 'EXPIRED' as const } : p)),
    ]);

    setCustomers((prev) =>
      prev.map((c) => (c.id === cid ? { ...c, activePassId: newPass.id } : c))
    );
    if (cid === currentCustomer.id) {
      setCurrentCustomer((prev) => ({ ...prev, activePassId: newPass.id }));
    }

    const txn: PaymentTransaction = {
      id: `TXN-PASS-${Date.now().toString().slice(-4)}`,
      orderId: newPass.id,
      customerId: cid,
      customerName: currentCustomer.name,
      amount: plan.price,
      method: 'UPI / Card',
      status: 'PAID',
      date: 'Just now',
    };
    setPayments((prev) => [txn, ...prev]);

    addNotification(
      notificationService.create(
        `🎉 ${plan.name} Activated!`,
        `Enjoy zero delivery charges and VIP priority on QuickGo through ${dateFormatted(expiry)}.`,
        'customer',
        'pass',
        newPass.id,
        cid
      )
    );

    confetti({ particleCount: 60, spread: 65, origin: { y: 0.6 } });
    return newPass;
  };

  const renewPass = (passId: string) => {
    setCustomerPasses((prev) =>
      prev.map((p) => {
        if (p.id === passId) {
          const plan = passPlans.find((pl) => pl.id === p.planId) || passPlans[0];
          const expiry = new Date(Date.now() + plan.durationDays * 24 * 60 * 60 * 1000);
          const dateFormatted = expiry.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          });
          return {
            ...p,
            status: 'ACTIVE',
            expiresAt: dateFormatted,
            usageCount: 0,
          };
        }
        return p;
      })
    );
    addNotification(
      notificationService.create(
        'Pass Renewed Successfully',
        `Your QuickPass subscription has been extended for another cycle.`,
        'customer',
        'pass'
      )
    );
  };

  const cancelPass = (passId: string) => {
    setCustomerPasses((prev) =>
      prev.map((p) => (p.id === passId ? { ...p, status: 'EXPIRED', autoRenew: false } : p))
    );
    addNotification(
      notificationService.create(
        'QuickPass Cancelled',
        'Your subscription auto-renewal has been stopped.',
        'customer',
        'pass'
      )
    );
  };

  // -------------------------------------------------------------
  // Cart Actions & Metrics
  // -------------------------------------------------------------
  const cartTotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSavings = cart.reduce(
    (acc, item) => acc + (item.product.mrp - item.product.price) * item.quantity,
    0
  );

  const getItemQuantity = (productId: string): number => {
    const item = cart.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          product,
          quantity: 1,
          businessId: product.businessId,
          businessName: product.businessName,
        },
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // -------------------------------------------------------------
  // Coupon Actions
  // -------------------------------------------------------------
  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const clean = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code === clean);
    if (!found) {
      return { success: false, message: 'Invalid coupon code.' };
    }
    if (cartTotal < found.minCartValue) {
      return {
        success: false,
        message: `Min order value of ₹${found.minCartValue} required for ${found.code}.`,
      };
    }
    if (found.isPassExclusive && !getActivePassForCustomer(currentCustomer.id)) {
      return {
        success: false,
        message: `Exclusive to QuickPass members. Get a pass to unlock!`,
      };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // -------------------------------------------------------------
  // Address Management
  // -------------------------------------------------------------
  const addAddress = (addrData: Omit<CustomerAddress, 'id'>): CustomerAddress => {
    const newAddr: CustomerAddress = {
      ...addrData,
      id: `addr-${Date.now().toString().slice(-4)}`,
    };
    setSavedAddresses((prev) => [newAddr, ...prev]);
    setSelectedAddress(newAddr);
    return newAddr;
  };

  // -------------------------------------------------------------
  // Recent Searches
  // -------------------------------------------------------------
  const addRecentSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => [
      trimmed,
      ...prev.filter((s) => s.toLowerCase() !== trimmed.toLowerCase()),
    ].slice(0, 8));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  // -------------------------------------------------------------
  // Product & Category Management
  // -------------------------------------------------------------
  const addProduct = (productData: Omit<Product, 'id'>): Product => {
    const newProd: Product = {
      ...productData,
      id: `prod-${Date.now().toString().slice(-4)}`,
    };
    setProducts((prev) => [newProd, ...prev]);
    return newProd;
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    removeFromCart(productId);
  };

  const addCategory = (catData: Omit<Category, 'id'>): Category => {
    const newCat: Category = {
      ...catData,
      id: `cat-${Date.now().toString().slice(-4)}`,
    };
    setCategories((prev) => [...prev, newCat]);
    return newCat;
  };

  const updateCategory = (updated: Category) => {
    setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const deleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
  };

  // -------------------------------------------------------------
  // Delivery Partner Online Toggle
  // -------------------------------------------------------------
  const togglePartnerOnline = (partnerId?: string) => {
    const targetId = partnerId || currentPartner.id;
    setPartners((prev) =>
      prev.map((p) => {
        if (p.id === targetId) {
          const nextState = !p.isOnline;
          addNotification(
            notificationService.create(
              nextState ? 'You are now ONLINE' : 'You are now OFFLINE',
              nextState
                ? 'Ready to receive new delivery orders nearby.'
                : 'You will not receive new requests.',
              'partner',
              'system',
              undefined,
              p.id
            )
          );
          return { ...p, isOnline: nextState };
        }
        return p;
      })
    );
  };

  // -------------------------------------------------------------
  // Order Creation (Courier / Parcel Service)
  // -------------------------------------------------------------
  const createOrder = (
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
    businessName?: string
  ): Order => {
    const orderId = orderService.generateId(orders);
    const activePass = getActivePassForCustomer(currentCustomer.id);
    let passInfo: OrderPassInfo | undefined = undefined;

    if (activePass && pricing.passDiscount && pricing.passDiscount > 0) {
      passInfo = {
        passId: activePass.id,
        planName: activePass.planName,
        discountAmount: pricing.passDiscount,
      };

      setCustomerPasses((prev) =>
        prev.map((p) =>
          p.id === activePass.id
            ? {
                ...p,
                usageCount: p.usageCount + 1,
                totalSaved: p.totalSaved + (pricing.passDiscount || 0),
              }
            : p
        )
      );
    }

    const newOrder = orderService.createOrder(
      orderId,
      currentCustomer.id,
      currentCustomer.name,
      currentCustomer.phone,
      service,
      pickup,
      destination,
      pricing,
      packageType,
      packageWeight,
      deliveryInstructions,
      deliveryType,
      scheduledTime,
      businessId,
      businessName,
      passInfo
    );

    const paymentRecord: PaymentTransaction = {
      id: `TXN-${Date.now().toString().slice(-4)}`,
      orderId: newOrder.id,
      customerId: currentCustomer.id,
      customerName: currentCustomer.name,
      amount: pricing.total,
      method: 'UPI (Instant)',
      status: 'PAID',
      date: 'Just now',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setPayments((prev) => [paymentRecord, ...prev]);

    setCustomers((prev) =>
      prev.map((c) =>
        c.id === currentCustomer.id
          ? { ...c, totalOrders: c.totalOrders + 1, totalSpent: c.totalSpent + pricing.total }
          : c
      )
    );

    addNotification(
      notificationService.create(
        `Order #${newOrder.id} Placed!`,
        `Searching nearest QuickGo delivery partner for ${service.name}.`,
        'customer',
        'order',
        newOrder.id,
        currentCustomer.id
      )
    );

    return newOrder;
  };

  // -------------------------------------------------------------
  // Quick Commerce Order Creation (Blinkit style Cart Checkout)
  // -------------------------------------------------------------
  const createQuickCommerceOrder = ({
    paymentMethod,
    instructions,
    deliveryType = 'instant',
  }: {
    paymentMethod: 'UPI' | 'Card' | 'Wallet' | 'Cash on Delivery';
    instructions?: string;
    deliveryType?: 'instant' | 'scheduled';
  }): Order => {
    if (cart.length === 0) {
      throw new Error('Cart is empty');
    }

    const orderId = `QG${Math.floor(10000 + Math.random() * 90000)}`;
    const activePass = getActivePassForCustomer(currentCustomer.id);

    // Business info from first cart item or fallback
    const primaryBizId = cart[0].businessId || 'BIZ-01';
    const primaryBiz = businesses.find((b) => b.id === primaryBizId) || businesses[0];

    // Compute pricing
    const itemTotal = cartTotal;
    const baseDeliveryFee = 35;
    const platformFee = activePass?.status === 'ACTIVE' ? 0 : 5;
    const isFreeDelivery = activePass?.status === 'ACTIVE' || appliedCoupon?.code === 'FREESHIP';
    const deliveryCharge = isFreeDelivery ? 0 : baseDeliveryFee;

    // Coupon discount
    let couponDiscount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.discountType === 'flat') {
        couponDiscount = appliedCoupon.discountValue;
      } else if (appliedCoupon.discountType === 'percentage') {
        const disc = Math.round((itemTotal * appliedCoupon.discountValue) / 100);
        couponDiscount = appliedCoupon.maxDiscount ? Math.min(disc, appliedCoupon.maxDiscount) : disc;
      }
    }

    const passSavings = (activePass ? baseDeliveryFee + 5 : 0);
    const tax = Math.round(itemTotal * 0.05);
    const grandTotal = Math.max(1, itemTotal + deliveryCharge + platformFee + tax - couponDiscount);

    const orderItems: OrderItem[] = cart.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      quantity: item.quantity,
      unitPrice: item.product.price,
      totalPrice: item.product.price * item.quantity,
      unit: item.product.unit,
      image: item.product.image,
    }));

    const pricing: PricingBreakdown = {
      distanceKm: 2.4,
      baseFare: deliveryCharge,
      distanceFare: 0,
      platformFee,
      tax,
      surgeMultiplier: 1.0,
      surgeAmount: 0,
      passDiscount: passSavings,
      couponDiscount,
      total: grandTotal,
      estimatedMinutes: 12,
    };

    const passInfo: OrderPassInfo | undefined = activePass
      ? {
          passId: activePass.id,
          planName: activePass.planName,
          discountAmount: passSavings,
        }
      : undefined;

    // Build timeline
    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const newOrder: Order = {
      id: orderId,
      customerId: currentCustomer.id,
      customerName: currentCustomer.name,
      customerPhone: currentCustomer.phone,
      businessId: primaryBiz.id,
      businessName: primaryBiz.name,
      serviceId: 'grocery',
      serviceName: 'QuickGo Quick-Commerce',
      status: 'ORDER_CONFIRMED',
      pickup: primaryBiz.location,
      destination: selectedAddress.location,
      packageType: `${cartItemCount} Items (${cart.map((c) => c.product.name).slice(0, 2).join(', ')}${cart.length > 2 ? '...' : ''})`,
      deliveryInstructions: instructions || 'Please leave at doorstep or call on arrival',
      deliveryType,
      pricing,
      passInfo,
      items: orderItems,
      orderType: 'quick_commerce',
      couponCode: appliedCoupon?.code,
      couponDiscount,
      deliveryAddress: selectedAddress,
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'PENDING' : 'PAID',
      paymentMethod,
      createdAt: nowTime,
      updatedAt: nowTime,
      timeline: [
        {
          status: 'ORDER_PLACED',
          time: nowTime,
          description: 'Order placed & payment verified',
        },
        {
          status: 'ORDER_CONFIRMED',
          time: nowTime,
          description: `Confirmed by store ${primaryBiz.name}`,
        },
      ],
    };

    // Auto-update pass stats
    if (activePass) {
      setCustomerPasses((prev) =>
        prev.map((p) =>
          p.id === activePass.id
            ? {
                ...p,
                usageCount: p.usageCount + 1,
                totalSaved: p.totalSaved + passSavings,
              }
            : p
        )
      );
    }

    // Auto-update store revenue & orders
    setBusinesses((prev) =>
      prev.map((b) =>
        b.id === primaryBiz.id
          ? {
              ...b,
              totalOrders: b.totalOrders + 1,
              revenueToday: b.revenueToday + grandTotal,
              revenueTotal: b.revenueTotal + grandTotal,
            }
          : b
      )
    );

    // Create payment transaction
    const txn: PaymentTransaction = {
      id: `TXN-${Date.now().toString().slice(-4)}`,
      orderId: newOrder.id,
      customerId: currentCustomer.id,
      customerName: currentCustomer.name,
      amount: grandTotal,
      method: paymentMethod,
      status: paymentMethod === 'Cash on Delivery' ? 'PENDING' : 'PAID',
      date: 'Just now',
    };
    setPayments((prev) => [txn, ...prev]);

    setOrders((prev) => [newOrder, ...prev]);

    // Update customer total orders
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === currentCustomer.id
          ? { ...c, totalOrders: c.totalOrders + 1, totalSpent: c.totalSpent + grandTotal }
          : c
      )
    );

    // Notify customer & merchant
    addNotification(
      notificationService.create(
        `⚡ Order #${newOrder.id} Placed!`,
        `${primaryBiz.name} is packing your ${cartItemCount} items. Expected in 10-15 mins.`,
        'customer',
        'order',
        newOrder.id,
        currentCustomer.id
      )
    );

    addNotification(
      notificationService.create(
        `New Order #${newOrder.id} Received!`,
        `${currentCustomer.name} ordered ${cartItemCount} items (₹${grandTotal}). Prepare for rider pickup.`,
        'business',
        'order',
        newOrder.id,
        primaryBiz.id
      )
    );

    // Clear cart & trigger celebration
    clearCart();
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });

    // Automatically transition to preparing in 2 seconds
    setTimeout(() => {
      advanceOrderStatus(
        newOrder.id,
        'BUSINESS_PREPARING',
        `${primaryBiz.name} is preparing and packing your order`
      );
    }, 2500);

    return newOrder;
  };

  const reorderItems = (order: Order) => {
    if (order.items && order.items.length > 0) {
      order.items.forEach((item) => {
        const matched = products.find((p) => p.id === item.productId);
        if (matched) {
          addToCart(matched);
        } else {
          // Construct fallback product
          const fallbackProduct: Product = {
            id: item.productId,
            name: item.name,
            brand: 'QuickGo',
            description: item.name,
            price: item.unitPrice,
            mrp: Math.round(item.unitPrice * 1.15),
            discountPercent: 15,
            unit: item.unit || '1 unit',
            image: item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
            categoryId: 'dairy-breakfast',
            categoryName: 'Daily Essentials',
            businessId: order.businessId || 'BIZ-01',
            businessName: order.businessName || 'QuickGo Express',
            rating: 4.8,
            reviewCount: 120,
            isAvailable: true,
            stock: 20,
            estimatedDeliveryMinutes: 12,
          };
          addToCart(fallbackProduct);
        }
      });
      addNotification(
        notificationService.create(
          'Items Added to Cart',
          `Added ${order.items.length} items from Order #${order.id} to your cart.`,
          'customer',
          'order'
        )
      );
    }
  };

  // -------------------------------------------------------------
  // Order Lifecycle Management
  // -------------------------------------------------------------
  const acceptOrder = (orderId: string, partnerId: string) => {
    const partner = partners.find((p) => p.id === partnerId) || currentPartner;
    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'PARTNER_ASSIGNED',
            partnerId: partner.id,
            partnerName: partner.name,
            partnerPhone: partner.phone,
            partnerRating: partner.rating,
            partnerVehicle: partner.vehicle,
            partnerLocation: partner.currentLocation,
            timeline: [
              ...o.timeline,
              {
                status: 'PARTNER_ASSIGNED',
                time: nowTime,
                description: `Delivery partner ${partner.name} assigned`,
              },
            ],
          };
        }
        return o;
      })
    );

    addNotification(
      notificationService.create(
        'Delivery Partner Assigned',
        `${partner.name} (${partner.vehicle}) is en route to pick up your order.`,
        'customer',
        'order',
        orderId
      )
    );
  };

  const rejectOrder = (orderId: string, partnerId: string) => {
    addNotification(
      notificationService.create(
        'Order Broadcast Skipped',
        `Re-dispatching order #${orderId} to the next closest rider.`,
        'partner',
        'alert',
        orderId,
        partnerId
      )
    );
  };

  const advanceOrderStatus = (orderId: string, newStatus: OrderStatus, desc?: string) => {
    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const targetOrder = orders.find((o) => o.id === orderId);

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updatedTimeline = [
            ...o.timeline,
            {
              status: newStatus,
              time: nowTime,
              description: desc || `Order status updated to ${newStatus}`,
            },
          ];

          return {
            ...o,
            status: newStatus,
            timeline: updatedTimeline,
            completedAt: newStatus === 'DELIVERED' || newStatus === 'COMPLETED' ? nowTime : o.completedAt,
          };
        }
        return o;
      })
    );

    if (newStatus === 'DELIVERED') {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }

    addNotification(
      notificationService.create(
        `Order #${orderId}: ${newStatus.replace(/_/g, ' ')}`,
        desc || `Your order status changed to ${newStatus.replace(/_/g, ' ')}.`,
        'customer',
        'order',
        orderId,
        targetOrder?.customerId
      )
    );
  };

  const reassignPartner = (orderId: string, newPartnerId: string) => {
    const partner = partners.find((p) => p.id === newPartnerId);
    if (!partner) return;
    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              partnerId: partner.id,
              partnerName: partner.name,
              partnerPhone: partner.phone,
              partnerRating: partner.rating,
              partnerVehicle: partner.vehicle,
              partnerLocation: partner.currentLocation,
              timeline: [
                ...o.timeline,
                {
                  status: 'PARTNER_ASSIGNED',
                  time: nowTime,
                  description: `Reassigned to partner ${partner.name}`,
                },
              ],
            }
          : o
      )
    );
  };

  const cancelOrder = (orderId: string, reason?: string) => {
    advanceOrderStatus(orderId, 'CANCELLED', reason || 'Order cancelled by user');
  };

  const updateServiceConfig = (updated: ServiceConfig) => {
    setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const addService = (newService: any) => {
    setServices((prev) => [...prev, newService]);
  };

  const updateCustomerStatus = (customerId: string, status: 'ACTIVE' | 'SUSPENDED') => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, status } : c))
    );
  };

  const toggleCustomerStatus = (customerId: string) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId
          ? { ...c, status: c.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' }
          : c
      )
    );
  };

  const updatePartnerStatus = (partnerId: string, status: 'ACTIVE' | 'SUSPENDED') => {
    setPartners((prev) =>
      prev.map((p) => (p.id === partnerId ? { ...p, status } : p))
    );
  };

  const updateTicketStatus = (ticketId: string, status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED') => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status } : t))
    );
  };

  const resolveSupportTicket = (ticketId: string) => {
    updateTicketStatus(ticketId, 'RESOLVED');
  };

  const createSupportTicket = (subject: string, description: string, priority: string = 'MEDIUM') => {
    const newTicket: SupportTicket = {
      id: `tick-${Date.now()}`,
      ticketNumber: `TK-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: currentCustomer?.id || 'cust-1',
      customerName: currentCustomer?.name || 'Customer',
      issue: subject,
      priority: (priority.toUpperCase() as any) || 'MEDIUM',
      status: 'OPEN',
      createdAt: 'Just now',
      updatedAt: 'Just now',
      messages: [
        {
          sender: currentCustomer?.name || 'Customer',
          text: description,
          time: 'Just now',
        },
      ],
    };
    setTickets((prev) => [newTicket, ...prev]);
  };

  const sendMessage = (
    orderId: string,
    text: string,
    senderRole: 'customer' | 'partner' | 'business' | 'admin'
  ) => {
    const senderName =
      senderRole === 'customer'
        ? currentCustomer.name
        : senderRole === 'partner'
        ? currentPartner.name
        : senderRole === 'business'
        ? currentBusiness.name
        : 'Support Agent';

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      orderId,
      senderRole,
      senderName,
      text,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
  };

  const startCall = (partner: DeliveryPartner) => {
    setActiveCallingPartner(partner);
  };

  const endCall = () => {
    setActiveCallingPartner(null);
  };

  const openChat = (orderId: string) => {
    setActiveChatOrderId(orderId);
  };

  const closeChat = () => {
    setActiveChatOrderId(null);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // -------------------------------------------------------------
  // Business Catalog & Dispatch Management
  // -------------------------------------------------------------
  const updateBusinessCatalogItem = (businessId: string, updatedItem: BusinessItem) => {
    setBusinesses((prev) =>
      prev.map((b) => {
        if (b.id === businessId) {
          return {
            ...b,
            catalog: b.catalog.map((i) => (i.id === updatedItem.id ? updatedItem : i)),
          };
        }
        return b;
      })
    );
  };

  const addBusinessCatalogItem = (
    businessId: string,
    itemData: Omit<BusinessItem, 'id' | 'businessId'>
  ) => {
    const newItem: BusinessItem = {
      ...itemData,
      id: `item-${Date.now().toString().slice(-4)}`,
      businessId,
    };
    setBusinesses((prev) =>
      prev.map((b) => {
        if (b.id === businessId) {
          return { ...b, catalog: [...b.catalog, newItem] };
        }
        return b;
      })
    );
  };

  const deleteBusinessCatalogItem = (businessId: string, itemId: string) => {
    setBusinesses((prev) =>
      prev.map((b) => {
        if (b.id === businessId) {
          return { ...b, catalog: b.catalog.filter((i) => i.id !== itemId) };
        }
        return b;
      })
    );
  };

  const toggleBusinessAutoDispatch = (businessId: string) => {
    setBusinesses((prev) =>
      prev.map((b) => (b.id === businessId ? { ...b, autoDispatch: !b.autoDispatch } : b))
    );
  };

  const dispatchBusinessDelivery = (
    businessId: string,
    request: {
      destination: LocationCoord;
      customerName: string;
      customerPhone: string;
      serviceId: string;
      packageType: string;
      amount: number;
      deliveryInstructions?: string;
    }
  ): Order => {
    const biz = businesses.find((b) => b.id === businessId) || currentBusiness;
    const orderId = `QG${Math.floor(10000 + Math.random() * 90000)}`;
    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const newOrder: Order = {
      id: orderId,
      customerId: `cust-store-${Date.now().toString().slice(-4)}`,
      customerName: request.customerName,
      customerPhone: request.customerPhone,
      businessId: biz.id,
      businessName: biz.name,
      serviceId: request.serviceId,
      serviceName: 'Store Merchant Dispatch',
      status: 'SEARCHING_PARTNER',
      pickup: biz.location,
      destination: request.destination,
      packageType: request.packageType,
      deliveryInstructions: request.deliveryInstructions,
      deliveryType: 'instant',
      pricing: {
        distanceKm: 3.2,
        baseFare: 40,
        distanceFare: 25,
        platformFee: 5,
        tax: 4,
        surgeMultiplier: 1.0,
        surgeAmount: 0,
        total: request.amount || 74,
        estimatedMinutes: 20,
      },
      createdAt: nowTime,
      updatedAt: nowTime,
      paymentStatus: 'PAID',
      paymentMethod: 'UPI',
      timeline: [
        {
          status: 'CREATED',
          time: nowTime,
          description: `Dispatched directly by store ${biz.name}`,
        },
        {
          status: 'SEARCHING_PARTNER',
          time: nowTime,
          description: 'Broadcasting to nearest QuickGo delivery partner',
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);

    setBusinesses((prev) =>
      prev.map((b) =>
        b.id === businessId
          ? {
              ...b,
              totalOrders: b.totalOrders + 1,
              revenueToday: b.revenueToday + (request.amount || 200),
            }
          : b
      )
    );

    addNotification(
      notificationService.create(
        'Rider Dispatch Requested',
        `Searching for a nearby rider to pick up from ${biz.name}.`,
        'business',
        'order',
        newOrder.id,
        businessId
      )
    );

    return newOrder;
  };

  const registerBusiness = (data: Partial<Business>): Business => {
    const newBiz: Business = {
      id: `BIZ-${Date.now().toString().slice(-4)}`,
      name: data.name || 'New Outlet',
      ownerName: data.ownerName || 'Store Owner',
      email: data.email || 'outlet@quickgo.in',
      phone: data.phone || '+91 98000 00000',
      category: data.category || 'Retail & Grocery',
      avatar:
        data.avatar ||
        'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&auto=format&fit=crop&q=80',
      address: data.address || 'Noida Central',
      location: data.location || NOIDA_LOCATIONS[0],
      rating: 5.0,
      totalOrders: 0,
      revenueTotal: 0,
      revenueToday: 0,
      status: 'ACTIVE',
      joinedDate: 'Just now',
      commissionRate: 0.05,
      autoDispatch: true,
      catalog: [],
      ...data,
    };

    setBusinesses((prev) => [...prev, newBiz]);
    addNotification(
      notificationService.create(
        'New Merchant Registered',
        `${newBiz.name} (${newBiz.category}) joined the QuickGo merchant network.`,
        'admin',
        'system'
      )
    );
    return newBiz;
  };

  const updateBusinessStatus = (businessId: string, status: 'ACTIVE' | 'SUSPENDED') => {
    setBusinesses((prev) =>
      prev.map((b) => (b.id === businessId ? { ...b, status } : b))
    );
  };

  const resetDemoData = () => {
    removeStorageItem(`${STORAGE_KEY}_orders`);
    removeStorageItem(`${STORAGE_KEY}_services`);
    removeStorageItem(`${STORAGE_KEY}_customers`);
    removeStorageItem(`${STORAGE_KEY}_partners`);
    removeStorageItem(`${STORAGE_KEY}_businesses`);
    removeStorageItem(`${STORAGE_KEY}_customer_passes`);
    removeStorageItem(`${STORAGE_KEY}_payments`);
    removeStorageItem(`${STORAGE_KEY}_tickets`);
    removeStorageItem(`${STORAGE_KEY}_products`);
    removeStorageItem(`${STORAGE_KEY}_categories`);
    removeStorageItem(`${STORAGE_KEY}_cart`);
    removeStorageItem(`${STORAGE_KEY}_addresses`);
    removeStorageItem(`${STORAGE_KEY}_recent_searches`);

    setOrders(INITIAL_ORDERS);
    setServices(INITIAL_SERVICES);
    setCustomers(INITIAL_CUSTOMERS);
    setPartners(INITIAL_PARTNERS);
    setBusinesses(INITIAL_BUSINESSES);
    setCustomerPasses(INITIAL_CUSTOMER_PASSES);
    setPayments(INITIAL_PAYMENTS);
    setTickets(INITIAL_TICKETS);
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setCart([]);
    setSavedAddresses(INITIAL_ADDRESSES);
    setSelectedAddress(INITIAL_ADDRESSES[0]);
    setRecentSearches(['Amul Milk', 'Maggi', 'Bananas', 'Coca Cola', 'Courier']);
    setCurrentCustomer(INITIAL_CUSTOMERS[0]);
    setCurrentPartner(INITIAL_PARTNERS[0]);
    setCurrentBusiness(INITIAL_BUSINESSES[0]);

    addNotification(
      notificationService.create(
        'Demo Data Reset',
        'QuickGo platform state restored to fresh seed data.',
        'all',
        'system'
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setRole,
        currentCustomer,
        setCurrentCustomer,
        currentPartner,
        setCurrentPartner,
        businesses,
        currentBusiness,
        setCurrentBusiness,
        passPlans,
        customerPasses,
        purchasePass,
        renewPass,
        cancelPass,
        getActivePassForCustomer,
        getPassPlan,
        products,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        cart,
        cartTotal,
        cartItemCount,
        cartSavings,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getItemQuantity,
        coupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        savedAddresses,
        selectedAddress,
        setSelectedAddress,
        addAddress,
        recentSearches,
        addRecentSearch,
        clearRecentSearches,
        orders,
        services,
        customers,
        partners,
        payments,
        tickets,
        supportTickets: tickets,
        notifications,
        messages,
        activeCallingPartner,
        activeChatOrderId,
        selectedLocation,
        setSelectedLocation,
        togglePartnerOnline,
        createOrder,
        createQuickCommerceOrder,
        reorderItems,
        acceptOrder,
        rejectOrder,
        advanceOrderStatus,
        reassignPartner,
        assignPartner: reassignPartner,
        cancelOrder,
        updateServiceConfig,
        updateService: updateServiceConfig,
        addService,
        updateCustomerStatus,
        toggleCustomerStatus,
        updatePartnerStatus,
        updateTicketStatus,
        resolveSupportTicket,
        createSupportTicket,
        sendMessage,
        startCall,
        endCall,
        openChat,
        closeChat,
        dismissNotification,
        resetDemoData,
        updateBusinessCatalogItem,
        addBusinessCatalogItem,
        deleteBusinessCatalogItem,
        toggleBusinessAutoDispatch,
        dispatchBusinessDelivery,
        registerBusiness,
        updateBusinessStatus,
        isPartnerMenuOpen,
        setIsPartnerMenuOpen,
        openPartnerMenu,
        closePartnerMenu,
        isRegisterStoreOpen,
        setIsRegisterStoreOpen,
        openRegisterStore,
        closeRegisterStore,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
