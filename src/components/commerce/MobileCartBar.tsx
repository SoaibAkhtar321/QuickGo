import React from 'react';
import { useApp } from '../../store/AppContext';
import { ChevronRight } from 'lucide-react';

interface MobileCartBarProps {
  onOpenCart: () => void;
  isFooterVisible?: boolean;
}

export const MobileCartBar: React.FC<MobileCartBarProps> = ({ onOpenCart, isFooterVisible = true }) => {
  const { cart, cartItemCount, cartTotal } = useApp();

  if (cartItemCount === 0) return null;

  const firstItem = cart[0];

  return (
    <div
      className={`fixed left-0 right-0 z-40 px-4 sm:px-6 pointer-events-none flex justify-center transition-all duration-300 ease-in-out ${
        isFooterVisible
          ? 'bottom-[calc(5rem+env(safe-area-inset-bottom))] lg:bottom-6'
          : 'bottom-[calc(1rem+env(safe-area-inset-bottom))] lg:bottom-6'
      }`}
    >
      <div className="w-full max-w-sm pointer-events-auto">
        <button
          onClick={onOpenCart}
          id="btn-mobile-fast-cart"
          className="w-full bg-[#15803D] hover:bg-[#166534] text-white rounded-full p-2 sm:p-2.5 shadow-2xl shadow-green-950/40 flex items-center justify-between transition-transform active:scale-98 cursor-pointer group"
          aria-label="View shopping cart"
        >
          {/* Left: Product Thumbnail & Title */}
          <div className="flex items-center gap-3 min-w-0">
            {firstItem ? (
              <div className="w-10 h-10 rounded-full bg-white p-0.5 overflow-hidden shrink-0 border border-green-200 shadow-xs">
                <img
                  src={firstItem.product.image}
                  alt={firstItem.product.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-green-800 text-white flex items-center justify-center font-black shrink-0">
                🛒
              </div>
            )}
            <div className="text-left min-w-0">
              <div className="text-sm font-black text-white leading-tight">View cart</div>
              <div className="text-[11px] font-bold text-green-100/90 truncate">
                {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} • ₹{cartTotal}
              </div>
            </div>
          </div>

          {/* Right: Round arrow button */}
          <div className="w-8 h-8 rounded-full bg-green-700/80 group-hover:bg-green-600 text-white flex items-center justify-center shrink-0 transition-colors shadow-2xs mr-1">
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </div>
        </button>
      </div>
    </div>
  );
};

