import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Check, 
  Share2, 
  Printer, 
  Calendar,
  Clock,
  Search,
  ChevronRight,
  Scale
} from 'lucide-react';
import { OFFICIAL_LOGO_URL } from '../components/BrandLogo';

export const TermsOfService: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('acceptance');

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
      id: 'acceptance',
      title: '1. Acceptance of Terms',
      content: `Welcome to Patowary Fashion. These Terms of Service constitute a legally binding agreement between you and Patowary Fashion regarding your access to and use of our e-commerce platform, website, client portal, mobile interfaces, and purchase transactions. By browsing, registering, or placing an order on our store, you acknowledge that you have read, understood, and agreed to be bound by these Terms in full.`
    },
    {
      id: 'eligibility',
      title: '2. Eligibility & Ordering Capacity',
      content: `To purchase apparel or open an account with Patowary Fashion, you must be of legal age to enter into contracts under the laws of Bangladesh (or possess verified parental/guardian authorization). By placing an order, you represent and warrant that the delivery information and phone number provided are accurate, active, and reachable.`
    },
    {
      id: 'accounts',
      title: '3. Customer Accounts & Firebase Security',
      content: `Creating an account unlocks VIP status, saved delivery coordinates, wishlist synchronization, and direct order tracking. You are responsible for safeguarding your password and account credentials. Patowary Fashion safeguards accounts using Google Firebase 256-bit encryption. Any unauthorized attempt to breach other users' accounts or tamper with database records will lead to immediate legal action and permanent blacklisting.`
    },
    {
      id: 'catalog',
      title: '4. Streetwear Catalog & Inventory Availability',
      content: `Patowary Fashion provides authentic trending streetwear clothing, specializing in:
• Heavy-Twill Baggy Multi-Pocket Cargo Pants (Waist sizes 28 to 38)
• 260 GSM Boxy Heavyweight Drop-Shoulder Oversized Tees (M, L, XL, XXL)
• Relaxed Urban Denim & Casual Trousers
• Streetwear Hoodies, Jackets & Curated Lifestyle Accessories.
All products are subject to stock availability during high-demand limited drops. We make every effort to display accurate real-time inventory counts in our database.`
    },
    {
      id: 'pricing',
      title: '5. Pricing (৳ BDT) & Shipping Rates',
      content: `All retail prices are stated in Bangladeshi Taka (৳ BDT).
• Delivery Inside Dhaka: Flat rate ৳80 BDT (Estimated time: 24 to 48 hours).
• Delivery Outside Dhaka (All 64 Districts): Flat rate ৳150 BDT (Estimated time: 2 to 4 business days).
• Free Delivery Tier: All orders totaling ৳3,500 BDT or more qualify for FREE express courier delivery.
• Promotional Coupons: Verified codes such as PATOWARYVIP (20% off) or PATOWARY10 (10% off) must be applied in the cart prior to placing the order.`
    },
    {
      id: 'cod',
      title: '6. Cash on Delivery (COD) & Courier Inspection',
      content: `We provide Cash on Delivery (COD) service across all districts of Bangladesh. You are entitled to check the outer package and verify item details with the delivery officer upon arrival. We also accept instant digital payments via bKash, Nagad, and credit/debit cards. To ensure honest commerce, deliberate refusal of authentic COD parcels without valid reason may restrict future COD ordering privileges.`
    },
    {
      id: 'exchange',
      title: '7. 7-Day Hassle-Free Size & Fit Exchange Policy',
      content: `Customer comfort is our pride. If your cargo pants or boxy tee does not fit your waist, chest, or length as anticipated:
• You can request a size exchange within 7 days of delivery.
• The item must be unworn, unwashed, and returned with its original tags intact.
• Our courier team will collect the item and deliver your replacement size directly to your doorstep.
• In case the desired replacement size is completely sold out, a store credit or full product refund will be issued.`
    },
    {
      id: 'conduct',
      title: '8. Customer Code of Conduct',
      content: `Customers agree to engage in fair, truthful, and lawful transactions. You must not:
• Place fraudulent orders using fictitious phone numbers or fabricated delivery addresses.
• Harass, abuse, or demean delivery drivers, warehouse staff, or customer support representatives.
• Submit fraudulent or defamatory product reviews.
• Exploit coupon codes or technical vulnerabilities to manipulate order pricing.`
    },
    {
      id: 'reviews',
      title: '9. Genuine Customer Reviews & Feedback',
      content: `Only verified customers who have experienced our streetwear are eligible to publish star ratings and reviews. Reviews must reflect genuine sizing, fabric drape, and personal fit experiences. Patowary Fashion reserves the right to remove spam, profanity, or defamatory submissions that violate platform community guidelines.`
    },
    {
      id: 'colors',
      title: '10. Garment Photography & Color Calibration',
      content: `We photograph all apparel under high-CRI studio lighting to represent genuine fabric colors and textures (e.g. olive green twill, deep obsidian black, washed vintage grey, vintage beige). However, actual shades may vary marginally depending on your screen resolution, OLED/AMOLED calibration, and ambient light.`
    },
    {
      id: 'intellectual',
      title: '11. Intellectual Property & Brand Trademarks',
      content: `All trademarks, logos, brand photography, garment silhouette patterns, graphic art, and website code belong exclusively to Patowary Fashion. Reproduction, unauthorized reselling under counterfeit labels, or scraping website data without written permission is strictly prohibited by Bangladesh copyright and trademark laws.`
    },
    {
      id: 'courier',
      title: '12. Logistics & Courier Partnerships',
      content: `We partner with certified third-party delivery couriers in Bangladesh including Steadfast, RedX, Pathao, and SA Paribahan. While we guarantee fast dispatch within 24 hours of order confirmation, occasional transit delays due to severe weather conditions or unexpected circumstances are managed with prioritized re-routing and active tracking support.`
    },
    {
      id: 'suspension',
      title: '13. Account Termination & Blacklisting',
      content: `Patowary Fashion reserves the right to suspend or terminate accounts that repeatedly place false orders, systematically reject COD parcels upon arrival without justification, or violate platform security policies.`
    },
    {
      id: 'liability',
      title: '14. Limitation of Liability',
      content: `To the maximum extent permitted by the laws of Bangladesh, Patowary Fashion and its management shall not be liable for indirect, incidental, or consequential damages resulting from courier road delays, fabric misuse against care tags, or third-party telecommunication disruptions.`
    },
    {
      id: 'indemnification',
      title: '15. Customer Indemnification',
      content: `You agree to defend and hold harmless Patowary Fashion, its founders, and employees from any third-party claims or liabilities arising out of your breach of these Terms or unauthorized use of the platform.`
    },
    {
      id: 'amendments',
      title: '16. Amendments to Terms',
      content: `We reserve the right to revise these Terms of Service at any time to accommodate business growth or regulatory changes. The revised version will become effective immediately upon being published on this URL.`
    },
    {
      id: 'law',
      title: '17. Governing Law & Bangladesh Jurisdiction',
      content: `These Terms shall be governed by, construed, and enforced in accordance with the laws of the People's Republic of Bangladesh. Any dispute arising out of or related to these Terms shall be subject to the exclusive jurisdiction of the competent courts of Bangladesh.`
    },
    {
      id: 'contact',
      title: '18. Store Headquarters & Official Support',
      content: `For customer assistance, size consultations, order inquiries, or legal clarifications, contact our official flagship team:
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
            <span className="text-[#C9A66B] font-bold">Terms of Service</span>
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
            <Scale className="w-4 h-4 text-[#C9A66B]" />
            <span>LEGAL AGREEMENT & TERMS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-extrabold tracking-tight text-white">
            Terms of Service
          </h1>

          <p className="max-w-2xl mx-auto text-white/85 text-sm sm:text-base leading-relaxed font-sans">
            Please read these terms carefully before exploring or shopping on Patowary Fashion. These policies establish a transparent, trustworthy partnership between you and our brand.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-mono text-white/70">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <Calendar className="w-3.5 h-3.5 text-[#C9A66B]" />
              <span>Last Updated: September 28, 2026</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <Clock className="w-3.5 h-3.5 text-[#C9A66B]" />
              <span>⏱ Est. Read: 7 mins</span>
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
              placeholder="Search in terms (e.g. COD, delivery, exchange, refund, Chandpur)..."
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
                  <ShieldCheck className="w-5 h-5 text-[#C9A66B]" />
                  <span className="text-xs font-bold text-[#0A1E54]">Legally Binding</span>
                  <span className="text-[10px] text-stone-500 font-mono">Governed by BD Law</span>
                </div>

                <div className="bg-[#F8F3EA] p-3.5 rounded-xl border border-[#C9A66B]/30 flex flex-col items-center justify-center gap-1">
                  <Truck className="w-5 h-5 text-[#C9A66B]" />
                  <span className="text-xs font-bold text-[#0A1E54]">Nationwide Courier</span>
                  <span className="text-[10px] text-stone-500 font-mono">Dhaka ৳80 | BD ৳150</span>
                </div>

                <div className="bg-[#F8F3EA] p-3.5 rounded-xl border border-[#C9A66B]/30 flex flex-col items-center justify-center gap-1">
                  <RefreshCw className="w-5 h-5 text-[#C9A66B]" />
                  <span className="text-xs font-bold text-[#0A1E54]">7-Day Size Exchange</span>
                  <span className="text-[10px] text-stone-500 font-mono">Doorstep Replacement</span>
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

              {/* Navigation Footer for Terms */}
              <div className="pt-6 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
                <Link
                  to="/privacy"
                  className="inline-flex items-center gap-2 text-[#0A1E54] font-bold hover:text-[#C9A66B] transition-colors underline"
                >
                  <FileText className="w-4 h-4 text-[#C9A66B]" />
                  <span>Read our Privacy Policy &rarr;</span>
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
