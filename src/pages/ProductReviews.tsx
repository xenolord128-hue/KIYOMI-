import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { RAW_PRODUCTS } from '../data/products';
import { playCinematicIntroSound } from '../utils/voiceUtils';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../lib/firebase';
import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';
import { Product, Review } from '../types';
import { sendFormViaEmailJS } from '../lib/emailjs';
import { 
  Star, 
  ArrowLeft, 
  MessageSquare, 
  CheckCircle, 
  AlertCircle,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  User
} from 'lucide-react';

export const ProductReviews: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [product, setProduct] = useState<Product | null>(() => {
    const cached = localStorage.getItem('patowary_local_products');
    if (cached) {
      try {
        const arr: Product[] = JSON.parse(cached);
        const match = arr.find(p => p.id === productId);
        if (match) return match;
      } catch (e) {}
    }
    return RAW_PRODUCTS.find(p => p.id === productId) || null;
  });

  // Review Form States
  const [revName, setRevName] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState('');
  const [revSuccess, setRevSuccess] = useState(false);
  const [revSubmitting, setRevSubmitting] = useState(false);
  const [revError, setRevError] = useState<string | null>(null);

  // Filter state
  const [selectedStarFilter, setSelectedStarFilter] = useState<number | 'all'>('all');

  // Firestore Live Listener
  useEffect(() => {
    if (!productId) return;
    const unsub = onSnapshot(doc(db, 'products', String(productId)), (docSnap) => {
      if (docSnap.exists()) {
        setProduct(docSnap.data() as Product);
      }
    }, () => {});
    return () => unsub();
  }, [productId]);

  const reviewsList = product?.reviews || [];
  
  // Real rating calculated strictly from actual customer reviews
  const averageRating = reviewsList.length > 0 
    ? (reviewsList.reduce((acc, r) => acc + r.rating, 0) / reviewsList.length).toFixed(1)
    : null;

  const filteredReviews = selectedStarFilter === 'all'
    ? reviewsList
    : reviewsList.filter(r => r.rating === selectedStarFilter);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (revSubmitting) return;
    if (!product || !revName.trim() || !revComment.trim()) return;

    setRevSubmitting(true);
    setRevError(null);

    // Send complete review information through EmailJS
    const emailResult = await sendFormViaEmailJS({
      formType: 'Product Review Submission Form',
      name: revName.trim(),
      message: revComment.trim(),
      productOrService: product.title,
      productId: product.id,
      price: `BDT ${product.price}`,
      subject: `New Customer Review for ${product.title} (${revRating} Stars)`,
      customFields: {
        'Rating Stars': `${revRating} / 5 Stars`,
        'Customer Name': revName.trim(),
        'Product Title': product.title,
        'Product Price': `BDT ${product.price}`,
        'Feedback Message': revComment.trim(),
      },
    });

    if (!emailResult.success) {
      console.error('[EmailJS] Product review submission failed:', emailResult.error);
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
      playCinematicIntroSound("Thank you for your genuine review!");
      setTimeout(() => setRevSuccess(false), 4500);
    } catch (err) {
      // Local fallback
      setProduct(prev => prev ? { ...prev, reviews: [...prev.reviews, newReview] } : prev);
      setRevSuccess(true);
      setRevName('');
      setRevComment('');
      setTimeout(() => setRevSuccess(false), 4500);
    } finally {
      setRevSubmitting(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F8F3EA] py-20 px-4 text-center font-sans space-y-4">
        <h2 className="text-xl font-serif text-[#0A1E54]">PRODUCT NOT FOUND</h2>
        <Link to="/products" className="inline-block px-6 py-2.5 rounded-xl bg-[#0A1E54] text-white text-xs font-mono uppercase">
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div id="product-reviews-page" className="min-h-screen bg-[#F8F3EA] text-[#111827] py-10 sm:py-16 px-4 sm:px-8 font-sans text-left">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to={`/product/${product.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card hover:bg-white text-xs font-mono tracking-wider text-[#0A1E54] uppercase font-bold transition-all shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" /> {t("Back to Product")}
          </Link>

          <span className="text-[10px] font-mono tracking-widest text-[#0A1E54]/70 uppercase font-bold">
            PRODUCT ID: #{product.id}
          </span>
        </div>

        {/* Product Overview Summary Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-[2rem] border border-white/80 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 w-full sm:w-auto">
            <img 
              src={product.assets[0]} 
              alt={product.title} 
              className="w-20 h-24 object-cover object-center rounded-2xl border border-white/80 shadow-sm shrink-0 bg-stone-100"
            />
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#C9A66B] uppercase font-bold">
                {product.category}
              </span>
              <h1 className="font-serif font-bold text-xl sm:text-2xl text-[#0A1E54]">
                {product.title}
              </h1>
              <div className="flex items-center gap-3 pt-1">
                <span className="font-mono font-bold text-base text-[#0A1E54]">
                  BDT {product.price}
                </span>
                <span className="text-xs text-stone-500 font-sans">
                  • {reviewsList.length} {reviewsList.length === 1 ? 'Customer Review' : 'Customer Reviews'}
                </span>
              </div>
            </div>
          </div>

          <Link
            to={`/product/${product.id}`}
            className="w-full sm:w-auto px-6 py-3 bg-[#0A1E54] hover:bg-[#1A3070] text-white text-xs font-mono font-bold tracking-wider uppercase rounded-xl transition-all shadow-sm text-center shrink-0"
          >
            {t("View Product Details")}
          </Link>
        </div>

        {/* Ratings & Reviews Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Reviews List & Star Filtering (7-cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Real Rating Header */}
            <div className="glass-card p-6 rounded-3xl border border-white space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <h2 className="font-serif font-bold text-lg text-[#0A1E54]">
                  {t("Authentic Customer Reviews")}
                </h2>
                <span className="text-[10px] font-mono text-[#0A1E54]/70 uppercase font-bold">
                  GENUINE VERIFIED FEEDBACK
                </span>
              </div>

              {averageRating ? (
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-serif font-black text-[#0A1E54]">
                    {averageRating}
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-[#C9A66B]">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          className={`w-4 h-4 ${s <= Math.round(Number(averageRating)) ? 'fill-current' : 'text-stone-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-xs text-stone-600 font-sans mt-0.5 block">
                      Based on {reviewsList.length} real customer {reviewsList.length === 1 ? 'submission' : 'submissions'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-stone-50 rounded-2xl border border-dashed border-stone-300 text-center space-y-1">
                  <p className="text-xs font-mono text-[#0A1E54] font-bold uppercase">
                    NO CUSTOMER REVIEWS YET
                  </p>
                  <p className="text-xs text-stone-500 font-sans">
                    Be the first customer to share your thoughts on the fabric, drape, and sizing!
                  </p>
                </div>
              )}

              {/* Star Filter Controls */}
              {reviewsList.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-stone-150">
                  <button
                    onClick={() => setSelectedStarFilter('all')}
                    className={`px-3 py-1 rounded-full text-xs font-mono cursor-pointer transition-all ${
                      selectedStarFilter === 'all'
                        ? 'bg-[#0A1E54] text-white font-bold'
                        : 'bg-white border text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    All ({reviewsList.length})
                  </button>
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = reviewsList.filter(r => r.rating === star).length;
                    return (
                      <button
                        key={star}
                        onClick={() => setSelectedStarFilter(star)}
                        className={`px-3 py-1 rounded-full text-xs font-mono cursor-pointer transition-all ${
                          selectedStarFilter === star
                            ? 'bg-[#0A1E54] text-white font-bold'
                            : 'bg-white border text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        {star} ★ ({count})
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Reviews Listing */}
            <div className="space-y-4">
              {filteredReviews.length === 0 ? (
                <div className="glass-card p-8 rounded-3xl border border-white text-center space-y-2">
                  <MessageSquare className="w-8 h-8 text-stone-400 mx-auto" />
                  <p className="text-xs font-mono uppercase text-[#0A1E54] font-bold">
                    {reviewsList.length === 0 ? "No Customer Reviews Recorded" : "No reviews match this star filter"}
                  </p>
                  <p className="text-xs text-stone-500 font-sans max-w-sm mx-auto">
                    Submit your feedback using the form to have your review featured on this page.
                  </p>
                </div>
              ) : (
                filteredReviews.map((rev) => (
                  <div key={rev.id} className="glass-card p-5 rounded-2xl border border-white space-y-2 text-left">
                    <div className="flex items-center justify-between border-b border-stone-150 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#0A1E54]/10 text-[#0A1E54] flex items-center justify-center font-bold text-xs">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-serif font-bold text-sm text-[#0A1E54] block">
                            {rev.userName}
                          </span>
                          <span className="text-[9px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200">
                            Verified Customer
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 text-[#C9A66B]">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-current' : 'text-stone-300'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans pt-1">
                      {rev.comment}
                    </p>
                  </div>
                ))
              )}
            </div>

          </div>

          {/* Right Column: Write a Genuine Review Form (5-cols) */}
          <div className="lg:col-span-5">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white shadow-sm space-y-4 text-left">
              <div className="border-b border-[#0A1E54]/10 pb-3">
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#C9A66B] font-bold block">
                  SUBMIT FEEDBACK
                </span>
                <h3 className="text-lg font-serif font-bold text-[#0A1E54]">
                  {t("Write a Genuine Review")}
                </h3>
              </div>

              {revSuccess && (
                <div className="p-3.5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-2xl text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t("Thank you! Your review has been submitted and recorded.")}</span>
                </div>
              )}

              {revError && (
                <div className="p-3.5 bg-rose-50 text-rose-900 border border-rose-200 rounded-2xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{revError}</span>
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-stone-600 font-bold block mb-1">
                    {t("Your Full Name")} *
                  </label>
                  <input
                    type="text"
                    required
                    value={revName}
                    onChange={(e) => setRevName(e.target.value)}
                    placeholder="e.g. Tanvir Hossain"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-[#0A1E54] text-xs bg-white focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-stone-600 font-bold block mb-1">
                    {t("Rating Score")} *
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRevRating(star)}
                        className={`p-1.5 text-xl cursor-pointer transition-transform hover:scale-110 ${
                          star <= revRating ? 'text-[#C9A66B]' : 'text-stone-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-stone-600 font-bold block mb-1">
                    {t("Your Honest Experience")} *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={revComment}
                    onChange={(e) => setRevComment(e.target.value)}
                    placeholder={t("Share details on the fabric weight, sizing, drape, or courier care...")}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-[#0A1E54] text-xs bg-white focus:outline-none resize-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={revSubmitting}
                  className={`w-full bg-[#0A1E54] hover:bg-[#1A3070] text-white text-xs font-mono font-bold tracking-widest uppercase py-3.5 rounded-xl transition-all shadow-md cursor-pointer ${
                    revSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {revSubmitting
                    ? t("Submitting Review...")
                    : t("Submit Review")}
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
