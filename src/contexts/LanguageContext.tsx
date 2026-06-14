import React, { createContext, useContext, useState, useEffect } from "react";

type Locale = "en" | "bn";

interface LanguageContextProps {
  locale: Locale;
  toggleLanguage: () => void;
  setLocale: (l: Locale) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

// Rich bilingual static translation database
const translationDictionary: Record<string, string> = {
  // Navigation & General Header Info
  "HOME": "হোম",
  "CATALOG": "ক্যাটালগ",
  "TRACK ORDER": "অর্ডার ট্র্যাক",
  "DETAILS": "বিস্তারিত",
  "BUY • কিনুন": "কিনুন",
  "BUY NOW": "কিনুন",
  "BUY": "কিনুন",
  "VIEW": "দেখুন",
  "PREMIUM CLOTHIERS": "প্রিমিয়াম গ্যাজেট ও অ্যাক্সেসরিজ",
  "EST. 2026 • GUILD TIER: THE DIRECTORY (FULL SCREEN)": "স্থাপিত ২০২৬ • সম্পূর্ণ গ্যাজেট ক্যাটালগ",
  "ECO-LUXE COUTURE CORE VALUES": "কিয়োমি প্রিমিয়াম গ্যাজেট মূল্যবোধ",
  "OUR MANIFESTO": "আমাদের ইশতেহার",
  "Conscious Elegance, Defined.": "মার্জিত সুপিরিয়র বিল্ড কোয়ালিটি।",
  "ECO-LUXE merges high-fashion aesthetics with regenerative, circular fabrics. We refuse temporary trends to create highly durable clothing for the modern wardrobe.": "কিয়োমি সুপিরিয়র ডিজাইনকে অরিজিনাল উপাদানের সাথে যুক্ত করে। আমরা সস্তা ডুপ্লিকেট চিপ ও পার্টস এড়িয়ে অরিজিনাল ও লং-লাস্টিং গ্যাজেট তৈরি করি।",
  "MATERIALS": "উপাদান ও বিল্ড",
  "Organic Linens & Recycled Cotton": "অ্যালুমিনিয়াম অ্যালয় ও AMOLED ডিসপ্লে",
  "SHIPPING": "শিপিং",
  "100% Carbon Neutral Delivery": "১০০% নিরাপদ ডেলিভারী ও ব্র্যান্ড ওয়ারেন্টি",
  "PROMOTION CODE": "প্রোমোকোড",
  "Instantaneous 20% Reduction on any Dhaka Dispatch Order": "তাৎক্ষণিক ২০% ক্যাশব্যাক অফার",
  "CLIENT ACCOUNT SECTIONS": "গ্রাহক সেকশন সমূহ",
  "SHOP FULL CATALOG": "সম্পূর্ণ ক্যাটালগ দেখুন",
  "ALL COUTURES": "সকল গ্যাজেট কালেকশন",
  "YOUR CART": "আপনার কার্ট",
  "YOUR PROFILE": "আপনার প্রোফাইল",
  "SAVED ITEMS & WISHLIST": "সংরক্ষিত আইটেম ও উইশলিস্ট",
  "ADMIN SYSTEM CONTROLS CONTROLLED ACCESS": "অ্যাডমিন সিস্টেম কন্ট্রোল",
  "VIP PROMOTION OFFER": "ভিআইপি প্রমোশন অফার",
  "CUSTOMER ASSIST DESK": "গ্রাহক সহায়তা সেবা",
  "Have fitting or measurement questions? Speak directly to our Gulshan apparel representative now.": "ওয়ারেন্টি বা স্পেসিফিকেশন নিয়ে প্রশ্ন আছে? আমাদের গুলশান রিপ্রেজেন্টেটিভ এর সাথে সরাসরি কথা বলুন।",
  "DIRECT WHATSAPP LINE SUPPORT": "সরাসরি হোয়াটসঅ্যাপ সাপোর্ট",
  "SEARCH EXCLUSIVE KIYOMI STREETWEAR COLLECTIONS...": "একচেটিয়া কিয়োমি গ্যাজেট ও ইলেকট্রনিক্স অনুসন্ধান করুন...",
  "ENTER GADGET SPECIMENS OR PREMIUM KEYWORDS...": "গ্যাজেট বা প্রিমিয়াম কি-ওয়ার্ড দিয়ে খুঁজুন...",
  "INSTANT APP SEARCH": "তাৎক্ষণিক অনুসন্ধান",
  "YOUR SHOPPING CONTAINER": "আপনার শপিং কার্ট",
  "CURATED BAG": "কার্ট ব্যাগ",
  "YOUR BAG IS UNUSUALLY VACANT": "আপনার শপিং কার্ট আপাতত খালি আছে",
  "Begin exploring our premium garments catalog to append select specimens here.": "আমাদের প্রিমিয়াম গ্যাজেট কালেকশন ঘুরে কার্টে আইটেম যুক্ত করুন।",
  "CONTINUE ACQUIRING": "কেনাকাটা অব্যাহত রাখুন",
  "ORDER SUMMARY VALUES": "অর্ডার সামারি",
  "SUBTOTAL ESTIMATE": "উপ-মোট হিসাব",
  "COURIER DELIVERY": "কুরিয়ার ডেলিভারি",
  "FREE DELIVERY": "ফ্রি ডেলিভারি",
  "DISCOUNT ALLOCATION": "ছাড়ের হিসাব",
  "GRAND TOTAL": "সর্বমোট বিল",
  "PROCEED TO CHECKOUT SECURELY": "নিরাপদ চেকআউট করুন",
  "ENTER PROMOCODE": "প্রোমোকোড দিন",
  "APPLY": "প্রয়োগ করুন",
  "COURIER DELIVERY SHIPPING": "কুরিয়ার ডেলিভারি শিপিং",

  // Footer & Notices
  "KIYOMI BANGLADESH: ENJOY FREE COURIER FOR ALL ORDERS ABOVE BDT 5000": "কিয়োমি বাংলাদেশ: ৫০০০ টাকার বেশি অর্ডারে ফ্রি কুরিয়ার ডেলিভারী পান",
  "ENTER PROMOCODE [KIYOMIVIP] FOR 20% OFF AT CHECKOUT": "২০% ছাড় পেতে চেকআউটে প্রোমোকোড [KIYOMIVIP] ব্যবহার করুন",
  "KIYOMI BANGLADESH": "কিয়োমি বাংলাদেশ",
  "Exclusive garments curated for the hyper-urban individual. Rooted in minimalist architectural forms, we source the highest grade natural linens, heavy loops French terry, and tech nylon weaves to create premium apparel for the modern streetwear wardrobe. Base operations in Dhaka, Bangladesh.": "আধুনিক প্রযুক্তিপ্রেমীদের জন্য বিশেষভাবে কিউরেট করা স্মার্টওয়াচ ও প্রিমিয়াম গ্যাজেট। আমরা সর্বোচ্চ মানের ওএলইডি ডিসপ্লে, অ্যালয় বিল্ড ও মেটালিক ফ্রেম ইন্টিগ্রেট করি। আমাদের মূল কার্যালয় গুলশান, ঢাকা, বাংলাদেশে অবস্থিত।",
  "KIYOMI PREMIUM MAILING": "কিয়োমি প্রিমিয়াম মেইলিং",
  "Subscribe to secure drop notifications, restock priority, and private client coupon allocations.": "নতুন গ্যাজেট রিলিজ এবং রিস্টক নোটিফিকেশন পেতে সাবস্ক্রাইব করুন।",
  "SECURE CLIENT ACCESS": "নিরাপদ ক্লায়েন্ট অ্যাক্সেস",
  "SYSTEM INDEX": "সিস্টেম ইনডেক্স",
  "TRACK DISPATCH": "অর্ডার ট্র্যাকিং",
  "CUSTOMER ACCORD": "গ্রাহক সেবা",
  "SUPPORT CENTRE": "সরাসরি সাপোর্ট",
  "TERMS OF ACQUISITION": "কেনাকাটার শর্তাবলী",
  "PRIVACY COMPLIANCE": "গোপনীয়তা নীতি",
  "SECURED GATEWAY": "নিরাপদ পেমেন্ট গেটওয়ে",
  "ALL RIGHTS RESERVED.": "সর্বস্বত্ব সংরক্ষিত।",
  "MANUFACTURED IN DHAKA PREMISES": "অরিজিনাল ও ভেরিফাইড কোয়ালিটি",

  // Categories
  "Smartwatches": "স্মার্টওয়াচ ও ঘড়ি",
  "Earbuds & Audio": "ইয়ারবাডস ও অডিও",
  "Power & Chargers": "পাওয়ার ও চার্জার",
  "Mice & Keyboards": "মাউস ও কিবোর্ড",
  "Smart Gadgets": "স্মার্ট গ্যাজেট",
  "All Products": "সকল প্রোডাক্ট",
  "SHOW ONLY SAVED GARMENTS": "শুধু পছন্দের গ্যাজেটগুলো দেখুন",
  "KIYOMI CATALOG": "কিয়োমি ক্যাটালগ",
  "RESULTS FOR:": "অনুসন্ধান ফলাফল:",

  // Home Page Elements
  "KIYOMI ARCHIVE • আমাদের বিশেষ কালেকশন": "কিয়োমি আর্কাইভ • আমাদের বিশেষ ক্যাটালগ",
  "COLLECTIONS": "কালেকশন সমূহ",
  "প্রতিটি কালেকশন আলাদাভাবে ডানে-বামে এবং নিচে স্ক্রল করুন": "প্রতিটি কালেকশন আলাদাভাবে ডানে-বামে এবং নিচে স্ক্রল করুন",
  "Swipe ➔": "সোয়াইপ করুন ➔",
  "LIMITED DROP": "সীমিত সংস্করণ",
  "Only a fraction of custom items created. Securing inventory immediately is advised.": "সীমিত সংস্করণের প্রিমিয়াম অরিজিনাল গ্যাজেট। এখনই নিরাপদ অর্ডার করার পরামর্শ দেওয়া হলো।",
  "EXPLORE ARCHIVE": "আর্কাইভ এক্সপ্লোর করুন",
  "SECURE A DESIGN": "সংগ্রহ করুন",
  "WHAT THE GUILD SAYS": "গ্রাহকদের চমৎকার মতামত",
  "Read real, unfiltered testimonials regarding natural weight and architectural drape.": "আমাদের গ্যাজেটের প্রিমিয়াম কোয়ালিটি ও মেটাল বিল্ড নিয়ে গ্রাহকদের মন্তব্য পড়ুন।",
  "MEMBER #205": "মেম্বার #২০৫",
  "MEMBER #491": "মেম্বার #৪৯১",
  "Absolutely top-tier draping. The 480gsm hoodie stands stiff exactly how streetwear aficionados appreciate. A masterclass in Dhaka fashion.": "অসাধারণ কোয়ালিটি ও প্রিমিয়াম মেক। ক্রোনেক্স স্মার্টওয়াচের ওএলইডি ডিসপ্লে এবং মেটালিক টাইটানিয়াম বিল্ড বিশ্বমানের। কিয়োমি সত্যিই প্রশংসনীয়।",
  "KIYOMI linen feels luxurious. The cut is beautifully oversized without slouching. Easily competes with foreign high-end brands.": "কিয়োমি মেকানিক্যাল কিবোর্ড সত্যি খুব বিলাসবহুল মনে হয়। টাইপিং অ্যাকোস্টিক চমৎকার গ্যাস্কেট মাউন্ট সাউন্ড তৈরি করে। সহজেই যেকোনো আন্তর্জাতিক প্র্যান্ডের সাথে প্রতিযোগিতা করতে পারে।",

  // Product Details Page
  "SELECT SPECIMEN VARIANT SIZE": "আপনার সাইজ সিলেক্ট করুন",
  "Acquire Specimen Now": "এখনই পোশাকটি অর্ডার করুন",
  "ADD TO CURATED BAG": "ব্যাগে যোগ করুন",
  "SAVED TO TARGETS": "উইশলিস্টেড",
  "SAVE TO WISHLIST": "পছন্দের তালিকায় রাখুন",
  "ESTIMATED DELIVERY PHASE INTAKE": "ডেলিভারি সংক্রান্ত তথ্যাবলী",
  "Inside Dhaka Premises": "ঢাকার ভেতরে ডেলিভারি",
  "1-2 business days. Flat BDT 80 inside primary zones.": "১-২ কার্যদিবস। ডেলিভারি চার্জ ৮০ টাকা মাত্র।",
  "Outside Dhaka Premises": "ঢাকার বাইরে ডেলিভারি",
  "3-4 business days. Flat BDT 150. Requires solid secure placement.": "৩-৪ কার্যদিবস। ডেলিভারি চার্জ ১৫০ টাকা মাত্র।",
  "CLIENT DISCUSSIONS & REVIEWS": "গ্রাহকদের রিভিউ ও রেটিংস",
  "SUBMIT AN AUTHENTIC FEEDBACK ENTRY": "আপনার নিজস্ব রিভিউ সাবমিট করুন",
  "PROVIDE FEEDBACK CONCERNING WEIGHT, TEXTURE, FIT, AND DELIVERY RESOLUTION...": "কাপড়ের কোয়ালিটি, সাইজ এবং ফিটিং নিয়ে আপনার মূল্যবান মন্তব্য লিখুন...",
  "YOUR NAME": "আপনার নাম",
  "STAR RATING (1-5)": "রেটিং দিন (১-৫)",
  "RECORD TESTIMONIAL": "রিভিউ যোগ করুন",

  // Track Order Page
  "ORDER COMMUNION PORTAL": "অর্ডার ট্র্যাকিং পোর্টাল",
  "ENTER THE ALPHANUMERIC TRACKING OR ORDER IDENTIFIER": "আপনার অর্ডার আইডি বা ট্র্যাকিং নাম্বার লিখুন",
  "TRACK CONSIGNMENT": "ট্র্যাক করুন",
  "REASSURING SYSTEM TRACE FOUND": "সিস্টেমে আপনার অর্ডারের তথ্য পাওয়া গিয়েছে",
  "ORDER IDENTIFIER": "অর্ডার আইডি",
  "CUSTOMER ALLOCATION": "গ্রাহকের নাম",
  "TOTAL PRICE VALUE": "মোট বিলের পরিমাণ",
  "CURRENT DISPATCH STATE": "বর্তমান অর্ডার স্ট্যাটাস",
  "DELIVERY SHIPPING ADDRESS": "ডেলিভারি ঠিকানা",
  "TIMELINE HISTORY OF PHASE ACTIONS": "ডেলিভারি ট্র্যাকিং হিস্ট্রি",
  "VERIFICATION": "অর্ডার যাচাইকরণ",
  "DISPATCH IN TRANSIT": "কুরিয়ারে পাঠানো হয়েছে",
  "DELIVERY COMPLETED": "অর্ডার বুঝিয়ে দেওয়া হয়েছে",
  "Order database initialization successfully verified.": "অর্ডার সফলভাবে ভেরিফাই করা হয়েছে।",
  "Consignment packaging passed pristine quality audit.": "কোয়ালিটি অডিটে অর্ডারটি মানোত্তীর্ণ হয়েছে।",
  "Parcel handed over to strategic courier fleet route.": "কুরিয়ার সার্ভিসে পার্সেল বুঝিয়ে দেওয়া হয়েছে।",
  "Package successfully secure delivered to recipient database point.": "অর্ডার পার্সেলটি সফলভাবে আপনার কাছে ডেলিভার করা হয়েছে।",

  // Checkout Page
  "SECURE ORDER CHECKOUT STAGE": "নিরাপদ অর্ডার চেকআউট",
  "RE-VALIDATING YOUR SELECT ARTIFACTS": "আপনার নির্বাচিত পণ্য সমূহ যাচাই করুন",
  "DISPATCH COURIER DETAILS": "কুরিয়ার ডেলিভারি ও গ্রাহক বিবরণ",
  "FULL CLIENT NAME": "গ্রাহকের পূর্ণ নাম",
  "MOBILE TELEPHONY NUMBER": "মোবাইল নাম্বার",
  "DHAKA PREMISES OR DISTRICT": "জেলা নির্বাচন করুন",
  "INSIDE DHAKA PREMISES (BDT 80)": "ঢাকার ভেতরে (৮০ টাকা চার্জ)",
  "OUTSIDE DHAKA PREMISES (BDT 150)": "ঢাকার বাইরে (১৫০ টাকা চার্জ)",
  "COURIER DELIVER WAREHOUSE ADDRESS": "ডেলিভারি সম্পূর্ণ করার পূর্ণ ঠিকানা",
  "TRANSACTION METHODOLOGY": "পেমেন্ট পদ্ধতি",
  "CASH ON DELIVERY": "ক্যাশ অন ডেলিভারি (হাতে পেয়ে টাকা দিন)",
  "Upon dropoff, courier mandates physically handing currency values to agent.": "কুরিয়ার পার্সেল হাতে পাওয়ার পর টাকা বুঝিয়ে দিন।",
  "DISPATCH DELIVERY": "ডেলিভারি চার্জ",
  "SUBTOTAL ESTIMATED VALUE": "পণ্যের সাব-টোটাল মূল্য",
  "ORDER PLACED. SYSTEM PENDING...": "অর্ডার রিসিভ করা হয়েছে। সিস্টেম ভেরিফাই করছে...",
  "PLACE SECURE ORDER (CASH ON DELIVERY)": "অর্ডারটি কনফার্ম করুন (ক্যাশ অন ডেলিভারি)",

  // Cart Page
  "CLIENT SHOPPING CONTAINER REGISTER": "আপনার শপিং ব্যাগ রেজিস্টার",
  "GARMENTS IN ACQUIRE VECTOR": "ব্যাগস্থ আর্টওয়ার্কস",
  "REMOVE": "মুছুন",
  "Secure coupon code applied successfully to discount allocations.": "কুপন কোডটি সফলভাবে প্রয়োগ করা হয়েছে।",

  // Profile Page
  "CLIENT PROFILE ACCORD": "গ্রাহক প্রোফাইল রেকর্ড",
  "CLIENT METRICS": "গ্রাহক তথ্য ও পরিসংখ্যান",
  "Total Orders Executed": "মোট অর্ডারের সংখ্যা",
  "Total Funds Contributed": "মোট কেনাকাটার পরিমাণ",
  "Verified VIP Tier Status": "ভেরিফাইড ভিআইপি মেম্বার",
  "GUILD AFFILIATED REEVALUATED": "ক্লেমড মেম্বারশিপ",
  "RECENT ACCOUNT TRANSACTIONS LISTING": "আপনার সাম্প্রতিক অর্ডার ক্যাটালগ",
  "NO RECENT CONSIGNMENT RECORDS": "কোন সাম্প্রতিক অর্ডার রেকর্ড নেই",
  "LOGOUT SESSION": "লগআউট সেশন",
  "GUILD MEMBER EXCLUSIVE LOGIN": "মেম্বার এক্সক্লুসিভ সিকিউর সাইন-ইন",
  "EMAIL ADDRESS": "ইমেইল এড্রেস",
  "TEMPORARY PASS CODE": "পাসওয়ার্ড",
  "SUBMIT TO ACCESS ENVIRONMENT": "সাইন ইন করুন",
  "AUTH PROGRESS PENDING...": "ভেরিফাই করা হচ্ছে..."
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem("kiyomi_locale");
    return (saved === "en" || saved === "bn") ? saved : "en";
  });

  const toggleLanguage = () => {
    setLocaleState((prev) => {
      const next = prev === "en" ? "bn" : "en";
      localStorage.setItem("kiyomi_locale", next);
      return next;
    });
  };

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("kiyomi_locale", l);
  };

  const t = (key: string, fallback?: string): string => {
    if (!key) return "";
    const cleanKey = key.trim();
    if (locale === "bn") {
      // Check exact dictionary match
      if (translationDictionary[cleanKey]) {
        return translationDictionary[cleanKey];
      }
      // Check uppercase dictionary match
      const upperKey = cleanKey.toUpperCase();
      if (translationDictionary[upperKey]) {
        return translationDictionary[upperKey];
      }
      // Auto-fallback for slash-separated dual labels
      if (cleanKey.includes(" / ")) {
        const parts = cleanKey.split(" / ");
        if (parts[1]) return parts[1].trim(); 
      }
      return fallback || key;
    } else {
      // If locale is English, and it has a slash with Bengali, we ONLY want the English part!
      if (cleanKey.includes(" / ")) {
        const parts = cleanKey.split(" / ");
        return parts[0].trim();
      }
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, toggleLanguage, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
