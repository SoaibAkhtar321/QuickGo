import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { CreditCard, Search, Download, CheckCircle2, RotateCcw } from 'lucide-react';

export const AdminPayments: React.FC = () => {
  const { orders } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const transactions = orders.map((order, idx) => ({
    txnId: `TXN${948201 + idx}`,
    orderId: order.id,
    customerName: order.customerName || 'Rahul Sharma',
    service: order.serviceName,
    amount: order.pricing.total,
    method: 'UPI (Instant)',
    status: order.status === 'CANCELLED' ? 'REFUNDED' : 'PAID',
    date: order.createdAt,
  }));

  const filtered = transactions.filter(
    (t) =>
      t.txnId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-5 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-neutral-900">Payment & Settlements</h2>
          <p className="text-xs text-neutral-500">
            UPI, Card transactions, merchant settlements and instant refunds ledger
          </p>
        </div>

        <button
          onClick={() => alert('Transactions exported as CSV report.')}
          className="bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-bold px-4 py-2 rounded-xl border border-neutral-200 shadow-2xs flex items-center gap-1.5"
        >
          <Download className="w-4 h-4 text-[#FF6B35]" />
          <span>Export CSV Ledger</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-3xl p-4 border border-neutral-200 shadow-xs">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Transaction ID, Order ID, or customer..."
            className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl py-2 pl-9 pr-4 text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:border-[#FF6B35]"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Txn ID</th>
                <th className="py-3.5 px-6">Order ID</th>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Service</th>
                <th className="py-3.5 px-6">Amount</th>
                <th className="py-3.5 px-6">Payment Method</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((txn) => (
                <tr key={txn.txnId} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3.5 px-6 font-mono font-bold text-neutral-900">
                    {txn.txnId}
                  </td>
                  <td className="py-3.5 px-6 font-mono text-neutral-600">
                    #{txn.orderId}
                  </td>
                  <td className="py-3.5 px-6 font-medium text-neutral-900">
                    {txn.customerName}
                  </td>
                  <td className="py-3.5 px-6 text-neutral-600">{txn.service}</td>
                  <td className="py-3.5 px-6 font-extrabold text-neutral-900">
                    ₹{txn.amount}
                  </td>
                  <td className="py-3.5 px-6 text-neutral-700">
                    <span className="font-semibold">{txn.method}</span>
                  </td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        txn.status === 'PAID'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {txn.status === 'PAID' ? 'PAID' : 'REFUNDED'}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right text-neutral-500 font-mono text-[11px]">
                    {txn.date}
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
