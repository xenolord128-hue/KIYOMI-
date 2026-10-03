import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RAW_PRODUCTS } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { playCinematicIntroSound } from '../utils/voiceUtils';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../lib/firebase';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ShoppingBag, 
  Heart, 
  Star, 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Check, 
  Facebook, 
  MessageCircle, 
  Flame, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Shirt, 
  Glasses, 
  LayoutGrid, 
  Headphones, 
  Banknote, 
  Award, 
  Send,
  Clock
} from 'lucide-react';
import { updatePageSEO } from '../utils/seoUtils';

// Minimalist Pants / Cargo Icon Component
const PantsIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M5 4h14l-1.5 16h-4l-1.5-9-1.5 9H6.5L5 4z" />
    <path d="M9 4v3" />
    <path d="M15 4v3" />
    <path d="M6 10h3.5" />
    <path d="M14.5 10H18" />
  </svg>
);

// Visually distinct minimalist icon helper for categories
const getCategoryIcon = (categoryName: string, className = "w-4 h-4") => {
  const norm = categoryName.toLowerCase();
  if (norm.includes('cargo') || norm.includes('pant') || norm.includes('denim')) {
    return <PantsIcon className={className} />;
  }
  if (norm.includes('tee') || norm.includes('polo') || norm.includes('shirt')) {
    return <Shirt className={className} />;
  }
  if (norm.includes('hoodie') || norm.includes('sweat') || norm.includes('fleece')) {
    return <Flame className={className} />;
  }
  if (norm.includes('women')) {
    return <Sparkles className={className} />;
  }
  if (norm.includes('accessor') || norm.includes('lifestyle')) {
    return <Glasses className={className} />;
  }
  return <LayoutGrid className={className} />;
};

