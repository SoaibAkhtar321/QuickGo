import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import {
  Wallet,
  TrendingUp,
  Download,
  CheckCircle2,
  Building2,
  Calendar,
  CreditCard,
  Zap,
} from 'lucide-react';

export const BusinessSettlement: React.FC = () => {
  const { currentBusiness } = useApp();
  const [cashoutDone, setCashoutDone] = useState(false);

  const handleInstantPayout = () => {
    setCashoutDone(true);
    setTimeout(() => setCashoutDone(false), 4000);
  };

  const payoutHistory = [
    { id: 'PAY-1082', date: '01 Oct 2026', period: 'Sep 24 - Sep 30', gross: 84200, net: 79990, status: 'SETTLED', utr: 'HDFCN2628491823' },
    { id: 'PAY-1075', date: '24 Sep 2026', period: 'Sep 17 - Sep 23', gross: 76500, net: 72675, status: 'SETTLED', utr: 'HDFCN2626102941' },
    { id: 'PAY-1068', date: '17 Sep 2026', period: 'Sep 10 - Sep 16', gross: 82100, net: 77995, status: 'SETTLED', utr: 'HDFCN2624910284' },
    { id: 'PAY-1061', date: '10 Sep 2026', period: 'Sep 03 - Sep 09', gross: 69400, net: 65930, status: 'SETTLED', utr: 'HDFCN2623192048' },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-neutral-900">
            Settlement & Financial Payouts
          </h1>
          <p className="text-xs text-neutral-500 font-medium">
            Daily automated deposits to your business bank account with transparent commission statements
          </p>
        </div>

        <button
          onClick={() => alert('Downloading GST Invoices & Settlement PDF...')}
          className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs self-start"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export GST Statement</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-tr from-neutral-900 to-neutral-800 rounded-3xl p-5 text-white shadow-md">
          <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-wider block">
            Today's Net Accrual
          </span>
          <div className="text-2xl md:text-3xl font-black text-white mt-1">
            ₹{currentBusiness.revenueToday.toLocaleString()}
          </div>
          <p className="text-[11px] text-green-400 mt-1 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3" /> Auto-settles at midnight
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
            Total Lifetime Sales
          </span>
          <div className="text-2xl md:text-3xl font-black text-neutral-900 mt-1">
            ₹{currentBusiness.revenueTotal.toLocaleString()}
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">
            {currentBusiness.totalOrders} total orders delivered
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
            QuickGo Fee Rate
          </span>
          <div className="text-2xl md:text-3xl font-black text-[#FF6B35] mt-1">
            {(currentBusiness.commissionRate * 100).toFixed(0)}%
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Zero hidden merchant surcharges</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
            Available For Instant Cashout
          </span>
          <div className="text-2xl md:text-3xl font-black text-neutral-900 mt-1">
            ₹{currentBusiness.revenueToday.toLocaleString()}
          </div>
          <p className="text-[11px] text-green-600 font-bold mt-1">Direct IMPS enabled</p>
        </div>
      </div>

      {/* Two-Column Layout: Bank Account Card vs Settlement Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Ledger */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-neutral-900">Weekly Settlement Archive</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-neutral-100 text-neutral-400 uppercase text-[10px] font-bold">
                  <th className="pb-3">Payout ID</th>
                  <th className="pb-3">Period</th>
                  <th className="pb-3">Gross Sales</th>
                  <th className="pb-3">Net Credited</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {payoutHistory.map((row) => (
                  <tr key={row.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-3 font-bold text-neutral-900">
                      {row.id}
                      <span className="block font-mono text-[10px] text-neutral-400 font-normal">
                        {row.utr}
                      </span>
                    </td>
                    <td className="py-3 text-neutral-600 font-medium">{row.period}</td>
                    <td className="py-3 text-neutral-600">₹{row.gross.toLocaleString()}</td>
                    <td className="py-3 font-black text-neutral-900">₹{row.net.toLocaleString()}</td>
                    <td className="py-3 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-green-100 text-green-800">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (5 cols): Bank Account & Cashout */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-neutral-500 uppercase tracking-wider">
                Settlement Bank Account
              </h3>
              <span className="text-[10px] font-black text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                VERIFIED NACH
              </span>
            </div>

            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl">
                🏦
              </div>
              <div>
                <div className="font-black text-neutral-900 text-sm">
                  {currentBusiness.bankAccount || 'HDFC Bank - 50100234819201'}
                </div>
                <div className="text-xs text-neutral-500 font-mono">
                  IFSC: {currentBusiness.ifscCode || 'HDFC0001248'}
                </div>
                <div className="text-[11px] text-green-600 font-bold mt-0.5">
                  GST: {currentBusiness.gstNumber || '07AAACG1234A1Z1'}
                </div>
              </div>
            </div>

            {cashoutDone ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-2xl text-green-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span>
                  ₹{currentBusiness.revenueToday.toLocaleString()} transferred via IMPS! Ref UTR #QG{Date.now().toString().slice(-6)}.
                </span>
              </div>
            ) : (
              <button
                onClick={handleInstantPayout}
                className="w-full bg-[#FF6B35] hover:bg-[#E85A2A] text-white py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-[#FF6B35]/25 transition-all active:scale-[0.98]"
              >
                <Zap className="w-4 h-4" />
                <span>Instant Bank Payout (₹{currentBusiness.revenueToday.toLocaleString()})</span>
              </button>
            )}

            <p className="text-[11px] text-neutral-400 text-center">
              Automated settlements occur daily at 11:59 PM with zero disbursement fees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
