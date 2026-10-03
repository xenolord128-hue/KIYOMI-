import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Truck, 
  RefreshCw, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  FileText, 
  Check, 
  Share2, 
  Printer, 
  Calendar,
  Clock,
  Search,
  ChevronRight
} from 'lucide-react';
import { OFFICIAL_LOGO_URL } from '../components/BrandLogo';

export const PrivacyPolicy: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('intro');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const sections = useMemo(() => [
    {
      id: 'intro',
      title: '1. Introduction & Brand Commitment',
      content: `Welcome to Patowary Fashion. We are Bangladesh's trending streetwear and modern lifestyle clothing destination, specializing in heavy-twill multi-pocket baggy cargos, relaxed trousers, 260 GSM boxy oversized t-shirts, and contemporary urban apparel. We value your privacy and are committed to protecting your personal information across our website, mobile interface, client portal, and order fulfillment systems.`
    },
    {
      id: 'collection',
      title: '2. Information We Collect',
      content: `To deliver your fashion drops accurately and securely, we collect:
• Contact Details: Full name, delivery address, police station/thana, district across all 64 districts in Bangladesh, phone number, and WhatsApp contact.
• Account Information: Email address, encrypted login credentials, profile avatar, and verified user IDs.
• Order & Sizing History: Garment sizes (e.g. M, L, XL, XXL, waist 28-38), product selections, fit preferences, and delivery notes.
• Transaction & Courier Data: Courier tracking IDs (Steadfast, RedX, Pathao, SA Paribahan), Cash on Delivery (COD) settlement status, bKash/Nagad invoice numbers.
• Technical & Device Diagnostics: IP address, browser type, operating system, and performance telemetry to guarantee fast browsing.`
    },
    {
      id: 'usage',
      title: '3. How We Use Your Information',
      content: `Your data is utilized strictly for authentic e-commerce operations:
• Processing and dispatching your streetwear orders with home delivery.
• Sending automated SMS / email notifications regarding tracking codes and parcel arrival.
• Facilitating our 7-Day Hassle-Free Size & Fit Doorstep Exchange Guarantee.
• Customer care via direct phone hotline (+880 1730-943993) or WhatsApp support.
• Maintaining website security, protecting customer reviews, and preventing bot fraud.
• Delivering exclusive VIP Club drop alerts and promo codes (e.g. PATOWARYVIP, PATOWARY10).`
    },
    {
      id: 'security',
      title: '4. Security & Firebase 256-Bit Encryption',
      content: `Security is central to Patowary Fashion. All sensitive user account information is protected by Google Firebase Authentication and enterprise-grade Firestore Security Rules with 256-bit SSL/TLS end-to-end encryption. Your passwords are never stored in plaintext. Access is restricted to authorized personnel managing order fulfillment.`
    },
    {
      id: 'payments',
      title: '5. Cash on Delivery (COD) & Digital Payments',
      content: `We offer Cash on Delivery (COD) nationwide across Bangladesh, permitting you to inspect the sealed parcel in front of the courier agent before final payment. For online transactions (bKash, Nagad, card), payment processing is handled through regulated merchant gateways. Patowary Fashion does not store your debit/credit card numbers or Mobile Financial Services (MFS) PINs.`
    },
    {
      id: 'cookies',
      title: '6. Cookies & Local Session Storage',
      content: `We use essential browser cookies and local storage tokens to preserve your shopping cart items, wishlist selections, active login session, and preferences. These tokens contain no malicious code and can be cleared through your browser settings at any time.`
    },
    {
      id: 'sharing',
      title: '7. Information Sharing & Couriers',
      content: `We strictly DO NOT sell, rent, or trade your personal information to third-party data brokers. Information is shared only with verified logistics partners (e.g. Steadfast Courier, RedX, Pathao) solely to deliver your orders to your doorstep in Faridganj, Chandpur, Dhaka, or anywhere in Bangladesh.`
    },
    {
      id: 'exchange',
      title: '8. 7-Day Fitting & Size Exchange Privacy',
      content: `If a cargo pant or boxy t-shirt does not fit you perfectly, you can request an exchange within 7 days of receiving the package. Sizing measurements, replacement product preferences, and customer delivery notes submitted during exchange are kept strictly confidential in your customer profile.`
    },
    {
      id: 'rights',
      title: '9. Your Privacy Rights & Data Control',
      content: `You have full ownership of your data on Patowary Fashion:
• Review, edit, or update your delivery address and profile information via the Client Profile page.
• Request complete deletion of your account and order history by contacting our support team.
• Opt out of VIP newsletter promo alerts with a single click.`
    },
    {
      id: 'updates',
      title: '10. Changes to This Policy',
      content: `We may occasionally update this Privacy Policy to reflect store enhancements, new fashion drops, or updated Bangladesh e-commerce regulations. The "Last Updated" date at the top will always indicate the latest version.`
    },
    {
      id: 'contact',
      title: '11. Official Store Contact & Coordinates',
      content: `For any privacy inquiries, data deletion requests, or order consultations, reach us directly at our registered flagship hub:
• Physical Address: Faridganj, Chandpur 3650, Bangladesh
• Direct Phone & WhatsApp: +8801730943993
• Official Email: fashionpatowary@gmail.com
• Official Website: https://patowaryfashion.com
• Facebook Official: https://www.facebook.com/share/1bjdW3mmQ4/`
    }
  ], []);

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const q = searchQuery.toLowerCase();
    return sections.filter(s => 
      s.title.toLowerCase().includes(q) ||
      s.content.toLowerCase().includes(q)
    );
  }, [sections, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F8F3EA] text-[#111827] font-sans antialiased selection:bg-[#0A1E54] selection:text-[#F8F3EA]">
      
      {/* Top Banner / Breadcrumb Bar */}
      <div className="bg-[#0A1E54] text-white border-b border-[#1A3070]/80 py-2.5 px-4 sm:px-8 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-white/70 hover:text-[#C9A66B] transition-colors">Home</Link>
            <span className="text-white/40">/</span>
            <span className="text-[#C9A66B] font-bold">Privacy Policy</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Print button */}
            <button
              type="button"
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1 text-white/70 hover:text-white transition-colors cursor-pointer"
              title="Print document"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            {/* Share / Copy URL */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1 text-white/70 hover:text-[#C9A66B] transition-colors cursor-pointer"
              title="Copy Page URL"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <header className="bg-gradient-to-br from-[#0A1E54] via-[#122765] to-[#1A3070] text-white py-14 sm:py-20 px-4 sm:px-6 text-center relative overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C9A66B]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/4 w-96 h-96 bg-[#C9A66B]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 text-[#C9A66B] border border-[#C9A66B]/50 px-4 py-1.5 rounded-full text-xs font-mono font-semibold tracking-widest uppercase bg-white/5 backdrop-blur-md shadow-inner">
            <ShieldCheck className="w-4 h-4 text-[#C9A66B]" />
            <span>LEGAL & PRIVACY PROTOCOL</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-extrabold tracking-tight text-white">
            Privacy Policy
          </h1>

          <p className="max-w-2xl mx-auto text-white/85 text-sm sm:text-base leading-relaxed font-sans">
            Your privacy matters to us. This policy transparently explains how Patowary Fashion collects, uses, protects, and manages your personal information.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-mono text-white/70">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <Calendar className="w-3.5 h-3.5 text-[#C9A66B]" />
              <span>Last Updated: September 28, 2026</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <Clock className="w-3.5 h-3.5 text-[#C9A66B]" />
              <span>⏱ Est. Read: 5 mins</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Layout Container with Sidebar Table of Contents */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-20 relative z-20">
        
        {/* Search & Fast Filters */}
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-[#0A1E54]/10 mb-8 max-w-4xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in policy (e.g. COD, courier, Firebase, Chandpur, exchange)..."
              className="w-full bg-[#F8F3EA]/70 border border-stone-300 pl-11 pr-4 py-3 rounded-xl text-xs sm:text-sm font-sans focus:outline-none focus:border-[#0A1E54] focus:ring-2 focus:ring-[#0A1E54]/10"
            />
            <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-stone-400" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3 text-xs text-stone-500 hover:text-stone-800 font-mono"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sticky Table of Contents (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4 space-y-4">
            <div className="sticky top-24 bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-[#0A1E54]/10 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-stone-200">
                <FileText className="w-4 h-4 text-[#C9A66B]" />
                <h3 className="font-serif font-bold text-sm text-[#0A1E54] uppercase tracking-wider">
                  Table of Contents
                </h3>
              </div>

              <nav className="space-y-1 text-xs font-sans max-h-[60vh] overflow-y-auto pr-1">
                {sections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    onClick={() => setActiveSection(sec.id)}
                    className={`block py-2 px-3 rounded-xl transition-all ${
                      activeSection === sec.id
                        ? 'bg-[#0A1E54] text-[#C9A66B] font-bold shadow-sm'
                        : 'text-stone-600 hover:bg-[#F8F3EA] hover:text-[#0A1E54]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate">{sec.title}</span>
                      <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-50" />
                    </div>
                  </a>
                ))}
              </nav>

              {/* Quick Contact Badge */}
              <div className="pt-3 border-t border-stone-200 space-y-2 text-stone-600 text-[11px] font-mono">
                <div className="flex items-center gap-2 text-[#0A1E54] font-bold">
                  <MapPin className="w-3.5 h-3.5 text-[#C9A66B]" />
                  <span>Faridganj, Chandpur 3650, Bangladesh</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#C9A66B]" />
                  <span>+880 1730-943993</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Main Content */}
          <main className="lg:col-span-8 space-y-8">
            <article className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl shadow-[#0A1E54]/10 border border-[#0A1E54]/10 space-y-10 text-left leading-relaxed">
              
              {/* Highlight Badges Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="bg-[#F8F3EA] p-3.5 rounded-xl border border-[#C9A66B]/30 flex flex-col items-center justify-center gap-1">
                  <Lock className="w-5 h-5 text-[#C9A66B]" />
                  <span className="text-xs font-bold text-[#0A1E54]">256-Bit Firebase SSL</span>
                  <span className="text-[10px] text-stone-500 font-mono">End-to-End Encrypted</span>
                </div>

                <div className="bg-[#F8F3EA] p-3.5 rounded-xl border border-[#C9A66B]/30 flex flex-col items-center justify-center gap-1">
                  <Truck className="w-5 h-5 text-[#C9A66B]" />
                  <span className="text-xs font-bold text-[#0A1E54]">Cash on Delivery</span>
                  <span className="text-[10px] text-stone-500 font-mono">All 64 Districts BD</span>
                </div>

                <div className="bg-[#F8F3EA] p-3.5 rounded-xl border border-[#C9A66B]/30 flex flex-col items-center justify-center gap-1">
                  <RefreshCw className="w-5 h-5 text-[#C9A66B]" />
                  <span className="text-xs font-bold text-[#0A1E54]">7-Day Size Exchange</span>
                  <span className="text-[10px] text-stone-500 font-mono">Hassle-Free Doorstep</span>
                </div>
              </div>

              {/* Sections Display */}
              {filteredSections.map((sec) => (
                <section key={sec.id} id={sec.id} className="scroll-mt-28 space-y-3 pt-4 border-t first:border-t-0 border-stone-200">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0A1E54]">
                      {sec.title}
                    </h2>
                    <a href={`#${sec.id}`} className="text-stone-400 hover:text-[#C9A66B] text-xs font-mono">
                      #
                    </a>
                  </div>

                  <div className="text-stone-700 text-sm sm:text-base leading-relaxed whitespace-pre-line font-sans">
                    {sec.content}
                  </div>
                </section>
              ))}

              {filteredSections.length === 0 && (
                <div className="py-12 text-center space-y-2 text-stone-500">
                  <Search className="w-8 h-8 mx-auto text-stone-400" />
                  <p className="text-sm font-semibold">No sections match your search.</p>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-[#0A1E54] font-bold underline cursor-pointer"
                  >
                    View all sections
                  </button>
                </div>
              )}

              {/* Official Store Card */}
              <div className="bg-gradient-to-br from-[#0A1E54]/5 via-[#C9A66B]/10 to-[#0A1E54]/5 border-2 border-[#C9A66B]/40 p-6 sm:p-8 rounded-2xl space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={OFFICIAL_LOGO_URL}
                    alt="Patowary Fashion Official Logo"
                    className="w-12 h-12 rounded-full border-2 border-[#C9A66B] bg-white p-0.5 object-contain shadow-sm"
                  />
                  <div>
                    <h4 className="font-serif font-bold text-[#0A1E54] text-lg">Patowary Fashion</h4>
                    <p className="text-xs text-stone-500 font-mono uppercase tracking-wider">
                      Official Store Flagship & Compliance
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-[#0A1E54] pt-2">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#C9A66B] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-stone-500 uppercase tracking-wider text-[10px]">
                        Store Location:
                      </strong>
                      <span className="text-stone-800 font-sans font-bold">Faridganj, Chandpur 3650, Bangladesh</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Phone className="w-4 h-4 text-[#C9A66B] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-stone-500 uppercase tracking-wider text-[10px]">
                        Direct Hotline & WhatsApp:
                      </strong>
                      <a href="tel:+8801730943993" className="text-[#0A1E54] font-bold hover:text-[#C9A66B] underline">
                        +880 1730-943993
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Mail className="w-4 h-4 text-[#C9A66B] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-stone-500 uppercase tracking-wider text-[10px]">
                        Official Email:
                      </strong>
                      <a href="mailto:fashionpatowary@gmail.com" className="text-[#0A1E54] font-bold hover:text-[#C9A66B] underline">
                        fashionpatowary@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Globe className="w-4 h-4 text-[#C9A66B] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-stone-500 uppercase tracking-wider text-[10px]">
                        Official Website:
                      </strong>
                      <Link to="/" className="text-[#0A1E54] font-bold hover:text-[#C9A66B] underline">
                        https://patowaryfashion.com
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Footer for Policy */}
              <div className="pt-6 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
                <Link
                  to="/terms"
                  className="inline-flex items-center gap-2 text-[#0A1E54] font-bold hover:text-[#C9A66B] transition-colors underline"
                >
                  <FileText className="w-4 h-4 text-[#C9A66B]" />
                  <span>Read our Terms of Service &rarr;</span>
                </Link>

                <Link
                  to="/"
                  className="text-stone-500 hover:text-[#0A1E54] transition-colors"
                >
                  &larr; Back to Store
                </Link>
              </div>

            </article>
          </main>

        </div>
      </div>

    </div>
  );
};
