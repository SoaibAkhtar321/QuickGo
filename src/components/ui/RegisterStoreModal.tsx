import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { NOIDA_LOCATIONS } from '../../data/mockData';
import {
  Store,
  X,
  Sparkles,
  CheckCircle2,
  Phone,
  User,
  MapPin,
  Building,
  Mail,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RegisterStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegistered?: () => void;
}

export const RegisterStoreModal: React.FC<RegisterStoreModalProps> = ({
  isOpen,
  onClose,
  onRegistered,
}) => {
  const { registerBusiness, setCurrentBusiness, setRole } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    phone: '',
    email: '',
    category: 'Grocery & Fresh Staples',
    locationName: NOIDA_LOCATIONS[0].name,
    address: '',
    gstNumber: '',
    autoDispatch: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const categories = [
    'Grocery & Fresh Staples',
    'Fresh Fruits & Vegetables',
    'Dairy, Bread & Eggs',
    'Snacks, Drinks & Munchies',
    'Bakery & Confectionery',
    'Pharmacy & Health',
    'Household & Essentials',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Store name is required';
    if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
    if (!formData.phone.trim() || formData.phone.length < 10) {
      newErrors.phone = 'Valid 10-digit phone number is required';
    }
    if (!formData.address.trim()) newErrors.address = 'Store address is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const selectedLoc =
      NOIDA_LOCATIONS.find((l) => l.name === formData.locationName) || NOIDA_LOCATIONS[0];

    const categoryImages: Record<string, string> = {
      'Grocery & Fresh Staples':
        'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&auto=format&fit=crop&q=80',
      'Fresh Fruits & Vegetables':
        'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=150&auto=format&fit=crop&q=80',
      'Dairy, Bread & Eggs':
        'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=150&auto=format&fit=crop&q=80',
      'Snacks, Drinks & Munchies':
        'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=150&auto=format&fit=crop&q=80',
      'Bakery & Confectionery':
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&auto=format&fit=crop&q=80',
      'Pharmacy & Health':
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=80',
    };

    const newStore = registerBusiness({
      name: formData.name.trim(),
      ownerName: formData.ownerName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || `${formData.name.toLowerCase().replace(/\s+/g, '')}@quickfresh.in`,
      category: formData.category,
      address: `${formData.address.trim()}, ${formData.locationName}`,
      location: selectedLoc,
      avatar:
        categoryImages[formData.category] ||
        'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&auto=format&fit=crop&q=80',
      gstNumber: formData.gstNumber.trim() || undefined,
      autoDispatch: formData.autoDispatch,
      commissionRate: 0.05,
      deliveryTimeEstimate: '10-15 min',
    });

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    setIsSubmitting(false);
    setCurrentBusiness(newStore);
    setRole('business');

    if (onRegistered) onRegistered();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-5 sm:p-6 shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/35 text-white/90 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/25 shadow-sm">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full text-white">
                  Seller Network
                </span>
                <span className="text-[10px] font-bold text-red-100 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-yellow-300 fill-yellow-300" /> 10-Min Fast Dispatch
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                Register as a Store
              </h2>
            </div>
          </div>
          <p className="text-xs text-red-100 mt-2">
            Sell directly to thousands of neighborhood shoppers in Noida & Delhi NCR.
          </p>
        </div>

        {/* Benefits bar */}
        <div className="bg-neutral-50 border-b border-neutral-200 px-5 py-2.5 flex items-center justify-between text-[11px] font-bold text-neutral-600">
          <span className="flex items-center gap-1 text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 0% Onboarding Fee
          </span>
          <span className="flex items-center gap-1 text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Same-Day Payouts
          </span>
          <span className="flex items-center gap-1 text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Instant Live Orders
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-left">
          {/* Store Name */}
          <div>
            <label className="block text-xs font-black text-neutral-800 uppercase tracking-wider mb-1.5">
              Store / Shop Name *
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Verma Daily Fresh Mart"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white border rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm font-semibold text-neutral-900 focus:outline-none transition-colors ${
                  errors.name ? 'border-red-500 focus:border-red-500' : 'border-neutral-200 focus:border-red-600'
                }`}
              />
              <Store className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {errors.name && <p className="text-[11px] font-bold text-red-600 mt-1">{errors.name}</p>}
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-black text-neutral-800 uppercase tracking-wider mb-1.5">
              Primary Store Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white border border-neutral-200 focus:border-red-600 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-semibold text-neutral-900 focus:outline-none transition-colors"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Owner Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-black text-neutral-800 uppercase tracking-wider mb-1.5">
                Owner / Manager Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Ramesh Verma"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className={`w-full bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white border rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm font-semibold text-neutral-900 focus:outline-none transition-colors ${
                    errors.ownerName ? 'border-red-500' : 'border-neutral-200 focus:border-red-600'
                  }`}
                />
                <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
              {errors.ownerName && <p className="text-[11px] font-bold text-red-600 mt-1">{errors.ownerName}</p>}
            </div>

            <div>
              <label className="block text-xs font-black text-neutral-800 uppercase tracking-wider mb-1.5">
                Phone Number *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white border rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm font-semibold text-neutral-900 focus:outline-none transition-colors ${
                    errors.phone ? 'border-red-500' : 'border-neutral-200 focus:border-red-600'
                  }`}
                />
                <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
              {errors.phone && <p className="text-[11px] font-bold text-red-600 mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* Email & Sector Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-black text-neutral-800 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="verma.store@quickfresh.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white border border-neutral-200 focus:border-red-600 rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm font-semibold text-neutral-900 focus:outline-none transition-colors"
                />
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-neutral-800 uppercase tracking-wider mb-1.5">
                Dispatch Hub / Sector
              </label>
              <div className="relative">
                <select
                  value={formData.locationName}
                  onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                  className="w-full bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white border border-neutral-200 focus:border-red-600 rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm font-semibold text-neutral-900 focus:outline-none transition-colors"
                >
                  {NOIDA_LOCATIONS.map((loc) => (
                    <option key={loc.name} value={loc.name}>
                      {loc.name}
                    </option>
                  ))}
                </select>
                <MapPin className="w-4 h-4 text-red-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Street Address */}
          <div>
            <label className="block text-xs font-black text-neutral-800 uppercase tracking-wider mb-1.5">
              Full Store Address & Landmark *
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Shop 12, Block B Main Market, Near Metro Station"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className={`w-full bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white border rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm font-semibold text-neutral-900 focus:outline-none transition-colors ${
                  errors.address ? 'border-red-500' : 'border-neutral-200 focus:border-red-600'
                }`}
              />
              <Building className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {errors.address && <p className="text-[11px] font-bold text-red-600 mt-1">{errors.address}</p>}
          </div>

          {/* GST / FSSAI (Optional) */}
          <div>
            <label className="block text-xs font-black text-neutral-800 uppercase tracking-wider mb-1.5">
              GST / FSSAI License Number (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. 07AAAAA0000A1Z5 (can add later)"
              value={formData.gstNumber}
              onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
              className="w-full bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white border border-neutral-200 focus:border-red-600 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-semibold text-neutral-900 focus:outline-none transition-colors"
            />
          </div>

          {/* Auto Dispatch Toggle */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3 flex items-start gap-3">
            <input
              type="checkbox"
              id="autoDispatchCheck"
              checked={formData.autoDispatch}
              onChange={(e) => setFormData({ ...formData, autoDispatch: e.target.checked })}
              className="mt-1 h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-neutral-300 cursor-pointer"
            />
            <label htmlFor="autoDispatchCheck" className="text-xs text-neutral-700 cursor-pointer">
              <span className="font-extrabold text-emerald-800 block">
                Enable Instant 10-Minute Courier Auto-Dispatch
              </span>
              <span>
                Orders placed by nearby customers will automatically notify and assign the nearest QuickFresh delivery partner.
              </span>
            </label>
          </div>

          {/* Submit button */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              id="btn-confirm-register-store"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-emerald-600/25 transition-transform active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Store className="w-4 h-4" />
              <span>{isSubmitting ? 'Registering...' : 'Register & Launch Store'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
