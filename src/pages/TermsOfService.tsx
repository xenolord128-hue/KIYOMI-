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
  AlertCircle,
  Truck,
  RefreshCw,
  ShoppingBag,
  CreditCard
} from 'lucide-react';
import { OFFICIAL_LOGO_URL } from '../components/BrandLogo';

export const TermsOfService: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('acceptance');

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
      id: 'acceptance',
      titleEn: '1. Acceptance of Terms',
      titleBn: '১. শর্তাবলীর স্বীকৃতি',
      contentEn: `Welcome to Patowary Fashion (পাটোয়ারী ফ্যাশন). These Terms of Service constitute a legally binding agreement between you and Patowary Fashion regarding your access to and use of our e-commerce platform, website, client portal, mobile interfaces, and purchase transactions. By browsing, registering, or placing an order on our store, you acknowledge that you have read, understood, and agreed to be bound by these Terms in full.`,
      contentBn: `পাটোয়ারী ফ্যাশন (Patowary Fashion)-এ আপনাকে স্বাগতম। এই শর্তাবলী আপনার এবং পাটোয়ারী ফ্যাশনের মধ্যে একটি আইনি চুক্তি হিসেবে গণ্য হবে। আমাদের ওয়েবসাইট, ক্লায়েন্ট পোর্টাল ও অনলাইন স্টোর ব্যবহার করে পণ্য কেনাকাটা বা রেজিস্ট্রেশনের মাধ্যমে আপনি এই শর্তাবলী সম্পূর্ণভাবে পড়েছেন, বুঝেছেন এবং এতে সম্মত হয়েছেন বলে গণ্য হবে।`
    },
    {
      id: 'eligibility',
      titleEn: '2. Eligibility & Ordering Capacity',
      titleBn: '২. যোগ্যতা ও অর্ডার করার সামর্থ্য',
      contentEn: `To purchase apparel or open an account with Patowary Fashion, you must be of legal age to enter into contracts under the laws of Bangladesh (or possess verified parental/guardian authorization). By placing an order, you represent and warrant that the delivery information and phone number provided are accurate, active, and reachable.`,
      contentBn: `পাটোয়ারী ফ্যাশনে পোশাক ক্রয় বা অ্যাকাউন্ট খোলার জন্য আপনাকে বাংলাদেশের আইন অনুযায়ী চুক্তি করার আইনি বয়সের অধিকারী হতে হবে (অথবা অভিভাবকের অনুমতি থাকতে হবে)। অর্ডার সম্পন্ন করার মাধ্যমে আপনি নিশ্চিত করছেন যে প্রদত্ত ডেলিভারি ঠিকানা ও মোবাইল নম্বর সঠিক এবং সক্রিয় রয়েছে।`
    },
    {
      id: 'accounts',
      titleEn: '3. Customer Accounts & Firebase Security',
      titleBn: '৩. গ্রাহক অ্যাকাউন্ট ও ফায়ারবেস সিকিউরিটি',
      contentEn: `Creating an account unlocks VIP status, saved delivery coordinates, wishlist synchronization, and direct order tracking. You are responsible for safeguarding your password and account credentials. Patowary Fashion safeguards accounts using Google Firebase 256-bit encryption. Any unauthorized attempt to breach other users' accounts or tamper with database records will lead to immediate legal action and permanent blacklisting.`,
      contentBn: `একটি অ্যাকাউন্ট খোলার মাধ্যমে আপনি ভিআইপি ডিসকাউন্ট, সংরক্ষিত ডেলিভারি ঠিকানা এবং দ্রুত পার্সেল ট্র্যাকিং সুবিধা উপভোগ করতে পারবেন। আপনার পাসওয়ার্ডের গোপনীয়তা রক্ষা করা আপনার দায়িত্ব। পাটোয়ারী ফ্যাশন গুগল ফায়ারবেস ২৫৬-বিট এনক্রিপশন ব্যবহার করে। কোনো অননুমোদিত অ্যাক্সেস বা নিয়ম লঙ্ঘনের চেষ্টা অবিলম্বে অ্যাকাউন্ট বাতিল ও স্থায়ী ব্ল্যাকলিস্টের আওতায় আসবে।`
    },
    {
      id: 'catalog',
      titleEn: '4. Streetwear Catalog & Inventory Availability',
      titleBn: '৪. স্ট্রিটওয়্যার ক্যাটালগ ও স্টক প্রাপ্যতা',
      contentEn: `Patowary Fashion provides authentic trending streetwear clothing, specializing in:
• Heavy-Twill Baggy Multi-Pocket Cargo Pants (Waist sizes 28 to 38)
• 260 GSM Boxy Heavyweight Drop-Shoulder Oversized Tees (M, L, XL, XXL)
• Relaxed Urban Denim & Casual Trousers
• Streetwear Hoodies, Jackets & Curated Lifestyle Accessories.
All products are subject to stock availability during high-demand limited drops. We make every effort to display accurate real-time inventory counts in our database.`,
      contentBn: `পাটোয়ারী ফ্যাশন আসল ও আধুনিক ট্রেন্ডিং স্ট্রিটওয়্যার পোশাক সরবরাহ করে, বিশেষ করে:
• হেভি-টুইল মাল্টি-পকেট ব্যাগি কার্গো প্যান্ট (কোমর ২৮ থেকে ৩৮ ইঞ্চি)
• ২৬০ জিএসএম বক্সি হেভিওয়েট ড্রপ-শোল্ডার ওভারসাইজড টি-শার্ট (M, L, XL, XXL)
• রিল্যাক্সড ডেনিম ও ক্যাজুয়াল ট্রাউজার্স
• হুডি, জ্যাকেট ও ট্রেন্ডি আরবান ফ্যাশন অ্যাকসেসরিজ।
সীমিত স্টক ও স্পেশাল ড্রপের ক্ষেত্রে প্রাপ্যতা পরিবর্তনশীল হতে পারে। আমরা সবসময় সঠিক স্টক প্রদর্শন করতে সচেষ্ট থাকি।`
    },
    {
      id: 'pricing',
      titleEn: '5. Pricing (৳ BDT) & Shipping Rates',
      titleBn: '৫. মূল্য তালিকা (৳ BDT) ও ডেলিভারি চার্জ',
      contentEn: `All retail prices are stated in Bangladeshi Taka (৳ BDT).
• Delivery Inside Dhaka: Flat rate ৳80 BDT (Estimated time: 24 to 48 hours).
• Delivery Outside Dhaka (All 64 Districts): Flat rate ৳150 BDT (Estimated time: 2 to 4 business days).
• Free Delivery Tier: All orders totaling ৳3,500 BDT or more qualify for FREE express courier delivery.
• Promotional Coupons: Verified codes such as PATOWARYVIP (20% off) or PATOWARY10 (10% off) must be applied in the cart prior to placing the order.`,
      contentBn: `ওয়েবসাইটে প্রদর্শিত সকল মূল্য বাংলাদেশি টাকায় (৳ BDT) নির্ধারিত।
• ঢাকা সিটির ভেতরে ডেলিভারি চার্জ: মাত্র ৮০ টাকা (২৪ থেকে ৪৮ ঘণ্টার মধ্যে ডেলিভারি)।
• ঢাকার বাইরে সমগ্র বাংলাদেশ (৬৪ জেলা): মাত্র ১৫০ টাকা (২ থেকে ৪ কার্যদিবসের মধ্যে)।
• ফ্রি ডেলিভারি অফার: যেকোনো ৩,৫০০ টাকা বা তদূর্ধ্ব অর্ডারে সম্পূর্ণ ফ্রি কুরিয়ার ডেলিভারি।
• প্রমোশনাল কুপন: PATOWARYVIP (২০% ছাড়) কিংবা PATOWARY10 (১০% ছাড়) কুপন কোড চেকআউটে ব্যবহার করা যাবে।`
    },
    {
      id: 'cod',
      titleEn: '6. Cash on Delivery (COD) & Courier Inspection',
      titleBn: '৬. ক্যাশ অন ডেলিভারি (COD) ও পার্সেল হ্যান্ডওভার',
      contentEn: `We provide Cash on Delivery (COD) service across all districts of Bangladesh. You are entitled to check the outer package and verify item details with the delivery officer upon arrival. We also accept instant digital payments via bKash, Nagad, and credit/debit cards. To ensure honest commerce, deliberate refusal of authentic COD parcels without valid reason may restrict future COD ordering privileges.`,
      contentBn: `আমরা বাংলাদেশের সকল জেলায় ক্যাশ অন ডেলিভারি (COD) সুবিধা দিই। পার্সেল পৌঁছানোর পর ডেলিভারিম্যানের উপস্থিতিতে পণ্য যাচাই করার সুবিধা রয়েছে। এছাড়াও বিকাশ, নগদ বা কার্ডের মাধ্যমে পেমেন্ট করা যায়। ইচ্ছাকৃতভাবে কোনো কারণ ছাড়া পার্সেল ফিরিয়ে দিলে পরবর্তীতে ক্যাশ অন ডেলিভারি সুবিধা স্থগিত হতে পারে।`
    },
    {
      id: 'exchange',
      titleEn: '7. 7-Day Hassle-Free Size & Fit Exchange Policy',
      titleBn: '৭. ৭ দিনের সহজ সাইজ ও ফিটিং এক্সচেঞ্জ পলিসি',
      contentEn: `Customer comfort is our pride. If your cargo pants or boxy tee does not fit your waist, chest, or length as anticipated:
• You can request a size exchange within 7 days of delivery.
• The item must be unworn, unwashed, and returned with its original tags intact.
• Our courier team will collect the item and deliver your replacement size directly to your doorstep.
• In case the desired replacement size is completely sold out, a store credit or full product refund will be issued.`,
      contentBn: `আপনার সন্তুষ্টি আমাদের প্রধান লক্ষ্য। কার্গো প্যান্ট বা টি-শার্টের সাইজ ফিট না হলে:
• পার্সেল পাওয়ার ৭ দিনের মধ্যে সাইজ পরিবর্তনের আবেদন করতে পারবেন।
• পোশাকটি অব্যবহৃত, না ধোয়া এবং অরিজিনাল ট্যাগযুক্ত থাকতে হবে।
• আমাদের কুরিয়ার টিম আপনার বাসা থেকে পোশাকটি সংগ্রহ করে নতুন সাইজটি পৌঁছে দেবে।
• কাঙ্ক্ষিত সাইজের স্টক শেষ হয়ে গেলে স্টোর ক্রেডিট বা মূল্য রিফান্ড প্রদান করা হবে।`
    },
    {
      id: 'conduct',
      titleEn: '8. Customer Code of Conduct',
      titleBn: '৮. গ্রাহক আচরণবিধি ও সততা',
      contentEn: `Customers agree to engage in fair, truthful, and lawful transactions. You must not:
• Place fraudulent orders using fictitious phone numbers or fabricated delivery addresses.
• Harass, abuse, or demean delivery drivers, warehouse staff, or customer support representatives.
• Submit fraudulent or defamatory product reviews.
• Exploit coupon codes or technical vulnerabilities to manipulate order pricing.`,
      contentBn: `গ্রাহক হিসেবে আপনি সৎ ও দায়িত্বশীল আচরণ করতে অঙ্গীকারবদ্ধ। আপনি কখনো:
• ভুয়া নাম, অস্তিত্বহীন ঠিকানা বা অসত্য মোবাইল নম্বর দিয়ে ফেইক অর্ডার করবেন না।
• ডেলিভারিম্যান বা কাস্টমার সাপোর্ট টিমের সাথে কোনোপ্রকার অসৌজন্যমূলক আচরণ করবেন না।
• ক্ষতিকর বা বানোয়াট রিভিউ পোস্ট করবেন না।
• কোনো টেকনিক্যাল ত্রুটির অপব্যবহার করে কার্ট ভ্যালু ম্যানিপুলেট করবেন না।`
    },
    {
      id: 'reviews',
      titleEn: '9. Genuine Customer Reviews & Feedback',
      titleBn: '৯. জেনুইন গ্রাহক মতামত ও রিভিউ',
      contentEn: `Only verified customers who have experienced our streetwear are eligible to publish star ratings and reviews. Reviews must reflect genuine sizing, fabric drape, and personal fit experiences. Patowary Fashion reserves the right to remove spam, profanity, or defamatory submissions that violate platform community guidelines.`,
      contentBn: `শুধুমাত্র প্রকৃত ক্রেতারা পোশাকের রিভিউ ও স্টার রেটিং প্রদান করতে পারবেন। রিভিউতে কাপড়ের কোয়ালিটি, জিএসএম ও ফিটিং সংক্রান্ত সত্য অভিজ্ঞতা থাকতে হবে। কোনো অসঙ্গত বা আপত্তিকর বক্তব্য পেলে তা অপসারণের অধিকার পাটোয়ারী ফ্যাশন সংরক্ষণ করে।`
    },
    {
      id: 'colors',
      titleEn: '10. Garment Photography & Color Calibration',
      titleBn: '১০. পোশাকের ফটোগ্রাফি ও কালার নির্ভুলতা',
      contentEn: `We photograph all apparel under high-CRI studio lighting to represent genuine fabric colors and textures (e.g. olive green twill, deep obsidian black, washed vintage grey, vintage beige). However, actual shades may vary marginally depending on your screen resolution, OLED/AMOLED calibration, and ambient light.`,
      contentBn: `আমরা স্টুডিও লাইটিংয়ে পোশাকের আসল ফেব্রিক টেক্সচার ও রঙ ফুটিয়ে তোলার সর্বোচ্চ চেষ্টা করি। তবে বিভিন্ন ডিভাইসের স্ক্রিন রেজ্যুলেশন বা ডিসপ্লে ব্রাইটনেসের কারণে সামান্য রঙের তারতম্য দেখা যেতে পারে।`
    },
    {
      id: 'intellectual',
      titleEn: '11. Intellectual Property & Brand Trademarks',
      titleBn: '১১. বুদ্ধিবৃত্তিক সম্পদ ও ব্র্যান্ড স্বত্ব',
      contentEn: `All trademarks, logos, brand photography, garment silhouette patterns, graphic art, and website code belong exclusively to Patowary Fashion (পাটোয়ারী ফ্যাশন). Reproduction, unauthorized reselling under counterfeit labels, or scraping website data without written permission is strictly prohibited by Bangladesh copyright and trademark laws.`,
      contentBn: `পাটোয়ারী ফ্যাশনের সকল লোগো, গ্রাফিক্স ডিজাইন, পোশাকের প্যাটার্ন, ফটোগ্রাফি এবং ওয়েবসাইট কোড পাটোয়ারী ফ্যাশনের নিজস্ব সম্পদ। লিখিত অনুমতি ছাড়া এগুলো কপি, নকল বা বাণিজ্যিক উদ্দেশ্যে ব্যবহার করা আইনত দণ্ডনীয়।`
    },
    {
      id: 'courier',
      titleEn: '12. Logistics & Courier Partnerships',
      titleBn: '১২. কুরিয়ার ডেলিভারি ও পার্টনারশিপ',
      contentEn: `We partner with certified third-party delivery couriers in Bangladesh including Steadfast, RedX, Pathao, and SA Paribahan. While we guarantee fast dispatch within 24 hours of order confirmation, occasional transit delays due to severe floods, political hartals, or extreme weather conditions are managed with prioritized re-routing and active tracking support.`,
      contentBn: `আমরা বাংলাদেশের শীর্ষস্থানীয় নির্ভরযোগ্য কুরিয়ার কোম্পানিগুলোর (Steadfast, RedX, Pathao, SA Paribahan) সাথে কাজ করি। অর্ডার কনফার্মের ২৪ ঘণ্টার মধ্যে পার্সেল হ্যান্ডওভার নিশ্চিত করা হয়। বৈরী আবহাওয়া বা প্রাকৃতিক দুর্যোগের কারণে সাময়িক বিলম্ব হলে আমাদের টিম সার্বক্ষণিক ট্র্যাকিং সহায়তা প্রদান করে।`
    },
    {
      id: 'suspension',
      titleEn: '13. Account Termination & Blacklisting',
      titleBn: '১৩. অ্যাকাউন্ট স্থগিত ও ব্ল্যাকলিস্ট পলিসি',
      contentEn: `Patowary Fashion reserves the right to suspend or terminate accounts that repeatedly place false orders, systematically reject COD parcels upon arrival without justification, or violate platform security policies.`,
      contentBn: `বারংবার ভুয়া অর্ডার করা, ডেলিভারি পাওয়ার পর অহেতুক পার্সেল গ্রহণ না করা কিংবা সাইটের নিরাপত্তা নিয়ম ভঙ্গকারীদের অ্যাকাউন্ট সাময়িক বা স্থায়ীভাবে স্থগিত করার অধিকার পাটোয়ারী ফ্যাশন সংরক্ষণ করে।`
    },
    {
      id: 'liability',
      titleEn: '14. Limitation of Liability',
      titleBn: '১৪. দায়ের সীমাবদ্ধতা',
      contentEn: `To the maximum extent permitted by the laws of Bangladesh, Patowary Fashion and its management shall not be liable for indirect, incidental, or consequential damages resulting from courier road delays, fabric misuse against care tags, or third-party telecommunication disruptions.`,
      contentBn: `বাংলাদেশের প্রচলিত আইন অনুসারে, কুরিয়ার রোডের অপ্রত্যাশিত বিলম্ব বা পোশাকের ওয়াশ কেয়ার ট্যাগ না মেনে ব্যবহারের কারণে হওয়া ক্ষতির জন্য পাটোয়ারী ফ্যাশন প্রত্যক্ষ বা পরোক্ষভাবে দায়ী থাকবে না।`
    },
    {
      id: 'indemnification',
      titleEn: '15. Customer Indemnification',
      titleBn: '১৫. ক্ষতিপূরণ ও দায়িত্বশীলতা',
      contentEn: `You agree to defend and hold harmless Patowary Fashion, its founders, and employees from any third-party claims or liabilities arising out of your breach of these Terms or unauthorized use of the platform.`,
      contentBn: `গ্রাহক হিসেবে আপনি অঙ্গীকার করছেন যে, এই শর্তাবলী ভঙ্গ কিংবা বেআইনি কাজের মাধ্যমে সৃষ্ট কোনো তৃতীয় পক্ষের দাবির ক্ষেত্রে আপনি পাটোয়ারী ফ্যাশন ও এর কর্মীদের দায়িত্বমুক্ত রাখবেন।`
    },
    {
      id: 'amendments',
      titleEn: '16. Amendments to Terms',
      titleBn: '১৬. শর্তাবলীর পরিবর্তন ও পরিবর্ধন',
      contentEn: `We reserve the right to revise these Terms of Service at any time to accommodate business growth or regulatory changes. The revised version will become effective immediately upon being published on this URL.`,
      contentBn: `আমাদের প্ল্যাটফর্মের অগ্রগতি ও আইনি নিয়মের প্রয়োজনে এই শর্তাবলী যেকোনো সময় পরিবর্ধন করার অধিকার সংরক্ষিত। পরিবর্তিত শর্তাবলী ওয়েবসাইটে প্রকাশিত হওয়া মাত্র কার্যকর হবে।`
    },
    {
      id: 'law',
      titleEn: '17. Governing Law & Bangladesh Jurisdiction',
      titleBn: '১৭. প্রযোজ্য আইন ও বিচারিক অধিক্ষেত্র',
      contentEn: `These Terms shall be governed by, construed, and enforced in accordance with the laws of the People's Republic of Bangladesh. Any dispute arising out of or related to these Terms shall be subject to the exclusive jurisdiction of the competent courts of Bangladesh.`,
      contentBn: `এই শর্তাবলী গণপ্রজাতন্ত্রী বাংলাদেশের প্রচলিত আইন অনুসারে পরিচালিত ও ব্যাখ্যায়িত হবে। এই সম্পর্কিত যেকোনো আইনি বিরোধ বাংলাদেশের উপযুক্ত আদালতের এখতিয়ারাধীন হবে।`
    },
    {
      id: 'contact',
      titleEn: '18. Store Headquarters & Official Support',
      titleBn: '১৮. স্টোর হেডকোয়ার্টার্স ও অফিসিয়াল সাপোর্ট',
      contentEn: `For customer assistance, size consultations, order inquiries, or legal clarifications, contact our official flagship team:
• Physical Address: Bangladesh, Chandpur 3650, Faridganj (বাংলাদেশ, চাঁদপুর ৩৬৫০, ফরিদগঞ্জ)
• Direct Phone & WhatsApp: +880 1633-704001
• Official Email: support@patowaryfashion.com
• Official Website: https://patowaryfashion.com
• Facebook Official: https://www.facebook.com/share/19JHtW2Eft/`,
      contentBn: `সাইজ পরামর্শ, অর্ডার তথ্য বা যেকোনো আইনি ব্যাখ্যার জন্য আমাদের অফিসিয়াল স্টোর টিমের সাথে সরাসরি যোগাযোগ করুন:
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
            <span className="text-[#C9A66B] font-bold">Terms of Service</span>
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
            <span>{isBn ? 'আইনি চুক্তি ও নীতিমালা' : 'LEGAL AGREEMENT & TERMS'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-extrabold tracking-tight text-white">
            {isBn ? 'টার্মস অব সার্ভিস' : 'Terms of Service'}
          </h1>

          <p className="max-w-2xl mx-auto text-white/85 text-sm sm:text-base leading-relaxed font-sans">
            {isBn 
              ? 'পাটোয়ারী ফ্যাশন এবং এর সেবা ব্যবহারের পূর্বে দয়া করে এই শর্তাবলী মনোযোগ সহকারে পড়ুন। এটি আমাদের এবং সম্মানিত গ্রাহকদের মধ্যে একটি স্বচ্ছ ও বিশ্বস্ত বাণিজ্যিক চুক্তি।'
              : 'Please read these terms carefully before purchasing or using Patowary Fashion services. It establishes a transparent, trustworthy retail relationship.'
            }
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-mono text-white/70">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <Calendar className="w-3.5 h-3.5 text-[#C9A66B]" />
              <span>{isBn ? 'সর্বশেষ সংস্করণ: ২৮ সেপ্টেম্বর, ২০২৬' : 'Last Updated: September 28, 2026'}</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <Clock className="w-3.5 h-3.5 text-[#C9A66B]" />
              <span>{isBn ? '⏱ আনুমানিক পাঠ সময়: ৭ মিনিট' : '⏱ Est. Read: 7 mins'}</span>
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
              placeholder={isBn ? "শর্তাবলীতে সার্চ করুন (যেমন: COD, ডেলিভারি, এক্সচেঞ্জ, পেমেন্ট, ফরিদগঞ্জ)..." : "Search in terms (e.g. COD, delivery, exchange, refund, Chandpur)..."}
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
                  <Truck className="w-5 h-5 text-[#C9A66B]" />
                  <span className="text-xs font-bold text-[#0A1E54]">Nationwide Delivery</span>
                  <span className="text-[10px] text-stone-500 font-mono">Dhaka ৳80 | BD ৳150</span>
                </div>

                <div className="bg-[#F8F3EA] p-3.5 rounded-xl border border-[#C9A66B]/30 flex flex-col items-center justify-center gap-1">
                  <CreditCard className="w-5 h-5 text-[#C9A66B]" />
                  <span className="text-xs font-bold text-[#0A1E54]">Cash on Delivery</span>
                  <span className="text-[10px] text-stone-500 font-mono">bKash / Nagad / COD</span>
                </div>

                <div className="bg-[#F8F3EA] p-3.5 rounded-xl border border-[#C9A66B]/30 flex flex-col items-center justify-center gap-1">
                  <RefreshCw className="w-5 h-5 text-[#C9A66B]" />
                  <span className="text-xs font-bold text-[#0A1E54]">7-Day Size Exchange</span>
                  <span className="text-[10px] text-stone-500 font-mono">Guaranteed Fitting</span>
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

              {/* Navigation Footer for Terms */}
              <div className="pt-6 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
                <Link
                  to="/privacy"
                  className="inline-flex items-center gap-2 text-[#0A1E54] font-bold hover:text-[#C9A66B] transition-colors underline"
                >
                  <FileText className="w-4 h-4 text-[#C9A66B]" />
                  <span>{isBn ? 'আমাদের প্রাইভেসি পলিসি পড়ুন' : 'Read our Privacy Policy'} &rarr;</span>
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
