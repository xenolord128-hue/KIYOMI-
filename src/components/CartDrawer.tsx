import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, Tag, Truck, ShoppingBag, ArrowRight } from 'lucide-react';
import { playCinematicIntroSound } from '../utils/voiceUtils';
import { useLanguage } from '../contexts/LanguageContext';

export const CartDrawer: React.FC = () => {
  const { 
    cartItems, 
    isOpen, 
    setIsOpen, 
    updateQuantity, 
    removeFromCart, 
    totalBeforeDiscount, 
    totalPrice,
    discountPercentage,
    promoCode,
    applyPromo,
    promoError,
    deliveryCharge
  } = useCart();

  const navigate = useNavigate();
  const { t } = useLanguage();
  const [promoInput, setPromoInput] = useState('');

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    applyPromo(promoInput);
    setPromoInput('');
  };

  const handleCheckoutClick = () => {
    setIsOpen(false);
    navigate('/checkout');
    playCinematicIntroSound("Proceeding to Patowary Fashion checkout.");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 bg-[#0A1E54]/60 backdrop-blur-xs"
          />

          {/* Sliding Cart Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full sm:max-w-md bg-[#F8F3EA] text-[#111827] flex flex-col shadow-2xl border-l border-[#0A1E54]/10"
          >
            {/* Drawer Header */}
            <div className="p-5 bg-white border-b border-stone-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-[#0A1E54]" />
                <h2 className="text-sm font-mono tracking-wider uppercase font-bold text-[#0A1E54]">
                  Shopping Bag ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
                </h2>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Contents Scroll */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 p-6">
                  <div className="w-16 h-16 rounded-full bg-stone-200/60 flex items-center justify-center text-stone-400">
                    <ShoppingBag className="w-8 h-8 text-[#0A1E54]" />
                  </div>
                  <h3 className="text-sm font-bold text-[#0A1E54]">
                    Your Shopping Bag is Empty
                  </h3>
                  <p className="text-xs text-stone-500 max-w-xs">
                    Explore trending baggy cargo pants, wide-leg denims, and oversized tees.
                  </p>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/products');
                    }}
                    className="bg-[#0A1E54] hover:bg-[#1A3070] text-white text-xs font-bold uppercase tracking-wider py-3 px-6 rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    Explore Collection
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div 
                    key={`${item.product.id}-${item.selectedVariant}`} 
                    className="flex gap-3.5 p-3.5 bg-white rounded-2xl border border-stone-200/80 shadow-xs"
                  >
                    <img 
                      src={item.product.assets[0]} 
                      alt={item.product.title} 
                      className="w-20 h-24 object-cover rounded-xl bg-stone-100 shrink-0"
                    />

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-semibold text-[#111827] line-clamp-1">
                            {item.product.title}
                          </h4>
                          <button 
                            onClick={() => removeFromCart(item.product.id, item.selectedVariant)}
                            className="text-stone-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[10px] font-mono text-stone-500 uppercase mt-0.5">
                          Size: <span className="font-bold text-[#0A1E54]">{item.selectedVariant}</span>
                        </p>
                        <p className="text-xs font-bold text-[#0A1E54] font-mono mt-1">
                          BDT {item.product.price.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100">
                        <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.selectedVariant, item.quantity - 1)}
                            className="p-1 hover:bg-stone-200 text-stone-700 transition-colors rounded-l-lg cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-mono font-bold text-[#0A1E54]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.selectedVariant, item.quantity + 1)}
                            className="p-1 hover:bg-stone-200 text-stone-700 transition-colors rounded-r-lg cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-xs font-mono font-bold text-stone-800">
                          BDT {(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Checkout & Total Section */}
            {cartItems.length > 0 && (
              <div className="p-5 bg-white border-t border-stone-200 space-y-4">
                
                {/* Promo Code Form */}
                <form onSubmit={handlePromoSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="PROMO CODE (e.g. PATOWARY10)"
                    className="flex-1 px-3 py-2 text-xs font-mono rounded-xl border border-stone-300 focus:border-[#0A1E54] uppercase focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0A1E54] hover:bg-[#1A3070] text-white text-xs font-bold uppercase rounded-xl transition-all cursor-pointer"
                  >
                    Apply
                  </button>
                </form>

                {promoError && (
                  <p className="text-[11px] text-red-600 font-mono">{promoError}</p>
                )}

                {promoCode && (
                  <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <span>Coupon <strong>{promoCode}</strong> applied ({discountPercentage}% OFF)</span>
                  </div>
                )}

                {/* Subtotal, delivery, total */}
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal</span>
                    <span>BDT {totalBeforeDiscount.toLocaleString()}</span>
                  </div>

                  {discountPercentage > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Discount ({discountPercentage}%)</span>
                      <span>- BDT {Math.round(totalBeforeDiscount * (discountPercentage / 100)).toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-stone-600">
                    <span>Delivery Charge</span>
                    <span>{deliveryCharge === 0 ? <strong className="text-emerald-700">FREE</strong> : `BDT ${deliveryCharge}`}</span>
                  </div>

                  <div className="flex justify-between text-sm sm:text-base font-bold text-[#0A1E54] pt-2 border-t border-stone-200">
                    <span>Total</span>
                    <span>BDT {totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckoutClick}
                  className="w-full bg-[#0A1E54] hover:bg-[#1A3070] text-[#F8F3EA] text-xs font-bold uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-4 h-4 text-[#C9A66B]" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
