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
  ShoppingCart, 
  ChevronRight,
  Sparkles,
  Phone,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import { playCinematicIntroSound } from '../utils/voiceUtils';
import { motion, AnimatePresence } from 'motion/react';
import { OFFICIAL_LOGO_URL } from './BrandLogo';

export const Header: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const { cartItems, toggleCart } = useCart();
  const { wishlist } = useWishlist();
  const { locale, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#F8F3EA]/90 backdrop-blur-md border-b border-[#0A1E54]/10 shadow-sm' 
        : 'bg-[#F8F3EA]/80 backdrop-blur-sm border-b border-[#0A1E54]/5'
    }`}>
      {/* Top micro-bar for announcements */}
      <div className="bg-[#0A1E54] text-[#F8F3EA] text-[10px] sm:text-xs py-1.5 px-4 font-medium tracking-wider flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <span className="flex items-center gap-1.5 truncate">
            <Sparkles className="w-3 h-3 text-[#C9A66B] animate-pulse shrink-0" />
            <span>{t("Trending Streetwear Drop • Use code PATOWARY10 for 10% off", "ট্রেন্ডিং স্ট্রিটওয়্যার ড্রপ • PATOWARY10 কোডে ১০% ছাড়")}</span>
          </span>
          <div className="hidden sm:flex items-center gap-4 text-[11px]">
            <Link to="/track-order" className="hover:text-[#C9A66B] transition-colors">{t("Track Order", "অর্ডার ট্র্যাক")}</Link>
            <span className="text-white/30">|</span>
            <button 
              onClick={() => {
                toggleLanguage();
                playCinematicIntroSound(locale === 'en' ? 'বাংলা ভাষা নির্বাচন করা হয়েছে' : 'English language enabled');
              }}
              className="text-[#C9A66B] hover:underline font-mono uppercase text-[10px]"
            >
              {locale === 'en' ? 'বাংলা' : 'English'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          
          {/* Official Brand Logo and Brand Name */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group focus:outline-none"
            aria-label="Patowary Fashion Home"
          >
            <div className="relative p-0.5 rounded-full bg-white shadow-sm border border-[#C9A66B]/40 group-hover:border-[#C9A66B] transition-all">
              <img
                src={OFFICIAL_LOGO_URL}
                alt="Patowary Fashion Logo"
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-contain transition-transform duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-lg sm:text-2xl font-serif font-bold tracking-tight text-[#0A1E54] group-hover:text-[#1A3070] transition-colors leading-tight">
                Patowary Fashion
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.25em] uppercase text-[#1A3070]/80 font-medium">
                TRENDING STREETWEAR
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-semibold tracking-wider text-[#111827] uppercase">
            <Link to="/products" className="hover:text-[#0A1E54] hover:underline underline-offset-8 transition-colors">
              {t("All Collection", "সব কালেকশন")}
            </Link>
            <Link to="/products?category=Baggy+%26+Cargo+Pants" className="hover:text-[#0A1E54] hover:underline underline-offset-8 transition-colors">
              {t("Baggy & Cargo", "ব্যাগি ও কার্গো")}
            </Link>
            <Link to="/products?category=Oversized+Tees+%26+Polos" className="hover:text-[#0A1E54] hover:underline underline-offset-8 transition-colors">
              {t("Oversized Tees", "ওভারসাইজড টি")}
            </Link>
            <Link to="/products?category=Women%27s+Collection" className="hover:text-[#0A1E54] hover:underline underline-offset-8 transition-colors">
              {t("Women's", "উইমেন্স")}
            </Link>
            <Link to="/products?category=Accessories+%26+Lifestyle" className="hover:text-[#0A1E54] hover:underline underline-offset-8 transition-colors">
              {t("Accessories", "এক্সেসরিজ")}
            </Link>
            <Link to="/track-order" className="hover:text-[#0A1E54] hover:underline underline-offset-8 transition-colors">
              {t("Track Order", "ট্র্যাক")}
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-3.5">
            
            {/* Search dedicated page link */}
            <Link
              to="/search"
              className="p-2 sm:p-2.5 rounded-full hover:bg-white/90 text-[#0A1E54] transition-all flex items-center justify-center cursor-pointer shadow-xs border border-transparent hover:border-white/80"
              aria-label="Search Products Page"
              title={t("Search Catalog", "সার্চ")}
            >
              <Search className="w-5 h-5" strokeWidth={1.8} />
            </Link>

            {/* Wishlist dedicated page link */}
            <Link
              to="/wishlist"
              className="relative p-2 sm:p-2.5 rounded-full hover:bg-white/90 text-[#0A1E54] transition-all flex items-center justify-center shadow-xs border border-transparent hover:border-white/80"
              aria-label="Saved Items"
              title={t("Wishlist", "উইশলিস্ট")}
            >
              <Heart className="w-5 h-5" strokeWidth={1.8} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#C9A66B] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart dedicated page link */}
            <Link
              to="/cart"
              className="relative p-2 sm:p-2.5 rounded-full hover:bg-white/90 text-[#0A1E54] transition-all flex items-center justify-center shadow-xs border border-transparent hover:border-white/80"
              aria-label="Shopping Cart Page"
              title={t("Shopping Cart", "কার্ট")}
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={1.8} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#0A1E54] text-[#F8F3EA] text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile dedicated page link */}
            <Link
              to={user ? "/profile" : "/auth"}
              className="p-2 sm:p-2.5 rounded-full hover:bg-white/90 text-[#0A1E54] transition-all flex items-center justify-center shadow-xs border border-transparent hover:border-white/80"
              aria-label="Account Profile"
              title={t("Account Profile", "প্রোফাইল")}
            >
              <User className="w-5 h-5" strokeWidth={1.8} />
            </Link>

            {/* Menu dedicated page link */}
            <Link
              to="/menu"
              className="p-2 sm:p-2.5 bg-[#0A1E54] text-[#F8F3EA] hover:bg-[#1A3070] transition-all rounded-xl flex items-center justify-center shadow-sm hover:scale-105 active:scale-95"
              aria-label="Open Menu Page"
              title={t("Catalog Menu", "মেনু")}
            >
              <Menu className="w-5 h-5" strokeWidth={2} />
            </Link>

          </div>
        </div>
      </div>

      {/* Interactive Sliding Search Header Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute inset-x-0 top-full bg-white/95 backdrop-blur-md px-4 sm:px-12 py-3 border-b border-[#0A1E54]/10 shadow-md z-40"
          >
            <form onSubmit={(e) => { handleSearchSubmit(e); setIsSearchOpen(false); }} className="w-full max-w-3xl mx-auto flex items-center gap-3">
              <Search className="w-5 h-5 text-[#0A1E54] shrink-0" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("SEARCH PATOWARY FASHION • BAGGY PANTS, CARGO, TEES...", "পাটোয়ারী ফ্যাশন সার্চ করুন • ব্যাগি প্যান্ট, কার্গো, টি-শার্ট...")}
                className="w-full bg-transparent focus:outline-none text-[#111827] text-xs sm:text-sm font-medium tracking-wide py-2 placeholder-stone-400"
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-2 bg-stone-100 hover:bg-[#0A1E54] hover:text-white text-stone-600 rounded-full transition-all cursor-pointer"
                aria-label="Close search overlay"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-Screen Glassmorphic Menu Drawer */}
      <AnimatePresence>
        {isMenuDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 w-screen h-screen bg-[#0A1E54]/95 text-[#F8F3EA] shadow-2xl z-50 flex flex-col p-6 sm:p-12 overflow-y-auto backdrop-blur-xl"
          >
            {/* Drawer Header with Close Button */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10 max-w-7xl mx-auto w-full shrink-0">
              <div className="flex items-center gap-3">
                <img
                  src={OFFICIAL_LOGO_URL}
                  alt="Patowary Fashion Logo"
                  className="h-11 w-11 sm:h-14 sm:w-14 rounded-full object-contain border border-[#C9A66B]/50 bg-white p-0.5"
                  referrerPolicy="no-referrer"
                />
                <div className="flex flex-col text-left">
                  <span className="font-serif tracking-wider text-xl sm:text-2xl font-bold text-white">
                    Patowary Fashion
                  </span>
                  <span className="text-[10px] font-mono tracking-[0.25em] text-[#C9A66B] uppercase mt-0.5">
                    MODERN TRENDING STREETWEAR
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsMenuDrawerOpen(false)}
                className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all flex items-center justify-center cursor-pointer shadow-md"
                aria-label="Close menu drawer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Core Content Container in a balanced grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 max-w-7xl mx-auto w-full mt-8 flex-1">
              
              {/* Left Side: Brand Story & Values */}
              <div className="lg:col-span-6 flex flex-col space-y-6 text-left">
                <span className="text-xs font-mono tracking-[0.3em] text-[#C9A66B] uppercase font-bold border-b border-white/10 pb-2">
                  ✦ {t("ABOUT PATOWARY FASHION", "পাটোয়ারী ফ্যাশন সম্পর্কে")}
                </span>
                
                <div className="space-y-4">
                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                    <span className="text-[9px] font-mono tracking-widest text-[#C9A66B] uppercase block mb-1">
                      OUR FASHION ETHOS
                    </span>
                    <h4 className="text-base font-serif text-white font-medium">
                      Authentic Streetwear & Trending Fits
                    </h4>
                    <p className="text-xs text-white/80 mt-2 leading-relaxed font-sans">
                      Patowary Fashion delivers the latest contemporary fashion trends directly to your wardrobe. From heavyweight baggy cargo pants to boxy 260 GSM oversized tees, we craft wardrobe essentials that define modern urban style.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-left">
                      <span className="text-[9px] font-mono tracking-widest text-[#C9A66B] uppercase block mb-1">QUALITY</span>
                      <p className="text-xs font-bold text-white">100% Combed Cotton & Heavy Twill</p>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-left">
                      <span className="text-[9px] font-mono tracking-widest text-[#C9A66B] uppercase block mb-1">DISPATCH</span>
                      <p className="text-xs font-bold text-[#C9A66B]">Fast Doorstep Delivery Nationwide</p>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-[#C9A66B]/30 p-5 rounded-2xl flex flex-col justify-between text-left">
                    <div>
                      <span className="text-[9px] font-mono tracking-widest text-[#C9A66B] uppercase block mb-1">PROMOTION CODE</span>
                      <h4 className="text-sm font-serif text-white">10% Instant Discount on Any Order</h4>
                    </div>
                    <span className="text-xl font-mono tracking-widest font-bold text-[#C9A66B] mt-2">
                      PATOWARY10
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side: Navigation Directory & Customer Care */}
              <div className="lg:col-span-6 flex flex-col space-y-6 text-left">
                <div>
                  <span className="text-xs font-mono tracking-[0.3em] text-[#C9A66B] uppercase font-bold border-b border-white/10 pb-2 block mb-3">
                    📍 {t("SHOP BY CATEGORY", "ক্যাটাগরি ব্রাউজ করুন")}
                  </span>
                  <nav className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs tracking-wider uppercase font-medium">
                    <Link 
                      to="/products"
                      onClick={() => setIsMenuDrawerOpen(false)}
                      className="flex items-center justify-between py-3 border-b border-white/10 text-white hover:text-[#C9A66B] transition-colors group cursor-pointer"
                    >
                      <span className="flex items-center gap-2">✦ {t("Full Collection", "সব প্রোডাক্ট")}</span>
                      <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-[#C9A66B] group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link 
                      to="/products?category=Baggy+%26+Cargo+Pants"
                      onClick={() => setIsMenuDrawerOpen(false)}
                      className="flex items-center justify-between py-3 border-b border-white/10 text-white hover:text-[#C9A66B] transition-colors group cursor-pointer"
                    >
                      <span>✦ {t("Baggy & Cargo Pants", "ব্যাগি ও কার্গো প্যান্ট")}</span>
                      <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-[#C9A66B] group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link 
                      to="/products?category=Oversized+Tees+%26+Polos"
                      onClick={() => setIsMenuDrawerOpen(false)}
                      className="flex items-center justify-between py-3 border-b border-white/10 text-white hover:text-[#C9A66B] transition-colors group cursor-pointer"
                    >
                      <span>✦ {t("Oversized Tees & Polos", "ওভারসাইজড টি ও পোলো")}</span>
                      <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-[#C9A66B] group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link 
                      to="/products?category=Hoodies+%26+Sweatshirts"
                      onClick={() => setIsMenuDrawerOpen(false)}
                      className="flex items-center justify-between py-3 border-b border-white/10 text-white hover:text-[#C9A66B] transition-colors group cursor-pointer"
                    >
                      <span>✦ {t("Hoodies & Sweatshirts", "হুডি ও সোয়েটশার্ট")}</span>
                      <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-[#C9A66B] group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link 
                      to="/products?category=Women%27s+Collection"
                      onClick={() => setIsMenuDrawerOpen(false)}
                      className="flex items-center justify-between py-3 border-b border-white/10 text-white hover:text-[#C9A66B] transition-colors group cursor-pointer"
                    >
                      <span>✦ {t("Women's Collection", "উইমেন্স কালেকশন")}</span>
                      <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-[#C9A66B] group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link 
                      to="/products?category=Accessories+%26+Lifestyle"
                      onClick={() => setIsMenuDrawerOpen(false)}
                      className="flex items-center justify-between py-3 border-b border-white/10 text-white hover:text-[#C9A66B] transition-colors group cursor-pointer"
                    >
                      <span>✦ {t("Accessories", "এক্সেসরিজ")}</span>
                      <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-[#C9A66B] group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link 
                      to="/track-order"
                      onClick={() => setIsMenuDrawerOpen(false)}
                      className="flex items-center justify-between py-3 border-b border-white/10 text-[#C9A66B] font-bold transition-colors group cursor-pointer"
                    >
                      <span>📦 {t("Track Order", "অর্ডার ট্র্যাক")}</span>
                      <ChevronRight className="w-4 h-4 text-[#C9A66B] group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link 
                      to="/wishlist"
                      onClick={() => setIsMenuDrawerOpen(false)}
                      className="flex items-center justify-between py-3 border-b border-white/10 text-white hover:text-[#C9A66B] transition-colors group cursor-pointer"
                    >
                      <span>❤️ {t("Wishlist", "উইশলিস্ট")} ({wishlist.length})</span>
                      <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-[#C9A66B] group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link 
                      to={user ? "/profile" : "/auth"}
                      onClick={() => setIsMenuDrawerOpen(false)}
                      className="flex items-center justify-between py-3 border-b border-white/10 text-white hover:text-[#C9A66B] transition-colors group cursor-pointer"
                    >
                      <span>👤 {user ? t("My Account", "আমার একাউন্ট") : t("Sign In / Register", "লগইন / রেজিস্টার")}</span>
                      <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-[#C9A66B] group-hover:translate-x-1 transition-transform" />
                    </Link>

                    {isAdmin && (
                      <Link 
                        to="/admin"
                        onClick={() => setIsMenuDrawerOpen(false)}
                        className="flex items-center justify-between py-3 border-b border-white/10 text-amber-300 font-bold transition-colors group cursor-pointer sm:col-span-2"
                      >
                        <span>🔐 {t("Admin Dashboard", "এডমিন ড্যাশবোর্ড")}</span>
                        <ChevronRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    )}
                  </nav>
                </div>

                {/* Customer Support Line */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-[#C9A66B]" />
                    <span className="text-xs font-mono font-bold tracking-widest text-[#C9A66B] uppercase">
                      PATOWARY SUPPORT DESK
                    </span>
                  </div>
                  <p className="text-xs text-white/80 font-sans leading-relaxed">
                    Have questions about sizing, fabric weight, or your delivery? Reach out to our customer care team on WhatsApp.
                  </p>
                  <a 
                    href="https://wa.me/8801633701001" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-3 block w-full text-center bg-[#C9A66B] hover:bg-[#d6b47c] text-[#0A1E54] font-semibold text-xs py-2.5 rounded-xl uppercase tracking-wider transition-all shadow-sm"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>
            
            {/* Drawer Footer */}
            <div className="mt-8 pt-4 border-t border-white/10 text-center max-w-7xl mx-auto w-full shrink-0">
              <span className="block text-[10px] font-mono tracking-widest text-white/60 uppercase font-medium">
                © {new Date().getFullYear()} Patowary Fashion • All Rights Reserved
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
