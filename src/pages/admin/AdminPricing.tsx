import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import {
  DollarSign,
  TrendingUp,
  Zap,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export const AdminPricing: React.FC = () => {
  const { services, updateService } = useApp();

  const [platformFee, setPlatformFee] = useState(10);
  const [surgeMultiplier, setSurgeMultiplier] = useState(1.0);
  const [surgeActive, setSurgeActive] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Local editable copies of services
  const [editableServices, setEditableServices] = useState(services);

  const handlePriceChange = (id: string, field: 'baseFare' | 'perKm' | 'minimumFare', val: number) => {
    setEditableServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: val } : s))
    );
  };

  const handleSaveAllPricing = () => {
    editableServices.forEach((s) => {
      updateService(s);
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Simulated 7.4 km Quote Demo
  const sampleService = editableServices[0];
  const sampleDistance = 7.4;
  const rawSubtotal = sampleService.baseFare + Math.round(sampleDistance * sampleService.perKm) + platformFee;
  const surgedSubtotal = surgeActive ? Math.round(rawSubtotal * surgeMultiplier) : rawSubtotal;
  const sampleTax = Math.round(surgedSubtotal * 0.05);
  const sampleTotal = surgedSubtotal + sampleTax;

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-neutral-900">
            Pricing Engine & Dynamic Surge
          </h2>
          <p className="text-xs text-neutral-500">
            Configure baseline fares, per-km rates, and live peak hour surge multipliers
          </p>
        </div>

        <button
          onClick={handleSaveAllPricing}
          className="bg-[#FF6B35] hover:bg-[#E85A2A] text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-md shadow-[#FF6B35]/20 flex items-center gap-2 transition-all active:scale-95"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Apply Pricing Updates</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-green-50 rounded-2xl border border-green-200 text-green-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span>Pricing rules updated successfully! Customer quotes are now using the new rates.</span>
        </div>
      )}

      {/* Surge Pricing & Global Platform Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Dynamic Surge Card */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF2EB] text-[#FF6B35] flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-neutral-900">Dynamic Surge Multiplier</h3>
                <p className="text-xs text-neutral-500">Peak hours / Bad weather surcharge</p>
              </div>
            </div>

            <button
              onClick={() => setSurgeActive(!surgeActive)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                surgeActive
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-neutral-100 text-neutral-600 border-neutral-200'
              }`}
            >
              {surgeActive ? 'SURGE ACTIVE' : 'STANDARD'}
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-neutral-700">
              <span>Surge Factor</span>
              <span className="text-[#FF6B35] font-extrabold text-sm">
                {surgeMultiplier.toFixed(2)}x
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="2.5"
              step="0.05"
              value={surgeMultiplier}
              onChange={(e) => setSurgeMultiplier(parseFloat(e.target.value))}
              disabled={!surgeActive}
              className="w-full accent-[#FF6B35] cursor-pointer disabled:opacity-50"
            />
            <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
              <span>1.0x (Normal)</span>
              <span>1.5x (Rain)</span>
              <span>2.5x (Extreme Peak)</span>
            </div>
          </div>
        </div>

        {/* Global Commission & Tax */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-800 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-neutral-900">Platform Fee & GST Rules</h3>
              <p className="text-xs text-neutral-500">Fixed convenience fee & statutory taxes</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-neutral-700">Platform Fee (₹)</label>
              <input
                type="number"
                value={platformFee}
                onChange={(e) => setPlatformFee(Number(e.target.value))}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 font-bold text-neutral-900 focus:bg-white focus:outline-none focus:border-[#FF6B35]"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-neutral-700">Statutory GST</label>
              <div className="w-full bg-neutral-100 border border-neutral-200 rounded-xl p-2.5 font-bold text-neutral-600">
                5% (Standard)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service-by-Service Pricing Matrix Table */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-neutral-200">
          <h3 className="text-sm font-extrabold text-neutral-900">
            Per-Service Rate Matrix Configurator
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Adjust individual base fares and kilometer multipliers
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Service Category</th>
                <th className="py-3.5 px-6">Base Fare (₹)</th>
                <th className="py-3.5 px-6">Rate Per KM (₹)</th>
                <th className="py-3.5 px-6">Minimum Fare (₹)</th>
                <th className="py-3.5 px-6">Calculated 5 KM Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {editableServices.map((service) => {
                const testTotal = Math.round(
                  (service.baseFare + 5 * service.perKm + platformFee) * (surgeActive ? surgeMultiplier : 1) * 1.05
                );
                return (
                  <tr key={service.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-neutral-900">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{service.icon}</span>
                        <span>{service.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-6">
                      <input
                        type="number"
                        value={service.baseFare}
                        onChange={(e) =>
                          handlePriceChange(service.id, 'baseFare', Number(e.target.value))
                        }
                        className="w-24 bg-neutral-50 border border-neutral-200 rounded-lg p-1.5 font-bold text-neutral-900 focus:bg-white focus:outline-none focus:border-[#FF6B35]"
                      />
                    </td>
                    <td className="py-3.5 px-6">
                      <input
                        type="number"
                        value={service.perKm}
                        onChange={(e) =>
                          handlePriceChange(service.id, 'perKm', Number(e.target.value))
                        }
                        className="w-24 bg-neutral-50 border border-neutral-200 rounded-lg p-1.5 font-bold text-neutral-900 focus:bg-white focus:outline-none focus:border-[#FF6B35]"
                      />
                    </td>
                    <td className="py-3.5 px-6">
                      <input
                        type="number"
                        value={service.minimumFare}
                        onChange={(e) =>
                          handlePriceChange(service.id, 'minimumFare', Number(e.target.value))
                        }
                        className="w-24 bg-neutral-50 border border-neutral-200 rounded-lg p-1.5 font-bold text-neutral-900 focus:bg-white focus:outline-none focus:border-[#FF6B35]"
                      />
                    </td>
                    <td className="py-3.5 px-6 font-extrabold text-[#FF6B35]">
                      ₹{testTotal}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Quote Simulator Box */}
      <div className="bg-[#FFF9F5] border border-[#FF6B35]/25 rounded-3xl p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF6B35]" />
            <h4 className="text-xs font-extrabold text-[#E85A2A] uppercase tracking-wider">
              Formula Simulator (7.4 KM Sample)
            </h4>
          </div>
          <span className="text-xs font-bold text-neutral-700 font-mono">
            {sampleService.name}
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-neutral-200 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div>
            <span className="text-neutral-400 block text-[10px]">Base Fare</span>
            <strong className="text-neutral-900">₹{sampleService.baseFare}</strong>
          </div>
          <span className="text-neutral-400 font-bold">+</span>
          <div>
            <span className="text-neutral-400 block text-[10px]">7.4 km × ₹{sampleService.perKm}</span>
            <strong className="text-neutral-900">₹{Math.round(sampleDistance * sampleService.perKm)}</strong>
          </div>
          <span className="text-neutral-400 font-bold">+</span>
          <div>
            <span className="text-neutral-400 block text-[10px]">Platform Fee</span>
            <strong className="text-neutral-900">₹{platformFee}</strong>
          </div>
          <span className="text-neutral-400 font-bold">+</span>
          <div>
            <span className="text-neutral-400 block text-[10px]">5% GST</span>
            <strong className="text-neutral-900">₹{sampleTax}</strong>
          </div>
          <span className="text-neutral-400 font-bold">=</span>
          <div>
            <span className="text-neutral-400 block text-[10px]">Total Customer Fare</span>
            <strong className="text-lg font-extrabold text-[#FF6B35]">₹{sampleTotal}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