export const Home: React.FC = () => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // 1. Dynamic Firestore Products with local storage fallback
  const [dbProducts, setDbProducts] = useState<Product[]>(() => {
    const cached = localStorage.getItem('patowary_local_products');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
    return RAW_PRODUCTS;
  });

  // 2. Dynamic Notices uploaded from Admin Panel
  const [notices, setNotices] = useState<string[]>([
    "🔥 PATOWARY FASHION: FREE EXPRESS COURIER FOR ALL ORDERS OVER BDT 3500",
    "⚡ USE VIP PROMOCODE [PATOWARY10] FOR 10% DISCOUNT ON ALL STREETWEAR",
    "✨ NEW ARRIVAL 2026: HEAVYWEIGHT BAGGY CARGO PANTS & 260 GSM OVERSIZED TEES",
    "📦 24-48H NATIONWIDE CASH ON DELIVERY WITH 7-DAY EASY FITTING EXCHANGE"
  ]);
  const [activeNoticeIdx, setActiveNoticeIdx] = useState(0);
  const [isNoticeVisible, setIsNoticeVisible] = useState(true);

  // 3. Category Filter & Single-Line Horizontal Slider
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');
  const categorySliderRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const isDraggingRef = React.useRef(false);
  const dragDistanceRef = React.useRef(0);
  const startXRef = React.useRef(0);
  const scrollLeftRef = React.useRef(0);

  // 4. Hero Carousel Slides
  const heroSlides = [
    {
      id: 1,
      eyebrow: "Trending Now",
      titleStart: "Style That",
      titleItalic: "Defines You",
      subtitle: "Premium Fashion • Modern Looks • Better You",
      description: "Discover the latest trends in clothing, accessories, cosmetics and more. Be bold. Be unique. Be you.",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=2200&q=88",
      ctaText: "Shop Now",
      ctaLink: "/products",
      tag: "SIGNATURE FIT 2026",
      scriptQuote: "Fashion For A Better Tomorrow"
    },
    {
      id: 2,
      eyebrow: "Architectural Streetwear",
      titleStart: "Heavyweight",
      titleItalic: "Baggy Cargo",
      subtitle: "Heavy Twill 6-Pocket • 13.5oz Denim • Custom Drape",
      description: "Engineered for effortless modern street drape with reinforced seam lines and adjustable cinch cuffs.",
      image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=2200&q=88",
      ctaText: "Explore Cargo Fits",
      ctaLink: "/products?category=Baggy%20%26%20Cargo%20Pants",
      tag: "HOT DROP 01",
      scriptQuote: "Crafted In Bangladesh"
    },
    {
      id: 3,
      eyebrow: "Limited Atelier Drop",
      titleStart: "French Terry",
      titleItalic: "Boxy Hoodies",
      subtitle: "420 GSM Boxy Pullover • Combed Cotton Feel",
      description: "Double-layer structured hood, drop-shoulder luxury cut, and seamless side panels for peak cold-weather comfort.",
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=2200&q=88",
      ctaText: "View Hoodies",
      ctaLink: "/products?category=Hoodies%20%26%20Sweatshirts",
      tag: "WINTER DROP 02",
      scriptQuote: "More Style Less Limits"
    }
  ];
  const [activeSlide, setActiveSlide] = useState(0);

  // 5. Flash Sale Live Countdown Timer
  const [saleTime, setSaleTime] = useState({
    days: 3,
    hours: 12,
    minutes: 45,
    seconds: 21
  });

  // 6. Newsletter Subscription
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Toast notification for instant action feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const checkCategoryScroll = () => {
    if (categorySliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categorySliderRef.current;
      setCanScrollLeft(scrollLeft > 6);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
    }
  };

  useEffect(() => {
    checkCategoryScroll();
    window.addEventListener('resize', checkCategoryScroll);
    return () => window.removeEventListener('resize', checkCategoryScroll);
  }, []);

  const slideCategories = (direction: 'left' | 'right') => {
    if (categorySliderRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      categorySliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkCategoryScroll, 350);
    }
  };

  const handleSliderMouseDown = (e: React.MouseEvent) => {
    if (!categorySliderRef.current) return;
    isDraggingRef.current = true;
    dragDistanceRef.current = 0;
    startXRef.current = e.pageX - categorySliderRef.current.offsetLeft;
    scrollLeftRef.current = categorySliderRef.current.scrollLeft;
  };

  const handleSliderMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !categorySliderRef.current) return;
    const x = e.pageX - categorySliderRef.current.offsetLeft;
    const walk = (x - startXRef.current);
    dragDistanceRef.current = Math.abs(walk);
    if (Math.abs(walk) > 4) {
      e.preventDefault();
      categorySliderRef.current.scrollLeft = scrollLeftRef.current - walk;
      checkCategoryScroll();
    }
  };

  const handleSliderMouseUp = () => {
    isDraggingRef.current = false;
    checkCategoryScroll();
  };

  useEffect(() => {
    updatePageSEO(
      'Patowary Fashion | Premium Streetwear Bangladesh',
      'Official Store: Architectural Baggy Cargo Pants, 260 GSM Combed Oversized Tees, Double-Layer Hoodies, and Modern Urban Apparel.'
    );

    // Sync Firestore products
    const unsubProd = onSnapshot(collection(db, 'products'), (snapshot) => {
      if (!snapshot.empty) {
        const firestoreList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Product));
        setDbProducts(firestoreList);
        localStorage.setItem('patowary_local_products', JSON.stringify(firestoreList));
      }
    }, () => {});

    // Sync notices from Firestore
    const unsubNotice = onSnapshot(doc(db, 'site_settings', 'announcements'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.active && data.message) {
          setNotices([
            data.message,
            "⚡ USE PROMOCODE [PATOWARY10] FOR 10% OFF ON ORDERS",
            "🔥 FREE EXPRESS COURIER FOR ALL ORDERS ABOVE BDT 3500"
          ]);
        }
      }
    }, () => {});

    return () => {
      unsubProd();
      unsubNotice();
    };
  }, []);

  // Auto-rotate notices every 4.5 seconds
  useEffect(() => {
    if (notices.length <= 1) return;
    const timer = setInterval(() => {
      setActiveNoticeIdx((prev) => (prev + 1) % notices.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [notices]);

  // Auto-advance hero slides every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Flash Sale countdown ticker
  useEffect(() => {
    const targetEnd = Date.now() + (3 * 24 * 60 * 60 * 1000) + (12 * 60 * 60 * 1000) + (45 * 60 * 1000);
    const interval = setInterval(() => {
      const remaining = Math.max(0, targetEnd - Date.now());
      setSaleTime({
        days: Math.floor(remaining / (1000 * 60 * 60 * 24)),
        hours: Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((remaining % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubscribed(true);
    showToast("You're subscribed — welcome to Patowary VIP Club!");
    playCinematicIntroSound('Thank you for subscribing to Patowary Fashion');
    setTimeout(() => {
      setNewsletterEmail('');
    }, 2000);
  };

  const handleHeroQuickAdd = (slideIndex: number) => {
    const slide = heroSlides[slideIndex];
    const matched = dbProducts.find(p => p.title.toLowerCase().includes(slide.titleStart.toLowerCase())) || dbProducts[0];
    if (matched) {
      const defaultVar = matched.variants[0] || 'Standard';
      addToCart(matched, defaultVar, 1);
      showToast(`${matched.title} added to bag`);
      playCinematicIntroSound(`${matched.title} added to bag`);
    }
  };

  // Curated Glass Rail Categories (matching mockup)
  const glassRailCategories = [
    { 
      name: "Men's Wear", 
      filterKey: "Baggy & Cargo Pants", 
      img: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=500&q=80" 
    },
    { 
      name: "Women's Wear", 
      filterKey: "Women's Collection", 
      img: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=500&q=80" 
    },
    { 
      name: "Baggy Pants", 
      filterKey: "Baggy & Cargo Pants", 
      img: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=500&q=80" 
    },
    { 
      name: "Polo T-Shirts", 
      filterKey: "Oversized Tees & Polos", 
      img: "https://images.unsplash.com/photo-1625910513413-5fc45e2ae5c7?auto=format&fit=crop&w=500&q=80" 
    },
    { 
      name: "Hoodies & Fleece", 
      filterKey: "Hoodies & Sweatshirts", 
      img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=500&q=80" 
    },
    { 
      name: "Accessories", 
      filterKey: "Accessories & Lifestyle", 
      img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80" 
    },
    { 
      name: "Signature Drops", 
      filterKey: "All", 
      img: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=500&q=80" 
    }
  ];

  const filteredProducts = activeCategoryFilter === 'All' 
    ? dbProducts 
    : dbProducts.filter(p => p.category === activeCategoryFilter);

  const currentSlideData = heroSlides[activeSlide];

  return (
    <div className="bg-[#F8F3EA] text-[#111827] min-h-screen font-sans selection:bg-[#0A1E54] selection:text-[#F8F3EA] relative">
      
      {/* ======================================================== */}
      {/* 1. TOP DYNAMIC NOTICE BOARD                              */}
      {/* ======================================================== */}
      {isNoticeVisible && (
        <section className="bg-gradient-to-r from-[#0A1E54] via-[#1A3070] to-[#0A1E54] text-[#F8F3EA] border-b border-[#C9A66B]/30 px-3 sm:px-6 py-2.5 shadow-md relative z-30">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] sm:text-xs font-mono font-bold tracking-wide">
            
            <div className="hidden md:flex items-center gap-2 text-[#C9A66B] shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="uppercase text-[10px] tracking-widest font-black">ADMIN NOTICE:</span>
            </div>

            <div className="flex-1 flex justify-center items-center overflow-hidden px-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeNoticeIdx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2 text-center truncate"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A66B] shrink-0" />
                  <span className="truncate">{notices[activeNoticeIdx]}</span>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link 
                to="/products"
                className="hidden sm:inline-block text-[#C9A66B] hover:text-white underline text-[10px] uppercase font-bold"
              >
                {t("Shop Drop")}
              </Link>
              <button
                type="button"
                onClick={() => setIsNoticeVisible(false)}
                className="text-stone-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Dismiss notice"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* 2. GRAND CINEMATIC HERO (From Mockup)                     */}
      {/* ======================================================== */}
      <section className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] flex items-center overflow-hidden text-white bg-[#0A1E54]">
        
        {/* Background Layer with Smooth Image Crossfade */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlideData.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-0 bg-center bg-cover"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(4,16,43,0.96) 0%, rgba(8,26,68,0.85) 42%, rgba(7,23,60,0.30) 70%, rgba(5,17,43,0.50) 100%), url("${currentSlideData.image}")`
            }}
          />
        </AnimatePresence>

        {/* Ambient Radial Lighting & Rings */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C9A66B]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#1A3070]/50 rounded-full blur-3xl" />
          <div className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full border border-white/10 shadow-[0_0_0_50px_rgba(255,255,255,0.02),0_0_0_100px_rgba(255,255,255,0.01)]" />
        </div>

        {/* Carousel Arrow Controls */}
        <button
          type="button"
          onClick={() => setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 bg-white/10 hover:bg-white/25 backdrop-blur-md flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => setActiveSlide((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 bg-white/10 hover:bg-white/25 backdrop-blur-md flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Hero Main Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-20 sm:py-28 lg:py-32 w-full text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Headline, Description & CTAs */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Eyebrow Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9A66B]/90 backdrop-blur-md text-[#0A1E54] text-xs font-mono font-black uppercase tracking-wider shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0A1E54] animate-ping" />
                <span>{currentSlideData.eyebrow}</span>
              </div>

              {/* Main Headline with Serif Elegance & Golden Italic */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-normal tracking-tight text-white leading-[1.02]">
                {currentSlideData.titleStart}{" "}
                <br className="hidden sm:inline" />
                <em className="text-[#C9A66B] font-serif italic font-normal">
                  {currentSlideData.titleItalic}
                </em>
              </h1>

              {/* Subtitle & Value Statement */}
              <p className="text-sm sm:text-base font-mono text-white/90 font-medium tracking-wide">
                {currentSlideData.subtitle}
              </p>

              <p className="text-xs sm:text-sm text-stone-300 max-w-xl font-sans leading-relaxed">
                {currentSlideData.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to={currentSlideData.ctaLink}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#C9A66B] hover:bg-[#d8b57b] text-[#0A1E54] font-mono text-xs uppercase font-black shadow-xl shadow-[#C9A66B]/25 transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                >
                  <span>{currentSlideData.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="https://wa.me/8801730943993"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs uppercase font-bold backdrop-blur-md transition-all hover:-translate-y-0.5"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>WhatsApp Concierge</span>
                </a>
              </div>

              {/* Trust Guarantee Row on Hero */}
              <div className="pt-6 border-t border-white/15 flex flex-wrap gap-2.5 sm:gap-4 text-left">
                <div className="flex-1 min-w-[120px] p-2.5 sm:p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white">
                    <Truck className="w-3.5 h-3.5 text-[#C9A66B]" />
                    <span>Free Delivery</span>
                  </div>
                  <span className="text-[10px] text-stone-300 block mt-0.5">Selected Areas &gt; ৳3500</span>
                </div>

                <div className="flex-1 min-w-[120px] p-2.5 sm:p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C9A66B]" />
                    <span>Secure Payment</span>
                  </div>
                  <span className="text-[10px] text-stone-300 block mt-0.5">100% Cash on Delivery</span>
                </div>

                <div className="flex-1 min-w-[120px] p-2.5 sm:p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white">
                    <RotateCcw className="w-3.5 h-3.5 text-[#C9A66B]" />
                    <span>Easy Return</span>
                  </div>
                  <span className="text-[10px] text-stone-300 block mt-0.5">Within 7-Day Fitting</span>
                </div>
              </div>

            </div>

            {/* Right Column: Decorative Typographic Script & Slide Dots */}
            <div className="lg:col-span-4 hidden lg:flex flex-col items-end justify-between self-stretch py-4">
              <div className="text-right space-y-1">
                <span className="text-[10px] font-mono tracking-[0.3em] text-[#C9A66B] uppercase font-bold block">
                  {currentSlideData.tag}
                </span>
                <p className="font-serif italic text-2xl text-white/80 max-w-[200px] leading-tight">
                  "{currentSlideData.scriptQuote}"
                </p>
              </div>

              {/* Slider Dots */}
              <div className="flex items-center gap-2">
                {heroSlides.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActiveSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      activeSlide === idx ? 'w-8 bg-[#C9A66B]' : 'w-2 bg-white/30 hover:bg-white/60'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. CATEGORY GLASS RAIL (Floating over the Hero bottom)   */}
      {/* ======================================================== */}
      <div className="relative z-20 -mt-10 sm:-mt-14 max-w-7xl mx-auto px-3 sm:px-6">
        <div className="bg-white/85 dark:bg-[#0A1E54]/85 backdrop-blur-2xl border border-white/60 dark:border-white/15 rounded-3xl p-3 sm:p-4 shadow-2xl shadow-[#0A1E54]/15">
          
          <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto scrollbar-hide py-1 px-1">
            {glassRailCategories.map((cat, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setActiveCategoryFilter(cat.filterKey);
                  const el = document.getElementById('best-sellers-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="shrink-0 w-24 sm:w-32 md:w-36 flex flex-col items-center text-center group cursor-pointer"
              >
                {/* Image Container with subtle border & hover zoom */}
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-stone-200 border border-white/80 group-hover:border-[#C9A66B] shadow-inner transition-all duration-300 relative">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                </div>
                
                <span className="text-[11px] sm:text-xs font-mono font-bold text-[#0A1E54] dark:text-stone-200 mt-2 truncate w-full group-hover:text-[#C9A66B] transition-colors">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. BEST SELLERS / FEATURED PRODUCTS (From Mockup)        */}
      {/* ======================================================== */}
      <section id="best-sellers-section" className="py-12 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto text-left">
        
        {/* Section Head */}
        <div className="flex items-end justify-between mb-8 pb-3 border-b border-[#0A1E54]/10 gap-4">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-[#C9A66B]">
              FEATURED PRODUCTS
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#0A1E54] mt-0.5">
              Best Sellers
            </h2>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#0A1E54] hover:text-[#C9A66B] transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Single Line Category Slider (Enhanced with Minimalist Icons) */}
        <div className="relative mb-8">
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#F8F3EA] to-transparent z-10 pointer-events-none" />
          )}

          <div
            ref={categorySliderRef}
            onScroll={checkCategoryScroll}
            onMouseDown={handleSliderMouseDown}
            onMouseMove={handleSliderMouseMove}
            onMouseUp={handleSliderMouseUp}
            onMouseLeave={handleSliderMouseUp}
            className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1 px-0.5 scroll-smooth select-none cursor-grab active:cursor-grabbing"
          >
            {[
              { id: 'All', label: t("All Drops") },
              { id: 'Baggy & Cargo Pants', label: t("Baggy & Cargo Pants") },
              { id: 'Oversized Tees & Polos', label: t("Oversized Tees & Polos") },
              { id: 'Hoodies & Sweatshirts', label: t("Hoodies & Sweatshirts") },
              { id: "Women's Collection", label: t("Women's Collection") },
              { id: "Accessories & Lifestyle", label: t("Accessories & Lifestyle") }
            ].map((cat) => {
              const isActive = activeCategoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={(e) => {
                    if (dragDistanceRef.current > 6) return;
                    setActiveCategoryFilter(cat.id);
                    e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                  }}
                  className={`shrink-0 whitespace-nowrap px-4 py-2 rounded-xl text-xs font-mono tracking-wide flex items-center gap-2 transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#0A1E54] text-[#F8F3EA] font-extrabold shadow-sm border border-[#0A1E54] scale-[1.02]'
                      : 'bg-white/90 hover:bg-white text-stone-700 hover:text-[#0A1E54] border border-stone-200 shadow-2xs hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  <span className={isActive ? 'text-[#C9A66B]' : 'text-stone-400'}>
                    {getCategoryIcon(cat.id, "w-3.5 h-3.5 shrink-0")}
                  </span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#F8F3EA] to-transparent z-10 pointer-events-none" />
          )}
        </div>

        {/* Product Cards Grid (Matching Mockup Architecture) */}
        {filteredProducts.length === 0 ? (
          <div className="p-12 bg-white rounded-3xl border border-stone-200 text-center space-y-3 shadow-sm">
            <ShoppingBag className="w-10 h-10 text-stone-400 mx-auto" />
            <p className="text-sm font-mono text-[#0A1E54] font-bold uppercase">NO PRODUCTS FOUND</p>
            <p className="text-xs text-stone-500 font-sans">Check back soon for new inventory drops.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => {
              const isWish = isInWishlist(product.id);
              const realReviewsCount = (product.reviews || []).length;
              const hasDiscount = (product.discountPercent && product.discountPercent > 0) || (product.regularPrice && product.price < product.regularPrice);
              const discountVal = product.discountPercent || Math.round(((product.regularPrice! - product.price) / product.regularPrice!) * 100);
              const isOut = product.stock === 0 || (product.outOfStock && product.variants && product.outOfStock.length >= product.variants.length);

              return (
                <article
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="bg-white rounded-2xl overflow-hidden border border-[#0A1E54]/10 hover:border-[#C9A66B]/50 flex flex-col justify-between group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5"
                >
                  {/* Product Image Area */}
                  <div className="relative aspect-[1/1.05] w-full bg-stone-100 overflow-hidden">
                    <img
                      src={product.assets?.[0] || 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600'}
                      alt={product.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Discount Badge */}
                    {hasDiscount && !isOut && (
                      <span className="absolute top-3 left-3 px-2 py-1 rounded-md bg-[#0A1E54] text-white text-[10px] font-mono font-bold tracking-tight shadow-md">
                        -{discountVal}%
                      </span>
                    )}

                    {/* Stock Status Badge */}
                    {isOut && (
                      <span className="absolute top-3 left-3 px-2 py-1 rounded-md bg-stone-800 text-white text-[10px] font-mono font-bold">
                        SOLD OUT
                      </span>
                    )}

                    {/* Wishlist Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                        showToast(isWish ? "Removed from wishlist" : "Saved to wishlist");
                        playCinematicIntroSound(isWish ? "Removed from wishlist" : "Saved to wishlist");
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-md hover:bg-white text-[#0A1E54] shadow-sm cursor-pointer transition-all active:scale-90"
                      aria-label="Wishlist toggle"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isWish ? 'fill-red-500 text-red-500' : 'text-stone-600'}`} />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 space-y-2 text-left">
                    <h3 className="text-xs sm:text-sm font-bold text-[#0A1E54] line-clamp-1 group-hover:text-[#C9A66B] transition-colors">
                      {product.title}
                    </h3>
                    
                    <div className="text-[10px] text-stone-500 font-sans line-clamp-1">
                      {product.category === "Baggy & Cargo Pants" ? "Comfort Fit | Trendy Street Drape" :
                       product.category === "Hoodies & Sweatshirts" ? "Premium Heavyweight Cotton | Unisex" :
                       product.category === "Oversized Tees & Polos" ? "260 GSM Combed Cotton | All Day Fit" :
                       product.category === "Women's Collection" ? "Contemporary Silhouette | Soft Touch" :
                       "Luxury Lifestyle Edition | Authentic"}
                    </div>

                    {/* Bottom Row: Price, Stars & Add button */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-100">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm sm:text-base font-extrabold font-mono text-[#0A1E54]">
                            ৳ {product.price.toLocaleString()}
                          </span>
                          {product.regularPrice && product.regularPrice > product.price && (
                            <span className="text-[11px] text-stone-400 line-through font-mono">
                              ৳{product.regularPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Star Ratings */}
                        <div className="flex items-center gap-1 text-[#C9A66B] text-[10px] mt-0.5 font-mono">
                          <span>★★★★★</span>
                          <span className="text-stone-400">({realReviewsCount > 0 ? realReviewsCount : 98 + (product.id * 7) % 60})</span>
                        </div>
                      </div>

                      {/* Quick Add Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const defaultVar = product.variants[0] || 'Standard';
                          addToCart(product, defaultVar, 1);
                          showToast(`${product.title} added to cart`);
                          playCinematicIntroSound(`${product.title} added to bag`);
                        }}
                        className="w-9 h-9 rounded-xl bg-[#0A1E54] hover:bg-[#1A3070] text-white flex items-center justify-center transition-all shadow-md active:scale-95 shrink-0 cursor-pointer"
                        title="Add to Cart"
                      >
                        <ShoppingBag className="w-4 h-4 text-[#C9A66B]" />
                      </button>
                    </div>

                  </div>
                </article>
              );
            })}
          </div>
        )}

      </section>

      {/* ======================================================== */}
      {/* 5. FLASH SALE BANNER WITH LIVE COUNTDOWN (From Mockup)   */}
      {/* ======================================================== */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto my-10 sm:my-14">
        <div 
          className="relative min-h-[300px] sm:min-h-[340px] rounded-3xl overflow-hidden p-8 sm:p-12 flex items-center text-white bg-cover bg-center shadow-2xl"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(5,18,50,0.96) 0%, rgba(8,27,69,0.85) 45%, rgba(8,25,65,0.30) 100%), url("https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1800&q=85")`
          }}
        >
          {/* Ambient Lighting & Script Accent */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#C9A66B]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Script Graphic Accent (Matching mockup: "More Style Less Limits") */}
          <div className="absolute right-8 top-8 hidden md:block text-right pointer-events-none">
            <span className="text-[#C9A66B] font-serif italic text-2xl font-light opacity-90 block">
              More Style
            </span>
            <span className="text-white/80 font-serif italic text-xl font-light block">
              Less Limits
            </span>
          </div>

          <div className="relative z-10 max-w-xl text-left space-y-4">
            
            <span className="inline-block px-3 py-1 rounded-md bg-[#C9A66B] text-[#0A1E54] text-[10px] font-mono font-black uppercase tracking-wider">
              LIMITED TIME OFFER
            </span>

            <h2 className="text-3xl sm:text-5xl font-serif font-normal leading-tight text-white">
              Get Up To <span className="text-[#C9A66B] font-serif italic font-normal">75% OFF</span>
            </h2>

            <p className="text-xs sm:text-sm text-stone-200 font-sans">
              On Your Favorite Patowary Streetwear Drops & Winter Silhouettes.
            </p>

            {/* Countdown Timer Block */}
            <div className="flex items-center gap-2 pt-1 pb-2">
              <div className="min-w-[50px] p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
                <strong className="block text-base sm:text-lg font-mono font-black text-white">
                  {String(saleTime.days).padStart(2, '0')}
                </strong>
                <span className="text-[8px] font-mono uppercase text-white/70 block">Days</span>
              </div>
              <span className="text-white/60 font-bold">:</span>
              <div className="min-w-[50px] p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
                <strong className="block text-base sm:text-lg font-mono font-black text-white">
                  {String(saleTime.hours).padStart(2, '0')}
                </strong>
                <span className="text-[8px] font-mono uppercase text-white/70 block">Hours</span>
              </div>
              <span className="text-white/60 font-bold">:</span>
              <div className="min-w-[50px] p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
                <strong className="block text-base sm:text-lg font-mono font-black text-white">
                  {String(saleTime.minutes).padStart(2, '0')}
                </strong>
                <span className="text-[8px] font-mono uppercase text-white/70 block">Minutes</span>
              </div>
              <span className="text-white/60 font-bold">:</span>
              <div className="min-w-[50px] p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
                <strong className="block text-base sm:text-lg font-mono font-black text-[#C9A66B]">
                  {String(saleTime.seconds).padStart(2, '0')}
                </strong>
                <span className="text-[8px] font-mono uppercase text-white/70 block">Seconds</span>
              </div>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#C9A66B] hover:bg-[#d8b57b] text-[#0A1E54] font-mono text-xs uppercase font-black tracking-wider transition-all hover:scale-102 shadow-lg"
            >
              <span>Shop The Sale</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. 5-PILLAR SERVICE & VALUE STRIP (From Mockup)          */}
      {/* ======================================================== */}
      <section className="py-6 px-4 sm:px-8 max-w-7xl mx-auto border-y border-[#0A1E54]/10 bg-white/50 backdrop-blur-md rounded-3xl my-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          
          <div className="flex items-center justify-center gap-3 p-2">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#0A1E54]/10 flex items-center justify-center text-[#0A1E54] shadow-sm shrink-0">
              <Award className="w-5 h-5 text-[#C9A66B]" />
            </div>
            <div className="text-left">
              <span className="text-xs font-mono font-bold text-[#0A1E54] block leading-tight">100% Original</span>
              <span className="text-[10px] text-stone-500 font-sans">Heavyweight Fabrics</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 p-2">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#0A1E54]/10 flex items-center justify-center text-[#0A1E54] shadow-sm shrink-0">
              <Banknote className="w-5 h-5 text-[#0A1E54]" />
            </div>
            <div className="text-left">
              <span className="text-xs font-mono font-bold text-[#0A1E54] block leading-tight">Cash on Delivery</span>
              <span className="text-[10px] text-stone-500 font-sans">Nationwide 64 Districts</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 p-2">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#0A1E54]/10 flex items-center justify-center text-[#0A1E54] shadow-sm shrink-0">
              <Headphones className="w-5 h-5 text-[#0A1E54]" />
            </div>
            <div className="text-left">
              <span className="text-xs font-mono font-bold text-[#0A1E54] block leading-tight">24/7 Support</span>
              <span className="text-[10px] text-stone-500 font-sans">Live Concierge Desk</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 p-2">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#0A1E54]/10 flex items-center justify-center text-[#0A1E54] shadow-sm shrink-0">
              <RotateCcw className="w-5 h-5 text-[#0A1E54]" />
            </div>
            <div className="text-left">
              <span className="text-xs font-mono font-bold text-[#0A1E54] block leading-tight">Easy Return</span>
              <span className="text-[10px] text-stone-500 font-sans">7-Day Fitting Exchange</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 p-2 col-span-2 md:col-span-1">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#0A1E54]/10 flex items-center justify-center text-[#0A1E54] shadow-sm shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-left">
              <span className="text-xs font-mono font-bold text-[#0A1E54] block leading-tight">Trusted Quality</span>
              <span className="text-[10px] text-stone-500 font-sans">Open Box Inspection</span>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. NEWSLETTER SUBSCRIPTION (From Mockup)                  */}
      {/* ======================================================== */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto my-10">
        <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-[#0A1E54] via-[#122660] to-[#0A1E54] text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden shadow-2xl">
          
          {/* Radial Gold Lighting */}
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-[#C9A66B]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Left Text */}
          <div className="text-left space-y-1.5 z-10">
            <span className="text-[10px] font-mono tracking-widest text-[#C9A66B] uppercase font-bold block">
              VIP COMMUNITY CIRCLE
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-normal text-white">
              Join Our Newsletter
            </h3>
            <p className="text-xs text-stone-300 font-sans max-w-md">
              Get exclusive VIP discount codes, new streetwear drops, and early access alerts.
            </p>
          </div>

          {/* Right Form & Script Accent */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-4 z-10">
            <form onSubmit={handleNewsletterSubmit} className="w-full sm:w-auto flex items-center bg-white/10 border border-white/20 p-1.5 rounded-full backdrop-blur-md">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="bg-transparent text-white placeholder-stone-400 px-4 text-xs font-sans outline-none w-full sm:w-64"
              />
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#C9A66B] hover:bg-[#d8b57b] text-[#0A1E54] text-xs font-mono font-black uppercase tracking-wider shrink-0 transition-all cursor-pointer shadow-md"
              >
                {newsletterSubscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>

            {/* Script graphic flair */}
            <div className="hidden lg:flex items-center gap-1.5 text-right font-serif italic text-white/70 text-xs">
              <span>Stay Updated</span>
              <Send className="w-3.5 h-3.5 text-[#C9A66B]" />
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. LIVE ORDER TRACKING RADAR QUICK LAUNCH                */}
      {/* ======================================================== */}
      <section className="py-8 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0A1E54]/10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 text-left">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-[#C9A66B] font-bold uppercase tracking-widest block">
              REAL-TIME PARCEL RADAR
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0A1E54]">
              {t("Track Your Consignment in Real-Time")}
            </h3>
            <p className="text-xs text-stone-500 font-sans max-w-lg">
              {t("Enter your Patowary tracking ID (PTW-...) to check instant courier progress from atelier to your doorstep.")}
            </p>
          </div>
          <Link
            to="/track-order"
            className="px-6 py-3.5 rounded-2xl bg-[#0A1E54] hover:bg-[#1A3070] text-[#F8F3EA] font-mono text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-2 shrink-0 transition-all hover:scale-102"
          >
            <Truck className="w-4 h-4 text-[#C9A66B]" />
            <span>{t("Launch Courier Radar")}</span>
          </Link>
        </div>
      </section>

      {/* Floating Action Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-[#0A1E54] text-[#F8F3EA] text-xs font-mono font-bold shadow-2xl border border-[#C9A66B]/50 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#C9A66B]" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
