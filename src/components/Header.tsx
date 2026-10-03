import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { 
  Search,
  ShoppingBag, 
  ShieldCheck,
  Globe
} from 'lucide-react';
import { OFFICIAL_LOGO_URL } from './BrandLogo';
import { playCinematicIntroSound } from '../utils/voiceUtils';
import { HumanVerificationModal, isUserHumanVerified } from './HumanVerificationModal';

export const Header: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { cartItems } = useCart();
  const { locale, toggleLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const headerRef = useRef<HTMLElement>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Close menu on route transition
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close menu on click outside
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      navigate('/profile');
      return;
    }
    // If not logged in:
    if (!isUserHumanVerified()) {
      setIsVerifyModalOpen(true);
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="pf-header" role="banner" ref={headerRef}>
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
            Home
          </Link>
          <Link to="/shop" className={isActive('/shop') || isActive('/products') ? 'active' : ''}>
            Shop
          </Link>
          <Link to="/categories" className={isActive('/categories') || isActive('/menu') ? 'active' : ''}>
            Categories
          </Link>
          <Link to="/about" className={isActive('/about') ? 'active' : ''}>
            About
          </Link>
        </nav>

        {/* Header Actions - Exactly 4 Buttons */}
        <div className="pf-header-actions">

          {/* 1. Search Button (Standard Magnifying Glass Search Icon -> Opens /search page directly, no popup) */}
          <Link
            to="/search"
            className={`pf-icon-btn group ${isActive('/search') ? 'bg-[#C9A66B]/20 border-[#C9A66B]/50' : ''}`}
            aria-label="Search"
            title="Search Catalog"
          >
            <Search className="w-5 h-5 text-[#0A1E54] group-hover:scale-110 transition-transform" strokeWidth={2.2} />
          </Link>

          {/* 2. Cart Button with Live Count Badge */}
          <Link
            to="/cart"
            className={`pf-icon-btn group ${isActive('/cart') ? 'bg-[#C9A66B]/20 border-[#C9A66B]/50' : ''}`}
            aria-label="Shopping Cart"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 text-[#0A1E54] group-hover:scale-110 transition-transform" strokeWidth={2.2} />
            {cartCount > 0 && (
              <span className="pf-cart-count">{cartCount}</span>
            )}
          </Link>

          {/* 3. Profile Button (Communication App Default Human Avatar Silhouette Logo -> Not personal photo/initial) */}
          <button
            type="button"
            onClick={handleProfileClick}
            className={`pf-icon-btn group cursor-pointer ${isActive('/profile') || isActive('/login') || isActive('/account') ? 'bg-[#C9A66B]/20 border-[#C9A66B]/50' : ''}`}
            aria-label="User Profile"
            title={user ? (user.displayName || "My Profile") : "Sign In"}
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
          </button>

          {/* 2-bar animated hamburger */}
          <input 
            type="checkbox" 
            id="checkbox"
            checked={isMobileMenuOpen}
            onChange={(e) => setIsMobileMenuOpen(e.target.checked)}
          />

          <label htmlFor="checkbox" className="toggle" aria-label="Toggle navigation menu">
            <div className="bars" id="bar1"></div>
            <div className="bars" id="bar2"></div>
          </label>

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
          Home
        </Link>
        <Link
          to="/shop"
          onClick={() => setIsMobileMenuOpen(false)}
          className={isActive('/shop') || isActive('/products') ? 'active' : ''}
        >
          Shop All Collections
        </Link>
        <Link
          to="/categories"
          onClick={() => setIsMobileMenuOpen(false)}
          className={isActive('/categories') || isActive('/menu') ? 'active' : ''}
        >
          Categories Catalog
        </Link>
        <Link
          to="/about"
          onClick={() => setIsMobileMenuOpen(false)}
          className={isActive('/about') ? 'active' : ''}
        >
          About Patowary Fashion
        </Link>
        <Link
          to="/track-order"
          onClick={() => setIsMobileMenuOpen(false)}
          className={isActive('/track-order') ? 'active' : ''}
        >
          Track My Order
        </Link>
        <button
          type="button"
          onClick={(e) => {
            setIsMobileMenuOpen(false);
            handleProfileClick(e);
          }}
          className={`w-full text-left px-3.5 py-3 rounded-xl font-bold text-sm cursor-pointer transition-colors ${isActive('/profile') || isActive('/login') ? 'active bg-[#C9A66B]/20 text-[#0A1E54]' : 'text-[#111827] hover:bg-black/5'}`}
        >
          {user ? "My Profile & Invoices" : "Sign In / Register"}
        </button>
        {isAdmin && (
          <Link
            to="/admin"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-[#C9A66B] font-bold flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-[#C9A66B]" />
            <span>Admin Portal</span>
          </Link>
        )}

        {/* Global Store Info */}
        <div className="pt-3 mt-2 border-t border-stone-200/60 flex items-center justify-between text-xs px-2 text-stone-600">
          <span className="flex items-center gap-1.5 font-medium">
            <Globe className="w-3.5 h-3.5 text-[#C9A66B]" />
            Language:
          </span>
          <span className="px-3 py-1 bg-white/90 border border-stone-200 rounded-xl text-[#0A1E54] font-bold shadow-xs">
            English (US)
          </span>
        </div>
      </div>

      {/* One-Time Human Verification Modal */}
      <HumanVerificationModal 
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
      />
    </header>
  );
};
