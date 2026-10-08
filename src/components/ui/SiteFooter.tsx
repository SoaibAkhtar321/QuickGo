import React from 'react';
import { Logo } from './Logo';

export type FooterTab = 'home' | 'categories' | 'orders' | 'passes' | 'create' | 'support';

const FOOTER_LINKS: { tab: FooterTab; label: string }[] = [
  { tab: 'home', label: 'Home' },
  { tab: 'categories', label: 'Categories' },
  { tab: 'orders', label: 'Orders' },
  { tab: 'passes', label: 'QuickPass' },
  { tab: 'create', label: 'Send Courier' },
  { tab: 'support', label: 'Support' },
];

interface SiteFooterProps {
  onNavigate: (tab: FooterTab) => void;
  className?: string;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({ onNavigate, className = '' }) => (
  <footer id="site-footer" className={`bg-white border-t border-neutral-200 mt-10 ${className}`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
      <Logo size="sm" showTagline={true} />
      <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-1 -mx-2">
        {FOOTER_LINKS.map(({ tab, label }) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              onNavigate(tab);
              window.scrollTo({ top: 0 });
            }}
            className="px-2 py-2 text-xs font-bold text-neutral-600 hover:text-red-600 transition-colors cursor-pointer"
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 text-xs text-neutral-500">
      © 2026 QuickGo Logistics Pvt Ltd • Fast, reliable hyperlocal deliveries.
    </div>
  </footer>
);

export default SiteFooter;
