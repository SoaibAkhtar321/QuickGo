import type { LocationCoord, PricingBreakdown } from './index';

/**
 * Parcel domain model (frontend-safe, backend-ready).
 *
 * A Parcel is deliberately NOT an `Order`: it has no Business, no items and
 * no store lifecycle. It is Sender -> QuickGo -> Delivery Partner -> Recipient.
 * The recipient is a plain contact record; they never need a QuickGo account.
 */

export type ParcelSize = 'small' | 'medium' | 'large';

/** Lifecycle shown to the customer. Values are UI-level, not backend contracts. */
export type ParcelStatus =
  | 'REQUESTED'
  | 'PARTNER_ASSIGNED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'NEAR_RECIPIENT'
  | 'DELIVERED';

export interface ParcelContact {
  name: string;
  /** Normalised 10-digit Indian mobile number (no country code). */
  phone: string;
}

export interface ParcelPoint {
  contact: ParcelContact;
  /** Free-text street / building address typed by the customer. */
  address: string;
  /** Instructions for the delivery partner at this point. */
  instructions?: string;
  /**
   * Serviceable area. Reuses the existing `LocationCoord` (same type the generic
   * delivery flow and `pricingService` use) so distance can be estimated without
   * inventing geocoding. A real backend would replace this with geocoded coordinates.
   */
  location: LocationCoord;
}

export interface ParcelDetails {
  category: string;
  weightLabel: string;
  size: ParcelSize;
  description?: string;
}

export interface ParcelPartner {
  name: string;
  phone?: string;
  vehicle?: string;
}

export interface ParcelStatusEvent {
  status: ParcelStatus;
  /** ISO timestamp. */
  at: string;
}

export interface ParcelDraft {
  pickup: ParcelPoint;
  recipient: ParcelPoint;
  details: ParcelDetails;
}

export interface ParcelEstimate {
  pricing: PricingBreakdown;
  estimatedMinutes: number;
  /** Always true until a backend pricing service replaces the mock one. */
  isEstimate: true;
  /** Where the numbers came from, so the UI can be honest about it. */
  source: 'mock-pricing-service' | 'backend';
}

export interface ParcelRecord {
  id: string;
  sender: ParcelContact;
  pickup: ParcelPoint;
  recipient: ParcelPoint;
  details: ParcelDetails;
  deliveryPartner: ParcelPartner | null;
  status: ParcelStatus;
  pricing: PricingBreakdown;
  passApplied: boolean;
  statusHistory: ParcelStatusEvent[];
  createdAt: string;
  updatedAt: string;
  /** True while parcels exist only in frontend state. Backend records must set this to false. */
  isMock: boolean;
}
