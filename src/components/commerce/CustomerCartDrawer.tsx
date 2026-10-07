import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { Order } from '../../types';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Sparkles,
  Tag,
  CheckCircle2,
  MapPin,
  Clock,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  Trash2,
  ChevronRight,
  Zap,
} from 'lucide-react';

interface CustomerCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderPlaced: (order: Order) => void;
  onNavigateToPasses?: () => void;
}

export const CustomerCartDrawer: React.FC<CustomerCartDrawerProps> = ({
  isOpen,
  onClose,
  onOrderPlaced,
  onNavigateToPasses,
}) => {
  const {
    cart,
    cartTotal,
    cartItemCount,
    cartSavings,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    coupons,
    savedAddresses,
    selectedAddress,
    setSelectedAddress,
    addAddress,
    currentCustomer,
    getActivePassForCustomer,
    createQuickCommerceOrder,
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<
    'UPI' | 'Card' | 'Wallet' | 'Cash on Delivery'
  >('UPI');
  const [instructions, setInstructions] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);

  // New address form state
  const [newAddrType, setNewAddrType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [newAddrText, setNewAddrText] = useState('');
  const [newAddrFlat, setNewAddrFlat] = useState('');
  const [newAddrLandmark, setNewAddrLandmark] = useState('');

  if (!isOpen) return null;

  const activePass = getActivePassForCustomer(currentCustomer.id);
  const isFreeDelivery = activePass !== null || appliedCoupon?.code === 'FREESHIP';
  const baseDeliveryFee = 35;
  const deliveryCharge = isFreeDelivery ? 0 : baseDeliveryFee;
  const platformFee = activePass ? 0 : 5;

  // Coupon discount calculation
  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'flat') {
      couponDiscount = appliedCoupon.discountValue;
    } else if (appliedCoupon.discountType === 'percentage') {
      const disc = Math.round((cartTotal * appliedCoupon.discountValue) / 100);
      couponDiscount = appliedCoupon.maxDiscount ? Math.min(disc, appliedCoupon.maxDiscount) : disc;
    }
  }

  const tax = Math.round(cartTotal * 0.05);
  const grandTotal = Math.max(1, cartTotal + deliveryCharge + platformFee + tax - couponDiscount);
  const totalMoneySaved =
    cartSavings + (activePass ? baseDeliveryFee + platformFee : 0) + couponDiscount;

  const handleApplyCoupon = (code: string) => {
    setCouponError(null);
    setCouponSuccess(null);
    const res = applyCoupon(code);
    if (res.success) {
      setCouponSuccess(res.message);
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  const handleCreateOrder = () => {
    if (cart.length === 0) return;
    setIsPlacingOrder(true);

    setTimeout(() => {
      try {
        const order = createQuickCommerceOrder({
          paymentMethod: selectedPayment,
          instructions,
          deliveryType: 'instant',
        });
        setIsPlacingOrder(false);
        onClose();
        onOrderPlaced(order);
      } catch (err: any) {
        setIsPlacingOrder(false);
        alert(err?.message || 'Error creating order');
      }
    }, 1200);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrText.trim()) return;

    addAddress({
      type: newAddrType,
      tag: `${newAddrFlat ? newAddrFlat + ', ' : ''}${newAddrText.slice(0, 24)}`,
      address: newAddrText,
      flatNo: newAddrFlat,
      landmark: newAddrLandmark,
      location: selectedAddress.location,
      isDefault: false,
    });

    setShowAddAddressModal(false);
    setNewAddrText('');
    setNewAddrFlat('');
    setNewAddrLandmark('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg lg:max-w-xl bg-[#F8F9FA] h-full shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-neutral-200 animate-in slide-in-from-right duration-200 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="sticky top-0 z-20 bg-white border-b border-neutral-200 p-4 sm:p-5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-neutral-900 leading-tight">
                My Shopping Cart
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
                <span className="text-[#16A34A] font-bold flex items-center gap-0.5">
                  <Zap className="w-3 h-3 fill-current" /> 10-15 Mins Delivery
                </span>
                <span>•</span>
                <span>{cartItemCount} items</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs font-bold text-neutral-400 hover:text-red-600 transition-colors px-2 py-1"
                title="Clear Cart"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-neutral-100 flex items-center justify-center text-4xl">
              🛒
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-neutral-900">Your cart is empty</h3>
              <p className="text-xs text-neutral-500 max-w-xs">
                Explore thousands of fresh groceries, dairy, snacks and essentials delivered in 10 minutes.
              </p>
            </div>
            <button
              onClick={onClose}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-black px-6 py-3 rounded-2xl shadow-md shadow-red-600/25 active:scale-95"
            >
              Browse Categories
            </button>
          </div>
        ) : (
          <div className="flex-1 p-4 sm:p-5 space-y-5">
            {/* QuickPass Savings Banner */}
            {activePass ? (
              <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white rounded-2xl p-3.5 shadow-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center font-bold text-sm">
                    ✨
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-red-400 tracking-wider block">
                      QuickPass Benefit Active
                    </span>
                    <span className="text-xs font-bold text-neutral-200">
                      ₹0 Delivery + ₹0 Platform Fee Applied!
                    </span>
                  </div>
                </div>
                <span className="text-xs font-black text-green-400 bg-green-500/20 px-2 py-0.5 rounded border border-green-500/30">
                  VIP
                </span>
              </div>
            ) : (
              <div className="bg-red-50/70 border border-red-200 rounded-2xl p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">🎫</span>
                  <div>
                    <span className="text-xs font-black text-neutral-900 block">
                      Get 100% Free Deliveries
                    </span>
                    <span className="text-[11px] text-neutral-600">
                      Save ₹40 on this order with QuickPass from ₹79
                    </span>
                  </div>
                </div>
                {onNavigateToPasses && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToPasses();
                    }}
                    className="text-xs font-black text-red-600 hover:underline shrink-0"
                  >
                    View Passes →
                  </button>
                )}
              </div>
            )}

            {/* Cart Items List */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-neutral-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <span className="text-xs font-black text-neutral-500 uppercase tracking-wider">
                  Cart Items ({cartItemCount})
                </span>
                <span className="text-[11px] font-bold text-neutral-400">
                  From {cart[0]?.businessName || 'Local Store'}
                </span>
              </div>

              <div className="divide-y divide-neutral-100 space-y-2">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="pt-2.5 first:pt-0 flex items-center justify-between gap-3"
                  >
                    {/* Image & Title */}
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-xl object-cover bg-neutral-100 shrink-0 border border-neutral-100"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-neutral-900 truncate">
                          {item.product.name}
                        </h4>
                        <div className="text-[10px] text-neutral-500 font-medium">
                          {item.product.unit} • ₹{item.product.price}
                        </div>
                      </div>
                    </div>

                    {/* Quantity modifier and Subtotal */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="inline-flex items-center bg-green-600 text-white rounded-xl shadow-2xs overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-green-700 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                        <span className="w-6 text-center text-xs font-black select-none">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-green-700 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </div>

                      <div className="text-right w-14">
                        <span className="text-xs sm:text-sm font-black text-neutral-900">
                          ₹{item.product.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address Selector */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-neutral-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-600" />
                  <span>Delivering To</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddAddressModal(true)}
                  className="text-xs font-bold text-red-600 hover:underline"
                >
                  + Add Address
                </button>
              </div>

              {/* Address Radio Cards */}
              <div className="space-y-2">
                {savedAddresses.map((addr) => {
                  const isSelected = selectedAddress.id === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddress(addr)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-red-500 bg-red-50/50 shadow-2xs'
                          : 'border-neutral-200 bg-neutral-50/60 hover:bg-neutral-100/60'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-neutral-900">{addr.type}</span>
                          {addr.isDefault && (
                            <span className="text-[9px] font-bold bg-neutral-200 text-neutral-700 px-1.5 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-600 truncate mt-0.5">{addr.address}</p>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-red-600 bg-red-600' : 'border-neutral-300'
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery Note */}
              <div className="pt-2">
                <input
                  type="text"
                  placeholder="Delivery note: (e.g. Leave with guard / Don't ring bell)"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium text-neutral-800 focus:bg-white focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Coupons & Offers Section */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-neutral-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-red-600" />
                  <span>Coupons & Offers</span>
                </span>
                {appliedCoupon && (
                  <button
                    onClick={removeCoupon}
                    className="text-xs font-bold text-red-600 hover:underline"
                  >
                    Remove ({appliedCoupon.code})
                  </button>
                )}
              </div>

              {/* Coupon Input */}
              {!appliedCoupon ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter promo code (e.g. QUICK50)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 focus:bg-white focus:border-red-500 focus:outline-none uppercase"
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon(couponInput)}
                      className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-black px-4 py-2 rounded-xl transition-colors shrink-0"
                    >
                      Apply
                    </button>
                  </div>

                  {couponError && (
                    <p className="text-[11px] font-bold text-red-600">{couponError}</p>
                  )}
                  {couponSuccess && (
                    <p className="text-[11px] font-bold text-green-600">{couponSuccess}</p>
                  )}

                  {/* Available Coupons Pills */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase">
                      Available Promo Codes
                    </span>
                    <div className="space-y-1.5">
                      {coupons.map((c) => (
                        <div
                          key={c.code}
                          className="p-2.5 rounded-xl border border-dashed border-neutral-300 bg-neutral-50/50 flex items-center justify-between gap-2"
                        >
                          <div>
                            <span className="text-xs font-black text-neutral-900 bg-neutral-200 px-2 py-0.5 rounded">
                              {c.code}
                            </span>
                            <p className="text-[10px] text-neutral-600 mt-0.5">{c.title}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleApplyCoupon(c.code)}
                            className="text-xs font-black text-red-600 hover:underline shrink-0"
                          >
                            Apply
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-green-50 border border-green-200 rounded-2xl flex items-center justify-between text-xs text-green-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                    <div>
                      <strong className="block font-black">{appliedCoupon.code} Applied!</strong>
                      <span className="text-[11px] text-green-700">
                        {appliedCoupon.title} (-₹{couponDiscount})
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bill Details Summary */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-neutral-200/90 shadow-xs space-y-2.5 text-xs">
              <h3 className="text-xs font-black text-neutral-500 uppercase tracking-wider pb-1 border-b border-neutral-100">
                Bill Summary
              </h3>

              <div className="flex justify-between text-neutral-600">
                <span>Item Total</span>
                <span className="font-bold text-neutral-900">₹{cartTotal}</span>
              </div>

              <div className="flex justify-between text-neutral-600">
                <span className="flex items-center gap-1">
                  Delivery Charge
                  {isFreeDelivery && (
                    <span className="text-[9px] font-black uppercase text-green-700 bg-green-100 px-1 rounded">
                      FREE
                    </span>
                  )}
                </span>
                <span className="font-bold text-neutral-900">
                  {isFreeDelivery ? (
                    <span className="text-green-700 font-black">₹0</span>
                  ) : (
                    `₹${deliveryCharge}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-neutral-600">
                <span>Platform & Handling Fee</span>
                <span className="font-bold text-neutral-900">
                  {platformFee === 0 ? <span className="text-green-700 font-bold">₹0</span> : `₹${platformFee}`}
                </span>
              </div>

              <div className="flex justify-between text-neutral-600">
                <span>GST & Govt Taxes (5%)</span>
                <span className="font-bold text-neutral-900">₹{tax}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-700 font-bold py-1 bg-green-50 px-2 rounded-xl">
                  <span>Promo Discount ({appliedCoupon?.code})</span>
                  <span>-₹{couponDiscount}</span>
                </div>
              )}

              {totalMoneySaved > 0 && (
                <div className="p-2.5 rounded-xl bg-green-50 border border-green-200 text-green-800 text-[11px] font-bold flex items-center justify-between">
                  <span>🎉 Total Savings on this order</span>
                  <span className="text-sm font-black text-green-800">₹{totalMoneySaved}</span>
                </div>
              )}

              <div className="flex justify-between pt-2 border-t border-neutral-100 text-base font-black text-neutral-900">
                <span>To Pay</span>
                <span className="text-red-600 text-xl font-black">₹{grandTotal}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-neutral-200/90 shadow-xs space-y-3">
              <span className="text-xs font-black text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-red-600" />
                <span>Select Payment Method</span>
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'UPI', label: 'UPI (GPay, PhonePe, Paytm)', icon: '⚡' },
                  { id: 'Card', label: 'Credit / Debit Card', icon: '💳' },
                  { id: 'Wallet', label: 'Paytm / Mobikwik', icon: '👛' },
                  { id: 'Cash on Delivery', label: 'Cash on Delivery (COD)', icon: '💵' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedPayment(m.id as any)}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      selectedPayment === m.id
                        ? 'border-green-600 bg-green-50/70 shadow-2xs font-bold text-neutral-900 ring-1 ring-green-600'
                        : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    <span className="text-base">{m.icon}</span>
                    <span className="text-xs mt-1.5 line-clamp-1">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Sticky Action Bar */}
        {cart.length > 0 && (
          <div className="sticky bottom-0 bg-white border-t border-neutral-200 p-4 sm:p-5 shadow-lg">
            <button
              onClick={handleCreateOrder}
              disabled={isPlacingOrder}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-neutral-400 text-white font-black text-sm py-4 rounded-2xl shadow-xl shadow-green-600/30 flex items-center justify-between px-6 transition-all active:scale-98 cursor-pointer"
            >
              <div className="text-left">
                <span className="text-xs text-white/80 block uppercase font-bold tracking-wider">
                  {cartItemCount} items • {selectedPayment}
                </span>
                <span className="text-lg font-black text-white">₹{grandTotal}</span>
              </div>

              <div className="flex items-center gap-2">
                <span>{isPlacingOrder ? 'Processing...' : 'Place Order'}</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Add Address Modal */}
      {showAddAddressModal && (
        <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-neutral-900">Add New Delivery Address</h3>
              <button
                onClick={() => setShowAddAddressModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Address Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Home', 'Work', 'Other'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewAddrType(t)}
                      className={`py-2 rounded-xl text-xs font-bold border ${
                        newAddrType === t
                          ? 'bg-red-50 border-red-500 text-red-600'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  House / Flat / Floor No.
                </label>
                <input
                  type="text"
                  placeholder="e.g. Flat 304, Tower C"
                  value={newAddrFlat}
                  onChange={(e) => setNewAddrFlat(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Full Street Address & Society
                </label>
                <textarea
                  placeholder="e.g. Sector 62, Near Electronic City Metro Station, Noida"
                  value={newAddrText}
                  onChange={(e) => setNewAddrText(e.target.value)}
                  rows={2}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs font-medium focus:bg-white focus:border-red-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Nearby Landmark (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Opposite Stellar IT Park"
                  value={newAddrLandmark}
                  onChange={(e) => setNewAddrLandmark(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:border-red-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-xs py-3 rounded-xl shadow-md transition-colors"
              >
                Save & Deliver Here
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
