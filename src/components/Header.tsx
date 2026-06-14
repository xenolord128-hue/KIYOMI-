import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { 
  Heart, 
  User, 
  Menu, 
  X, 
  Search, 
  LogOut, 
  Lock,
  ShoppingCart,
  CheckCircle2,
  Bell,
  BellRing,
  Sparkles,
  Youtube,
  Volume2,
  Flame,
  Globe,
  Copy,
  Check,
  ThumbsUp,
  MessageSquare,
  Send,
  ChevronRight,
  Facebook
} from 'lucide-react';
import { playCinematicIntroSound } from '../utils/voiceUtils';
import { motion, AnimatePresence } from 'motion/react';

const sparkles = [
  { width: 2, deg: 25, duration: 11 },
  { width: 1, deg: 100, duration: 18 },
  { width: 1, deg: 280, duration: 5 },
  { width: 2, deg: 200, duration: 3 },
  { width: 2, deg: 30, duration: 20 },
  { width: 2, deg: 300, duration: 9 },
  { width: 1, deg: 250, duration: 4 },
  { width: 2, deg: 210, duration: 8 },
  { width: 2, deg: 100, duration: 9 },
  { width: 1, deg: 15, duration: 13 },
  { width: 1, deg: 75, duration: 18 },
  { width: 2, deg: 65, duration: 6 },
  { width: 2, deg: 50, duration: 7 },
  { width: 1, deg: 320, duration: 5 },
  { width: 1, deg: 220, duration: 5 },
  { width: 1, deg: 215, duration: 2 },
  { width: 2, deg: 135, duration: 9 },
  { width: 2, deg: 45, duration: 4 },
  { width: 1, deg: 78, duration: 16 },
  { width: 1, deg: 89, duration: 19 },
  { width: 2, deg: 65, duration: 14 },
  { width: 2, deg: 97, duration: 1 },
  { width: 1, deg: 174, duration: 10 },
  { width: 1, deg: 236, duration: 5 },
];

