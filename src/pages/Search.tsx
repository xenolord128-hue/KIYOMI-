import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { RAW_PRODUCTS } from '../data/products';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { db } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { 
  Search as SearchIcon, 
  Heart, 
  ArrowLeft,
  X, 
  TrendingUp, 
  ShoppingBag,
  Star
} from 'lucide-react';
import { playCinematicIntroSound } from '../utils/voiceUtils';
import { useLanguage } from '../contexts/LanguageContext';
import { Product } from '../types';

export const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { t } = useLanguage();

  const [dbProducts, setDbProducts] = useState<Product[]>(() => {
    const cached = localStorage.getItem('patowary_local_products');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
    return RAW_PRODUCTS;
  });

  const [searchInput, setSearchInput] = useState(searchParams.get('q') || searchParams.get('search') || '');

  // Firestore Sync
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), (snapshot) => {
      if (!snapshot.empty) {
        const prodArr: Product[] = [];
        snapshot.forEach((doc) => {
          prodArr.push(doc.data() as Product);
        });
        prodArr.sort((a, b) => a.id - b.id);
        setDbProducts(prodArr);
        localStorage.setItem('patowary_local_products', JSON.stringify(prodArr));
      } else {
        setDbProducts(RAW_PRODUCTS);
      }
    }, () => {});
    return () => unsub();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!searchInput.trim()) return dbProducts;
    const q = searchInput.trim().toUpperCase();
    return dbProducts.filter((product) => {
      return product.title.toUpperCase().includes(q) ||
             product.category.toUpperCase().includes(q) ||
             product.description.toUpperCase().includes(q);
    });
  }, [dbProducts, searchInput]);

  const trendingTags = ['Baggy Cargo', 'Wide-Leg Denim', '260 GSM Oversized', 'Heavyweight Hoodie', 'Linen Shirt', 'Tactical Sling'];

  const selectTag = (tag: string) => {
    setSearchInput(tag);
  };

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultVariant = product.variants[0] || 'Standard';
    addToCart(product, defaultVariant, 1);
    playCinematicIntroSound(`${product.title} added to bag`);
  };

  return (
    <div id="search-page-stage" className="min-h-screen bg-[#F8F3EA] text-[#111827] py-10 md:py-16 font-sans text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-xs font-mono tracking-wider text-[#0A1E54] uppercase font-bold hover:text-[#1A3070] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {t("Back to Home", "হোম পেজে ফিরুন")}
          </Link>
        </div>

        {/* Header Title Section */}
        <div className="border-b border-[#0A1E54]/10 pb-5 mb-8">
          <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#C9A66B] uppercase block">
            PATOWARY FASHION SEARCH
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#0A1E54] uppercase mt-1">
            {t("Search & Discover Fits", "পছন্দের ফ্যাশন খুঁজুন")}
          </h1>
        </div>

        {/* Search Input Bar */}
        <div className="relative mb-6 glass-panel rounded-2xl overflow-hidden flex items-center border border-white shadow-sm focus-within:border-[#0A1E54] transition-all">
          <div className="pl-5 shrink-0">
            <SearchIcon className="w-5 h-5 text-stone-400" />
          </div>
          <input 
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t("SEARCH BAGGY CARGO, 260 GSM TEES, HOODIES, ACCESSORIES...", "ব্যাগি কার্গো, টি-শার্ট, হুডি খুঁজুন...")}
            className="w-full bg-transparent px-4 py-4 text-xs sm:text-sm font-sans focus:outline-none placeholder-stone-400 font-medium text-stone-900"
          />
          {searchInput && (
            <button 
              onClick={() => setSearchInput('')}
              className="pr-5 text-stone-400 hover:text-stone-700 p-2 cursor-pointer transition-all"
              aria-label="Clear Search Input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Trending Keywords */}
        <div className="flex flex-wrap items-center gap-2 mb-8 font-mono text-xs">
          <span className="text-stone-500 uppercase tracking-wider flex items-center gap-1.5 font-bold mr-1">
            <TrendingUp className="w-4 h-4 text-[#C9A66B]" /> {t("POPULAR SEARCHES:", "জনপ্রিয় অনুসন্ধান:")}
          </span>
          {trendingTags.map((tag) => (
            <button
              key={tag}
              onClick={() => selectTag(tag)}
              className={`px-3 py-1.5 rounded-xl border text-xs transition-all cursor-pointer ${
                searchInput.toUpperCase() === tag.toUpperCase()
                  ? 'bg-[#0A1E54] text-white border-[#0A1E54] font-bold shadow-xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Results Counter */}
        <div className="flex justify-between items-center text-xs font-mono border-b border-stone-200 pb-3 mb-6">
          <span className="text-stone-500 uppercase tracking-wider">{t("SEARCH RESULTS", "ফলাফল")}</span>
          <span className="text-[#0A1E54] font-bold tracking-wider">{filteredProducts.length} {t("PRODUCTS FOUND", "পণ্য পাওয়া গেছে")}</span>
        </div>

        {/* Product Results Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-md border border-white rounded-3xl p-16 text-center space-y-4 max-w-md mx-auto shadow-sm">
            <h3 className="text-base font-bold text-[#0A1E54]">
              {t("No matches found", "কোনো ফলাফল পাওয়া যায়নি")}
            </h3>
            <p className="text-xs text-stone-500">
              {t("Try checking for typos or searching with broader keywords like 'Pants' or 'Tee'.", "অন্য কোনো শব্দ দিয়ে পুনরায় অনুসন্ধান করুন।")}
            </p>
            <button
              onClick={() => setSearchInput('')}
              className="px-6 py-2.5 bg-[#0A1E54] text-white text-xs font-bold uppercase rounded-xl"
            >
              {t("Clear Search", "ক্লিয়ার করুন")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => {
              const isWish = isInWishlist(product.id);

              return (
                <div
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group cursor-pointer border border-white hover:border-[#C9A66B]/50 shadow-xs hover:shadow-md transition-all"
                >
                  <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden">
                    <img
                      src={product.assets[0]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-white/80 backdrop-blur-md text-[#0A1E54] text-[9px] font-mono uppercase font-bold">
                      {product.category.split(' ')[0]}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/80 hover:bg-white text-stone-700 shadow-xs cursor-pointer"
                    >
                      <Heart className={`w-4 h-4 ${isWish ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                    {product.reviews && product.reviews.length > 0 && (
                      <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-semibold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-[#C9A66B] text-[#C9A66B]" />
                        <span>{(product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-[#111827] line-clamp-2 group-hover:text-[#0A1E54] transition-colors">
                        {product.title}
                      </h3>
                    </div>

                    <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-stone-500 block uppercase font-mono">{t("Price", "মূল্য")}</span>
                        <span className="text-sm sm:text-base font-bold text-[#0A1E54] font-mono">
                          ৳ {product.price.toLocaleString()}
                        </span>
                      </div>

                      <button
                        onClick={(e) => handleQuickAdd(product, e)}
                        className="p-2 sm:px-3 sm:py-2 bg-[#0A1E54] hover:bg-[#1A3070] text-white rounded-xl flex items-center gap-1.5 text-xs font-semibold shadow-xs cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{t("Add", "ব্যাগ")}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
