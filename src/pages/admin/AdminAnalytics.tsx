import React from 'react';
import { useApp } from '../../store/AppContext';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertOctagon,
  Percent,
  Award,
} from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  const { orders, partners } = useApp();

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-xl font-extrabold text-neutral-900">Performance & Analytics</h2>
        <p className="text-xs text-neutral-500">
          Delivery fulfillment speed, SLA compliance, and dispatch bottlenecks
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-xs space-y-2">
          <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            Avg Delivery Time
          </div>
          <div className="text-3xl font-extrabold text-neutral-900">24.2 min</div>
          <div className="text-xs text-[#16A34A] font-bold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> -3.5 min faster than target
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-xs space-y-2">
          <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            Order Fulfillment Rate
          </div>
          <div className="text-3xl font-extrabold text-neutral-900">98.4%</div>
          <div className="text-xs text-[#16A34A] font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Top tier SLA performance
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-xs space-y-2">
          <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            Partner Acceptance Rate
          </div>
          <div className="text-3xl font-extrabold text-neutral-900">94.1%</div>
          <div className="text-xs text-neutral-500 font-medium">Avg response time: 6.8s</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-xs space-y-2">
          <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            Customer Satisfaction
          </div>
          <div className="text-3xl font-extrabold text-neutral-900">4.88 / 5.0</div>
          <div className="text-xs text-amber-600 font-bold">⭐ Over 12,400 ratings</div>
        </div>
      </div>

      {/* Speed by Sector & Popular Hubs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sector Speed Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold text-neutral-900">Delivery Speed by Region</h3>

          <div className="space-y-3 text-xs">
            {[
              { sector: 'Sector 62 (IT Hub)', time: '19.4 min', rating: '99% on-time' },
              { sector: 'Sector 18 (Commercial Center)', time: '22.1 min', rating: '97% on-time' },
              { sector: 'Indirapuram (Residential)', time: '25.3 min', rating: '98% on-time' },
              { sector: 'Vaishali (Transit Zone)', time: '24.0 min', rating: '96% on-time' },
              { sector: 'Sector 128 (Expressway)', time: '28.5 min', rating: '95% on-time' },
            ].map((item) => (
              <div
                key={item.sector}
                className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-neutral-900">{item.sector}</div>
                  <span className="text-[10px] text-green-700 font-semibold">{item.rating}</span>
                </div>
                <div className="text-sm font-extrabold text-neutral-900">{item.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Cancellation Reasons Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold text-neutral-900">Cancellation Root Causes (1.6%)</h3>

          <div className="space-y-3 pt-2 text-xs">
            {[
              { reason: 'Customer changed delivery location', pct: '45%' },
              { reason: 'Partner reassignment delay', pct: '25%' },
              { reason: 'Item size exceeded bike limit', pct: '18%' },
              { reason: 'Customer unreachable at gate', pct: '12%' },
            ].map((item) => (
              <div key={item.reason} className="space-y-1">
                <div className="flex justify-between font-bold text-neutral-800 text-[11px]">
                  <span>{item.reason}</span>
                  <span>{item.pct}</span>
                </div>
                <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-neutral-800 rounded-full"
                    style={{ width: item.pct }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
