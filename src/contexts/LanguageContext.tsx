import React, { createContext, useContext, useState } from 'react';

export type Locale = 'en' | 'bn';

interface LanguageContextType {
  locale: Locale;
  toggleLanguage: () => void;
  setLocale: (l: Locale) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Comprehensive dictionary for English & Bengali localization
export const translationDictionary: Record<string, string> = {
  // Navigation & Menus
  "STREETWEAR DROPS": "স্ট্রিটওয়্যার ড্রপস",
  "PRODUCTS": "প্রোডাক্টস",
  "TRACK DISPATCH": "অর্ডার ট্র্যাকিং",
  "BRAND STORY": "ব্র্যান্ড পরিচিতি",
  "CLIENT PASSPORT": "প্রোফাইল",
  "SEARCH FITS": "অনুসন্ধান",
  "CART BAG": "শপিং ব্যাগ",
  "EXPLORE ALL STREETWEAR": "সকল ফ্যাশন আইটেম দেখুন",
  "BAGGY & CARGO PANTS": "ব্যাগি ও কার্গো প্যান্ট",
  "OVERSIZED TEES & POLOS": "ওভারসাইজড টি-শার্ট ও পোলো",
  "HOODIES & SWEATSHIRTS": "হুডি ও সোয়েটশার্ট",
  "WOMEN'S COLLECTION": "মহিলাদের কালেকশন",
  "ACCESSORIES & LIFESTYLE": "এক্সেসরিজ ও লাইফস্টাইল",
  "EXPLORE CATALOG": "ক্যাটালগ দেখুন",
  "BACK TO HOME": "হোম পেজে ফিরুন",
  "CONTINUE SHOPPING": "কেনাকাটা চালিয়ে যান",

  // Header and Global
  "PATOWARY FASHION": "পাটোয়ারী ফ্যাশন",
  "MODERN TRENDING STREETWEAR & APPAREL": "মডার্ন ট্রেন্ডিং স্ট্রিটওয়্যার ও অ্যাপারেল",
  "PATOWARY FASHION: FREE EXPRESS COURIER FOR ALL ORDERS ABOVE BDT 3500": "পাটোয়ারী ফ্যাশন: ৩৫০০ টাকার বেশি অর্ডারে সারা দেশে ফ্রি কুরিয়ার ডেলিভারি",
  "USE CODE [PATOWARYVIP] FOR 20% DISCOUNT": "২০% ছাড়ে অর্ডার করতে কোড [PATOWARYVIP] ব্যবহার করুন",
  "YOUR CART": "আপনার কার্ট",
  "YOUR PROFILE": "আপনার প্রোফাইল",
  "SAVED ITEMS & WISHLIST": "পছন্দের তালিকা ও উইশলিস্ট",
  "ADMIN SYSTEM CONTROLS": "অ্যাডমিন কন্ট্রোল প্যানেল",
  "VIP PROMOTION OFFER": "ভিআইপি প্রমোশন অফার",
  "CUSTOMER ASSIST DESK": "গ্রাহক সহায়তা সেবা",
  "Have fitting or measurement questions? Speak directly to our apparel support now.": "সাইজ বা ফিটিং নিয়ে প্রশ্ন আছে? সরাসরি আমাদের কাস্টমার কেয়ারে যোগাযোগ করুন।",
  "DIRECT WHATSAPP LINE SUPPORT": "সরাসরি হোয়াটসঅ্যাপ সাপোর্ট",
  "SEARCH EXCLUSIVE STREETWEAR COLLECTIONS...": "ট্রেন্ডিং ব্যাগি কার্গো, টি-শার্ট, হুডি খুঁজুন...",
  "INSTANT APP SEARCH": "তাৎক্ষণিক অনুসন্ধান",
  "YOUR SHOPPING CONTAINER": "আপনার শপিং কার্ট",
  "CURATED BAG": "কার্ট ব্যাগ",
  "YOUR BAG IS EMPTY": "আপনার শপিং ব্যাগ আপাতত খালি আছে",
  "Begin exploring our modern trending streetwear to add pieces here.": "আমাদের ট্রেন্ডিং স্ট্রিটওয়্যার কালেকশন ঘুরে কার্টে পণ্য যোগ করুন।",
  "ORDER SUMMARY VALUES": "অর্ডার সামারি",
  "SUBTOTAL ESTIMATE": "উপ-মোট হিসাব",
  "COURIER DELIVERY": "কুরিয়ার ডেলিভারি",
  "FREE DELIVERY": "ফ্রি ডেলিভারি",
  "DISCOUNT ALLOCATION": "ছাড়ের হিসাব",
  "GRAND TOTAL": "সর্বমোট বিল",
  "PROCEED TO CHECKOUT SECURELY": "নিরাপদ চেকআউট করুন",
  "ENTER PROMOCODE": "প্রোমোকোড দিন",
  "APPLY": "প্রয়োগ করুন",

  // Footer & Notices
  "Exclusive trending fashion and premium streetwear curated for the modern wardrobe. Featuring relaxed baggy cuts, 260 GSM combed cottons, and architectural cargo utility. Operations centered in বাংলাদেশ, চাঁদপুর ৩৬৫০, ফরিদগঞ্জ.": "আধুনিক তরুণদের জন্য বিশেষভাবে কিউরেট করা প্রিমিয়াম স্ট্রিটওয়্যার ও ফ্যাশন। আমাদের মূল ফোকাস ব্যাগি ফিটিং, ২৬০ জিএসএম কম্বড কটন এবং হেভিওয়েট কার্গো প্যান্ট। মূল কার্যালয় বাংলাদেশ, চাঁদপুর ৩৬৫০, ফরিদগঞ্জ।",
  "PATOWARY MAILING CLUB": "পাটোয়ারী স্পেশাল ড্রপস",
  "Subscribe to receive secret drop alerts, restock notifications, and exclusive VIP promos.": "নতুন কালেকশন ড্রপ এবং ভিআইপি ডিসকাউন্ট পেতে সাবস্ক্রাইব করুন।",
  "ALL RIGHTS RESERVED.": "সর্বস্বত্ব সংরক্ষিত।",
  "AUTHENTIC QUALITY GUARANTEED": "১০০% প্রিমিয়াম ও অরিজিনাল কোয়ালিটি",

  // Categories
  "Baggy & Cargo Pants": "ব্যাগি ও কার্গো প্যান্ট",
  "Oversized Tees & Polos": "ওভারসাইজড টি-শার্ট ও পোলো",
  "Hoodies & Sweatshirts": "হুডি ও সোয়েটশার্ট",
  "Women's Streetwear": "মহিলাদের ফ্যাশন",
  "Accessories & Lifestyle": "এক্সেসরিজ ও লাইফস্টাইল",
  "All Products": "সকল প্রোডাক্ট",
  "SHOW ONLY SAVED GARMENTS": "শুধু সংরক্ষিত পোশাক দেখুন",
  "PATOWARY CATALOG": "পাটোয়ারী ফ্যাশন ক্যাটালগ",
  "RESULTS FOR:": "অনুসন্ধান ফলাফল:",

  // Home Page Elements
  "NEW SEASON DROPS": "নতুন সিজন ড্রপস",
  "TRENDING STREETWEAR": "ট্রেন্ডিং স্ট্রিটওয়্যার কালেকশন",
  "Explore contemporary silhouettes, boxy cuts, and tailored baggy cargos.": "ব্যাগি সিলুয়েট, বক্সি ড্র্যাপ এবং হেভিওয়েট কার্গো কালেকশন দেখুন।",
  "FEATURED DROPS": "বিশেষ ড্রপস",
  "SHOP ALL FITS": "সবগুলো দেখুন",
  "WHAT OUR CLIENTS SAY": "গ্রাহকদের চমৎকার মতামত",
  "Read real, unfiltered testimonials regarding fabric weight and tailored baggy drape.": "কাপড়ের জিএসএম, ফিটিং ও ফিনিশিং নিয়ে গ্রাহকদের অভিজ্ঞতা পড়ুন।",

  // Product Details Page
  "SELECT SIZE / VARIANT": "আপনার সাইজ সিলেক্ট করুন",
  "BUY NOW (DIRECT CHECKOUT)": "এখনই কিনুন (সরাসরি চেকআউট)",
  "ADD TO BAG": "ব্যাগে যোগ করুন",
  "SAVED TO WISHLIST": "উইশলিস্টেড",
  "SAVE TO WISHLIST": "পছন্দের তালিকায় রাখুন",
  "ESTIMATED DELIVERY TIMELINE": "ডেলিভারি সংক্রান্ত তথ্যাবলী",
  "Inside Dhaka Premises": "ঢাকার ভেতরে ডেলিভারি",
  "1-2 business days. Flat BDT 80 inside primary zones.": "১-২ কার্যদিবস। ডেলিভারি চার্জ ৮০ টাকা মাত্র।",
  "Outside Dhaka Premises": "ঢাকার বাইরে ডেলিভারি",
  "3-4 business days. Flat BDT 150 across Bangladesh.": "৩-৪ কার্যদিবস। ডেলিভারি চার্জ ১৫০ টাকা মাত্র।",
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
  "ORDER IDENTIFIER": "অর্ডার আইডি",
  "CUSTOMER ALLOCATION": "গ্রাহকের নাম",
  "TOTAL PRICE VALUE": "মোট বিলের পরিমাণ",
  "CURRENT DISPATCH STATE": "বর্তমান অর্ডার স্ট্যাটাস",
  "DELIVERY SHIPPING ADDRESS": "ডেলিভারি ঠিকানা",
  "TIMELINE HISTORY OF PHASE ACTIONS": "ডেলিভারি ট্র্যাকিং হিস্ট্রি",
  "VERIFICATION": "অর্ডার যাচাইকরণ",
  "DISPATCH IN TRANSIT": "কুরিয়ারে পাঠানো হয়েছে",
  "DELIVERY COMPLETED": "অর্ডার বুঝিয়ে দেওয়া হয়েছে",

  // Checkout Page
  "SECURE ORDER CHECKOUT STAGE": "নিরাপদ অর্ডার চেকআউট",
  "RE-VALIDATING YOUR SELECT ARTIFACTS": "আপনার নির্বাচিত পোশাক সমূহ যাচাই করুন",
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
  "PLACE SECURE ORDER (CASH ON DELIVERY)": "অর্ডারটি কনফার্ম করুন (ক্যাশ অন ডেলিভারি)",

  // Profile Page
  "CLIENT PROFILE RECORD": "গ্রাহক প্রোফাইল রেকর্ড",
  "Total Orders Executed": "মোট অর্ডারের সংখ্যা",
  "Total Funds Contributed": "মোট কেনাকাটার পরিমাণ",
  "Verified VIP Tier Status": "ভেরিফাইড ভিআইপি মেম্বার",
  "RECENT ACCOUNT TRANSACTIONS LISTING": "আপনার সাম্প্রতিক অর্ডার ক্যাটালগ",
  "NO RECENT CONSIGNMENT RECORDS": "কোন সাম্প্রতিক অর্ডার রেকর্ড নেই",
  "LOGOUT SESSION": "লগআউট সেশন",
  "MEMBER EXCLUSIVE LOGIN": "মেম্বার এক্সক্লুসিভ সিকিউর সাইন-ইন",
  "EMAIL ADDRESS": "ইমেইল এড্রেস",
  "TEMPORARY PASS CODE": "পাসওয়ার্ড",
  "SUBMIT TO ACCESS ENVIRONMENT": "সাইন ইন করুন"
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem("patowary_locale");
    return (saved === "en" || saved === "bn") ? saved : "en";
  });

  const toggleLanguage = () => {
    setLocaleState((prev) => {
      const next = prev === "en" ? "bn" : "en";
      localStorage.setItem("patowary_locale", next);
      return next;
    });
  };

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("patowary_locale", l);
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
      // If locale is English, and it has a slash with Bengali, return the English part
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
