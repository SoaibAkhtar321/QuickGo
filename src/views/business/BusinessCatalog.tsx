import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { BusinessItem } from '../../types';
import {
  UtensilsCrossed,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Edit2,
  X,
  ToggleLeft,
  ToggleRight,
  Clock,
  Tag,
} from 'lucide-react';

export const BusinessCatalog: React.FC = () => {
  const { currentBusiness, updateBusinessCatalogItem, addBusinessCatalogItem, deleteBusinessCatalogItem } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [itemName, setItemName] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemPrice, setItemPrice] = useState('180');
  const [itemCategory, setItemCategory] = useState('Main Bowls');
  const [prepTime, setPrepTime] = useState('15');

  const categories = Array.from(new Set(currentBusiness.catalog.map((i) => i.category)));

  const filteredItems = currentBusiness.catalog.filter((item) => {
    if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
    }
    return true;
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    addBusinessCatalogItem(currentBusiness.id, {
      name: itemName.trim(),
      description: itemDesc.trim() || 'Freshly prepared item',
      price: parseFloat(itemPrice) || 150,
      category: itemCategory,
      isAvailable: true,
      prepTimeMinutes: parseInt(prepTime, 10) || 15,
    });

    setItemName('');
    setItemDesc('');
    setItemPrice('180');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-neutral-900">
            Catalog & Products
          </h1>
          <p className="text-xs text-neutral-500 font-medium">
            Manage your store menu, pricing, and live customer availability
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#FF6B35] hover:bg-[#E85A2A] text-white px-4 py-2.5 rounded-2xl text-xs font-black shadow-md shadow-[#FF6B35]/25 flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-neutral-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search catalog items..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#FF6B35]"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setCategoryFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              categoryFilter === 'ALL'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            All Items ({currentBusiness.catalog.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                categoryFilter === cat
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs space-y-3.5 flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-[#FF6B35] bg-orange-50 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                  <h3 className="text-sm font-black text-neutral-900">{item.name}</h3>
                </div>

                <div className="text-right">
                  <span className="text-base font-black text-neutral-900">₹{item.price}</span>
                </div>
              </div>

              <p className="text-xs text-neutral-500 leading-snug">{item.description}</p>
            </div>

            {/* Availability Switch & Actions */}
            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
              <button
                onClick={() =>
                  updateBusinessCatalogItem(currentBusiness.id, {
                    ...item,
                    isAvailable: !item.isAvailable,
                  })
                }
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                  item.isAvailable
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    item.isAvailable ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <span>{item.isAvailable ? 'In Stock' : 'Out of Stock'}</span>
              </button>

              <button
                onClick={() => deleteBusinessCatalogItem(currentBusiness.id, item.id)}
                className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg transition-colors"
                title="Delete product"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-neutral-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-base font-black text-neutral-900">Add New Product</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-neutral-700">Product / Dish Name</label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. Cold Brew Coffee 300ml"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:border-[#FF6B35]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-700">Description</label>
                <textarea
                  rows={2}
                  value={itemDesc}
                  onChange={(e) => setItemDesc(e.target.value)}
                  placeholder="Ingredients, portion size or details..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:border-[#FF6B35]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-700">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-700">Category</label>
                  <input
                    type="text"
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value)}
                    placeholder="e.g. Beverages"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>
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
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
