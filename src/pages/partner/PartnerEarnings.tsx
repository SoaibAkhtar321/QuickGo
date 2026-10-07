import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import {
  DollarSign,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  CheckCircle2,
  Wallet,
  Building2,
  ArrowDownLeft,
  Sparkles,
  Download,
  CreditCard,
  Zap,
} from 'lucide-react';

export const PartnerEarnings: React.FC = () => {
  const { currentPartner } = useApp();
  const [cashoutDone, setCashoutDone] = useState(false);

  const dailyBreakdown = [
    { day: 'Mon', date: 'Oct 23', amount: 1120, orders: 11, hours: '4.8h', height: '65%' },
    { day: 'Tue', date: 'Oct 24', amount: 1340, orders: 13, hours: '5.2h', height: '80%' },
    { day: 'Wed', date: 'Oct 25', amount: 980, orders: 9, hours: '3.6h', height: '55%' },
    { day: 'Thu', date: 'Oct 26', amount: 1450, orders: 15, hours: '5.8h', height: '90%' },
    { day: 'Fri', date: 'Oct 27', amount: 1280, orders: 14, hours: '4.2h', height: '75%', active: true },
    { day: 'Sat', date: 'Oct 28', amount: 1600, orders: 17, hours: '6.5h', height: '95%' },
    { day: 'Sun', date: 'Oct 29', amount: 680, orders: 7, hours: '2.5h', height: '40%' },
  ];

  const handleInstantCashout = () => {
    setCashoutDone(true);
    setTimeout(() => setCashoutDone(false), 4000);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-neutral-900">Earnings & Financial Settlement</h2>
          <p className="text-xs text-neutral-500 font-medium mt-0.5">
            Real-time breakdown of trip fares, daily bonuses, and automated bank deposits
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('Downloading GST Statement PDF for current month...')}
            className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Invoice</span>
          </button>
        </div>
      </div>

      {/* KPI Performance Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-tr from-neutral-900 to-neutral-800 rounded-3xl p-5 text-white shadow-md">
          <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-wider block">
            Today's Net Earned
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1">
            ₹{currentPartner.earningsToday}
          </div>
          <p className="text-[11px] text-green-400 mt-1 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3" /> +18% vs yesterday
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
            This Week Total
          </span>
          <div className="text-2xl sm:text-3xl font-black text-neutral-900 mt-1">
            ₹8,450
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">83 total deliveries completed</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
            This Month Total
          </span>
          <div className="text-2xl sm:text-3xl font-black text-neutral-900 mt-1">
            ₹32,840
          </div>
          <p className="text-[11px] text-[#16A34A] font-bold mt-1">Direct Bank Payout Active</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
            Available to Cashout
          </span>
          <div className="text-2xl sm:text-3xl font-black text-neutral-900 mt-1">
            ₹{currentPartner.earningsToday}
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Settles daily at 11:59 PM</p>
        </div>
      </div>

      {/* Two-Column Responsive Desktop Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Weekly Bar Chart & Daily Shift Ledger */}
        <div className="lg:col-span-7 space-y-6">
          {/* Weekly Chart */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-neutral-900">Weekly Earnings Trend</h4>
                <p className="text-xs text-neutral-500">Total ₹8,450 across 7 days</p>
              </div>
              <span className="text-xs font-black text-[#16A34A] bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                +14.2% week-on-week
              </span>
            </div>

            {/* Custom Interactive HTML Bar Chart */}
            <div className="flex items-end justify-between h-48 pt-6 px-3 border-b border-neutral-100">
              {dailyBreakdown.map((item) => (
                <div key={item.day} className="flex flex-col items-center gap-2 flex-1 group">
                  <span className="text-[11px] font-black text-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{item.amount}
                  </span>
                  <div className="w-8 sm:w-11 bg-neutral-100 rounded-t-xl h-32 flex items-end overflow-hidden">
                    <div
                      className={`w-full rounded-t-xl transition-all duration-300 ${
                        item.active
                          ? 'bg-[#FF6B35] shadow-md shadow-[#FF6B35]/30'
                          : 'bg-neutral-800 group-hover:bg-[#FF6B35]/80'
                      }`}
                      style={{ height: item.height }}
                    />
                  </div>
                  <div className="text-center">
                    <span
                      className={`text-xs font-black block ${
                        item.active ? 'text-[#FF6B35]' : 'text-neutral-700'
                      }`}
                    >
                      {item.day}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">{item.orders} tr</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Shift Breakdown Table */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
            <h4 className="text-sm font-black text-neutral-900">Daily Shift Performance Ledger</h4>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-neutral-100 text-neutral-400 uppercase text-[10px] font-bold">
                    <th className="pb-3">Shift Date</th>
                    <th className="pb-3">Trips</th>
                    <th className="pb-3">Hours Online</th>
                    <th className="pb-3">Base Pay</th>
                    <th className="pb-3 text-right">Total Net</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {dailyBreakdown.map((row) => (
                    <tr key={row.date} className="hover:bg-neutral-50 transition-colors">
                      <td className="py-3 font-bold text-neutral-900">
                        {row.day}, {row.date}
                        {row.active && (
                          <span className="ml-2 text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-bold border border-green-200">
                            Today
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-neutral-600 font-medium">{row.orders} orders</td>
                      <td className="py-3 text-neutral-600 font-medium">{row.hours}</td>
                      <td className="py-3 text-neutral-600">₹{Math.round(row.amount * 0.85)}</td>
                      <td className="py-3 text-right font-black text-neutral-900">₹{row.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Bank Settlement & Instant Cashout */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          {/* Linked Bank Account Card */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-neutral-500 uppercase tracking-wider">
                Settlement Account
              </h4>
              <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
                Verified UPI / IMPS
              </span>
            </div>

            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl">
                🏦
              </div>
              <div>
                <div className="font-black text-neutral-900 text-sm">HDFC Bank Limited</div>
                <div className="text-xs text-neutral-500 font-mono">A/C: ••••••••• 4321 • HDFC0001234</div>
                <div className="text-[11px] text-green-600 font-bold mt-0.5">QuickGo Direct NACH Linked</div>
              </div>
            </div>

            {cashoutDone ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-2xl text-green-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span>₹{currentPartner.earningsToday} successfully initiated to your HDFC Bank account!</span>
              </div>
            ) : (
              <button
                id="partner-instant-cashout-btn"
                onClick={handleInstantCashout}
                className="w-full bg-[#FF6B35] hover:bg-[#E85A2A] text-white py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-[#FF6B35]/25 transition-all active:scale-[0.98]"
              >
                <Zap className="w-4 h-4" />
                <span>Instant Cashout (₹{currentPartner.earningsToday})</span>
              </button>
            )}

            <p className="text-[11px] text-neutral-400 text-center">
              Standard automated settlements process daily at 11:59 PM with zero transfer fees.
            </p>
          </div>

          {/* Earnings Composition Breakdown */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
            <h4 className="text-xs font-black text-neutral-500 uppercase tracking-wider">
              Earnings Breakdown (This Week)
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">Base Trip Fares (83 trips)</span>
                <span className="font-bold text-neutral-900">₹6,240 (74%)</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-neutral-900 w-[74%] rounded-full" />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-neutral-600">Surge & Peak Hour Multipliers</span>
                <span className="font-bold text-neutral-900">₹1,120 (13%)</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#FF6B35] w-[13%] rounded-full" />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-neutral-600">Daily Incentive Bonuses</span>
                <span className="font-bold text-neutral-900">₹750 (9%)</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[9%] rounded-full" />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-neutral-600">Customer Direct Tips</span>
                <span className="font-bold text-neutral-900">₹340 (4%)</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 w-[4%] rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
