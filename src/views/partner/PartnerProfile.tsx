import React from 'react';
import { useApp } from '../../store/AppContext';
import {
  Bike,
  ShieldCheck,
  Award,
  CreditCard,
  FileCheck,
  Phone,
  ChevronRight,
  UserCheck,
  Building2,
  Calendar,
  AlertCircle,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

export const PartnerProfile: React.FC = () => {
  const { currentPartner, setRole } = useApp();

  return (
    <div className="space-y-6 text-left">
      {/* Profile Banner */}
      <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-18 h-18 rounded-2xl overflow-hidden border-2 border-[#FF6B35] shadow-xs shrink-0">
              <img
                src={currentPartner.avatar}
                alt={currentPartner.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-neutral-900 text-xl">{currentPartner.name}</h3>
              <span className="text-[10px] font-black text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
                KYC VERIFIED RIDER
              </span>
            </div>
            <p className="text-xs text-neutral-500 font-mono mt-0.5">{currentPartner.phone}</p>
            <div className="flex items-center gap-3 text-xs text-neutral-600 mt-1.5 font-medium">
              <span className="text-amber-500 font-bold">⭐ {currentPartner.rating} Rating</span>
              <span>•</span>
              <span>{currentPartner.vehicle}</span>
              <span>•</span>
              <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                QuickGo Direct Fleet
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setRole('customer')}
            className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-black px-4 py-2.5 rounded-xl transition-all shadow-xs"
          >
            Switch to Customer View →
          </button>
        </div>
      </div>

      {/* Two-Column Responsive Desktop Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Vehicle & Identity Verification */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h4 className="text-xs font-black text-neutral-500 uppercase tracking-wider">
                Vehicle Compliance & Documentation
              </h4>
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                All Valid
              </span>
            </div>

            <div className="divide-y divide-neutral-100 space-y-3">
              <div className="flex items-center justify-between pt-1">
                <span className="text-neutral-500">Registered Vehicle</span>
                <span className="font-black text-neutral-900">Honda Activa 6G (Petrol)</span>
              </div>
              <div className="flex items-center justify-between pt-3">
                <span className="text-neutral-500">RTO Registration Plate</span>
                <span className="font-mono font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded">
                  UP 16 AB 1234
                </span>
              </div>
              <div className="flex items-center justify-between pt-3">
                <span className="text-neutral-500">Driving License Number</span>
                <span className="font-mono font-bold text-neutral-900">DL-0420190089123</span>
              </div>
              <div className="flex items-center justify-between pt-3">
                <span className="text-neutral-500">Commercial Vehicle Insurance</span>
                <span className="font-bold text-[#16A34A] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Valid till 14 Nov 2027
                </span>
              </div>
              <div className="flex items-center justify-between pt-3">
                <span className="text-neutral-500">National ID (Aadhaar Card)</span>
                <span className="font-bold text-[#16A34A] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Biometrics Verified (•••• 8912)
                </span>
              </div>
            </div>
          </div>

          {/* Operating Territory */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-3 text-xs">
            <h4 className="text-xs font-black text-neutral-500 uppercase tracking-wider">
              Assigned Operational Territory
            </h4>
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-2">
              <div className="flex items-center gap-2 font-bold text-neutral-900">
                <MapPin className="w-4 h-4 text-[#FF6B35]" />
                <span>Noida Central & Greater Noida Expressway</span>
              </div>
              <p className="text-neutral-500 text-xs">
                Operating sectors: Sector 18, Sector 50, Sector 62, Sector 128, Sector 137.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Banking, Security, & Emergency SOS */}
        <div className="space-y-6">
          {/* Payout Bank Account */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h4 className="text-xs font-black text-neutral-500 uppercase tracking-wider">
                Settlement & Bank Details
              </h4>
              <span className="text-xs font-bold text-[#16A34A]">Daily Automated Payout</span>
            </div>

            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                  🏦
                </div>
                <div>
                  <div className="font-bold text-neutral-900">HDFC Bank Savings A/C</div>
                  <div className="text-neutral-500 text-[11px] font-mono mt-0.5">
                    A/C: •••••••• 4321 • IFSC: HDFC0001234
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                Active
              </span>
            </div>

            <p className="text-[11px] text-neutral-400">
              Trip earnings are credited directly to this bank account every night at 11:59 PM.
            </p>
          </div>

          {/* 24x7 Rider Safety & SOS Support */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-3 text-xs">
            <h4 className="text-xs font-black text-neutral-500 uppercase tracking-wider">
              24x7 Safety & SOS Hotline
            </h4>
            <div className="p-4 bg-red-50 rounded-2xl border border-red-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
                  🆘
                </div>
                <div>
                  <div className="font-black text-red-900">Emergency SOS Dispatch</div>
                  <div className="text-red-700 text-[11px]">Instant live security response</div>
                </div>
              </div>
              <button
                onClick={() => alert('Emergency SOS triggered: QuickGo security response team notified.')}
                className="bg-red-600 hover:bg-red-700 text-white font-black px-3 py-1.5 rounded-xl text-xs"
              >
                Trigger SOS
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
