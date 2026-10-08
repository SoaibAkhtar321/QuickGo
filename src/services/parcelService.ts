import type { LocationCoord, PassPlan, ServiceConfig } from '../types';
import type {
  ParcelContact,
  ParcelDraft,
  ParcelEstimate,
  ParcelPartner,
  ParcelRecord,
  ParcelSize,
  ParcelStatus,
} from '../types/parcel';
import { pricingService } from './pricingService';

/**
 * parcelService: the single replaceable seam between the Parcel UI and the future backend.
 *
 * TODAY everything below is frontend/mock:
 *  - estimates delegate to the existing mock `pricingService` (not production pricing)
 *  - `submitParcel` does NOT contact any server and creates no real delivery
 *  - status progression is a demo preview, not partner-driven tracking
 *
 * To go live, re-implement `getEstimate`, `submitParcel` and the status source behind the same
 * signatures. UI components must not import `pricingService` for parcels directly.
 */

export const PARCEL_SERVICE_ID = 'parcel';

// ---------------------------------------------------------------------------
// Option lists (presentation data, no pricing or logistics rules attached)
// ---------------------------------------------------------------------------

export const PARCEL_CATEGORIES = [
  'Documents / Envelopes',
  'Clothes / Apparel',
  'Electronics / Accessories',
  'Gifts',
  'Home Cooked Food / Bakery',
  'Keys / Small Items',
  'Other',
];

export const PARCEL_WEIGHTS = ['Under 1 kg', '1 - 3 kg', '3 - 5 kg', '5 - 10 kg'];

export const PARCEL_SIZES: { id: ParcelSize; label: string; hint: string }[] = [
  { id: 'small', label: 'Small', hint: 'Documents, keys, small items' },
  { id: 'medium', label: 'Medium', hint: 'Shoebox or small carton' },
  { id: 'large', label: 'Large', hint: 'Big box or bulky item' },
];

export const PARCEL_STATUS_STEPS: { status: ParcelStatus; label: string; sub: string }[] = [
  { status: 'REQUESTED', label: 'Parcel requested', sub: 'Your request is recorded' },
  { status: 'PARTNER_ASSIGNED', label: 'Delivery partner assigned', sub: 'A partner is matched to your parcel' },
  { status: 'PICKED_UP', label: 'Parcel picked up', sub: 'Collected from the sender' },
  { status: 'IN_TRANSIT', label: 'In transit', sub: 'On the way to the recipient' },
  { status: 'NEAR_RECIPIENT', label: 'Near recipient', sub: 'Arriving at the drop address' },
  { status: 'DELIVERED', label: 'Delivered', sub: 'Handed over to the recipient' },
];

// ---------------------------------------------------------------------------
// Validation helpers (pure, shared by the UI)
// ---------------------------------------------------------------------------

/** Returns a 10-digit Indian mobile number, or null if the input is not one. */
export const normalizeIndianPhone = (raw: string): string | null => {
  const digits = raw.replace(/\D/g, '');
  const local = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
  return /^[6-9]\d{9}$/.test(local) ? local : null;
};

export const sizeLabel = (size: ParcelSize): string =>
  PARCEL_SIZES.find((s) => s.id === size)?.label ?? size;

// ---------------------------------------------------------------------------
// Estimate  (MOCK: reuses existing pricingService + QuickPass eligibility rules)
// ---------------------------------------------------------------------------

export const parcelService = {
  getEstimate(
    service: ServiceConfig,
    pickup: LocationCoord,
    drop: LocationCoord,
    passPlan?: PassPlan | null
  ): ParcelEstimate {
    // Existing logic already applies Pass eligibility for the 'parcel' service id.
    // Size/weight do not change the price: no parcel-specific pricing rules exist yet.
    const pricing = pricingService.calculateQuote(service, pickup, drop, 1.0, passPlan);
    return {
      pricing,
      estimatedMinutes: pricing.estimatedMinutes,
      isEstimate: true,
      source: 'mock-pricing-service',
    };
  },

  /**
   * MOCK submission. Builds a local record only. No network call, no payment, no partner search.
   * A backend implementation should POST the draft and return the server-created record.
   */
  async submitParcel(
    draft: ParcelDraft,
    sender: ParcelContact,
    estimate: ParcelEstimate,
    passApplied: boolean
  ): Promise<ParcelRecord> {
    const now = new Date().toISOString();
    return {
      id: `DEMO-PCL-${Math.floor(100000 + Math.random() * 900000)}`,
      sender,
      pickup: draft.pickup,
      recipient: draft.recipient,
      details: draft.details,
      deliveryPartner: null,
      status: 'REQUESTED',
      pricing: estimate.pricing,
      passApplied,
      statusHistory: [{ status: 'REQUESTED', at: now }],
      createdAt: now,
      updatedAt: now,
      isMock: true,
    };
  },

  // -------------------------------------------------------------------------
  // Demo-only status preview. NOT live tracking. Remove when a tracking API exists.
  // -------------------------------------------------------------------------
  previewNextStatus(parcel: ParcelRecord): ParcelRecord {
    const idx = PARCEL_STATUS_STEPS.findIndex((s) => s.status === parcel.status);
    const next = PARCEL_STATUS_STEPS[idx + 1];
    if (!next) return parcel;
    const now = new Date().toISOString();
    const partner: ParcelPartner | null =
      next.status === 'REQUESTED' ? null : parcel.deliveryPartner ?? { name: 'Sample partner (demo)' };
    return {
      ...parcel,
      status: next.status,
      deliveryPartner: partner,
      statusHistory: [...parcel.statusHistory, { status: next.status, at: now }],
      updatedAt: now,
    };
  },
};
