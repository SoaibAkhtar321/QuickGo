import React, { useMemo, useState } from 'react';
import { useApp } from '../../store/AppContext';
import { NOIDA_LOCATIONS } from '../../data/mockData';
import type { LocationCoord, ServiceConfig } from '../../types';
import type { ParcelRecord, ParcelSize } from '../../types/parcel';
import {
  PARCEL_CATEGORIES,
  PARCEL_SIZES,
  PARCEL_STATUS_STEPS,
  PARCEL_WEIGHTS,
  normalizeIndianPhone,
  parcelService,
  sizeLabel,
} from '../../services/parcelService';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  CircleDot,
  Info,
  MapPin,
  Package,
  Sparkles,
  Truck,
  User,
} from 'lucide-react';

interface CustomerParcelProps {
  /** The existing `parcel` ServiceConfig (admin-editable). Null if it has been removed. */
  service: ServiceConfig | null;
  onBack: () => void;
}

type Step = 'pickup' | 'recipient' | 'details' | 'review' | 'confirm' | 'submitted';

const FLOW_STEPS: { id: Exclude<Step, 'submitted'>; label: string }[] = [
  { id: 'pickup', label: 'Pickup' },
  { id: 'recipient', label: 'Recipient' },
  { id: 'details', label: 'Parcel' },
  { id: 'review', label: 'Review' },
  { id: 'confirm', label: 'Confirm' },
];

const inputCls =
  'w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-sm font-semibold text-neutral-900 placeholder:font-normal placeholder:text-neutral-400 focus:bg-white focus:border-[#FF6B35] focus:outline-none';
const labelCls = 'text-xs font-bold text-neutral-700';
const cardCls = 'bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/90 shadow-xs space-y-4';
const primaryBtn =
  'w-full sm:w-auto sm:min-w-[180px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#171717] text-white text-sm font-bold hover:bg-black transition-colors active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed';
const secondaryBtn =
  'w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white border border-neutral-200 text-neutral-800 text-sm font-bold hover:bg-neutral-50 transition-colors';

const FieldError: React.FC<{ message?: string }> = ({ message }) =>
  message ? (
    <p role="alert" className="text-[11px] font-semibold text-red-600">
      {message}
    </p>
  ) : null;

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

