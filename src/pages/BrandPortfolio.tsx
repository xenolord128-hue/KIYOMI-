import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Check, 
  Sparkles, 
  Facebook, 
  Instagram, 
  Heart, 
  MessageSquare, 
  ShieldCheck, 
  Copy, 
  Phone,
  Tag,
  ShoppingBag,
  AlertCircle
} from 'lucide-react';
import { playCinematicIntroSound } from '../utils/voiceUtils';
import { motion } from 'motion/react';
import { OFFICIAL_LOGO_URL } from '../components/BrandLogo';
import { useLanguage } from '../contexts/LanguageContext';
import { sendFormViaEmailJS } from '../lib/emailjs';

export const BrandPortfolio: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentsList, setCommentsList] = useState<{ name: string; text: string; date: string }[]>(() => {
    try {
      const stored = localStorage.getItem('patowary_community_comments');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [];
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
    playCinematicIntroSound("Patowary Fashion story link copied.");
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!commentName.trim() || !commentText.trim()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const emailResult = await sendFormViaEmailJS({
      formType: 'Community Feedback Form',
      name: commentName.trim(),
      message: commentText.trim(),
      subject: `New Community Feedback from ${commentName.trim()}`,
      customFields: {
        'Channel': 'Patowary Fashion Brand Story & Community',
        'Feedback Message': commentText.trim(),
      },
    });

    if (!emailResult.success) {
      console.error('[EmailJS] Community feedback transmission failed:', emailResult.error);
      setSubmitError(emailResult.error || 'Unable to submit your information right now. Please try again.');
      setIsSubmitting(false);
      return;
    }

    const newComment = { name: commentName.trim(), text: commentText.trim(), date: "Just now" };
    const updated = [newComment, ...commentsList];
    setCommentsList(updated);
    localStorage.setItem('patowary_community_comments', JSON.stringify(updated));
    setCommentName('');
    setCommentText('');
    setSubmitSuccess(true);
    setIsSubmitting(false);
    playCinematicIntroSound("Thank you for your feedback on Patowary Fashion!");
    setTimeout(() => setSubmitSuccess(false), 4000);
  };

  return (
    <div id="brand-story-page" className="min-h-screen bg-[#F8F3EA] text-[#111827] pb-24 font-sans text-left">
      
      {/* Editorial Hero Header */}
      <section className="bg-[#0A1E54] text-[#F8F3EA] py-16 sm:py-20 px-4 sm:px-8 border-b border-[#1A3070]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs font-mono font-bold tracking-[0.3em] text-[#C9A66B] uppercase block">
              EST. 2026 • CHANDPUR, BANGLADESH
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white uppercase tracking-tight">
              Patowary Fashion
            </h1>
            <p className="text-white/85 text-sm sm:text-base leading-relaxed">
              We engineer modern trending streetwear for the contemporary wardrobe. Driven by genuine baggy draping, heavy 260 GSM combed cottons, and architectural utility cargos.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <Link 
                to="/products"
                className="px-6 py-3 bg-[#C9A66B] hover:bg-[#d6b47c] text-[#0A1E54] text-xs font-mono font-bold tracking-wider uppercase rounded-xl transition-all shadow-sm flex items-center gap-2"
              >
                <span>{t("Explore Catalog", "ক্যাটালগ দেখুন")}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={handleCopyLink}
                className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-mono tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
              >
                {copiedLink ? <Check className="w-4 h-4 text-[#C9A66B]" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? "Link Copied!" : "Share Brand"}</span>
              </button>
            </div>
          </div>

          <div className="relative p-2 rounded-full bg-white/10 backdrop-blur-md border-2 border-[#C9A66B]/50 shrink-0">
            <img 
              src={OFFICIAL_LOGO_URL} 
              alt="Patowary Fashion Official Logo" 
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-contain bg-white p-1"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Brand Ethos & Craft Columns */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-16">
        <div className="mb-10 text-center space-y-2">
          <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#0A1E54] uppercase">
            ✦ THE PATOWARY STANDARD
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#0A1E54]">
            Crafted for Daily Wear & Urban Presence
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-white space-y-3">
            <span className="text-xs font-mono font-bold text-[#C9A66B] uppercase block">
              01 / BAGGY TAILORING
            </span>
            <h3 className="text-base font-bold text-[#0A1E54]">
              Anatomical Wide-Leg Drape
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed font-sans">
              Our baggy pants and cargos are cut with a relaxed rise and generous leg opening to drape cleanly over chunky sneakers without puddling into the ground.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white space-y-3">
            <span className="text-xs font-mono font-bold text-[#C9A66B] uppercase block">
              02 / HIGH GSM TEXTILES
            </span>
            <h3 className="text-base font-bold text-[#0A1E54]">
              260 GSM Combed Cotton
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed font-sans">
              We reject cheap synthetic polyester blends. Our oversized tees and hoodies are crafted from pure heavyweight combed cotton for unmatched shape retention.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white space-y-3">
            <span className="text-xs font-mono font-bold text-[#C9A66B] uppercase block">
              03 / DOORSTEP ASSURANCE
            </span>
            <h3 className="text-base font-bold text-[#0A1E54]">
              7-Day Fitting Exchange
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed font-sans">
              Order with confidence. If you need a size adjustment or different fitting, our customer care desk will exchange it seamlessly at your doorstep.
            </p>
          </div>
        </div>
      </section>

      {/* Lookbook Gallery Grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
        <div className="border-b border-[#0A1E54]/10 pb-4 mb-8">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0A1E54]">
            Season 2026 Streetwear Lookbook
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden glass-card shadow-sm group">
            <img 
              src="https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600" 
              alt="Baggy Cargo" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
              <span className="text-white text-xs font-bold font-mono">Baggy Cargo Fit</span>
            </div>
          </div>

          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden glass-card shadow-sm group">
            <img 
              src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600" 
              alt="Oversized Tee" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
              <span className="text-white text-xs font-bold font-mono">260 GSM Boxy Tee</span>
            </div>
          </div>

          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden glass-card shadow-sm group">
            <img 
              src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600" 
              alt="Heavyweight Hoodie" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
              <span className="text-white text-xs font-bold font-mono">French Terry Fleece</span>
            </div>
          </div>

          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden glass-card shadow-sm group">
            <img 
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600" 
              alt="Women's Streetwear" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
              <span className="text-white text-xs font-bold font-mono">Crop Boxy Fits</span>
            </div>
          </div>
        </div>
      </section>

      {/* Community Guestbook / Reviews */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-12">
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white shadow-sm space-y-6">
          <div className="border-b border-stone-200 pb-4">
            <h3 className="text-xl font-serif font-bold text-[#0A1E54]">
              Community Voice & Feedback
            </h3>
            <p className="text-xs text-stone-600 mt-1">
              Have you tried our fits? Share your thoughts with the Patowary Fashion community.
            </p>
          </div>

          {submitSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Thank you! Your feedback has been submitted successfully.</span>
            </div>
          )}

          {submitError && (
            <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleCommentSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input 
                type="text" 
                required
                value={commentName} 
                onChange={(e) => setCommentName(e.target.value)} 
                placeholder="YOUR NAME" 
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white focus:outline-none focus:border-[#0A1E54]"
              />
            </div>
            <textarea 
              required
              rows={3} 
              value={commentText} 
              onChange={(e) => setCommentText(e.target.value)} 
              placeholder="Tell us about the fabric weight, drape, or customer care..." 
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white focus:outline-none focus:border-[#0A1E54]"
            />
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`px-6 py-2.5 bg-[#0A1E54] hover:bg-[#1A3070] text-white text-xs font-bold uppercase rounded-xl transition-all shadow-xs cursor-pointer ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Posting...' : 'Post Feedback'}
            </button>
          </form>

          <div className="space-y-3 pt-4 border-t border-stone-200">
            {commentsList.length === 0 ? (
              <div className="p-6 bg-white/50 rounded-2xl border border-dashed border-stone-300 text-center text-xs text-stone-500 font-sans">
                No community comments yet. Be the first to share your thoughts on our fits!
              </div>
            ) : (
              commentsList.map((c, i) => (
                <div key={i} className="p-4 bg-white/70 rounded-xl border border-stone-200 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-[#0A1E54]">
                    <span>{c.name}</span>
                    <span className="text-[10px] text-stone-400 font-mono">{c.date}</span>
                  </div>
                  <p className="text-stone-700 font-sans">{c.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

    </div>
  );
};
