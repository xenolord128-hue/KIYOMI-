import React from 'react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Trash2, ArrowLeft, ShoppingBag, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { playCinematicIntroSound } from '../utils/voiceUtils';

export const Wishlist: React.FC = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart, toggleCart } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleQuickAdd = (product: any) => {
    const availableVariant = product.variants.find((v: string) => !product.outOfStock.includes(v)) || product.variants[0] || 'Standard';
    addToCart(product, availableVariant, 1);
    playCinematicIntroSound(`${product.title} added to bag`);
    toggleCart();
  };

  return (
    <div id="wishlist-page-stage" className="min-h-screen bg-[#F8F3EA] text-[#111827] py-10 md:py-16 text-left">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link 
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-mono tracking-wider text-[#0A1E54] uppercase font-bold hover:text-[#1A3070] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {t("Continue Shopping", "কেনাকাটা চালিয়ে যান")}
          </Link>
        </div>

        {/* Header section */}
        <div className="border-b border-[#0A1E54]/10 pb-5 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#C9A66B] uppercase block">
              PATOWARY FASHION
            </span>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#0A1E54] uppercase mt-1">
              {t("Saved Fits & Wishlist", "পছন্দের তালিকা")}
            </h1>
          </div>
          <span className="text-xs font-mono text-stone-500">
            {wishlist.length} {t("ITEMS SAVED", "পণ্য সংরক্ষিত")}
          </span>
        </div>

        {wishlist.length === 0 ? (
          <div className="py-20 text-center space-y-4 glass-panel border border-white p-8 rounded-3xl max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-400 mx-auto">
              <Heart className="w-8 h-8 fill-rose-200" />
            </div>
            <h3 className="text-base font-bold text-[#0A1E54]">
              {t("Your Wishlist is Empty", "আপনার পছন্দের তালিকাটি খালি")}
            </h3>
            <p className="text-stone-600 text-xs font-sans max-w-sm mx-auto leading-relaxed">
              {t("Browse our trending baggy pants, oversized tees, hoodies, and accessories to save your favorite fits.", "আমাদের ট্রেন্ডিং স্ট্রিটওয়্যার ব্রাউজ করে পছন্দের পণ্য সেভ করুন।")}
            </p>
            <button
              onClick={() => navigate('/products')}
              className="bg-[#0A1E54] hover:bg-[#1A3070] text-[#F8F3EA] text-xs font-mono tracking-wider uppercase font-bold py-3 px-8 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              {t("Explore Catalog", "ক্যাটালগ দেখুন")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlist.map((product) => (
              <div 
                key={product.id}
                className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group border border-white hover:border-[#C9A66B]/50 shadow-xs transition-all"
              >
                <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden">
                  <Link to={`/product/${product.id}`} className="block w-full h-full">
                    <img 
                      src={product.assets[0]} 
                      alt={product.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 hover:bg-white text-red-500 shadow-xs transition-all cursor-pointer"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-stone-500 font-bold block mb-1">
                      {product.category}
                    </span>
                    <h3 className="text-xs sm:text-sm font-semibold text-[#111827] line-clamp-1">
                      <Link to={`/product/${product.id}`} className="hover:text-[#0A1E54]">
                        {product.title}
                      </Link>
                    </h3>
                    <p className="text-sm font-bold font-mono text-[#0A1E54] mt-2">
                      ৳ {product.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-stone-100 flex gap-2">
                    <button
                      onClick={() => handleQuickAdd(product)}
                      className="w-full py-2.5 bg-[#0A1E54] hover:bg-[#1A3070] text-white text-xs font-bold uppercase rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#C9A66B]" />
                      <span>{t("Add to Bag", "ব্যাগে যোগ করুন")}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
