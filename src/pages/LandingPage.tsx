import React from 'react';
import { Logo } from '../components/ui/Logo';
import { useApp } from '../store/AppContext';
import {
  Package,
  UtensilsCrossed,
  ShoppingBag,
  Soup,
  FileText,
  Truck,
  ArrowRight,
  ShieldCheck,
  Zap,
  MapPin,
  Clock,
  CheckCircle2,
  Bike,
  UserCheck,
  ShieldAlert,
  Store,
} from 'lucide-react';

interface LandingPageProps {
  onSelectRole: (role: 'customer' | 'partner' | 'business' | 'admin') => void;
  onNavigateToBooking: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectRole, onNavigateToBooking }) => {
  const { services } = useApp();

  const serviceIcons: { [key: string]: any } = {
    parcel: Package,
    food: UtensilsCrossed,
    grocery: ShoppingBag,
    tiffin: Soup,
    documents: FileText,
    pickup_drop: Truck,
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#171717] flex flex-col selection:bg-[#FF6B35]/20">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo size="md" showTagline={true} />

          {/* Role Direct Jump Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="landing-nav-merchant"
              onClick={() => onSelectRole('business')}
              className="text-xs sm:text-sm font-semibold text-neutral-700 hover:text-[#FF6B35] px-3 py-2 rounded-xl hover:bg-neutral-100 transition-colors"
            >
              For Merchants
            </button>
            <button
              id="landing-nav-partner"
              onClick={() => onSelectRole('partner')}
              className="text-xs sm:text-sm font-semibold text-neutral-700 hover:text-[#FF6B35] px-3 py-2 rounded-xl hover:bg-neutral-100 transition-colors"
            >
              For Riders
            </button>
            <button
              id="landing-nav-admin"
              onClick={() => onSelectRole('admin')}
              className="text-xs sm:text-sm font-semibold text-neutral-700 hover:text-[#FF6B35] px-3 py-2 rounded-xl hover:bg-neutral-100 transition-colors"
            >
              Admin Ops
            </button>
            <button
              id="landing-nav-book"
              onClick={onNavigateToBooking}
              className="bg-[#FF6B35] hover:bg-[#E85A2A] text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl shadow-xs transition-transform active:scale-95 flex items-center gap-1.5"
            >
              <span>Book Delivery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 overflow-hidden border-b border-neutral-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF2EB] text-[#E85A2A] text-xs font-bold tracking-wide border border-[#FF6B35]/20">
                <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-ping" />
                Live in Noida & Delhi NCR • Avg Delivery: 24 mins
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-900 tracking-tight leading-[1.1]">
                Everything delivered. <span className="text-[#FF6B35]">Simply.</span>
              </h1>

              <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl leading-relaxed">
                Fast, reliable local delivery for parcels, food, groceries, tiffin, legal documents, and doorstep pickup & drop.
              </p>

              {/* Action CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  id="hero-btn-book"
                  onClick={onNavigateToBooking}
                  className="bg-[#FF6B35] hover:bg-[#E85A2A] text-white text-base font-bold px-7 py-3.5 rounded-2xl shadow-md shadow-[#FF6B35]/20 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Book a Delivery</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  id="hero-btn-partner"
                  onClick={() => onSelectRole('partner')}
                  className="bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-base font-semibold px-6 py-3.5 rounded-2xl border border-neutral-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Bike className="w-5 h-5 text-[#FF6B35]" />
                  <span>Become a Delivery Partner</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-100 text-neutral-700">
                <div>
                  <div className="text-2xl font-extrabold text-neutral-900">20+ Min</div>
                  <div className="text-xs text-neutral-500 font-medium">Hyperlocal Speed</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-neutral-900">100% Verified</div>
                  <div className="text-xs text-neutral-500 font-medium">KYC Fleet Riders</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-neutral-900">₹40 Base</div>
                  <div className="text-xs text-neutral-500 font-medium">Transparent Pricing</div>
                </div>
              </div>
            </div>

            {/* Right Card: Interactive Role Showcase */}
            <div className="lg:col-span-5">
              <div className="bg-[#F8F9FA] rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                    Interactive Prototype Access
                  </span>
                  <span className="text-xs font-medium px-2 py-0.5 bg-green-100 text-green-800 rounded-md">
                    Ready to Test
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Customer Card */}
                  <div
                    onClick={() => onSelectRole('customer')}
                    className="group bg-white p-4 rounded-2xl border border-neutral-200 hover:border-[#FF6B35] hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-[#FFF2EB] text-[#FF6B35] flex items-center justify-center">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-neutral-900 text-sm group-hover:text-[#FF6B35] transition-colors">
                          Customer Panel
                        </h4>
                        <p className="text-xs text-neutral-500">Book delivery, calculate quotes & live GPS tracking</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-[#FF6B35] group-hover:translate-x-0.5 transition-all" />
                  </div>

                  {/* Merchant / Business Card */}
                  <div
                    onClick={() => onSelectRole('business')}
                    className="group bg-white p-4 rounded-2xl border border-neutral-200 hover:border-[#FF6B35] hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-[#FFF2EB] text-[#FF6B35] flex items-center justify-center">
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-neutral-900 text-sm group-hover:text-[#FF6B35] transition-colors">
                          Merchant / Store Panel
                        </h4>
                        <p className="text-xs text-neutral-500">Live order intake, catalog items & rider dispatch</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-[#FF6B35] group-hover:translate-x-0.5 transition-all" />
                  </div>

                  {/* Partner Card */}
                  <div
                    onClick={() => onSelectRole('partner')}
                    className="group bg-white p-4 rounded-2xl border border-neutral-200 hover:border-[#FF6B35] hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-[#FFF2EB] text-[#FF6B35] flex items-center justify-center">
                        <Bike className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-neutral-900 text-sm group-hover:text-[#FF6B35] transition-colors">
                          Delivery Partner Panel
                        </h4>
                        <p className="text-xs text-neutral-500">Accept requests, advance delivery status & track earnings</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-[#FF6B35] group-hover:translate-x-0.5 transition-all" />
                  </div>

                  {/* Admin Card */}
                  <div
                    onClick={() => onSelectRole('admin')}
                    className="group bg-white p-4 rounded-2xl border border-neutral-200 hover:border-[#FF6B35] hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-[#FFF2EB] text-[#FF6B35] flex items-center justify-center">
                        <ShieldAlert className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-neutral-900 text-sm group-hover:text-[#FF6B35] transition-colors">
                          Admin Operations
                        </h4>
                        <p className="text-xs text-neutral-500">Live multi-scooter map, fleet, pricing engine & tickets</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-[#FF6B35] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-16 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-neutral-900">Delivery services for every need</h2>
            <p className="text-sm text-neutral-600 mt-2">
              From everyday packages to hot tiffin meals, QuickGo delivers with speed and transparent pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const IconComponent = serviceIcons[service.id] || Package;
              return (
                <div
                  key={service.id}
                  onClick={onNavigateToBooking}
                  className="bg-white rounded-2xl p-6 border border-neutral-200 hover:border-[#FF6B35]/50 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#FFF2EB] text-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      {service.icon}
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 group-hover:text-[#FF6B35] transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-xs font-medium text-[#E85A2A] mt-0.5">{service.tagline}</p>
                    <p className="text-xs text-neutral-600 mt-2 leading-relaxed">{service.description}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-900">
                      From ₹{service.baseFare} + ₹{service.perKm}/km
                    </span>
                    <span className="text-[#FF6B35] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Book now <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How QuickGo Works Section */}
      <section className="py-16 bg-white border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-neutral-900">How QuickGo Works</h2>
            <p className="text-sm text-neutral-600 mt-2">Simple 5-step delivery process from pickup to doorstep</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              {
                num: '1',
                title: 'Choose a service',
                desc: 'Select parcel, food, grocery, tiffin, or documents.',
                icon: Package,
              },
              {
                num: '2',
                title: 'Enter addresses',
                desc: 'Pick pickup and destination from instant smart suggestions.',
                icon: MapPin,
              },
              {
                num: '3',
                title: 'Get instant quote',
                desc: 'See transparent distance, base fare, and total breakdown.',
                icon: Zap,
              },
              {
                num: '4',
                title: 'Matched with rider',
                desc: 'Nearest verified delivery partner accepts and arrives.',
                icon: Bike,
              },
              {
                num: '5',
                title: 'Track live on map',
                desc: 'Real-time GPS route, partner movement & safe OTP handover.',
                icon: Clock,
              },
            ].map((step) => (
              <div
                key={step.num}
                className="bg-[#F8F9FA] rounded-2xl p-5 border border-neutral-200 text-left relative"
              >
                <div className="w-8 h-8 rounded-full bg-[#FF6B35] text-white text-xs font-bold flex items-center justify-center mb-3">
                  {step.num}
                </div>
                <h4 className="font-bold text-sm text-neutral-900">{step.title}</h4>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 border-t border-neutral-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" showTagline={true} />
          <div className="text-xs text-neutral-500 text-center sm:text-right">
            © 2026 QuickGo Logistics Pvt Ltd • Fast, reliable hyperlocal deliveries.
          </div>
        </div>
      </footer>
    </div>
  );
};
