import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { playCinematicIntroSound } from '../utils/voiceUtils';
import { 
  Instagram, 
  Facebook, 
  MessageCircle, 
  MapPin, 
  Mail, 
  Phone, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Lock,
  AlertCircle
} from 'lucide-react';
import { OFFICIAL_LOGO_URL } from './BrandLogo';
import { sendFormViaEmailJS } from '../lib/emailjs';

export const Footer: React.FC = () => {
  const { isAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribeError, setSubscribeError] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!email.trim()) return;

    setIsSubmitting(true);
    setSubscribeError(null);

    const emailResult = await sendFormViaEmailJS({
      formType: 'VIP Newsletter Subscription Form',
      email: email.trim(),
      message: 'Customer joined the Patowary Fashion VIP Club for drop alerts and promo codes.',
      subject: `New VIP Club Subscription: ${email.trim()}`,
      customFields: {
        'Subscription Tier': 'Patowary VIP Club',
        'Voucher Code Provided': 'PATOWARY10',
      },
    });

    if (!emailResult.success) {
      console.error('[EmailJS] Newsletter subscription transmission failed:', emailResult.error);
      setSubscribeError(emailResult.error || 'Unable to submit your information right now. Please try again.');
      setIsSubmitting(false);
      return;
    }

    setSubmitted(true);
    playCinematicIntroSound("Thank you for joining Patowary Fashion VIP list!");
    setEmail('');
    setIsSubmitting(false);
  };

  return (
    <footer className="bg-[#0A1E54] text-[#F8F3EA] border-t border-[#1A3070]">
      {/* Top Newsletter & Fashion Story Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-white/10">
        
        {/* Brand Blurb */}
        <div className="md:col-span-5 space-y-6 text-left">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-[#C9A66B] ring-offset-2 ring-offset-[#0A1E54] shadow-md bg-white shrink-0">
              <img
                src={OFFICIAL_LOGO_URL}
                alt="Patowary Fashion Logo"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-white">
                Patowary Fashion
              </h2>
            </div>
          </div>
          <p className="text-white/80 text-xs sm:text-sm leading-relaxed font-sans max-w-sm">
            Patowary Fashion is your premier destination for contemporary trending streetwear in Bangladesh. Explore heavy-twill baggy cargo pants, relaxed-fit trousers, 260 GSM boxy oversized tees, and curated urban lifestyle accessories.
          </p>
          <div className="flex items-center space-x-4 text-white/70">
            <a 
              href="https://www.facebook.com/share/1bjdW3mmQ4/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#C9A66B] transition-colors p-2 rounded-full bg-white/5 hover:bg-white/10" 
              aria-label="Facebook page"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a 
              href="https://wa.me/8801730943993" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#25D366] transition-colors p-2 rounded-full bg-white/5 hover:bg-white/10" 
              aria-label="WhatsApp customer care"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
            <a 
              href="https://www.instagram.com/patowaryfashion" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#C9A66B] transition-colors p-2 rounded-full bg-white/5 hover:bg-white/10" 
              aria-label="Instagram handle"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <span className="text-xs font-mono tracking-widest text-[#C9A66B] font-bold">
              #PATOWARYFASHION
            </span>
          </div>
        </div>

        {/* Dynamic Newsletter Capture */}
        <div className="md:col-span-4 space-y-4 text-left">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#C9A66B]" />
            <h3 className="text-xs font-mono tracking-widest uppercase text-white font-bold">
              PATOWARY VIP CLUB
            </h3>
          </div>
          <p className="text-white/80 text-xs leading-relaxed font-sans">
            Subscribe for exclusive drop alerts, restock announcements, and special promo codes directly to your inbox.
          </p>
          
          {submitted ? (
            <div className="bg-[#1A3070]/60 border border-[#C9A66B]/50 p-4 rounded-xl text-xs text-[#C9A66B] font-mono tracking-wider">
              ✦ WELCOME TO PATOWARY FASHION VIP. YOUR 10% COUPON IS PATOWARY10.
            </div>
          ) : (
            <div className="space-y-2">
              {subscribeError && (
                <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs flex items-center gap-2 font-mono">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{subscribeError}</span>
                </div>
              )}
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 mt-2">
                <input
                  type="email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ENTER YOUR EMAIL"
                  className="bg-white/10 text-white placeholder-white/50 text-xs font-mono tracking-wider px-4 py-2.5 rounded-xl focus:outline-none border border-white/20 focus:border-[#C9A66B] w-full"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-[#C9A66B] hover:bg-[#d6b47c] text-[#0A1E54] text-xs font-bold font-mono tracking-widest uppercase py-2.5 px-6 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-sm ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'JOINING...' : 'JOIN'} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Contacts & Support */}
        <div className="md:col-span-3 space-y-4 text-left">
          <h3 className="text-xs font-mono tracking-widest uppercase text-[#C9A66B] font-bold">
            STORE LOCATION & CARE
          </h3>
          <ul className="space-y-3 text-white/80 font-mono text-xs uppercase tracking-wider">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#C9A66B] shrink-0 mt-0.5" />
              <span>Faridganj, Chandpur 3650, Bangladesh</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#C9A66B] shrink-0" />
              <a 
                href="mailto:fashionpatowary@gmail.com" 
                className="lowercase hover:text-[#C9A66B] transition-colors"
                title="Support Email"
              >
                fashionpatowary@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#C9A66B] shrink-0" />
              <a 
                href="https://wa.me/8801730943993" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-[#C9A66B] transition-colors"
                title="WhatsApp Customer Care"
              >
                +880 1730-943993
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex flex-col md:flex-row items-center justify-between text-xs font-mono tracking-wider text-white/60 space-y-4 md:space-y-0">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#C9A66B]" />
          <span>© {new Date().getFullYear()} Patowary Fashion. All rights reserved.</span>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 uppercase text-[11px]">
          <Link to="/products" className="hover:text-[#C9A66B] transition-colors">Shop All</Link>
          <Link to="/about" className="hover:text-[#C9A66B] transition-colors">About Us</Link>
          <Link to="/contact" className="hover:text-[#C9A66B] transition-colors">Contact Care</Link>
          <Link to="/menu" className="hover:text-[#C9A66B] transition-colors">Catalog Menu</Link>
          <Link to="/track-order" className="hover:text-[#C9A66B] transition-colors">Track Order</Link>
          <Link to="/privacy" className="hover:text-[#C9A66B] transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-[#C9A66B] transition-colors">Terms of Service</Link>
          {isAdmin && (
            <Link to="/admin" className="hover:text-[#C9A66B] transition-colors flex items-center gap-1 font-semibold text-[#C9A66B]">
              <Lock className="w-3 h-3" /> Admin Portal
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
};
