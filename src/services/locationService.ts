import { LocationCoord, PartnerLocation } from '../types';

export interface RoutePoint {
  lat: number;
  lng: number;
  x: number;
  y: number;
}

export const locationService = {
  /**
   * Generates intermediate road-like simulation points between start and end
   */
  generateRoutePoints(start: RoutePoint, end: RoutePoint, stepsCount: number = 20): RoutePoint[] {
    const points: RoutePoint[] = [];

    // Create slightly curved / grid-realistic dogleg points simulating city roads
    const midX = (start.x + end.x) / 2 + (Math.random() - 0.5) * 6;
    const midY = (start.y + end.y) / 2 + (Math.random() - 0.5) * 6;
    const midLat = (start.lat + end.lat) / 2;
    const midLng = (start.lng + end.lng) / 2;

    for (let i = 0; i <= stepsCount; i++) {
      const t = i / stepsCount;
      // Quadratic Bezier interpolation
      const invT = 1 - t;
      const x = invT * invT * start.x + 2 * invT * t * midX + t * t * end.x;
      const y = invT * invT * start.y + 2 * invT * t * midY + t * t * end.y;
      const lat = invT * invT * start.lat + 2 * invT * t * midLat + t * t * end.lat;
      const lng = invT * invT * start.lng + 2 * invT * t * midLng + t * t * end.lng;

      points.push({ lat, lng, x, y });
    }

    return points;
  },

  calculateHeading(from: RoutePoint, to: RoutePoint): number {
    const dy = to.y - from.y;
    const dx = to.x - from.x;
    let theta = Math.atan2(dy, dx) * (180 / Math.PI); // -180 to 180
    theta = theta + 90; // SVG / compass offset
    if (theta < 0) theta += 360;
    return Math.round(theta);
  },

  createPartnerLocation(
    point: RoutePoint,
    heading: number = 0,
    speed: number = 28,
    isMoving: boolean = true
  ): PartnerLocation {
    return {
      lat: point.lat,
      lng: point.lng,
      x: point.x,
      y: point.y,
      heading,
      speed,
      lastUpdated: 'Just now',
      isMoving,
    };
  },

  calculateRemainingDistance(current: RoutePoint, target: LocationCoord): { distanceKm: number; etaMin: number } {
    const dx = target.x - current.x;
    const dy = target.y - current.y;
    const distEuclid = Math.sqrt(dx * dx + dy * dy);
    // 100 map units ~= 12 km
    const distanceKm = Math.max(0.2, Math.round((distEuclid / 100) * 12 * 10) / 10);
    const etaMin = Math.max(1, Math.round(distanceKm * 2.8));
    return { distanceKm, etaMin };
  },
};
