import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './store/AppContext';
import { RoleSwitcher } from './components/ui/RoleSwitcher';
import { CallModal } from './components/ui/CallModal';
import { ChatModal } from './components/ui/ChatModal';
import { NotificationToast } from './components/ui/NotificationToast';
import { LandingPage } from './pages/LandingPage';
import { RoleLoginPage } from './pages/RoleLoginPage';

// Customer Pages & Quick Commerce Components
import { CustomerLayout, CustomerTab } from './pages/customer/CustomerLayout';
import { CustomerHome } from './pages/customer/CustomerHome';
import { CustomerCategories } from './pages/customer/CustomerCategories';
import { CustomerSearch } from './pages/customer/CustomerSearch';
import { CustomerCreateDelivery } from './pages/customer/CustomerCreateDelivery';
import { CustomerSearchingPartner } from './pages/customer/CustomerSearchingPartner';
import { CustomerTrack } from './pages/customer/CustomerTrack';
import { CustomerOrders } from './pages/customer/CustomerOrders';
import { CustomerOrderDetail } from './pages/customer/CustomerOrderDetail';
import { CustomerPasses } from './pages/customer/CustomerPasses';
import { CustomerProfile } from './pages/customer/CustomerProfile';
import { CustomerSupport } from './pages/customer/CustomerSupport';

import { CustomerCartDrawer } from './components/commerce/CustomerCartDrawer';
import { ProductDetailModal } from './components/commerce/ProductDetailModal';
import { MobileCartBar } from './components/commerce/MobileCartBar';

// Partner Pages
import { PartnerLayout, PartnerTab } from './pages/partner/PartnerLayout';
import { PartnerHome } from './pages/partner/PartnerHome';
import { PartnerActiveDelivery } from './pages/partner/PartnerActiveDelivery';
import { PartnerEarnings } from './pages/partner/PartnerEarnings';
import { PartnerHistory } from './pages/partner/PartnerHistory';
import { PartnerProfile } from './pages/partner/PartnerProfile';

// Business (Merchant) Pages
import { BusinessLayout, BusinessTab } from './pages/business/BusinessLayout';
import { BusinessDashboard } from './pages/business/BusinessDashboard';
import { BusinessOrders } from './pages/business/BusinessOrders';
import { BusinessCatalog } from './pages/business/BusinessCatalog';
import { BusinessDispatch } from './pages/business/BusinessDispatch';
import { BusinessCustomers } from './pages/business/BusinessCustomers';
import { BusinessSettlement } from './pages/business/BusinessSettlement';
import { BusinessProfile } from './pages/business/BusinessProfile';

// Admin Pages
import { AdminLayout, AdminTab } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminOrderDetail } from './pages/admin/AdminOrderDetail';
import { AdminLiveMap } from './pages/admin/AdminLiveMap';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminPartners } from './pages/admin/AdminPartners';
import { AdminBusinesses } from './pages/admin/AdminBusinesses';
import { AdminPasses } from './pages/admin/AdminPasses';
import { AdminServices } from './pages/admin/AdminServices';
import { AdminPricing } from './pages/admin/AdminPricing';
import { AdminPayments } from './pages/admin/AdminPayments';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminSupport } from './pages/admin/AdminSupport';
import { AdminSettings } from './pages/admin/AdminSettings';

import { Order, Product, UserRole } from './types';

