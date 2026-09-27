import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RAW_PRODUCTS } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { playCinematicIntroSound } from '../utils/voiceUtils';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
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
  Search,
  Check,
  RefreshCw,
  MapPin,
  MessageSquare
} from 'lucide-react';
import { NoticeBoard } from '../components/NoticeBoard';
import { IntroAnimation } from '../components/IntroAnimation';
import { SocialInfoBar } from '../components/SocialInfoBar';

export const Home: React.FC = () => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [dbProducts, setDbProducts] = useState<Product[]>(() => {
    const cached = localStorage.getItem('patowary_local_products');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
    return RAW_PRODUCTS;
  });

  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');
  const [selectedVariants, setSelectedVariants] = useState<Record<number, string>>({});

  // Hero interactive state
  const [heroIndex, setHeroIndex] = useState(0);

  // Firestore Sync for products
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), (snapshot) => {
      if (!snapshot.empty) {
        const prodArr: Product[] = [];
        snapshot.forEach((doc) => {
          prodArr.push(doc.data() as Product);
        });
        prodArr.sort((a, b) => a.id - b.id);
        setDbProducts(prodArr);
        localStorage.setItem('patowary_local_products', JSON.stringify(prodArr));
      } else {
        const cached = localStorage.getItem('patowary_local_products');
        if (cached) {
          try {
            setDbProducts(JSON.parse(cached));
          } catch (e) {}
        }
      }
    }, () => {
      const cached = localStorage.getItem('patowary_local_products');
      if (cached) {
        try {
          setDbProducts(JSON.parse(cached));
        } catch (e) {}
      }
    });
    return () => unsub();
  }, []);

  const heroShowcaseItems = [
    {
      id: 1,
      title: "Patowary Heavy Baggy Cargo",
      subtitle: "ARCHITECTURAL UTILITY CARGO",
      category: "CARGO PANTS",
      price: 2450,
      image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800",
      details: {
        spec: "HEAVY TWILL COTTON",
        lining: "100% COMBED COTTON",
        fit: "RELAXED BAGGY DRAPE",
        pockets: "6 REINFORCED UTILITY POCKETS",
        origin: "PATOWARY STUDIO 2026"
      },
      num: "01"
    },
    {
      id: 2,
      title: "French Terry Heavyweight Hoodie",
      subtitle: "DOUBLE LAYERED BOX HOOD",
      category: "HOODIE",
      price: 3200,
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800",
      details: {
        spec: "420 GSM FRENCH TERRY",
        lining: "DOUBLE HOOD LINING",
        fit: "OVERSIZED BOXY FIT",
        pockets: "KANGAROO COMFORT POUCH",
        origin: "PATOWARY STUDIO 2026"
      },
      num: "02"
    },
    {
      id: 3,
      title: "Minimalist Oversized Boxy Tee",
      subtitle: "260 GSM DROP-SHOULDER",
      category: "OVERSIZED TEE",
      price: 1250,
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800",
      details: {
        spec: "260 GSM PURE COMBED",
        lining: "RIBBED CREW NECKLINE",
        fit: "DROP-SHOULDER DRAPE",
        pockets: "SEAMLESS CONSTRUCTION",
        origin: "PATOWARY STUDIO 2026"
      },
      num: "03"
    }
  ];

  const currentHero = heroShowcaseItems[heroIndex];

  const handleHeroQuickAdd = () => {
    const matched = dbProducts.find(p => p.id === currentHero.id) || dbProducts[0];
    if (matched) {
      const defaultVar = matched.variants[0] || 'Standard';
      addToCart(matched, defaultVar, 1);
      playCinematicIntroSound(`${matched.title} added to bag`);
    }
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const variant = selectedVariants[product.id] || product.variants[0] || 'Standard';
    addToCart(product, variant, 1);
    playCinematicIntroSound(`${product.title} added to your bag`);
  };

  const categories = [
    { name: "Baggy & Cargo Pants", label: t("Baggy & Cargo", "ব্যাগি ও কার্গো"), img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600", num: "01" },
    { name: "Oversized Tees & Polos", label: t("Oversized Tees", "ওভারসাইজড টি"), img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600", num: "02" },
    { name: "Hoodies & Sweatshirts", label: t("Hoodies & Fleece", "হুডি ও ফ্লিস"), img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600", num: "03" },
    { name: "Women's Collection", label: t("Women's Fits", "উইমেন্স ফিটস"), img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600", num: "04" },
    { name: "Accessories & Lifestyle", label: t("Accessories", "এক্সেসরিজ"), img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600", num: "05" }
  ];

  const filteredProducts = activeCategoryFilter === 'All' 
    ? dbProducts 
    : dbProducts.filter(p => p.category === activeCategoryFilter);

  // Collect genuine customer reviews across all real products
  const allCustomerReviews = dbProducts.flatMap(p => 
    (p.reviews || []).map(r => ({ ...r, productTitle: p.title, productId: p.id, productAsset: p.assets[0] }))
  );

  return (
    <div className="bg-[#F8F3EA] text-[#111827] min-h-screen font-sans selection:bg-[#0A1E54] selection:text-[#F8F3EA]">
      <NoticeBoard />
      <IntroAnimation />
      <SocialInfoBar />

      {/* Futuristic Glassmorphism Hero Section (Inspired by Reference Design) */}
      <section className="relative px-4 sm:px-8 pt-4 pb-12 sm:pb-20 overflow-hidden">
        
        {/* Background Ethereal Landscape Atmosphere */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 blur-xs pointer-events-none -z-10"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 30%, rgba(201, 166, 107, 0.25) 0%, rgba(10, 30, 84, 0.35) 70%), url('https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1600')`
          }}
        />

        <div className="max-w-6xl mx-auto space-y-6">

          {/* Top Micro Floating Pill Navigation Capsule */}
          <div className="glass-panel py-2 px-4 sm:px-6 rounded-full border border-white/70 shadow-sm flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="font-serif font-black text-sm tracking-wider text-[#0A1E54]">PATOWARY</span>
              <span className="text-stone-300">/</span>
              <span className="text-stone-600 hidden sm:inline">TRENDING STREETWEAR</span>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 uppercase tracking-wider text-[11px] font-bold text-[#0A1E54]">
              <Link to="/products" className="hover:text-[#C9A66B] transition-colors">{t("Hot Drops", "হট ড্রপস")}</Link>
              <Link to="/menu" className="hover:text-[#C9A66B] transition-colors">{t("Collection", "কালেকশন")}</Link>
              <Link to="/search" className="hover:text-[#C9A66B] transition-colors flex items-center gap-1">
                <Search className="w-3 h-3 text-[#C9A66B]" /> {t("Search", "সার্চ")}
              </Link>
            </div>

            <Link
              to="/auth"
              className="px-4 py-1.5 rounded-full bg-[#0A1E54] text-white hover:bg-[#1A3070] text-[10px] tracking-wider uppercase font-bold transition-all shadow-xs"
            >
              Client Login
            </Link>
          </div>

          {/* Main Giant Glassmorphic Showcase Stage */}
          <div className="glass-panel p-6 sm:p-10 rounded-[2.5rem] border border-white/80 shadow-2xl relative overflow-hidden text-left">
            
            {/* Specular Inner Glass Flare */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/60 via-white/10 to-transparent rounded-full blur-2xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              
              {/* Left Column: Numbering, Technical Specs, Hot Drop Badge (4-cols) */}
              <div className="lg:col-span-4 space-y-6">
                
                <div className="flex items-baseline gap-4">
                  <span className="text-6xl sm:text-8xl font-serif font-black text-[#0A1E54]/90 tracking-tighter">
                    {currentHero.num}
                  </span>
                  <div>
                    <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#C9A66B] font-bold block">
                      STREETWEAR DROP
                    </span>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0A1E54] leading-tight">
                      {currentHero.title}
                    </h2>
                  </div>
                </div>

                {/* Technical Garment Specs */}
                <div className="glass-card p-4 rounded-2xl border border-white/90 space-y-2 text-[11px] font-mono text-stone-700">
                  <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                    <span className="text-stone-400">SPECIFICATION:</span>
                    <strong className="text-[#0A1E54]">{currentHero.details.spec}</strong>
                  </div>
                  <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                    <span className="text-stone-400">GARMENT FIT:</span>
                    <strong className="text-[#0A1E54]">{currentHero.details.fit}</strong>
                  </div>
                  <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                    <span className="text-stone-400">POCKETS & CINCH:</span>
                    <strong className="text-[#0A1E54]">{currentHero.details.pockets}</strong>
                  </div>
                  <div className="flex justify-between pt-0.5">
                    <span className="text-stone-400">STUDIO ARCHIVE:</span>
                    <strong className="text-[#C9A66B]">{currentHero.details.origin}</strong>
                  </div>
                </div>

                {/* Sub Mini Card for Sneakers / Accessories (Inspired by Nike sneaker card in reference) */}
                <div className="glass-card p-3 rounded-2xl border border-white/80 flex items-center gap-3">
                  <img 
                    src="https://images.unsplash.com/photo-1542272604-780c96856592?w=300" 
                    alt="Sneaker pairings" 
                    className="w-14 h-14 rounded-xl object-cover border border-white/60 bg-stone-100 shrink-0" 
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-mono uppercase text-[#C9A66B] font-bold block">PAIRING ADVICE</span>
                    <h4 className="text-xs font-bold text-[#0A1E54] truncate">Style With Acid-Wash Wide Denim</h4>
                    <span className="text-[10px] text-stone-500 font-sans">Full skate flare drape</span>
                  </div>
                  <Link 
                    to="/products?category=Baggy+%26+Cargo+Pants"
                    className="p-2 rounded-full bg-white hover:bg-stone-50 text-[#0A1E54] shadow-xs cursor-pointer shrink-0"
                    aria-label="View pairing"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Refresh/Cycle hero showcase */}
                <button
                  onClick={() => setHeroIndex((prev) => (prev + 1) % heroShowcaseItems.length)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card hover:bg-white text-xs font-mono font-bold text-[#0A1E54] cursor-pointer transition-all shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#C9A66B]" />
                  <span>REFRESH HERO FIT</span>
                </button>

              </div>

              {/* Center & Right: Central Crystal Spherical Glass Bubble Orb (8-cols) */}
              <div className="lg:col-span-8 flex flex-col items-center justify-center relative py-6">
                
                {/* The Floating Crystal Glass Orb */}
                <div className="relative w-72 sm:w-96 md:w-[420px] aspect-square rounded-full p-4 flex items-center justify-center">
                  
                  {/* Outer glowing glass aura */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/70 via-white/20 to-white/80 backdrop-blur-2xl border-2 border-white/80 shadow-[0_20px_60px_-10px_rgba(10,30,84,0.18)]" />
                  
                  {/* Subtle specular reflection crescent */}
                  <div className="absolute top-2 left-6 right-6 h-28 rounded-full bg-gradient-to-b from-white/80 to-transparent opacity-60 pointer-events-none" />

                  {/* Streetwear apparel floating inside the glass orb */}
                  <div className="relative z-10 w-4/5 h-4/5 rounded-3xl overflow-hidden shadow-xl border border-white/50 bg-stone-100 group">
                    <img 
                      src={currentHero.image} 
                      alt={currentHero.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                    />
                  </div>

                  {/* Floating Price Pill Capsule on the Glass Orb */}
                  <div className="absolute bottom-12 left-6 sm:left-10 z-20 glass-dark py-1.5 px-3.5 rounded-full border border-white/40 shadow-lg flex items-center gap-2 text-xs font-mono font-bold">
                    <span className="text-[10px] uppercase text-[#C9A66B]">{currentHero.category}</span>
                    <span className="text-white/40">|</span>
                    <span className="text-white">BDT {currentHero.price}</span>
                  </div>

                  {/* Floating "Add to Cart +" Pill Button */}
                  <button
                    onClick={handleHeroQuickAdd}
                    className="absolute bottom-8 right-6 sm:right-10 z-20 px-6 py-2.5 rounded-full bg-[#0A1E54] hover:bg-[#1A3070] text-white text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2 border border-[#C9A66B]/50"
                  >
                    <span>Add to bag</span>
                    <span className="text-[#C9A66B] font-bold text-sm">+</span>
                  </button>

                  {/* Mini decorative glass bubbles */}
                  <div className="absolute -top-3 right-8 w-12 h-12 rounded-full bg-white/50 backdrop-blur-md border border-white/70 shadow-sm" />
                  <div className="absolute top-1/3 -left-4 w-9 h-9 rounded-full bg-white/60 backdrop-blur-md border border-white/80 shadow-sm" />
                </div>

              </div>

            </div>

          </div>

          {/* Sub-Card Docked Below: NEW · PATOWARY SET 2026 (Inspired by bottom dock in reference) */}
          <Link
            to="/products"
            className="glass-panel p-4 sm:p-5 rounded-3xl border border-white/80 shadow-md flex items-center justify-between gap-4 hover:border-[#C9A66B]/60 transition-all duration-300 group text-left cursor-pointer"
          >
            <div className="flex items-center gap-4">
              {/* Mini bubble thumbnail */}
              <div className="w-14 h-14 rounded-2xl overflow-hidden glass-card p-1 border border-white/90 shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200" 
                  alt="Patowary Drop" 
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-serif font-black text-[#0A1E54] tracking-tight group-hover:text-[#1A3070] transition-colors">
                    NEW • PATOWARY STREETWEAR SET 2026
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#C9A66B]/20 text-[#0A1E54] font-bold uppercase hidden sm:inline">
                    HOT DROP
                  </span>
                </div>
                <p className="text-xs text-stone-600 font-sans mt-0.5 line-clamp-1">
                  High-density 260 GSM combed tees, architectural wide denim, and heavy twill cargo line.
                </p>
              </div>
            </div>

            {/* Circular Arrow Button ↗ */}
            <div className="w-11 h-11 rounded-full border border-[#0A1E54]/20 bg-white/80 group-hover:bg-[#0A1E54] group-hover:text-white text-[#0A1E54] transition-all flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105">
              <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform" />
            </div>
          </Link>

        </div>

      </section>

      {/* Trust & Guarantee Banner */}
      <section className="bg-white/70 backdrop-blur-md border-y border-[#0A1E54]/10 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center gap-1.5 p-2">
            <Truck className="w-5 h-5 text-[#0A1E54]" />
            <span className="text-xs font-bold tracking-wide uppercase text-[#111827]">{t("Express Delivery", "দ্রুত ডেলিভারি")}</span>
            <span className="text-[11px] text-stone-500 font-sans">{t("Nationwide 24-48h Delivery", "সারাদেশে ২৪-৪৮ ঘণ্টায় ডেলিভারি")}</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-2">
            <ShieldCheck className="w-5 h-5 text-[#0A1E54]" />
            <span className="text-xs font-bold tracking-wide uppercase text-[#111827]">{t("100% Authentic Quality", "আসল কোয়ালিটি")}</span>
            <span className="text-[11px] text-stone-500 font-sans">{t("Heavyweight 260 GSM Fabrics", "হেভিওয়েট প্রিমিয়াম ফেব্রিক")}</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-2">
            <RotateCcw className="w-5 h-5 text-[#0A1E54]" />
            <span className="text-xs font-bold tracking-wide uppercase text-[#111827]">{t("7-Day Fitting Exchange", "৭ দিনের এক্সচেঞ্জ")}</span>
            <span className="text-[11px] text-stone-500 font-sans">{t("Hassle-free size replacement", "সহজ সাইজ এক্সচেঞ্জ সুবিধা")}</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-2">
            <Sparkles className="w-5 h-5 text-[#C9A66B]" />
            <span className="text-xs font-bold tracking-wide uppercase text-[#111827]">{t("Cash on Delivery & bKash", "ক্যাশ অন ডেলিভারি")}</span>
            <span className="text-[11px] text-stone-500 font-sans">{t("Pay upon courier inspection", "পণ্য দেখে ডেলিভারিম্যানকে পেমেন্ট")}</span>
          </div>
        </div>
      </section>

      {/* Featured Categories (Glassmorphic) */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto text-left">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 pb-3 border-b border-[#0A1E54]/10 gap-3">
          <div>
            <span className="text-xs font-mono font-bold tracking-[0.25em] uppercase text-[#C9A66B]">
              CURATED FASHION COLLECTIONS
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#0A1E54] mt-1">
              {t("Explore By Silhouette", "ক্যাটাগরি অনুযায়ী দেখুন")}
            </h2>
          </div>
          <Link
            to="/menu"
            className="text-xs font-mono tracking-wider font-bold text-[#0A1E54] hover:text-[#C9A66B] uppercase flex items-center gap-1"
          >
            <span>{t("All Categories Menu ↗", "সব ক্যাটাগরি মেনু ↗")}</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((c, i) => (
            <Link
              key={i}
              to={`/products?category=${encodeURIComponent(c.name)}`}
              className="glass-card rounded-2xl overflow-hidden border border-white group relative aspect-[3/4] flex flex-col justify-end p-4 transition-all duration-300"
            >
              <img
                src={c.img}
                alt={c.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1E54]/90 via-[#0A1E54]/25 to-transparent" />
              <div className="relative z-10 text-white space-y-1">
                <span className="text-[10px] font-mono text-[#C9A66B] font-bold block">{c.num}</span>
                <span className="text-xs sm:text-sm font-bold block leading-tight">{c.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="py-8 px-4 sm:px-8 max-w-7xl mx-auto text-left">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 pb-3 border-b border-[#0A1E54]/10 gap-3">
          <div>
            <span className="text-xs font-mono font-bold tracking-[0.25em] uppercase text-[#C9A66B]">
              CURRENT WARDROBE DROPS
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#0A1E54] mt-1">
              {t("Trending Streetwear Fits", "ট্রেন্ডিং স্ট্রিটওয়্যার")}
            </h2>
          </div>
          
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            {['All', 'Baggy & Cargo Pants', 'Oversized Tees & Polos', 'Hoodies & Sweatshirts'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-full cursor-pointer transition-all ${
                  activeCategoryFilter === cat
                    ? 'bg-[#0A1E54] text-white font-bold'
                    : 'glass-card text-stone-600 hover:bg-white'
                }`}
              >
                {cat === 'All' ? t("All Fits", "সব") : cat}
              </button>
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="p-12 glass-card rounded-3xl border border-white text-center space-y-3">
            <ShoppingBag className="w-10 h-10 text-stone-400 mx-auto" />
            <p className="text-sm font-mono text-[#0A1E54] font-bold uppercase">NO PRODUCTS FOUND</p>
            <p className="text-xs text-stone-500 font-sans">Check back soon for new inventory drops.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.slice(0, 8).map((product) => {
              const isWish = isInWishlist(product.id);
              const realReviewsCount = (product.reviews || []).length;
              const avgScore = realReviewsCount > 0 
                ? (product.reviews.reduce((acc, r) => acc + r.rating, 0) / realReviewsCount).toFixed(1)
                : null;

              return (
                <div
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="glass-card rounded-2xl overflow-hidden border border-white flex flex-col justify-between group cursor-pointer"
                >
                  <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden">
                    <img
                      src={product.assets[0]}
                      alt={product.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/80 backdrop-blur-md hover:bg-white text-[#0A1E54] shadow-xs cursor-pointer transition-all"
                      aria-label="Wishlist"
                    >
                      <Heart className={`w-4 h-4 ${isWish ? 'fill-red-500 text-red-500' : 'text-stone-400'}`} />
                    </button>
                  </div>

                  <div className="p-4 space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#C9A66B] font-bold block truncate">
                      {product.category}
                    </span>
                    <h3 className="font-serif font-bold text-sm text-[#0A1E54] group-hover:text-[#1A3070] transition-colors line-clamp-1">
                      {product.title}
                    </h3>

                    {/* Real Review Counter with Direct Link */}
                    <div className="flex items-center gap-1.5 text-[11px] font-mono">
                      {avgScore ? (
                        <Link
                          to={`/product/${product.id}/reviews`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 text-[#C9A66B] font-bold hover:underline"
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{avgScore} ({realReviewsCount})</span>
                        </Link>
                      ) : (
                        <Link
                          to={`/product/${product.id}/reviews`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-stone-400 hover:text-[#0A1E54] transition-colors"
                        >
                          No reviews yet ↗
                        </Link>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="font-mono font-bold text-sm text-[#0A1E54]">
                        BDT {product.price}
                      </span>
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className="px-3 py-1.5 rounded-lg bg-[#0A1E54] hover:bg-[#1A3070] text-white text-[10px] font-mono uppercase font-bold tracking-wider transition-all shadow-xs cursor-pointer"
                      >
                        Add +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#0A1E54] hover:bg-[#1A3070] text-white text-xs font-mono font-bold tracking-widest uppercase shadow-md transition-all hover:scale-105"
          >
            <span>{t("VIEW ALL COLLECTIONS", "সব কালেকশন দেখুন")}</span>
            <ArrowRight className="w-4 h-4 text-[#C9A66B]" />
          </Link>
        </div>
      </section>

      {/* Genuine Customer Reviews Section (Strictly Real Reviews Only - No Demo Fake Testimonials) */}
      <section className="py-14 px-4 sm:px-8 max-w-7xl mx-auto text-left">
        <div className="mb-8 pb-3 border-b border-[#0A1E54]/10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-mono font-bold tracking-[0.25em] uppercase text-[#C9A66B]">
              GENUINE CUSTOMER EXPERIENCES
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0A1E54] mt-1">
              {t("Real Community Feedback", "আসল গ্রাহকদের মতামত")}
            </h2>
          </div>
          <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            ✓ 100% Verified Customer Feedback
          </span>
        </div>

        {allCustomerReviews.length === 0 ? (
          <div className="p-8 sm:p-12 glass-card rounded-3xl border border-white text-center space-y-3">
            <MessageSquare className="w-10 h-10 text-stone-400 mx-auto" />
            <h3 className="font-serif font-bold text-lg text-[#0A1E54]">
              {t("No Customer Reviews Recorded Yet", "এখনো কোনো রিভিউ রেকর্ড হয়নি")}
            </h3>
            <p className="text-xs text-stone-600 font-sans max-w-md mx-auto leading-relaxed">
              {t(
                "We do not display fabricated demo reviews. Be the first customer to purchase and share your thoughts on the drape and fabric!",
                "আমরা কোনো ফেক বা ডেমো রিভিউ দেখাই না। যেকোনো প্রোডাক্ট কিনে প্রথম আসল রিভিউটি আপনিই দিন!"
              )}
            </p>
            <div className="pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#0A1E54] text-white text-xs font-mono uppercase font-bold tracking-wider hover:bg-[#1A3070] transition-all shadow-xs"
              >
                <span>{t("Browse Catalog To Review", "রিভিউ দিতে প্রোডাক্ট দেখুন")}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C9A66B]" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allCustomerReviews.slice(0, 6).map((rev, idx) => (
              <div key={idx} className="glass-card p-6 rounded-2xl border border-white space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0A1E54]">{rev.userName}</span>
                  <div className="flex text-[#C9A66B]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-stone-700 text-xs sm:text-sm leading-relaxed font-sans italic">
                  "{rev.comment}"
                </p>
                <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px] font-mono">
                  <Link to={`/product/${rev.productId}/reviews`} className="text-[#0A1E54] hover:underline font-bold truncate max-w-[180px]">
                    {rev.productTitle}
                  </Link>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Verified Buyer
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Official Location Banner */}
      <section className="py-6 px-4 max-w-7xl mx-auto">
        <div className="glass-panel p-5 rounded-3xl border border-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#0A1E54]">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-[#C9A66B] shrink-0" />
            <span className="font-bold">
              {t("OFFICIAL STORE LOCATION: বাংলাদেশ, চাঁদপুর ৩৬৫০, ফরিদগঞ্জ", "অফিসিয়াল স্টোর লোকেশন: বাংলাদেশ, চাঁদপুর ৩৬৫০, ফরিদগঞ্জ")}
            </span>
          </div>
          <Link
            to="/menu"
            className="px-4 py-2 rounded-full bg-[#0A1E54] text-white hover:bg-[#1A3070] uppercase font-bold text-[10px] tracking-wider transition-all"
          >
            Store Information ↗
          </Link>
        </div>
      </section>

    </div>
  );
};
