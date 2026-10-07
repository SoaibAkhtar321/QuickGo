import { LocationCoord, PassPlan, PricingBreakdown, ServiceConfig } from '../types';

export const pricingService = {
  calculateDistanceKm(pickup: LocationCoord, destination: LocationCoord): number {
    const R = 6371; // Earth radius in km
    const dLat = ((destination.lat - pickup.lat) * Math.PI) / 180;
    const dLon = ((destination.lng - pickup.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((pickup.lat * Math.PI) / 180) *
        Math.cos((destination.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = R * c;

    const roadDist = Math.max(1.5, Math.round(dist * 1.35 * 10) / 10);
    return isNaN(roadDist) || roadDist < 1.0 ? 5.4 : roadDist;
  },

  calculateQuote(
    service: ServiceConfig,
    pickup: LocationCoord,
    destination: LocationCoord,
    surgeMultiplier: number = 1.0,
    passPlan?: PassPlan | null
  ): PricingBreakdown {
    const distanceKm = this.calculateDistanceKm(pickup, destination);
    const baseFare = service.baseFare;
    const distanceFare = Math.round(distanceKm * service.perKm);
    let subtotal = Math.max(service.minFare, baseFare + distanceFare);
    let effectiveSurge = surgeMultiplier;

    let platformFee = service.platformFee;
    let passDiscount = 0;

    // Check pass plan eligibility
    const isPassEligible =
      passPlan &&
      (passPlan.allowedServices === 'ALL' || passPlan.allowedServices.includes(service.id));

    if (isPassEligible && passPlan) {
      // Waive surge charge with pass
      effectiveSurge = 1.0;

      if (passPlan.deliveryFeeWaiver) {
        // Waive base fare and distance delivery charge!
        passDiscount += subtotal;
        subtotal = 0;
      }

      if (passPlan.platformFeeWaiver) {
        passDiscount += platformFee;
        platformFee = 0;
      }

      if (passPlan.discountPercent && subtotal > 0) {
        const extraDisc = Math.round((subtotal * passPlan.discountPercent) / 100);
        passDiscount += extraDisc;
        subtotal = Math.max(0, subtotal - extraDisc);
      }
    }

    const surgeAmount = Math.round(subtotal * (effectiveSurge - 1.0));
    const tax = Math.round((subtotal + surgeAmount + platformFee) * service.taxRate);
    const total = Math.max(0, subtotal + surgeAmount + platformFee + tax);
    const estimatedMinutes = Math.max(8, Math.round(distanceKm * service.estimatedTimePerKm));

    return {
      distanceKm,
      baseFare,
      distanceFare,
      platformFee,
      tax,
      surgeMultiplier: effectiveSurge,
      surgeAmount,
      passDiscount: passDiscount > 0 ? passDiscount : undefined,
      total,
      estimatedMinutes,
    };
  },
};
