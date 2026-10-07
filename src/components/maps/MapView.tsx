import React, { useState } from 'react';
import { LocationCoord, PartnerLocation } from '../../types';
import { Navigation, MapPin, Compass, ZoomIn, ZoomOut, Layers } from 'lucide-react';

export interface MapMarker {
  id: string;
  label: string;
  type: 'pickup' | 'destination' | 'partner' | 'hub';
  x: number;
  y: number;
  partnerInfo?: {
    name: string;
    vehicle: string;
    isOnline: boolean;
    statusText?: string;
  };
}

interface MapViewProps {
  pickup?: LocationCoord | null;
  destination?: LocationCoord | null;
  partnerLocation?: PartnerLocation | null;
  partnerName?: string;
  partnerVehicle?: string;
  multiplePartners?: {
    id: string;
    name: string;
    vehicle: string;
    x: number;
    y: number;
    heading: number;
    isOnline: boolean;
    statusText?: string;
    orderId?: string;
  }[];
  interactive?: boolean;
  heightClass?: string;
  showDetailsOverlay?: boolean;
  distanceKm?: number;
  etaMin?: number;
  onPartnerClick?: (partnerId: string) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  pickup,
  destination,
  partnerLocation,
  partnerName = 'Amit Kumar',
  partnerVehicle = 'Honda Activa',
  multiplePartners = [],
  interactive = true,
  heightClass = 'h-80 md:h-96',
  showDetailsOverlay = true,
  distanceKm,
  etaMin,
  onPartnerClick,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeLayer, setActiveLayer] = useState<'standard' | 'traffic'>('traffic');

  // Dynamic route calculation between pickup and destination
  const hasRoute = pickup && destination;

  // Path coordinates
  const pX = pickup ? pickup.x : 25;
  const pY = pickup ? pickup.y : 75;
  const dX = destination ? destination.x : 75;
  const dY = destination ? destination.y : 25;

  // Mid-point curvature for smooth road routing
  const midX = (pX + dX) / 2 + (pY > dY ? -4 : 4);
  const midY = (pY + dY) / 2 + (pX > dX ? 4 : -4);

  // SVG route path
  const routePathD = `M ${pX} ${pY} Q ${midX} ${midY} ${dX} ${dY}`;

  // Current partner position
  const riderX = partnerLocation ? partnerLocation.x : pX + (dX - pX) * 0.45;
  const riderY = partnerLocation ? partnerLocation.y : pY + (dY - pY) * 0.45;
  const riderHeading = partnerLocation ? partnerLocation.heading : 45;

  return (
    <div
      id="quickgo-map-container"
      className={`relative w-full ${heightClass} map-bg overflow-hidden rounded-3xl border border-neutral-200 select-none shadow-card`}
    >
      {/* SVG Canvas for Map */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full transform transition-transform duration-300"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        <defs>
          {/* Background Grid Pattern */}
          <pattern id="city-grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <rect width="10" height="10" fill="#F4F6F9" />
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#E5E9F0" strokeWidth="0.3" />
          </pattern>

          {/* Urban Parks */}
          <pattern id="park-pattern" width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill="#E2F0D9" />
            <circle cx="3" cy="3" r="1" fill="#C8E6C9" opacity="0.6" />
          </pattern>

          {/* Route Glow / Gradient */}
          <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#B91C1C" />
          </linearGradient>

          {/* Partner pulse filter */}
          <filter id="glow-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* Base Land */}
        <rect width="100" height="100" fill="url(#city-grid)" />

        {/* Green Parks / Landscaping Zones */}
        <path d="M 5 5 L 20 5 L 18 22 L 8 20 Z" fill="url(#park-pattern)" rx="2" />
        <path d="M 60 70 L 90 72 L 85 92 L 65 90 Z" fill="url(#park-pattern)" />
        <path d="M 45 40 L 58 38 L 56 48 L 43 49 Z" fill="url(#park-pattern)" />

        {/* Hindon Canal / Water Body */}
        <path
          d="M 98 0 C 90 25, 82 45, 95 70 C 98 85, 96 100, 95 100"
          fill="none"
          stroke="#CFE2FE"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* City Expressways & Major Arterial Roads */}
        {/* Noida Expressway Diagonal */}
        <line x1="0" y1="10" x2="100" y2="85" stroke="#FFFFFF" strokeWidth="4.5" />
        <line x1="0" y1="10" x2="100" y2="85" stroke="#D1D5DB" strokeWidth="0.6" strokeDasharray="1.5 1.5" />

        {/* DND Flyway & Sector Link Roads */}
        <line x1="0" y1="65" x2="100" y2="65" stroke="#FFFFFF" strokeWidth="3.5" />
        <line x1="20" y1="0" x2="20" y2="100" stroke="#FFFFFF" strokeWidth="3" />
        <line x1="45" y1="0" x2="45" y2="100" stroke="#FFFFFF" strokeWidth="3" />
        <line x1="75" y1="0" x2="75" y2="100" stroke="#FFFFFF" strokeWidth="3.2" />
        <line x1="0" y1="25" x2="100" y2="25" stroke="#FFFFFF" strokeWidth="3.2" />
        <line x1="0" y1="42" x2="75" y2="42" stroke="#FFFFFF" strokeWidth="2.5" />
        <line x1="0" y1="85" x2="100" y2="85" stroke="#FFFFFF" strokeWidth="2.8" />

        {/* Secondary Neighborhood Streets */}
        <line x1="10" y1="25" x2="10" y2="65" stroke="#F1F3F5" strokeWidth="1.8" />
        <line x1="32" y1="0" x2="32" y2="65" stroke="#F1F3F5" strokeWidth="1.8" />
        <line x1="60" y1="25" x2="60" y2="100" stroke="#F1F3F5" strokeWidth="1.8" />
        <line x1="20" y1="52" x2="75" y2="52" stroke="#F1F3F5" strokeWidth="1.8" />
        <line x1="45" y1="12" x2="90" y2="12" stroke="#F1F3F5" strokeWidth="1.8" />

        {/* Live Traffic Overlay (Soft Green/Orange road tints) */}
        {activeLayer === 'traffic' && (
          <>
            <line x1="0" y1="10" x2="60" y2="55" stroke="#22C55E" strokeWidth="1.2" opacity="0.6" />
            <line x1="60" y1="55" x2="100" y2="85" stroke="#F59E0B" strokeWidth="1.2" opacity="0.7" />
            <line x1="20" y1="25" x2="20" y2="65" stroke="#22C55E" strokeWidth="1.2" opacity="0.6" />
            <line x1="45" y1="25" x2="75" y2="25" stroke="#F59E0B" strokeWidth="1.2" opacity="0.7" />
          </>
        )}

        {/* City Sector Landmark Labels */}
        <text x="76" y="22" fill="#9CA3AF" fontSize="2.2" fontWeight="600" letterSpacing="0.05em">SEC 62</text>
        <text x="36" y="68" fill="#9CA3AF" fontSize="2.2" fontWeight="600" letterSpacing="0.05em">SEC 18</text>
        <text x="21" y="58" fill="#9CA3AF" fontSize="2.2" fontWeight="600" letterSpacing="0.05em">SEC 15</text>
        <text x="82" y="13" fill="#9CA3AF" fontSize="2.2" fontWeight="600" letterSpacing="0.05em">INDIRAPURAM</text>
        <text x="48" y="16" fill="#9CA3AF" fontSize="2.2" fontWeight="600" letterSpacing="0.05em">VAISHALI</text>
        <text x="78" y="86" fill="#9CA3AF" fontSize="2.2" fontWeight="600" letterSpacing="0.05em">SEC 128</text>

        {/* Active Route Path */}
        {hasRoute && (
          <>
            {/* Route Under-Glow */}
            <path
              d={routePathD}
              fill="none"
              stroke="#DC2626"
              strokeWidth="3.2"
              strokeOpacity="0.25"
              strokeLinecap="round"
            />
            {/* Main Crisp Route Line */}
            <path
              d={routePathD}
              fill="none"
              stroke="url(#route-gradient)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeDasharray="0.1 0"
            />
            {/* Animated Trajectory Dashes */}
            <path
              d={routePathD}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeDasharray="1.2 2.4"
              className="animate-[dash_1.5s_linear_infinite]"
            />
          </>
        )}

        {/* Pickup Marker (Red Ring & Dot) */}
        {pickup && (
          <g transform={`translate(${pX}, ${pY})`} className="cursor-pointer">
            <circle r="4" fill="#DC2626" opacity="0.2" className="pulse-ring" />
            <circle r="2.2" fill="#DC2626" stroke="#FFFFFF" strokeWidth="0.6" filter="url(#glow-shadow)" />
            <circle r="0.8" fill="#FFFFFF" />
            <g transform="translate(0, -3.8)">
              <rect x="-8" y="-3.2" width="16" height="3" rx="0.8" fill="#171717" opacity="0.9" />
              <text x="0" y="-1.2" fill="#FFFFFF" fontSize="1.6" fontWeight="700" textAnchor="middle">
                PICKUP
              </text>
            </g>
          </g>
        )}

        {/* Destination Marker (Green Pin) */}
        {destination && (
          <g transform={`translate(${dX}, ${dY})`} className="cursor-pointer">
            <circle r="4" fill="#16A34A" opacity="0.2" className="pulse-ring" />
            <circle r="2.2" fill="#16A34A" stroke="#FFFFFF" strokeWidth="0.6" filter="url(#glow-shadow)" />
            <circle r="0.8" fill="#FFFFFF" />
            <g transform="translate(0, -3.8)">
              <rect x="-9" y="-3.2" width="18" height="3" rx="0.8" fill="#16A34A" />
              <text x="0" y="-1.2" fill="#FFFFFF" fontSize="1.6" fontWeight="700" textAnchor="middle">
                DROP-OFF
              </text>
            </g>
          </g>
        )}

        {/* Single Active Partner Marker (Moving Scooter with Heading) */}
        {(partnerLocation || hasRoute) && multiplePartners.length === 0 && (
          <g
            transform={`translate(${riderX}, ${riderY})`}
            className="transition-all duration-1000 ease-linear cursor-pointer"
            filter="url(#glow-shadow)"
          >
            {/* Dynamic radar wave */}
            <circle r="4.5" fill="#DC2626" opacity="0.25" className="pulse-ring" />

            {/* Scooter Badge */}
            <circle r="2.8" fill="#171717" stroke="#DC2626" strokeWidth="0.8" />

            {/* Scooter Icon rotated by heading */}
            <g transform={`rotate(${riderHeading})`}>
              <path
                d="M 0 -1.6 L 1.2 1.2 L 0 0.6 L -1.2 1.2 Z"
                fill="#DC2626"
              />
            </g>

            {/* Partner Name Tag Pill */}
            <g transform="translate(0, 4.2)">
              <rect
                x="-11"
                y="0"
                width="22"
                height="3.6"
                rx="1"
                fill="#FFFFFF"
                stroke="#E5E7EB"
                strokeWidth="0.3"
              />
              <text x="0" y="2.5" fill="#171717" fontSize="1.7" fontWeight="700" textAnchor="middle">
                🛵 {partnerName.split(' ')[0]}
              </text>
            </g>
          </g>
        )}

        {/* Multi-Partner Markers for Admin Live Map */}
        {multiplePartners.map((partner) => (
          <g
            key={partner.id}
            transform={`translate(${partner.x}, ${partner.y})`}
            onClick={() => onPartnerClick && onPartnerClick(partner.id)}
            className="cursor-pointer hover:scale-125 transition-transform duration-200"
            filter="url(#glow-shadow)"
          >
            <circle
              r="3.2"
              fill={partner.isOnline ? '#DC2626' : '#9CA3AF'}
              stroke="#FFFFFF"
              strokeWidth="0.8"
            />
            {partner.isOnline && (
              <circle r="5" fill="#DC2626" opacity="0.2" className="pulse-ring" />
            )}
            <g transform={`rotate(${partner.heading || 0})`}>
              <path d="M 0 -1.5 L 1 1 L 0 0.5 L -1 1 Z" fill="#FFFFFF" />
            </g>
            <g transform="translate(0, 4.2)">
              <rect
                x="-12"
                y="0"
                width="24"
                height="3.4"
                rx="0.8"
                fill="#FFFFFF"
                stroke="#E5E7EB"
                strokeWidth="0.3"
              />
              <text x="0" y="2.3" fill="#171717" fontSize="1.6" fontWeight="700" textAnchor="middle">
                🛵 {partner.name.split(' ')[0]}
              </text>
            </g>
          </g>
        ))}
      </svg>

      {/* Map Floating Controls */}
      {interactive && (
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <button
            id="map-btn-traffic"
            title="Toggle Traffic"
            onClick={() => setActiveLayer((prev) => (prev === 'traffic' ? 'standard' : 'traffic'))}
            className={`p-2 rounded-xl text-xs font-semibold shadow-sm border transition-colors ${
              activeLayer === 'traffic'
                ? 'bg-red-600 text-white border-red-700'
                : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>
          <div className="flex flex-col rounded-xl overflow-hidden bg-white border border-neutral-200 shadow-sm">
            <button
              id="map-btn-zoom-in"
              title="Zoom In"
              onClick={() => setZoomLevel((z) => Math.min(1.6, z + 0.2))}
              className="p-2 text-neutral-700 hover:bg-neutral-100 border-b border-neutral-200 transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              id="map-btn-zoom-out"
              title="Zoom Out"
              onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
              className="p-2 text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Live Navigation Overlay Badge */}
      {showDetailsOverlay && hasRoute && (
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm border border-neutral-200 rounded-xl px-3.5 py-2 shadow-sm flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-red-600">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
            LIVE GPS
          </div>
          <span className="w-px h-3.5 bg-neutral-200" />
          <div className="text-neutral-700 font-medium">
            <span className="text-neutral-500">Distance:</span>{' '}
            <strong className="text-neutral-900">{distanceKm || 7.4} km</strong>
          </div>
          <span className="w-px h-3.5 bg-neutral-200" />
          <div className="text-neutral-700 font-medium">
            <span className="text-neutral-500">ETA:</span>{' '}
            <strong className="text-neutral-900">{etaMin || 8} min</strong>
          </div>
        </div>
      )}

      {/* Simulated GPS Watermark Badge */}
      <div className="absolute bottom-2 right-3 text-[10px] text-neutral-400 font-mono tracking-tight bg-white/80 px-2 py-0.5 rounded border border-neutral-200/60 pointer-events-none">
        QuickGo Vector Map Engine • Noida / NCR Zone
      </div>
    </div>
  );
};
