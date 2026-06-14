import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Sparkles, 
  Truck, 
  CreditCard, 
  ArrowLeft,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { playCinematicIntroSound } from '../utils/voiceUtils';

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
  const [promoInput, setPromoInput] = useState('');

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    applyPromo(promoInput);
    setPromoInput('');
  };

  const handleCheckoutClick = () => {
    navigate('/checkout');
    playCinematicIntroSound("Initializing secure payment portal. Please supply shipping details.");
  };

  const totalDiscount = Math.round(totalBeforeDiscount * (discountPercentage / 100));

  return (
    <div id="cart-page-stage" className="min-h-screen bg-[#FDFBF7] py-12 md:py-16 selection:bg-[#0F2C2E] selection:text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-12">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link 
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#2d728f] uppercase font-bold hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Custom Browsing
          </Link>
        </div>

        {/* Page Title */}
        <div className="border-b border-stone-200 pb-6 mb-10">
          <h1 className="text-2xl sm:text-3xl font-serif tracking-[0.25em] text-[#0f2c2e] uppercase font-light">
            YOUR OVERVIEW BAG
          </h1>
          <p className="text-[10px] sm:text-xs font-mono tracking-widest text-stone-500 uppercase mt-2">
            KIYOMI CLOTHIERS COLLECTIVE &bull; LOCAL PERSISTENT STORAGE REGISTER
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="py-20 text-center space-y-6 bg-white/40 border border-stone-200/50 p-8 rounded">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-xs font-mono tracking-widest uppercase font-bold text-[#0f2c2e]">YOUR BAG IS CURRENTLY EMPTY</h3>
            <p className="text-stone-500 text-xs font-sans max-w-sm mx-auto leading-relaxed">
              Experience authentic heavyweight construction, anatomical paneling and vintage wash overlays. Explore our premium drops catalog to make an acquisition.
            </p>
            <button
              onClick={() => navigate('/products')}
              className="border border-[#0f2c2e] hover:bg-[#0f2c2e] hover:text-[#fbf9f5] text-[#0f2c2e] text-[10px] font-mono tracking-widest uppercase font-bold py-3 px-8 rounded transition-all transform hover:scale-[1.02]"
            >
              BROWSE CATALOG CATEGORIES
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Col: Cart item cards list */}
            <div className="lg:col-span-7 space-y-4">
              {cartItems.map((item) => (
                <div 
                  key={`${item.product.id}-${item.selectedVariant}`} 
                  className="bg-white border border-stone-200/65 p-4 sm:p-5 flex gap-4 sm:gap-6 rounded transition-all duration-300 hover:shadow-md"
                >
                  {/* Aspect ratio bounding for item preview */}
                  <div className="w-24 h-28 sm:w-28 sm:h-32 shrink-0 bg-stone-100 overflow-hidden relative">
                    <img 
                      src={item.product.assets[0]} 
                      alt={item.product.title} 
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Description meta detail layout */}
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm sm:text-base font-serif font-semibold text-[#0f2c2e] tracking-tight hover:text-[#2d728f] transition-all">
                          <Link to={`/product/${item.product.id}`}>
                            {item.product.title}
                          </Link>
                        </h3>
                        <button 
                          onClick={() => removeFromCart(item.product.id, item.selectedVariant)}
                          className="text-stone-400 hover:text-amber-800 p-1 rounded hover:bg-stone-50 transition-colors shrink-0"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[10px] font-mono tracking-widest text-[#2d728f] uppercase font-bold mt-1.5 flex items-center gap-1.5">
                        SIZE CODE: <span className="text-[#0f2c2e] font-bold bg-[#eae5db]/60 px-2.5 py-0.5 rounded text-[9px]">{item.selectedVariant}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-stone-100/80 pt-3 mt-3">
                      {/* Quantity Controller buttons */}
                      <div className="flex items-center border border-stone-300 rounded text-stone-600 bg-white">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedVariant, item.quantity - 1)}
                          className="px-2.5 py-1.5 hover:bg-stone-50 text-xs font-mono transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3.5 py-0.5 text-xs font-mono font-bold text-[#0f2c2e]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedVariant, item.quantity + 1)}
                          className="px-2.5 py-1.5 hover:bg-stone-50 text-xs font-mono transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] font-mono text-stone-400 block tracking-wide">SUBTOTAL</span>
                        <span className="text-xs sm:text-sm font-mono tracking-wider text-[#0f2c2e] font-bold">
                          BDT {item.product.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Col: Calculations receipts and checkout anchors */}
            <div className="lg:col-span-5 bg-white border border-stone-200/80 p-6 sm:p-8 space-y-6">
              
              {/* Box Header */}
              <h3 className="text-xs font-mono tracking-[0.2em] uppercase font-extrabold text-[#0f2c2e] pb-3 border-b">
                INVOICE MATRIX
              </h3>

              {/* Promo Code Submission Form */}
              <div>
                <span className="block text-[9px] font-mono text-stone-500 uppercase font-bold tracking-widest mb-2">
                  CLAIM PREMIUM VOUCHER
                </span>
                <form onSubmit={handlePromoSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="E.G. KIYOMIVIP"
                    className="flex-grow bg-[#FDFBF7] border border-stone-300 rounded text-xs px-3 py-2.5 uppercase font-mono tracking-wider focus:outline-none focus:border-[#2d728f]"
                  />
                  <button
                    type="submit"
                    className="bg-[#0f2c2e] text-white text-[10px] items-center font-mono tracking-widest px-5 py-2.5 hover:bg-[#1a4e52] transition-colors rounded font-bold cursor-pointer shrink-0 uppercase"
                  >
                    APPLY
                  </button>
                </form>

                {promoCode && (
                  <div className="mt-2 text-emerald-800 font-mono text-[10px] tracking-widest uppercase bg-emerald-50 px-3 py-2 rounded border border-emerald-300/30 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> CODE [{promoCode}] RECOGNIZED - {discountPercentage}% GRANTED
                  </div>
                )}
                {promoError && (
                  <p className="mt-2 text-amber-800 text-[10px] font-mono tracking-widest uppercase font-semibold">
                    {promoError}
                  </p>
                )}
              </div>

              {/* Calculations receipts */}
              <div className="space-y-3.5 text-xs font-mono border-t border-b border-stone-100 py-4">
                <div className="flex justify-between text-stone-600">
                  <span>SPECIMENS CLOTHING TOTAL</span>
                  <span>BDT {totalBeforeDiscount}</span>
                </div>
                {discountPercentage > 0 && (
                  <div className="flex justify-between text-emerald-800 font-semibold bg-emerald-50/50 p-2 rounded">
                    <span>DISCOUNT ({discountPercentage}%)</span>
                    <span>- BDT {totalDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600 items-center">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-stone-400" /> COURIER DELIVERY
                  </span>
                  <span>{deliveryCharge === 0 ? 'FREE DELIVERY' : `BDT ${deliveryCharge}`}</span>
                </div>
                
                <div className="flex justify-between text-[#0f2c2e] font-extrabold text-sm border-t border-dashed border-stone-200 pt-3 mt-1">
                  <span>ESTIMATED BILL INVOICE</span>
                  <span>BDT {totalPrice}</span>
                </div>
              </div>

              {/* Action buttons */}
              <button
                onClick={handleCheckoutClick}
                className="w-full bg-[#0F2C2E] hover:bg-[#1b4e52] text-white text-xs font-mono tracking-[0.25em] uppercase font-bold py-4 rounded flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/10 cursor-pointer hover:scale-[1.01] transition-all"
              >
                <CreditCard className="w-4 h-4" /> PROCEED TO PAYMENT
              </button>

              <div className="flex items-center justify-center gap-2 text-[9px] font-mono text-stone-400 mt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" /> Secure Checkout Encryption Certified
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
