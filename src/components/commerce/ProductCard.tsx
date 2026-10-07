import React from 'react';
import { Product } from '../../types';
import { useApp } from '../../store/AppContext';
import { Plus, Minus, Star, Zap } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenDetail?: (product: Product) => void;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetail,
  compact = false,
}) => {
  const { addToCart, updateCartQuantity, getItemQuantity } = useApp();
  const quantity = getItemQuantity(product.id);

  const handleCardClick = (e: React.MouseEvent) => {
    // If click was on the ADD/qty button, don't open detail
    const target = e.target as HTMLElement;
    if (target.closest('.qty-control-btn') || target.closest('.add-btn')) {
      return;
    }
    if (onOpenDetail) {
      onOpenDetail(product);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group bg-white rounded-2xl border border-neutral-200/90 hover:border-neutral-300 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden relative ${
        compact ? 'p-2.5 sm:p-3' : 'p-3 sm:p-3.5'
      }`}
    >
      {/* Top Image & ETA Badge Container */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-neutral-50 mb-2.5 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* 10-15 Min Fast Delivery ETA Pill */}
        <div className="absolute top-1.5 left-1.5 bg-white/95 backdrop-blur-xs text-neutral-900 font-extrabold text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-md shadow-xs flex items-center gap-1 border border-neutral-100">
          <Zap className="w-2.5 h-2.5 text-red-600 fill-red-600" />
          <span>{product.estimatedDeliveryMinutes || 12} MINS</span>
        </div>

        {/* Discount Badge if any */}
        {product.discountPercent > 0 && (
          <div className="absolute top-1.5 right-1.5 bg-red-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded shadow-xs">
            {product.discountPercent}% OFF
          </div>
        )}

        {/* Veg indicator dot */}
        {product.isVeg !== undefined && (
          <div
            className={`absolute bottom-1.5 left-1.5 w-3.5 h-3.5 bg-white rounded-xs border flex items-center justify-center p-0.5 shadow-2xs ${
              product.isVeg ? 'border-green-600' : 'border-red-700'
            }`}
            title={product.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                product.isVeg ? 'bg-green-600' : 'bg-red-700'
              }`}
            />
          </div>
        )}
      </div>

      {/* Middle: Unit, Title, Rating */}
      <div className="space-y-1 flex-1 flex flex-col">
        {/* Weight / Unit text */}
        <div className="text-[10px] sm:text-[11px] font-semibold text-neutral-500 truncate">
          {product.unit}
        </div>

        {/* Product Title (2-line clamp) */}
        <h3
          className="text-xs sm:text-sm font-bold text-neutral-900 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 pt-0.5">
          <span className="flex items-center gap-0.5 font-bold text-neutral-800 bg-neutral-100 px-1.5 py-0.2 rounded">
            <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
            {product.rating}
          </span>
          <span className="text-[10px] text-neutral-400">({product.reviewCount})</span>
        </div>
      </div>

      {/* Bottom: Pricing & Blinkit-Style [ADD] / [- qty +] Button */}
      <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between gap-1.5">
        {/* Price & Strikethrough MRP */}
        <div className="min-w-0">
          <div className="flex items-baseline gap-1">
            <span className="text-sm sm:text-base font-black text-neutral-900">
              ₹{product.price}
            </span>
            {product.mrp > product.price && (
              <span className="text-[10px] text-neutral-400 line-through">
                ₹{product.mrp}
              </span>
            )}
          </div>
        </div>

        {/* ADD / Quantity Counter Button */}
        <div>
          {quantity === 0 ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              className="add-btn bg-white hover:bg-green-50 text-green-700 hover:text-green-800 border-2 border-green-600 text-xs font-black px-3.5 py-1 sm:py-1.5 rounded-xl transition-all shadow-2xs active:scale-95 uppercase tracking-wide cursor-pointer"
              aria-label={`Add ${product.name} to cart`}
            >
              ADD
            </button>
          ) : (
            <div className="qty-control-btn inline-flex items-center bg-green-600 text-white rounded-xl shadow-xs overflow-hidden">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  updateCartQuantity(product.id, quantity - 1);
                }}
                className="w-7 h-7 sm:w-8 sm:h-7.5 flex items-center justify-center hover:bg-green-700 transition-colors active:scale-90"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
              <span className="w-6 text-center text-xs font-black select-none">
                {quantity}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  updateCartQuantity(product.id, quantity + 1);
                }}
                className="w-7 h-7 sm:w-8 sm:h-7.5 flex items-center justify-center hover:bg-green-700 transition-colors active:scale-90"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
