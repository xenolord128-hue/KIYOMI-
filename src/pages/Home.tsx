import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS } from '../data/products';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { playProIntroSynth, playCinematicIntroSound } from '../utils/voiceUtils';
import { 
  ArrowRight, 
  Sparkles, 
  Heart, 
  ShoppingBag, 
  Compass, 
  Fingerprint, 
  RotateCcw,
  Star,
  Quote,
  Flame,
  Truck,
  ShieldCheck,
  Layers,
  Zap,
  Grid,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Terminal,
  Sliders,
  Eye,
  MousePointer2,
  RefreshCw,
  Clock,
  ArrowUpRight,
  UserCheck
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, limit } from 'firebase/firestore';
import { useLanguage } from '../contexts/LanguageContext';
import { NoticeBoard } from '../components/NoticeBoard';
import { SocialInfoBar } from '../components/SocialInfoBar';
import { IntroAnimation } from '../components/IntroAnimation';

const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=1600",
    title: "KIYOMI EXCLUSIVE GADGETS",
    subtitle: "2026 DROPS",
    tagline: "STUNNING AMOLED SCREENS. METICULOUS HARDWARE CORES."
  },
  {
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1600",
    title: "PREMIUM AUDIO & GaN CHARGERS",
    subtitle: "DHAKA DISTRICT GUILD",
    tagline: "DESIGNED FOR LONGStandby LIFESPAN & FAST CHARGE MOBILITY."
  },
  {
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1600",
    title: "TACTILE KEYBOARDS & SOUNDBARS",
    subtitle: "LIMITED COMMISSIONS ONLY",
    tagline: "MECHANICAL SWITCH RESONANCE & HI-RES ACOUSTICS."
  }
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { t } = useLanguage();

  const [slideIndex, setSlideIndex] = useState(0);
  const [dbProducts, setDbProducts] = useState(PRODUCTS);
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>({});



  // Sync products from firestore if admins have edited them
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), (snapshot) => {
      if (!snapshot.empty) {
        const prodArr: any[] = [];
        snapshot.forEach((doc) => {
          prodArr.push(doc.data());
        });
        // Sort by ID to keep order consistent
        prodArr.sort((a,b) => a.id - b.id);
        setDbProducts(prodArr);
      }
    }, (err) => {
      // Offline fallback is already product data
    });
    return () => unsub();
  }, []);

  // Automate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex(prev => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Soft speech synth welcoming
  const handleHeroInteraction = () => {
    playProIntroSynth();
    playCinematicIntroSound("Welcome to KIYOMI. Discover next-gen premium gadgets and chronographs.");
  };

  const categories = ["Smartwatches", "Earbuds & Audio", "Power & Chargers", "Mice & Keyboards", "Smart Gadgets"];

  const testimonials = [
    {
      name: "MAHAFUZUR RAHAMAN",
      guildCode: "MEMBER #205",
      comment: "Absolutely top-tier build quality. The Chrono X1 smartwatch titanium frame stands stiff exactly how premium gadget aficionados appreciate. A masterclass in Dhaka electronics.",
      rating: 5
    },
    {
      name: "MAHAFUZUR RAHAMAN",
      guildCode: "MEMBER #491",
      comment: "KIYOMI mechanical keypads feel luxurious. The gasket acoustics are beautifully deep without any rattle. Easily competes with foreign high-end brands.",
      rating: 5
    }
  ];

  return (
    <div id="home-page-viewport" className="bg-soft-mint text-big-stone min-h-screen selection:bg-deep-emerald selection:text-lime-neon">
      
      {/* Top Banner announcing updates */}
      <NoticeBoard />

      <IntroAnimation />

      {/* Dynamic Social manifesto with rotating mini product popups */}
      <SocialInfoBar />
      
      {/* 1. Cinematic Hero Section */}
      <section className="relative h-[82vh] overflow-hidden bg-[#E5E2DD] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={slideIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `linear-gradient(to bottom, rgba(25,45,60,0.35), rgba(25,45,60,0.65)), url(${HERO_SLIDES[slideIndex].image})` }}
          />
        </AnimatePresence>

        {/* Content Layer */}
        <div className="relative z-10 text-center px-4 max-w-4xl text-seashell flex flex-col items-center">
          <motion.span 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lime-neon font-bold text-xs sm:text-sm tracking-[0.35em] uppercase mb-4"
          >
            {HERO_SLIDES[slideIndex].subtitle}
          </motion.span>
          
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl sm:text-6xl md:text-7xl font-serif tracking-[0.2em] font-light leading-tight uppercase text-seashell"
          >
            {HERO_SLIDES[slideIndex].title.split(' ')[0]} <br/>
            <span className="italic font-normal text-seashell">{HERO_SLIDES[slideIndex].title.split(' ').slice(1).join(' ')}</span>
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-seashell/85 text-xs sm:text-sm tracking-[0.2em] uppercase font-sans max-w-2xl mt-6 font-medium"
          >
            {HERO_SLIDES[slideIndex].tagline}
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center"
          >
            <button
              onClick={() => navigate('/products')}
              className="px-8 py-3.5 bg-deep-emerald hover:bg-big-stone text-lime-neon text-[11px] uppercase tracking-[0.25em] font-bold transition-colors rounded-none cursor-pointer flex items-center gap-2 border border-deep-emerald hover:border-big-stone"
            >
              EXPLORE COLLECTION <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                const specItem = dbProducts.find(p => p.category === 'Smartwatches');
                if (specItem) navigate(`/product/${specItem.id}`);
              }}
              className="px-8 py-3.5 border border-seashell text-seashell text-[11px] uppercase tracking-[0.25em] font-bold hover:bg-seashell/10 transition-colors rounded-none cursor-pointer backdrop-blur-sm"
            >
              THE EDIT
            </button>
          </motion.div>
        </div>

        {/* Swipe Slide Dot Indicators */}
        <div className="absolute bottom-8 z-10 flex space-x-3">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideIndex(i)}
              className={`h-[2px] transition-all cursor-pointer ${slideIndex === i ? 'bg-lime-neon w-12' : 'bg-seashell/45 w-8'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. Curated Products Gallery */}
      <section id="curated-products-shelf" className="bg-soft-mint/30 py-16 border-b border-cascade/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-12">
          
          {/* Top Left View All Products Button / Action Row */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <Link 
              to="/products"
              className="self-start inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-mono font-bold tracking-wider text-[#003E2C] hover:text-[#CBF23D] hover:bg-[#003E2C] bg-white border border-[#003E2C]/20 hover:border-[#003E2C] py-2 px-3 sm:px-4 rounded-lg shadow-xs transition-all active:scale-95"
            >
              <Grid className="w-3.5 h-3.5 text-emerald-800 animate-pulse" />
              <span>VIEW ALL PRODUCTS • ভিউ অল প্রোডাক্ট</span>
            </Link>
            <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest hidden sm:inline-block">
              LIMITED HOMEPAGE EXHIBITION • MAX 35 PIECES
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-3 border-b border-stone-200/40">
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.3em] uppercase text-deep-emerald-800">
                {t("KIYOMI ARCHIVE • আমাদের বিশেষ কালেকশন", "KIYOMI ARCHIVE • EXCLUSIVE SELECTION")}
              </span>
              <h3 className="text-xl sm:text-2xl font-serif tracking-[0.1em] text-big-stone font-light mt-1.5 uppercase">
                {t("COLLECTIONS")}
              </h3>
            </div>
            <Link 
              to="/products"
              className="text-[10px] uppercase font-semibold tracking-[0.15em] text-[#003E2C] hover:text-black pb-1 border-b border-[#003E2C] mt-2 md:mt-0 transition-colors self-start"
            >
              {t("VIEW ENTIRE CATALOG (ALL ITEMS) ➔", "VIEW ALL PRODUCTS ➔")}
            </Link>
          </div>

          {/* Swipe indicator for mobile users */}
          <div className="flex sm:hidden items-center justify-between text-[10px] text-stone-500 font-mono tracking-wider mb-4 px-2.5 py-2 bg-white/60 rounded-lg border border-stone-200/40">
            <span className="flex items-center gap-1 font-sans font-medium text-stone-600">
              <span className="w-1.5 h-1.5 rounded-full bg-deep-emerald animate-ping" />
              {t("প্রতিটি কালেকশন আলাদাভাবে ডানে-বামে এবং নিচে স্ক্রল করুন", "Swipe horizontally or scroll down to explore items")}
            </span>
            <span className="text-[#003E2C] font-bold">{t("Swipe ➔")}</span>
          </div>

          {/* 9 Independent Elegant horizontal scrolling rows stacked on top of each other with no label boundaries */}
          <div className="space-y-4 sm:space-y-6">
            {Array.from({ length: 9 }).map((_, rowIndex) => {
              // Row elements: select 12 products per row. Keep it full and varied by wrapping around dbProducts.
              const itemsPerRow = 12;
              const rowProducts = Array.from({ length: itemsPerRow }).map((_, i) => {
                const prodIdx = (rowIndex * itemsPerRow + i) % dbProducts.length;
                return dbProducts[prodIdx];
              }).filter(Boolean);

              if (rowProducts.length === 0) return null;

              return (
                <div key={rowIndex} className="py-4 pb-8 border-b border-black/[0.08] last:border-b-0">
                  {/* Horizontal Scroll Shelf with custom snap & scrollbar hiding, buttery smooth touch rendering */}
                  <div className="flex overflow-x-auto snap-x snap-mandatory gap-2.5 scrollbar-hide -mx-3 px-3 sm:mx-0 sm:px-0">
                    {rowProducts.map((product, idx) => {
                      const uniqueKey = `${product.id}-${rowIndex}-${idx}`;
                      
                      return (
                        <motion.div
                          key={uniqueKey}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-40px" }}
                          whileHover={{ y: -8, scale: 1.04, rotate: 0.5, boxShadow: "0 22px 35px rgba(0, 0, 0, 0.07)" }}
                          transition={{ 
                            type: "spring",
                            stiffness: 280,
                            damping: 22
                          }}
                          style={{ willChange: "transform" }}
                          className="flex-shrink-0 w-[42vw] xs:w-[150px] sm:w-[185px] md:w-[210px] snap-start group flex flex-col bg-white border border-stone-200/60 relative overflow-hidden p-3 rounded-2xl shadow-xs transition-all duration-300"
                        >

                          {/* Image Overlay Frame */}
                          <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-[#FAF9F5] rounded-md cursor-pointer">
                            <img
                              src={product.assets[0]}
                              alt={product.title}
                              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-104"
                              referrerPolicy="no-referrer"
                            />
                            
                            {/* Compact stock warnings */}
                            {product.stock && product.stock <= 5 ? (
                              <span className="absolute top-1.5 left-1.5 bg-deep-emerald text-lime-neon font-mono text-[5.5px] sm:text-[6.5px] uppercase px-1.5 py-0.5 tracking-wider font-extrabold rounded">
                                LTD ({product.stock})
                              </span>
                            ) : null}

                            {/* Quick view detail layer */}
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="bg-white/95 text-stone-900 border border-stone-200 py-1 px-2 text-[8px] font-mono tracking-widest uppercase rounded shadow-xs">
                                {t("VIEW")}
                              </span>
                            </div>
                          </Link>

                          {/* Info block */}
                          <div className="pt-2 space-y-1 flex-grow flex flex-col justify-between font-sans">
                            <div>
                              <div className="flex items-center justify-between text-[7px] sm:text-[9px] font-mono font-bold tracking-wider uppercase text-stone-500">
                                <p className="truncate max-w-[62%]">{t(product.category)}</p>
                                <span className="text-[9px] sm:text-[11px] font-mono font-bold text-[#003E2C] shrink-0">৳ {product.price}</span>
                              </div>
                              <Link to={`/product/${product.id}`} className="block mt-0.5">
                                <h4 className="text-[10px] sm:text-[12px] font-serif italic text-stone-900 hover:text-emerald-800 tracking-wide transition-colors truncate">
                                  {product.title}
                                </h4>
                              </Link>
                            </div>

                            <div className="pt-1.5 border-t border-stone-100 flex items-center justify-between gap-1 mt-auto">
                              {/* Left: Quick Save */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  toggleWishlist(product);
                                }}
                                className={`p-1 rounded-md border transition-all cursor-pointer active:scale-95 flex items-center justify-center ${
                                  isInWishlist(product.id) 
                                    ? 'bg-[#966b26] border-[#966b26] text-white' 
                                    : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                                }`}
                                title="Toggle Wishlist"
                              >
                                <Heart className="w-2.5 h-2.5 fill-current" />
                              </button>

                              {/* Right: Buy/Details */}
                              <Link 
                                to={`/product/${product.id}`}
                                className="flex-grow text-center py-1 px-1.5 bg-[#CBF23D] hover:bg-[#003E2C] hover:text-white text-[#0C1E1F] font-bold text-[8px] sm:text-[9px] uppercase tracking-wider transition-all rounded-md flex items-center justify-center gap-0.5 hover:shadow-xs cursor-pointer"
                              >
                                <span>{t("BUY")}</span>
                                <ArrowRight className="w-2 h-2" />
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Premium Core Value Propositions & Logistics Section */}
      <section className="bg-white border-b border-cascade/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <span className="text-[10px] font-mono font-bold tracking-[0.35em] uppercase text-deep-emerald flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#526600] animate-pulse" /> PREMIUM SERVICES & CREDENTIALS
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif tracking-widest text-[#003E2C] font-light mt-2.5 uppercase">
              OUR TRUST PROTOCOL & GUARANTY
            </h3>
            <div className="w-16 h-[1.5px] bg-[#526600]/30 mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-soft-mint/45 border border-cascade/10 rounded-2xl flex flex-col items-center text-center shadow-xs hover:shadow transition-shadow duration-300">
              <div className="w-12 h-12 bg-deep-emerald text-[#CBF23D] rounded-full flex items-center justify-center mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="font-serif italic font-bold text-base text-big-stone mb-1.5">দ্রুত ডেলিভারি সুবিধা (Swift Dispatch)</h4>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                সারা বাংলাদেশে ১৮-৪৮ ঘণ্টায় আমরা দ্রুততম শিপমেন্ট দিয়ে থাকি। প্রতিটি অর্ডার ট্র্যাক করার লাইভ সুবিধা পাবেন।
              </p>
            </div>

            <div className="p-6 bg-soft-mint/45 border border-cascade/10 rounded-2xl flex flex-col items-center text-center shadow-xs hover:shadow transition-shadow duration-300">
              <div className="w-12 h-12 bg-deep-emerald text-[#CBF23D] rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-serif italic font-bold text-base text-big-stone mb-1.5">শতভাগ বিশ্বস্ত ক্যাশ অন ডেলিভারি</h4>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                পণ্য হাতে পেয়ে চেক করে পেমেন্ট করার সম্পূর্ণ নিরাপদ ও নির্ভরযোগ্য সুবিধা। কোনো ঝুঁকি ছাড়াই আত্মবিশ্বাসে কেনাকাটা করুন।
              </p>
            </div>

            <div className="p-6 bg-soft-mint/45 border border-cascade/10 rounded-2xl flex flex-col items-center text-center shadow-xs hover:shadow transition-shadow duration-300">
              <div className="w-12 h-12 bg-deep-emerald text-[#CBF23D] rounded-full flex items-center justify-center mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="font-serif italic font-bold text-base text-big-stone mb-1.5">প্রিমিয়াম হেভি ফেব্রিক কোয়ালিটি</h4>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                ৪৪০+ জিএসএম পর্যন্ত ভারী লুপ টেরি কটন এবং শতভাগ পরিবেশবান্ধব প্রিমিয়াম ফেব্রিক দিয়ে তৈরি দীর্ঘস্থায়ী পোশাকসমূহ।
              </p>
            </div>

            <div className="p-6 bg-soft-mint/45 border border-cascade/10 rounded-2xl flex flex-col items-center text-center shadow-xs hover:shadow transition-shadow duration-300">
              <div className="w-12 h-12 bg-deep-emerald text-[#CBF23D] rounded-full flex items-center justify-center mb-4">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h4 className="font-serif italic font-bold text-base text-big-stone mb-1.5">সহজ ৭ দিনের এক্সচেঞ্জ পলিসি</h4>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                সাইজ বা ফিটিং নিয়ে কোনো চিন্তা নেই! আমাদের রয়েছে একদম সহজ ও দ্রুত ৭ দিনব্যাপী পণ্য এক্সচেঞ্জ সুবিধা।
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* 5. Customer Testimonials Section */}
      <section className="bg-big-stone text-seashell py-24 border-t border-cascade/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-12">
          <div className="text-center mb-16">
            <span className="text-[11px] font-bold tracking-[0.3em] text-lime-neon uppercase">VALUED CLIENT TESTIMONIALS</span>
            <h3 className="text-3xl font-serif tracking-[0.2em] text-seashell font-light mt-2 uppercase">CUSTOMER REVIEWS</h3>
            <div className="w-12 h-[2px] bg-lime-neon/55 mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {testimonials.map((test, i) => (
              <div key={i} className="bg-white/5 border border-white/5 p-8 relative space-y-4">
                <Quote className="w-8 h-8 text-lime-neon/15 absolute top-6 right-6" />
                <div className="flex gap-1">
                  {[...Array(test.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-lime-neon text-lime-neon" />
                  ))}
                </div>
                <p className="text-seashell/85 text-xs sm:text-sm font-serif leading-relaxed italic">
                  "{test.comment}"
                </p>
                <div className="pt-2">
                  <span className="block text-xs font-mono tracking-widest uppercase font-bold text-seashell">{test.name}</span>
                  <span className="block text-[8px] font-mono tracking-widest text-lime-neon uppercase mt-0.5">VERIFIED CUSTOMER</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
