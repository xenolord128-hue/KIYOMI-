import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeft, 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  Truck, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Lock,
  Package
} from 'lucide-react';
import { OFFICIAL_LOGO_URL } from '../components/BrandLogo';

export const Menu: React.FC = () => {
  const { t } = useLanguage();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const categories = [
    {
      title: "Baggy & Cargo Pants",
      titleBn: "ব্যাগি ও কার্গো প্যান্ট",
      desc: "Heavy twill utility cargos, 6-pocket trousers, wide-leg denim",
      image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600",
      link: "/products?category=Baggy+%26+Cargo+Pants",
      num: "01"
    },
    {
      title: "Oversized Tees & Polos",
      titleBn: "ওভারসাইজড টি ও পোলো",
      desc: "260 GSM drop-shoulder tees, pique knit polos, boxy drape",
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600",
      link: "/products?category=Oversized+Tees+%26+Polos",
      num: "02"
    },
    {
      title: "Hoodies & Sweatshirts",
      titleBn: "হুডি ও সোয়েটশার্ট",
      desc: "420 GSM French Terry double-hooded pullovers, crewneck fleece",
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600",
      link: "/products?category=Hoodies+%26+Sweatshirts",
      num: "03"
    },
    {
      title: "Women's Streetwear",
      titleBn: "উইমেন্স স্ট্রিটওয়্যার",
      desc: "High-waist relaxed trousers, crop boxy tees, fluid silhouettes",
      image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600",
      link: "/products?category=Women%27s+Collection",
      num: "04"
    },
    {
      title: "Accessories & Lifestyle",
      titleBn: "এক্সেসরিজ ও লাইফস্টাইল",
      desc: "Cordura tactical crossbodies, vintage washed dad caps, leather belts",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
      link: "/products?category=Accessories+%26+Lifestyle",
      num: "05"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F3EA] text-[#111827] py-8 sm:py-12 px-4 sm:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card hover:bg-white text-xs font-mono tracking-wider text-[#0A1E54] uppercase font-bold transition-all shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> {t("Back", "পেছনে ফিরুন")}
          </button>
          
          <Link to="/" className="flex items-center gap-2.5">
            <img 
              src={OFFICIAL_LOGO_URL} 
              alt="Patowary Fashion Logo" 
              className="w-8 h-8 rounded-full object-contain border border-[#C9A66B]/50 bg-white"
            />
            <span className="font-serif font-bold text-[#0A1E54] text-base tracking-tight">
              Patowary Fashion
            </span>
          </Link>
        </div>

        {/* Hero Menu Container (Glassmorphic) */}
        <div className="glass-panel p-6 sm:p-10 rounded-[2.5rem] border border-white/80 shadow-xl space-y-8 text-left">
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-[#0A1E54]/10 pb-6">
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#C9A66B] font-bold block mb-1">
                PATOWARY NAVIGATION INDEX
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#0A1E54] tracking-tight">
                {t("Catalog & Menu", "মেনু ও কালেকশন")}
              </h1>
            </div>
            
            {/* Quick action buttons */}
            <div className="flex flex-wrap gap-2">
              <Link
                to="/search"
                className="px-4 py-2 rounded-full bg-white/70 hover:bg-white border border-[#0A1E54]/10 text-xs font-mono text-[#0A1E54] font-bold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Search className="w-3.5 h-3.5 text-[#C9A66B]" /> {t("Search", "সার্চ")}
              </Link>
              <Link
                to="/cart"
                className="px-4 py-2 rounded-full bg-white/70 hover:bg-white border border-[#0A1E54]/10 text-xs font-mono text-[#0A1E54] font-bold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#C9A66B]" /> {t("Bag / Cart", "কার্ট")}
              </Link>
              <Link
                to="/wishlist"
                className="px-4 py-2 rounded-full bg-white/70 hover:bg-white border border-[#0A1E54]/10 text-xs font-mono text-[#0A1E54] font-bold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Heart className="w-3.5 h-3.5 text-[#C9A66B]" /> {t("Wishlist", "উইশলিস্ট")}
              </Link>
              <Link
                to="/profile"
                className="px-4 py-2 rounded-full bg-[#0A1E54] text-white hover:bg-[#1A3070] text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <User className="w-3.5 h-3.5 text-[#C9A66B]" /> {user ? user.displayName || t("Profile", "প্রোফাইল") : t("Sign In", "লগইন")}
              </Link>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-[#0A1E54]/70 font-black">
              {t("APPAREL COLLECTIONS / প্রধান কালেকশনসমূহ", "APPAREL COLLECTIONS")}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map((cat, idx) => (
                <Link
                  key={idx}
                  to={cat.link}
                  className="glass-card p-5 rounded-3xl border border-white hover:border-[#C9A66B]/50 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden text-left"
                >
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-4 bg-stone-100">
                    <img 
                      src={cat.image} 
                      alt={cat.title} 
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-3 left-3 bg-[#0A1E54]/85 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-[#C9A66B] border border-white/20">
                      {cat.num}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-serif font-bold text-lg text-[#0A1E54] group-hover:text-[#1A3070] transition-colors flex items-center justify-between">
                      <span>{t(cat.title, cat.titleBn)}</span>
                      <ArrowRight className="w-4 h-4 text-[#C9A66B] -translate-x-1 group-hover:translate-x-0 transition-transform" />
                    </h3>
                    <p className="text-stone-600 text-xs line-clamp-2 font-sans">
                      {cat.desc}
                    </p>
                  </div>
                </Link>
              ))}

              {/* View All Products Card */}
              <Link
                to="/products"
                className="p-6 rounded-3xl bg-[#0A1E54] text-[#F8F3EA] hover:bg-[#1A3070] transition-all flex flex-col justify-between border border-[#1A3070] group shadow-md text-left"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-mono tracking-widest text-[#C9A66B] uppercase font-bold">
                    EXPLORE EVERYTHING
                  </span>
                  <h3 className="font-serif font-bold text-2xl text-white">
                    {t("View Full Catalog", "সম্পূর্ণ ক্যাটালগ")}
                  </h3>
                  <p className="text-white/80 text-xs leading-relaxed font-sans">
                    Browse all active baggy pants, heavyweight hoodies, vintage tees, and luxury accessories.
                  </p>
                </div>
                <div className="pt-6 flex items-center justify-between font-mono text-xs text-[#C9A66B] font-bold">
                  <span>ALL STREETWEAR</span>
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Quick Direct Links Section */}
          <div className="pt-6 border-t border-[#0A1E54]/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <Link 
              to="/track-order" 
              className="p-4 rounded-2xl glass-card hover:bg-white flex items-center gap-3 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-[#0A1E54]/10 text-[#0A1E54] flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-[#0A1E54]" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#0A1E54] block">{t("Track Dispatch", "অর্ডার ট্র্যাক")}</span>
                <span className="text-[10px] text-stone-500 font-mono">Live Voucher ID Lookup</span>
              </div>
            </Link>

            <Link 
              to="/brand" 
              className="p-4 rounded-2xl glass-card hover:bg-white flex items-center gap-3 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-[#0A1E54]/10 text-[#0A1E54] flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-[#C9A66B]" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#0A1E54] block">{t("Brand Story", "ব্র্যান্ড পরিচিতি")}</span>
                <span className="text-[10px] text-stone-500 font-mono">Patowary Fashion Manifesto</span>
              </div>
            </Link>

            <Link 
              to="/checkout" 
              className="p-4 rounded-2xl glass-card hover:bg-white flex items-center gap-3 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-[#0A1E54]/10 text-[#0A1E54] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#0A1E54]" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#0A1E54] block">{t("Fast Checkout", "চেকআউট")}</span>
                <span className="text-[10px] text-stone-500 font-mono">bKash & Cash on Delivery</span>
              </div>
            </Link>

            <Link 
              to="/admin" 
              className="p-4 rounded-2xl glass-card hover:bg-white flex items-center gap-3 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-[#0A1E54]/10 text-[#0A1E54] flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-[#C9A66B]" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#0A1E54] block">{t("Admin Portal", "অ্যাডমিন পোর্টাল")}</span>
                <span className="text-[10px] text-stone-500 font-mono">Manage Inventory</span>
              </div>
            </Link>
          </div>

          {/* Official Location Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/60 border border-white text-xs text-[#0A1E54] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#C9A66B] shrink-0" />
              <span className="font-medium font-sans">
                {t("Store Location: বাংলাদেশ, চাঁদপুর ৩৬৫০, ফরিদগঞ্জ", "স্টোর লোকেশন: বাংলাদেশ, চাঁদপুর ৩৬৫০, ফরিদগঞ্জ")}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#C9A66B]" /> +880 1633-704001</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
