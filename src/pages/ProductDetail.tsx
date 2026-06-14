import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { playCinematicIntroSound } from '../utils/voiceUtils';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  CheckCircle, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Package, 
  ExternalLink,
  MessageSquare,
  Share2,
  Copy,
  X
} from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, onSnapshot, updateDoc, setDoc } from 'firebase/firestore';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const productId = Number(id);

  // Firestore sync for current modifications
  const [dbProducts, setDbProducts] = useState(PRODUCTS);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [sharedCopied, setSharedCopied] = useState(false);

  const handleShareProduct = () => {
    setIsShareModalOpen(true);
    playCinematicIntroSound("Opening social sharing panel.");
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => {
        setSharedCopied(true);
        setTimeout(() => setSharedCopied(false), 2500);
        playCinematicIntroSound("Product link copied successfully.");
      })
      .catch((err) => {
        console.error("Error copy link: ", err);
      });
  };

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'products', String(productId)), (docSnap) => {
      if (docSnap.exists()) {
        const prodData = docSnap.data();
        setDbProducts(prev => {
          const idx = prev.findIndex(p => p.id === productId);
          if (idx > -1) {
            const updated = [...prev];
            updated[idx] = prodData as any;
            return updated;
          }
          return prev;
        });
      }
    });
    return () => unsub();
  }, [productId]);

  const product = useMemo(() => {
    return dbProducts.find(p => p.id === productId) || PRODUCTS.find(p => p.id === productId);
  }, [dbProducts, productId]);

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  
  // Review Submission Forms
  const [revName, setRevName] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState('');
  const [revSuccess, setRevSuccess] = useState(false);

  // Load "Recently Viewed Items" from localStorage
  useEffect(() => {
    if (!product) return;
    const stored = localStorage.getItem('KIYOMI_recently_viewed') || localStorage.getItem('dorax_recently_viewed');
    let viewedArr: number[] = [];
    if (stored) {
      try {
        viewedArr = JSON.parse(stored);
      } catch (err) {}
    }
    // Filter out the current ID first, then insert it at start
    viewedArr = viewedArr.filter(item => item !== product.id);
    viewedArr.unshift(product.id);
    // Boundary of up to 4 viewed items
    localStorage.setItem('KIYOMI_recently_viewed', JSON.stringify(viewedArr.slice(0, 5)));
  }, [product]);

  const recentlyViewed = useMemo(() => {
    const stored = localStorage.getItem('KIYOMI_recently_viewed') || localStorage.getItem('dorax_recently_viewed');
    if (!stored) return [];
    try {
      const ids: number[] = JSON.parse(stored);
      // Filter out duplicate view and fetch complete items (excluding current product)
      const idSet = ids.filter(itemId => itemId !== productId);
      return PRODUCTS.filter(p => idSet.includes(p.id));
    } catch (err) {
      return [];
    }
  }, [productId]);

  // Set default size variant on mount or change
  useEffect(() => {
    if (product) {
      // Choose first size which is NOT out of stock
      const availableSize = product.variants.find(v => !product.outOfStock.includes(v));
      setSelectedSize(availableSize || product.variants[0] || '');
      setActiveImageIdx(0);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <h3 className="text-sm font-mono tracking-widest uppercase text-stone-500">SPECIMEN UNINDEXED</h3>
        <p className="text-xl font-serif">The requested product could not be retrieved from products database.</p>
        <Link to="/products" className="inline-block bg-[#0f2c2e] text-white py-3 px-8 text-xs font-mono tracking-widest uppercase">
          RETURN TO CATALOC
        </Link>
      </div>
    );
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName.trim() || !revComment.trim()) return;

    const newReview = {
      id: Date.now(),
      userName: revName,
      rating: revRating,
      comment: revComment
    };

    // Calculate updated metrics
    const updatedReviews = [...product.reviews, newReview];
    const totalRating = updatedReviews.reduce((sum, rev) => sum + rev.rating, 0);
    const avgRating = Math.round((totalRating / updatedReviews.length) * 10) / 10;

    // Save to Firestore representation safely
    const productRef = doc(db, 'products', String(product.id));
    try {
      await setDoc(productRef, {
        ...product,
        reviews: updatedReviews,
        rating: avgRating
      }, { merge: true });
    } catch (err) {
      console.warn("Submitting review to Firestore skipped (mock fallback active).");
      // Fallback local memory sync
      product.reviews = updatedReviews;
      product.rating = avgRating;
    }

    setRevSuccess(true);
    playCinematicIntroSound("Review submitted successfully. Thank you for your feedback.");
    setRevName('');
    setRevComment('');
    setTimeout(() => setRevSuccess(false), 3000);
  };

  const handleAddToCartClick = () => {
    if (!selectedSize) return;
    addToCart(product, selectedSize);
    playCinematicIntroSound(`Added variant ${selectedSize} to your digital cart.`);
  };

  return (
    <div id="product-detail-page-wrapper" className="bg-[#fbf9f5] min-h-screen pb-24 selection:bg-emerald-800 selection:text-white">
      
      {/* Return Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link 
          to="/products"
          className="text-stone-500 hover:text-[#0f2c2e] text-xs font-mono uppercase tracking-widest flex items-center gap-2 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> BACK TO ALL COLLECTIONS
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side: Mock Image Carrousel (7-cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden rounded-lg shadow-sm border border-stone-200">
            {/* Main Picture Frame */}
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImageIdx}
                src={product.assets[activeImageIdx]}
                alt={product.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full object-cover object-center"
              />
            </AnimatePresence>

            {/* Quick slide arrow controllers */}
            {product.assets.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIdx(prev => (prev - 1 + product.assets.length) % product.assets.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full cursor-pointer shadow-md text-[#0f2c2e]"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveImageIdx(prev => (prev + 1) % product.assets.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full cursor-pointer shadow-md text-[#0f2c2e]"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail track selector */}
          {product.assets.length > 1 && (
            <div className="flex flex-wrap gap-2.5 sm:gap-4">
              {product.assets.map((asset, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIdx(index)}
                  className={`w-16 sm:w-20 aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${activeImageIdx === index ? 'border-emerald-800 scale-102 bg-stone-100/10 shadow-sm' : 'border-stone-200 hover:border-stone-400'}`}
                >
                  <img src={asset} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Meta Details (5-cols) */}
        <div className="lg:col-span-5 space-y-8">
          
          <div className="space-y-4">
            <span className="text-xs font-mono tracking-[0.2em] text-[#2d728f] uppercase font-bold bg-[#eae5db]/50 px-3 py-1 rounded inline-block">
              {product.category} RELEASES
            </span>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-xl sm:text-2xl font-serif font-extrabold text-[#0f2c2e] uppercase tracking-wide">
                {product.title}
              </h1>
              
              <button
                onClick={() => {
                  toggleWishlist(product);
                  playCinematicIntroSound(isInWishlist(product.id) ? "Removed from targets" : "Saved to wish targets");
                }}
                className="p-1.5 rounded-full border border-stone-200 hover:bg-stone-100 text-[#0f2c2e] transition-all cursor-pointer shrink-0"
                title="Toggle wish item"
              >
                <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-red-700 text-red-700 border-transparent' : 'text-stone-400'}`} />
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-0.5 text-yellow-600 font-bold">
                <Star className="w-4 h-4 fill-current text-yellow-500" />
                <span>{product.rating} / 5.0</span>
              </div>
              <span className="text-stone-300">|</span>
              <span className="text-stone-600 font-medium uppercase font-sans">{product.reviews.length} VERIFIED REVIEWS</span>
            </div>

            <div className="text-xl sm:text-2xl font-mono tracking-wide font-extrabold text-[#0f2c2e]">
              BDT {product.price}
            </div>
          </div>

          {/* Sizing options */}
          <div className="space-y-3.5">
            <div className="flex justify-between text-xs font-mono uppercase tracking-widest text-stone-500">
              <span className="font-bold">{t("SELECT COLOR / MODEL VARIANT")}</span>
              <span className="text-[#2d728f] underline font-sans cursor-pointer" onClick={() => playCinematicIntroSound("This premium gadget comes with 1 year official brand warranty.")}>Official Warranty</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => {
                const isOutOfStock = product.outOfStock.includes(v);
                return (
                  <button
                    key={v}
                    disabled={isOutOfStock}
                    onClick={() => setSelectedSize(v)}
                    className={`min-w-12 h-11 text-xs font-mono font-bold rounded flex items-center justify-center transition-all px-2 cursor-pointer ${isOutOfStock ? 'bg-stone-200 text-stone-400 border border-stone-100 line-through cursor-not-allowed opacity-60' : selectedSize === v ? 'bg-[#0f2c2e] text-white border-2 border-[#e5c158]' : 'bg-white text-[#0f2c2e] border border-stone-300 hover:border-[#0f2c2e]'}`}
                  >
                    {v}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Inventory status indicators */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-xs font-mono text-stone-700 bg-stone-100 p-4 border border-stone-200 rounded">
              <Package className="w-4.5 h-4.5 text-[#2d728f]" />
              <div>
                <span>STATUS: </span>
                {product.stock && product.stock > 0 ? (
                  <span className="text-emerald-800 font-bold">IN STOCK ({product.stock} LIMITS LEFT)</span>
                ) : (
                  <span className="text-rose-800 font-bold">SOLD OUT TEMPORARILY</span>
                )}
              </div>
            </div>

            {/* Main Add to Cart Option */}
            <button
              id="add-to-cart-detail"
              disabled={!selectedSize || (product.stock === 0)}
              onClick={handleAddToCartClick}
              className={`w-full text-white text-xs font-mono tracking-[0.25em] h-14 uppercase font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950/15 cursor-pointer ${!selectedSize || product.stock === 0 ? 'bg-stone-400 cursor-not-allowed' : 'bg-[#003E2C] hover:bg-emerald-900 hover:text-[#CBF23D] hover:scale-[1.01]'}`}
            >
              <ShoppingBag className="w-4 h-4 text-lime-neon animate-bounce" />
              <span>ADD TO CART</span>
            </button>

            {/* Wishlist & Dedicated Unique URL Share Options */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <button
                id="wishlist-detail-button"
                onClick={() => {
                  toggleWishlist(product);
                  playCinematicIntroSound(isInWishlist(product.id) ? "Removed from targets" : "Saved to wish targets");
                }}
                className={`h-13 border rounded-xl text-xs font-mono tracking-widest font-extrabold uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md ${
                  isInWishlist(product.id)
                    ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100/50'
                    : 'bg-white border-stone-300 hover:border-red-500 hover:text-red-600 text-[#0f2c2e] hover:bg-stone-50'
                }`}
              >
                <Heart className={`w-4 h-4 transition-transform duration-300 group-hover:scale-125 ${isInWishlist(product.id) ? 'fill-red-600 text-red-600 animate-pulse' : 'text-stone-400 hover:text-red-500'}`} />
                <span>{isInWishlist(product.id) ? 'WISHLISTED' : 'WISHLIST'}</span>
              </button>

              <button
                id="share-detail-button"
                onClick={handleShareProduct}
                className="h-13 border rounded-xl text-xs font-mono tracking-widest font-extrabold uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer bg-white border-stone-300 hover:border-[#003E2C] hover:text-[#003E2C] text-stone-800 hover:bg-stone-50 shadow-sm hover:shadow-md group"
              >
                <Share2 className="w-4 h-4 text-emerald-800 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                <span>SHARE LINK</span>
              </button>
            </div>
          </div>

          {/* Long Description and narrative */}
          <div className="border-t border-stone-200 pt-6 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#0f2c2e]">PRODUCT SPECIFICATION DETAILS</h4>
            <p className="text-stone-600 text-xs sm:text-sm font-sans leading-relaxed">
              {product.description}
            </p>
            <ul className="grid grid-cols-2 gap-4 text-[10px] font-mono tracking-widest text-[#0f2c2e] uppercase pt-2">
              <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-800" /> IP67 RESISTANCE STANDARD</li>
              <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-800" /> 1-YEAR BRAND WARRANTY</li>
              <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-800" /> REINFORCED CHASSIS MATTE BODY</li>
              <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-800" /> ORIGINAL SECURED PACKAGING</li>
            </ul>
          </div>

        </div>
      </div>

      {/* Reviews Block */}
      <section className="border-t border-stone-200 mt-16 py-16 bg-[#eae5db]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Reviews display track (7-cols) */}
            <div className="lg:col-span-7 space-y-6">
              <h3 className="text-sm font-mono tracking-widest uppercase font-bold text-[#0f2c2e] flex items-center gap-2">
                <MessageSquare className="w-4.5 h-4.5 text-[#2d728f]" /> CLIENT REVIEWS ({product.reviews.length})
              </h3>
              
              {product.reviews.length === 0 ? (
                <p className="text-stone-500 font-sans text-xs italic">No reviews submitted for this product yet. Be the first to verify this gadget.</p>
              ) : (
                <div className="space-y-4">
                  {product.reviews.map((rev) => (
                    <div key={rev.id} className="bg-white border border-stone-200 p-5 rounded-lg space-y-3 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold uppercase text-[#0f2c2e]">MAHAFUZUR RAHAMAN</span>
                        <div className="flex gap-0.5">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-[#e5c158] text-[#e5c158]" />
                          ))}
                        </div>
                      </div>
                      <p className="text-[#0f2c2e]/80 text-xs font-sans leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Leave a review form (5-cols) */}
            <div className="lg:col-span-5 bg-white border border-stone-200 p-6 rounded-lg shadow-sm space-y-4">
              <h3 className="text-xs font-mono tracking-widest uppercase font-bold text-[#0f2c2e]">WRITE VERIFIED REVIEW</h3>
              
              {revSuccess && (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded text-xs font-mono tracking-wider">
                  SUCCESS: REVIEW INJECTED SECURELY INTO PRODUCT METRICS
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-[#0f2c2e]">YOUR NAME</label>
                  <input
                    type="text"
                    required
                    value={revName}
                    onChange={(e) => setRevName(e.target.value)}
                    placeholder="E.G., SADMAN RAHMAN"
                    className="w-full bg-[#fbf9f5] border border-stone-350 p-2.5 rounded text-xs focus:outline-none focus:border-stone-500 font-mono tracking-wider"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-[#0f2c2e] mb-1">RATING SCORE</label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <button
                        type="button"
                        key={score}
                        onClick={() => setRevRating(score)}
                        className={`p-2 transition-transform hover:scale-[1.1]`}
                      >
                        <Star className={`w-6 h-6 ${score <= revRating ? 'fill-yellow-500 text-yellow-500' : 'text-stone-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-[#0f2c2e]">DETAILED COMMENT</label>
                  <textarea
                    required
                    rows={4}
                    value={revComment}
                    onChange={(e) => setRevComment(e.target.value)}
                    placeholder="PROVIDE FEEDBACK CONCERNING WEIGHT, TEXTURE, FIT, AND DELIVERY RESOLUTION..."
                    className="w-full bg-[#fbf9f5] border border-stone-350 p-2.5 rounded text-xs focus:outline-none focus:border-stone-500 font-sans tracking-wide"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0f2c2e] hover:bg-[#1a4a4d] text-white text-[10px] font-mono tracking-[0.2em] font-extrabold uppercase py-3 rounded transition-colors cursor-pointer"
                >
                  SUBMIT SPECIMEN METRICS
                </button>
              </form>

            </div>

          </div>
        </div>
      </section>

      {/* 6. Recently Viewed Items section */}
      {recentlyViewed.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
          <div className="text-center md:text-left border-b border-stone-200 pb-3">
            <span className="text-[10px] font-mono tracking-[0.25em] text-[#2d728f] uppercase font-bold flex items-center justify-center md:justify-start gap-1.5">
              <Clock className="w-4 h-4 text-[#2d728f]" /> CLIENT RECENTLY VIEWED ITEMS
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recentlyViewed.map(item => (
              <Link 
                to={`/product/${item.id}`} 
                key={item.id}
                className="group space-y-3 bg-white p-3 border border-stone-200 rounded-lg hover:shadow-md transition-all duration-300 flex flex-col"
              >
                <div className="aspect-[3/4] bg-stone-100 overflow-hidden rounded relative">
                  <img src={item.assets[0]} alt={item.title} className="w-full h-full object-cover object-center group-hover:scale-104 transition-all" />
                </div>
                <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                  <h5 className="text-[11px] font-serif font-extrabold text-[#0f2c2e] line-clamp-1 group-hover:text-[#2d728f] transition-all">
                    {item.title}
                  </h5>
                  <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-wide">
                    <span className="text-[#0f2c2e]/60">{item.category}</span>
                    <strong className="text-emerald-800 font-bold">BDT {item.price}</strong>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 6. Custom Share Modal Popup (কপাট) */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[100] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-[#FAF9F5] max-w-sm sm:max-w-md w-full rounded-2xl border border-stone-200 p-6 relative shadow-2xl space-y-5"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title Header */}
              <div className="text-center sm:text-left">
                <span className="text-[9px] font-mono font-bold tracking-[0.25em] text-[#003E2C] uppercase block">
                  SHARE GADGET
                </span>
                <h3 className="text-lg font-serif italic font-extrabold text-stone-900 tracking-wide mt-1">
                  Share Kiyomi Specimen
                </h3>
              </div>

              {/* Small Product Details Preview */}
              <div className="flex gap-3 bg-white p-3 rounded-xl border border-stone-200/60 shadow-xs">
                <img 
                  src={product.assets[0]} 
                  alt={product.title} 
                  className="w-14 h-18 object-cover rounded-lg bg-stone-100 shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <span className="text-[8px] font-mono font-bold tracking-wider text-stone-400 uppercase">{product.category}</span>
                    <h4 className="text-xs font-serif font-bold text-[#0f2c2e] line-clamp-1 mt-0.5">{product.title}</h4>
                  </div>
                  <strong className="text-xs font-mono font-bold text-[#003E2C]">BDT {product.price}</strong>
                </div>
              </div>

              {/* Social Channels Row */}
              <div className="space-y-2">
                <span className="text-[9px] font-mono tracking-widest text-[#003E2C] uppercase block font-bold">Select Social Network</span>
                <div className="grid grid-cols-4 gap-2">
                  
                  {/* Facebook Button */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3.5 bg-white border border-stone-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all cursor-pointer group"
                    title="Share on Facebook"
                  >
                    <svg className="w-5 h-5 fill-current text-stone-600 group-hover:text-blue-600 transition-colors" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                    </svg>
                    <span className="text-[7.5px] font-mono tracking-wider text-stone-550 group-hover:text-blue-650 mt-2 font-bold uppercase">FB</span>
                  </a>

                  {/* WhatsApp Button */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(product.title + " - Check it out at: " + window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3.5 bg-white border border-stone-200 rounded-xl hover:bg-emerald-50 hover:border-emerald-300 hover:text-[#075e54] transition-all cursor-pointer group"
                    title="Share on WhatsApp"
                  >
                    <svg className="w-5 h-5 fill-current text-stone-600 group-hover:text-[#075e54] transition-colors" viewBox="0 0 24 24">
                      <path d="M12.004 2c-5.518 0-9.994 4.476-9.994 9.994 0 1.764.462 3.486 1.336 5.016L2 22l5.122-1.312a9.907 9.007 0 004.882 1.306h.004c5.518 0 9.994-4.476 9.994-9.994C21.998 6.476 17.52 2 12.004 2zm5.71 14.12c-.25.702-1.236 1.294-1.706 1.346-.46.052-.91.246-2.906-.54-2.556-1.004-4.2-3.606-4.328-3.778-.126-.172-1.028-1.37-1.028-2.614 0-1.244.654-1.854.886-2.102.23-.248.514-.31.686-.31h.494c.156 0 .37.058.558.508.196.47.668 1.634.728 1.754.06.12.1.26.014.432-.086.172-.128.276-.256.432-.128.156-.252.274-.37.422-.112.138-.24.288-.102.524.138.236.612.998 1.312 1.624.9.804 1.656 1.05 1.888 1.168.232.118.37.1.508-.046.138-.146.594-.694.754-.93.16-.236.326-.196.55-.112.222.084 1.41.666 1.654.788.242.122.404.18.464.282.06.102.06.59-.19.1.524z"/>
                    </svg>
                    <span className="text-[7.5px] font-mono tracking-wider text-stone-550 group-hover:text-emerald-700 mt-2 font-bold uppercase">WhatsApp</span>
                  </a>

                  {/* Twitter / X Button */}
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(product.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3.5 bg-white border border-stone-200 rounded-xl hover:bg-stone-100 hover:border-black hover:text-black transition-all cursor-pointer group"
                    title="Share on X"
                  >
                    <svg className="w-5 h-5 fill-current text-stone-600 group-hover:text-black transition-colors" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span className="text-[7.5px] font-mono tracking-wider text-stone-550 group-hover:text-black mt-2 font-bold uppercase">Twitter (X)</span>
                  </a>

                  {/* Telegram Button */}
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(product.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3.5 bg-white border border-stone-200 rounded-xl hover:bg-sky-50 hover:border-sky-300 hover:text-sky-600 transition-all cursor-pointer group"
                    title="Share on Telegram"
                  >
                    <svg className="w-5 h-5 fill-current text-stone-600 group-hover:text-sky-600 transition-colors" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1 .22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.24-5.54 3.66-.52.36-1 .53-1.42.52-.47-.01-1.37-.27-2.03-.49-.81-.27-1.46-.42-1.4-.88.03-.24.37-.49 1.02-.75 3.99-1.74 6.66-2.88 7.99-3.41 3.81-1.52 4.6-1.79 5.12-1.8.11 0 .37.03.54.17.14.12.18.28.2.45-.02.07-.02.14-.03.22z"/>
                    </svg>
                    <span className="text-[7.5px] font-mono tracking-wider text-stone-550 group-hover:text-sky-600 mt-2 font-bold uppercase">Telegram</span>
                  </a>

                </div>
              </div>

              {/* Direct Copy Block */}
              <div className="space-y-2 pt-1">
                <span className="text-[9px] font-mono tracking-widest text-[#003E2C] uppercase block font-bold">Copy Original Link</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={window.location.href}
                    className="flex-1 bg-white border border-stone-200 rounded-xl px-3 text-xs font-mono text-stone-600 select-all outline-none focus:border-[#003E2C]"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`px-4 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      sharedCopied
                        ? "bg-deep-emerald text-white border-transparent"
                        : "bg-[#003E2C] hover:bg-emerald-800 text-[#CBF23D] border border-transparent"
                    }`}
                  >
                    {sharedCopied ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>COPIED!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>COPY</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Info indicator */}
              <div className="text-[10px] text-stone-500 font-sans tracking-wide leading-relaxed bg-white p-2.5 rounded-xl border border-stone-200/50 pt-4 text-center">
                Use the copied unique URL or social channels above to share this premium gadget with your peers.
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
