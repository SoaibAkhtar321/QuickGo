import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { Settings, ShieldCheck, MapPin, Phone, RotateCcw, CheckCircle2 } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { resetDemoData } = useApp();
  const [appName, setAppName] = useState('QuickGo Logistics');
  const [supportPhone, setSupportPhone] = useState('1800-QUICKGO');
  const [supportEmail, setSupportEmail] = useState('help@quickgo.in');
  const [saved, setSaved] = useState(false);

  const [activeCities, setActiveCities] = useState([
    { name: 'Noida (Sector 18, 62, 128)', active: true },
    { name: 'Greater Noida & Knowledge Park', active: true },
    { name: 'Ghaziabad (Indirapuram, Vaishali)', active: true },
    { name: 'Delhi (East & South Zones)', active: true },
    { name: 'Gurugram (Cyber City, Golf Course)', active: false },
  ]);

  const toggleCity = (index: number) => {
    setActiveCities((prev) =>
      prev.map((c, i) => (i === index ? { ...c, active: !c.active } : c))
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 text-left max-w-4xl">
      <div>
        <h2 className="text-xl font-extrabold text-neutral-900">Platform Settings</h2>
        <p className="text-xs text-neutral-500">
          General operational parameters, operational cities, and demo controls
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-green-50 rounded-2xl border border-green-200 text-green-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span>Platform settings updated successfully.</span>
        </div>
      )}

      {/* General Form */}
      <form onSubmit={handleSave} className="space-y-5">
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold text-neutral-900">Brand & Helpline Config</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-neutral-700 font-bold block mb-1">Platform Brand</label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 font-bold text-neutral-900 focus:bg-white focus:outline-none focus:border-[#FF6B35]"
              />
            </div>
            <div>
              <label className="text-neutral-700 font-bold block mb-1">Toll-Free Helpline</label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 font-bold text-neutral-900 focus:bg-white focus:outline-none focus:border-[#FF6B35]"
              />
            </div>
            <div>
              <label className="text-neutral-700 font-bold block mb-1">Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 font-bold text-neutral-900 focus:bg-white focus:outline-none focus:border-[#FF6B35]"
              />
            </div>
          </div>
        </div>

        {/* Operating Geofences & Cities */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold text-neutral-900">
            Active Operating Geofence Zones
          </h3>

          <div className="space-y-2 text-xs">
            {activeCities.map((city, idx) => (
              <div
                key={city.name}
                className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5 font-bold text-neutral-800">
                  <MapPin className="w-4 h-4 text-[#FF6B35]" />
                  <span>{city.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleCity(idx)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                    city.active
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'bg-neutral-200 text-neutral-600'
                  }`}
                >
                  {city.active ? 'ACTIVE' : 'INACTIVE'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#FF6B35] hover:bg-[#E85A2A] text-white text-xs font-bold px-6 py-3 rounded-xl shadow-xs"
        >
          Save Platform Settings
        </button>
      </form>

      {/* Prototype Reset Card */}
      <div className="bg-white rounded-3xl p-6 border border-red-200 shadow-xs flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-neutral-900">Reset Demo State</h4>
          <p className="text-xs text-neutral-500">
            Restore initial simulated deliveries, live partners, and pricing seed data.
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Reset prototype state to initial demo data?')) {
              resetDemoData();
            }
          }}
          className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Application Data</span>
        </button>
      </div>
    </div>
  );
};
