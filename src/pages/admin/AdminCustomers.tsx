import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { Customer } from '../../types';
import { Users, Search, UserCheck, UserX, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const { customers, toggleCustomerStatus } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-5 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-neutral-900">Registered Customers</h2>
          <p className="text-xs text-neutral-500">
            Manage user accounts, order activity, and suspension status
          </p>
        </div>

        <div className="text-xs font-bold text-neutral-600 bg-white px-3.5 py-2 rounded-xl border border-neutral-200 shadow-2xs">
          Active Accounts: <strong className="text-neutral-900">{customers.length}</strong>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-3xl p-4 border border-neutral-200 shadow-xs">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customers by name, phone or email..."
            className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl py-2 pl-9 pr-4 text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:border-[#FF6B35]"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Contact Details</th>
                <th className="py-3.5 px-6">Joined Date</th>
                <th className="py-3.5 px-6">Deliveries</th>
                <th className="py-3.5 px-6">Total Spent</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((cust) => (
                <tr key={cust.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl overflow-hidden border border-neutral-200 shrink-0">
                        <img
                          src={cust.avatar}
                          alt={cust.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-neutral-900">{cust.name}</div>
                        <div className="text-[10px] font-mono text-neutral-400">ID: {cust.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-6">
                    <div className="text-neutral-800 font-mono">{cust.phone}</div>
                    <div className="text-[11px] text-neutral-400">{cust.email}</div>
                  </td>
                  <td className="py-3.5 px-6 text-neutral-600 font-medium">{cust.createdAt}</td>
                  <td className="py-3.5 px-6 font-bold text-neutral-900">
                    {cust.totalOrders} Orders
                  </td>
                  <td className="py-3.5 px-6 font-extrabold text-neutral-900">
                    ₹{cust.totalSpent.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        cust.status === 'ACTIVE'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          cust.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      />
                      {cust.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => toggleCustomerStatus(cust.id)}
                      className={`text-xs font-bold px-3 py-1 rounded-lg border transition-colors ${
                        cust.status === 'ACTIVE'
                          ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                          : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                      }`}
                    >
                      {cust.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
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
