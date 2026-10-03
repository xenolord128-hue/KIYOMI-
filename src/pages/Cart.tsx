import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft,
  ShieldCheck,
  Truck,
  ArrowRight
} from 'lucide-react';
import { playCinematicIntroSound } from '../utils/voiceUtils';
import { useLanguage } from '../contexts/LanguageContext';

export const Cart: React.FC = () => {
  const { 
    cartItems, 
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
    navigate('/checkout');
    playCinematicIntroSound("Proceeding to checkout.");
  };

  const totalDiscount = Math.round(totalBeforeDiscount * (discountPercentage / 100));

  return (
    <div id="cart-page-stage" className="min-h-screen bg-[#F8F3EA] text-[#111827] py-10 md:py-16 text-left">
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link 
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-mono tracking-wider text-[#0A1E54] uppercase font-bold hover:text-[#1A3070] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>

        {/* Page Title */}
        <div className="border-b border-[#0A1E54]/10 pb-5 mb-8">
          <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#C9A66B] uppercase block">
            PATOWARY FASHION
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#0A1E54] uppercase mt-1">
            Your Shopping Bag
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="py-20 text-center space-y-4 glass-panel border border-white p-8 rounded-3xl max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-stone-200/60 flex items-center justify-center text-stone-400 mx-auto">
              <ShoppingBag className="w-8 h-8 text-[#0A1E54]" />
            </div>
            <h3 className="text-base font-bold text-[#0A1E54]">
              Your Bag is Currently Empty
            </h3>
            <p className="text-stone-600 text-xs font-sans max-w-sm mx-auto leading-relaxed">
              Discover our latest trending baggy cargo pants, oversized tees, hoodies, and accessories.
            </p>
            <button
              onClick={() => navigate('/products')}
              className="bg-[#0A1E54] hover:bg-[#1A3070] text-[#F8F3EA] text-xs font-mono tracking-wider uppercase font-bold py-3 px-8 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Browse Collections
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Col: Cart items list */}
            <div className="lg:col-span-7 space-y-4">
              {cartItems.map((item) => (
                <div 
                  key={`${item.product.id}-${item.selectedVariant}`} 
                  className="glass-card p-4 sm:p-5 flex gap-4 sm:gap-6 rounded-2xl border border-white transition-all shadow-xs"
                >
                  <div className="w-22 h-26 sm:w-26 sm:h-30 shrink-0 bg-stone-100 rounded-xl overflow-hidden relative">
                    <img 
                      src={item.product.assets[0]} 
                      alt={item.product.title} 
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  <div className="flex-grow flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm sm:text-base font-semibold text-[#111827] line-clamp-1">
                          <Link to={`/product/${item.product.id}`} className="hover:text-[#0A1E54]">
                            {item.product.title}
                          </Link>
                        </h3>
                        <button 
                          onClick={() => removeFromCart(item.product.id, item.selectedVariant)}
                          className="text-stone-400 hover:text-red-600 p-1 rounded transition-colors shrink-0 cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[11px] font-mono text-stone-500 uppercase mt-1">
                        Size: <span className="text-[#0A1E54] font-bold bg-[#F8F3EA] px-2 py-0.5 rounded border border-stone-200">{item.selectedVariant}</span>
                      </p>
                      <p className="text-xs sm:text-sm font-bold font-mono text-[#0A1E54] mt-1.5">
                        BDT {item.product.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-stone-100 pt-3 mt-3">
                      <div className="flex items-center border border-stone-300 rounded-lg bg-white">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedVariant, item.quantity - 1)}
                          className="px-2.5 py-1 hover:bg-stone-100 text-xs font-mono transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 py-0.5 text-xs font-mono font-bold text-[#0A1E54]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedVariant, item.quantity + 1)}
                          className="px-2.5 py-1 hover:bg-stone-100 text-xs font-mono transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs sm:text-sm font-mono font-bold text-[#0A1E54]">
                        BDT {(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Col: Order Summary */}
            <div className="lg:col-span-5">
              <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-white shadow-sm space-y-6">
                <h2 className="text-base font-serif font-bold text-[#0A1E54] border-b border-[#0A1E54]/10 pb-3">
                  Order Summary
                </h2>

                {/* Promo Code Form */}
                <form onSubmit={handlePromoSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="PROMO CODE (e.g. PATOWARY10)"
                    className="flex-1 px-3.5 py-2.5 text-xs font-mono rounded-xl border border-stone-300 focus:border-[#0A1E54] uppercase bg-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#0A1E54] hover:bg-[#1A3070] text-white text-xs font-bold uppercase rounded-xl transition-all cursor-pointer"
                  >
                    Apply
                  </button>
                </form>

                {promoError && (
                  <p className="text-[11px] text-red-600 font-mono">{promoError}</p>
                )}

                {promoCode && (
                  <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                    <span>Coupon <strong>{promoCode}</strong> applied ({discountPercentage}% OFF)</span>
                  </div>
                )}

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal</span>
                    <span>BDT {totalBeforeDiscount.toLocaleString()}</span>
                  </div>

                  {discountPercentage > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Discount ({discountPercentage}%)</span>
                      <span>- BDT {totalDiscount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-stone-600">
                    <span>Delivery Charge</span>
                    <span>{deliveryCharge === 0 ? <strong className="text-emerald-700">FREE</strong> : `BDT ${deliveryCharge}`}</span>
                  </div>

                  <div className="flex justify-between text-base font-bold text-[#0A1E54] pt-3 border-t border-stone-200">
                    <span>Total Amount</span>
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

                <div className="flex items-center justify-center gap-2 text-stone-500 text-[11px] pt-1">
                  <ShieldCheck className="w-4 h-4 text-[#0A1E54]" />
                  <span>100% Secure Checkout & Cash On Delivery</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
