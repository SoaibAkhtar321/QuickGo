import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { ServiceConfig } from '../../types';
import {
  Layers,
  Edit2,
  PlusCircle,
  CheckCircle2,
  X,
  Package,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

export const AdminServices: React.FC = () => {
  const { services, updateService, addService } = useApp();
  const [editingService, setEditingService] = useState<ServiceConfig | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New service form state
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceTagline, setNewServiceTagline] = useState('');
  const [newServiceDescription, setNewServiceDescription] = useState('');
  const [newServiceBaseFare, setNewServiceBaseFare] = useState(45);
  const [newServicePerKm, setNewServicePerKm] = useState(12);
  const [newServiceMinFare, setNewServiceMinFare] = useState(50);
  const [newServiceIcon, setNewServiceIcon] = useState('📦');

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    updateService(editingService);
    setEditingService(null);
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    addService({
      name: newServiceName,
      icon: newServiceIcon,
      tagline: newServiceTagline || 'Quick and secure local delivery',
      description: newServiceDescription || 'Specialized delivery service.',
      baseFare: Number(newServiceBaseFare),
      perKm: Number(newServicePerKm),
      minimumFare: Number(newServiceMinFare),
      platformFee: 10,
      active: true,
    });

    setShowAddModal(false);
    setNewServiceName('');
    setNewServiceTagline('');
    setNewServiceDescription('');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-neutral-900">Services Catalog</h2>
          <p className="text-xs text-neutral-500">
            Configure delivery categories, pricing parameters, and active platform visibility
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#FF6B35] hover:bg-[#E85A2A] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Add New Service</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF2EB] text-2xl flex items-center justify-center">
                  {service.icon}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateService({
                        ...service,
                        active: !service.active,
                      })
                    }
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                      service.active
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-neutral-100 text-neutral-500 border-neutral-200'
                    }`}
                  >
                    {service.active ? 'ACTIVE' : 'DISABLED'}
                  </button>

                  <button
                    onClick={() => setEditingService(service)}
                    className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                    title="Edit Service"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold text-neutral-900 mt-3">{service.name}</h3>
              <p className="text-xs font-medium text-[#E85A2A]">{service.tagline}</p>
              <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Pricing Parameters */}
            <div className="pt-3 border-t border-neutral-100 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-neutral-50 rounded-xl">
                <span className="text-[10px] text-neutral-400 block font-medium">Base Fare</span>
                <strong className="text-neutral-900 font-extrabold">₹{service.baseFare}</strong>
              </div>
              <div className="p-2 bg-neutral-50 rounded-xl">
                <span className="text-[10px] text-neutral-400 block font-medium">Rate / KM</span>
                <strong className="text-neutral-900 font-extrabold">₹{service.perKm}</strong>
              </div>
              <div className="p-2 bg-neutral-50 rounded-xl">
                <span className="text-[10px] text-neutral-400 block font-medium">Min Fare</span>
                <strong className="text-neutral-900 font-extrabold">₹{service.minimumFare}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-neutral-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <h3 className="text-base font-extrabold text-neutral-900">
                Edit {editingService.name}
              </h3>
              <button
                onClick={() => setEditingService(null)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="text-neutral-700 font-bold block mb-1">Service Name</label>
                <input
                  type="text"
                  value={editingService.name}
                  onChange={(e) =>
                    setEditingService({ ...editingService, name: e.target.value })
                  }
                  required
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:border-[#FF6B35]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-neutral-700 font-bold block mb-1">Base Fare (₹)</label>
                  <input
                    type="number"
                    value={editingService.baseFare}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        baseFare: Number(e.target.value),
                      })
                    }
                    required
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>
                <div>
                  <label className="text-neutral-700 font-bold block mb-1">Per KM (₹)</label>
                  <input
                    type="number"
                    value={editingService.perKm}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        perKm: Number(e.target.value),
                      })
                    }
                    required
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>
                <div>
                  <label className="text-neutral-700 font-bold block mb-1">Min Fare (₹)</label>
                  <input
                    type="number"
                    value={editingService.minimumFare}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        minimumFare: Number(e.target.value),
                      })
                    }
                    required
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-700 font-bold block mb-1">Tagline</label>
                <input
                  type="text"
                  value={editingService.tagline}
                  onChange={(e) =>
                    setEditingService({ ...editingService, tagline: e.target.value })
                  }
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:border-[#FF6B35]"
                />
              </div>

              <div>
                <label className="text-neutral-700 font-bold block mb-1">Description</label>
                <textarea
                  value={editingService.description}
                  onChange={(e) =>
                    setEditingService({ ...editingService, description: e.target.value })
                  }
                  rows={2}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:border-[#FF6B35] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="py-2.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-600 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 rounded-xl bg-[#FF6B35] hover:bg-[#E85A2A] text-white text-xs font-bold shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-neutral-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <h3 className="text-base font-extrabold text-neutral-900">+ Add New Delivery Service</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-3 text-xs">
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-1">
                  <label className="text-neutral-700 font-bold block mb-1">Emoji Icon</label>
                  <input
                    type="text"
                    value={newServiceIcon}
                    onChange={(e) => setNewServiceIcon(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-center text-sm font-bold focus:bg-white focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>
                <div className="col-span-3">
                  <label className="text-neutral-700 font-bold block mb-1">Service Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Pet Supplies Delivery"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    required
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-neutral-700 font-bold block mb-1">Base Fare (₹)</label>
                  <input
                    type="number"
                    value={newServiceBaseFare}
                    onChange={(e) => setNewServiceBaseFare(Number(e.target.value))}
                    required
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>
                <div>
                  <label className="text-neutral-700 font-bold block mb-1">Per KM (₹)</label>
                  <input
                    type="number"
                    value={newServicePerKm}
                    onChange={(e) => setNewServicePerKm(Number(e.target.value))}
                    required
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>
                <div>
                  <label className="text-neutral-700 font-bold block mb-1">Min Fare (₹)</label>
                  <input
                    type="number"
                    value={newServiceMinFare}
                    onChange={(e) => setNewServiceMinFare(Number(e.target.value))}
                    required
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-700 font-bold block mb-1">Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Delivered directly from stores"
                  value={newServiceTagline}
                  onChange={(e) => setNewServiceTagline(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:border-[#FF6B35]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-2.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-600 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 rounded-xl bg-[#FF6B35] hover:bg-[#E85A2A] text-white text-xs font-bold shadow-xs"
                >
                  Create Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
