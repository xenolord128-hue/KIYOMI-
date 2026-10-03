import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { updatePageSEO } from '../utils/seoUtils';
import { OFFICIAL_LOGO_URL } from '../components/BrandLogo';
import { 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  ArrowRight,
  Award,
  CheckCircle2,
  Heart
} from 'lucide-react';
import { motion } from 'motion/react';

export const About: React.FC = () => {
  const { t } = useLanguage();

  useEffect(() => {
    updatePageSEO('About Us | Heritage & Streetwear Ethos', 'Discover the story behind Patowary Fashion - authentic luxury streetwear crafted for Bangladesh urban culture.');
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F3EA] text-[#111827] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Hero Section */}
        <div className="bg-[#0A1E54] text-[#F8F3EA] rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-xl border border-[#C9A66B]/30 text-left">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C9A66B] text-[10px] font-mono tracking-widest uppercase font-bold border border-white/10">
              <Sparkles className="w-3 h-3 text-[#C9A66B]" />
              <span>CONTEMPORARY URBAN STREETWEAR</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
              Crafting The Future of Streetwear in Bangladesh
            </h1>

            <p className="text-sm sm:text-base text-white/80 leading-relaxed font-sans">
              Born from an obsession with high-density twill, drop-shoulder silhouettes, and unfiltered urban culture, Patowary Fashion bridges global streetwear aesthetics with local craftsmanship.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C9A66B] text-[#0A1E54] font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#d8b57d] transition-all shadow-md active:scale-95"
              >
                <span>Explore Catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 text-white font-mono text-xs uppercase tracking-wider hover:bg-white/20 transition-all border border-white/15"
              >
                Visit Support Desk
              </Link>
            </div>
          </div>

          <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-[#C9A66B]/15 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Brand Mission Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white rounded-3xl p-8 border border-[#0A1E54]/10 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0A1E54]/5 text-[#0A1E54] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#C9A66B]" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#0A1E54]">Heavyweight Fabrics</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              We never compromise on fabric density. Every tee is 260 GSM combed cotton, and every pair of cargos is cut from rugged 300+ GSM twill cotton.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-[#0A1E54]/10 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0A1E54]/5 text-[#0A1E54] flex items-center justify-center">
              <Truck className="w-6 h-6 text-[#C9A66B]" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#0A1E54]">64 Districts Delivery</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Nationwide express doorstep delivery with cash on delivery and inspection privileges across every district of Bangladesh.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-[#0A1E54]/10 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0A1E54]/5 text-[#0A1E54] flex items-center justify-center">
              <RotateCcw className="w-6 h-6 text-[#C9A66B]" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#0A1E54]">Hassle-Free Exchange</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Wrong fit? We provide a seamless 7-day size replacement and return policy so your streetwear fit is always 100% on point.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#0A1E54]/10 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left">
          <div className="space-y-4">
            <span className="text-[10px] font-mono tracking-widest text-[#C9A66B] uppercase font-bold block">
              THE PATOWARY IDENTITY
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0A1E54]">
              Where Classic Tailoring Meets Rebel Street Style
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Patowary Fashion began as an independent design studio with a single mission: to craft wardrobe pieces that feel heavy, authentic, and timeless. In an era dominated by fast fashion and thin synthetic textiles, we insist on pure natural cottons, reinforced stitch profiles, and boxy fits engineered to drape effortlessly.
            </p>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              From our flagship Baggy Cargo trousers to our minimalist oversized drops, every item is rigorously checked before dispatching to your doorstep.
            </p>
            <div className="pt-2 flex items-center gap-6 text-xs font-mono text-[#0A1E54] font-bold">
              <span>✦ DHAKA, BANGLADESH</span>
              <span>✦ ESTABLISHED 2024</span>
            </div>
          </div>

          <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-md">
            <img
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800"
              alt="Patowary Fashion Streetwear Model"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </div>
  );
};
