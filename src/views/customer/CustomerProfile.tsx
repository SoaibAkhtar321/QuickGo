import React from 'react';
import { useApp } from '../../store/AppContext';
import {
  User,
  MapPin,
  CreditCard,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Sparkles,
  Wallet,
} from 'lucide-react';

export const CustomerProfile: React.FC = () => {
  const { currentCustomer, setRole } = useApp();

  return (
    <div className="space-y-4 text-left">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#FF6B35] shadow-xs shrink-0">
          <img
            src={currentCustomer.avatar}
            alt={currentCustomer.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-extrabold text-neutral-900 text-base">{currentCustomer.name}</h3>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">{currentCustomer.phone}</p>
          <p className="text-[11px] text-neutral-400 truncate">{currentCustomer.email}</p>
        </div>
      </div>

      {/* Quick Wallet Card */}
      <div className="bg-gradient-to-tr from-neutral-900 to-neutral-800 rounded-3xl p-5 text-white shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-[#FF6B35]" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              QuickGo Wallet
            </span>
          </div>
          <span className="text-[10px] font-bold bg-[#FF6B35]/20 text-[#FF8C5A] px-2 py-0.5 rounded">
            Instant Cashback Active
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-2xl font-extrabold text-white">₹450.00</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">Available for instant checkout</div>
          </div>
          <button
            onClick={() => alert('Mock wallet recharged with ₹500!')}
            className="bg-[#FF6B35] hover:bg-[#E85A2A] text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-transform active:scale-95"
          >
            + Add Money
          </button>
        </div>
      </div>

      {/* Settings Navigation */}
      <div className="bg-white rounded-3xl p-3 border border-neutral-200 shadow-xs divide-y divide-neutral-100">
        {[
          {
            icon: MapPin,
            title: 'Saved Addresses',
            desc: 'Sector 62 (Home), Sector 18 (Office)',
          },
          {
            icon: CreditCard,
            title: 'Payment Methods',
            desc: 'UPI AutoPay & Saved Cards',
          },
          {
            icon: Bell,
            title: 'Notification Preferences',
            desc: 'SMS, WhatsApp & Push notifications',
          },
          {
            icon: Shield,
            title: 'Security & Privacy',
            desc: 'Number masking & 2-Factor Auth',
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="py-3 px-3 flex items-center justify-between hover:bg-neutral-50 rounded-2xl cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700">
                  <Icon className="w-4 h-4 text-[#FF6B35]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">{item.title}</h4>
                  <p className="text-[11px] text-neutral-500">{item.desc}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </div>
          );
        })}
      </div>

      {/* Switch to Delivery Partner button */}
      <div className="bg-white rounded-3xl p-4 border border-neutral-200 shadow-xs flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-neutral-900">Want to earn with QuickGo?</h4>
          <p className="text-[11px] text-neutral-500">Deliver packages and earn daily payouts</p>
        </div>
        <button
          onClick={() => setRole('partner')}
          className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold px-3 py-2 rounded-xl"
        >
          Partner Mode →
        </button>
      </div>
    </div>
  );
};
