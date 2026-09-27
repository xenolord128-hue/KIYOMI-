import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { RAW_PRODUCTS } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { playCinematicIntroSound } from '../utils/voiceUtils';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Package, 
  Share2, 
  Copy, 
  X, 
  Truck, 
  RotateCcw, 
  ShieldCheck,
  Check,
  Facebook,
  MessageCircle,
  AlertCircle
} from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';
import { Product, Review } from '../types';
import { sendFormViaEmailJS } from '../lib/emailjs';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, toggleCart } = useCart();
  const { t } = useLanguage();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const productId = Number(id);

  const [product, setProduct] = useState<Product | null>(() => {
    const localStatic = RAW_PRODUCTS.find(p => p.id === productId);
    if (localStatic) return localStatic;
    
    const cachedStr = localStorage.getItem('patowary_local_products');
    if (cachedStr) {
      try {
        const cachedArr = JSON.parse(cachedStr);
        const match = cachedArr.find((p: any) => p.id === productId);
        if (match) return match;
      } catch (e) {}
    }
    return null;
  });

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [sharedCopied, setSharedCopied] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState('');
  
  // Review Submission
  const [revName, setRevName] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState('');
  const [revSuccess, setRevSuccess] = useState(false);
  const [revSubmitting, setRevSubmitting] = useState(false);
  const [revError, setRevError] = useState<string | null>(null);

  // Firestore sync for current product
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'products', String(productId)), (docSnap) => {
      if (docSnap.exists()) {
        setProduct(docSnap.data() as Product);
      }
    }, () => {});
    return () => unsub();
  }, [productId]);

  // Load "Recently Viewed Items"
  useEffect(() => {
    if (!product) return;
    const stored = localStorage.getItem('patowary_recently_viewed');
    let viewedArr: number[] = [];
    if (stored) {
      try {
        viewedArr = JSON.parse(stored);
      } catch (err) {}
    }
    viewedArr = viewedArr.filter(item => item !== product.id);
    viewedArr.unshift(product.id);
    localStorage.setItem('patowary_recently_viewed', JSON.stringify(viewedArr.slice(0, 6)));
  }, [product]);

  const recentlyViewed = useMemo(() => {
    const stored = localStorage.getItem('patowary_recently_viewed');
    if (!stored) return [];
    try {
      const ids: number[] = JSON.parse(stored);
      const idSet = ids.filter(itemId => itemId !== productId);
      return RAW_PRODUCTS.filter(p => idSet.includes(p.id));
    } catch (err) {
      return [];
    }
  }, [productId]);

  useEffect(() => {
    if (product) {
      const available = product.variants.find(v => !product.outOfStock.includes(v));
      setSelectedVariant(available || product.variants[0] || 'Standard');
      setActiveImageIdx(0);
    }
  }, [product]);

  const handleAddToCartClick = () => {
    if (!product) return;
    addToCart(product, selectedVariant, 1);
    playCinematicIntroSound(`${product.title} added to your bag`);
    toggleCart();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setSharedCopied(true);
      setTimeout(() => setSharedCopied(false), 2000);
      playCinematicIntroSound("Product link copied to clipboard");
    });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (revSubmitting) return;
    if (!product || !revName.trim() || !revComment.trim()) return;

    setRevSubmitting(true);
    setRevError(null);

    // Dynamic submission to EmailJS
    const emailResult = await sendFormViaEmailJS({
      formType: 'Product Review Form',
      name: revName.trim(),
      message: revComment.trim(),
      productOrService: product.title,
      productId: product.id,
      price: `BDT ${product.price}`,
      subject: `New Review for ${product.title} (${revRating} Stars)`,
      customFields: {
        'Rating Stars': `${revRating} / 5 Stars`,
        'Product Title': product.title,
        'Product Category': product.category,
        'Product Price': `BDT ${product.price}`,
      },
    });

    if (!emailResult.success) {
      console.error('[EmailJS] Product review transmission failed:', emailResult.error);
      setRevError(emailResult.error || 'Unable to submit your information right now. Please try again.');
      setRevSubmitting(false);
      return;
    }

    const newReview: Review = {
      id: Date.now(),
      userName: revName.trim(),
      rating: revRating,
      comment: revComment.trim()
    };

    try {
      await updateDoc(doc(db, 'products', String(productId)), {
        reviews: arrayUnion(newReview)
      });
      setProduct(prev => prev ? { ...prev, reviews: [...prev.reviews, newReview] } : prev);
      setRevSuccess(true);
      setRevName('');
      setRevComment('');
      playCinematicIntroSound("Thank you for reviewing Patowary Fashion!");
      setTimeout(() => setRevSuccess(false), 4000);
    } catch (err) {
      // Local fallback
      setProduct(prev => prev ? { ...prev, reviews: [...prev.reviews, newReview] } : prev);
      setRevSuccess(true);
      setRevName('');
      setRevComment('');
      setTimeout(() => setRevSuccess(false), 4000);
    } finally {
      setRevSubmitting(false);
    }
  };

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <h3 className="text-sm font-mono tracking-widest uppercase text-stone-500">PRODUCT NOT FOUND</h3>
        <p className="text-xl font-serif">The requested fashion item could not be retrieved.</p>
        <Link to="/products" className="inline-block bg-[#0A1E54] text-white py-3 px-8 text-xs font-mono tracking-widest uppercase rounded-xl">
          RETURN TO CATALOG
        </Link>
      </div>
    );
  }

  const isWish = isInWishlist(product.id);

  return (
    <div className="bg-[#F8F3EA] min-h-screen text-[#111827] pb-24 font-sans text-left">
      
      {/* Breadcrumb row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5 border-b border-[#0A1E54]/10 flex items-center justify-between">
        <Link 
          to="/products"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#0A1E54] hover:text-[#1A3070] transition-colors uppercase font-mono tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t("Back to Collection", "সব প্রোডাক্টে ফিরুন")}</span>
        </Link>
        <span className="text-xs text-stone-500 font-mono hidden sm:inline">
          PATOWARY FASHION / {product.category.toUpperCase()}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Side: Images Gallery (7-cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden rounded-2xl shadow-sm border border-stone-200">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImageIdx}
                src={product.assets[activeImageIdx]}
                alt={product.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover object-center"
              />
            </AnimatePresence>

            {product.assets.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIdx(prev => (prev - 1 + product.assets.length) % product.assets.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md text-[#0A1E54] cursor-pointer"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveImageIdx(prev => (prev + 1) % product.assets.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md text-[#0A1E54] cursor-pointer"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {product.assets.length > 1 && (
            <div className="flex flex-wrap gap-3">
              {product.assets.map((asset, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIdx(index)}
                  className={`w-18 sm:w-20 aspect-[4/5] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImageIdx === index 
                      ? 'border-[#0A1E54] scale-102 shadow-sm' 
                      : 'border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <img src={asset} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Details & Buying Actions (5-cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white shadow-sm space-y-6">
            
            <div className="space-y-3">
              <span className="text-[11px] font-mono tracking-widest text-[#0A1E54] uppercase font-bold bg-[#0A1E54]/10 px-3 py-1 rounded-md inline-block">
                {product.category}
              </span>
              
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0A1E54] leading-tight">
                  {product.title}
                </h1>
                
                <button
                  onClick={() => {
                    toggleWishlist(product);
                    playCinematicIntroSound(isWish ? "Removed from wishlist" : "Saved to wishlist");
                  }}
                  className="p-2.5 rounded-full border border-stone-200 hover:bg-white text-[#0A1E54] transition-all cursor-pointer shrink-0 shadow-xs"
                  aria-label="Toggle wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWish ? 'fill-red-500 text-red-500' : 'text-stone-400'}`} />
                </button>
              </div>

              <Link 
                to={`/product/${product.id}/reviews`}
                className="flex items-center gap-2.5 text-xs font-mono group"
                title={t("View all customer reviews on dedicated page", "রিভিউ পেজ দেখুন")}
              >
                <div className="flex items-center gap-1 text-[#C9A66B] font-bold">
                  <Star className="w-4 h-4 fill-current" />
                  <span>
                    {product.reviews.length > 0
                      ? `${(product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1)} / 5.0`
                      : t("No reviews yet", "রিভিউ নেই")}
                  </span>
                </div>
                <span className="text-stone-300">·</span>
                <span className="text-[#0A1E54] font-sans font-bold group-hover:text-[#C9A66B] transition-colors underline decoration-dotted">
                  {product.reviews.length} {t("Customer Reviews ↗", "গ্রাহকদের রিভিউ ↗")}
                </span>
              </Link>

              <div className="text-2xl sm:text-3xl font-mono font-bold text-[#0A1E54] pt-2">
                ৳ {product.price.toLocaleString()}
              </div>
            </div>

            {/* Sizing & Variants */}
            {product.variants.length > 0 && (
              <div className="space-y-2.5 pt-2 border-t border-stone-200/60">
                <div className="flex justify-between text-xs font-mono uppercase tracking-wider text-stone-600">
                  <span className="font-bold">{t("Select Size / Fit", "সাইজ বা ফিট নির্বাচন করুন")}</span>
                  <span className="text-[#C9A66B] font-semibold">{t("Size Guide", "সাইজ গাইড")}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => {
                    const isOut = product.outOfStock.includes(v);
                    const isSelected = selectedVariant === v;
                    return (
                      <button
                        key={v}
                        disabled={isOut}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                          isOut 
                            ? 'bg-stone-100 text-stone-400 border-stone-200 line-through opacity-60 cursor-not-allowed'
                            : isSelected
                              ? 'bg-[#0A1E54] text-white border-[#0A1E54] shadow-xs'
                              : 'bg-white text-stone-800 border-stone-300 hover:border-[#0A1E54]'
                        }`}
                      >
                        {v}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2 pt-2 border-t border-stone-200/60">
              <span className="text-xs font-mono uppercase tracking-wider text-stone-500 font-bold">
                {t("Product Description", "পণ্যের বিবরণ")}
              </span>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans">
                {product.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-stone-200/60">
              <button
                onClick={handleAddToCartClick}
                className="w-full bg-[#0A1E54] hover:bg-[#1A3070] text-[#F8F3EA] text-xs font-bold uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all hover:scale-[1.01] active:scale-98 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#C9A66B]" />
                <span>{t("ADD TO SHOPPING BAG", "ব্যাগে যোগ করুন")}</span>
              </button>

              <button
                onClick={() => setIsShareModalOpen(true)}
                className="w-full bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 text-xs font-semibold uppercase tracking-wider py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>{t("Share This Streetwear Fit", "শেয়ার করুন")}</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-stone-200/60 text-center text-[10px] font-sans text-stone-600">
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-[#0A1E54]" />
                <span>24-48h Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="w-4 h-4 text-[#0A1E54]" />
                <span>7-Day Exchange</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#0A1E54]" />
                <span>Cash On Delivery</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Community Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12 border-t border-[#0A1E54]/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Reviews list */}
          <div className="lg:col-span-7 space-y-6">
            <div className="border-b border-[#0A1E54]/10 pb-3 flex items-center justify-between">
              <h3 className="text-xl font-serif font-bold text-[#0A1E54]">
                {t("Customer Reviews", "গ্রাহকদের রিভিউ")} ({product.reviews.length})
              </h3>
              <Link 
                to={`/product/${product.id}/reviews`}
                className="px-3.5 py-1.5 rounded-full bg-white hover:bg-stone-50 border border-stone-200 text-xs font-mono font-bold text-[#0A1E54] hover:text-[#1A3070] transition-all flex items-center gap-1 shadow-xs"
              >
                {t("Full Review Page ↗", "সম্পূর্ণ রিভিউ পেজ ↗")}
              </Link>
            </div>

            {product.reviews.length === 0 ? (
              <p className="text-xs text-stone-500 italic">
                {t("No reviews yet. Be the first to review this fit!", "এখনো কোনো রিভিউ দেওয়া হয়নি। প্রথম রিভিউটি আপনি দিন!")}
              </p>
            ) : (
              <div className="space-y-4">
                {product.reviews.map((rev) => (
                  <div key={rev.id} className="glass-card p-5 rounded-2xl border border-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#111827]">{rev.userName}</span>
                      <div className="flex text-[#C9A66B]">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed font-sans">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Write a review form */}
          <div className="lg:col-span-5">
            <div className="glass-panel p-6 rounded-3xl border border-white shadow-sm space-y-4">
              <h4 className="text-base font-serif font-bold text-[#0A1E54]">
                {t("Write a Review", "রিভিউ দিন")}
              </h4>

              {revSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs">
                  {t("Thank you! Your review has been recorded.", "ধন্যবাদ! আপনার রিভিউটি যুক্ত হয়েছে।")}
                </div>
              )}

              {revError && (
                <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{revError}</span>
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-mono uppercase text-stone-600 block mb-1">{t("Your Name", "আপনার নাম")}</label>
                  <input
                    type="text"
                    required
                    value={revName}
                    onChange={(e) => setRevName(e.target.value)}
                    placeholder="e.g. Tanvir Hossain"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#0A1E54] text-xs bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-stone-600 block mb-1">{t("Rating", "রেটিং")}</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRevRating(star)}
                        className={`p-1 text-lg cursor-pointer ${star <= revRating ? 'text-[#C9A66B]' : 'text-stone-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-stone-600 block mb-1">{t("Your Experience", "আপনার অভিজ্ঞতা")}</label>
                  <textarea
                    required
                    rows={3}
                    value={revComment}
                    onChange={(e) => setRevComment(e.target.value)}
                    placeholder={t("Share details on fabric, fit, and styling...", "কাপড়, সাইজ ও ফিটিং সম্পর্কে জানান...")}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#0A1E54] text-xs bg-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={revSubmitting}
                  className={`w-full bg-[#0A1E54] hover:bg-[#1A3070] text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition-all shadow-sm cursor-pointer ${
                    revSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {revSubmitting
                    ? t("Submitting Review...", "রিভিউ পাঠানো হচ্ছে...")
                    : t("Submit Review", "রিভিউ জমা দিন")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Share Modal */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl relative space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <h4 className="text-sm font-bold text-[#0A1E54]">
                  {t("Share Patowary Fashion Fit", "পাটোয়ারী ফ্যাশন শেয়ার করুন")}
                </h4>
                <button
                  onClick={() => setIsShareModalOpen(false)}
                  className="p-1 rounded-full hover:bg-stone-100 text-stone-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex gap-3 bg-[#F8F3EA] p-3 rounded-xl">
                <img src={product.assets[0]} alt={product.title} className="w-14 h-16 object-cover rounded-lg" />
                <div className="min-w-0">
                  <h5 className="text-xs font-semibold text-[#0A1E54] truncate">{product.title}</h5>
                  <span className="text-xs font-mono font-bold text-[#C9A66B]">৳ {product.price.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 py-2.5 bg-[#0A1E54] hover:bg-[#1A3070] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {sharedCopied ? <Check className="w-4 h-4 text-[#C9A66B]" /> : <Copy className="w-4 h-4" />}
                  <span>{sharedCopied ? t("Link Copied!", "কপি হয়েছে!") : t("Copy Link", "লিংক কপি")}</span>
                </button>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Check out ${product.title} on Patowary Fashion: ${window.location.href}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center text-xs font-semibold"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