export const Header: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const { cartItems, toggleCart } = useCart();
  const { wishlist } = useWishlist();
  const { locale, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false);
  
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // YouTube Brand Channel Pop-up states
  const [isChannelBadgeOpen, setIsChannelBadgeOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'home' | 'drops' | 'community' | 'about'>('home');
  const [isSubscribed, setIsSubscribed] = useState(() => {
    return (localStorage.getItem('KIYOMI_subscribed') || localStorage.getItem('dorax_subscribed')) === 'true';
  });
  const [subscribers, setSubscribers] = useState(() => {
    const base = 15382;
    const isSub = (localStorage.getItem('KIYOMI_subscribed') || localStorage.getItem('dorax_subscribed')) === 'true';
    return isSub ? base + 1 : base;
  });

  const handleSubscribeToggle = () => {
    if (isSubscribed) {
      setIsSubscribed(false);
      setSubscribers(prev => prev - 1);
      localStorage.setItem('KIYOMI_subscribed', 'false');
      playCinematicIntroSound("Unsubscribed. You will no longer receive priority notifications from Kiyomi gadget guild.");
    } else {
      setIsSubscribed(true);
      setSubscribers(prev => prev + 1);
      localStorage.setItem('KIYOMI_subscribed', 'true');
      playCinematicIntroSound("Subscription confirmed! Welcome to the premium Kiyomi gadget guild. Access codes secured.");
    }
  };

  // Promo Code copier state
  const [copiedCode, setCopiedCode] = useState(false);
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    playCinematicIntroSound(`Coupon code ${code} copied to clipboard.`);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Community Poll voting states
  const [poll1Votes, setPoll1Votes] = useState({ optionA: 1248, optionB: 412, userVoted: null as 'A' | 'B' | null });
  const [poll2Votes, setPoll2Votes] = useState({ optionA: 789, optionB: 1145, userVoted: null as 'A' | 'B' | null });

  const handleVotePoll1 = (opt: 'A' | 'B') => {
    if (poll1Votes.userVoted) return;
    setPoll1Votes(prev => ({
      ...prev,
      optionA: opt === 'A' ? prev.optionA + 1 : prev.optionA,
      optionB: opt === 'B' ? prev.optionB + 1 : prev.optionB,
      userVoted: opt
    }));
    playCinematicIntroSound(`Vote cast. Siding with ${opt === 'A' ? 'Heavy Loop Terry' : 'Bamboo Linen'}.`);
  };

  const handleVotePoll2 = (opt: 'A' | 'B') => {
    if (poll2Votes.userVoted) return;
    setPoll2Votes(prev => ({
      ...prev,
      optionA: opt === 'A' ? prev.optionA + 1 : prev.optionA,
      optionB: opt === 'B' ? prev.optionB + 1 : prev.optionB,
      userVoted: opt
    }));
    playCinematicIntroSound(`Preference marked. ${opt === 'A' ? 'Onyx and Lime' : 'Desaturated Sage'}.`);
  };

  // Community comments states
  const [comments, setComments] = useState([
    { id: 1, user: 'Sabbir Ahmed', text: 'Brother, the 480GSM hoodie structure is absolutely rigid! Best fit in Dhaka town.', time: '2 hours ago', likes: 42 },
    { id: 2, user: 'Nabila H.', text: 'Is the Sage Windbreaker restocking this winter season?', time: '1 day ago', likes: 19 },
    { id: 3, user: 'Zayan Kabir', text: 'Highly recommend the Linen Drop Tees. Very breathable for high temperatures.', time: '3 days ago', likes: 31 }
  ]);
  const [newCommentText, setNewCommentText] = useState('');

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const comment = {
      id: Date.now(),
      user: user?.email ? user.email.split('@')[0] : 'Premium Client',
      text: newCommentText,
      time: 'Just now',
      likes: 0
    };
    setComments(prev => [comment, ...prev]);
    setNewCommentText('');
    playCinematicIntroSound("Feedback documented. Thank you for contributing to the street ledger.");
  };

  const handleLikeComment = (id: number) => {
    setComments(prev => prev.map(c => c.id === id ? { ...c, likes: c.likes + 1 } : c));
    playCinematicIntroSound("Feedback upvoted.");
  };

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
      isScrolled 
        ? 'bg-soft-mint/50 backdrop-blur-md border-cascade/15 shadow-sm' 
        : 'bg-soft-mint/95 backdrop-blur-xs border-cascade/25'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-12">
        <div className="flex items-center justify-between h-20">
          
          {/* Left section: Circular Logo and Branding next to it side-by-side (matching image) */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              to="/portfolio"
              className="group relative select-none cursor-pointer focus:outline-none flex items-center justify-center font-mono text-[8px]"
              aria-label="Kiyomi premium brand portfolio"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-deep-emerald via-[#D1F843] to-cascade rounded-full opacity-20 group-hover:opacity-75 blur-xs transition duration-500 group-hover:duration-200" />
              <img
                src="https://i.ibb.co.com/Xxv0xKL8/Black-White-Simple-Modern-Neon-Griddy-Bold-Technology-Pixel-Electronics-Store-Logo.png"
                alt="KIYOMI Premium Brand Logo"
                className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-[#0D1415] p-1 object-contain border border-[#D1F843]/40 transition-transform duration-300 group-hover:scale-105 active:scale-95"
                referrerPolicy="no-referrer"
              />
              {/* Pulse live badge */}
              <span className="absolute -bottom-0.5 -right-0.5 bg-[#D1F843] text-[6px] text-black font-bold px-1 rounded-sm scale-90 sm:scale-100 group-hover:scale-110 transition-transform border border-[#0D1415] font-mono">
                PORTFOLIO
              </span>
            </Link>
            <Link to="/" className="flex flex-col text-left select-none">
              <h1 className="text-lg sm:text-2xl font-serif tracking-[0.2em] font-light leading-none text-big-stone hover:text-deep-emerald transition-colors">
                KIYOMI
              </h1>
              <span className="text-[7px] sm:text-[8px] font-mono tracking-[0.3em] uppercase text-cascade mt-1 leading-none">
                PREMIUM GADGETS
              </span>
            </Link>
          </div>

          {/* Spacer / Center Navigation area (desktop) */}
          <nav className="hidden lg:flex space-x-6 text-[10px] font-semibold tracking-[0.2em] text-big-stone/75 uppercase ml-8 grow justify-start">
            <Link to="/products" className="hover:text-deep-emerald transition-colors">Collections</Link>
            <Link to="/track-order" className="hover:text-deep-emerald transition-colors">Track Order</Link>
          </nav>

          {/* Right section: Control Options mapped exactly to requested sequence and visual placement:
              Order from left to right: [Search icon] -> [Cart icon] -> [Profile/User icon] -> [Menu toggler]
              All triggers route directly to dedicated pages for a premium multi-page website experience. */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            
            {/* 1. Search dedicated page transition */}
            <Link 
              to="/search"
              className="p-2 text-big-stone hover:text-deep-emerald transition-colors"
              aria-label="Search Collection"
            >
              <Search className="w-5 h-5" strokeWidth={1.5} />
            </Link>

            {/* 2. Premium Cart dedicated page transition */}
            <Link
              to="/cart"
              className="p-2 text-big-stone hover:text-deep-emerald transition-colors relative"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-deep-emerald text-lime-neon font-mono text-[7px] xl:text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* 3. Account login / profile dedicated page transition */}
            <Link
              to="/profile"
              className="p-2 text-big-stone hover:text-deep-emerald transition-colors relative"
              aria-label="User account and profile status"
            >
              {user ? (
                <img 
                  src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                  alt="User Account"
                  className="w-5 h-5 rounded-full border border-cascade/40"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User className="w-5 h-5" strokeWidth={1.5} />
              )}
            </Link>

            {/* 4. Menu toggler (Hamburger Option at absolute right) */}
            <button
              onClick={() => setIsMenuDrawerOpen(true)}
              className="p-2 bg-big-stone text-lime-neon hover:bg-deep-emerald hover:text-white transition-all shadow-sm rounded-lg flex items-center justify-center border border-big-stone cursor-pointer"
              aria-label="Toggle Navigation Drawer"
            >
              <Menu className="w-5 h-5 text-lime-neon" strokeWidth={2} />
            </button>

          </div>
        </div>
      </div>

      {/* Elegant sliding Search inline header overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute inset-0 bg-[#FDFBF7] px-4 sm:px-12 flex items-center justify-between z-50 border-b border-[#1A1A1A20]"
          >
            <form onSubmit={(e) => { handleSearchSubmit(e); setIsSearchOpen(false); }} className="w-full max-w-3xl mx-auto flex items-center gap-3">
              <Search className="w-5 h-5 text-[#1A1A1A]/60 shrink-0" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("SEARCH EXCLUSIVE KIYOMI STREETWEAR COLLECTIONS...")}
                className="w-full bg-transparent focus:outline-none text-[#1A1A1A] font-sans text-xs sm:text-sm tracking-wider uppercase py-2 placeholder-stone-400"
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-2.5 bg-neutral-100 hover:bg-red-500 text-stone-600 hover:text-white rounded-full transition-all hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center border border-stone-200 shrink-0 shadow-sm"
                aria-label="Close search overlay"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Immersive Full-Screen Navigation Drawer (Mobile & Desktop shared fullscreen portal) with Unified dark theme */}
      <AnimatePresence>
        {isMenuDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 w-screen h-screen bg-[#0D1415]/98 text-[#FAFAF8] shadow-2xl z-50 flex flex-col p-6 sm:p-12 overflow-y-auto backdrop-blur-md"
          >
            {/* Drawer Header with Close Button */}
            <div id="drawer-header-index" className="flex items-center justify-between pb-6 border-b border-white/10 max-w-7xl mx-auto w-full shrink-0">
              <div className="flex flex-col text-left">
                <span className="font-serif tracking-widest text-lg sm:text-2xl font-bold text-white uppercase">KIYOMI PREMIUM</span>
                <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.25em] text-[#D1F843] uppercase mt-1">
                  EST. 2026 • GUILD TIER: THE DIRECTORY (FULL SCREEN)
                </span>
              </div>
              <button 
                onClick={() => setIsMenuDrawerOpen(false)}
                className="p-2 sm:p-3 bg-[#1C282A] text-[#D1F843] hover:text-white hover:bg-rose-650 rounded-full transition-all hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer shadow-md border border-white/10"
                aria-label="Close menu drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Core Content Container in a beautiful grid ratio (balanced desktop-first layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 max-w-7xl mx-auto w-full mt-8 flex-1">
              
              {/* Left Side (Lg span 6): Complete Visual Image-backed Categories Gallery */}
              <div className="lg:col-span-6 flex flex-col space-y-6 text-left">
                <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.3em] text-[#D1F843] uppercase font-bold border-b border-white/5 pb-2">
                  ⚡ HIGH-FIDELITY GADGET CORE VALUES
                </span>
                
                <div className="space-y-4">
                  <div className="p-6 bg-[#121E20] border border-white/5 rounded-2xl">
                    <span className="text-[8px] font-mono tracking-widest text-[#D1F843] uppercase block mb-1">OUR MANIFESTO</span>
                    <h4 className="text-sm font-serif italic text-white leading-relaxed">Conscious High-Tech, Defined.</h4>
                    <p className="text-[11px] text-stone-300 font-sans mt-2 leading-relaxed">
                      KIYOMI merges elite design aesthetics with high-performance, original components. We refuse temporary low-grade trends to create highly durable smart gadgets for tech power users.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[#121E20] border border-white/5 rounded-2xl text-left">
                      <span className="text-[8px] font-mono tracking-widest text-stone-400 uppercase block mb-1">SPECIFICATIONS</span>
                      <p className="text-xs font-bold text-[#D1F843] font-sans">AMOLED Displays & Alloy Frames</p>
                    </div>
                    <div className="p-4 bg-[#121E20] border border-white/5 rounded-2xl text-left">
                      <span className="text-[8px] font-mono tracking-widest text-stone-400 uppercase block mb-1">SHIPPING</span>
                      <p className="text-xs font-bold text-white font-sans">100% Carbon Neutral Delivery</p>
                    </div>
                  </div>

                  <div className="bg-[#121E20] border border-white/5 p-4 rounded-2xl flex flex-col justify-between text-left relative overflow-hidden min-h-[90px]">
                    <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-[#D1F843]/5 to-transparent pointer-events-none" />
                    <div>
                      <span className="text-[7.5px] font-mono tracking-widest text-[#D1F843] uppercase block mb-1">PROMOTION CODE</span>
                      <h4 className="text-xs font-serif italic text-white leading-tight">Instantaneous 20% Reduction on any Dhaka Dispatch Order</h4>
                    </div>
                    <span className="text-lg font-mono tracking-widest font-bold text-[#D1F843] mt-2">KIYOMIVIP</span>
                  </div>
                </div>
              </div>

              {/* Right Side (Lg span 6): Directory Links & Dispatch Interactions */}
              <div className="lg:col-span-6 flex flex-col space-y-6 text-left">
                
                {/* Search box inside fullscreen */}
                <div>
                  <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.3em] text-[#D1F843] uppercase font-bold border-b border-white/5 pb-2 block mb-3">
                    🔍 {t("INSTANT APP SEARCH")}
                  </span>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-stone-400" />
                    <input
                      type="text"
                      placeholder={t("ENTER GADGET SPECIMENS OR PREMIUM KEYWORDS...")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSearchSubmit(e);
                          setIsMenuDrawerOpen(false);
                        }
                      }}
                      className="w-full pl-12 pr-4 py-3 bg-[#1C282A]/80 focus:bg-[#1D2C2F] border border-[#2D3E40]/25 focus:border-[#D1F843] rounded-xl text-xs font-mono placeholder-stone-500 text-white outline-none transition-all shadow-inner tracking-widest uppercase"
                    />
                  </div>
                </div>

                {/* Directory Links List */}
                <div>
                  <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.3em] text-[#D1F843] uppercase font-bold border-b border-white/5 pb-2 block mb-3">
                    📍 {t("CLIENT ACCOUNT SECTIONS")}
                  </span>
                  <nav className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 font-mono text-[11px] sm:text-xs tracking-widest uppercase">
                    <Link 
                      to="/products"
                      onClick={() => setIsMenuDrawerOpen(false)}
                      className="flex items-center justify-between py-3 border-b border-white/5 text-stone-100 hover:text-[#D1F843] font-bold tracking-widest transition-colors group cursor-pointer"
                    >
                      <span className="flex items-center gap-2 font-bold">✦ {t("SHOP FULL CATALOG")}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:translate-x-1 transition-transform group-hover:text-[#D1F843]" />
                    </Link>

                    <Link 
                      to="/products?category=all"
                      onClick={() => setIsMenuDrawerOpen(false)}
                      className="flex items-center justify-between py-3 border-b border-white/5 text-stone-100 hover:text-[#D1F843] font-bold tracking-widest transition-colors group cursor-pointer"
                    >
                      <span className="font-bold">✦ {t("ALL COUTURES")}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:translate-x-1 transition-transform group-hover:text-[#D1F843]" />
                    </Link>

                    <Link 
                      to="/track-order"
                      onClick={() => setIsMenuDrawerOpen(false)}
                      className="flex items-center justify-between py-3 border-b border-white/5 text-stone-100 hover:text-[#D1F843] font-bold tracking-widest transition-colors group cursor-pointer"
                    >
                      <span className="text-[#D1F843]/95 font-bold">📦 {t("TRACK ORDER")}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:translate-x-1 transition-transform group-hover:text-[#D1F843]" />
                    </Link>

                    <button 
                      onClick={() => {
                        setIsMenuDrawerOpen(false);
                        toggleCart();
                      }}
                      className="flex items-center justify-between py-3 border-b border-white/5 text-stone-100 hover:text-[#D1F843] font-bold tracking-widest transition-colors group cursor-pointer w-full text-left"
                    >
                      <span className="font-bold">🛒 {t("YOUR CART")} ({cartCount})</span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:translate-x-1 transition-transform group-hover:text-[#D1F843]" />
                    </button>

                    <Link 
                      to="/profile"
                      onClick={() => setIsMenuDrawerOpen(false)}
                      className="flex items-center justify-between py-3 border-b border-white/5 text-stone-100 hover:text-[#D1F843] font-bold tracking-widest transition-colors group cursor-pointer"
                    >
                      <span className="font-bold">👤 {t("YOUR PROFILE")}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:translate-x-1 transition-transform group-hover:text-[#D1F843]" />
                    </Link>

                    <Link 
                      to="/products?favorites=true"
                      onClick={() => setIsMenuDrawerOpen(false)}
                      className="flex items-center justify-between py-3 border-b border-white/5 text-stone-100 hover:text-[#D1F843] font-bold tracking-widest transition-colors group cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5 font-bold"><Heart className="w-3.5 h-3.5 text-red-500 animate-pulse fill-red-500" /> {t("SAVED ITEMS & WISHLIST")}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:translate-x-1 transition-transform group-hover:text-[#D1F843]" />
                    </Link>

                    {isAdmin && (
                      <Link 
                        to="/admin"
                        onClick={() => setIsMenuDrawerOpen(false)}
                        className="flex items-center justify-between py-3 border-b border-white/5 text-red-400 hover:text-red-300 font-bold tracking-widest transition-colors group cursor-pointer sm:col-span-2"
                      >
                        <span className="font-bold">🔐 {t("ADMIN SYSTEM CONTROLS CONTROLLED ACCESS")}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:translate-x-1 transition-transform group-hover:text-[#D1F843]" />
                      </Link>
                    )}
                  </nav>
                </div>

                {/* SYSTEM LANGUAGE TOGGLE (MAPPED TO THE MENU DRAWER) */}
                <div className="bg-[#121E20] border border-white/5 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-md flex items-center justify-between gap-4">
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 mb-2.5">
                      <span className="text-[9px] font-mono font-bold tracking-widest text-[#D1F843] uppercase">
                        {t("🌐 SYSTEM TRANSLATION / ভাষা")}
                      </span>
                    </div>
                    <div className="text-[10px] sm:text-[10.5px] font-mono uppercase tracking-wider space-y-1.5 selection:bg-slate-700">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full transition-all duration-300 ${locale === 'en' ? 'bg-[#54a8fc] scale-110 shadow-[0_0_8px_#54a8fc]' : 'bg-stone-700'}`} />
                        <span className={locale === 'en' ? 'text-white font-bold' : 'text-stone-400'}>🇬🇧 ENGLISH</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full transition-all duration-300 ${locale === 'bn' ? 'bg-[#54a8fc] scale-110 shadow-[0_0_8px_#54a8fc]' : 'bg-stone-700'}`} />
                        <span className={locale === 'bn' ? 'text-white font-bold' : 'text-stone-400'}>🇧🇩 বাংলা</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center shrink-0">
                    <div className="toggle-cont">
                      <input 
                        className="toggle-input" 
                        id="toggle-menu-drawer" 
                        name="toggle-menu-drawer" 
                        type="checkbox" 
                        checked={locale === 'bn'}
                        onChange={() => {
                          toggleLanguage();
                          playCinematicIntroSound("Language vocabulary updated.");
                        }}
                      />
                      <label className="toggle-label" htmlFor="toggle-menu-drawer">
                        <div className="cont-icon">
                          {sparkles.map((sp, idx) => (
                            <span
                              key={idx}
                              style={{
                                "--width": sp.width,
                                "--deg": sp.deg,
                                "--duration": sp.duration
                              } as React.CSSProperties}
                              className="sparkle"
                            />
                          ))}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 30 30"
                            className="icon"
                          >
                            <path
                              d="M0.96233 28.61C1.36043 29.0081 1.96007 29.1255 2.47555 28.8971L10.4256 25.3552C13.2236 24.11 16.4254 24.1425 19.2107 25.4401L27.4152 29.2747C27.476 29.3044 27.5418 29.3023 27.6047 29.32C27.6563 29.3348 27.7079 29.3497 27.761 29.3574C27.843 29.3687 27.9194 29.3758 28 29.3688C28.1273 29.3617 28.2531 29.3405 28.3726 29.2945C28.4447 29.262 28.5162 29.2287 28.5749 29.1842C28.6399 29.1446 28.6993 29.0994 28.7509 29.0477L28.9008 28.8582C28.9468 28.7995 28.9793 28.7274 29.0112 28.656C29.0599 28.5322 29.0811 28.4036 29.0882 28.2734C29.0939 28.1957 29.0868 28.1207 29.0769 28.0415C29.0705 27.9955 29.0585 27.9524 29.0472 27.9072C29.0295 27.8343 29.0302 27.7601 28.9984 27.6901L25.1638 19.4855C23.8592 16.7073 23.8273 13.5048 25.0726 10.7068L28.6145 2.75679C28.8429 2.24131 28.7318 1.63531 28.3337 1.2372C27.9165 0.820011 27.271 0.721743 26.7491 0.9961L19.8357 4.59596C16.8418 6.15442 13.2879 6.18696 10.2615 4.70062L1.80308 0.520214C1.7055 0.474959 1.60722 0.441742 1.50964 0.421943C1.44459 0.409215 1.37882 0.395769 1.3074 0.402133C1.14406 0.395769 0.981436 0.428275 0.818095 0.499692C0.77284 0.519491 0.719805 0.545671 0.67455 0.578198C0.596061 0.617088 0.524653 0.675786 0.4596 0.74084C0.394546 0.805894 0.335843 0.877306 0.296245 0.956502C0.263718 1.00176 0.237561 1.05477 0.217762 1.10003C0.152708 1.24286 0.126545 1.40058 0.120181 1.54978C0.120181 1.61483 0.126527 1.6735 0.132891 1.73219C0.15269 1.85664 0.178881 1.97332 0.237571 2.08434L4.41798 10.5427C5.91139 13.5621 5.8725 17.1238 4.3204 20.1099L0.720514 27.0233C0.440499 27.5536 0.545137 28.1928 0.96233 28.61Z"
                            />
                          </svg>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Clean E-commerce Newsletter and Promo Codes */}
                <div className="bg-[#121E20] border border-[#233537]/60 rounded-2xl p-5 relative overflow-hidden shadow-md">
                  <div className="flex items-center gap-1.5 pb-3 border-b border-white/5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D1F843] animate-pulse" />
                    <h4 className="font-mono text-[9px] sm:text-[10px] font-bold tracking-widest text-[#D1F843] uppercase leading-none">
                      VIP PROMOTION OFFER
                    </h4>
                  </div>
                  <p className="text-[11px] text-stone-200 font-sans leading-relaxed mt-3">
                    Use coupon code <strong className="text-white bg-[#1C282A] px-1.5 py-0.5 rounded text-[10px] font-mono">KIYOMIVIP</strong> at checkout to get an instant BDT discount on all premium gadget products.
                  </p>
                  <div className="mt-4 pt-3 border-t border-white/5">
                    <span className="text-[8px] font-mono text-stone-400 block mb-1">PROMOTION UPDATE</span>
                    <p className="text-[10px] text-stone-300 font-sans">Free doorstep delivery all across Bangladesh for any purchase over BDT 5000.</p>
                  </div>
                </div>

                {/* Customer Assist WhatsApp line at the bottom */}
                <div className="bg-[#121E20] border border-[#233537]/50 rounded-2xl p-4 relative overflow-hidden shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <h4 className="text-[9px] sm:text-[9.5px] font-mono font-bold tracking-widest text-[#D1F843] uppercase leading-none">
                      CUSTOMER ASSIST DESK
                    </h4>
                  </div>
                  <p className="text-[10px] text-stone-300 font-sans leading-relaxed">
                    {t("Have fitting or measurement questions? Speak directly to our Gulshan apparel representative now.")}
                  </p>
                  <a 
                    href="https://wa.me/8801633701001" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-3 block w-full text-center bg-[#D1F843] hover:bg-white text-black font-mono text-[9px] tracking-widest py-2.5 rounded-xl font-bold uppercase transition-all duration-200 shadow-sm active:scale-95"
                  >
                    DIRECT WHATSAPP LINE SUPPORT
                  </a>
                </div>

              </div>
            </div>
            
            {/* Drawer Footer info text */}
            <div className="mt-8 pt-4 border-t border-white/5 text-center max-w-7xl mx-auto w-full shrink-0">
              <span className="block text-[8.5px] font-mono tracking-widest text-[#D1F843] uppercase leading-relaxed font-bold">
                © 2026 KIYOMI OFFICIAL GADGET GUILD • ORIGINAL & VERIFIED GULSHAN BASE
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