// Inner App Controller
const AppContent: React.FC = () => {
  const { currentRole, setRole, orders, services } = useApp();

  // Landing / Auth state
  const [showLanding, setShowLanding] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // Customer sub-view state
  const [customerTab, setCustomerTab] = useState<CustomerTab>('home');
  const [customerSubView, setCustomerSubView] = useState<
    | 'home'
    | 'categories'
    | 'search'
    | 'create'
    | 'searching'
    | 'track'
    | 'orders'
    | 'detail'
    | 'passes'
    | 'profile'
    | 'support'
  >('home');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('parcel');
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | null>(null);
  const [selectedCustomerOrderId, setSelectedCustomerOrderId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('dairy-breakfast');

  // Commerce Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);

  // Partner sub-view state
  const [partnerTab, setPartnerTab] = useState<PartnerTab>('duty');
  const [activePartnerOrderId, setActivePartnerOrderId] = useState<string | null>(null);

  // Business sub-view state
  const [businessTab, setBusinessTab] = useState<BusinessTab>('dashboard');

  // Admin sub-view state
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [selectedAdminOrder, setSelectedAdminOrder] = useState<Order | null>(null);

  const handleSelectService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setCustomerSubView('create');
  };

  const handleOrderCreated = (order: Order) => {
    setActiveTrackingOrderId(order.id);
    setCustomerSubView('searching');
  };

  const handlePartnerFound = (orderId: string) => {
    setActiveTrackingOrderId(orderId);
    setCustomerSubView('track');
  };

  const handleSelectOrderCustomer = (orderId: string) => {
    setSelectedCustomerOrderId(orderId);
    setCustomerSubView('detail');
  };

  const handleSelectOrderAdmin = (order: Order) => {
    setSelectedAdminOrder(order);
  };

  // Keep customerTab in sync when changing subviews
  useEffect(() => {
    if (customerSubView === 'home') {
      setCustomerTab('home');
    } else if (customerSubView === 'categories') {
      setCustomerTab('categories');
    } else if (customerSubView === 'search') {
      setCustomerTab('search');
    } else if (customerSubView === 'create') {
      setCustomerTab('create');
    } else if (customerSubView === 'track' || customerSubView === 'searching') {
      setCustomerTab('track');
    } else if (customerSubView === 'orders' || customerSubView === 'detail') {
      setCustomerTab('orders');
    } else if (customerSubView === 'passes') {
      setCustomerTab('passes');
    } else if (customerSubView === 'profile') {
      setCustomerTab('profile');
    } else if (customerSubView === 'support') {
      setCustomerTab('support');
    }
  }, [customerSubView]);

  // If user explicitly asks for Landing page
  if (showLanding) {
    return (
      <div className="relative min-h-screen bg-white">
        <RoleSwitcher />
        <LandingPage
          onGetStarted={() => {
            setShowLanding(false);
            setRole('customer');
            setCustomerSubView('home');
          }}
          onSelectRole={(role) => {
            setShowLanding(false);
            setRole(role);
          }}
          onNavigateToBooking={() => {
            setShowLanding(false);
            setRole('customer');
            setCustomerSubView('create');
          }}
        />
      </div>
    );
  }

  // If user explicitly requests Role Login selector
  if (showLogin) {
    return (
      <div className="relative min-h-screen bg-white">
        <RoleSwitcher />
        <RoleLoginPage
          onSelectRole={(role) => {
            setShowLogin(false);
            setRole(role);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      {/* Top Universal Role Switcher Bar */}
      <RoleSwitcher />

      {/* Role-Based Primary Views */}
      {currentRole === 'customer' && (
        <CustomerLayout
          activeTab={customerTab}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenSearch={() => setCustomerSubView('search')}
          setActiveTab={(tab) => {
            setCustomerTab(tab);
            if (tab === 'home') setCustomerSubView('home');
            else if (tab === 'categories') setCustomerSubView('categories');
            else if (tab === 'search') setCustomerSubView('search');
            else if (tab === 'create') setCustomerSubView('create');
            else if (tab === 'orders') setCustomerSubView('orders');
            else if (tab === 'track') setCustomerSubView('track');
            else if (tab === 'passes') setCustomerSubView('passes');
            else if (tab === 'profile') setCustomerSubView('profile');
            else if (tab === 'support') setCustomerSubView('support');
          }}
        >
          {customerSubView === 'home' && (
            <CustomerHome
              onSelectService={(service) => {
                setSelectedServiceId(service.id);
                setCustomerSubView('create');
              }}
              onTrackOrder={(orderId) => {
                setActiveTrackingOrderId(orderId);
                setCustomerSubView('track');
              }}
              onViewOrders={() => setCustomerSubView('orders')}
              onViewAllOrders={() => setCustomerSubView('orders')}
              onViewPasses={() => setCustomerSubView('passes')}
              onOpenSearch={() => setCustomerSubView('search')}
              onSelectCategory={(categoryId) => {
                setSelectedCategoryId(categoryId);
                setCustomerSubView('categories');
              }}
              onOpenProductDetail={(product) => setSelectedDetailProduct(product)}
              onOpenCart={() => setIsCartOpen(true)}
            />
          )}

          {customerSubView === 'categories' && (
            <CustomerCategories
              initialCategoryId={selectedCategoryId}
              onOpenProductDetail={(product) => setSelectedDetailProduct(product)}
              onSelectCategory={(categoryId) => setSelectedCategoryId(categoryId)}
            />
          )}

          {customerSubView === 'search' && (
            <CustomerSearch
              onBack={() => setCustomerSubView('home')}
              onOpenProductDetail={(product) => setSelectedDetailProduct(product)}
              onSelectService={(srvId) => handleSelectService(srvId)}
              onSelectCategory={(catId) => {
                setSelectedCategoryId(catId);
                setCustomerSubView('categories');
              }}
            />
          )}

          {customerSubView === 'create' && (
            <CustomerCreateDelivery
              selectedService={services.find((s) => s.id === selectedServiceId) || services[0]}
              onBack={() => setCustomerSubView('home')}
              onOrderPlaced={handleOrderCreated}
            />
          )}

          {customerSubView === 'searching' && activeTrackingOrderId && (
            <CustomerSearchingPartner
              orderId={activeTrackingOrderId}
              onPartnerFound={handlePartnerFound}
              onCancel={() => setCustomerSubView('home')}
            />
          )}

          {customerSubView === 'track' && (
            <CustomerTrack
              orderId={activeTrackingOrderId || undefined}
              onBack={() => setCustomerSubView('home')}
            />
          )}

          {customerSubView === 'passes' && (
            <CustomerPasses
              onPassPurchased={() => {
                // Return to home or stay on passes
              }}
            />
          )}

          {customerSubView === 'orders' && (
            <CustomerOrders
              onSelectOrder={handleSelectOrderCustomer}
              onTrackOrder={(orderId) => {
                setActiveTrackingOrderId(orderId);
                setCustomerSubView('track');
              }}
              onCreateNew={() => setCustomerSubView('create')}
            />
          )}

          {customerSubView === 'detail' && selectedCustomerOrderId && (
            <CustomerOrderDetail
              orderId={selectedCustomerOrderId}
              onBack={() => setCustomerSubView('orders')}
              onTrack={(orderId) => {
                setActiveTrackingOrderId(orderId);
                setCustomerSubView('track');
              }}
            />
          )}

          {customerSubView === 'profile' && <CustomerProfile />}

          {customerSubView === 'support' && (
            <CustomerSupport onBack={() => setCustomerSubView('home')} />
          )}

          {/* Global Customer Cart Drawer */}
          <CustomerCartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            onOrderPlaced={(newOrder) => {
              setActiveTrackingOrderId(newOrder.id);
              setCustomerSubView('track');
            }}
            onNavigateToPasses={() => setCustomerSubView('passes')}
          />

          {/* Product Detail Modal */}
          {selectedDetailProduct && (
            <ProductDetailModal
              product={selectedDetailProduct}
              onClose={() => setSelectedDetailProduct(null)}
              onSelectCategory={(catId) => {
                setSelectedCategoryId(catId);
                setSelectedDetailProduct(null);
                setCustomerSubView('categories');
              }}
            />
          )}
        </CustomerLayout>
      )}

      {currentRole === 'business' && (
        <BusinessLayout
          currentTab={businessTab}
          onTabChange={setBusinessTab}
        >
          {businessTab === 'dashboard' && (
            <BusinessDashboard
              onNavigateToDispatch={() => setBusinessTab('dispatch')}
              onNavigateToOrders={() => setBusinessTab('orders')}
              onNavigateToCatalog={() => setBusinessTab('catalog')}
            />
          )}

          {businessTab === 'orders' && <BusinessOrders />}

          {businessTab === 'catalog' && <BusinessCatalog />}

          {businessTab === 'dispatch' && (
            <BusinessDispatch
              onOrderDispatched={(order) => {
                // Stay or switch to orders
              }}
            />
          )}

          {businessTab === 'customers' && <BusinessCustomers />}

          {businessTab === 'settlement' && <BusinessSettlement />}

          {businessTab === 'profile' && <BusinessProfile />}
        </BusinessLayout>
      )}

      {currentRole === 'partner' && (
        <PartnerLayout activeTab={partnerTab} setActiveTab={setPartnerTab}>
          {partnerTab === 'duty' && (
            <PartnerHome
              onOpenDelivery={(orderId) => {
                setActivePartnerOrderId(orderId);
                setPartnerTab('active-delivery');
              }}
            />
          )}

          {partnerTab === 'active-delivery' && (
            <PartnerActiveDelivery
              orderId={activePartnerOrderId || undefined}
              onBack={() => setPartnerTab('duty')}
              onDone={() => setPartnerTab('duty')}
            />
          )}

          {partnerTab === 'earnings' && <PartnerEarnings />}

          {partnerTab === 'history' && (
            <PartnerHistory
              onSelectOrder={(orderId) => {
                setActivePartnerOrderId(orderId);
                setPartnerTab('active-delivery');
              }}
            />
          )}

          {partnerTab === 'profile' && <PartnerProfile />}
        </PartnerLayout>
      )}

      {currentRole === 'admin' && (
        <AdminLayout
          currentTab={adminTab}
          setCurrentTab={(tab) => {
            setAdminTab(tab);
            setSelectedAdminOrder(null);
          }}
        >
          {selectedAdminOrder ? (
            <AdminOrderDetail
              order={selectedAdminOrder}
              onBack={() => setSelectedAdminOrder(null)}
            />
          ) : (
            <>
              {adminTab === 'dashboard' && (
                <AdminDashboard
                  onSelectOrder={handleSelectOrderAdmin}
                  onNavigateTab={(tab) => setAdminTab(tab)}
                />
              )}
              {adminTab === 'orders' && (
                <AdminOrders onSelectOrder={handleSelectOrderAdmin} />
              )}
              {adminTab === 'live-map' && (
                <AdminLiveMap onSelectOrder={handleSelectOrderAdmin} />
              )}
              {adminTab === 'customers' && <AdminCustomers />}
              {adminTab === 'partners' && <AdminPartners />}
              {adminTab === 'businesses' && <AdminBusinesses />}
              {adminTab === 'passes' && <AdminPasses />}
              {adminTab === 'services' && <AdminServices />}
              {adminTab === 'pricing' && <AdminPricing />}
              {adminTab === 'payments' && <AdminPayments />}
              {adminTab === 'analytics' && <AdminAnalytics />}
              {adminTab === 'support' && <AdminSupport />}
              {adminTab === 'settings' && <AdminSettings />}
            </>
          )}
        </AdminLayout>
      )}

      {/* Global Interactive Modals */}
      <CallModal />
      <ChatModal />
      <NotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