export const CustomerParcel: React.FC<CustomerParcelProps> = ({ service, onBack }) => {
  const { currentCustomer, savedAddresses, getActivePassForCustomer, getPassPlan } = useApp();

  const defaultAddress = savedAddresses.find((a) => a.isDefault) || savedAddresses[0];
  const activePass = getActivePassForCustomer(currentCustomer.id);
  const activePassPlan = activePass ? getPassPlan(activePass.planId) ?? null : null;

  const [step, setStep] = useState<Step>('pickup');
  const [submitting, setSubmitting] = useState(false);
  const [record, setRecord] = useState<ParcelRecord | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pickup (prefilled from the signed-in customer's existing profile / default address)
  const [senderName, setSenderName] = useState(currentCustomer.name || '');
  const [senderPhone, setSenderPhone] = useState(currentCustomer.phone || '');
  const [pickupLocation, setPickupLocation] = useState<LocationCoord>(
    defaultAddress?.location || NOIDA_LOCATIONS[0]
  );
  const [pickupAddress, setPickupAddress] = useState(
    defaultAddress ? [defaultAddress.flatNo, defaultAddress.address].filter(Boolean).join(', ') : ''
  );
  const [pickupInstructions, setPickupInstructions] = useState('');

  // Recipient (never needs a QuickGo account)
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [dropLocation, setDropLocation] = useState<LocationCoord>(
    NOIDA_LOCATIONS.find((l) => l.name !== (defaultAddress?.location || NOIDA_LOCATIONS[0]).name) ||
      NOIDA_LOCATIONS[1]
  );
  const [dropAddress, setDropAddress] = useState('');
  const [dropInstructions, setDropInstructions] = useState('');

  // Parcel details
  const [category, setCategory] = useState(PARCEL_CATEGORIES[0]);
  const [weightLabel, setWeightLabel] = useState(PARCEL_WEIGHTS[1]);
  const [size, setSize] = useState<ParcelSize>('small');
  const [description, setDescription] = useState('');

  // Area options: the existing serviceable areas plus any saved-address areas
  const areaOptions = useMemo(() => {
    const map = new Map<string, LocationCoord>();
    [...NOIDA_LOCATIONS, ...savedAddresses.map((a) => a.location)].forEach((l) => {
      if (!map.has(l.name)) map.set(l.name, l);
    });
    return Array.from(map.values());
  }, [savedAddresses]);

  const estimate = useMemo(
    () => (service ? parcelService.getEstimate(service, pickupLocation, dropLocation, activePassPlan) : null),
    [service, pickupLocation, dropLocation, activePassPlan]
  );

  if (!service || !service.enabled || !estimate) {
    return (
      <div className="space-y-4">
        <button onClick={onBack} className={secondaryBtn}>
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className={cardCls}>
          <h2 className="text-lg font-extrabold text-neutral-900">Parcel delivery is unavailable right now</h2>
          <p className="text-sm text-neutral-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  const pricing = estimate.pricing;

  // ---- validation ---------------------------------------------------------
  const validate = (s: Step): Record<string, string> => {
    const e: Record<string, string> = {};
    if (s === 'pickup') {
      if (senderName.trim().length < 2) e.senderName = 'Enter the sender name';
      if (!normalizeIndianPhone(senderPhone)) e.senderPhone = 'Enter a valid 10-digit mobile number';
      if (pickupAddress.trim().length < 5) e.pickupAddress = 'Enter the full pickup address';
    }
    if (s === 'recipient') {
      if (recipientName.trim().length < 2) e.recipientName = 'Enter the recipient name';
      if (!normalizeIndianPhone(recipientPhone)) e.recipientPhone = 'Enter a valid 10-digit mobile number';
      if (dropAddress.trim().length < 5) e.dropAddress = 'Enter the full delivery address';
    }
    return e;
  };

  const goNext = (from: Step, to: Step) => {
    const e = validate(from);
    setErrors(e);
    if (Object.keys(e).length === 0) {
      setStep(to);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goBackStep = (to: Step) => {
    setErrors({});
    setStep(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirm = async () => {
    const senderPhoneNorm = normalizeIndianPhone(senderPhone);
    const recipientPhoneNorm = normalizeIndianPhone(recipientPhone);
    if (!senderPhoneNorm || !recipientPhoneNorm) return;
    setSubmitting(true);
    const sender = { name: senderName.trim(), phone: senderPhoneNorm };
    const created = await parcelService.submitParcel(
      {
        pickup: {
          contact: sender,
          address: pickupAddress.trim(),
          instructions: pickupInstructions.trim() || undefined,
          location: pickupLocation,
        },
        recipient: {
          contact: { name: recipientName.trim(), phone: recipientPhoneNorm },
          address: dropAddress.trim(),
          instructions: dropInstructions.trim() || undefined,
          location: dropLocation,
        },
        details: {
          category,
          weightLabel,
          size,
          description: description.trim() || undefined,
        },
      },
      sender,
      estimate,
      Boolean(pricing.passDiscount)
    );
    setRecord(created);
    setSubmitting(false);
    setStep('submitted');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForNewParcel = () => {
    setRecord(null);
    setRecipientName('');
    setRecipientPhone('');
    setDropAddress('');
    setDropInstructions('');
    setDescription('');
    setErrors({});
    setStep('pickup');
  };

  // ---- shared pieces ------------------------------------------------------
  const renderAreaSelect = (id: string, value: LocationCoord, onChange: (l: LocationCoord) => void) => (
    <div className="relative">
      <select
        id={id}
        value={value.name}
        onChange={(e) => {
          const found = areaOptions.find((l) => l.name === e.target.value);
          if (found) onChange(found);
        }}
        className={`${inputCls} appearance-none pr-9`}
      >
        {areaOptions.map((loc) => (
          <option key={loc.name} value={loc.name}>
            {loc.name}
          </option>
        ))}
      </select>
      <ChevronRight className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
    </div>
  );

  const SummaryRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="flex justify-between gap-4 py-1.5 text-xs">
      <span className="text-neutral-500 shrink-0">{label}</span>
      <span className="font-semibold text-neutral-900 text-right min-w-0 break-words">{value}</span>
    </div>
  );

  const RouteSummary = () => (
    <div className="space-y-3">
      <div className="flex gap-3">
        <span className="mt-1 w-2.5 h-2.5 rounded-full bg-[#FF6B35] shrink-0" />
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-wider text-neutral-500">Pickup</p>
          <p className="text-sm font-bold text-neutral-900 break-words">{senderName.trim() || '-'}</p>
          <p className="text-xs text-neutral-600 break-words">
            {pickupAddress.trim()}, {pickupLocation.name}
          </p>
          {pickupInstructions.trim() && (
            <p className="text-[11px] text-neutral-500 break-words">Note: {pickupInstructions.trim()}</p>
          )}
        </div>
      </div>
      <div className="flex gap-3">
        <span className="mt-1 w-2.5 h-2.5 rounded-full bg-[#171717] shrink-0" />
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-wider text-neutral-500">Deliver to</p>
          <p className="text-sm font-bold text-neutral-900 break-words">{recipientName.trim() || '-'}</p>
          <p className="text-xs text-neutral-600 break-words">
            {dropAddress.trim()}, {dropLocation.name}
          </p>
          {dropInstructions.trim() && (
            <p className="text-[11px] text-neutral-500 break-words">Note: {dropInstructions.trim()}</p>
          )}
        </div>
      </div>
    </div>
  );

  // ---- header + progress --------------------------------------------------
  const stepIndex = FLOW_STEPS.findIndex((s) => s.id === step);

  return (
    <div className="space-y-4 max-w-3xl mx-auto w-full">
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            if (step === 'pickup' || step === 'submitted') onBack();
            else
              goBackStep(
                step === 'recipient' ? 'pickup' : step === 'details' ? 'recipient' : step === 'review' ? 'details' : 'review'
              );
          }}
          aria-label="Back"
          className="p-2 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-700 transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="min-w-0">
          <h2 className="text-lg font-extrabold text-neutral-900 flex items-center gap-1.5">
            <span>📦</span>
            <span className="truncate">Send a Parcel</span>
          </h2>
          <p className="text-xs text-neutral-500">Send packages across your city with QuickGo.</p>
        </div>
      </div>

      {step !== 'submitted' && (
        <ol className="flex items-center gap-1.5" aria-label="Progress">
          {FLOW_STEPS.map((s, i) => {
            const done = i < stepIndex;
            const current = i === stepIndex;
            return (
              <li key={s.id} className="flex-1 min-w-0" aria-current={current ? 'step' : undefined}>
                <div
                  className={`h-1.5 rounded-full ${
                    done || current ? 'bg-[#FF6B35]' : 'bg-neutral-200'
                  }`}
                />
                <p
                  className={`mt-1 text-[10px] sm:text-xs font-bold truncate ${
                    current ? 'text-neutral-900' : 'text-neutral-400'
                  }`}
                >
                  {i + 1}. {s.label}
                </p>
              </li>
            );
          })}
        </ol>
      )}

      {/* STEP 1 - PICKUP */}
      {step === 'pickup' && (
        <div className={cardCls}>
          <h3 className="text-xs font-black text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" /> Pickup details
          </h3>

          {savedAddresses.length > 0 && (
            <div className="space-y-1.5">
              <p className={labelCls}>Use a saved address</p>
              <div className="flex flex-wrap gap-2">
                {savedAddresses.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => {
                      setPickupLocation(a.location);
                      setPickupAddress([a.flatNo, a.address].filter(Boolean).join(', '));
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold border bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-[#FFF2EB] hover:border-[#FF6B35]"
                  >
                    {a.tag || a.type}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="sender-name" className={labelCls}>Sender name</label>
              <input id="sender-name" className={inputCls} value={senderName} onChange={(e) => setSenderName(e.target.value)} autoComplete="name" />
              <FieldError message={errors.senderName} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="sender-phone" className={labelCls}>Sender phone</label>
              <input id="sender-phone" type="tel" inputMode="tel" className={inputCls} value={senderPhone} onChange={(e) => setSenderPhone(e.target.value)} placeholder="10-digit mobile number" autoComplete="tel" />
              <FieldError message={errors.senderPhone} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="pickup-area" className={labelCls}>Pickup area</label>
            {renderAreaSelect('pickup-area', pickupLocation, setPickupLocation)}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="pickup-address" className={labelCls}>Pickup address</label>
            <textarea id="pickup-address" rows={2} className={inputCls} value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} placeholder="House / flat no., building, street, landmark" />
            <FieldError message={errors.pickupAddress} />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="pickup-instructions" className={labelCls}>Pickup instructions <span className="font-normal text-neutral-400">(optional)</span></label>
            <input id="pickup-instructions" className={inputCls} value={pickupInstructions} onChange={(e) => setPickupInstructions(e.target.value)} placeholder="e.g. Call on arrival, ask for the security desk" />
          </div>

          <div className="flex justify-end pt-1">
            <button type="button" className={primaryBtn} onClick={() => goNext('pickup', 'recipient')}>
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 - RECIPIENT */}
      {step === 'recipient' && (
        <div className={cardCls}>
          <h3 className="text-xs font-black text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> Recipient details
          </h3>
          <p className="text-xs text-neutral-500">The recipient does not need a QuickGo account.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="recipient-name" className={labelCls}>Recipient name</label>
              <input id="recipient-name" className={inputCls} value={recipientName} onChange={(e) => setRecipientName(e.target.value)} />
              <FieldError message={errors.recipientName} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="recipient-phone" className={labelCls}>Recipient phone</label>
              <input id="recipient-phone" type="tel" inputMode="tel" className={inputCls} value={recipientPhone} onChange={(e) => setRecipientPhone(e.target.value)} placeholder="10-digit mobile number" />
              <FieldError message={errors.recipientPhone} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="drop-area" className={labelCls}>Delivery area</label>
            {renderAreaSelect('drop-area', dropLocation, setDropLocation)}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="drop-address" className={labelCls}>Delivery address</label>
            <textarea id="drop-address" rows={2} className={inputCls} value={dropAddress} onChange={(e) => setDropAddress(e.target.value)} placeholder="House / flat no., building, street, landmark" />
            <FieldError message={errors.dropAddress} />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="drop-instructions" className={labelCls}>Delivery instructions <span className="font-normal text-neutral-400">(optional)</span></label>
            <input id="drop-instructions" className={inputCls} value={dropInstructions} onChange={(e) => setDropInstructions(e.target.value)} placeholder="e.g. Leave with the guard, call before arriving" />
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2 pt-1">
            <button type="button" className={secondaryBtn} onClick={() => goBackStep('pickup')}>Back</button>
            <button type="button" className={primaryBtn} onClick={() => goNext('recipient', 'details')}>
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 - PARCEL DETAILS */}
      {step === 'details' && (
        <div className={cardCls}>
          <h3 className="text-xs font-black text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5" /> Parcel details
          </h3>

          <div className="space-y-1.5">
            <label htmlFor="parcel-category" className={labelCls}>Package type</label>
            <div className="relative">
              <select id="parcel-category" value={category} onChange={(e) => setCategory(e.target.value)} className={`${inputCls} appearance-none pr-9`}>
                {PARCEL_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronRight className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <p className={labelCls}>Approximate weight</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="radiogroup" aria-label="Approximate weight">
              {PARCEL_WEIGHTS.map((w) => (
                <button
                  key={w}
                  type="button"
                  role="radio"
                  aria-checked={weightLabel === w}
                  onClick={() => setWeightLabel(w)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    weightLabel === w
                      ? 'bg-[#FFF2EB] border-[#FF6B35] text-[#E85A2A] shadow-2xs'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <p className={labelCls}>Size</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" role="radiogroup" aria-label="Parcel size">
              {PARCEL_SIZES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={size === s.id}
                  onClick={() => setSize(s.id)}
                  className={`py-2.5 px-3 rounded-xl text-left border transition-all ${
                    size === s.id
                      ? 'bg-[#FFF2EB] border-[#FF6B35] shadow-2xs'
                      : 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  <span className={`block text-xs font-bold ${size === s.id ? 'text-[#E85A2A]' : 'text-neutral-900'}`}>{s.label}</span>
                  <span className="block text-[11px] text-neutral-500">{s.hint}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="parcel-description" className={labelCls}>Description <span className="font-normal text-neutral-400">(optional)</span></label>
            <textarea id="parcel-description" rows={2} className={inputCls} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What are you sending?" maxLength={200} />
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2 pt-1">
            <button type="button" className={secondaryBtn} onClick={() => goBackStep('recipient')}>Back</button>
            <button type="button" className={primaryBtn} onClick={() => goNext('details', 'review')}>
              Review &amp; estimate <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4 - REVIEW & ESTIMATE */}
      {step === 'review' && (
        <div className="space-y-4">
          <div className={cardCls}>
            <h3 className="text-xs font-black text-neutral-500 uppercase tracking-wider">Review</h3>
            <RouteSummary />
            <div className="divide-y divide-neutral-100 border-t border-neutral-100 pt-2">
              <SummaryRow label="Parcel type" value={category} />
              <SummaryRow label="Weight" value={weightLabel} />
              <SummaryRow label="Size" value={sizeLabel(size)} />
              {description.trim() && <SummaryRow label="Description" value={description.trim()} />}
              <SummaryRow label="Estimated delivery time" value={`about ${estimate.estimatedMinutes} min`} />
            </div>
          </div>

          <div className={cardCls}>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-neutral-500 uppercase tracking-wider">Estimated fare</h3>
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">Estimate</span>
            </div>
            <div className="divide-y divide-neutral-100">
              <SummaryRow label="Distance" value={`${pricing.distanceKm} km`} />
              <SummaryRow label="Base fare" value={`₹${pricing.baseFare}`} />
              <SummaryRow label="Distance charge" value={`₹${pricing.distanceFare}`} />
              <SummaryRow label="Platform fee" value={`₹${pricing.platformFee}`} />
              {pricing.surgeAmount > 0 && <SummaryRow label="Demand charge" value={`₹${pricing.surgeAmount}`} />}
              {pricing.passDiscount ? (
                <div className="flex justify-between gap-4 py-1.5 text-xs text-green-700 font-semibold">
                  <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> QuickPass benefit{activePassPlan ? ` (${activePassPlan.name})` : ''}</span>
                  <span>-₹{pricing.passDiscount}</span>
                </div>
              ) : null}
              <SummaryRow label="Taxes" value={`₹${pricing.tax}`} />
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-neutral-200">
              <span className="text-sm font-black text-neutral-900">Payable amount</span>
              <span className="text-xl font-black text-neutral-900">₹{pricing.total}</span>
            </div>
            <p className="text-[11px] text-neutral-500 flex gap-1.5">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>This estimate comes from QuickGo's demo pricing. Final pricing will come from the QuickGo backend once booking is live.</span>
            </p>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2">
            <button type="button" className={secondaryBtn} onClick={() => goBackStep('details')}>Back</button>
            <button type="button" className={primaryBtn} onClick={() => goNext('review', 'confirm')}>
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5 - CONFIRM */}
      {step === 'confirm' && (
        <div className="space-y-4">
          <div className={cardCls}>
            <h3 className="text-xs font-black text-neutral-500 uppercase tracking-wider">Confirm your parcel</h3>
            <RouteSummary />
            <div className="divide-y divide-neutral-100 border-t border-neutral-100 pt-2">
              <SummaryRow label="Parcel" value={`${category} · ${sizeLabel(size)} · ${weightLabel}`} />
              <SummaryRow label="Estimated delivery time" value={`about ${estimate.estimatedMinutes} min`} />
              <SummaryRow label="Payable amount" value={<span className="font-black">₹{pricing.total}</span>} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex gap-2.5">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <p>
              <strong>Demo mode.</strong> Confirming records this request on this device only. No delivery partner is
              booked and no payment is taken yet.
            </p>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2">
            <button type="button" className={secondaryBtn} onClick={() => goBackStep('review')} disabled={submitting}>Back</button>
            <button type="button" className={primaryBtn} onClick={handleConfirm} disabled={submitting}>
              {submitting ? 'Confirming…' : 'Confirm Parcel'}
            </button>
          </div>
        </div>
      )}

      {/* SUBMITTED + STATUS */}
      {step === 'submitted' && record && (
        <div className="space-y-4">
          <div className={cardCls}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-extrabold text-neutral-900">Parcel request recorded (demo)</h3>
                <p className="text-xs text-neutral-500 break-all">Reference {record.id}</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
              Demo mode: this request is stored on this device only. No delivery partner has been booked and nothing below is live tracking.
            </div>
          </div>

          <div className={cardCls}>
            <h3 className="text-xs font-black text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" /> Parcel status
            </h3>
            <ol className="space-y-3">
              {PARCEL_STATUS_STEPS.map((s, i) => {
                const currentIdx = PARCEL_STATUS_STEPS.findIndex((x) => x.status === record.status);
                const reached = i <= currentIdx;
                const isCurrent = i === currentIdx;
                const event = record.statusHistory.find((h) => h.status === s.status);
                return (
                  <li key={s.status} className="flex gap-3">
                    <span
                      className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        reached ? 'bg-[#FF6B35] text-white' : 'bg-neutral-200 text-neutral-400'
                      }`}
                    >
                      {reached && !isCurrent ? <Check className="w-3 h-3" /> : <CircleDot className="w-3 h-3" />}
                    </span>
                    <div className="min-w-0">
                      <p className={`text-sm font-bold ${reached ? 'text-neutral-900' : 'text-neutral-400'}`}>{s.label}</p>
                      <p className="text-[11px] text-neutral-500">
                        {event ? `${formatTime(event.at)} · ` : ''}
                        {s.sub}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>

            {record.deliveryPartner && (
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs">
                <span className="font-bold text-neutral-900">{record.deliveryPartner.name}</span>
              </div>
            )}

            {record.status !== 'DELIVERED' && (
              <button type="button" className={secondaryBtn} onClick={() => setRecord(parcelService.previewNextStatus(record))}>
                Preview next status (demo)
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button type="button" className={primaryBtn} onClick={resetForNewParcel}>Send another parcel</button>
            <button type="button" className={secondaryBtn} onClick={onBack}>Back to home</button>
          </div>
        </div>
      )}
    </div>
  );
};
