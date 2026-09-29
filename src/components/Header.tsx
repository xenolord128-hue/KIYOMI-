import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { 
  Search,
  ShoppingBag, 
  Menu, 
  X, 
  ShieldCheck,
  Globe
} from 'lucide-react';
import { OFFICIAL_LOGO_URL } from './BrandLogo';
import { playCinematicIntroSound } from '../utils/voiceUtils';

export const Header: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { cartItems } = useCart();
  const { locale, toggleLanguage, t } = useLanguage();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Close menu on route transition
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="pf-header" role="banner">
      <div className="pf-header-inner">

        {/* Logo / Brand Area */}
        <Link to="/" className="pf-logo" aria-label="Patowary Fashion Home">
          <div className="pf-logo-mark">
            <img
              src={OFFICIAL_LOGO_URL}
              alt="Patowary Fashion Logo"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="font-serif">Patowary Fashion</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="pf-nav" aria-label="Main Navigation">
          <Link to="/" className={isActive('/') && location.pathname === '/' ? 'active' : ''}>
            {t('Home', 'হোম')}
          </Link>
          <Link to="/shop" className={isActive('/shop') || isActive('/products') ? 'active' : ''}>
            {t('Shop', 'শপ')}
          </Link>
          <Link to="/categories" className={isActive('/categories') || isActive('/menu') ? 'active' : ''}>
            {t('Categories', 'ক্যাটাগরি')}
          </Link>
          <Link to="/about" className={isActive('/about') ? 'active' : ''}>
            {t('About', 'পরিচিতি')}
          </Link>
        </nav>

        {/* Header Actions - Exactly 4 Buttons */}
        <div className="pf-header-actions">

          {/* 1. Search Button (Standard Magnifying Glass Search Icon -> Opens /search page directly, no popup) */}
          <Link
            to="/search"
            className={`pf-icon-btn group ${isActive('/search') ? 'bg-[#C9A66B]/20 border-[#C9A66B]/50' : ''}`}
            aria-label="Search"
            title={t("Search Catalog", "অনুসন্ধান")}
          >
            <Search className="w-5 h-5 text-[#0A1E54] group-hover:scale-110 transition-transform" strokeWidth={2.2} />
          </Link>

          {/* 2. Cart Button with Live Count Badge */}
          <Link
            to="/cart"
            className={`pf-icon-btn group ${isActive('/cart') ? 'bg-[#C9A66B]/20 border-[#C9A66B]/50' : ''}`}
            aria-label="Shopping Cart"
            title={t("Shopping Cart", "শপিং কার্ট")}
          >
            <ShoppingBag className="w-5 h-5 text-[#0A1E54] group-hover:scale-110 transition-transform" strokeWidth={2.2} />
            {cartCount > 0 && (
              <span className="pf-cart-count">{cartCount}</span>
            )}
          </Link>

          {/* 3. Profile Button (Communication App Default Human Avatar Silhouette Logo -> Not personal photo/initial) */}
          <Link
            to={user ? "/profile" : "/login"}
            className={`pf-icon-btn group ${isActive('/profile') || isActive('/login') || isActive('/account') ? 'bg-[#C9A66B]/20 border-[#C9A66B]/50' : ''}`}
            aria-label="User Profile"
            title={user ? (user.displayName || t("My Profile", "আমার প্রোফাইল")) : t("Sign In", "সাইন ইন")}
          >
            {/* Communication App Default Contact / Human Avatar Silhouette */}
            <svg 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="w-5 h-5 text-[#0A1E54] group-hover:scale-110 transition-transform"
              aria-hidden="true"
            >
              <path 
                fillRule="evenodd" 
                d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" 
                clipRule="evenodd" 
              />
            </svg>
          </Link>

          {/* 4. Menu Button (Toggles Smooth Dropdown Menu) */}
          <button
            type="button"
            id="pfMenuBtn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="pf-icon-btn group cursor-pointer"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            title={t("Menu", "মেনু")}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-[#0A1E54] group-hover:scale-110 transition-transform" strokeWidth={2.5} />
            ) : (
              <Menu className="w-5 h-5 text-[#0A1E54] group-hover:scale-110 transition-transform" strokeWidth={2.5} />
            )}
          </button>

        </div>
      </div>

      {/* Dropdown Navigation Menu */}
      <div 
        className={`pf-mobile-menu ${isMobileMenuOpen ? 'show' : ''}`} 
        id="pfMobileMenu"
      >
        <Link
          to="/"
          onClick={() => setIsMobileMenuOpen(false)}
          className={isActive('/') && location.pathname === '/' ? 'active' : ''}
        >
          {t("Home", "হোম")}
        </Link>
        <Link
          to="/shop"
          onClick={() => setIsMobileMenuOpen(false)}
          className={isActive('/shop') || isActive('/products') ? 'active' : ''}
        >
          {t("Shop All Collections", "সকল কালেকশন শপ")}
        </Link>
        <Link
          to="/categories"
          onClick={() => setIsMobileMenuOpen(false)}
          className={isActive('/categories') || isActive('/menu') ? 'active' : ''}
        >
          {t("Categories Catalog", "ক্যাটাগরি ক্যাটালগ")}
        </Link>
        <Link
          to="/about"
          onClick={() => setIsMobileMenuOpen(false)}
          className={isActive('/about') ? 'active' : ''}
        >
          {t("About Patowary Fashion", "ব্র্যান্ড পরিচিতি")}
        </Link>
        <Link
          to="/track-order"
          onClick={() => setIsMobileMenuOpen(false)}
          className={isActive('/track-order') ? 'active' : ''}
        >
          {t("Track My Order", "অর্ডার ট্র্যাক")}
        </Link>
        <Link
          to={user ? "/profile" : "/login"}
          onClick={() => setIsMobileMenuOpen(false)}
          className={isActive('/profile') || isActive('/login') ? 'active' : ''}
        >
          {user ? t("My Profile / Invoices", "প্রোফাইল / ইনভয়েস") : t("Sign In / Register", "সাইন ইন / রেজিস্টার")}
        </Link>
        {isAdmin && (
          <Link
            to="/admin"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-[#C9A66B] font-bold flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-[#C9A66B]" />
            <span>{t("Admin Portal", "অ্যাডমিন পোর্টাল")}</span>
          </Link>
        )}

        {/* Language Switcher in Dropdown */}
        <div className="pt-3 mt-2 border-t border-stone-200/60 flex items-center justify-between text-xs px-2 text-stone-600">
          <span className="flex items-center gap-1.5 font-medium">
            <Globe className="w-3.5 h-3.5 text-[#C9A66B]" />
            {t("Language:", "ভাষা:")}
          </span>
          <button
            type="button"
            onClick={() => {
              toggleLanguage();
              playCinematicIntroSound(locale === 'en' ? 'বাংলা ভাষা সক্রিয় করা হয়েছে' : 'English enabled');
            }}
            className="px-3.5 py-1.5 bg-white/90 border border-stone-200 rounded-xl text-[#0A1E54] font-bold cursor-pointer hover:bg-stone-50 transition-colors shadow-xs"
          >
            {locale === 'en' ? 'বাংলা' : 'EN'}
          </button>
        </div>
      </div>
    </header>
  );
};
