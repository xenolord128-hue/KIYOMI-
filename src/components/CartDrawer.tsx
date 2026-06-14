import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, Tag, Truck, Sparkles, CreditCard, ShoppingBag } from 'lucide-react';
import { playCinematicIntroSound } from '../utils/voiceUtils';

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
    playCinematicIntroSound("Initializing secure payment portal. Please supply shipping details.");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Sliding Cart Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full sm:max-w-md bg-[#fbf9f5] flex flex-col shadow-2xl selection:bg-emerald-800 selection:text-[#fbf9f5]"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#0f2c2e]" />
                <h2 className="text-sm font-mono tracking-widest uppercase font-bold text-[#0f2c2e]">YOUR CART BAG</h2>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 bg-stone-100 hover:bg-red-500 hover:text-white border border-stone-200 rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer text-[#0f2c2e] flex items-center justify-center p-1.5 shrink-0 shadow-xs"
                aria-label="Close cart"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cart Contents Scroll */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-xs font-mono tracking-widest uppercase font-bold text-[#0f2c2e]">BAG IS EMPTY</h3>
                  <p className="text-[#0f2c2e]/60 text-xs font-sans max-w-xs">
                    Explore the collections to purchase custom designed premium smart gadgets and premium devices.
                  </p>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/products');
                    }}
                    className="border border-[#0f2c2e] hover:bg-[#0f2c2e] hover:text-[#fbf9f5] text-[#0f2c2e] text-[10px] font-mono tracking-widest uppercase font-bold py-2.5 px-6 rounded transition-colors cursor-pointer"
                  >
                    SHOP COLLECTION
                  </button>
                </div>
              ) : (
                cartItems.map((item, index) => (
                  <div key={`${item.product.id}-${item.selectedVariant}`} className="flex gap-4 border-b border-stone-100 pb-4">
                    {/* Item Image */}
                    <img 
                      src={item.product.assets[0]} 
                      alt={item.product.title} 
                      className="w-20 h-24 object-cover object-center bg-stone-100 rounded"
                    />

                    {/* Meta and Editors */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-serif text-[#0f2c2e] font-semibold tracking-wide">
                            {item.product.title}
                          </h4>
                          <button 
                            onClick={() => removeFromCart(item.product.id, item.selectedVariant)}
                            className="text-stone-400 hover:text-amber-800 p-0.5 transition-colors cursor-pointer"
                            title="Delete item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[10px] font-mono text-stone-500 uppercase tracking-widest mt-1">
                          SIZE: <span className="text-[#0f2c2e] font-bold bg-[#eae5db]/60 px-2 py-0.5 rounded text-[9px]">{item.selectedVariant}</span>
                        </p>
                      </div>

                      {/* Quantity Modifier */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-stone-300 rounded text-stone-600 bg-white">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.selectedVariant, item.quantity - 1)}
                            className="px-2 py-1 hover:bg-stone-50 text-xs font-mono transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 py-0.5 text-xs font-mono font-bold text-[#0f2c2e]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.selectedVariant, item.quantity + 1)}
                            className="px-2 py-1 hover:bg-stone-50 text-xs font-mono transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-mono tracking-wider text-[#0f2c2e] font-bold">
                          BDT {item.product.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Calculations & Checkout */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-stone-200 bg-[#eae5db]/30 space-y-4">
                
                {/* Coupon Code Entry */}
                <form onSubmit={handlePromoSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="PROMOCODE, E.G., KIYOMIVIP"
                    className="flex-1 bg-white border border-stone-300 rounded text-xs px-3 py-2 uppercase font-mono tracking-wider focus:outline-none focus:border-emerald-800"
                  />
                  <button
                    type="submit"
                    className="bg-[#0f2c2e] text-white text-[10px] items-center gap-1 font-mono tracking-widest px-4 py-2 hover:bg-[#1b4345] transition-colors rounded font-semibold cursor-pointer shrink-0"
                  >
                    APPLY
                  </button>
                </form>

                {/* Promo Code Alerts */}
                {promoCode && (
                  <div className="flex items-center gap-1.5 text-emerald-800 font-mono text-[10px] tracking-widest uppercase bg-emerald-50 px-3 py-1.5 rounded border border-emerald-300/30">
                    <Sparkles className="w-3.5 h-3.5" /> CODE [{promoCode}] SAVED {discountPercentage}% OFF Subtotal
                  </div>
                )}
                {promoError && (
                  <p className="text-amber-800 text-[10px] font-mono tracking-widest uppercase">{promoError}</p>
                )}

                {/* Summary Matrix */}
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-stone-600">
                    <span>BAC SUBTOTAL</span>
                    <span>BDT {totalBeforeDiscount}</span>
                  </div>
                  {discountPercentage > 0 && (
                    <div className="flex justify-between text-emerald-800 font-semibold">
                      <span>DISCOUNT ({discountPercentage}%)</span>
                      <span>- BDT {Math.round(totalBeforeDiscount * (discountPercentage / 100))}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-stone-600 items-center">
                    <span className="flex items-center gap-1 text-[10px]">
                      <Truck className="w-3.5 h-3.5" /> DELIVERY SHIPPING
                    </span>
                    <span>{deliveryCharge === 0 ? 'FREE' : `BDT ${deliveryCharge}`}</span>
                  </div>
                  
                  {/* Total price */}
                  <div className="flex justify-between text-[#0f2c2e] font-bold text-sm border-t border-stone-300/50 pt-2 mt-2">
                    <span>GRAND INVOICE TOTAL</span>
                    <span>BDT {totalPrice}</span>
                  </div>
                </div>

                {/* Checkout Trigger */}
                <button
                  onClick={handleCheckoutClick}
                  className="w-full bg-emerald-800 hover:bg-[#0f2c2e] text-white text-xs font-mono tracking-[0.25em] uppercase font-bold py-3.5 rounded flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/10 cursor-pointer hover:scale-[1.01] transition-all"
                >
                  <CreditCard className="w-4 h-4" /> PROCEED TO CHECKOUT
                </button>
                <div className="text-center">
                  <span className="text-[8px] font-mono text-stone-400">
                    FREE SHIPPING THRESHOLD OVER BDT 5000 APPLIES WORLDWIDE
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
