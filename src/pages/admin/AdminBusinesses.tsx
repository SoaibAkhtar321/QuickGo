import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { Business } from '../../types';
import {
  Store,
  Search,
  CheckCircle2,
  XCircle,
  Plus,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  Tag,
  ShieldCheck,
  X,
} from 'lucide-react';

export const AdminBusinesses: React.FC = () => {
  const { businesses, registerBusiness, updateBusinessStatus } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for adding business
  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [category, setCategory] = useState('Restaurant & Cafe');
  const [phone, setPhone] = useState('+91 98');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('Sector 62, Noida');

  const filtered = businesses.filter((b) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.name.toLowerCase().includes(q) ||
        b.ownerName.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    registerBusiness({
      name: name.trim(),
      ownerName: ownerName.trim() || 'Store Owner',
      category,
      phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@quickgo.in`,
      address,
    });

    setName('');
    setOwnerName('');
    setEmail('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-neutral-900">
            Registered Businesses & Merchants
          </h1>
          <p className="text-xs text-neutral-500 font-medium">
            Manage stores, restaurants, pharmacies and retail merchants directly plugged into QuickGo
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#FF6B35] hover:bg-[#E85A2A] text-white px-4 py-2.5 rounded-2xl text-xs font-black shadow-md shadow-[#FF6B35]/25 flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard New Merchant</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-neutral-400 block">Total Merchants</span>
          <div className="text-2xl font-black text-neutral-900 mt-0.5">{businesses.length}</div>
          <p className="text-[11px] text-green-600 font-bold mt-1">100% Direct Integration</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-neutral-400 block">Active Outlets</span>
          <div className="text-2xl font-black text-green-600 mt-0.5">
            {businesses.filter((b) => b.status === 'ACTIVE').length}
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Accepting live delivery orders</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-neutral-400 block">Total Orders Handled</span>
          <div className="text-2xl font-black text-neutral-900 mt-0.5">
            {businesses.reduce((sum, b) => sum + b.totalOrders, 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Fulfilled via QuickGo riders</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-neutral-400 block">Avg. Commission</span>
          <div className="text-2xl font-black text-[#FF6B35] mt-0.5">5.0%</div>
          <p className="text-[11px] text-neutral-500 mt-1">Platform take-rate</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-neutral-200 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by store name, owner, or category..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#FF6B35]"
          />
        </div>
      </div>

      {/* Businesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((biz) => (
          <div
            key={biz.id}
            className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl overflow-hidden border border-neutral-200 shrink-0">
                  <img
                    src={biz.avatar}
                    alt={biz.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-black text-neutral-900">{biz.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-black uppercase text-[#FF6B35] bg-orange-50 px-2 py-0.5 rounded">
                      {biz.category}
                    </span>
                    <span className="text-xs text-amber-500 font-bold">⭐ {biz.rating}</span>
                  </div>
                </div>
              </div>

              <span
                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                  biz.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {biz.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-100 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Owner</span>
                <span className="font-bold text-neutral-900">{biz.ownerName}</span>
                <span className="text-[10px] text-neutral-500 font-mono block truncate">{biz.phone}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Orders / GMV</span>
                <span className="font-black text-neutral-900">{biz.totalOrders} runs</span>
                <span className="text-[10px] text-green-700 font-bold block">
                  ₹{biz.revenueTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs text-neutral-500">
              <div className="truncate max-w-[200px]">
                <MapPin className="w-3.5 h-3.5 inline text-neutral-400 mr-1" />
                <span>{biz.address}</span>
              </div>

              <button
                onClick={() =>
                  updateBusinessStatus(
                    biz.id,
                    biz.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
                  )
                }
                className="text-xs font-bold text-neutral-700 hover:text-neutral-900 underline"
              >
                {biz.status === 'ACTIVE' ? 'Suspend Outlet' : 'Activate Outlet'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Onboard Merchant Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-neutral-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-base font-black text-neutral-900">Onboard New Merchant</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-neutral-700">Business / Store Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Royal Punjab Kitchen"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:border-[#FF6B35]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-700">Owner Name</label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Owner Full Name"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-700">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:border-[#FF6B35]"
                  >
                    <option value="Restaurant & Cafe">Restaurant & Cafe</option>
                    <option value="Pharmacy & Healthcare">Pharmacy & Healthcare</option>
                    <option value="Grocery & Fresh Produce">Grocery & Fresh</option>
                    <option value="Bakery & Desserts">Bakery & Desserts</option>
                    <option value="Retail & Electronics">Retail & Electronics</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-700">Phone</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:border-[#FF6B35]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-700">Address / Location</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:border-[#FF6B35]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-neutral-600 hover:bg-neutral-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FF6B35] hover:bg-[#E85A2A] text-white font-black"
                >
                  Register Merchant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
