import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { playCinematicIntroSound } from '../utils/voiceUtils';
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  MapPin, 
  Mail, 
  Phone, 
  ShieldCheck, 
  ArrowRight,
  TrendingDown,
  Globe2
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    playCinematicIntroSound("Subscribed! Thank you.");
    setEmail('');
  };

  return (
    <footer className="bg-big-stone text-seashell border-t border-cascade/25 selection:bg-deep-emerald selection:text-lime-neon">
      {/* Top Newsletter & Story Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-cascade/15">
        
        {/* Brand Blurb */}
        <div className="md:col-span-5 space-y-6">
          <div className="flex items-center gap-3">
            <img
              src="https://i.ibb.co.com/Xxv0xKL8/Black-White-Simple-Modern-Neon-Griddy-Bold-Technology-Pixel-Electronics-Store-Logo.png"
              alt="KIYOMI Premium Brand Logo"
              className="h-10 w-auto bg-big-stone p-0.5 rounded object-contain border border-cascade/25"
              referrerPolicy="no-referrer"
            />
            <h2 className="text-xl font-serif tracking-[0.3em] font-bold text-seashell">KIYOMI</h2>
          </div>
          <p className="text-seashell/80 text-xs leading-relaxed font-sans max-w-sm">
            Exclusive smartwatches and premium gadgets curated for tech-forward individuals. Rooted in minimalist architectural designs and cutting-edge engineering, we source the highest grade hardware, tactile keypads, high-fidelity acoustics, and ultra-fast GaN charging components. Base operations in Dhaka, Bangladesh.
          </p>
          <div className="flex items-center space-x-4 text-cascade">
            <a 
              href="https://www.instagram.com/kiyomi_express?igsh=MW9maTVjczhkbzM5bQ==" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-lime-neon transition-colors" 
              aria-label="Instagram handle"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a 
              href="https://www.facebook.com/share/19JHtW2Eft/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-lime-neon transition-colors" 
              aria-label="Facebook page"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" className="hover:text-lime-neon transition-colors" aria-label="Twitter account">
              <Twitter className="w-4 h-4" />
            </a>
            <span className="text-[10px] font-mono tracking-widest text-[#D1F843] font-bold">#KIYOMIPREMIUM</span>
          </div>
        </div>

        {/* Dynamic Newsletter Capture */}
        <div className="md:col-span-4 space-y-4">
          <h3 className="text-xs font-mono tracking-widest uppercase text-seashell">KIYOMI PREMIUM MAILING</h3>
          <p className="text-seashell/80 text-xs leading-relaxed font-sans">
            Subscribe to secure drop notifications, restock priority, and private client coupon allocations.
          </p>
          
          {submitted ? (
            <div className="bg-deep-emerald/20 border border-deep-emerald/40 p-4 rounded text-xs text-lime-neon font-mono tracking-wider">
              SUCCESS: SUBSCRIPTION CONFIRMED. CHECK INBOX SHORTLY.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 mt-2">
              <input
                type="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                placeholder="YOUR EMAIL"
                className="bg-seashell/10 text-seashell placeholder-cascade text-xs font-mono tracking-widest px-4 py-2.5 rounded focus:outline-none border border-cascade/20 focus:border-lime-neon w-full uppercase"
              />
              <button
                type="submit"
                className="bg-deep-emerald hover:bg-cascade text-lime-neon text-[10px] font-mono tracking-widest uppercase font-bold py-2.5 px-6 rounded transition-all flex items-center justify-center gap-1 cursor-pointer shrink-0 border border-deep-emerald hover:border-cascade"
              >
                JOIN <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
              </button>
            </form>
          )}
        </div>

        {/* Contacts & Support Grid */}
        <div className="md:col-span-3 space-y-4">
          <h3 className="text-xs font-mono tracking-widest uppercase text-seashell">BASE FLIGHT</h3>
          <ul className="space-y-2.5 text-seashell/85 font-mono text-[11px] uppercase tracking-wider">
            <li className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-cascade shrink-0" />
              <span>GULSHAN AVENUE, DHAKA, BANGLADESH</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-cascade shrink-0" />
              <span className="className uppercase">xenolord128@gmail.com</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-cascade shrink-0" />
              <span>+8801633704001</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Ground Footings section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-12 py-8 flex flex-col md:flex-row items-center justify-between text-[10px] font-mono tracking-widest text-seashell/60 space-y-4 md:space-y-0">
        <div className="flex items-center gap-2 select-none">
          <ShieldCheck className="w-3.5 h-3.5 text-lime-neon" />
          <span>© 2026 KIYOMI BANGLADESH. ALL RIGHTS RESERVED.</span>
        </div>
        
        <div className="flex items-center gap-6 uppercase text-[9px]">
          <Link to="/products" className="hover:text-lime-neon transition-colors">TAXES & DUTIES</Link>
          <Link to="/track-order" className="hover:text-lime-neon transition-colors">TRACK COURIER</Link>
          <Link to="/admin" className="hover:text-lime-neon transition-colors flex items-center gap-1 font-bold text-lime-neon">
            <Globe2 className="w-3 h-3 text-lime-neon" /> SECURED ADMIN CONTEXT
          </Link>
        </div>
      </div>
    </footer>
  );
};
