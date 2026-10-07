import React from 'react';
import { Logo } from '../components/ui/Logo';
import { useApp } from '../store/AppContext';
import { UserRole } from '../types';
import { UserCheck, Bike, Store, ShieldAlert, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface RoleLoginPageProps {
  onSelectRole: (role: UserRole) => void;
}

export const RoleLoginPage: React.FC<RoleLoginPageProps> = ({ onSelectRole }) => {
  const { currentCustomer, currentPartner, currentBusiness } = useApp();

  const roleOptions: {
    role: UserRole;
    title: string;
    tagline: string;
    persona: string;
    desc: string;
    icon: any;
    features: string[];
  }[] = [
    {
      role: 'customer',
      title: 'Continue as Customer',
      tagline: 'Order with QuickPass',
      persona: `${currentCustomer.name} (Sector 62, Noida)`,
      desc: 'Book deliveries, purchase service passes for unlimited free delivery, and track live rider GPS movement.',
      icon: UserCheck,
      features: ['QuickPass Subscription', 'Real-time Price Estimation', 'Live GPS Tracking'],
    },
    {
      role: 'business',
      title: 'Continue as Merchant',
      tagline: 'Direct Store & Kitchen',
      persona: `${currentBusiness.name} (${currentBusiness.ownerName})`,
      desc: 'Manage store catalog & availability, receive customer orders, and dispatch QuickGo delivery riders instantly.',
      icon: Store,
      features: ['Live Order Preparation', 'On-Demand Rider Dispatch', 'Menu & Product Catalog'],
    },
    {
      role: 'partner',
      title: 'Continue as Delivery Partner',
      tagline: 'Deliver and earn',
      persona: `${currentPartner.name} (${currentPartner.vehicle})`,
      desc: 'Receive delivery broadcast alerts with countdown, advance delivery steps, and track daily earnings.',
      icon: Bike,
      features: ['Online/Offline Duty Switch', '15s Request Acceptance', 'Step-by-step Delivery Actions'],
    },
    {
      role: 'admin',
      title: 'Continue as Super Admin',
      tagline: 'Platform Root Control',
      persona: 'Operations & Dispatch Control',
      desc: 'Central command with live fleet map, dynamic pricing, direct merchant management, and QuickPass oversight.',
      icon: ShieldAlert,
      features: ['Merchant Management', 'Platform Fleet Live Map', 'QuickPass Plan Management'],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-3">
          <Logo size="lg" showTagline={true} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mt-4">
          Select Your Role to Test
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-neutral-600">
          No passwords required. Click any card to enter that role immediately.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-6xl px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {roleOptions.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.role}
                id={`login-card-${item.role}`}
                onClick={() => onSelectRole(item.role)}
                className="bg-white rounded-3xl p-5 border border-neutral-200 hover:border-[#FF6B35] hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden text-left"
              >
                {/* Accent top line on hover */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#FF6B35] opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  <div className="w-11 h-11 rounded-2xl bg-[#FFF2EB] text-[#FF6B35] flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>

                  <span className="text-[10px] font-bold text-[#E85A2A] uppercase tracking-wider block">
                    {item.tagline}
                  </span>
                  <h3 className="text-base font-bold text-neutral-900 mt-1 group-hover:text-[#FF6B35] transition-colors">
                    {item.title}
                  </h3>

                  <div className="mt-2 px-2.5 py-1 bg-neutral-50 rounded-xl border border-neutral-100 text-[11px] font-semibold text-neutral-700 truncate">
                    {item.persona}
                  </div>

                  <p className="text-xs text-neutral-600 mt-2.5 leading-relaxed line-clamp-3">{item.desc}</p>

                  <div className="mt-3.5 pt-2.5 border-t border-neutral-100 space-y-1">
                    {item.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[10px] text-neutral-600">
                        <CheckCircle2 className="w-3 h-3 text-[#16A34A] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#FF6B35]">Launch</span>
                  <div className="w-7 h-7 rounded-full bg-[#FFF2EB] text-[#FF6B35] flex items-center justify-center group-hover:bg-[#FF6B35] group-hover:text-white transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center text-xs text-neutral-500">
          💡 You can quickly switch between roles anytime using the top navigation bar.
        </div>
      </div>
    </div>
  );
};
