import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import {
  Store,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
} from 'lucide-react';

export const BusinessProfile: React.FC = () => {
  const { currentBusiness, toggleBusinessAutoDispatch, setRole } = useApp();
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      {/* Profile Banner */}
      <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-18 h-18 rounded-2xl overflow-hidden border-2 border-[#FF6B35] shadow-xs shrink-0">
            <img
              src={currentBusiness.avatar}
              alt={currentBusiness.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-neutral-900">{currentBusiness.name}</h2>
              <span className="text-[10px] font-black text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
                VERIFIED MERCHANT
              </span>
            </div>
            <p className="text-xs text-neutral-500 font-medium mt-0.5">
              {currentBusiness.category} • Operated by {currentBusiness.ownerName}
            </p>
            <div className="text-[11px] text-neutral-400 font-mono mt-1">
              {currentBusiness.phone} • {currentBusiness.email}
            </div>
          </div>
        </div>

        <button
          onClick={() => setRole('customer')}
          className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-black px-4 py-2.5 rounded-xl transition-all shadow-xs self-start sm:self-auto"
        >
          View as Customer →
        </button>
      </div>

      {saved && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-2xl text-green-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          <span>Store settings and dispatch rules saved successfully.</span>
        </div>
      )}

      {/* Two-Column Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left Column: Business & Logistics Config */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4 text-xs">
          <h3 className="text-xs font-black text-neutral-500 uppercase tracking-wider">
            Automated Delivery Dispatch Rules
          </h3>

          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-between">
            <div className="space-y-0.5 pr-3">
              <div className="font-black text-neutral-900">Auto-Dispatch Delivery Partner</div>
              <p className="text-neutral-500 text-[11px]">
                Instantly broadcast new customer orders to nearby QuickGo riders without manual confirmation.
              </p>
            </div>
            <button
              onClick={() => toggleBusinessAutoDispatch(currentBusiness.id)}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                currentBusiness.autoDispatch ? 'bg-[#FF6B35]' : 'bg-neutral-300'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  currentBusiness.autoDispatch ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <span className="text-neutral-500 block">Registered Store Address</span>
              <strong className="text-neutral-900 block mt-0.5">{currentBusiness.address}</strong>
            </div>

            <div className="pt-2 border-t border-neutral-100">
              <span className="text-neutral-500 block">GST Identification Number</span>
              <span className="font-mono font-bold text-neutral-900 block mt-0.5">
                {currentBusiness.gstNumber || '07AAACG1234A1Z1'}
              </span>
            </div>

            <div className="pt-2 border-t border-neutral-100">
              <span className="text-neutral-500 block">Average Food / Order Prep Time</span>
              <strong className="text-neutral-900 block mt-0.5">15 minutes</strong>
            </div>
          </div>
        </div>

        {/* Right Column: Operating Hours & Direct QuickGo Support */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4 text-xs">
            <h3 className="text-xs font-black text-neutral-500 uppercase tracking-wider">
              Operating Schedule & Hours
            </h3>

            <div className="space-y-2.5 divide-y divide-neutral-100">
              <div className="flex justify-between py-1">
                <span className="text-neutral-600">Monday - Friday</span>
                <strong className="text-neutral-900">08:00 AM - 11:30 PM</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-600">Saturday & Sunday</span>
                <strong className="text-neutral-900">08:00 AM - 01:00 AM</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-600">Monsoon Weather Buffer</span>
                <strong className="text-green-600 font-bold">Enabled (+5 min)</strong>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-3 text-xs">
            <h3 className="text-xs font-black text-neutral-500 uppercase tracking-wider">
              Merchant Agreement & KYC
            </h3>

            <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-2xl border border-green-200">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Commercial Merchant Agreement Active (5% Platform Fee Plan)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
