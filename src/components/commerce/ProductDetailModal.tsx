import React from 'react';
import { Product } from '../../types';
import { useApp } from '../../store/AppContext';
import { X, Star, Zap, ShieldCheck, Plus, Minus, ArrowRight, Store, CheckCircle2 } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onSelectCategory?: (categoryId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onSelectCategory,
}) => {
  const { addToCart, updateCartQuantity, getItemQuantity, products } = useApp();

  if (!product) return null;

  const quantity = getItemQuantity(product.id);
  const relatedProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 flex flex-col relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors shadow-xs"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-6">
          {/* Top Section: Image & Key Details */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
            {/* Left: Product Image */}
            <div className="sm:col-span-5 relative aspect-square rounded-2xl overflow-hidden bg-neutral-50 border border-neutral-100 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-xs text-neutral-900 font-extrabold text-[10px] px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1 border border-neutral-100">
                <Zap className="w-3 h-3 text-red-600 fill-red-600" />
                <span>{product.estimatedDeliveryMinutes || 12} MINS</span>
              </div>
              {product.discountPercent > 0 && (
                <div className="absolute top-2 right-2 bg-red-600 text-white font-black text-xs px-2 py-0.5 rounded shadow-xs">
                  {product.discountPercent}% OFF
                </div>
              )}
            </div>

            {/* Right: Info, Price, ADD button */}
            <div className="sm:col-span-7 space-y-3.5 text-left">
              <div>
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                  {product.brand}
                </span>
                <h2 className="text-lg sm:text-xl font-black text-neutral-900 mt-0.5 leading-snug">
                  {product.name}
                </h2>
                <p className="text-xs font-semibold text-neutral-500 mt-1">{product.unit}</p>
              </div>

              {/* Rating & Fast ETA */}
              <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                <span className="flex items-center gap-1 font-bold text-neutral-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  {product.rating}
                  <span className="text-neutral-400 font-normal">({product.reviewCount} reviews)</span>
                </span>
                <span className="flex items-center gap-1 text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-lg font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> In Stock ({product.stock} units)
                </span>
              </div>

              {/* Price Row */}
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-neutral-900">₹{product.price}</span>
                    {product.mrp > product.price && (
                      <span className="text-xs text-neutral-400 line-through">₹{product.mrp}</span>
                    )}
                  </div>
                  {product.mrp > product.price && (
                    <span className="text-[11px] text-green-700 font-bold">
                      You save ₹{product.mrp - product.price} ({product.discountPercent}% off)
                    </span>
                  )}
                </div>

                {/* ADD or Quantity modifier */}
                <div>
                  {quantity === 0 ? (
                    <button
                      type="button"
                      onClick={() => addToCart(product)}
                      className="bg-green-600 hover:bg-green-700 text-white text-xs font-black px-5 py-2.5 rounded-xl transition-all shadow-md shadow-green-600/25 active:scale-95 uppercase tracking-wide cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>ADD</span>
                    </button>
                  ) : (
                    <div className="inline-flex items-center bg-green-600 text-white rounded-xl shadow-xs overflow-hidden">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(product.id, quantity - 1)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-green-700 transition-colors active:scale-90"
                      >
                        <Minus className="w-4 h-4 stroke-[3]" />
                      </button>
                      <span className="w-8 text-center text-sm font-black select-none">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(product.id, quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-green-700 transition-colors active:scale-90"
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Store & Hub Attribution */}
              <div className="flex items-center gap-2 text-xs text-neutral-600 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                <Store className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  Fulfilled directly by <strong>{product.businessName}</strong> • Express local dispatch
                </span>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="space-y-2 text-left border-t border-neutral-100 pt-4">
            <h4 className="text-xs font-black uppercase text-neutral-400 tracking-wider">
              Product Overview
            </h4>
            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Specifications Table */}
          <div className="space-y-2 text-left border-t border-neutral-100 pt-4">
            <h4 className="text-xs font-black uppercase text-neutral-400 tracking-wider">
              Key Details
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
                <span className="text-[10px] text-neutral-400 uppercase font-bold block">Shelf Life</span>
                <span className="font-semibold text-neutral-800">
                  {product.shelfLife || 'Check packaging for best before'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
                <span className="text-[10px] text-neutral-400 uppercase font-bold block">Country of Origin</span>
                <span className="font-semibold text-neutral-800">
                  {product.countryOfOrigin || 'India'}
                </span>
              </div>
            </div>
          </div>

          {/* Related / Similar Products */}
          {relatedProducts.length > 0 && (
            <div className="space-y-2.5 text-left border-t border-neutral-100 pt-4">
              <h4 className="text-xs font-black uppercase text-neutral-400 tracking-wider">
                Customers Also Bought
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {relatedProducts.map((rel) => {
                  const relQty = getItemQuantity(rel.id);
                  return (
                    <div
                      key={rel.id}
                      className="p-2.5 bg-neutral-50 rounded-2xl border border-neutral-100 flex flex-col justify-between"
                    >
                      <img
                        src={rel.image}
                        alt={rel.name}
                        className="w-full aspect-square object-cover rounded-xl mb-1.5"
                      />
                      <div className="text-[11px] font-bold text-neutral-900 line-clamp-1">
                        {rel.name}
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-neutral-200">
                        <span className="text-xs font-black text-neutral-900">₹{rel.price}</span>
                        {relQty === 0 ? (
                          <button
                            type="button"
                            onClick={() => addToCart(rel)}
                            className="text-[10px] font-black text-green-700 bg-white border border-green-600 px-2 py-0.5 rounded-md hover:bg-green-50"
                          >
                            + ADD
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded">
                            {relQty} in cart
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
