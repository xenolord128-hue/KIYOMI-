import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  ShieldCheck, 
  Mail, 
  Globe, 
  MapPin, 
  Phone, 
  ArrowLeft, 
  Calendar, 
  FileText, 
  Search, 
  Printer, 
  Share2, 
  Check, 
  Clock, 
  ChevronRight, 
  Lock, 
  Truck, 
  RefreshCw, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { OFFICIAL_LOGO_URL } from '../components/BrandLogo';

export const PrivacyPolicy: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('intro');

  const isBn = language === 'bn';

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
      titleEn: '1. Introduction & Brand Commitment',
      titleBn: '১. ভূমিকা ও ব্র্যান্ড প্রতিশ্রুতি',
      contentEn: `Welcome to Patowary Fashion (পাটোয়ারী ফ্যাশন). We are Bangladesh's trending streetwear and modern lifestyle clothing destination, specializing in heavy-twill multi-pocket baggy cargos, relaxed trousers, 260 GSM boxy oversized t-shirts, and contemporary urban apparel. We value your privacy and are committed to protecting your personal information across our website, mobile interface, client portal, and order fulfillment systems.`,
      contentBn: `পাটোয়ারী ফ্যাশন (Patowary Fashion)-এ আপনাকে স্বাগতম। আমরা বাংলাদেশের একটি প্রিমিয়াম ট্রেন্ডিং স্ট্রিটওয়্যার ও আধুনিক লাইফস্টাইল ফ্যাশন ব্র্যান্ড—যা হেভি-টুইল মাল্টি-পকেট ব্যাগি কার্গো, রিল্যাক্সড ট্রাউজার্স, ২৬০ জিএসএম বক্সি ওভারসাইজড টি-শার্ট ও সমসাময়িক আরবান পোশাকে বিশেষায়িত। আমাদের প্ল্যাটফর্ম, ক্লায়েন্ট পোর্টাল এবং অর্ডার প্রসেসিং সিস্টেমে আপনার ব্যক্তিগত তথ্যের নিরাপত্তা ও গোপনীয়তা রক্ষা করা আমাদের প্রধান অঙ্গীকার।`
    },
    {
      id: 'collection',
      titleEn: '2. Information We Collect',
      titleBn: '২. আমরা যেসকল তথ্য সংগ্রহ করি',
      contentEn: `To deliver your fashion drops accurately and securely, we collect:
• Contact Details: Full name, delivery address, police station/thana, district across all 64 districts in Bangladesh, phone number, and WhatsApp contact.
• Account Information: Email address, encrypted login credentials, profile avatar, and verified user IDs.
• Order & Sizing History: Garment sizes (e.g. M, L, XL, XXL, waist 28-38), product selections, fit preferences, and delivery notes.
• Transaction & Courier Data: Courier tracking IDs (Steadfast, RedX, Pathao, SA Paribahan), Cash on Delivery (COD) settlement status, bKash/Nagad invoice numbers.
• Technical & Device Diagnostics: IP address, browser type, operating system, and performance telemetry to guarantee fast browsing.`,
      contentBn: `আপনার পছন্দের পোশাক নিখুঁতভাবে ডেলিভারি ও পরিষেবা প্রদানের জন্য আমরা নিম্নোক্ত তথ্যসমূহ সংগ্রহ করি:
• যোগাযোগের তথ্য: পুরো নাম, ডেলিভারি ঠিকানা, থানা, জেলা (বাংলাদেশের ৬৪টি জেলা), মোবাইল নম্বর এবং হোয়াটসঅ্যাপ নম্বর।
• অ্যাকাউন্ট তথ্য: ইমেইল ঠিকানা, এনক্রিপ্টেড পাসওয়ার্ড বা লগইন ক্রেডেনশিয়াল, প্রোফাইল ছবি এবং ভেরিফায়েড ইউজার আইডি।
• সাইজ ও অর্ডার হিস্ট্রি: পোশাকের সাইজ (যেমন M, L, XL, XXL, কোমর ২৮-৩৮ ইঞ্চি), পছন্দের ফিটিং ও স্পেশাল ডেলিভারি নোট।
• ট্রানজ্যাকশন ও কুরিয়ার ট্র্যাকিং: কুরিয়ার ট্র্যাকিং নম্বর (Steadfast, RedX, Pathao, SA Paribahan), ক্যাশ অন ডেলিভারি (COD) হিস্ট্রি, বিকাশ/নগদ ইনভয়েস নম্বর।
• টেকনিক্যাল ডায়াগনস্টিকস: ব্রাউজার টাইপ, অপারেটিং সিস্টেম, আইপি অ্যাড্রেস এবং ওয়েবসাইট পারফরম্যান্স ডাটা।`
    },
    {
      id: 'usage',
      titleEn: '3. How We Use Your Information',
      titleBn: '৩. তথ্যের ব্যবহার ও উদ্দেশ্য',
      contentEn: `Your data is utilized strictly for authentic e-commerce operations:
• Processing and dispatching your streetwear orders with home delivery.
• Sending automated SMS / EmailJS notifications regarding tracking codes and parcel arrival.
• Facilitating our 7-Day Hassle-Free Size & Fit Doorstep Exchange Guarantee.
• Customer care via direct phone hotline (+880 1633-704001) or WhatsApp support.
• Maintaining website security, protecting customer reviews, and preventing bot fraud.
• Delivering exclusive VIP Club drop alerts and promo codes (e.g. PATOWARYVIP, PATOWARY10).`,
      contentBn: `সংগৃহীত তথ্য শুধুমাত্র নির্ভরযোগ্য ই-কমার্স ও গ্রাহক সেবার জন্য ব্যবহৃত হয়:
• আপনার স্ট্রিটওয়্যার ও পোশাকের হোম ডেলিভারি অর্ডার কনফার্মেশন ও পার্সেল প্রেরণ।
• ট্র্যাকিং কোড, পার্সেল আগমন এবং আপডেট সংক্রান্ত স্বয়ংক্রিয় এসএমএস/ইমেইল নোটিফিকেশন প্রদান।
• আমাদের ৭ দিনের সহজ সাইজ ও ফিটিং ডোরস্টেপ এক্সচেঞ্জ পলিসি কার্যকর করা।
• হটলাইন (+৮৮০ ১৬৩৩-৭০৪০০১) ও হোয়াটসঅ্যাপের মাধ্যমে দ্রুত গ্রাহক সহায়তা নিশ্চিত করা।
• ওয়েবসাইটের সুরক্ষা, জেনুইন কাস্টমার রিভিউ ও বট প্রতিরোধ নিশ্চিত করা।
• স্পেশাল ড্রপ অ্যালার্ট ও ভিআইপি ডিসকাউন্ট কুপন (যেমন PATOWARYVIP, PATOWARY10) সরবরাহ।`
    },
    {
      id: 'security',
      titleEn: '4. Security & Firebase 256-Bit Encryption',
      titleBn: '৪. ডাটা সিকিউরিটি ও ফায়ারবেস ২৫৬-বিট এনক্রিপশন',
      contentEn: `Security is central to Patowary Fashion. All sensitive user account information is protected by Google Firebase Authentication and enterprise-grade Firestore Security Rules with 256-bit SSL/TLS end-to-end encryption. Your passwords are never stored in plaintext. Access is restricted to authorized personnel managing order fulfillment.`,
      contentBn: `নিরাপত্তা পাটোয়ারী ফ্যাশনের অন্যতম প্রধান মূলনীতি। আমাদের সকল গ্রাহক অ্যাকাউন্ট গুগল ফায়ারবেস অথেনটিকেশন ও ফায়ারস্টোর সিকিউরিটি রুলস দ্বারা ২৫৬-বিট এসএসএল এনক্রিপশনে সুরক্ষিত। আপনার পাসওয়ার্ড কখনোই প্লেইন টেক্সট হিসেবে সংরক্ষিত হয় না এবং শুধুমাত্র ডেলিভারি প্রক্রিয়াকরণের জন্য নিয়োজিত দায়িত্বপ্রাপ্ত কর্মীরাই অনুমোদিত ডাটা দেখতে পারেন।`
    },
    {
      id: 'payments',
      titleEn: '5. Cash on Delivery (COD) & Digital Payments',
      titleBn: '৫. ক্যাশ অন ডেলিভারি (সিওডি) ও ডিজিটাল পেমেন্ট',
      contentEn: `We offer Cash on Delivery (COD) nationwide across Bangladesh, permitting you to inspect the sealed parcel in front of the courier agent before final payment. For online transactions (bKash, Nagad, card), payment processing is handled through regulated merchant gateways. Patowary Fashion does not store your debit/credit card numbers or Mobile Financial Services (MFS) PINs.`,
      contentBn: `আমরা সমগ্র বাংলাদেশে ক্যাশ অন ডেলিভারি (COD) সুবিধা প্রদান করি—যেখানে ডেলিভারিম্যানের সামনে পার্সেল দেখে পেমেন্ট করার সুযোগ থাকে। অনলাইন পেমেন্টের ক্ষেত্রে (বিকাশ, নগদ, কার্ড), সুরক্ষিত মার্চেন্ট গেটওয়ের মাধ্যমে লেনদেন সম্পন্ন হয়। পাটোয়ারী ফ্যাশন কখনোই আপনার কার্ড নম্বর বা বিকাশ/নগদের গোপন পিন (PIN) সংরক্ষণ করে না।`
    },
    {
      id: 'cookies',
      titleEn: '6. Cookies & Local Session Storage',
      titleBn: '৬. কুকিজ ও লোকাল সেশন মেমোরি',
      contentEn: `We use essential browser cookies and local storage tokens to preserve your shopping cart items, wishlist selections, active login session, and language preference (EN/BN). These tokens contain no malicious code and can be cleared through your browser settings at any time.`,
      contentBn: `আমরা প্রয়োজনীয় ব্রাউজার কুকিজ ও লোকাল স্টোরেজ ব্যবহার করি আপনার শপিং কার্ট, উইশলিস্ট, লগইন সেশন এবং ভাষা সেটিংস সচল রাখার জন্য। এগুলোতে কোনো ক্ষতিকারক কোড থাকে না এবং আপনি যেকোনো সময় ব্রাউজার থেকে এগুলো পরিষ্কার করতে পারেন।`
    },
    {
      id: 'sharing',
      titleEn: '7. Information Sharing & Couriers',
      titleBn: '৭. তথ্য আদান-প্রদান ও কুরিয়ার পার্টনার',
      contentEn: `We strictly DO NOT sell, rent, or trade your personal information to third-party data brokers. Information is shared only with verified logistics partners (e.g. Steadfast Courier, RedX, Pathao) solely to deliver your orders to your doorstep in Faridganj, Chandpur, Dhaka, or anywhere in Bangladesh.`,
      contentBn: `আমরা কখনোই আপনার ব্যক্তিগত তথ্য কোনো থার্ড-পার্টি বা ডাটা ব্রোকারের কাছে বিক্রি বা ভাড়া দিই না। শুধুমাত্র আপনার অর্ডারকৃত পার্সেলটি চাঁদপুর, ফরিদগঞ্জ, ঢাকা কিংবা বাংলাদেশের যেকোনো প্রান্তে পৌঁছে দেওয়ার উদ্দেশ্যে বিশ্বস্ত কুরিয়ার পার্টনারদের (যেমন Steadfast, RedX, Pathao) সাথে প্রয়োজনীয় ডেলিভারি ঠিকানা শেয়ার করা হয়।`
    },
    {
      id: 'exchange',
      titleEn: '8. 7-Day Fitting & Size Exchange Privacy',
      titleBn: '৮. ৭ দিনের সাইজ এক্সচেঞ্জ ও গ্রাহক অধিকার',
      contentEn: `If a cargo pant or boxy t-shirt does not fit you perfectly, you can request an exchange within 7 days of receiving the package. Sizing measurements, replacement product preferences, and customer delivery notes submitted during exchange are kept strictly confidential in your customer profile.`,
      contentBn: `কার্গো প্যান্ট কিংবা বক্সি টি-শার্টের সাইজ নিয়ে কোনো সমস্যা হলে পার্সেল পাওয়ার ৭ দিনের মধ্যে সহজে এক্সচেঞ্জের আবেদন করতে পারবেন। এক্সচেঞ্জ প্রক্রিয়ায় আপনার দেওয়া সাইজের মাপ ও ব্যক্তিগত তথ্য গ্রাহক প্রোফাইলে সম্পূর্ণ সুরক্ষিত থাকে।`
    },
    {
      id: 'rights',
      titleEn: '9. Your Privacy Rights & Data Control',
      titleBn: '৯. আপনার অধিকার ও নিয়ন্ত্রণ',
      contentEn: `You have full ownership of your data on Patowary Fashion:
• Review, edit, or update your delivery address and profile information via the Client Profile page.
• Request complete deletion of your account and order history by contacting our support team.
• Opt out of VIP newsletter promo alerts with a single click.`,
      contentBn: `পাটোয়ারী ফ্যাশনে আপনার তথ্যের ওপর আপনার পূর্ণ নিয়ন্ত্রণ রয়েছে:
• ক্লায়েন্ট প্রোফাইল পেইজ থেকে যেকোনো সময় ঠিকানা ও ব্যক্তিগত তথ্য আপডেট করতে পারবেন।
• সাপোর্ট টিমে যোগাযোগ করে আপনার অ্যাকাউন্ট ও ডাটা ডিলিট করার অনুরোধ জানাতে পারবেন।
• যেকোনো সময় ভিআইপি প্রমোশনাল ইমেইল বন্ধ করার অধিকার আপনার রয়েছে।`
    },
    {
      id: 'updates',
      titleEn: '10. Changes to This Policy',
      titleBn: '১০. নীতিমালার হালনাগাদ ও পরিবর্তন',
      contentEn: `We may occasionally update this Privacy Policy to reflect store enhancements, new fashion drops, or updated Bangladesh e-commerce regulations. The "Last Updated" date at the top will always indicate the latest version.`,
      contentBn: `আমাদের প্ল্যাটফর্মের উন্নয়ন, নতুন ফিচার কিংবা সরকারি ই-কমার্স নীতিমালার সাথে সামঞ্জস্য রেখে এই প্রাইভেসি পলিসি সময়ে সময়ে হালনাগাদ হতে পারে। পৃষ্ঠার শীর্ষে থাকা "সর্বশেষ সংস্করণ" তারিখ দ্বারা এটি নির্দেশিত হবে।`
    },
    {
      id: 'contact',
      titleEn: '11. Official Store Contact & Coordinates',
      titleBn: '১১. অফিসিয়াল যোগাযোগের ঠিকানা',
      contentEn: `For any privacy inquiries, data deletion requests, or order consultations, reach us directly at our registered flagship hub:
• Physical Address: Bangladesh, Chandpur 3650, Faridganj (বাংলাদেশ, চাঁদপুর ৩৬৫০, ফরিদগঞ্জ)
• Direct Phone & WhatsApp: +880 1633-704001
• Official Email: support@patowaryfashion.com
• Official Website: https://patowaryfashion.com
• Facebook Official: https://www.facebook.com/share/19JHtW2Eft/`,
      contentBn: `প্রাইভেসি সংক্রান্ত যেকোনো প্রশ্ন, ডাটা ডিলিট অনুরোধ কিংবা পরামর্শের জন্য আমাদের সাথে সরাসরি যোগাযোগ করুন:
• অফিসিয়াল ঠিকানা: বাংলাদেশ, চাঁদপুর ৩৬৫০, ফরিদগঞ্জ
• ফোন ও হোয়াটসঅ্যাপ: +৮৮০ ১৬৩৩-৭০৪০০১
• অফিসিয়াল ইমেইল: support@patowaryfashion.com
• অফিসিয়াল ওয়েবসাইট: https://patowaryfashion.com
• ফেসবুক পেজ: https://www.facebook.com/share/19JHtW2Eft/`
    }
  ], []);

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const q = searchQuery.toLowerCase();
    return sections.filter(s => 
      s.titleEn.toLowerCase().includes(q) ||
      s.titleBn.toLowerCase().includes(q) ||
      s.contentEn.toLowerCase().includes(q) ||
      s.contentBn.toLowerCase().includes(q)
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
            {/* Language Toggle */}
            <div className="flex items-center bg-white/10 rounded-lg p-0.5 border border-white/20">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                  !isBn ? 'bg-[#C9A66B] text-[#0A1E54] shadow-xs' : 'text-white/70 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('bn')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                  isBn ? 'bg-[#C9A66B] text-[#0A1E54] shadow-xs' : 'text-white/70 hover:text-white'
                }`}
              >
                বাং
              </button>
            </div>

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
              <span>{copied ? (isBn ? 'কপি হয়েছে' : 'Copied') : (isBn ? 'শেয়ার' : 'Share')}</span>
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
            <span>{isBn ? 'আইনি ও প্রাইভেসি প্রটোকল' : 'LEGAL & PRIVACY PROTOCOL'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-extrabold tracking-tight text-white">
            {isBn ? 'প্রাইভেসি পলিসি' : 'Privacy Policy'}
          </h1>

          <p className="max-w-2xl mx-auto text-white/85 text-sm sm:text-base leading-relaxed font-sans">
            {isBn 
              ? 'আপনার বিশ্বাস ও তথ্যের গোপনীয়তা আমাদের কাছে সর্বোচ্চ অগ্রাধিকার। এই নীতিমালা ব্যাখ্যা করে কিভাবে পাটোয়ারী ফ্যাশন আপনার ব্যক্তিগত তথ্য সংগ্রহ, সুরক্ষিত ও পরিচালনা করে।'
              : 'Your privacy matters to us. This policy transparently explains how Patowary Fashion collects, uses, protects, and manages your personal information.'
            }
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-mono text-white/70">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <Calendar className="w-3.5 h-3.5 text-[#C9A66B]" />
              <span>{isBn ? 'সর্বশেষ সংস্করণ: ২৮ সেপ্টেম্বর, ২০২৬' : 'Last Updated: September 28, 2026'}</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <Clock className="w-3.5 h-3.5 text-[#C9A66B]" />
              <span>{isBn ? '⏱ আনুমানিক পাঠ সময়: ৫ মিনিট' : '⏱ Est. Read: 5 mins'}</span>
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
              placeholder={isBn ? "প্রাইভেসি পলিসিতে সার্চ করুন (যেমন: COD, কুরিয়ার, ফায়ারবেস, ফরিদগঞ্জ)..." : "Search in policy (e.g. COD, courier, Firebase, Chandpur, exchange)..."}
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
                  {isBn ? 'সূচিপত্র (Table of Contents)' : 'Table of Contents'}
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
                      <span className="truncate">{isBn ? sec.titleBn : sec.titleEn}</span>
                      <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-50" />
                    </div>
                  </a>
                ))}
              </nav>

              {/* Quick Contact Badge */}
              <div className="pt-3 border-t border-stone-200 space-y-2 text-stone-600 text-[11px] font-mono">
                <div className="flex items-center gap-2 text-[#0A1E54] font-bold">
                  <MapPin className="w-3.5 h-3.5 text-[#C9A66B]" />
                  <span>বাংলাদেশ, চাঁদপুর ৩৬৫০, ফরিদগঞ্জ</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#C9A66B]" />
                  <span>+880 1633-704001</span>
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
                      {isBn ? sec.titleBn : sec.titleEn}
                    </h2>
                    <a href={`#${sec.id}`} className="text-stone-400 hover:text-[#C9A66B] text-xs font-mono">
                      #
                    </a>
                  </div>

                  <div className="text-stone-700 text-sm sm:text-base leading-relaxed whitespace-pre-line font-sans">
                    {isBn ? sec.contentBn : sec.contentEn}
                  </div>
                </section>
              ))}

              {filteredSections.length === 0 && (
                <div className="py-12 text-center space-y-2 text-stone-500">
                  <Search className="w-8 h-8 mx-auto text-stone-400" />
                  <p className="text-sm font-semibold">কোনো ফলাফল পাওয়া যায়নি / No sections match your search.</p>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-[#0A1E54] font-bold underline cursor-pointer"
                  >
                    সব সেকশন দেখুন / View all sections
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
                    <h4 className="font-serif font-bold text-[#0A1E54] text-lg">Patowary Fashion (পাটোয়ারী ফ্যাশন)</h4>
                    <p className="text-xs text-stone-500 font-mono uppercase tracking-wider">
                      {isBn ? 'অফিসিয়াল স্টোর হেডকোয়ার্টার্স ও কমপ্লায়েন্স' : 'Official Store Flagship & Compliance'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-[#0A1E54] pt-2">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#C9A66B] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-stone-500 uppercase tracking-wider text-[10px]">
                        {isBn ? 'দোকানের ঠিকানা:' : 'Store Location:'}
                      </strong>
                      <span className="text-stone-800 font-sans font-bold">বাংলাদেশ, চাঁদপুর ৩৬৫০, ফরিদগঞ্জ</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Phone className="w-4 h-4 text-[#C9A66B] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-stone-500 uppercase tracking-wider text-[10px]">
                        {isBn ? 'হটলাইন ও হোয়াটসঅ্যাপ:' : 'Direct Hotline & WhatsApp:'}
                      </strong>
                      <a href="tel:+8801633704001" className="text-[#0A1E54] font-bold hover:text-[#C9A66B] underline">
                        +880 1633-704001
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Mail className="w-4 h-4 text-[#C9A66B] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-stone-500 uppercase tracking-wider text-[10px]">
                        {isBn ? 'ইমেইল:' : 'Official Email:'}
                      </strong>
                      <a href="mailto:support@patowaryfashion.com" className="text-[#0A1E54] font-bold hover:text-[#C9A66B] underline">
                        support@patowaryfashion.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Globe className="w-4 h-4 text-[#C9A66B] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-stone-500 uppercase tracking-wider text-[10px]">
                        {isBn ? 'ওয়েবসাইট:' : 'Official Website:'}
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
                  <span>{isBn ? 'আমাদের টার্মস অব সার্ভিস পড়ুন' : 'Read our Terms of Service'} &rarr;</span>
                </Link>

                <Link
                  to="/"
                  className="text-stone-500 hover:text-[#0A1E54] transition-colors"
                >
                  &larr; {isBn ? 'শপে ফিরে যান' : 'Back to Store'}
                </Link>
              </div>

            </article>
          </main>

        </div>
      </div>

      {/* Footer copyright */}
      <footer className="text-center py-8 text-xs font-mono text-stone-500 border-t border-stone-300/50">
        © 2026 <strong className="text-[#0A1E54] font-bold">Patowary Fashion</strong>. All rights reserved.
      </footer>

    </div>
  );
};
