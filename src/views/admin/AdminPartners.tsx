import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { Partner } from '../../types';
import { Bike, Search, ShieldCheck, Star, Phone, CheckCircle2, XCircle } from 'lucide-react';

export const AdminPartners: React.FC = () => {
  const { partners, togglePartnerOnline } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline'>('all');

  const filtered = partners.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm) ||
      p.vehicle.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'online') return matchesSearch && p.isOnline;
    if (statusFilter === 'offline') return matchesSearch && !p.isOnline;
    return matchesSearch;
  });

  return (
    <div className="space-y-5 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-neutral-900">Delivery Fleet Partners</h2>
          <p className="text-xs text-neutral-500">
            Monitor verified riders, live availability, rating and today's earnings
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-neutral-600 bg-white px-3.5 py-2 rounded-xl border border-neutral-200 shadow-2xs">
            Fleet Size: <strong className="text-neutral-900">{partners.length} Riders</strong>
          </span>
        </div>
      </div>

      {/* Search & Filter bar */}
      <div className="bg-white rounded-3xl p-4 border border-neutral-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search partners by name, phone or vehicle model..."
            className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl py-2 pl-9 pr-4 text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:border-[#FF6B35]"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-1.5">
          {[
            { id: 'all', label: 'All Fleet' },
            { id: 'online', label: 'Online Only' },
            { id: 'offline', label: 'Offline' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setStatusFilter(item.id as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                statusFilter === item.id
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fleet Table */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Delivery Partner</th>
                <th className="py-3.5 px-6">Vehicle</th>
                <th className="py-3.5 px-6">Duty Status</th>
                <th className="py-3.5 px-6">Rating</th>
                <th className="py-3.5 px-6">KYC Status</th>
                <th className="py-3.5 px-6">Today's Earnings</th>
                <th className="py-3.5 px-6">Total Trips</th>
                <th className="py-3.5 px-6 text-right">Toggle Duty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((partner) => (
                <tr key={partner.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl overflow-hidden border border-neutral-200 shrink-0">
                        <img
                          src={partner.avatar}
                          alt={partner.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-neutral-900">{partner.name}</div>
                        <div className="text-[10px] font-mono text-neutral-400">{partner.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-6 font-medium text-neutral-800">{partner.vehicle}</td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        partner.isOnline
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          partner.isOnline ? 'bg-green-500 animate-pulse' : 'bg-neutral-400'
                        }`}
                      />
                      {partner.isOnline ? 'ONLINE' : 'OFFLINE'}
                    </span>
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="font-bold text-amber-600 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{partner.rating}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200 flex items-center gap-1 w-fit">
                      <ShieldCheck className="w-3 h-3" /> VERIFIED
                    </span>
                  </td>
                  <td className="py-3.5 px-6 font-extrabold text-neutral-900">
                    ₹{(partner.todayEarnings ?? partner.earningsToday ?? 0).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-6 font-semibold text-neutral-700">
                    {partner.totalDeliveries}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => togglePartnerOnline(partner.id)}
                      className={`text-[11px] font-bold px-3 py-1 rounded-lg border transition-colors ${
                        partner.isOnline
                          ? 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                          : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                      }`}
                    >
                      {partner.isOnline ? 'Force Offline' : 'Set Online'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
